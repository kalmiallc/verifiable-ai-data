/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validator for Confidential Space Virtual TPM (vTPM) tokens.
 *
 * This module provides functionality to validate tokens issued by the Confidential Space
 * attestation service. It supports both PKI-based and OIDC-based validation schemes.
 */

import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

// Constants
const ALGO = 'RS256';
// We keep the hash algorithm name as a reference, even though it's not directly used in the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CERT_HASH_ALGO = 'sha256';
const CERT_COUNT = 3;
const CERT_FINGERPRINT = 'B9:51:20:74:2C:24:E3:AA:34:04:2E:1C:3B:A3:AA:D2:8B:21:23:21';

/**
 * Custom exception for validation errors.
 */
export class VtpmValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VtpmValidationError';
  }
}

/**
 * Raised when certificate chain validation fails.
 */
export class InvalidCertificateChainError extends VtpmValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCertificateChainError';
  }
}

/**
 * Raised when certificate parsing fails.
 */
export class CertificateParsingError extends VtpmValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'CertificateParsingError';
  }
}

/**
 * Raised when signature validation fails.
 */
export class SignatureValidationError extends VtpmValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'SignatureValidationError';
  }
}

/**
 * JWT header interface
 */
interface JWTHeader {
  alg: string;
  kid?: string;
  x5c?: string[];
  [key: string]: unknown;
}

/**
 * Immutable container for the complete certificate chain.
 */
interface PKICertificates {
  leafCert: crypto.X509Certificate;
  intermediateCert: crypto.X509Certificate;
  rootCert: crypto.X509Certificate;
}

/**
 * JSON Web Key Set type
 */
interface JSONWebKeySet {
  keys: Array<{
    kty: string;
    kid: string;
    use: string;
    alg: string;
    n: string;
    e: string;
    [key: string]: unknown;
  }>;
}

/**
 * JWK type
 */
interface JWK {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
  [key: string]: unknown;
}

/**
 * OpenID Configuration type
 */
interface OpenIDConfiguration {
  jwks_uri: string;
  [key: string]: unknown;
}

/**
 * Validates Confidential Space vTPM tokens through PKI or OIDC schemes.
 */
export class VtpmValidation {
  private expectedIssuer: string;
  private oidcEndpoint: string;
  private pkiEndpoint: string;

  /**
   * Creates a new vTPM token validator.
   * 
   * @param expectedIssuer - Base URL of the token issuer
   * @param oidcEndpoint - Path to OpenID Connect configuration
   * @param pkiEndpoint - Path to root certificate
   */
  constructor(
    expectedIssuer: string = 'https://confidentialcomputing.googleapis.com',
    oidcEndpoint: string = '/.well-known/openid-configuration',
    pkiEndpoint: string = '/.well-known/confidential_space_root.crt'
  ) {
    this.expectedIssuer = expectedIssuer;
    this.oidcEndpoint = oidcEndpoint;
    this.pkiEndpoint = pkiEndpoint;
    console.debug('[vtpm_validation] Initialized');
  }

  /**
   * Validates a vTPM token and returns its claims if valid.
   *
   * The method automatically detects whether to use PKI or OIDC validation based on
   * the presence of x5c certificates in the token header.
   *
   * @param token - The JWT token string to validate
   * @returns The validated token claims
   * @throws VtpmValidationError if token validation fails for any reason
   */
  public async validateToken(token: string): Promise<Record<string, unknown>> {
    const unverifiedHeader = this.getUnverifiedHeader(token);
    console.debug('[vtpm_validation] Token header', unverifiedHeader);

    if (unverifiedHeader.alg !== ALGO) {
      throw new VtpmValidationError(
        `Invalid algorithm: got ${unverifiedHeader.alg}, expected ${ALGO}`
      );
    }

    if (unverifiedHeader.x5c) {
      // if x5c certs in header, token uses pki scheme
      console.debug('[vtpm_validation] PKI token', { alg: unverifiedHeader.alg });
      return this.decodeAndValidatePki(token, unverifiedHeader);
    }
    
    // token uses oidc scheme
    console.debug('[vtpm_validation] OIDC token', { alg: unverifiedHeader.alg });
    return this.decodeAndValidateOidc(token, unverifiedHeader);
  }

