# NetCrab Browser Testing Guide

## Current Status

### Services Running
- **Console Dashboard**: http://localhost:3001
- **Marketing Site**: http://localhost:3002 (if started)
- **App API**: http://localhost:4000 (needs to be started)
- **Marketplace API**: http://localhost:5000 (needs to be started)

### Docker Services
⚠️ **Docker permission issue detected** - Docker commands require sudo or user in docker group.

To fix:
```bash
sudo usermod -aG docker $USER
# Then log out and back in, or:
newgrp docker
```

Then start infrastructure:
```bash
cd /home/hayden/Desktop/netcrab
docker-compose -f infrastructure/docker-compose.yml up -d
```

## Manual Service Startup

Since Docker has permission issues, here's how to start services manually:

### 1. Start Infrastructure (requires Docker)
```bash
# Fix permissions first (see above), then:
cd /home/hayden/Desktop/netcrab
docker-compose -f infrastructure/docker-compose.yml up -d
```

### 2. Start Backend Services

**App API:**
```bash
cd packages/app-api
export PORT=4000
export CLICKHOUSE_URL=http://localhost:8123
pnpm dev
```

**Marketplace API:**
```bash
cd packages/marketplace-api
export PORT=5000
export CLICKHOUSE_URL=http://localhost:8123
export STRIPE_SECRET_KEY=sk_test_placeholder
pnpm dev
```

**Billing Service:**
```bash
cd packages/billing-service
export STRIPE_SECRET_KEY=sk_test_placeholder
export STRIPE_WEBHOOK_SECRET=whsec_placeholder
export CLICKHOUSE_URL=http://localhost:8123
export WEBHOOK_PORT=6001
export INTERNAL_API_PORT=6002
pnpm dev
```

### 3. Start Frontend Services

**Console:**
```bash
cd packages/console
PORT=3001 pnpm dev
```

**Marketing:**
```bash
cd packages/marketing
PORT=3002 pnpm dev
```

## Testing Checklist

### Console Dashboard (http://localhost:3001)

1. ✅ **Overview Page** (`/`)
   - Should show friction/efficiency metrics
   - Top hotspots
   - Crab Notes

2. ✅ **Hotspots** (`/hotspots`)
   - Table of high-friction screens

3. ✅ **Flows** (`/flows`)
   - Flow visualization

4. ✅ **Crab Notes** (`/crab-notes`)
   - AI-generated insights

5. ✅ **Marketplace Seller** (`/marketplace/seller`)
   - Contributions view
   - Revenue estimates

6. ✅ **My Packs** (`/marketplace/my-packs`)
   - Buyer's purchased packs
   - Usage tracking
   - API key management

7. ✅ **Opt-in** (`/marketplace/opt-in`)
   - Data sharing preferences
   - Per-product/pack toggles

8. ✅ **Payouts** (`/marketplace/payouts`)
   - Payout history
   - Stripe Connect button
   - Statement links

### Marketing Site (http://localhost:3002)

1. ✅ **Marketplace Catalog** (`/marketplace`)
   - Pack grid
   - Filters

2. ✅ **Pack Detail** (`/marketplace/[packId]`)
   - Pack information
   - Purchase button with tier selection

## Known Issues

1. **Docker Permission**: Need to add user to docker group
2. **Port Conflicts**: Port 3000 is in use by another app (SqueezeWeasel)
3. **Backend Services**: Need to be started manually until Docker is fixed

## Next Steps

1. Fix Docker permissions
2. Start all backend services
3. Test each page in browser
4. Check browser console for errors
5. Verify API calls in Network tab

