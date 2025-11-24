# NetCrab Application API

GraphQL or REST API for dashboard UI and marketplace.

## Endpoints

### Dashboard

- `GET /v1/dashboard/overview` - Aggregated metrics
- `GET /v1/hotspots` - Frustration hotspots
- `GET /v1/flows` - Task flow discovery
- `GET /v1/crab-notes` - AI-generated insights

### Marketplace

- `GET /v1/packs` - List available data packs
- `GET /v1/packs/{pack_id}` - Pack details
- `GET /v1/packs/{pack_id}/query` - Query pack data
- `POST /v1/packs/{pack_id}/purchase` - Purchase pack

## Authentication

JWT/OAuth for dashboard access, API keys for marketplace buyers.

