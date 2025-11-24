# NetCrab Marketplace API

API service for marketplace buyers to browse, purchase, and access data packs.

## Features

- Pack listing and detail endpoints
- Pack data querying with quota enforcement
- Download snapshots (CSV/Parquet)
- API key management
- Usage tracking and quotas

## Endpoints

### Public

- `GET /v1/packs` - List available packs
- `GET /v1/packs/:packId` - Get pack detail

### Authenticated (API Key)

- `GET /v1/packs/:packId/data` - Query pack data
- `GET /v1/packs/:packId/download` - Download snapshot
- `POST /v1/marketplace/api-keys` - Create API key
- `GET /v1/marketplace/api-keys` - List API keys
- `DELETE /v1/marketplace/api-keys/:id` - Revoke API key
- `GET /v1/marketplace/usage` - Get usage/quota

## Configuration

```bash
export PORT=5000
export CLICKHOUSE_URL=http://localhost:8123
export CLICKHOUSE_USER=default
export CLICKHOUSE_PASSWORD=
```

## Usage

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## Authentication

API requests require `Authorization: Bearer <api_key>` header.

API keys are generated with format: `nc_live_<random>`

## Quotas

Tiers:
- **Standard**: 100k rows/month, 60 requests/minute
- **Pro**: 1M rows/month, 120 requests/minute
- **Enterprise**: 10M rows/month, 300 requests/minute
