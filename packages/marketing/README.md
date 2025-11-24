# NetCrab Marketing Site

Public marketing website at `netcrab.net`. Built with Next.js static export.

## Sections

1. **Hero**: Headline, subheadline, CTAs
2. **How It Works**: 4-step process (Collect, Understand, Improve, Share & Earn)
3. **What You Actually See**: Friction Radar, Real User Flows, Crab Notes previews
4. **For Product Teams & Data Buyers**: Split layout with value props
5. **Privacy & Ethics**: Data handling and privacy commitments
6. **Footer**: Links and tagline

## Development

```bash
cd packages/marketing
pnpm dev
```

## Deployment

Static export for CDN deployment:

```bash
pnpm build
pnpm export
```

