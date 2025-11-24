/**
 * Task Flow Pack Aggregator
 * Builds mp_task_flows from flow_archetypes
 */

import type { PackDefinition } from '../types';
import { PackBuilderClickHouseClient } from '../clickhouse-client';

export interface TaskFlowRow {
  pack_id: string;
  date_window: string;
  vertical: string;
  task_type: string;
  archetype_id: string;
  archetype_label: string;
  steps: string[];
  avg_duration_s: number;
  avg_frict_score: number;
  sample_sessions: number;
  org_count: number;
}

export class TaskFlowAggregator {
  constructor(private clickhouse: PackBuilderClickHouseClient) {}

  /**
   * Aggregate task flow pack data
   */
  async aggregate(
    pack: PackDefinition,
    dateWindow: string // e.g., "2025Q1", "2025-11"
  ): Promise<TaskFlowRow[]> {
    // First, ensure flow_archetypes exist (from clustering service)
    // Then aggregate across orgs

    const query = `
      INSERT INTO mp_task_flows
      SELECT
        '${pack.packId}' AS pack_id,
        '${dateWindow}' AS date_window,
        '${pack.vertical}' AS vertical,
        fa.task_type,
        fa.archetype_id,
        COALESCE(fa.archetype_label, 'Flow ' || fa.archetype_id) AS archetype_label,
        fa.steps,
        avg(fa.avg_duration_s) AS avg_duration_s,
        avg(fa.avg_frict_score) AS avg_frict_score,
        sum(fa.sample_sessions) AS sample_sessions,
        uniqExact(fa.org_id) AS org_count
      FROM flow_archetypes fa
      INNER JOIN org_settings os ON fa.org_id = os.org_id
      INNER JOIN pack_org_membership pom
        ON fa.org_id = pom.org_id
        AND pom.pack_id = '${pack.packId}'
        AND pom.opted_in = 1
      WHERE
        fa.date_window = '${dateWindow}'
        AND (os.vertical = '${pack.vertical}' OR '${pack.vertical}' = 'ANY')
        AND os.marketplace_opted_in = 1
      GROUP BY task_type, archetype_id, archetype_label, steps
      HAVING
        org_count >= ${pack.minOrgs}
        AND sample_sessions >= ${pack.minSessions}
    `;

    await this.clickhouse.execute(query);

    // Fetch and return
    const result = await this.clickhouse.query<TaskFlowRow>(`
      SELECT *
      FROM mp_task_flows
      WHERE pack_id = '${pack.packId}'
        AND date_window = '${dateWindow}'
    `);

    return result;
  }

  /**
   * Validate aggregated data
   */
  async validate(pack: PackDefinition, rows: TaskFlowRow[]): Promise<TaskFlowRow[]> {
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
