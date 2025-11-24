/**
 * UX Benchmark Pack Aggregator
 * Builds mp_ux_friction_daily from fact_sessions
 */

import type { PackDefinition } from '../types';
import { PackBuilderClickHouseClient } from '../clickhouse-client';

export interface UXBenchmarkRow {
  pack_id: string;
  date: string;
  task_type: string;
  flow_complexity: number;
  median_clicks: number;
  median_duration_s: number;
  mean_frict_score: number;
  p90_frict_score: number;
  sample_sessions: number;
  org_count: number;
}

export class UXBenchmarkAggregator {
  constructor(private clickhouse: PackBuilderClickHouseClient) {}

  /**
   * Aggregate UX benchmark pack data
   */
  async aggregate(
    pack: PackDefinition,
    fromDate: Date,
    toDate: Date
  ): Promise<UXBenchmarkRow[]> {
    const query = `
      INSERT INTO mp_ux_friction_daily
      SELECT
        '${pack.packId}' AS pack_id,
        toDate(s.start_ts) AS date,
        COALESCE(tt.task_type, 'generic_navigation') AS task_type,
        COALESCE(s.flow_complexity, 1) AS flow_complexity,
        median(s.click_count) AS median_clicks,
        median(s.duration_ms) / 1000.0 AS median_duration_s,
        avg(s.frustration_score) AS mean_frict_score,
        quantileExact(0.9)(s.frustration_score) AS p90_frict_score,
        count() AS sample_sessions,
        uniqExact(s.org_id) AS org_count
      FROM fact_sessions s
      LEFT JOIN dim_task_types tt
        ON s.org_id = tt.org_id
        AND s.product_id = tt.product_id
        AND s.task_type = tt.task_type
      INNER JOIN org_settings os ON s.org_id = os.org_id
      INNER JOIN pack_org_membership pom
        ON s.org_id = pom.org_id
        AND pom.pack_id = '${pack.packId}'
        AND pom.opted_in = 1
      WHERE
        (os.vertical = '${pack.vertical}' OR '${pack.vertical}' = 'ANY')
        AND s.start_ts >= parseDateTimeBestEffort({from: String})
        AND s.start_ts < parseDateTimeBestEffort({to: String})
        AND os.marketplace_opted_in = 1
      GROUP BY date, task_type, flow_complexity
      HAVING
        org_count >= ${pack.minOrgs}
        AND sample_sessions >= ${pack.minSessions}
    `;

    await this.clickhouse.execute(
      query.replace('{from: String}', `'${fromDate.toISOString()}'`)
           .replace('{to: String}', `'${toDate.toISOString()}'`)
    );

    // Fetch and return the aggregated rows
    const result = await this.clickhouse.query<UXBenchmarkRow>(`
      SELECT *
      FROM mp_ux_friction_daily
      WHERE pack_id = '${pack.packId}'
        AND date >= '${fromDate.toISOString().split('T')[0]}'
        AND date < '${toDate.toISOString().split('T')[0]}'
    `);

    return result;
  }

  /**
   * Validate aggregated data meets privacy requirements
   */
  async validate(pack: PackDefinition, rows: UXBenchmarkRow[]): Promise<UXBenchmarkRow[]> {
    return rows.filter(row => {
      if (row.org_count < pack.minOrgs) {
        console.warn(`Row filtered: org_count ${row.org_count} < minOrgs ${pack.minOrgs}`);
        return false;
      }
      if (row.sample_sessions < pack.minSessions) {
        console.warn(`Row filtered: sample_sessions ${row.sample_sessions} < minSessions ${pack.minSessions}`);
        return false;
      }
      return true;
    });
  }
}
