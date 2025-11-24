# NetCrab Deployment & Demo Setup

## ✅ Completed

1. **Landing Page** - Created at `/` with hero, how it works, features, privacy sections
2. **Console Routes** - Moved all console pages to `/app/*` routes
3. **Demo Mode** - Implemented with stubbed API endpoints at `/api/demo/*`
4. **Environment Variables** - Added support for `NEXT_PUBLIC_ENV` and `NETCRAB_DEMO_MODE`

## Route Structure

```
/                          → Landing page (public marketing)
/app                      → Console dashboard (authenticated)
/app/flows                → Flows page
/app/hotspots             → Hotspots page
/app/crab-notes           → Crab Notes page
/app/marketplace/seller    → Seller view
/app/marketplace/my-packs  → Buyer view
/app/marketplace/opt-in    → Opt-in management
/app/marketplace/payouts   → Payouts
/marketplace               → Public marketplace catalog (if exists)
/api/demo                 → Demo API endpoints
```

## Demo Mode

### Enable Demo Mode

Set environment variables:
```bash
NEXT_PUBLIC_ENV=demo
NETCRAB_DEMO_MODE=true
```

### How It Works

1. When `NETCRAB_DEMO_MODE=true` and `orgId === 'demo_netcrab'`:
   - API client automatically routes to `/api/demo/*` endpoints
   - Returns stubbed JSON data from `src/app/api/demo/route.ts`

2. Demo endpoints:
   - `GET /api/demo?endpoint=overview` → Demo overview data
   - `GET /api/demo?endpoint=my-packs` → Demo packs data

3. Console pages automatically use `demo_netcrab` org when in demo mode

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables:
   ```
   NEXT_PUBLIC_ENV=demo
   NETCRAB_DEMO_MODE=true
   ```
3. Deploy

### Local Testing

```bash
cd packages/console
NEXT_PUBLIC_ENV=demo NETCRAB_DEMO_MODE=true pnpm dev
```

Visit:
- http://localhost:3001/ → Landing page
- http://localhost:3001/app → Console dashboard (with demo data)

## Next Steps

1. ✅ Landing page created
2. ✅ Console moved to `/app`
3. ✅ Demo mode implemented
4. ⏳ Add more demo fixtures (hotspots, flows, crab notes)
5. ⏳ Add authentication middleware
6. ⏳ Deploy to Vercel
7. ⏳ Set up custom domains

