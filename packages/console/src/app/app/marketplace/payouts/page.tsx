'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';

export default function PayoutsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-netcrab-text">Payouts & Statements</h1>

        {/* Summary */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-netcrab-muted mb-1">Total Payout to Date</div>
              <div className="text-3xl font-bold text-netcrab-text">$8,234.56</div>
            </div>
            <div>
              <div className="text-sm text-netcrab-muted mb-1">Next Payout Date</div>
              <div className="text-xl font-semibold text-netcrab-text">December 5, 2025</div>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface">
          <div className="p-6 border-b border-netcrab-surface">
            <h2 className="text-xl font-semibold text-netcrab-text">Payout History</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-netcrab-surface">
                  <th className="text-left py-3 px-4 font-medium text-netcrab-text">Month</th>
                  <th className="text-right py-3 px-4 font-medium text-netcrab-text">Amount</th>
                  <th className="text-center py-3 px-4 font-medium text-netcrab-text">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-netcrab-text">Statement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-netcrab-surface/50">
                  <td className="py-3 px-4 text-netcrab-text">Nov 2025</td>
                  <td className="text-right py-3 px-4 font-semibold text-netcrab-text">$2,450.32</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 bg-netcrab-aqua/20 text-netcrab-aqua rounded text-xs">Pending</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Link
                      href="/app/marketplace/payouts/2025-11-01"
                      className="text-netcrab-crab hover:text-netcrab-crab/80 text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-netcrab-surface/50">
                  <td className="py-3 px-4 text-netcrab-text">Oct 2025</td>
                  <td className="text-right py-3 px-4 font-semibold text-netcrab-text">$1,988.24</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Paid</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Link
                      href="/app/marketplace/payouts/2025-10-01"
                      className="text-netcrab-crab hover:text-netcrab-crab/80 text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stripe Connect */}
        <div className="bg-netcrab-surface rounded-lg border border-netcrab-surface p-6">
          <h3 className="text-lg font-semibold text-netcrab-text mb-2">Payout Account</h3>
          <p className="text-sm text-netcrab-muted mb-4">
            Connect your Stripe account to receive payouts automatically.
          </p>
          <button
            onClick={async () => {
              try {
                const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
                const res = await fetch(`${marketplaceUrl}/v1/marketplace/payouts/connect-link`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Org-Id': 'acme',
                  },
                  body: JSON.stringify({
                    returnUrl: `${window.location.origin}/app/marketplace/payouts/connect/callback`,
                    refreshUrl: `${window.location.origin}/app/marketplace/payouts?status=refresh`,
                  }),
                });
                const { url } = await res.json();
                window.location.href = url;
              } catch (err) {
                console.error('Failed to connect Stripe:', err);
                alert('Failed to connect Stripe. Please try again.');
              }
            }}
            className="px-4 py-2 bg-netcrab-crab text-white rounded hover:bg-netcrab-crab/90"
          >
            Connect Stripe Account
          </button>
        </div>
      </div>
    </Layout>
  );
}

