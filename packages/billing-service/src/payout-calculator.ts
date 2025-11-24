/**
 * Payout Calculator
 * Calculates revenue shares for seller orgs
 */

import { BillingClickHouseClient } from './clickhouse-client';
import type { PackRevenue, OrgContribution, OrgPayout } from './types';

const PLATFORM_FEE_RATE = 0.30; // 30%

export class PayoutCalculator {
  constructor(private clickhouse: BillingClickHouseClient) {}

  /**
   * Calculate pack revenue for a month
   */
  async calculatePackRevenue(
    packId: string,
    month: Date,
    grossRevenue: number
  ): Promise<PackRevenue> {
    const platformFee = grossRevenue * PLATFORM_FEE_RATE;
    const poolAfterFee = grossRevenue - platformFee;

    // Store in database
    await this.clickhouse.insert('marketplace_pack_revenue', [{
      pack_id: packId,
      month: month.toISOString().split('T')[0],
      gross_revenue: grossRevenue,
      platform_fee: platformFee,
      pool_after_fee: poolAfterFee,
      created_at: new Date().toISOString(),
    }]);

    return {
      packId,
      month,
      grossRevenue,
      platformFee,
      poolAfterFee,
    };
  }

  /**
   * Calculate org contributions to a pack
   */
  async calculateContributions(
    packId: string,
    month: Date
  ): Promise<OrgContribution[]> {
    // Query from pack data (e.g., mp_ux_friction_daily)
    const rows = await this.clickhouse.query<{
      org_id: string;
      sessions: number;
    }>(`
      SELECT
        org_id,
        sum(sample_sessions) AS sessions
      FROM mp_ux_friction_daily
      WHERE pack_id = '${packId}'
        AND toStartOfMonth(date) = '${month.toISOString().split('T')[0]}'
      GROUP BY org_id
    `);

    const contributions: OrgContribution[] = rows.map(row => ({
      packId,
      month,
      orgId: row.org_id,
      sessionsInPack: row.sessions,
    }));

    // Store in database
    await this.clickhouse.insert('marketplace_org_contrib', contributions.map(c => ({
      pack_id: c.packId,
      month: c.month.toISOString().split('T')[0],
      org_id: c.orgId,
      sessions_in_pack: c.sessionsInPack,
      created_at: new Date().toISOString(),
    })));

    return contributions;
  }

  /**
   * Calculate org payouts for a month
   */
  async calculatePayouts(month: Date): Promise<OrgPayout[]> {
    // Get all packs with revenue for the month
    const packRevenues = await this.clickhouse.query<PackRevenue>(`
      SELECT *
      FROM marketplace_pack_revenue
      WHERE month = '${month.toISOString().split('T')[0]}'
    `);

    const orgTotals = new Map<string, number>();

    // For each pack, calculate org shares
    for (const packRev of packRevenues) {
      const contributions = await this.calculateContributions(packRev.packId, month);

      // Calculate total sessions across all orgs
      const totalSessions = contributions.reduce((sum, c) => sum + c.sessionsInPack, 0);

      if (totalSessions === 0) continue;

      // Calculate each org's share
      for (const contrib of contributions) {
        const orgShare = (contrib.sessionsInPack / totalSessions) * packRev.poolAfterFee;
        const current = orgTotals.get(contrib.orgId) || 0;
        orgTotals.set(contrib.orgId, current + orgShare);
      }
    }

    // Create payout records
    const payouts: OrgPayout[] = [];
    for (const [orgId, amount] of orgTotals.entries()) {
      if (amount <= 0) continue;

      const payout: OrgPayout = {
        payoutId: `payout_${orgId}_${month.toISOString().split('T')[0]}_${Date.now()}`,
        orgId,
        month,
        currency: 'USD',
        amount,
        status: 'pending',
      };

      payouts.push(payout);
    }

    // Store in database
    await this.clickhouse.insert('marketplace_org_payouts', payouts.map(p => ({
      payout_id: p.payoutId,
      org_id: p.orgId,
      month: p.month.toISOString().split('T')[0],
      currency: p.currency,
      amount: p.amount,
      status: p.status,
      stripe_transfer_id: p.stripeTransferId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })));

    return payouts;
  }
}
