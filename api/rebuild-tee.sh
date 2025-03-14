#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Build the TEE container
echo "Building TEE container..."
docker build -t verifiable-ai-data-tee -f Dockerfile.tee .

# Tag the container
echo "Tagging container..."
docker tag verifiable-ai-data-tee gcr.io/verifiable-ai-hackathon/verifiable-ai-data-tee:latest

# Push to Google Container Registry
echo "Pushing to GCR..."
docker push gcr.io/verifiable-ai-hackathon/verifiable-ai-data-tee:latest

# Update the TEE image reference
export TEE_IMAGE_REFERENCE="gcr.io/verifiable-ai-hackathon/verifiable-ai-data-tee:latest"

echo "Container rebuilt and pushed to GCR."
echo "TEE_IMAGE_REFERENCE: $TEE_IMAGE_REFERENCE"
echo ""
echo "To redeploy the instance, run the gcloud command from the README.md with the updated TEE_IMAGE_REFERENCE." 