'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function PurchaseButton({ packId }: { packId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    const selectedTier = (document.querySelector('input[name="tier"]:checked') as HTMLInputElement)
      ?.value as 'standard' | 'pro' | 'enterprise';

    if (!selectedTier) {
      setError('Please select a plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${marketplaceUrl}/v1/marketplace/packs/${packId}/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': 'acme', // In production, would come from auth
        },
        body: JSON.stringify({
          billingTier: selectedTier,
          successUrl: `${window.location.origin}/marketplace/my-packs?session=success`,
          cancelUrl: `${window.location.href}?session=cancelled`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to start checkout');
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-coral-50 border border-coral-200 rounded text-coral-800 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full px-6 py-3 bg-coral-500 text-white rounded hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting checkout...' : 'Subscribe & Get Access'}
      </button>
    </div>
  );
}

interface PackDetail {
  id: string;
  title: string;
  longDesc: string;
  vertical: string;
  category: string;
  updateFrequency: string;
  schema: { fields: Array<{ name: string; type: string; description: string }> };
  sampleData: unknown[];
  pricing: { monthly: string; currency: string };
  eligibility: {
    minOrgs: number;
    minSessions: number;
    orgCountCurrent: number;
    sessionCountCurrent: number;
  };
}

export default function PackDetailPage() {
  const params = useParams();
  const packId = params.packId as string;
  const [pack, setPack] = useState<PackDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const marketplaceUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:5000';
    fetch(`${marketplaceUrl}/v1/packs/${packId}`)
      .then(res => res.json())
      .then(data => {
        setPack(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading pack:', err);
        setLoading(false);
      });
  }, [packId]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!pack) {
    return <div className="text-center py-12">Pack not found</div>;
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">{pack.title}</h1>
        <div className="flex items-center gap-4 text-sm text-navy-600 mb-6">
          <span className="px-2 py-1 bg-navy-100 rounded">{pack.vertical}</span>
          <span>{pack.category}</span>
          <span>{pack.updateFrequency}</span>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-navy-700">{pack.longDesc}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-navy-600">Contributing Products</div>
              <div className="text-2xl font-bold text-navy-900">{pack.eligibility.orgCountCurrent}+</div>
            </div>
            <div>
              <div className="text-sm text-navy-600">Sessions per Month</div>
              <div className="text-2xl font-bold text-navy-900">
                {pack.eligibility.sessionCountCurrent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Schema</h2>
          <div className="space-y-2">
            {pack.schema.fields.map((field) => (
              <div key={field.name} className="flex justify-between py-2 border-b border-navy-100">
                <div>
                  <span className="font-medium text-navy-900">{field.name}</span>
                  <span className="text-sm text-navy-500 ml-2">({field.type})</span>
                </div>
                <span className="text-sm text-navy-600">{field.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="space-y-4 mb-6">
            <label className="flex items-center">
              <input type="radio" name="tier" value="standard" defaultChecked className="mr-2" />
              <div>
                <div className="font-medium">Standard - $499/mo</div>
                <div className="text-sm text-navy-600">100k rows/month, 60 requests/minute</div>
              </div>
            </label>
            <label className="flex items-center">
              <input type="radio" name="tier" value="pro" className="mr-2" />
              <div>
                <div className="font-medium">Pro - $1,500/mo</div>
                <div className="text-sm text-navy-600">1M rows/month, 120 requests/minute</div>
              </div>
            </label>
            <label className="flex items-center">
              <input type="radio" name="tier" value="enterprise" className="mr-2" />
              <div>
                <div className="font-medium">Enterprise - Custom</div>
                <div className="text-sm text-navy-600">10M+ rows/month, custom limits</div>
              </div>
            </label>
          </div>
          <PurchaseButton packId={packId} />
        </div>
      </div>
    </div>
  );
}

