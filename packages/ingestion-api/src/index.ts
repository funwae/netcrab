/**
 * NetCrab Ingestion API
 *
 * Cloud service that accepts event batches from Agents
 * and publishes them to the event bus.
 */

import { IngestionServer } from './server';

function loadConfig(): {
  port: number;
  kafkaBrokers: string[];
  apiKeys: string[];
} {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:19092').split(','),
    apiKeys: (process.env.API_KEYS || '').split(',').filter(Boolean),
  };
}

async function main() {
  const config = loadConfig();

  if (config.apiKeys.length === 0) {
    console.error('[Ingestion API] Missing API_KEYS environment variable');
    process.exit(1);
  }

  const server = new IngestionServer(config);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Ingestion API] SIGTERM received, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[Ingestion API] SIGINT received, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  await server.start(config.port);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('[Ingestion API] Fatal error:', error);
    process.exit(1);
  });
}

export { IngestionServer };

