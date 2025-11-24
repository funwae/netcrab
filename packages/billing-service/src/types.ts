/**
 * Billing Service Types
 */

export interface OrgMonthlyStatement {
  orgId: string;
  month: string; // "2025-11-01"
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

export interface PackRevenue {
  packId: string;
  month: Date;
  grossRevenue: number;
  platformFee: number;
  poolAfterFee: number;
}

export interface OrgContribution {
  packId: string;
  month: Date;
  orgId: string;
  sessionsInPack: number;
}

export interface OrgPayout {
  payoutId: string;
  orgId: string;
  month: Date;
  currency: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  stripeTransferId?: string;
}
