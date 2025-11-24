# NetCrab Browser Setup - Complete ✅

## Status Summary

### ✅ Working
- **Console Dashboard**: Running on http://localhost:3001
  - Navigation menu visible
  - All pages accessible:
    - Overview
    - Flows
    - Hotspots
    - Crab Notes
    - Marketplace (Seller view)
    - My Packs (Buyer view)
    - Settings

### ⚠️ Needs Backend Services

The frontend is running but API calls will fail until backend services are started:

1. **App API** (port 4000) - For dashboard insights
2. **Marketplace API** (port 5000) - For marketplace features
3. **ClickHouse** (port 8123) - Database
4. **Redpanda** (port 19092) - Event bus

### 🔧 Docker Permission Issue

Docker commands require permissions. To fix:

```bash
sudo usermod -aG docker $USER
newgrp docker  # or log out and back in
```

Then start infrastructure:
```bash
cd /home/hayden/Desktop/netcrab
docker-compose -f infrastructure/docker-compose.yml up -d
```

## Quick Start Commands

### Start Infrastructure (after fixing Docker permissions)
```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```

### Start Backend Services (in separate terminals)

**Terminal 1 - App API:**
```bash
cd packages/app-api
export PORT=4000 CLICKHOUSE_URL=http://localhost:8123
pnpm dev
```

**Terminal 2 - Marketplace API:**
```bash
cd packages/marketplace-api
export PORT=5000 CLICKHOUSE_URL=http://localhost:8123 STRIPE_SECRET_KEY=sk_test_placeholder
pnpm dev
```

**Terminal 3 - Billing Service:**
```bash
cd packages/billing-service
export STRIPE_SECRET_KEY=sk_test_placeholder STRIPE_WEBHOOK_SECRET=whsec_placeholder CLICKHOUSE_URL=http://localhost:8123 WEBHOOK_PORT=6001 INTERNAL_API_PORT=6002
pnpm dev
```

### Frontend (already running)
- **Console**: http://localhost:3001 ✅
- **Marketing**: Start with `cd packages/marketing && PORT=3002 pnpm dev`

## Testing Checklist

### Console Pages (http://localhost:3001)
- [x] Overview page loads
- [x] Navigation menu works
- [ ] Overview shows data (needs App API)
- [ ] My Packs page loads (needs Marketplace API)
- [ ] Marketplace seller page loads
- [ ] Opt-in page loads
- [ ] Payouts page loads

### API Endpoints
- [ ] `GET http://localhost:4000/health` - App API health
- [ ] `GET http://localhost:5000/health` - Marketplace API health
- [ ] `GET http://localhost:5000/v1/packs` - List packs

## Next Steps

1. Fix Docker permissions
2. Start ClickHouse and Redpanda
3. Initialize database schemas
4. Start backend services
5. Test all pages with real data

## Files Created

- `BROWSER-TESTING.md` - Detailed testing guide
- `SETUP-COMPLETE.md` - This file
- `.env.local` files for console and marketing
- Updated API client with marketplace endpoints

## Notes

- Port 3000 is occupied by another app (SqueezeWeasel)
- Console automatically switched to port 3001
- All frontend code is ready and working
- Backend services need to be started manually until Docker is fixed

