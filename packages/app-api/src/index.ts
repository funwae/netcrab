/**
 * NetCrab App API
 *
 * REST API for dashboard insights and marketplace
 */

import { AppApiServer } from './server';

function loadConfig(): {
  port: number;
  clickhouseUrl: string;
  llmProvider?: 'openai' | 'anthropic' | 'mock';
  llmApiKey?: string;
  llmModel?: string;
} {
  return {
    port: parseInt(process.env.PORT || '4000', 10),
    clickhouseUrl: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    llmProvider: (process.env.LLM_PROVIDER || 'mock') as 'openai' | 'anthropic' | 'mock',
    llmApiKey: process.env.LLM_API_KEY,
    llmModel: process.env.LLM_MODEL,
  };
}

async function main() {
  const config = loadConfig();

  const server = new AppApiServer({
    clickhouseUrl: config.clickhouseUrl,
    llmProvider: config.llmProvider,
    llmApiKey: config.llmApiKey,
    llmModel: config.llmModel,
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[App API] SIGTERM received, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[App API] SIGINT received, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  await server.start(config.port);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('[App API] Fatal error:', error);
    process.exit(1);
  });
}

export { AppApiServer };

