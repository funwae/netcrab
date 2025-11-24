/**
 * API Client for NetCrab App API
 */

const DEMO_MODE = process.env.NEXT_PUBLIC_ENV === 'demo' || process.env.NETCRAB_DEMO_MODE === 'true';
const API_BASE_URL = DEMO_MODE ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
const MARKETPLACE_API_URL = DEMO_MODE ? '' : (process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000');

export interface OverviewResponse {
  orgId: string;
  productId: string;
  from: string;
  to: string;
  frictionIndex: number;
  efficiencyScore: number;
  sessions: number;
  topHotspots: Hotspot[];
  noteOfTheDay?: CrabNote;
}

export interface Hotspot {
  screenId: string;
  route: string;
  friction: number;
  impactSessions: number;
  trend: 'up' | 'down' | 'flat';
}

export interface HotspotDetail {
  screenId: string;
  route: string;
  sessions: number;
  avgFriction: number;
  avgEfficiency: number;
  rageClickRate: number;
  dropoffRate: number;
  avgTimeSpentMs: number;
}

export interface Flow {
  id: string;
  label: string;
  path: string[];
  sessions: number;
  completionRate: number;
  avgFriction: number;
  avgDurationSec: number;
}

export interface CrabNote {
  id: string;
  title: string;
  summary: string;
  category: 'friction' | 'confusion' | 'efficiency' | 'adoption' | 'conversion';
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  createdAt: string;
  relatedScreens?: string[];
  recommendations?: string[];
}

class ApiClient {
  private baseUrl: string;
  private marketplaceUrl: string;

  constructor(baseUrl: string = API_BASE_URL, marketplaceUrl: string = MARKETPLACE_API_URL) {
    this.baseUrl = baseUrl;
    this.marketplaceUrl = marketplaceUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getOverview(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
  }): Promise<OverviewResponse> {
    if (DEMO_MODE && params.orgId === 'demo_netcrab') {
      const response = await fetch(`/api/demo?endpoint=overview`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response.json();
    }
    const query = new URLSearchParams({
      orgId: params.orgId,
      productId: params.productId,
      from: params.from,
      to: params.to,
    });
    return this.fetch<OverviewResponse>(`/v1/insights/overview?${query}`);
  }

  async getHotspots(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
    limit?: number;
  }): Promise<{ items: HotspotDetail[] }> {
    if (DEMO_MODE && params.orgId === 'demo_netcrab') {
      const response = await fetch(`/api/demo?endpoint=hotspots`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response.json();
    }
    const query = new URLSearchParams({
      orgId: params.orgId,
      productId: params.productId,
      from: params.from,
      to: params.to,
      ...(params.limit && { limit: params.limit.toString() }),
    });
    return this.fetch<{ items: HotspotDetail[] }>(`/v1/insights/hotspots?${query}`);
  }

  async getFlows(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
    limit?: number;
  }): Promise<{ flows: Flow[] }> {
    if (DEMO_MODE && params.orgId === 'demo_netcrab') {
      const response = await fetch(`/api/demo?endpoint=flows`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response.json();
    }
    const query = new URLSearchParams({
      orgId: params.orgId,
      productId: params.productId,
      from: params.from,
      to: params.to,
      ...(params.limit && { limit: params.limit.toString() }),
    });
    return this.fetch<{ flows: Flow[] }>(`/v1/flows/top?${query}`);
  }

  async getCrabNotes(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
    limit?: number;
  }): Promise<{ notes: CrabNote[] }> {
    if (DEMO_MODE && params.orgId === 'demo_netcrab') {
      const response = await fetch(`/api/demo?endpoint=crab-notes`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response.json();
    }
    const query = new URLSearchParams({
      orgId: params.orgId,
      productId: params.productId,
      from: params.from,
      to: params.to,
      ...(params.limit && { limit: params.limit.toString() }),
    });
    return this.fetch<{ notes: CrabNote[] }>(`/v1/crab-notes?${query}`);
  }

  // Marketplace endpoints
  async getMyPacks(): Promise<{ packs: unknown[] }> {
    if (DEMO_MODE) {
      const response = await fetch(`/api/demo?endpoint=my-packs`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response.json();
    }
    const response = await fetch(`${this.marketplaceUrl}/v1/marketplace/my-packs`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': 'acme', // In production, would come from auth context
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getStatements(month: string): Promise<OrgMonthlyStatement> {
    const response = await fetch(`${this.marketplaceUrl}/v1/marketplace/statements?month=${month}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': 'acme',
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getOptInSettings(): Promise<OptInSettings> {
    const response = await fetch(`${this.marketplaceUrl}/v1/marketplace/opt-in`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': 'acme',
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async updateOptInSettings(settings: OptInSettings): Promise<{ success: boolean }> {
    const response = await fetch(`${this.marketplaceUrl}/v1/marketplace/opt-in`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': 'acme',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async createCheckoutSession(packId: string, billingTier: string): Promise<{ checkoutUrl: string }> {
    const response = await fetch(`${this.marketplaceUrl}/v1/marketplace/packs/${packId}/checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': 'acme',
      },
      body: JSON.stringify({
        billingTier,
        successUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/marketplace/my-packs?session=success`,
        cancelUrl: `${typeof window !== 'undefined' ? window.location.href : ''}?session=cancelled`,
      }),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }
}

export interface OrgMonthlyStatement {
  orgId: string;
  month: string;
  currency: 'USD';
  totalAmount: string;
  packs: Array<{
    packId: string;
    packTitle: string;
    grossRevenue: string;
    orgContributionSessions: number;
    orgShareAmount: string;
  }>;
}

export interface OptInSettings {
  orgId: string;
  globalOptIn: boolean;
  products: Array<{
    productId: string;
    productName: string;
    vertical: string;
    packs: Array<{
      packId: string;
      title: string;
      optIn: boolean;
    }>;
  }>;
}

export const api = new ApiClient();

