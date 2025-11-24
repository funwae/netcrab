/**
 * Statements Service
 * Proxies to billing-service for monthly statements
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

export class StatementsService {
  private billingServiceUrl: string;

  constructor(billingServiceUrl: string = process.env.BILLING_SERVICE_URL || 'http://localhost:6002') {
    this.billingServiceUrl = billingServiceUrl;
  }

  /**
   * Get monthly statement for an org
   */
  async getStatement(orgId: string, month: string): Promise<OrgMonthlyStatement | null> {
    try {
      const response = await fetch(
        `${this.billingServiceUrl}/internal/statements?orgId=${orgId}&month=${month}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN || 'internal-token'}`,
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Billing service error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('[Statements Service] Error fetching statement:', error);
      throw error;
    }
  }
}

