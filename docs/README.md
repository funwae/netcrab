# NetCrab Documentation

Welcome to the NetCrab documentation. This directory contains the complete product specification and implementation plan.

## Documentation Index

### Core Specifications

- **[00 - Product Vision](./00-product-vision.md)** - Product concept, tagline, mascot, and core idea
- **[01 - Personas & Use Cases](./01-personas-and-use-cases.md)** - User personas and primary use cases
- **[02 - Data Collection & Privacy](./02-data-collection-and-privacy.md)** - Event types, scrubbing, hashing, and governance
- **[03 - Architecture Overview](./03-architecture-overview.md)** - System architecture and components
- **[04 - Event Schema & Storage](./04-event-schema-and-storage.md)** - ClickHouse database schemas
- **[05 - Analytics & ML](./05-analytics-and-ml.md)** - Heuristic detectors, scoring algorithms, and ML models
- **[06 - Data Products & Marketplace](./06-data-products-and-marketplace.md)** - Pack types, buyer/seller value, packaging
- **[07 - Dashboard UX Spec](./07-dashboard-ux-spec.md)** - NetCrab Console user experience design
- **[08 - Landing Page Spec](./08-landing-page-netcrab.net.md)** - Marketing site structure and content
- **[09 - Implementation Plan](./09-implementation-plan.md)** - Phased delivery roadmap (Phase 0-3)
- **[10 - Brand & Logo Notes](./10-brand-and-logo-notes.md)** - Brand identity and visual guidelines

### Supporting Documentation

- **[API](./API.md)** - API contract specifications
- **[DATABASE](./DATABASE.md)** - Complete database schema reference

### Phase 3 - Marketplace

- **[11 - Pack Lifecycle & Builder](./11-pack-lifecycle-and-builder.md)** - Pack definitions, aggregation logic, versioning
- **[12 - Revenue Share & Billing](./12-revenue-share-and-billing.md)** - Revenue calculation, Stripe integration, payouts
- **[13 - Buyer Purchase Flow](./13-buyer-purchase-flow-and-pricing.md)** - Pricing models, purchase flow, downloads
- **[14 - Pack Metadata & Discovery](./14-pack-metadata-and-discovery.md)** - Pack catalog, samples, discovery
- **[15 - Buyer Auth & Quotas](./15-buyer-auth-keys-and-quotas.md)** - API keys, usage limits, authentication
- **[16 - Marketplace UI Spec](./16-marketplace-ui-spec.md)** - Seller and buyer UI specifications

## Quick Start

1. Start with [Product Vision](./00-product-vision.md) to understand what NetCrab does
2. Review [Architecture Overview](./03-architecture-overview.md) for system design
3. Check [Implementation Plan](./09-implementation-plan.md) for development phases
4. Reference [Event Schema & Storage](./04-event-schema-and-storage.md) for data models

## Product Summary

NetCrab scuttles through your network, scoops up "junk" behavior data, and sells it back as clean, ethical product intelligence. It collects behavioral exhaust (clicks, scrolls, focus changes), analyzes it for frustration and efficiency signals, feeds insights back to product owners, and optionally aggregates anonymized patterns into sellable data packs.

