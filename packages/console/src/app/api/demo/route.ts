/**
 * Demo API Route
 * Returns stubbed data when NETCRAB_DEMO_MODE is enabled
 */

import { NextResponse } from 'next/server';

const DEMO_MODE = process.env.NETCRAB_DEMO_MODE === 'true';

// Demo fixtures
const demoOverview = {
  orgId: 'demo_netcrab',
  productId: 'demo-product',
  from: '2025-10-25',
  to: '2025-11-24',
  frictionIndex: 0.42,
  efficiencyScore: 0.78,
  sessions: 12450,
  topHotspots: [
    {
      screenId: 'checkout',
      route: '/checkout',
      friction: 0.65,
      impactSessions: 3420,
      trend: 'up' as const,
    },
    {
      screenId: 'settings',
      route: '/settings/profile',
      friction: 0.58,
      impactSessions: 2100,
      trend: 'down' as const,
    },
    {
      screenId: 'dashboard',
      route: '/dashboard',
      friction: 0.35,
      impactSessions: 8900,
      trend: 'flat' as const,
    },
  ],
  noteOfTheDay: {
    id: 'demo-note-1',
    title: 'Checkout flow shows high friction',
    summary: 'Users are experiencing 65% friction on the checkout page, with an average of 3.2 rage clicks per session. Consider simplifying the form fields.',
    category: 'friction' as const,
    severity: 'high' as const,
    confidence: 0.92,
    createdAt: new Date().toISOString(),
  },
};

const demoMyPacks = {
  packs: [
    {
      packId: 'ux_friction_b2b_crm_v1',
      title: 'B2B CRM UX Friction Benchmarks v1',
      vertical: 'B2B_CRM',
      category: 'UX Benchmarks',
      latestVersion: 'v1.3',
      status: 'active' as const,
      billingTier: 'standard' as const,
      usage: {
        rowsUsed: 45230,
        rowLimit: 100000,
        requestsUsed: 1240,
        requestLimit: 2592000,
        periodStart: '2025-11-01',
        periodEnd: '2025-11-30',
      },
      download: {
        latestSnapshotUrl: '/api/demo/download/ux_friction_b2b_crm_v1',
      },
      api: {
        docsUrl: 'https://docs.netcrab.net/api/packs/ux_friction_b2b_crm_v1',
        exampleCurl: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.netcrab.net/v1/packs/ux_friction_b2b_crm_v1/data',
      },
      nextRefreshAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export async function GET(request: Request) {
  if (!DEMO_MODE) {
    return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  switch (endpoint) {
    case 'overview':
      return NextResponse.json(demoOverview);
    case 'my-packs':
      return NextResponse.json(demoMyPacks);
    default:
      return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
  }
}

