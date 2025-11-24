# Vercel Deployment Guide

## Quick Setup

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import repository: `https://github.com/funwae/netcrab.git`
   - Vercel will auto-detect Next.js

2. **Configure Project Settings**
   - **Root Directory**: Leave as root (`.`)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `cd packages/console && pnpm build` (already in vercel.json)
   - **Output Directory**: `packages/console/.next` (already in vercel.json)
   - **Install Command**: `pnpm install` (already in vercel.json)

3. **Set Environment Variables**
   In Vercel Dashboard → Project Settings → Environment Variables:

   ```
   NEXT_PUBLIC_ENV=demo
   NETCRAB_DEMO_MODE=true
   ```

   Make sure to set these for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

## Configuration Details

The `vercel.json` file includes:

- **Monorepo Support**: Builds from `packages/console` directory
- **pnpm Workspace**: Uses `pnpm install` for dependency management
- **Security Headers**: XSS protection, frame options, content type options
- **Caching**: Optimized cache headers for static assets
- **Region**: Deploys to `iad1` (US East)

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
  - Ensure `pnpm install` runs at root
  - Check that `packageManager` is set in root `package.json`

- **Error: "Build command failed"**
  - Verify Node.js version (requires >=18.0.0)
  - Check that pnpm is available (Vercel auto-installs)

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

