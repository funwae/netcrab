# Vercel Deployment Guide

## ✅ CORRECT CONFIGURATION (Verified)

### Step-by-Step Setup

1. **Import Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import: `https://github.com/funwae/netcrab.git`

2. **Set Root Directory** (CRITICAL)
   - Go to **Settings** → **General**
   - Find **Root Directory**
   - Click **Edit**
   - Set to: `packages/console`
   - Click **Save**

3. **Build Settings** (Leave ALL empty for auto-detection)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: (leave empty - auto-detects `pnpm build`)
   - **Output Directory**: (leave empty - auto-detects `.next`)
   - **Install Command**: (leave empty - auto-detects `pnpm install`)

   ⚠️ **DO NOT** set Output Directory manually - this causes the double path error!

4. **Environment Variables**
   In **Settings** → **Environment Variables**:

   ```
   NEXT_PUBLIC_ENV=demo
   NETCRAB_DEMO_MODE=true
   ```

   Set for: ✅ Production, ✅ Preview, ✅ Development

5. **Deploy**
   - Click **Deploy**
   - Vercel will use `packages/console/vercel.json` automatically

## How It Works

When Root Directory is set to `packages/console`:
- Vercel changes working directory to `packages/console`
- Uses `packages/console/vercel.json` (which we created)
- Builds with `pnpm build` (runs in `packages/console`)
- Outputs to `.next` (relative to `packages/console`)
- Finds `routes-manifest.json` at `packages/console/.next/routes-manifest.json`

## Files Created

- ✅ `packages/console/vercel.json` - Used when root directory is `packages/console`
- ✅ `vercel.json` (root) - Used if root directory is `.` (not recommended)

## Verification

The build has been tested locally and works correctly:
- ✅ Build completes successfully
- ✅ `routes-manifest.json` is created at `packages/console/.next/routes-manifest.json`
- ✅ All TypeScript errors fixed
- ✅ All Next.js build errors resolved

## Troubleshooting

### Error: "routes-manifest.json couldn't be found"

**Cause**: Output Directory is set incorrectly in Vercel Dashboard

**Fix**:
1. Go to Settings → General → Build & Development Settings
2. **Clear** the Output Directory field (leave it empty)
3. Redeploy

### Error: "packages/console/packages/console/.next"

**Cause**: Root Directory is `packages/console` but Output Directory is also set to `packages/console/.next`

**Fix**: Clear Output Directory field in Vercel Dashboard

## Support

- [Vercel Monorepo Docs](https://vercel.com/docs/monorepos)
- [Vercel Build Configuration](https://vercel.com/docs/deployments/configure-a-build)
