/**
 * Metrics Aggregator Service
 *
 * Consumes sessionized events and writes aggregated metrics to ClickHouse
 */

import { Kafka } from 'kafkajs';
import { createClient } from '@clickhouse/client';
import type { SessionMetrics } from './types';

export class MetricsAggregator {
  private kafka: Kafka;
  private clickhouse: ReturnType<typeof createClient>;
  private batchSize = 100;
  private batch: SessionMetrics[] = [];
  private flushInterval = 10000; // 10 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: {
    kafkaBrokers: string[];
    clickhouseUrl: string;
  }) {
    this.kafka = new Kafka({
      clientId: 'netcrab-metrics-aggregator',
      brokers: config.kafkaBrokers,
    });

    this.clickhouse = createClient({
      url: config.clickhouseUrl,
    });
  }

  async start(): Promise<void> {
    // Initialize ClickHouse tables
    await this.initializeTables();

    // Set up Kafka consumer
    const consumer = this.kafka.consumer({ groupId: 'metrics-aggregator-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'events.sessionized', fromBeginning: false });

    this.startFlushTimer();

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const metrics: SessionMetrics = JSON.parse(message.value.toString());
          this.batch.push(metrics);

          // Flush if batch size reached
          if (this.batch.length >= this.batchSize) {
            await this.flush();
          }
        } catch (error) {
          console.error('[MetricsAggregator] Error processing metrics:', error);
        }
      },
    });
  }

  private async initializeTables(): Promise<void> {
    // Create fact_sessions table if it doesn't exist
    await this.clickhouse.command(`
      CREATE TABLE IF NOT EXISTS fact_sessions (
        org_id String,
        product_id String,
        session_id String,
        user_hash String,
        start_ts DateTime64(3, 'UTC'),
        end_ts DateTime64(3, 'UTC'),
        duration_ms UInt64,
        click_count UInt32,
        unique_screens UInt16,
        rage_clicks UInt16,
        backtracks UInt16,
        context_switches UInt16,
        tasks_started UInt16,
        tasks_completed UInt16,
        error_events UInt16,
        frustration_score Float32,
        efficiency_score Float32,
        version_tag Nullable(String),
        segment Nullable(String)
      )
      ENGINE = ReplacingMergeTree
      PARTITION BY (org_id, toDate(start_ts))
      ORDER BY (org_id, product_id, start_ts, session_id)
    `);

    // Create fact_screen_hotspots table if it doesn't exist
    await this.clickhouse.command(`
      CREATE TABLE IF NOT EXISTS fact_screen_hotspots (
        org_id String,
        product_id String,
        screen_id String,
        route String,
        date Date,
        sessions UInt64,
        avg_frustration Float32,
        avg_efficiency Float32,
        rage_click_rate Float32,
        dropoff_rate Float32,
        avg_time_spent_ms UInt64
      )
      ENGINE = SummingMergeTree
      PARTITION BY (org_id, toYearWeek(date))
      ORDER BY (org_id, product_id, screen_id, date)
    `);
  }

  private async flush(): Promise<void> {
    if (this.batch.length === 0) return;

    const metrics = [...this.batch];
    this.batch = [];

    try {
      // Insert session metrics
      await this.clickhouse.insert({
        table: 'fact_sessions',
        values: metrics.map(m => ({
          org_id: m.orgId,
          product_id: m.productId,
          session_id: m.sessionId,
          user_hash: m.userHash,
          start_ts: m.startTs,
          end_ts: m.endTs,
          duration_ms: m.durationMs,
          click_count: m.clickCount,
          unique_screens: m.uniqueScreens,
          rage_clicks: m.rageClicks,
          backtracks: m.backtracks,
          context_switches: m.contextSwitches,
          tasks_started: m.tasksStarted,
          tasks_completed: m.tasksCompleted,
          error_events: m.errorEvents,
          frustration_score: m.frustrationScore,
          efficiency_score: m.efficiencyScore,
          version_tag: m.versionTag || null,
          segment: m.segment || null,
        })),
        format: 'JSONEachRow',
      });

      // Aggregate screen hotspots (simplified - in production would be more sophisticated)
      // This is a placeholder - real aggregation would happen via materialized views or scheduled jobs
    } catch (error) {
      console.error('[MetricsAggregator] Error flushing to ClickHouse:', error);
      // Re-queue on failure
      this.batch.unshift(...metrics);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(async () => {
      await this.flush();
    }, this.flushInterval);
  }

  async stop(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
    await this.clickhouse.close();
  }
}

