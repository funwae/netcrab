/**
 * Stripe Connect Service
 * Handles OAuth flow for seller payouts
 */

import Stripe from 'stripe';
import { MarketplaceClickHouseClient } from './clickhouse-client';

export class ConnectService {
  private stripe: Stripe;
  private clickhouse: MarketplaceClickHouseClient;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
    this.clickhouse = new MarketplaceClickHouseClient();
  }

  /**
   * Create Stripe Connect account link
   */
  async createConnectLink(
    orgId: string,
    returnUrl: string,
    refreshUrl: string
  ): Promise<string> {
    // Get or create Stripe customer
    const billingProfile = await this.clickhouse.query<{
      stripe_customer_id: string;
      stripe_connect_id: string | null;
      country: string;
    }>(`
      SELECT
        stripe_customer_id,
        stripe_connect_id,
        country
      FROM org_billing_profiles
      WHERE org_id = '${orgId}'
      LIMIT 1
    `);

    let connectAccountId: string;

    if (billingProfile.length > 0 && billingProfile[0].stripe_connect_id) {
      connectAccountId = billingProfile[0].stripe_connect_id;
    } else {
      // Create new Express account
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: billingProfile[0]?.country || 'US',
        email: `org-${orgId}@netcrab.net`, // Would come from org settings
        metadata: {
          orgId,
        },
      });

      connectAccountId = account.id;

      // Store in database
      await this.clickhouse.execute(`
        ALTER TABLE org_billing_profiles
        UPDATE stripe_connect_id = '${connectAccountId}'
        WHERE org_id = '${orgId}'
      `);
    }

    // Create account link
    const accountLink = await this.stripe.accountLinks.create({
      account: connectAccountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: 'account_onboarding',
    });

    return accountLink.url;
  }

  /**
   * Handle Connect callback
   */
  async handleCallback(orgId: string, accountId?: string): Promise<boolean> {
    if (!accountId) {
      // Try to get from database
      const profile = await this.clickhouse.query<{
        stripe_connect_id: string;
      }>(`
        SELECT stripe_connect_id
        FROM org_billing_profiles
        WHERE org_id = '${orgId}'
        LIMIT 1
      `);

      if (profile.length === 0 || !profile[0].stripe_connect_id) {
        return false;
      }

      accountId = profile[0].stripe_connect_id;
    }

    // Verify account status
    const account = await this.stripe.accounts.retrieve(accountId);
    if (account.details_submitted && account.payouts_enabled) {
      return true;
    }

    return false;
  }
}

