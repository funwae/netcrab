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

const demoFlows = {
  flows: [
    {
      id: 'flow-1',
      label: 'Checkout Flow',
      path: ['/products', '/cart', '/checkout', '/payment', '/confirmation'],
      sessions: 3420,
      completionRate: 0.68,
      avgFriction: 0.65,
      avgDurationSec: 145,
    },
    {
      id: 'flow-2',
      label: 'User Registration',
      path: ['/signup', '/verify-email', '/onboarding', '/dashboard'],
      sessions: 2100,
      completionRate: 0.82,
      avgFriction: 0.42,
      avgDurationSec: 98,
    },
    {
      id: 'flow-3',
      label: 'Profile Update',
      path: ['/settings', '/settings/profile', '/settings/profile/edit', '/settings/profile'],
      sessions: 1890,
      completionRate: 0.91,
      avgFriction: 0.28,
      avgDurationSec: 45,
    },
    {
      id: 'flow-4',
      label: 'Search & Browse',
      path: ['/home', '/search', '/products', '/products/detail'],
      sessions: 8900,
      completionRate: 0.75,
      avgFriction: 0.35,
      avgDurationSec: 67,
    },
  ],
};

const demoHotspots = {
  items: [
    {
      screenId: 'checkout',
      route: '/checkout',
      sessions: 3420,
      avgFriction: 0.65,
      avgEfficiency: 0.35,
      rageClickRate: 0.12,
      dropoffRate: 0.32,
      avgTimeSpentMs: 145000,
    },
    {
      screenId: 'settings',
      route: '/settings/profile',
      sessions: 2100,
      avgFriction: 0.58,
      avgEfficiency: 0.42,
      rageClickRate: 0.08,
      dropoffRate: 0.18,
      avgTimeSpentMs: 98000,
    },
    {
      screenId: 'dashboard',
      route: '/dashboard',
      sessions: 8900,
      avgFriction: 0.35,
      avgEfficiency: 0.65,
      rageClickRate: 0.03,
      dropoffRate: 0.05,
      avgTimeSpentMs: 67000,
    },
    {
      screenId: 'payment',
      route: '/payment',
      sessions: 2800,
      avgFriction: 0.72,
      avgEfficiency: 0.28,
      rageClickRate: 0.15,
      dropoffRate: 0.45,
      avgTimeSpentMs: 120000,
    },
  ],
};

const demoCrabNotes = {
  notes: [
    {
      id: 'note-1',
      title: 'Checkout flow shows high friction',
      summary: 'Users are experiencing 65% friction on the checkout page, with an average of 3.2 rage clicks per session. Consider simplifying the form fields.',
      category: 'friction' as const,
      severity: 'high' as const,
      confidence: 0.92,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      relatedScreens: ['/checkout'],
      recommendations: [
        'Reduce form fields to essential information only',
        'Add progress indicator for multi-step checkout',
        'Implement auto-fill for address fields',
      ],
    },
    {
      id: 'note-2',
      title: 'Profile edit flow has low completion rate',
      summary: 'Users frequently abandon the profile edit flow after starting. The edit form may be too complex or confusing.',
      category: 'confusion' as const,
      severity: 'medium' as const,
      confidence: 0.85,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      relatedScreens: ['/settings/profile'],
      recommendations: [
        'Simplify the profile edit form',
        'Add clear save/cancel buttons',
        'Show preview of changes before saving',
      ],
    },
    {
      id: 'note-3',
      title: 'Search results page performs well',
      summary: 'The search and browse flow shows good efficiency scores with low friction. Users are finding what they need quickly.',
      category: 'efficiency' as const,
      severity: 'low' as const,
      confidence: 0.78,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      relatedScreens: ['/search', '/products'],
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
    case 'flows':
      return NextResponse.json(demoFlows);
    case 'hotspots':
      return NextResponse.json(demoHotspots);
    case 'crab-notes':
      return NextResponse.json(demoCrabNotes);
    default:
      return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
  }
}

