/**
 * NetCrab Billing Service
 * Main entry point
 */

import { MonthlyPayoutJob } from './payout-job';
import { createWebhookServer } from './webhook-server';
import { createInternalAPI } from './internal-api';

const STRIPE_API_KEY = process.env.STRIPE_SECRET_KEY || '';
const WEBHOOK_PORT = parseInt(process.env.WEBHOOK_PORT || '6001', 10);
const INTERNAL_API_PORT = parseInt(process.env.INTERNAL_API_PORT || '6002', 10);

async function main() {
  if (!STRIPE_API_KEY) {
    console.error('[Billing Service] STRIPE_SECRET_KEY not set');
    process.exit(1);
  }

  console.log('[Billing Service] Starting...');

  // Start payout job
  const payoutJob = new MonthlyPayoutJob(STRIPE_API_KEY);
  payoutJob.start();

  // Start webhook server
  const webhookServer = createWebhookServer();
  await webhookServer.listen({ port: WEBHOOK_PORT, host: '0.0.0.0' });
  console.log(`[Billing Service] Webhook server listening on port ${WEBHOOK_PORT}`);

  // Start internal API
  const internalAPI = createInternalAPI();
  await internalAPI.listen({ port: INTERNAL_API_PORT, host: '0.0.0.0' });
  console.log(`[Billing Service] Internal API listening on port ${INTERNAL_API_PORT}`);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('[Billing Service] Shutting down...');
    await webhookServer.close();
    await internalAPI.close();
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error('[Billing Service] Fatal error:', error);
    process.exit(1);
  });
}

export { MonthlyPayoutJob };
export * from './payout-calculator';
export * from './stripe-connect';
export * from './statement-generator';
export * from './webhook-handler';
