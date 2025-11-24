/**
 * Quota Middleware
 * Enforces usage limits for API requests
 */

import { MarketplaceClickHouseClient } from './clickhouse-client';
import type { TierConfig } from './types';

const TIER_CONFIGS: Record<string, TierConfig> = {
  Standard: {
    name: 'Standard',
    monthlyRowLimit: 100_000,
    requestPerMinuteLimit: 60,
  },
  Pro: {
    name: 'Pro',
    monthlyRowLimit: 1_000_000,
    requestPerMinuteLimit: 120,
  },
  Enterprise: {
    name: 'Enterprise',
    monthlyRowLimit: 10_000_000,
    requestPerMinuteLimit: 300,
  },
};

export class QuotaMiddleware {
  constructor(private clickhouse: MarketplaceClickHouseClient) {}

  /**
   * Check if request is within quota
   */
  async checkQuota(
    orgId: string,
    packId: string,
    estimatedRows: number,
    tier: string = 'Standard'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const config = TIER_CONFIGS[tier] || TIER_CONFIGS.Standard;

    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get current usage
    const usageRows = await this.clickhouse.query<{
      rows_returned: number;
      requests: number;
    }>(`
      SELECT
        rows_returned,
        requests
      FROM buyer_usage_counters
      WHERE org_id = '${orgId}'
        AND pack_id = '${packId}'
        AND period_start = '${monthStart.toISOString()}'
      LIMIT 1
    `);

    const currentRows = usageRows[0]?.rows_returned || 0;
    const currentRequests = usageRows[0]?.requests || 0;

    // Check row limit
    if (currentRows + estimatedRows > config.monthlyRowLimit) {
      return {
        allowed: false,
        reason: `You have reached your ${config.monthlyRowLimit.toLocaleString()} row quota for ${packId} this month.`,
      };
    }

    // Check request rate (simplified - would need per-minute tracking in production)
    if (currentRequests >= config.requestPerMinuteLimit) {
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${config.requestPerMinuteLimit} requests per minute.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Update usage counters
   */
  async updateUsage(
    orgId: string,
    packId: string,
    rowsReturned: number
  ): Promise<void> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    await this.clickhouse.query(`
      INSERT INTO buyer_usage_counters (
        org_id,
        pack_id,
        period_start,
        rows_returned,
        requests,
        last_updated
      ) VALUES (
        '${orgId}',
        '${packId}',
        '${monthStart.toISOString()}',
        ${rowsReturned},
        1,
        now()
      )
    `);
  }

  /**
   * Get usage for an org
   */
  async getUsage(orgId: string, packId?: string): Promise<Array<{
    packId: string;
    rowsReturned: number;
    requests: number;
    limit: number;
  }>> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let query = `
      SELECT
        pack_id AS packId,
        rows_returned AS rowsReturned,
        requests,
        100000 AS limit
      FROM buyer_usage_counters
      WHERE org_id = '${orgId}'
        AND period_start = '${monthStart.toISOString()}'
    `;

    if (packId) {
      query += ` AND pack_id = '${packId}'`;
    }

    return this.clickhouse.query(query);
  }
}
