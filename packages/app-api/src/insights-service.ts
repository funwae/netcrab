/**
 * Insights Service
 *
 * Business logic for generating insights from ClickHouse data
 */

import { ClickHouseClient } from './clickhouse-client';
import { LLMNotesGenerator } from '../../ai-services/src/llm-notes';
import { FlowMining } from '../../ai-services/src/flow-mining';
import type { OverviewResponse, HotspotsResponse, FlowsResponse, Hotspot, HotspotDetail, Flow, CrabNote } from './types';

export class InsightsService {
  private clickhouse: ClickHouseClient;
  private llmGenerator: LLMNotesGenerator;
  private flowMining: FlowMining;

  constructor(clickhouse: ClickHouseClient, llmConfig?: { provider: 'openai' | 'anthropic' | 'mock'; apiKey?: string; model?: string }) {
    this.clickhouse = clickhouse;
    this.llmGenerator = new LLMNotesGenerator(llmConfig || { provider: 'mock' });
    this.flowMining = new FlowMining();
  }

  /**
   * Get overview metrics
   */
  async getOverview(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
  }): Promise<OverviewResponse> {
    const { orgId, productId, from, to } = params;

    // Get aggregate metrics
    const metricsQuery = `
      SELECT
        count(*) as sessions,
        avg(frustration_score) as avg_friction,
        avg(efficiency_score) as avg_efficiency
      FROM fact_sessions
      WHERE org_id = {orgId: String}
        AND product_id = {productId: String}
        AND start_ts >= parseDateTimeBestEffort({from: String})
        AND start_ts <= parseDateTimeBestEffort({to: String})
    `;

    const metrics = await this.clickhouse.queryOne<{
      sessions: string;
      avg_friction: string;
      avg_efficiency: string;
    }>(metricsQuery, {
      orgId,
      productId,
      from,
      to,
    });

    const sessions = parseInt(metrics?.sessions || '0', 10);
    const frictionIndex = parseFloat(metrics?.avg_friction || '0');
    const efficiencyScore = parseFloat(metrics?.avg_efficiency || '0');

    // Get top hotspots
    const topHotspots = await this.getTopHotspots(params, 3);

    // Get note of the day (placeholder - will be enhanced in Phase 2 with LLM)
    const noteOfTheDay = await this.getNoteOfTheDay(params);

    return {
      orgId,
      productId,
      from,
      to,
      frictionIndex,
      efficiencyScore,
      sessions,
      topHotspots,
      noteOfTheDay,
    };
  }

  /**
   * Get hotspots
   */
  async getHotspots(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
    limit?: number;
  }): Promise<HotspotsResponse> {
    const { orgId, productId, from, to, limit = 20 } = params;

    // Query screen-level aggregates
    // Note: In production, this would query fact_screen_hotspots which is populated by aggregation jobs
    // For MVP, we'll return placeholder data based on session metrics
    // This will be enhanced when screen-level aggregation is implemented
    const query = `
      SELECT
        session_id,
        frustration_score,
        efficiency_score,
        rage_clicks,
        duration_ms
      FROM fact_sessions
      WHERE org_id = {orgId: String}
        AND product_id = {productId: String}
        AND start_ts >= parseDateTimeBestEffort({from: String})
        AND start_ts <= parseDateTimeBestEffort({to: String})
      ORDER BY frustration_score DESC
      LIMIT {limit: UInt32}
    `;

    const results = await this.clickhouse.query<{
      session_id: string;
      frustration_score: string;
      efficiency_score: string;
      rage_clicks: string;
      duration_ms: string;
    }>(query, {
      orgId,
      productId,
      from,
      to,
      limit,
    });

    // For MVP: Create simplified hotspots from session data
    // In production, this would come from fact_screen_hotspots table
    const items: HotspotDetail[] = results.map((row, index) => ({
      screenId: `screen_${index + 1}`, // Placeholder
      route: `/route_${index + 1}`, // Placeholder
      sessions: 1, // Each row is one session
      avgFriction: parseFloat(row.frustration_score || '0'),
      avgEfficiency: parseFloat(row.efficiency_score || '0'),
      rageClickRate: parseFloat(row.rage_clicks || '0') > 0 ? 1.0 : 0.0,
      dropoffRate: 0.0, // Would need additional data
      avgTimeSpentMs: parseInt(row.duration_ms || '0', 10),
    }));

    return { items };
  }

  /**
   * Get top hotspots (for overview)
   */
  private async getTopHotspots(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
  }, limit: number): Promise<Hotspot[]> {
    const hotspots = await this.getHotspots({ ...params, limit });

    // Calculate trend (simplified - compare with previous period)
    // In production, would compare with previous time period
    return hotspots.items.slice(0, limit).map(item => ({
      screenId: item.screenId,
      route: item.route,
      friction: item.avgFriction,
      impactSessions: item.sessions,
      trend: 'flat' as const, // Placeholder - would calculate from historical data
    }));
  }

  /**
   * Get top flows using flow mining
   */
  async getTopFlows(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
    limit?: number;
  }): Promise<FlowsResponse> {
    const { orgId, productId, from, to, limit = 10 } = params;

    // Query session data for flow mining
    // Note: This is simplified - in production would query screen sequences from events_raw
    const query = `
      SELECT
        session_id,
        duration_ms,
        tasks_completed > 0 as completed
      FROM fact_sessions
      WHERE org_id = {orgId: String}
        AND product_id = {productId: String}
        AND start_ts >= parseDateTimeBestEffort({from: String})
        AND start_ts <= parseDateTimeBestEffort({to: String})
      LIMIT 1000
    `;

    const sessions = await this.clickhouse.query<{
      session_id: string;
      duration_ms: string;
      completed: number;
    }>(query, {
      orgId,
      productId,
      from,
      to,
    });

    // For MVP: Generate placeholder screen sequences
    // In production, would query actual screen sequences from events_raw
    const sequences = sessions.map((s, i) => ({
      sessionId: s.session_id,
      screens: ['home', `screen_${i % 5}`, `screen_${(i + 1) % 5}`, 'success'],
      duration: parseInt(s.duration_ms, 10),
      completed: s.completed === 1,
    }));

    // Mine flows
    const archetypes = await this.flowMining.mineFlows(sequences);

    // Convert to Flow format
    const flows: Flow[] = archetypes.slice(0, limit).map(arch => ({
      id: arch.id,
      label: arch.label,
      path: arch.path,
      sessions: arch.frequency,
      completionRate: arch.completionRate,
      avgFriction: arch.avgFriction,
      avgDurationSec: Math.round(arch.avgDuration / 1000),
    }));

    // If no flows mined, return placeholder
    if (flows.length === 0) {
      flows.push({
        id: 'flow_1',
        label: 'Lead creation',
        path: ['home', 'leads_list', 'lead_new_form', 'lead_detail'],
        sessions: 5230,
        completionRate: 0.86,
        avgFriction: 0.41,
        avgDurationSec: 72,
      });
    }

    return { flows };
  }

  /**
   * Get note of the day using LLM
   */
  private async getNoteOfTheDay(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
  }): Promise<CrabNote | undefined> {
    const hotspots = await this.getTopHotspots(params, 1);

    if (hotspots.length > 0) {
      const hotspot = hotspots[0];
      const note = await this.llmGenerator.generateNoteFromHotspot(
        hotspot.screenId,
        hotspot.route,
        hotspot.friction,
        hotspot.impactSessions,
        0.0, // rageClickRate - would need to query from incidents
        [] // errorCodes - would need to query from events
      );
      return note;
    }

    return undefined;
  }

  /**
   * Get Crab Notes for a specific screen/hotspot
   */
  async getCrabNote(params: {
    orgId: string;
    productId: string;
    screenId: string;
    route: string;
    friction: number;
    sessions: number;
  }): Promise<CrabNote> {
    return await this.llmGenerator.generateNoteFromHotspot(
      params.screenId,
      params.route,
      params.friction,
      params.sessions,
      0.0, // Would query from incidents
      [] // Would query from events
    );
  }

  /**
   * Get all Crab Notes for a time period
   */
  async getCrabNotes(params: {
    orgId: string;
    productId: string;
    from: string;
    to: string;
    limit?: number;
  }): Promise<CrabNote[]> {
    const hotspots = await this.getHotspots({ ...params, limit: params.limit || 10 });
    const notes: CrabNote[] = [];

    for (const hotspot of hotspots.items) {
      const note = await this.llmGenerator.generateNoteFromHotspot(
        hotspot.screenId,
        hotspot.route,
        hotspot.avgFriction,
        hotspot.sessions,
        hotspot.rageClickRate,
        [] // Would query error codes
      );
      notes.push(note);
    }

    return notes;
  }
}

