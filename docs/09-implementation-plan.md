# Phased Delivery

## Phase 0 – Foundations (2–3 weeks)

* Define schemas (done in this spec).

* Finalize tech choices:

  * TS/Node, Fastify/NestJS, Next.js, ClickHouse, Kafka or NATS.

* Implement:

  * `@netcrab/web` SDK (basic click/nav events).

  * NetCrab Agent (Docker, HTTP ingest, forward to cloud).

## Phase 1 – Internal Analytics MVP (4–6 weeks)

* Cloud Ingestion API + Event Bus.

* Minimal processing:

  * `sessionizer`, `incident-detector`, `metrics-aggregator`.

* ClickHouse tables: `events_raw`, `fact_sessions`, `fact_screen_hotspots`.

* Console UI:

  * Overview with friction/efficiency.

  * Hotspots table.

  * Simple flow visualization.

No marketplace yet, but shape the data as if packs will exist.

## Phase 2 – Advanced Insights (4–6 weeks)

* Implement ML clustering & LLM "Crab Notes."

* Add `Crab Notes` page in dashboard.

* Add segmenting & release/version comparisons.

## Phase 3 – Marketplace Alpha (6–8 weeks)

### 3.1 Pack Builder Service
* Implement `marketpack-builder` service with scheduled aggregation jobs
* Pack definition system (YAML/JSON config-driven)
* Aggregation logic for all pack types (UX benchmarks, task flows, release deltas, insight reports)
* Privacy enforcement (minOrgs, minSessions, differential privacy)
* Pack versioning system (immutable versions with major/minor bumps)

### 3.2 Database Schema
* Create marketplace tables:
  * `marketplace_packs` - Pack metadata
  * `marketplace_pack_revenue` - Revenue tracking per pack/month
  * `marketplace_org_contrib` - Org contributions to packs
  * `marketplace_org_payouts` - Payout records
  * `org_billing_profiles` - Stripe integration
  * `buyer_api_keys` - API key management
  * `buyer_usage_counters` - Quota tracking
  * `dim_task_types` - Task type mapping
  * `org_settings` - Org vertical and settings
* Extend ClickHouse with pack tables: `mp_task_flows`, `mp_release_deltas`, etc.

### 3.3 Revenue Share & Billing
* Monthly payout job (cron: 5th of month)
* Revenue calculation: platform fee (30%), org share distribution
* Stripe Connect integration for seller payouts
* Stripe Checkout for buyer payments
* Monthly statement generation (JSON/PDF/CSV)
* API: `GET /v1/marketplace/statements`

### 3.4 Marketplace API
* `GET /v1/packs` - List available packs (with filters)
* `GET /v1/packs/{packId}` - Pack detail with schema, samples, charts
* `GET /v1/packs/{packId}/data` - Query pack data (with quotas)
* `GET /v1/packs/{packId}/download` - Download snapshots (CSV/Parquet)
* `POST /v1/marketplace/api-keys` - Create API key
* `GET /v1/marketplace/api-keys` - List API keys
* `DELETE /v1/marketplace/api-keys/{id}` - Revoke API key
* Quota enforcement middleware

### 3.5 Buyer Purchase Flow
* Stripe Checkout integration
* Subscription management (Standard/Pro/Enterprise tiers)
* Post-purchase: API key generation, download access
* License terms display

### 3.6 Marketplace UI
* **Seller View** (`/app/marketplace/seller`):
  * Contributions panel with revenue estimates
  * Opt-in/opt-out toggles per pack category
  * Payouts & statements page
  * Stripe Connect OAuth flow
* **Buyer View** (`/marketplace` public, `/app/marketplace/buyer` authed):
  * Catalog page with pack cards and filters
  * Pack detail page with samples, charts, pricing
  * Purchase flow with Stripe Checkout
  * My Packs page with downloads, API keys, usage quotas

### 3.7 Authentication & Authorization
* Buyer org creation and management
* API key authentication for pack data access
* Role-based access (seller_admin, buyer_admin, buyer_viewer)
* Usage quota tracking and enforcement

