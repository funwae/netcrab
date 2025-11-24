# System Architecture

## High-Level Components

1. **Client SDKs**

   * `@netcrab/web` (JS/TS)

   * `@netcrab/electron`

   * Optional: server-side SDK (`@netcrab/node`) for backend events (errors, timeouts).

2. **NetCrab Agent (On-Prem)**

   * Deploy options:

     * Docker image (`netcrab/agent`).

     * Bare-metal binary.

   * Responsibilities:

     * Receive events from SDKs via HTTP/gRPC.

     * Apply scrubbing/hashing policies.

     * Batch & compress events.

     * Send batches to **Cloud Ingestion API**.

     * Provide a small local status UI at `http://agent.local:7000`.

3. **Cloud Ingestion API**

   * Stateless service (e.g. Fastify/NestJS in TypeScript).

   * Accepts event batches from authenticated Agents (API key + mTLS).

   * Publishes to the **Event Bus**.

4. **Event Bus**

   * Kafka / Redpanda / NATS JetStream.

   * Topics:

     * `events.raw`

     * `events.sessionized`

     * `events.incidents`

     * `events.analytics`

5. **Processing Services**

   * `sessionizer-service`

     * Groups events into sessions.

   * `incident-detector`

     * Detect rage-clicks, backtracks, abandoned tasks.

   * `metrics-aggregator`

     * Writes to analytics warehouse.

   * `marketpack-builder`

     * Builds aggregated cross-org datasets for sale.

6. **Data Stores**

   * **Raw Event Lake**: S3/MinIO (parquet, partitioned by `org_id/date`).

   * **Analytics Warehouse**: ClickHouse or BigQuery.

   * **Operational DB**: Postgres for config, customers, packs, revenue.

   * **Vector Store (optional)**: Qdrant/pgvector for embedding flows and incident clusters.

7. **API Gateway**

   * GraphQL or REST for:

     * Dashboard UI

     * Public marketplace

     * Buyer export API

8. **Frontends**

   * **Console / Dashboard**: Next.js app at `app.netcrab.net`.

   * **Marketing Site**: Next.js static site at `netcrab.net`.

   * **Marketplace (Buyer UI)**: part of `app.netcrab.net` with public read-only mode.