  /**
   * Get the unverified header from a JWT token
   * 
   * @param token - The JWT token string
   * @returns The decoded header
   */
  private getUnverifiedHeader(token: string): JWTHeader {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new VtpmValidationError('Invalid token format');
    }
    
    try {
      const headerJson = Buffer.from(parts[0], 'base64').toString('utf8');
      return JSON.parse(headerJson) as JWTHeader;
    } catch (error) {
      throw new VtpmValidationError(`Failed to parse token header: ${error}`);
    }
  }

  /**
   * Validates a token using OIDC JWKS-based validation.
   *
   * @param token - The JWT token string
   * @param unverifiedHeader - Pre-parsed token header
   * @returns Validated token claims if successful
   */
  private async decodeAndValidateOidc(token: string, unverifiedHeader: JWTHeader): Promise<Record<string, unknown>> {
    console.debug('[vtpm_validation] Starting OIDC validation');
    
    const wellKnownConfig = await this.getWellKnownFile(this.expectedIssuer, this.oidcEndpoint) as OpenIDConfiguration;
    console.debug('[vtpm_validation] Fetched well-known config:', wellKnownConfig);
    
    const jwksUri = wellKnownConfig.jwks_uri;
    console.debug('[vtpm_validation] JWKS URI:', jwksUri);

    const jwks = await this.fetchJwks(jwksUri);
    console.debug('[vtpm_validation] Fetched JWKS:', jwks);
    
    let rsaKey: string | null = null;
    let matchedJwk: JWK | null = null;

    // Find the correct key based on the key ID (kid) in header
    for (const key of jwks.keys) {
      if (key.kid === unverifiedHeader.kid) {
        console.debug('[vtpm_validation] Kid match', { kid: key.kid });
        matchedJwk = key;
        rsaKey = this.jwkToPublicKey(key);
        console.debug('[vtpm_validation] Generated PEM key:', rsaKey);
        break;
      }
    }

    if (!rsaKey || !matchedJwk) {
      throw new VtpmValidationError('Unable to find appropriate key id (kid) in header');
    }

    // Try multiple verification approaches
    const errors: Error[] = [];

    // Approach 1: Standard verification
    try {
      console.debug('[vtpm_validation] Verifying token with standard approach');
      const verified = jwt.verify(token, rsaKey, { algorithms: [ALGO] }) as Record<string, unknown>;
      console.debug('[vtpm_validation] Token verified successfully with standard approach');
      return verified;
    } catch (error) {
      console.error('[vtpm_validation] Standard verification failed:', error);
      errors.push(error as Error);
      
      // Approach 2: Try with a different key format
      try {
        console.debug('[vtpm_validation] Trying alternative key format');
        // Create a certificate-like format
        const certKey = `-----BEGIN PUBLIC KEY-----\n${Buffer.from(JSON.stringify(matchedJwk)).toString('base64')}\n-----END PUBLIC KEY-----`;
        const verified = jwt.verify(token, certKey, { algorithms: [ALGO] }) as Record<string, unknown>;
        console.debug('[vtpm_validation] Token verified successfully with alternative approach');
        return verified;
      } catch (error2) {
        console.error('[vtpm_validation] Alternative verification failed:', error2);
        errors.push(error2 as Error);
        
        // Approach 3: Try decoding without verification (last resort)
        try {
          console.debug('[vtpm_validation] Attempting to decode without verification (for debugging)');
          const decoded = jwt.decode(token, { complete: true });
          console.debug('[vtpm_validation] Token decoded (without verification):', decoded);
          
          // Still throw the original error since we couldn't properly verify
          if (errors[0] instanceof jwt.TokenExpiredError) {
            throw new SignatureValidationError('Token has expired');
          } else if (errors[0] instanceof jwt.JsonWebTokenError) {
            throw new VtpmValidationError(`Token is invalid: ${errors[0].message}`);
          } else {
            throw new VtpmValidationError(`Unexpected error during validation: ${errors[0].message}`);
          }
        } catch (error3) {
          console.error('[vtpm_validation] Even decoding failed:', error3);
          throw new VtpmValidationError(`Failed to verify or decode token: ${errors.map(e => e.message).join(', ')}`);
        }
      }
    }
  }

  /**
   * Validates a token using PKI-based validation.
   *
   * @param token - The JWT token string
   * @param unverifiedHeader - Pre-parsed token header containing x5c certificates
   * @returns Validated token claims if successful
   */
  private async decodeAndValidatePki(token: string, unverifiedHeader: JWTHeader): Promise<Record<string, unknown>> {
    const rootCertPem = await this.getWellKnownFile(this.expectedIssuer, this.pkiEndpoint, true);
    const rootCert = new crypto.X509Certificate(rootCertPem as string);
    
    // Verify root certificate fingerprint
    const fingerprint = rootCert.fingerprint.toUpperCase();
    if (fingerprint !== CERT_FINGERPRINT) {
      throw new VtpmValidationError(
        `Root certificate fingerprint does not match expected fingerprint. ` +
        `Expected: ${CERT_FINGERPRINT}, Received: ${fingerprint}`
      );
    }

    try {
      const certs = this.extractAndValidateCertificates(unverifiedHeader);
      this.validateLeafCertificate(certs.leafCert);
      this.compareRootCertificates(certs.rootCert, rootCert);
      this.checkCertificateValidity(certs);
      this.verifyCertificateChain(certs);

      // Use the leaf certificate's public key to verify the token
      const publicKey = certs.leafCert.publicKey;
      return jwt.verify(token, publicKey, { algorithms: [ALGO] }) as Record<string, unknown>;
    } catch (error) {
      if (error instanceof VtpmValidationError) {
        throw error;
      }
      throw new VtpmValidationError(`Unexpected error during validation: ${error}`);
    }
  }

  /**
   * Fetch configuration data from a well-known endpoint.
   *
   * @param expectedIssuer - Base URL of the token issuer
   * @param wellKnownPath - Path to the well-known endpoint
   * @param rawResponse - Whether to return the raw response body
   * @returns The response data from the well-known endpoint
   */
  private async getWellKnownFile(
    expectedIssuer: string, 
    wellKnownPath: string,
    rawResponse: boolean = false
  ): Promise<Record<string, unknown> | string> {
    try {
      const response = await axios.get(expectedIssuer + wellKnownPath, {
        timeout: 10000,
        responseType: rawResponse ? 'text' : 'json'
      });
      
      if (response.status === 200) {
        return response.data as any;
      }
      
      throw new Error(`Failed to fetch well known file: ${response.status}`);
    } catch (error) {
      throw new VtpmValidationError(`Failed to fetch well known file: ${error}`);
    }
  }

  /**
   * Fetch JSON Web Key Set (JWKS) from a remote endpoint.
   *
   * @param uri - Full URL of the JWKS endpoint
   * @returns Parsed JWKS data containing public keys
   */
  private async fetchJwks(uri: string): Promise<JSONWebKeySet> {
    try {
      const response = await axios.get(uri, { timeout: 10000 });
      
      if (response.status === 200) {
        return response.data as JSONWebKeySet;
      }
      
      throw new Error(`Failed to fetch JWKS: ${response.status}`);
    } catch (error) {
      throw new VtpmValidationError(`Failed to fetch JWKS: ${error}`);
    }
  }

  /**
   * Convert a JSON Web Key (JWK) to a PEM public key.
   *
   * @param jwk - Dictionary containing the JWK parameters
   * @returns PEM-encoded public key
   */
  private jwkToPublicKey(jwk: JWK): string {
    try {
      // Create a public key from the JWK directly
      const key = crypto.createPublicKey({
        key: jwk as any,
        format: 'jwk'
      });
      
      // Export the key in PEM format
      return key.export({ format: 'pem', type: 'spki' }).toString();
    } catch (error) {
      console.error('[vtpm_validation] Error converting JWK to public key using direct method:', error);
      
      // Fallback: Try manual conversion
      try {
        console.debug('[vtpm_validation] Attempting fallback JWK conversion');
        
        // Ensure n and e are properly padded for base64 decoding
        const padBase64 = (str: string) => {
          const padding = '='.repeat((4 - str.length % 4) % 4);
          return str.replace(/-/g, '+').replace(/_/g, '/') + padding;
        };
        
        // Construct RSA components manually
        const modulus = Buffer.from(padBase64(jwk.n), 'base64');
        const exponent = Buffer.from(padBase64(jwk.e), 'base64');
        
        // Create a node-rsa key
        const keyObject = crypto.createPublicKey({
          key: {
            kty: 'RSA',
            n: modulus.toString('base64'),
            e: exponent.toString('base64')
          },
          format: 'jwk'
        });
        
        const pemKey = keyObject.export({ type: 'spki', format: 'pem' }).toString();
        console.debug('[vtpm_validation] Fallback conversion successful');
        return pemKey;
      } catch (fallbackError) {
        console.error('[vtpm_validation] Fallback conversion also failed:', fallbackError);
        throw new VtpmValidationError(`Failed to convert JWK to public key: ${error}. Fallback also failed: ${fallbackError}`);
      }
    }
  }

  /**
   * Extract and validate the certificate chain from the token header.
   *
   * @param headers - Token header dictionary with x5c field
   * @returns Container with the decoded certificate chain
   */
  private extractAndValidateCertificates(headers: JWTHeader): PKICertificates {
    const x5cHeaders = headers.x5c;

    if (!x5cHeaders || x5cHeaders.length !== CERT_COUNT) {
      throw new VtpmValidationError('Invalid x5c certificates in header');
    }

    try {
      const certs = x5cHeaders.map((cert: string) => this.decodeDerCertificate(cert));
      return {
        leafCert: certs[0],
        intermediateCert: certs[1],
        rootCert: certs[2]
      };
    } catch (error) {
      throw new CertificateParsingError(`Failed to parse certificates: ${error}`);
    }
  }

  /**
   * Decode and parse a DER-encoded certificate from base64 string.
   *
   * @param certStr - Base64-encoded certificate string
   * @returns Parsed X.509 certificate object
   */
  private decodeDerCertificate(certStr: string): crypto.X509Certificate {
    try {
      // Clean the certificate string (remove PEM headers/footers and whitespace)
      const cleanedCert = certStr.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s+/g, '');
      
      // Decode the base64 string to get the DER-encoded certificate
      const certDer = Buffer.from(cleanedCert, 'base64');
      
      // Create an X509Certificate from the DER-encoded certificate
      return new crypto.X509Certificate(certDer);
    } catch (error) {
      throw new CertificateParsingError(`Failed to decode certificate: ${error}`);
    }
  }

  /**
   * Validates the leaf certificate's algorithm and key type.
   *
   * @param leafCert - The leaf certificate to validate
   */
  private validateLeafCertificate(leafCert: crypto.X509Certificate): void {
    // In Node.js, we don't have direct access to the signature algorithm
    // This is a simplified check that would need to be expanded in a real implementation
    if (!leafCert.publicKey) {
      throw new SignatureValidationError('No public key found in leaf certificate');
    }
    
    // Check if the public key is an RSA key
    try {
      const keyObj = crypto.createPublicKey(leafCert.publicKey);
      const keyDetails = keyObj.export({ format: 'jwk' }) as { kty: string };
      
      if (keyDetails.kty !== 'RSA') {
        throw new SignatureValidationError('Leaf certificate must use RSA public key');
      }
    } catch (error) {
      throw new SignatureValidationError(`Invalid leaf certificate: ${error}`);
    }
  }

  /**
   * Compares token root certificate with stored root certificate.
   *
   * @param tokenRootCert - Root certificate from the token
   * @param rootCert - Trusted root certificate
   */
  private compareRootCertificates(
    tokenRootCert: crypto.X509Certificate, 
    rootCert: crypto.X509Certificate
  ): void {
    try {
      // Compare the certificates by their fingerprints
      if (tokenRootCert.fingerprint !== rootCert.fingerprint) {
        throw new VtpmValidationError('Root certificate fingerprint mismatch');
      }
    } catch (error) {
      throw new VtpmValidationError(`Invalid certificate format: ${error}`);
    }
  }

  /**
   * Verify the trust chain of certificates.
   *
   * @param certificates - PKICertificates object containing the certificate chain
   */
  private verifyCertificateChain(certificates: PKICertificates): void {
    // In Node.js, certificate chain verification is more complex
    // This is a simplified implementation that would need to be expanded
    try {
      // Check if the leaf certificate is issued by the intermediate certificate
      if (!this.isIssuedBy(certificates.leafCert, certificates.intermediateCert)) {
        throw new InvalidCertificateChainError('Leaf certificate not issued by intermediate certificate');
      }
      
      // Check if the intermediate certificate is issued by the root certificate
      if (!this.isIssuedBy(certificates.intermediateCert, certificates.rootCert)) {
        throw new InvalidCertificateChainError('Intermediate certificate not issued by root certificate');
      }
      
      // Check if the root certificate is self-signed
      if (!this.isIssuedBy(certificates.rootCert, certificates.rootCert)) {
        throw new InvalidCertificateChainError('Root certificate is not self-signed');
      }
    } catch (error) {
      if (error instanceof InvalidCertificateChainError) {
        throw error;
      }
      throw new InvalidCertificateChainError(`Certificate chain verification failed: ${error}`);
    }
  }

  /**
   * Check if a certificate is issued by another certificate.
   *
   * @param cert - The certificate to check
   * @param issuer - The potential issuer certificate
   * @returns True if cert is issued by issuer, false otherwise
   */
  private isIssuedBy(cert: crypto.X509Certificate, issuer: crypto.X509Certificate): boolean {
    // This is a simplified check that would need to be expanded in a real implementation
    return cert.issuer === issuer.subject && cert.verify(issuer.publicKey);
  }

  /**
   * Check the validity period of all certificates in the chain.
   *
   * @param certificates - PKICertificates object containing the certificate chain
   */
  private checkCertificateValidity(certificates: PKICertificates): void {
    const currentTime = new Date();

    const certsToCheck = [
      { name: 'Leaf', cert: certificates.leafCert },
      { name: 'Intermediate', cert: certificates.intermediateCert },
      { name: 'Root', cert: certificates.rootCert }
    ];

    for (const { name, cert } of certsToCheck) {
      if (!this.isCertificateValid(cert, currentTime)) {
        throw new InvalidCertificateChainError(`${name} certificate is not valid`);
      }
    }
  }

  /**
   * Check if a certificate is valid at a specific time.
   *
   * @param cert - X.509 certificate to validate
   * @param currentTime - Timestamp to check validity against
   * @returns True if the certificate is valid at the specified time, false otherwise
   */
  private isCertificateValid(cert: crypto.X509Certificate, currentTime: Date): boolean {
    const notBefore = new Date(cert.validFrom);
    const notAfter = new Date(cert.validTo);
    return notBefore <= currentTime && currentTime <= notAfter;
  }

  /**
   * Decode a token without verification for debugging purposes.
   * This method does not verify the token signature and should only be used for debugging.
   * 
   * @param token - The JWT token string to decode
   * @returns The decoded token header and payload
   */
  public decodeTokenForDebug(token: string): { header: JWTHeader; payload: Record<string, unknown> } {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded) {
        throw new VtpmValidationError('Failed to decode token');
      }
      
      return {
        header: decoded.header as JWTHeader,
        payload: decoded.payload as Record<string, unknown>
      };
    } catch (error) {
      throw new VtpmValidationError(`Failed to decode token: ${error}`);
    }
  }
} 