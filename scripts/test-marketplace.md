# NetCrab Marketplace Browser Testing Guide

## Services Running

### Backend Services
- **Ingestion API**: http://localhost:3000
- **App API**: http://localhost:4000
- **Marketplace API**: http://localhost:5000
- **Billing Service**: http://localhost:6000 (webhook: 6001, internal: 6002)

### Frontend Services
- **Console (Dashboard)**: http://localhost:3000
- **Marketing Site**: http://localhost:3001

## Testing Checklist

### 1. Console Dashboard (http://localhost:3000)

**Pages to test:**
- ✅ `/` - Overview page (should show friction/efficiency, hotspots, Crab Notes)
- ✅ `/hotspots` - Hotspots table
- ✅ `/flows` - Flow visualization
- ✅ `/crab-notes` - AI-generated insights
- ✅ `/marketplace/seller` - Seller contributions view
- ✅ `/marketplace/my-packs` - Buyer's purchased packs (may be empty initially)
- ✅ `/marketplace/opt-in` - Opt-in management
- ✅ `/marketplace/payouts` - Payouts and statements
- ✅ `/marketplace/payouts/2025-11-01` - Statement detail (example)

### 2. Marketing Site (http://localhost:3001)

**Pages to test:**
- ✅ `/marketplace` - Pack catalog with filters
- ✅ `/marketplace/ux_friction_b2b_crm_v1` - Pack detail page
- ✅ Purchase flow (tier selection → Stripe Checkout redirect)

### 3. API Endpoints

**Test with curl:**

```bash
# List packs
curl http://localhost:5000/v1/packs

# Get pack detail
curl http://localhost:5000/v1/packs/ux_friction_b2b_crm_v1

# Get my packs (requires X-Org-Id header)
curl -H "X-Org-Id: acme" http://localhost:5000/v1/marketplace/my-packs

# Get opt-in settings
curl -H "X-Org-Id: acme" http://localhost:5000/v1/marketplace/opt-in
```

## Common Issues & Fixes

### Services not starting
- Check logs: `tail -f /tmp/netcrab-*.log`
- Ensure Docker containers are running: `docker-compose -f infrastructure/docker-compose.yml ps`
- Check ports aren't in use: `lsof -i :3000,4000,5000`

### Database connection errors
- Verify ClickHouse is up: `curl http://localhost:8123`
- Re-run schema scripts if needed

### CORS errors in browser
- Ensure API URLs match in `.env.local` files
- Check browser console for specific errors

## Next Steps

1. Open http://localhost:3000 in browser
2. Navigate through all pages
3. Test marketplace flows
4. Check browser console for errors
5. Verify API calls in Network tab

