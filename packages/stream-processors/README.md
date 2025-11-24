# NetCrab Stream Processors

Stream processing services that consume events from the event bus and generate analytics.

## Services

- **sessionizer-service**: Groups events into sessions
- **incident-detector**: Detects rage-clicks, backtracks, abandoned tasks
- **metrics-aggregator**: Writes aggregated metrics to ClickHouse
- **marketpack-builder**: Builds aggregated cross-org datasets for marketplace

## Event Bus Topics

- `events.raw` - Raw events from ingestion
- `events.sessionized` - Grouped session events
- `events.incidents` - Detected incidents (rage-clicks, etc.)
- `events.analytics` - Aggregated analytics ready for storage

