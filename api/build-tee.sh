#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

if [ -z "$GOOGLE_CLOUD_API_KEY" ]; then
    echo "Error: GOOGLE_CLOUD_API_KEY is not set in .env"
    exit 1
fi

if [ -z "$WEAVIATE_API_KEY" ]; then
    echo "Error: WEAVIATE_API_KEY is not set in .env"
    exit 1
fi

# Set default image name if not provided
if [ -z "$TEE_IMAGE_REFERENCE" ]; then
    TEE_IMAGE_REFERENCE="ghcr.io/kalmiallc/verifiable_ai_data:latest"
fi

# Build the TEE-compatible image
echo "Building image: ${TEE_IMAGE_REFERENCE}"
docker build \
    -t ${TEE_IMAGE_REFERENCE} \
    -f Dockerfile.tee .

echo "✅ Image built successfully: ${TEE_IMAGE_REFERENCE}"


# Push the image to GitHub Container Registry
echo "Pushing image to GitHub Container Registry..."
docker push ${TEE_IMAGE_REFERENCE}
echo "✅ Image pushed successfully"
