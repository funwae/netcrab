#!/bin/bash
# Start all NetCrab services for local development

set -e

echo "🦀 Starting NetCrab services..."

# Start infrastructure
echo "Starting infrastructure (ClickHouse, Redpanda)..."
docker-compose -f infrastructure/docker-compose.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Initialize ClickHouse
echo "Initializing ClickHouse schemas..."
docker exec -i netcrab-clickhouse clickhouse-client < scripts/clickhouse-init.sql 2>&1 | grep -v "already exists" || true
docker exec -i netcrab-clickhouse clickhouse-client < scripts/marketplace-schema.sql 2>&1 | grep -v "already exists" || true
docker exec -i netcrab-clickhouse clickhouse-client < scripts/pack-definitions-init.sql 2>&1 | grep -v "already exists" || true

echo "✅ Infrastructure ready!"

# Start services in background
echo "Starting backend services..."

# Ingestion API (port 3000)
cd packages/ingestion-api
export PORT=3000
export KAFKA_BROKERS=localhost:19092
export API_KEYS=test-key-123
pnpm install > /dev/null 2>&1
pnpm dev > /tmp/netcrab-ingestion.log 2>&1 &
INGESTION_PID=$!
cd ../..

# App API (port 4000)
cd packages/app-api
export PORT=4000
export CLICKHOUSE_URL=http://localhost:8123
pnpm install > /dev/null 2>&1
pnpm dev > /tmp/netcrab-app-api.log 2>&1 &
APP_API_PID=$!
cd ../..

# Marketplace API (port 5000)
cd packages/marketplace-api
export PORT=5000
export CLICKHOUSE_URL=http://localhost:8123
export STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-sk_test_placeholder}
pnpm install > /dev/null 2>&1
pnpm dev > /tmp/netcrab-marketplace-api.log 2>&1 &
MARKETPLACE_PID=$!
cd ../..

# Billing Service (port 6000 + webhook 6001 + internal 6002)
cd packages/billing-service
export STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-sk_test_placeholder}
export STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-whsec_placeholder}
export CLICKHOUSE_URL=http://localhost:8123
export WEBHOOK_PORT=6001
export INTERNAL_API_PORT=6002
pnpm install > /dev/null 2>&1
pnpm dev > /tmp/netcrab-billing.log 2>&1 &
BILLING_PID=$!
cd ../..

# Stream Processors
cd packages/stream-processors
export KAFKA_BROKERS=localhost:19092
export CLICKHOUSE_URL=http://localhost:8123
export SERVICE=all
pnpm install > /dev/null 2>&1
pnpm dev > /tmp/netcrab-stream-processors.log 2>&1 &
STREAM_PID=$!
cd ../..

# Pack Builder (optional - runs on schedule)
cd packages/marketpack-builder
export CLICKHOUSE_URL=http://localhost:8123
export PACK_DEFINITIONS_PATH=./pack-definitions
pnpm install > /dev/null 2>&1
pnpm dev > /tmp/netcrab-pack-builder.log 2>&1 &
PACK_BUILDER_PID=$!
cd ../..

echo ""
echo "✅ All services started!"
echo ""
echo "Services:"
echo "  - Ingestion API:     http://localhost:3000 (PID: $INGESTION_PID)"
echo "  - App API:           http://localhost:4000 (PID: $APP_API_PID)"
echo "  - Marketplace API:   http://localhost:5000 (PID: $MARKETPLACE_PID)"
echo "  - Billing Service:   http://localhost:6000 (PID: $BILLING_PID)"
echo "  - Stream Processors: running (PID: $STREAM_PID)"
echo "  - Pack Builder:      running (PID: $PACK_BUILDER_PID)"
echo ""
echo "Frontend:"
echo "  - Console:           cd packages/console && pnpm dev"
echo "  - Marketing:         cd packages/marketing && pnpm dev"
echo ""
echo "Logs:"
echo "  - Ingestion:         tail -f /tmp/netcrab-ingestion.log"
echo "  - App API:           tail -f /tmp/netcrab-app-api.log"
echo "  - Marketplace:       tail -f /tmp/netcrab-marketplace-api.log"
echo "  - Billing:           tail -f /tmp/netcrab-billing.log"
echo ""
echo "To stop all services:"
echo "  kill $INGESTION_PID $APP_API_PID $MARKETPLACE_PID $BILLING_PID $STREAM_PID $PACK_BUILDER_PID"
echo "  docker-compose -f infrastructure/docker-compose.yml down"

