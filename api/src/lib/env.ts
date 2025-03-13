import * as dotenv from 'dotenv';

/**
 * Environment object interface.
 */
export interface IEnv {
  API_PORT: number;

  WEAVIATE_API_KEY: string;
  WEAVIATE_HTTP_HOST: string;
  WEAVIATE_HTTP_PORT: number;
  WEAVIATE_GRPC_HOST: string;
  WEAVIATE_GRPC_PORT: number;
  WEAVIATE_API_USE_SECURE: boolean;

  VECTOR_DB_CHUNK_SIZE: number;
  VECTOR_DB_CHUNK_OVERLAP: number;

  GOOGLE_CLOUD_API_KEY: string;
}

/**
 * Load variables from .env.
 */
dotenv.config();

export const env: IEnv = {
  /**
   * API settings.
   */
  API_PORT: Number(process.env['API_PORT'] || 4444),

  /**
   * Weaviate settings.
   */
  WEAVIATE_API_KEY: process.env['WEAVIATE_API_KEY'] || '',
  WEAVIATE_HTTP_HOST: process.env['WEAVIATE_HTTP_HOST'] || 'localhost',
  WEAVIATE_HTTP_PORT: Number(process.env['WEAVIATE_HTTP_PORT'] || 8080),
  WEAVIATE_GRPC_HOST: process.env['WEAVIATE_GRPC_HOST'] || 'localhost',
  WEAVIATE_GRPC_PORT: Number(process.env['WEAVIATE_GRPC_PORT'] || 50051),
  WEAVIATE_API_USE_SECURE:
    (process.env.WEAVIATE_API_USE_SECURE || '') === 'true',

  /**
   * Vector DB settings.
   */
  VECTOR_DB_CHUNK_SIZE: Number(process.env.VECTOR_DB_CHUNK_SIZE || 4000),
  VECTOR_DB_CHUNK_OVERLAP: Number(process.env.VECTOR_DB_CHUNK_OVERLAP || 1000),

  GOOGLE_CLOUD_API_KEY: process.env['GOOGLE_CLOUD_API_KEY'] || '',
};
