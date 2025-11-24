'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';

export default function PayoutsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">Payouts & Statements</h1>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-navy-600 mb-1">Total Payout to Date</div>
              <div className="text-3xl font-bold text-navy-900">$8,234.56</div>
            </div>
            <div>
              <div className="text-sm text-navy-600 mb-1">Next Payout Date</div>
              <div className="text-xl font-semibold text-navy-900">December 5, 2025</div>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-lg shadow border border-navy-200">
          <div className="p-6 border-b border-navy-200">
            <h2 className="text-xl font-semibold text-navy-900">Payout History</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-navy-200">
                  <th className="text-left py-3 px-4 font-medium text-navy-700">Month</th>
                  <th className="text-right py-3 px-4 font-medium text-navy-700">Amount</th>
                  <th className="text-center py-3 px-4 font-medium text-navy-700">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-navy-700">Statement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-navy-100">
                  <td className="py-3 px-4 text-navy-900">Nov 2025</td>
                  <td className="text-right py-3 px-4 font-semibold text-navy-900">$2,450.32</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 bg-sand-100 text-sand-800 rounded text-xs">Pending</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Link
                      href="/marketplace/payouts/2025-11-01"
                      className="text-coral-600 hover:text-coral-700 text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-navy-100">
                  <td className="py-3 px-4 text-navy-900">Oct 2025</td>
                  <td className="text-right py-3 px-4 font-semibold text-navy-900">$1,988.24</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Paid</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Link
                      href="/marketplace/payouts/2025-10-01"
                      className="text-coral-600 hover:text-coral-700 text-sm"
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
        <div className="bg-navy-50 rounded-lg border border-navy-200 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Payout Account</h3>
          <p className="text-sm text-navy-700 mb-4">
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
                    returnUrl: `${window.location.origin}/marketplace/payouts/connect/callback`,
                    refreshUrl: `${window.location.origin}/marketplace/payouts?status=refresh`,
                  }),
                });
                const { url } = await res.json();
                window.location.href = url;
              } catch (err) {
                console.error('Failed to connect Stripe:', err);
                alert('Failed to connect Stripe. Please try again.');
              }
            }}
            className="px-4 py-2 bg-coral-500 text-white rounded hover:bg-coral-600"
          >
            Connect Stripe Account
          </button>
        </div>
      </div>
    </Layout>
  );
}

