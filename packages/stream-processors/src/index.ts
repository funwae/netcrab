/**
 * NetCrab Stream Processors
 *
 * Main entry point for stream processing services
 */

import { Sessionizer } from './sessionizer';
import { IncidentDetector } from './incident-detector';
import { MetricsAggregator } from './metrics-aggregator';

function loadConfig(): {
  kafkaBrokers: string[];
  clickhouseUrl: string;
  service: 'sessionizer' | 'incident-detector' | 'metrics-aggregator' | 'all';
} {
  return {
    kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:19092').split(','),
    clickhouseUrl: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    service: (process.env.SERVICE || 'all') as any,
  };
}

async function main() {
  const config = loadConfig();

  if (config.service === 'all' || config.service === 'sessionizer') {
    const sessionizer = new Sessionizer({
      kafkaBrokers: config.kafkaBrokers,
    });
    await sessionizer.start();
    console.log('[Stream Processors] Sessionizer started');
  }

  if (config.service === 'all' || config.service === 'incident-detector') {
    const incidentDetector = new IncidentDetector({
      kafkaBrokers: config.kafkaBrokers,
    });
    await incidentDetector.start();
    console.log('[Stream Processors] Incident Detector started');
  }

  if (config.service === 'all' || config.service === 'metrics-aggregator') {
    const metricsAggregator = new MetricsAggregator({
      kafkaBrokers: config.kafkaBrokers,
      clickhouseUrl: config.clickhouseUrl,
    });
    await metricsAggregator.start();
    console.log('[Stream Processors] Metrics Aggregator started');
  }

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[Stream Processors] SIGTERM received, shutting down...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('[Stream Processors] SIGINT received, shutting down...');
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error('[Stream Processors] Fatal error:', error);
    process.exit(1);
  });
}

export { Sessionizer, IncidentDetector, MetricsAggregator };

