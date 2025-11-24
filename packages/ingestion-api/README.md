# NetCrab Ingestion API

Stateless cloud service that accepts event batches from authenticated NetCrab Agents and publishes them to the event bus.

## Features

- Authenticates Agents via API key + mTLS
- Validates event schema
- Publishes to event bus (Kafka/Redpanda/NATS)
- OpenAPI documentation

## Endpoints

- `POST /v1/events` - Accept event batch from Agent
- `GET /health` - Health check

## Environment Variables

- `AGENT_API_KEY` - API key for agent authentication
- `EVENT_BUS_URL` - Kafka/Redpanda connection string
- `PORT` - Server port (default: 3000)

