# Vercel Deployment Guide

## ⚠️ IMPORTANT: Root Directory Setting

For this monorepo, you have **two options**. Choose **Option 1** (recommended):

### Option 1: Set Root Directory in Vercel Dashboard (RECOMMENDED)

1. **Import Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import repository: `https://github.com/funwae/netcrab.git`

2. **Set Root Directory**
   - Go to **Settings** → **General**
   - Scroll to **Root Directory**
   - Click **Edit**
   - Set to: `packages/console`
   - Click **Save**

3. **Build Settings** (should auto-detect)
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `pnpm build` (or leave empty for auto)
   - Output Directory: `.next` (or leave empty for auto)
   - Install Command: `pnpm install` (or leave empty for auto)

4. **Set Environment Variables**
   In **Settings** → **Environment Variables**:

   ```
   NEXT_PUBLIC_ENV=demo
   NETCRAB_DEMO_MODE=true
   ```

   Set for: Production, Preview, Development

5. **Deploy**
   - Click **Deploy**
   - Vercel will build from `packages/console` directory

### Option 2: Use Root Directory (Alternative)

If you want to keep root directory as `.` (repo root):

1. **Root Directory**: Leave as `.` (default)
2. **Build Command**: `pnpm --filter '@netcrab/console' build`
3. **Output Directory**: `packages/console/.next`
4. **Install Command**: `pnpm install`
5. **Framework**: Next.js

The `vercel.json` file in the repo root will handle this configuration.

## Recommended Configuration

**Use Option 1** - Set Root Directory to `packages/console` in Vercel Dashboard.

This is simpler and lets Vercel auto-detect everything. When root directory is set to `packages/console`, Vercel will use the `vercel.json` file inside `packages/console/` (which we've created for you).

**Important**: When using Option 1, do NOT set Output Directory in Vercel Dashboard - leave it empty so Vercel auto-detects `.next` relative to the root directory.

## Environment Variables

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_ENV` | `demo` | Environment mode (demo/production) |
| `NETCRAB_DEMO_MODE` | `true` | Enables demo mode with stubbed data |

### Optional Variables (for production)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (if not in demo mode) |
| `NEXT_PUBLIC_MARKETPLACE_API_URL` | Marketplace API URL (if not in demo mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for marketplace |

## Custom Domain Setup

1. In Vercel Dashboard → Settings → Domains
2. Add your domain: `netcrab.net`
3. Follow DNS configuration instructions
4. For subdomain: `app.netcrab.net` → add as additional domain

## Troubleshooting

### Build Fails

- **Error: "Cannot find module"**
  - Ensure Root Directory is set to `packages/console`
  - Verify `pnpm install` runs correctly
  - Check that `packageManager` is set in root `package.json`

- **Error: "Build command failed"**
  - Verify Node.js version (requires >=18.0.0)
  - Check that pnpm is available (Vercel auto-installs)
  - Ensure Root Directory is correctly set

### Environment Variables Not Working

- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

## Next Steps

After deployment:

1. ✅ Test landing page at root `/`
2. ✅ Test console at `/app`
3. ✅ Verify demo mode is working
4. ✅ Check API routes at `/api/demo`
5. ✅ Test marketplace pages

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Monorepo Guide](https://vercel.com/docs/monorepos)
