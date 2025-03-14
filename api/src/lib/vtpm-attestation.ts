/**
 * Client for communicating with the Confidential Space vTPM attestation service.
 *
 * This module provides a client to request attestation tokens from a local Unix domain
 * socket endpoint. It implements token request functionality with nonce validation.
 */

import * as http from 'http';
import * as net from 'net';

/**
 * Exception raised for attestation service communication errors.
 *
 * This includes invalid nonce values, connection failures, and
 * unexpected responses from the attestation service.
 */
export class VtpmAttestationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VtpmAttestationError';
  }
}

/**
 * Client for requesting attestation tokens via Unix domain socket.
 */
export class Vtpm {
  private url: string;
  private unixSocketPath: string;

  /**
   * Creates a new vTPM attestation client.
   * 
   * @param url - The URL endpoint for token requests
   * @param unixSocketPath - Path to the Unix domain socket
   * @param simulate - Whether to return simulated tokens instead of real ones
   */
  constructor(
    url: string = 'http://localhost/v1/token',
    unixSocketPath: string = '/run/container_launcher/teeserver.sock',
    simulate: boolean = false
  ) {
    this.url = url;
    this.unixSocketPath = unixSocketPath;
    console.debug(`[vtpm] Initialized with: simulate=${simulate}, url=${url}, unixSocketPath=${unixSocketPath}`);
  }

  /**
   * Validate the byte length of provided nonces.
   *
   * Each nonce must be between 10 and 74 bytes when UTF-8 encoded.
   *
   * @param nonces - List of nonce strings to validate
   * @throws VtpmAttestationError if any nonce is outside the valid length range
   */
  private _checkNonceLength(nonces: string[]): void {
    const minByteLen = 10;
    const maxByteLen = 74;
    
    for (const nonce of nonces) {
      const byteLen = Buffer.from(nonce, 'utf8').length;
      console.debug(`[vtpm] Nonce length: ${byteLen} bytes`);
      
      if (byteLen < minByteLen || byteLen > maxByteLen) {
        const msg = `Nonce '${nonce}' must be between ${minByteLen} bytes and ${maxByteLen} bytes`;
        throw new VtpmAttestationError(msg);
      }
    }
  }

  /**
   * Request an attestation token from the service.
   *
   * Requests a token with specified nonces for replay protection,
   * targeted at the specified audience. Supports both OIDC and PKI
   * token types.
   *
   * @param nonces - List of random nonce strings for replay protection
   * @param audience - Intended audience for the token
   * @param tokenType - Type of token, either "OIDC" or "PKI"
   * @returns The attestation token in JWT format
   * @throws VtpmAttestationError if token request fails for any reason
   */
  public async getToken(
    nonces: string[],
    audience: string = 'https://sts.google.com',
    tokenType: 'OIDC' | 'PKI' = 'OIDC'
  ): Promise<string> {
    this._checkNonceLength(nonces);
    
    return new Promise<string>((resolve, reject) => {
      // Connect to the Unix socket
      const socket = net.createConnection(this.unixSocketPath);
      
      socket.on('error', (error) => {
        reject(new VtpmAttestationError(`Socket connection error: ${error.message}`));
      });

      socket.on('connect', () => {
        console.debug('[vtpm] Connected to Unix socket');
        
        // Prepare the request
        const body = JSON.stringify({
          audience,
          token_type: tokenType,
          nonces
        });

        const options: http.RequestOptions = {
          socketPath: this.unixSocketPath,
          path: this.url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          }
        };

        // Send the HTTP request
        const req = http.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            const successStatus = 200;
            if (res.statusCode !== successStatus) {
              reject(new VtpmAttestationError(
                `Failed to get attestation response: ${res.statusCode} ${res.statusMessage}`
              ));
              return;
            }
            
            console.debug(`[vtpm] Received token of type ${tokenType}`);
            resolve(data);
          });
        });

        req.on('error', (error) => {
          reject(new VtpmAttestationError(`Request error: ${error.message}`));
        });

        // Send the request body
        req.write(body);
        req.end();
      });
    });
  }
} 