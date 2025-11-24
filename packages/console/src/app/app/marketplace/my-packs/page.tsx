'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import ApiKeyManager from '@/components/ApiKeyManager';
import { api } from '@/lib/api';

interface MyPackSummary {
  packId: string;
  title: string;
  vertical: string;
  category: string;
  latestVersion: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  billingTier: 'standard' | 'pro' | 'enterprise' | 'trial';
  usage: {
    rowsUsed: number;
    rowLimit: number;
    requestsUsed: number;
    requestLimit: number;
    periodStart: string;
    periodEnd: string;
  };
  download: {
    latestSnapshotUrl: string;
  };
  api: {
    docsUrl: string;
    exampleCurl: string;
  };
  nextRefreshAt: string | null;
}

export default function MyPacksPage() {
  const [packs, setPacks] = useState<MyPackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In demo mode, API client handles demo data automatically
    api.getMyPacks()
      .then((data) => {
        setPacks((data.packs || []) as MyPackSummary[]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-navy-900">My Packs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow border border-navy-200 p-6 animate-pulse">
                <div className="h-6 bg-navy-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-navy-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-navy-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-navy-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-navy-900">My Packs</h1>
          <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
            <p className="text-coral-800 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-coral-500 text-white rounded hover:bg-coral-600"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (packs.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-navy-900">My Packs</h1>
          <div className="bg-navy-50 rounded-lg border border-navy-200 p-12 text-center">
            <div className="text-6xl mb-4">🦀</div>
            <p className="text-navy-600 mb-4">You haven't bought any packs yet.</p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 bg-coral-500 text-white rounded hover:bg-coral-600"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const totalRowsUsed = packs.reduce((sum, p) => sum + p.usage.rowsUsed, 0);
  const totalRowLimit = packs.reduce((sum, p) => sum + p.usage.rowLimit, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">My Packs</h1>
          <p className="text-navy-600 mt-1">All the NetCrab data you've unlocked.</p>
        </div>

        {/* Usage Summary */}
        {packs.length > 0 && (
          <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Usage This Month</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-navy-600">
                <span>Total Rows</span>
                <span>
                  {totalRowsUsed.toLocaleString()} / {totalRowLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-coral-500 transition-all"
                  style={{ width: `${Math.min((totalRowsUsed / totalRowLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <div key={pack.packId} className="bg-white rounded-lg shadow border border-navy-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">{pack.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-navy-100 text-navy-700 rounded text-xs">
                      {pack.vertical}
                    </span>
                    <span className="text-xs text-navy-500">{pack.category}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    pack.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : pack.status === 'trial'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-sand-100 text-sand-800'
                  }`}
                >
                  {pack.status}
                </span>
              </div>

              {/* Usage Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-navy-600 mb-1">
                  <span>Rows used</span>
                  <span>
                    {pack.usage.rowsUsed.toLocaleString()} / {pack.usage.rowLimit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral-500 transition-all"
                    style={{
                      width: `${Math.min((pack.usage.rowsUsed / pack.usage.rowLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Next Refresh */}
              {pack.nextRefreshAt && (
                <div className="text-xs text-navy-500 mb-4">
                  Next refresh: {new Date(pack.nextRefreshAt).toLocaleString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={pack.download.latestSnapshotUrl}
                  className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded hover:bg-navy-200 text-sm text-center"
                >
                  Download
                </a>
                <button className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded hover:bg-navy-200 text-sm">
                  API Docs
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* API Key Management */}
        <div className="mt-8">
          <ApiKeyManager />
        </div>
      </div>
    </Layout>
  );
}

