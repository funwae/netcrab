# NetCrab

> NetCrab scuttles through your network, scoops up "junk" behavior data, and sells it back as clean, ethical product intelligence.

NetCrab collects behavioral exhaust (clicks, scrolls, focus changes, rage-clicks) from intranet products, analyzes it for frustration and efficiency signals, feeds insights back to product owners, and optionally aggregates anonymized patterns into sellable data packs.

## Project Structure

```
netcrab/
├── docs/                    # Complete product specification
├── packages/
│   ├── web-sdk/            # @netcrab/web - Browser JavaScript SDK
│   ├── electron-sdk/       # @netcrab/electron - Desktop wrapper
│   ├── node-sdk/           # @netcrab/node - Server-side SDK (optional)
│   ├── netcrab-agent/      # On-prem collector service (Docker)
│   ├── ingestion-api/      # Cloud ingestion endpoints
│   ├── stream-processors/  # Sessionizer, incident-detector, etc.
│   ├── ai-services/        # ML clustering, LLM "Crab Notes"
│   ├── app-api/            # GraphQL/REST API for dashboards
│   ├── console/            # Customer SaaS dashboard (Next.js)
│   └── marketing/          # Marketing site (Next.js static)
├── infrastructure/
│   ├── docker/             # Dockerfiles for services
│   ├── k8s/                # Kubernetes manifests (future)
│   └── docker-compose.yml  # Local development environment
└── scripts/                # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose

### Local Development Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start infrastructure services:**

   ```bash
   docker-compose -f infrastructure/docker-compose.yml up -d
   ```

   This starts:
   - ClickHouse (analytics warehouse) on ports 8123, 9000
   - PostgreSQL (operational DB) on port 5432
   - Redpanda (event bus) on ports 18081, 18082, 19092
   - Redpanda Console (Kafka UI) on port 8080

3. **Run development servers:**

   ```bash
   pnpm dev
   ```

## Documentation

See [`docs/README.md`](./docs/README.md) for complete documentation index.

Key documents:
- [Product Vision](./docs/00-product-vision.md)
- [Architecture Overview](./docs/03-architecture-overview.md)
- [Implementation Plan](./docs/09-implementation-plan.md)

## Development Phases

- **Phase 0** (2-3 weeks): Foundations - SDK and Agent
- **Phase 1** (4-6 weeks): Internal Analytics MVP - Dashboard and basic insights
- **Phase 2** (4-6 weeks): Advanced Insights - ML clustering and LLM summaries
- **Phase 3** (6-8 weeks): Marketplace Alpha - Data packs and revenue sharing

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: TypeScript, Fastify/NestJS
- **Data**: ClickHouse, PostgreSQL, Redpanda/Kafka
- **ML/AI**: Python microservices, LLM APIs (OpenAI/Anthropic)
- **Infrastructure**: Docker, Kubernetes (future)

## License

[To be determined]

