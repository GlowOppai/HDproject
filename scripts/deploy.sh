#!/bin/bash
# scripts/deploy.sh — Deploy NutriHelp to staging
set -e

APP_VERSION=${APP_VERSION:-"1.0.0"}
IMAGE_NAME="nutrihelp-api"
STAGING_PORT=${STAGING_PORT:-3000}

echo "🚀 Deploying NutriHelp v${APP_VERSION} to staging..."

# Remove old containers
docker stop nutrihelp-staging 2>/dev/null || true
docker rm   nutrihelp-staging 2>/dev/null || true

# Deploy
APP_VERSION=${APP_VERSION} docker-compose up -d

# Wait for health
echo "⏳ Waiting for health check..."
for i in $(seq 1 12); do
    if curl -sf "http://localhost:${STAGING_PORT}/health" > /dev/null 2>&1; then
        echo "✅ NutriHelp API is healthy!"
        curl -s "http://localhost:${STAGING_PORT}/health" | python3 -m json.tool
        exit 0
    fi
    echo "  Attempt ${i}/12..."
    sleep 5
done

echo "❌ Health check failed after 60 seconds"
docker logs nutrihelp-staging
exit 1
