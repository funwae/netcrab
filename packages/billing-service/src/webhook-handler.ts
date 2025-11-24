/**
 * Stripe Webhook Handler
 * Handles checkout.session.completed and invoice.payment_succeeded events
 */

import Stripe from 'stripe';
import { BillingClickHouseClient } from './clickhouse-client';

export class WebhookHandler {
  private stripe: Stripe;
  private clickhouse: BillingClickHouseClient;

  constructor(apiKey: string, webhookSecret: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
    this.clickhouse = new BillingClickHouseClient();
    this.webhookSecret = webhookSecret;
  }

  private webhookSecret: string;

  /**
   * Handle webhook event
   */
  async handleEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
    }
  }

  /**
   * Handle checkout.session.completed
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    if (session.mode !== 'subscription') return;

    const orgId = session.metadata?.buyer_org_id;
    const packId = session.metadata?.pack_id;
    const billingTier = session.metadata?.billing_tier;

    if (!orgId || !packId || !billingTier) {
      console.error('[Webhook] Missing metadata in checkout session');
      return;
    }

    // Get subscription
    const subscriptionId = session.subscription as string;
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

    // Create buyer_subscription record
    await this.clickhouse.execute(`
      INSERT INTO buyer_subscriptions (
        id,
        org_id,
        pack_id,
        stripe_customer_id,
        stripe_subscription_id,
        billing_tier,
        status,
        current_period_start,
        current_period_end,
        created_at,
        updated_at
      ) VALUES (
        '${subscriptionId}',
        '${orgId}',
        '${packId}',
        '${subscription.customer}',
        '${subscriptionId}',
        '${billingTier}',
        'active',
        '${new Date(subscription.current_period_start * 1000).toISOString()}',
        '${new Date(subscription.current_period_end * 1000).toISOString()}',
        now(),
        now()
      )
    `);

    // Create API key automatically for new buyer
    // (This would be done by marketplace-api, but we can emit an event here)
    console.log(`[Webhook] Subscription created for org ${orgId}, pack ${packId}`);
  }

  /**
   * Handle invoice.payment_succeeded
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) return;

    // Update subscription status if needed
    // (Usually handled by subscription.updated event)
  }

  /**
   * Handle subscription changes
   */
  private async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    let status = 'active';
    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
      status = 'cancelled';
    } else if (subscription.status === 'past_due') {
      status = 'past_due';
    }

    await this.clickhouse.execute(`
      ALTER TABLE buyer_subscriptions
      UPDATE
        status = '${status}',
        current_period_start = '${new Date(subscription.current_period_start * 1000).toISOString()}',
        current_period_end = '${new Date(subscription.current_period_end * 1000).toISOString()}',
        updated_at = now()
      WHERE stripe_subscription_id = '${subscription.id}'
    `);
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string): Stripe.Event | null {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (error) {
      console.error('[Webhook] Signature verification failed:', error);
      return null;
    }
  }
}

