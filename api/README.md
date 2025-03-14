# Verifiable AI data API

## Getting Started

1. Install dependencies:

```bash
npm install
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
npm run db-create-collections
npm run db-import-documents
```

5. Run development server:

```bash
npm run dev
```

## Deploy on gcloud

```
gcloud compute instances create $INSTANCE_NAME \
  --project=verifiable-ai-hackathon \
  --zone=us-east5-b \
  --machine-type=n2d-standard-2 \
  --network-interface=network-tier=PREMIUM,nic-type=GVNIC,stack-type=IPV4_ONLY,subnet=default \
  --metadata=tee-image-reference=$TEE_IMAGE_REFERENCE,\
tee-container-log-redirect=true,\
tee-env-GOOGLE_CLOUD_API_KEY=$GOOGLE_CLOUD_API_KEY,\
tee-env-WEAVIATE_API_KEY=$WEAVIATE_API_KEY,\
tee-env-WEAVIATE_HTTP_HOST=$WEAVIATE_HTTP_HOST,\
tee-env-WEAVIATE_GRPC_HOST=$WEAVIATE_GRPC_HOST,\
tee-env-FE_PRIVATE_KEY=$FE_PRIVATE_KEY,\
  --maintenance-policy=MIGRATE \
  --provisioning-model=STANDARD \
  --service-account=confidential-sa@verifiable-ai-hackathon.iam.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/cloud-platform \
  --min-cpu-platform="AMD Milan" \
  --tags=flare-ai,http-server,https-server \
  --create-disk=auto-delete=yes,\
boot=yes,\
device-name=$INSTANCE_NAME,\
image=projects/confidential-space-images/global/images/confidential-space-debug-250100,\
mode=rw,\
size=11,\
type=pd-standard \
  --shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --reservation-affinity=any \
  --confidential-compute-type=SEV
```

