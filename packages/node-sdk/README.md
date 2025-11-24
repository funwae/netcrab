# @netcrab/node

Server-side SDK for NetCrab. Captures backend events like errors, timeouts, and API response times.

## Installation

```bash
npm install @netcrab/node
```

## Usage

```javascript
import { NetCrab } from '@netcrab/node';

const netcrab = new NetCrab({
  orgId: 'your-org-id',
  productId: 'your-product-id',
  agentUrl: 'https://agent.yourcompany.local'
});

// Track API errors
netcrab.trackError({
  errorCode: '500',
  route: '/api/users',
  latencyMs: 1200
});
```

