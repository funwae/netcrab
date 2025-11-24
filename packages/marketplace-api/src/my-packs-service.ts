/**
 * My Packs Service
 * Returns packs the buyer org has access to with usage info
 */

import { MarketplaceClickHouseClient } from './clickhouse-client';

export interface MyPackSummary {
  packId: string;
  title: string;
  vertical: string;
  category: string;
  latestVersion: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  billingTier: 'standard' | 'pro' | 'enterprise' | 'trial';
  usage: {
    rowsUsed: number;
    rowLimit: number;
    requestsUsed: number;
    requestLimit: number;
    periodStart: string;
    periodEnd: string;
  };
  download: {
    latestSnapshotUrl: string;
  };
  api: {
    docsUrl: string;
    exampleCurl: string;
  };
  nextRefreshAt: string | null;
}

export class MyPacksService {
  constructor(private clickhouse: MarketplaceClickHouseClient) {}

  /**
   * Get all packs for a buyer org
   */
  async getMyPacks(orgId: string): Promise<MyPackSummary[]> {
    // Get subscriptions for this org
    const subscriptions = await this.clickhouse.query<{
      pack_id: string;
      billing_tier: string;
      status: string;
      current_period_start: string;
      current_period_end: string;
    }>(`
      SELECT
        pack_id,
        billing_tier,
        status,
        current_period_start,
        current_period_end
      FROM buyer_subscriptions
      WHERE org_id = '${orgId}'
        AND status IN ('active', 'past_due', 'trial')
    `);

    if (subscriptions.length === 0) {
      return [];
    }

    const packs: MyPackSummary[] = [];

    for (const sub of subscriptions) {
      // Get pack metadata
      const packMeta = await this.clickhouse.query<{
        title: string;
        vertical: string;
        category: string;
        latest_version: string;
      }>(`
        SELECT
          mp.title,
          mp.vertical,
          COALESCE(mpc.category, 'Unknown') AS category,
          mp.latest_version
        FROM marketplace_packs mp
        LEFT JOIN (
          SELECT pack_id, category
          FROM marketplace_pack_categories
          LIMIT 1 BY pack_id
        ) mpc USING (pack_id)
        WHERE mp.pack_id = '${sub.pack_id}'
        LIMIT 1
      `);

      if (packMeta.length === 0) continue;

      const meta = packMeta[0];

      // Get usage for current period
      const usageRows = await this.clickhouse.query<{
        rows_returned: number;
        requests: number;
      }>(`
        SELECT
          rows_returned,
          requests
        FROM buyer_usage_counters
        WHERE org_id = '${orgId}'
          AND pack_id = '${sub.pack_id}'
          AND period_start = '${sub.current_period_start}'
        LIMIT 1
      `);

      const usage = usageRows[0] || { rows_returned: 0, requests: 0 };

      // Get tier limits
      const tierLimits = this.getTierLimits(sub.billing_tier as 'standard' | 'pro' | 'enterprise' | 'trial');

      // Determine status
      let status: MyPackSummary['status'] = 'active';
      if (sub.status === 'cancelled') {
        status = 'expired';
      } else if (sub.status === 'trial') {
        status = 'trial';
      } else if (sub.status === 'past_due') {
        status = 'active'; // Still active but show banner
      }

      // Get next refresh time (simplified - would come from pack definition)
      const nextRefreshAt = this.getNextRefreshTime(meta.latest_version);

      packs.push({
        packId: sub.pack_id,
        title: meta.title,
        vertical: meta.vertical,
        category: meta.category,
        latestVersion: meta.latest_version,
        status,
        billingTier: sub.billing_tier as 'standard' | 'pro' | 'enterprise' | 'trial',
        usage: {
          rowsUsed: usage.rows_returned,
          rowLimit: tierLimits.monthlyRowLimit,
          requestsUsed: usage.requests,
          requestLimit: tierLimits.requestPerMinuteLimit * 60 * 24 * 30, // Convert to monthly
          periodStart: sub.current_period_start,
          periodEnd: sub.current_period_end,
        },
        download: {
          latestSnapshotUrl: `/v1/packs/${sub.pack_id}/download?format=csv`,
        },
        api: {
          docsUrl: `https://docs.netcrab.net/api/packs/${sub.pack_id}`,
          exampleCurl: `curl -H "Authorization: Bearer YOUR_API_KEY" https://api.netcrab.net/v1/packs/${sub.pack_id}/data`,
        },
        nextRefreshAt,
      });
    }

    return packs;
  }

  /**
   * Get tier limits
   */
  private getTierLimits(tier: string): { monthlyRowLimit: number; requestPerMinuteLimit: number } {
    switch (tier) {
      case 'standard':
        return { monthlyRowLimit: 100_000, requestPerMinuteLimit: 60 };
      case 'pro':
        return { monthlyRowLimit: 1_000_000, requestPerMinuteLimit: 120 };
      case 'enterprise':
        return { monthlyRowLimit: 10_000_000, requestPerMinuteLimit: 300 };
      case 'trial':
        return { monthlyRowLimit: 10_000, requestPerMinuteLimit: 10 };
      default:
        return { monthlyRowLimit: 100_000, requestPerMinuteLimit: 60 };
    }
  }

  /**
   * Get next refresh time (simplified)
   */
  private getNextRefreshTime(version: string): string | null {
    // In production, would query pack definition for updateFrequency
    // For now, assume daily at 02:00 UTC
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);
    return tomorrow.toISOString();
  }
}

