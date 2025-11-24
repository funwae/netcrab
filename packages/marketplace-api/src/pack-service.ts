/**
 * Pack Service
 * Handles pack data querying and metadata
 */

import { MarketplaceClickHouseClient } from './clickhouse-client';
import type { Pack, PackDetail } from './types';

export class PackService {
  constructor(private clickhouse: MarketplaceClickHouseClient) {}

  /**
   * List all available packs
   */
  async listPacks(filters?: {
    vertical?: string;
    category?: string;
    updateFrequency?: string;
  }): Promise<Pack[]> {
    let query = `
      SELECT
        pack_id AS id,
        title,
        short_desc AS shortDesc,
        vertical,
        category,
        update_frequency AS updateFrequency,
        base_price_usd AS basePriceUsd
      FROM marketplace_packs mp
      LEFT JOIN (
        SELECT pack_id, category
        FROM marketplace_pack_categories
        LIMIT 1 BY pack_id
      ) mpc USING (pack_id)
      WHERE public = 1
    `;

    const conditions: string[] = [];
    if (filters?.vertical) {
      conditions.push(`vertical = '${filters.vertical}'`);
    }
    if (filters?.category) {
      conditions.push(`category = '${filters.category}'`);
    }
    if (filters?.updateFrequency) {
      conditions.push(`update_frequency = '${filters.updateFrequency}'`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const rows = await this.clickhouse.query<Pack>(query);
    return rows;
  }

  /**
   * Get pack detail
   */
  async getPackDetail(packId: string): Promise<PackDetail | null> {
    // Get pack metadata
    const packRows = await this.clickhouse.query<{
      pack_id: string;
      title: string;
      short_desc: string;
      long_desc: string;
      vertical: string;
      update_frequency: string;
      base_price_usd: number;
    }>(`
      SELECT *
      FROM marketplace_packs
      WHERE pack_id = '${packId}'
      LIMIT 1
    `);

    if (packRows.length === 0) {
      return null;
    }

    const pack = packRows[0];

    // Get category
    const categoryRows = await this.clickhouse.query<{ category: string }>(`
      SELECT category
      FROM marketplace_pack_categories
      WHERE pack_id = '${packId}'
      LIMIT 1
    `);

    // Get sample data
    const sampleRows = await this.clickhouse.query<{ payload: string }>(`
      SELECT payload
      FROM marketplace_pack_samples
      WHERE pack_id = '${packId}' AND sample_kind = 'row'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Get eligibility stats (from latest pack data)
    const eligibilityRows = await this.clickhouse.query<{
      org_count: number;
      sample_sessions: number;
    }>(`
      SELECT
        max(org_count) AS org_count,
        sum(sample_sessions) AS sample_sessions
      FROM mp_ux_friction_daily
      WHERE pack_id = '${packId}'
      GROUP BY pack_id
      LIMIT 1
    `);

    const eligibility = eligibilityRows[0] || {
      org_count: 0,
      sample_sessions: 0,
    };

    return {
      id: pack.pack_id,
      title: pack.title,
      shortDesc: pack.short_desc,
      longDesc: pack.long_desc,
      vertical: pack.vertical,
      category: categoryRows[0]?.category || 'Unknown',
      updateFrequency: pack.update_frequency,
      basePriceUsd: pack.base_price_usd.toString(),
      schema: {
        fields: this.getSchemaFields(packId),
      },
      sampleData: sampleRows.map(row => JSON.parse(row.payload)),
      pricing: {
        monthly: pack.base_price_usd.toString(),
        currency: 'USD',
      },
      eligibility: {
        minOrgs: 20, // Would come from pack definition
        minSessions: 10000,
        orgCountCurrent: eligibility.org_count,
        sessionCountCurrent: eligibility.sample_sessions,
      },
    };
  }

  /**
   * Query pack data
   */
  async queryPackData(
    packId: string,
    params: {
      from?: string;
      to?: string;
      taskType?: string;
      vertical?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<unknown[]> {
    // Determine which table to query based on pack kind
    const packKindRows = await this.clickhouse.query<{ kind: string; table: string }>(`
      SELECT kind, table
      FROM marketplace_packs
      WHERE pack_id = '${packId}'
      LIMIT 1
    `);

    if (packKindRows.length === 0) {
      throw new Error(`Pack not found: ${packId}`);
    }

    const { table } = packKindRows[0];

    let query = `SELECT * FROM ${table} WHERE pack_id = '${packId}'`;

    const conditions: string[] = [];
    if (params.from) {
      conditions.push(`date >= '${params.from}'`);
    }
    if (params.to) {
      conditions.push(`date <= '${params.to}'`);
    }
    if (params.taskType) {
      conditions.push(`task_type = '${params.taskType}'`);
    }
    if (params.vertical) {
      conditions.push(`vertical = '${params.vertical}'`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const limit = params.limit || 100;
    const offset = params.offset || 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    return this.clickhouse.query(query);
  }

  /**
   * Get schema fields for a pack
   */
  private getSchemaFields(packId: string): Array<{ name: string; type: string; description: string }> {
    // This would ideally come from pack definition
    // For now, return common fields
    return [
      { name: 'date', type: 'date', description: 'UTC date' },
      { name: 'task_type', type: 'string', description: 'Normalized task type label' },
      { name: 'flow_complexity', type: 'number', description: 'Number of steps in flow' },
      { name: 'median_clicks', type: 'number', description: 'Median clicks to complete' },
      { name: 'median_duration_s', type: 'number', description: 'Median duration in seconds' },
      { name: 'mean_frict_score', type: 'number', description: 'Mean friction score (0-1)' },
      { name: 'p90_frict_score', type: 'number', description: '90th percentile friction score' },
      { name: 'sample_sessions', type: 'number', description: 'Number of sessions in sample' },
      { name: 'org_count', type: 'number', description: 'Number of contributing organizations' },
    ];
  }
}
