#!/bin/bash
# scripts/release.sh — Promote NutriHelp from staging to production
set -e

APP_VERSION=${APP_VERSION:-"1.0.0"}
IMAGE_NAME="nutrihelp-api"
PROD_PORT=${PROD_PORT:-80}

echo "🏁 Releasing NutriHelp v${APP_VERSION} to production..."

# Tag image as stable
docker tag "${IMAGE_NAME}:${APP_VERSION}" "${IMAGE_NAME}:stable"
docker tag "${IMAGE_NAME}:${APP_VERSION}" "${IMAGE_NAME}:release-${APP_VERSION}"

echo "Docker tags applied:"
docker images | grep "${IMAGE_NAME}"

# Stop staging, start production
docker-compose down || true
APP_VERSION=${APP_VERSION} docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for production health check..."
for i in $(seq 1 12); do
    if curl -sf "http://localhost:${PROD_PORT}/health" > /dev/null 2>&1; then
        echo "✅ Production deployment successful!"
        echo ""
        echo "  API:        http://localhost:${PROD_PORT}"
        echo "  Health:     http://localhost:${PROD_PORT}/health"
        echo "  Metrics:    http://localhost:${PROD_PORT}/metrics"
        echo "  Prometheus: http://localhost:9090"
        echo "  Grafana:    http://localhost:3001"
        exit 0
    fi
    echo "  Attempt ${i}/12..."
    sleep 5
done

echo "❌ Production health check failed"
docker-compose -f docker-compose.prod.yml logs
exit 1
