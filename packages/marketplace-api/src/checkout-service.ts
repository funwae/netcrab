/**
 * Checkout Service
 * Creates Stripe Checkout sessions for pack purchases
 */

import Stripe from 'stripe';

export interface CheckoutSessionRequest {
  packId: string;
  billingTier: 'standard' | 'pro' | 'enterprise';
  successUrl: string;
  cancelUrl: string;
  orgId: string;
}

export class CheckoutService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  /**
   * Create a checkout session for a pack purchase
   */
  async createCheckoutSession(request: CheckoutSessionRequest): Promise<string> {
    // Map pack + tier to Stripe price ID
    // In production, this would come from a config or database
    const priceId = this.getPriceId(request.packId, request.billingTier);

    // Get or create Stripe customer
    let customerId = await this.getOrCreateCustomer(request.orgId);

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
      metadata: {
        pack_id: request.packId,
        billing_tier: request.billingTier,
        buyer_org_id: request.orgId,
      },
    });

    return session.url || '';
  }

  /**
   * Get or create Stripe customer for org
   */
  private async getOrCreateCustomer(orgId: string): Promise<string> {
    // In production, would check org_billing_profiles for existing customer
    // For now, create new customer
    const customer = await this.stripe.customers.create({
      metadata: {
        orgId,
      },
    });

    return customer.id;
  }

  /**
   * Map pack + tier to Stripe price ID
   */
  private getPriceId(packId: string, tier: string): string {
    // In production, this would come from database or config
    // For now, return placeholder (would be actual Stripe price IDs)
    const priceMap: Record<string, Record<string, string>> = {
      'ux_friction_b2b_crm_v1': {
        standard: 'price_standard_placeholder',
        pro: 'price_pro_placeholder',
        enterprise: 'price_enterprise_placeholder',
      },
    };

    return priceMap[packId]?.[tier] || 'price_standard_placeholder';
  }
}

