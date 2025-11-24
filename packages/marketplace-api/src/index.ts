/**
 * NetCrab Marketplace API
 * Main entry point
 */

import { createServer } from './server';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function main() {
  const server = createServer();

  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[Marketplace API] Listening on port ${PORT}`);
  } catch (error) {
    console.error('[Marketplace API] Error starting server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { createServer };
