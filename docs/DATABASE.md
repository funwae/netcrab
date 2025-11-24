# Database Schema Reference

> **Status:** To be detailed during implementation

This document will contain the complete database schema reference, including:

## ClickHouse Tables

- `events_raw` - Raw event storage
- `fact_sessions` - Session-level metrics
- `fact_screen_hotspots` - Screen-level aggregates
- `mp_ux_friction_daily` - Market pack tables (cross-org)

See [Event Schema & Storage](./04-event-schema-and-storage.md) for initial schema definitions.

## Postgres Tables

- Customer/org configuration
- Pack definitions and metadata
- Revenue share accounting
- User authentication and authorization

---

*Complete schema definitions, indexes, and migration scripts will be added during implementation.*

