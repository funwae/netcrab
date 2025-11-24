# Phase 0 - Foundations - Complete ✅

## Summary

Phase 0 has been successfully completed. The foundation for NetCrab is now in place with the Web SDK and Agent service implemented.

## What Was Built

### 1. @netcrab/web SDK

A complete browser JavaScript SDK for capturing behavioral events:

**Features:**
- ✅ Automatic event capture (clicks, scrolls, navigation, focus changes)
- ✅ PII protection (avoids password fields, textareas, `data-netcrab-ignore`)
- ✅ Client-side hashing for user IDs and element labels
- ✅ Session tracking with automatic session ID generation
- ✅ SPA navigation detection
- ✅ Event batching and efficient transmission
- ✅ Custom event and task tracking APIs

**Files Created:**
- `packages/web-sdk/src/index.ts` - Main SDK entry point
- `packages/web-sdk/src/event-capture.ts` - Event capture logic
- `packages/web-sdk/src/utils.ts` - Utility functions (hashing, device detection)
- `packages/web-sdk/src/types.ts` - TypeScript type definitions
- `packages/web-sdk/tsconfig.json` - TypeScript configuration
- `packages/web-sdk/tsup.config.ts` - Build configuration
- `packages/web-sdk/package.json` - Package configuration
- `packages/web-sdk/README.md` - Usage documentation
- `packages/web-sdk/example.html` - Example usage

### 2. NetCrab Agent

On-premises collector service that receives events from SDKs and forwards them to the cloud:

**Features:**
- ✅ HTTP server for receiving events from SDKs
- ✅ Event scrubbing and filtering (domain allowlist, path ignore patterns)
- ✅ Event batching with configurable batch size and flush interval
- ✅ Forwarding to cloud ingestion API
- ✅ Health check and status endpoints
- ✅ Statistics tracking
- ✅ Docker support

**Files Created:**
- `packages/netcrab-agent/src/index.ts` - Main entry point
- `packages/netcrab-agent/src/server.ts` - HTTP server implementation
- `packages/netcrab-agent/src/scrubber.ts` - Event scrubbing logic
- `packages/netcrab-agent/src/batcher.ts` - Event batching logic
- `packages/netcrab-agent/src/forwarder.ts` - Cloud forwarding logic
- `packages/netcrab-agent/src/types.ts` - TypeScript type definitions
- `packages/netcrab-agent/tsconfig.json` - TypeScript configuration
- `packages/netcrab-agent/tsup.config.ts` - Build configuration
- `packages/netcrab-agent/package.json` - Package configuration with dependencies
- `packages/netcrab-agent/Dockerfile` - Docker image definition
- `packages/netcrab-agent/.env.example` - Configuration example

## Architecture

```
Browser (SDK) → NetCrab Agent (On-Prem) → Cloud Ingestion API (Phase 1)
```

1. **SDK** captures events in the browser
2. **Agent** receives events via HTTP, scrubs/filters them, batches them
3. **Agent** forwards batches to cloud ingestion API (to be built in Phase 1)

## Next Steps (Phase 1)

Phase 1 will build:
- Cloud Ingestion API (receives events from agents)
- Event Bus (Kafka/Redpanda) for event streaming
- Stream processing services (sessionizer, incident-detector, metrics-aggregator)
- ClickHouse database setup
- Basic dashboard UI

## Testing Phase 0

### Test the Agent Locally

1. Set environment variables:
```bash
export PORT=7000
export CLOUD_INGESTION_URL=http://localhost:3000  # Placeholder for Phase 1
export API_KEY=test-key
export ORG_ID=test-org
```

2. Run the agent:
```bash
cd packages/netcrab-agent
pnpm install
pnpm dev
```

3. Test the health endpoint:
```bash
curl http://localhost:7000/health
```

### Test the SDK

1. Build the SDK:
```bash
cd packages/web-sdk
pnpm install
pnpm build
```

2. Use in a test HTML page (see `packages/web-sdk/example.html`)

## Configuration

### Agent Configuration

See `packages/netcrab-agent/.env.example` for all configuration options:

- `PORT` - Server port (default: 7000)
- `CLOUD_INGESTION_URL` - Cloud ingestion API URL
- `API_KEY` - Authentication key for cloud API
- `ORG_ID` - Organization ID
- `BATCH_SIZE` - Events per batch (default: 50)
- `FLUSH_INTERVAL` - Milliseconds between flushes (default: 5000)
- `ALLOWED_DOMAINS` - Comma-separated domain allowlist
- `IGNORED_PATHS` - Comma-separated paths to ignore
- `SAMPLE_RATE` - Event sampling rate 0-1 (default: 1.0)

### SDK Configuration

```typescript
initNetCrab({
  orgId: 'your-org-id',
  productId: 'your-product-id',
  agentUrl: 'http://localhost:7000',
  sampleRate: 1.0,    // optional
  enabled: true,      // optional
  debug: false        // optional
});
```

## Status

✅ **Phase 0 Complete** - Ready to proceed to Phase 1

