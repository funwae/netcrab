/**
 * Monthly Payout Job
 * Runs on 5th of each month to calculate and execute payouts
 */

import * as cron from 'node-cron';
import { BillingClickHouseClient } from './clickhouse-client';
import { PayoutCalculator } from './payout-calculator';
import { StripeConnectService } from './stripe-connect';
import { StatementGenerator } from './statement-generator';

export class MonthlyPayoutJob {
  private clickhouse: BillingClickHouseClient;
  private calculator: PayoutCalculator;
  private stripe: StripeConnectService;
  private generator: StatementGenerator;

  constructor(stripeApiKey: string) {
    this.clickhouse = new BillingClickHouseClient();
    this.calculator = new PayoutCalculator(this.clickhouse);
    this.stripe = new StripeConnectService(stripeApiKey);
    this.generator = new StatementGenerator(this.clickhouse);
  }

  /**
   * Start scheduled job (5th of month, 06:00 UTC)
   */
  start(): void {
    cron.schedule('0 6 5 * *', async () => {
      console.log('[Payout Job] Running monthly payout calculation...');
      await this.run();
    });

    console.log('[Payout Job] Scheduled monthly payout job');
  }

  /**
   * Run payout calculation and execution
   */
  async run(): Promise<void> {
    // Get previous month
    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    try {
      // Calculate payouts
      const payouts = await this.calculator.calculatePayouts(month);

      // Execute Stripe transfers
      for (const payout of payouts) {
        // Get org's Stripe Connect account ID
        const billingProfile = await this.clickhouse.query<{
          stripe_connect_id: string;
        }>(`
          SELECT stripe_connect_id
          FROM org_billing_profiles
          WHERE org_id = '${payout.orgId}'
            AND role IN ('seller', 'both')
          LIMIT 1
        `);

        if (billingProfile.length > 0 && billingProfile[0].stripe_connect_id) {
          try {
            const transfer = await this.stripe.transferToSeller(
              billingProfile[0].stripe_connect_id,
              payout.amount,
              'usd',
              `NetCrab marketplace payout for ${month.toISOString().split('T')[0]}`
            );

            // Update payout record
            await this.clickhouse.execute(`
              ALTER TABLE marketplace_org_payouts
              UPDATE
                status = 'paid',
                stripe_transfer_id = '${transfer.id}',
                updated_at = now()
              WHERE payout_id = '${payout.payoutId}'
            `);

            console.log(`[Payout Job] Paid ${payout.amount} to org ${payout.orgId}`);
          } catch (error) {
            console.error(`[Payout Job] Error transferring to ${payout.orgId}:`, error);
            await this.clickhouse.execute(`
              ALTER TABLE marketplace_org_payouts
              UPDATE status = 'failed', updated_at = now()
              WHERE payout_id = '${payout.payoutId}'
            `);
          }
        } else {
          console.log(`[Payout Job] Org ${payout.orgId} has no Stripe Connect account, leaving as pending`);
        }
      }

      console.log(`[Payout Job] Completed payout processing for ${month.toISOString().split('T')[0]}`);
    } catch (error) {
      console.error('[Payout Job] Fatal error:', error);
    }
  }

  /**
   * Manually trigger payout job
   */
  async trigger(month?: Date): Promise<void> {
    const targetMonth = month || new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    await this.run();
  }
}
