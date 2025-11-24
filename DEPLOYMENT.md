# NetCrab Deployment Guide

## Overview

This repo serves as:
- **Source of truth** for NetCrab console + marketplace
- **Public demo** with seeded/mock data
- **Base** for future multi-tenant production environment

## Architecture

### URLs
- `netcrab.net` → Marketing landing page (root `/`)
- `app.netcrab.net` → Console dashboard (route `/` with auth, or `/app` redirect)

### Environments

#### Demo Mode (Current)
- Landing page at `/`
- Console at `/` (authenticated routes)
- Demo API endpoints at `/api/demo/*`
- Uses stubbed JSON fixtures for data

#### Production Mode (Future)
- Landing page at `/`
- Console at `/app` (or subdomain)
- Real backend APIs at configured URLs
- Live ClickHouse, Redpanda, etc.

## Demo Mode Setup

### Environment Variables

```bash
NEXT_PUBLIC_ENV=demo
NETCRAB_DEMO_MODE=true
```

### How It Works

1. **Landing Page** (`/`)
   - Public marketing page
   - "Get a Demo" button → `/app` (console)

2. **Console** (`/` with auth, or `/app`)
   - Uses route group `(console)` for authenticated pages
   - When `NETCRAB_DEMO_MODE=true` and `orgId === 'demo_netcrab'`:
     - API client routes to `/api/demo/*` endpoints
     - Returns stubbed data from fixtures

3. **Demo API Routes** (`/api/demo`)
   - `GET /api/demo?endpoint=overview` → Demo overview data
   - `GET /api/demo?endpoint=my-packs` → Demo packs data
   - Returns JSON fixtures defined in `src/app/api/demo/route.ts`

## Deployment Options

### Option 1: Vercel (Recommended for Demo)

1. **Connect Repository**
   ```bash
   # Connect to Vercel via GitHub/GitLab
   ```

2. **Environment Variables**
   ```
   NEXT_PUBLIC_ENV=demo
   NETCRAB_DEMO_MODE=true
   ```

3. **Domain Setup**
   - `netcrab.net` → Vercel project
   - `app.netcrab.net` → Same project (or subdomain redirect)

4. **Build Settings**
   - Framework: Next.js
   - Build command: `pnpm build`
   - Output directory: `.next`

### Option 2: Docker + VPS

1. **Build Docker Image**
   ```bash
   docker build -t netcrab-console -f packages/console/Dockerfile .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_ENV=demo \
     -e NETCRAB_DEMO_MODE=true \
     netcrab-console
   ```

### Option 3: Railway / Fly.io / Render

1. Connect repository
2. Set environment variables
3. Deploy

## Production Setup (Future)

### Backend Services

Deploy separately:
- **App API** (port 4000)
- **Marketplace API** (port 5000)
- **Billing Service** (ports 6000-6002)
- **ClickHouse** (port 8123)
- **Redpanda** (port 19092)

### Environment Variables (Production)

```bash
NEXT_PUBLIC_ENV=production
NETCRAB_DEMO_MODE=false
NEXT_PUBLIC_API_URL=https://api.netcrab.net
NEXT_PUBLIC_MARKETPLACE_API_URL=https://api.netcrab.net
```

## Route Structure

```
/                          → Landing page (public)
/app                      → Redirect to console
/app/                     → Console dashboard (authenticated)
/app/flows                → Flows page
/app/hotspots             → Hotspots page
/app/crab-notes           → Crab Notes page
/app/marketplace/seller   → Seller view
/app/marketplace/my-packs → Buyer view
/app/marketplace/opt-in   → Opt-in management
/app/marketplace/payouts  → Payouts
/marketplace              → Public marketplace catalog
/api/demo                 → Demo API endpoints
```

## Testing Locally

### Demo Mode
```bash
cd packages/console
NEXT_PUBLIC_ENV=demo NETCRAB_DEMO_MODE=true pnpm dev
```

### Production Mode (with real APIs)
```bash
cd packages/console
NEXT_PUBLIC_ENV=production pnpm dev
```

## Next Steps

1. ✅ Landing page created
2. ✅ Console moved to route group
3. ✅ Demo mode implemented
4. ⏳ Add more demo fixtures (hotspots, flows, crab notes)
5. ⏳ Add authentication flow
6. ⏳ Deploy to Vercel
7. ⏳ Set up custom domains

