/**
 * Opt-in Service
 * Manages marketplace participation settings
 */

import { MarketplaceClickHouseClient } from './clickhouse-client';

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

export class OptInService {
  constructor(private clickhouse: MarketplaceClickHouseClient) {}

  /**
   * Get opt-in settings for an org
   */
  async getSettings(orgId: string): Promise<OptInSettings> {
    // Get global opt-in from org_settings
    const orgSettings = await this.clickhouse.query<{
      marketplace_opted_in: number;
    }>(`
      SELECT marketplace_opted_in
      FROM org_settings
      WHERE org_id = '${orgId}'
      LIMIT 1
    `);

    const globalOptIn = orgSettings[0]?.marketplace_opted_in === 1;

    // Get products and their pack memberships
    // In production, would query actual products table
    // For now, return example structure
    const products = await this.clickhouse.query<{
      product_id: string;
      product_name: string;
      vertical: string;
    }>(`
      SELECT DISTINCT
        product_id,
        product_id AS product_name,
        os.vertical
      FROM fact_sessions s
      INNER JOIN org_settings os ON s.org_id = os.org_id
      WHERE s.org_id = '${orgId}'
      LIMIT 10
    `);

    const result: OptInSettings = {
      orgId,
      globalOptIn,
      products: [],
    };

    for (const product of products) {
      // Get packs for this product's vertical
      const packs = await this.clickhouse.query<{
        pack_id: string;
        title: string;
      }>(`
        SELECT pack_id, title
        FROM marketplace_packs
        WHERE vertical = '${product.vertical}' OR vertical = 'ANY'
      `);

      // Get opt-in status for each pack
      const packOptIns = await this.clickhouse.query<{
        pack_id: string;
        opted_in: number;
      }>(`
        SELECT pack_id, opted_in
        FROM pack_org_membership
        WHERE org_id = '${orgId}'
      `);

      const optInMap = new Map(
        packOptIns.map((p) => [p.pack_id, p.opted_in === 1])
      );

      result.products.push({
        productId: product.product_id,
        productName: product.product_name,
        vertical: product.vertical,
        packs: packs.map((p) => ({
          packId: p.pack_id,
          title: p.title,
          optIn: optInMap.get(p.pack_id) || false,
        })),
      });
    }

    return result;
  }

  /**
   * Update opt-in settings
   */
  async updateSettings(orgId: string, settings: OptInSettings): Promise<void> {
    // Update global opt-in
    await this.clickhouse.execute(`
      ALTER TABLE org_settings
      UPDATE marketplace_opted_in = ${settings.globalOptIn ? 1 : 0}
      WHERE org_id = '${orgId}'
    `);

    // Update per-pack opt-ins
    for (const product of settings.products) {
      for (const pack of product.packs) {
        // Check if membership exists
        const existing = await this.clickhouse.query<{
          pack_id: string;
        }>(`
          SELECT pack_id
          FROM pack_org_membership
          WHERE org_id = '${orgId}' AND pack_id = '${pack.packId}'
          LIMIT 1
        `);

        if (existing.length > 0) {
          // Update
          await this.clickhouse.execute(`
            ALTER TABLE pack_org_membership
            UPDATE opted_in = ${pack.optIn ? 1 : 0}, updated_at = now()
            WHERE org_id = '${orgId}' AND pack_id = '${pack.packId}'
          `);
        } else {
          // Insert
          await this.clickhouse.execute(`
            INSERT INTO pack_org_membership (
              pack_id,
              org_id,
              opted_in,
              created_at,
              updated_at
            ) VALUES (
              '${pack.packId}',
              '${orgId}',
              ${pack.optIn ? 1 : 0},
              now(),
              now()
            )
          `);
        }
      }
    }
  }
}

