/**
 * NetCrab Agent
 *
 * On-premises collector service that receives events from SDKs,
 * applies scrubbing/hashing policies, and forwards batches to cloud.
 */

import { AgentServer } from './server';
import type { AgentConfig } from './types';

// Load config from environment or config file
function loadConfig(): AgentConfig {
  return {
    port: parseInt(process.env.PORT || '7000', 10),
    cloudIngestionUrl: process.env.CLOUD_INGESTION_URL || 'https://ingestion.netcrab.net',
    apiKey: process.env.API_KEY || '',
    orgId: process.env.ORG_ID || '',
    batchSize: parseInt(process.env.BATCH_SIZE || '50', 10),
    flushInterval: parseInt(process.env.FLUSH_INTERVAL || '5000', 10),
    allowedDomains: process.env.ALLOWED_DOMAINS?.split(',') || [],
    ignoredPaths: process.env.IGNORED_PATHS?.split(',') || [],
    sampleRate: parseFloat(process.env.SAMPLE_RATE || '1.0'),
  };
}

async function main() {
  const config = loadConfig();

  if (!config.apiKey || !config.orgId) {
    console.error('[NetCrab Agent] Missing required config: API_KEY, ORG_ID');
    process.exit(1);
  }

  const server = new AgentServer(config);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[NetCrab Agent] SIGTERM received, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[NetCrab Agent] SIGINT received, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  await server.start();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('[NetCrab Agent] Fatal error:', error);
    process.exit(1);
  });
}

export { AgentServer, type AgentConfig };

