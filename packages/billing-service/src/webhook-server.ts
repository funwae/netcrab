/**
 * Webhook Server
 * HTTP endpoint for Stripe webhooks
 */

import Fastify from 'fastify';
import { WebhookHandler } from './webhook-handler';

export function createWebhookServer() {
  const fastify = Fastify({ logger: true });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const stripeKey = process.env.STRIPE_SECRET_KEY || '';

  if (!webhookSecret || !stripeKey) {
    console.error('[Webhook Server] Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY');
  }

  const handler = new WebhookHandler(stripeKey, webhookSecret);

  // Stripe webhook endpoint
  fastify.post('/webhooks/stripe', async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;
    if (!signature) {
      reply.code(400).send({ error: 'Missing stripe-signature header' });
      return;
    }

    const payload = JSON.stringify(request.body);
    const event = handler.verifySignature(payload, signature);

    if (!event) {
      reply.code(400).send({ error: 'Invalid signature' });
      return;
    }

    try {
      await handler.handleEvent(event);
      reply.send({ received: true });
    } catch (error: any) {
      console.error('[Webhook Server] Error handling event:', error);
      reply.code(500).send({ error: error.message });
    }
  });

  return fastify;
}

