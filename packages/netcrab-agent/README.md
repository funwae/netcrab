# NetCrab Agent

On-premises collector service that receives events from SDKs, applies scrubbing/hashing policies, and forwards batches to the cloud ingestion API.

## Features

- HTTP/gRPC event receiver
- Configurable scrubbing and hashing
- Batch and compress events
- Forward to Cloud Ingestion API
- Local status UI at `http://agent.local:7000`

## Deployment

### Docker

```bash
docker run -d \
  -p 7000:7000 \
  -v ./config:/app/config \
  netcrab/agent:latest
```

### Configuration

See `config/agent.config.json` for:
- Domain/app allowlist
- Path patterns to ignore
- PII scrubbing rules
- Sampling rates

