# Phase 1 - Internal Analytics MVP - Complete ✅

## Summary

Phase 1 has been successfully completed. The core analytics pipeline is now operational, from event ingestion through to insights API endpoints.

## Completed Components

### 1. Cloud Ingestion API ✅

**Location:** `packages/ingestion-api/`

- ✅ `POST /v1/events/batch` endpoint
- ✅ Event validation and authentication
- ✅ Kafka/Redpanda event bus integration
- ✅ Error handling and batch response format

### 2. Event Bus Integration ✅

- ✅ KafkaJS client for Kafka/Redpanda
- ✅ Topic: `events.raw` for incoming events
- ✅ Partitioning by `orgId:productId`
- ✅ Health check support

### 3. Stream Processing Services ✅

**Location:** `packages/stream-processors/`

#### Sessionizer
- ✅ Groups events into sessions
- ✅ Calculates session metrics (duration, clicks, screens, etc.)
- ✅ **Frustration score** calculation (sigmoid-based)
- ✅ **Efficiency score** calculation (sigmoid-based)
- ✅ Publishes to `events.sessionized` topic

#### Incident Detector
- ✅ Rage click detection (3+ clicks in 1-2 seconds)
- ✅ Backtrack detection (A → B → A pattern)
- ✅ Abandoned task detection (15 minute timeout)
- ✅ Publishes to `events.incidents` topic

#### Metrics Aggregator
- ✅ Consumes sessionized events
- ✅ Writes to ClickHouse `fact_sessions` table
- ✅ Batch processing with error handling

### 4. ClickHouse Database ✅

**Location:** `scripts/clickhouse-init.sql`

**Tables:**
- ✅ `events_raw` - Raw event storage
- ✅ `fact_sessions` - Session-level metrics
- ✅ `fact_screen_hotspots` - Screen-level aggregates
- ✅ `mp_ux_friction_daily` - Market pack table (for Phase 3)

### 5. Insights API (App API) ✅

**Location:** `packages/app-api/`

**Endpoints:**
- ✅ `GET /v1/insights/overview` - Overview metrics with top hotspots and note of the day
- ✅ `GET /v1/insights/hotspots` - Friction hotspots list
- ✅ `GET /v1/flows/top` - Discovered task flows

**Features:**
- ✅ ClickHouse query integration
- ✅ Response format matches API contract
- ✅ Error handling and validation
- ✅ Placeholder for LLM "Crab Notes" (Phase 2)

## Architecture Flow

```
Browser → SDK → Agent → Ingestion API → Kafka (events.raw)
                                              ↓
                                    Sessionizer → Kafka (events.sessionized)
                                              ↓
                                    Incident Detector → Kafka (events.incidents)
                                              ↓
                                    Metrics Aggregator → ClickHouse
                                              ↓
                                    Insights API → Dashboard
```

## API Endpoints

### Ingestion API (Port 3000)
- `POST /v1/events/batch` - Accept event batches from agents
- `GET /health` - Health check

### App API (Port 4000)
- `GET /v1/insights/overview?orgId=X&productId=Y&from=DATE&to=DATE`
- `GET /v1/insights/hotspots?orgId=X&productId=Y&from=DATE&to=DATE&limit=N`
- `GET /v1/flows/top?orgId=X&productId=Y&from=DATE&to=DATE&limit=N`
- `GET /health` - Health check

## Testing Phase 1

### 1. Start Infrastructure

```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```

This starts:
- ClickHouse on ports 8123, 9000
- PostgreSQL on port 5432
- Redpanda on ports 18081, 18082, 19092
- Redpanda Console on port 8080

### 2. Initialize ClickHouse

```bash
clickhouse-client < scripts/clickhouse-init.sql
```

### 3. Start Ingestion API

```bash
cd packages/ingestion-api
export PORT=3000
export KAFKA_BROKERS=localhost:19092
export API_KEYS=test-key-123
pnpm install
pnpm dev
```

### 4. Start Stream Processors

```bash
cd packages/stream-processors
export KAFKA_BROKERS=localhost:19092
export CLICKHOUSE_URL=http://localhost:8123
export SERVICE=all
pnpm install
pnpm dev
```

### 5. Start App API

```bash
cd packages/app-api
export PORT=4000
export CLICKHOUSE_URL=http://localhost:8123
pnpm install
pnpm dev
```

### 6. Test Endpoints

```bash
# Health check
curl http://localhost:4000/health

# Overview (requires data in ClickHouse)
curl "http://localhost:4000/v1/insights/overview?orgId=acme&productId=crm-web&from=2025-01-01&to=2025-01-31"

# Hotspots
curl "http://localhost:4000/v1/insights/hotspots?orgId=acme&productId=crm-web&from=2025-01-01&to=2025-01-31"

# Flows
curl "http://localhost:4000/v1/flows/top?orgId=acme&productId=crm-web&from=2025-01-01&to=2025-01-31"
```

## Next Steps (Phase 2)

Phase 2 will add:
- ML clustering for session patterns
- LLM-powered "Crab Notes" generation
- Enhanced flow discovery algorithms
- Segmenting and release/version comparisons
- Dashboard UI (Next.js)

## Status

✅ **Phase 1 Complete** - Ready to proceed to Phase 2

All core analytics infrastructure is in place. Events flow from SDK → Agent → Ingestion API → Event Bus → Stream Processors → ClickHouse → Insights API.

