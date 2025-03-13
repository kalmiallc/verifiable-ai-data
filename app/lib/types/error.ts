export enum UserError {
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  JWT_TOKEN_EXPIRED = 'jwt expired',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  USER_INVALID_LOGIN = 'USER_INVALID_LOGIN',
  USER_DOES_NOT_EXISTS = 'USER_DOES_NOT_EXISTS',
  USER_IS_NOT_AUTHENTICATED = 'USER_IS_NOT_AUTHENTICATED',
}

/**
 * Unauthorized error codes - 401000.
 */
export enum UnauthorizedErrorCodes {
  UNAUTHORIZED = 40100000,
  INVALID_TOKEN = 40100001,
  INVALID_SIGNATURE = 40100002,
  WALLET_SIGNATURE_ALREADY_USED = 40002700,
  INVALID_WALLET_SIGNATURE = 40002701,
  USER_IS_NOT_AUTHENTICATED = 401021000,
}

declare global {
  interface EntityErrorMessageInterface {
    message: string;
    property: string;
    code?: number;
    statusCode: number;
  }

  interface ApiError {
    errors?: Array<EntityErrorMessageInterface>;
    code?: number;
    status?: number;
    message?: string;
    path?: string;
    timestamp?: string;
  }
}
