/**
 * Release Delta Pack Aggregator
 * Builds mp_release_deltas from release events and session data
 */

import type { PackDefinition } from '../types';
import { PackBuilderClickHouseClient } from '../clickhouse-client';

export interface ReleaseDeltaRow {
  pack_id: string;
  date_window: string;
  vertical: string;
  release_version: string;
  task_type: string;
  friction_delta: number;
  efficiency_delta: number;
  sample_sessions: number;
  org_count: number;
}

export class ReleaseDeltaAggregator {
  constructor(private clickhouse: PackBuilderClickHouseClient) {}

  /**
   * Aggregate release delta pack data
   * Compares pre-release vs post-release metrics
   */
  async aggregate(
    pack: PackDefinition,
    dateWindow: string,
    releaseVersion: string
  ): Promise<ReleaseDeltaRow[]> {
    // This is a simplified version - in production would need:
    // 1. Release event tracking (when releases happened)
    // 2. Pre-release baseline calculation
    // 3. Post-release comparison window

    const query = `
      INSERT INTO mp_release_deltas
      SELECT
        '${pack.packId}' AS pack_id,
        '${dateWindow}' AS date_window,
        '${pack.vertical}' AS vertical,
        '${releaseVersion}' AS release_version,
        COALESCE(tt.task_type, 'generic_navigation') AS task_type,
        -- Simplified: use current period vs previous period
        avg(s.frustration_score) -
          (SELECT avg(frustration_score)
           FROM fact_sessions s2
           WHERE s2.org_id = s.org_id
             AND s2.product_id = s.product_id
             AND s2.start_ts < s.start_ts - INTERVAL 7 DAY) AS friction_delta,
        avg(s.efficiency_score) -
          (SELECT avg(efficiency_score)
           FROM fact_sessions s2
           WHERE s2.org_id = s.org_id
             AND s2.product_id = s.product_id
             AND s2.start_ts < s.start_ts - INTERVAL 7 DAY) AS efficiency_delta,
        count() AS sample_sessions,
        uniqExact(s.org_id) AS org_count
      FROM fact_sessions s
      LEFT JOIN dim_task_types tt
        ON s.org_id = tt.org_id
        AND s.product_id = tt.product_id
      INNER JOIN org_settings os ON s.org_id = os.org_id
      INNER JOIN pack_org_membership pom
        ON s.org_id = pom.org_id
        AND pom.pack_id = '${pack.packId}'
        AND pom.opted_in = 1
      WHERE
        (os.vertical = '${pack.vertical}' OR '${pack.vertical}' = 'ANY')
        AND os.marketplace_opted_in = 1
        -- In production, would filter by actual release window
      GROUP BY task_type
      HAVING
        org_count >= ${pack.minOrgs}
        AND sample_sessions >= ${pack.minSessions}
    `;

    await this.clickhouse.execute(query);

    const result = await this.clickhouse.query<ReleaseDeltaRow>(`
      SELECT *
      FROM mp_release_deltas
      WHERE pack_id = '${pack.packId}'
        AND date_window = '${dateWindow}'
        AND release_version = '${releaseVersion}'
    `);

    return result;
  }
}
