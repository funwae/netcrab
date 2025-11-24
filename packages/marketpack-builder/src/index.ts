/**
 * NetCrab Market Pack Builder
 * Main entry point for pack builder service
 */

import { PackBuilderScheduler } from './scheduler';
import * as path from 'path';

const PACK_DEFINITIONS_PATH = process.env.PACK_DEFINITIONS_PATH ||
  path.join(__dirname, '../pack-definitions');

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL || 'http://localhost:8123';

async function main() {
  console.log('[Pack Builder] Starting...');
  console.log(`[Pack Builder] Pack definitions: ${PACK_DEFINITIONS_PATH}`);
  console.log(`[Pack Builder] ClickHouse: ${CLICKHOUSE_URL}`);

  const scheduler = new PackBuilderScheduler(PACK_DEFINITIONS_PATH, CLICKHOUSE_URL);

  // Start scheduled jobs
  scheduler.start();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('[Pack Builder] Shutting down...');
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('[Pack Builder] Shutting down...');
    scheduler.stop();
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error('[Pack Builder] Fatal error:', error);
    process.exit(1);
  });
}

export { PackBuilderScheduler };
export * from './types';
export * from './pack-definitions';
export * from './versioning';
