/**
 * Statement Generator
 * Generates monthly revenue statements for seller orgs
 */

import { BillingClickHouseClient } from './clickhouse-client';
import type { OrgMonthlyStatement } from './types';

export class StatementGenerator {
  constructor(private clickhouse: BillingClickHouseClient) {}

  /**
   * Generate monthly statement for an org
   */
  async generateStatement(orgId: string, month: Date): Promise<OrgMonthlyStatement> {
    const monthStr = month.toISOString().split('T')[0];

    // Get all payouts for the org in this month
    const payoutRows = await this.clickhouse.query<{
      payout_id: string;
      pack_id: string;
      amount: number;
    }>(`
      SELECT
        po.payout_id,
        po.amount,
        pr.pack_id
      FROM marketplace_org_payouts po
      INNER JOIN marketplace_pack_revenue pr ON po.month = pr.month
      WHERE po.org_id = '${orgId}'
        AND po.month = '${monthStr}'
    `);

    // Get pack details and contributions
    const packDetails = await this.clickhouse.query<{
      pack_id: string;
      title: string;
      gross_revenue: number;
      sessions: number;
      org_share: number;
    }>(`
      SELECT
        mp.pack_id,
        mp.title,
        pr.gross_revenue,
        moc.sessions_in_pack AS sessions,
        po.amount AS org_share
      FROM marketplace_packs mp
      INNER JOIN marketplace_pack_revenue pr ON mp.pack_id = pr.pack_id
      INNER JOIN marketplace_org_contrib moc ON mp.pack_id = moc.pack_id
      INNER JOIN marketplace_org_payouts po ON moc.org_id = po.org_id AND moc.pack_id = po.pack_id
      WHERE moc.org_id = '${orgId}'
        AND moc.month = '${monthStr}'
    `);

    const totalAmount = packDetails.reduce((sum, p) => sum + p.org_share, 0);

    return {
      orgId,
      month: monthStr,
      currency: 'USD',
      totalAmount: totalAmount.toFixed(2),
      packs: packDetails.map(p => ({
        packId: p.pack_id,
        packTitle: p.title,
        grossRevenue: p.gross_revenue.toFixed(2),
        orgContributionSessions: p.sessions,
        orgShareAmount: p.org_share.toFixed(2),
      })),
    };
  }
}
