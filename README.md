## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` file with the following env variables:

```bash
  API_PORT: number;
  WEAVIATE_VERSION: string;
  WEAVIATE_API_KEY: string;
  WEAVIATE_HTTP_HOST: string;
  WEAVIATE_HTTP_PORT: number;
  WEAVIATE_GRPC_HOST: string;
  WEAVIATE_GRPC_PORT: number;
  WEAVIATE_API_USE_SECURE: boolean;
  VECTOR_DB_CHUNK_SIZE: number;
  VECTOR_DB_CHUNK_OVERLAP: number;
```

3. Run docker compose to create Weaviate Vector DB instance:

```bash
docker-compose up -d
```

4. Run the following scripts:

```bash
npm run db-create-collections # Create vector DB collections.
npm run db-import-documents # Import document to vector DB.
```

5. Run development server:

```bash
pnpm run dev
```
