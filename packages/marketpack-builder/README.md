# NetCrab Market Pack Builder

Service that aggregates anonymized data into marketplace packs.

## Features

- Scheduled aggregation jobs (daily/weekly)
- Pack definition system (YAML/JSON config-driven)
- Privacy enforcement (minOrgs, minSessions)
- Pack versioning system
- Support for multiple pack types:
  - UX Benchmark Packs
  - Task-flow Archetype Packs
  - Release Delta Packs
  - Insight Report Packs

## Configuration

```bash
export PACK_DEFINITIONS_PATH=./pack-definitions
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

## Pack Definitions

Pack definitions are stored as YAML files in `pack-definitions/`:

```yaml
packId: ux_friction_b2b_crm_v1
kind: ux_benchmarks
title: "B2B CRM UX Friction Benchmarks v1"
vertical: "B2B_CRM"
table: mp_ux_friction_daily
updateFrequency: daily
minOrgs: 20
minSessions: 10000
```

## Scheduled Jobs

- **Daily packs**: 02:00 UTC (UX benchmarks, task flows)
- **Weekly packs**: Mondays 03:00 UTC (insight reports)

## Manual Rebuild

The scheduler can be used programmatically to rebuild specific packs:

```typescript
await scheduler.rebuildPack('ux_friction_b2b_crm_v1', fromDate, toDate);
```
