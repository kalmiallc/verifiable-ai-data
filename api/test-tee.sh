#!/bin/bash

# Exit on error
set -e

# Cleanup any existing container and data
if docker container inspect verifiable-ai-data-test >/dev/null 2>&1; then
    echo "Stopping and removing existing container..."
    docker stop verifiable-ai-data-test >/dev/null 2>&1
    docker rm verifiable-ai-data-test
fi

# Clean up old Weaviate data
if [ -d "./data" ]; then
    echo "Cleaning up old Weaviate data..."
    rm -rf ./data
fi

# Build the image if it doesn't exist
if ! docker image inspect verifiable_ai_data:latest >/dev/null 2>&1; then
    echo "Building image..."
    ./build-tee.sh
fi

# Run the container and show logs immediately
echo "Starting container..."
docker run -d \
  --name verifiable-ai-data-test \
  -p 3000:3000 \
  -p 8501:8501 \
  --env-file .env \
  verifiable_ai_data:latest

echo "Container started. Showing logs:"
docker logs -f verifiable-ai-data-test 