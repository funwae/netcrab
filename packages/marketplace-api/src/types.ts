/**
 * Marketplace API Types
 */

export interface Pack {
  id: string;
  title: string;
  shortDesc: string;
  vertical: string;
  category: string;
  updateFrequency: string;
  basePriceUsd: string;
  samplePreview?: {
    medianClicks?: number;
    medianDurationSec?: number;
    meanFriction?: number;
  };
}

export interface PackDetail extends Pack {
  longDesc: string;
  schema: {
    fields: Array<{
      name: string;
      type: string;
      description: string;
    }>;
  };
  sampleData: unknown[];
  charts?: Array<{
    type: string;
    title: string;
    data: unknown[];
  }>;
  pricing: {
    monthly: string;
    currency: string;
  };
  eligibility: {
    minOrgs: number;
    minSessions: number;
    orgCountCurrent: number;
    sessionCountCurrent: number;
  };
}

export interface APIKey {
  apiKeyId: string;
  label: string;
  createdAt: string;
  lastUsedAt?: string;
  revoked: boolean;
}

export interface UsageCounter {
  orgId: string;
  packId: string;
  periodStart: string;
  rowsReturned: number;
  requests: number;
}

export interface TierConfig {
  name: string;
  monthlyRowLimit: number;
  requestPerMinuteLimit: number;
}
