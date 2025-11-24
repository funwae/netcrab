/**
 * Stripe Connect Integration
 * Handles seller payout account connections and transfers
 */

import Stripe from 'stripe';

export class StripeConnectService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  /**
   * Create Stripe Connect account link for onboarding
   */
  async createAccountLink(accountId: string, returnUrl: string, refreshUrl: string): Promise<string> {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: 'account_onboarding',
    });

    return accountLink.url;
  }

  /**
   * Create or retrieve Stripe Connect account
   */
  async getOrCreateAccount(orgId: string, email: string): Promise<Stripe.Account> {
    // In production, would check database for existing account
    // For now, create new account
    const account = await this.stripe.accounts.create({
      type: 'express',
      email,
      metadata: {
        orgId,
      },
    });

    return account;
  }

  /**
   * Transfer funds to seller account
   */
  async transferToSeller(
    connectAccountId: string,
    amount: number,
    currency: string = 'usd',
    description?: string
  ): Promise<Stripe.Transfer> {
    const transfer = await this.stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      destination: connectAccountId,
      description: description || 'NetCrab marketplace payout',
    });

    return transfer;
  }

  /**
   * Get account status
   */
  async getAccountStatus(accountId: string): Promise<{
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
  }> {
    const account = await this.stripe.accounts.retrieve(accountId);

    return {
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    };
  }
}
