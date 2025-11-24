/**
 * Pack Builder Scheduler
 * Runs scheduled aggregation jobs
 */

import * as cron from 'node-cron';
import { PackDefinitionLoader } from './pack-definitions';
import { UXBenchmarkAggregator } from './aggregators/ux-benchmark-aggregator';
import { TaskFlowAggregator } from './aggregators/task-flow-aggregator';
import { ReleaseDeltaAggregator } from './aggregators/release-delta-aggregator';
import { PackBuilderClickHouseClient } from './clickhouse-client';

export class PackBuilderScheduler {
  private loader: PackDefinitionLoader;
  private clickhouse: PackBuilderClickHouseClient;
  private uxAggregator: UXBenchmarkAggregator;
  private flowAggregator: TaskFlowAggregator;
  private deltaAggregator: ReleaseDeltaAggregator;

  constructor(
    packDefinitionsPath: string,
    clickhouseUrl?: string
  ) {
    this.loader = new PackDefinitionLoader();
    this.loader.loadFromDirectory(packDefinitionsPath);

    this.clickhouse = new PackBuilderClickHouseClient(clickhouseUrl);
    this.uxAggregator = new UXBenchmarkAggregator(this.clickhouse);
    this.flowAggregator = new TaskFlowAggregator(this.clickhouse);
    this.deltaAggregator = new ReleaseDeltaAggregator(this.clickhouse);
  }

  /**
   * Start scheduled jobs
   */
  start(): void {
    // Daily packs at 02:00 UTC
    cron.schedule('0 2 * * *', async () => {
      console.log('[Scheduler] Running daily pack aggregation...');
      await this.runDailyPacks();
    });

    // Weekly insight packs on Mondays at 03:00 UTC
    cron.schedule('0 3 * * 1', async () => {
      console.log('[Scheduler] Running weekly insight pack aggregation...');
      await this.runWeeklyPacks();
    });

    console.log('[Scheduler] Started pack builder scheduler');
  }

  /**
   * Run daily pack aggregations
   */
  private async runDailyPacks(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // UX Benchmark packs
    const uxPacks = this.loader.getByKind('ux_benchmarks');
    for (const pack of uxPacks) {
      if (pack.updateFrequency === 'daily') {
        try {
          console.log(`[Scheduler] Aggregating ${pack.packId}...`);
          await this.uxAggregator.aggregate(pack, yesterday, today);
          console.log(`[Scheduler] Completed ${pack.packId}`);
        } catch (error) {
          console.error(`[Scheduler] Error aggregating ${pack.packId}:`, error);
        }
      }
    }

    // Task flow packs
    const flowPacks = this.loader.getByKind('task_flows');
    const dateWindow = this.getDateWindow(yesterday);
    for (const pack of flowPacks) {
      if (pack.updateFrequency === 'daily') {
        try {
          console.log(`[Scheduler] Aggregating ${pack.packId}...`);
          await this.flowAggregator.aggregate(pack, dateWindow);
          console.log(`[Scheduler] Completed ${pack.packId}`);
        } catch (error) {
          console.error(`[Scheduler] Error aggregating ${pack.packId}:`, error);
        }
      }
    }
  }

  /**
   * Run weekly pack aggregations
   */
  private async runWeeklyPacks(): Promise<void> {
    const insightPacks = this.loader.getByKind('insight_reports');
    for (const pack of insightPacks) {
      if (pack.updateFrequency === 'weekly') {
        try {
          console.log(`[Scheduler] Aggregating ${pack.packId}...`);
          // Weekly aggregation logic would go here
          console.log(`[Scheduler] Completed ${pack.packId}`);
        } catch (error) {
          console.error(`[Scheduler] Error aggregating ${pack.packId}:`, error);
        }
      }
    }
  }

  /**
   * Get date window string (e.g., "2025-11" or "2025Q1")
   */
  private getDateWindow(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Manually trigger pack rebuild
   */
  async rebuildPack(packId: string, fromDate?: Date, toDate?: Date): Promise<void> {
    const pack = this.loader.getDefinition(packId);
    if (!pack) {
      throw new Error(`Pack not found: ${packId}`);
    }

    const from = fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const to = toDate || new Date();

    switch (pack.kind) {
      case 'ux_benchmarks':
        await this.uxAggregator.aggregate(pack, from, to);
        break;
      case 'task_flows':
        await this.flowAggregator.aggregate(pack, this.getDateWindow(from));
        break;
      case 'release_deltas':
        // Would need release version parameter
        break;
      default:
        throw new Error(`Unsupported pack kind: ${pack.kind}`);
    }
  }

  /**
   * Stop scheduler
   */
  stop(): void {
    this.clickhouse.close();
  }
}
