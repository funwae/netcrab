'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ConnectCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Check callback status
    const account = searchParams.get('account');
    if (account) {
      // Verify connection
      fetch('http://localhost:5000/v1/marketplace/payouts/connect/callback', {
        headers: {
          'X-Org-Id': 'acme',
        },
      })
        .then((res) => {
          if (res.ok) {
            setStatus('success');
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        {status === 'loading' && (
          <div className="text-center">
            <div className="text-4xl mb-4">🦀</div>
            <p className="text-navy-600">Verifying your Stripe connection...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-lg shadow border border-navy-200 p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Stripe Account Connected!</h1>
            <p className="text-navy-600 mb-6">
              Your Stripe account has been successfully connected. You'll now receive payouts automatically.
            </p>
            <Link
              href="/marketplace/payouts"
              className="inline-block px-6 py-3 bg-coral-500 text-white rounded hover:bg-coral-600"
            >
              Go to Payouts
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-lg shadow border border-coral-200 p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Connection Failed</h1>
            <p className="text-navy-600 mb-6">
              We couldn't verify your Stripe account connection. Please try again.
            </p>
            <Link
              href="/marketplace/payouts"
              className="inline-block px-6 py-3 bg-coral-500 text-white rounded hover:bg-coral-600"
            >
              Back to Payouts
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

