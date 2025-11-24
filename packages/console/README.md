# NetCrab Console

Customer SaaS dashboard built with Next.js 15. Provides frustration/efficiency insights, flow analysis, hotspots, and AI-generated "Crab Notes".

## Features

- **Overview Dashboard**: Friction/efficiency metrics, top hotspots, flow snapshot, Crab Notes
- **Hotspots Page**: Table of screens ranked by friction with detailed metrics
- **Flows Page**: Interactive task flow visualization with completion rates
- **Crab Notes Page**: AI-generated insights and recommendations
- **Marketplace Page**: Seller view for data pack contributions and revenue
- **Settings Page**: Data controls, privacy settings, agent status

## Tech Stack

- Next.js 15 with App Router
- React 18
- Tailwind CSS (custom NetCrab color palette: navy, sand, coral)
- TypeScript

## Development

```bash
cd packages/console
pnpm install
pnpm dev
```

Access at `http://localhost:3000`

## Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Pages

- `/` - Overview dashboard
- `/hotspots` - Friction hotspots table
- `/flows` - Task flow discovery
- `/crab-notes` - AI-generated insights
- `/marketplace` - Marketplace participation
- `/settings` - Configuration and controls

## Design

- Color palette: Deep navy, sand, coral accent
- Friendly, non-accusatory microcopy
- Rounded corners, soft shadows
- Responsive design
