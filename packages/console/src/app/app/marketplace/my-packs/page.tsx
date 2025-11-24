'use client';

import { useEffect, useState } from 'react';
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

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-netcrab-text">My Packs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6 animate-pulse">
                <div className="h-6 bg-netcrab-surface rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-netcrab-surface rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-netcrab-surface rounded w-full mb-4"></div>
                <div className="h-8 bg-netcrab-surface rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>

    );
  }

  if (error) {
    return (

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-netcrab-text">My Packs</h1>
          <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4">
            <p className="text-netcrab-crab mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-netcrab-crab text-white rounded hover:bg-netcrab-crab/90"
            >
              Retry
            </button>
          </div>
        </div>

    );
  }

  if (packs.length === 0) {
    return (

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-netcrab-text">My Packs</h1>
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-12 text-center">
            <div className="text-6xl mb-4">🦀</div>
            <p className="text-netcrab-muted mb-4">You haven't bought any packs yet.</p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 bg-netcrab-crab text-white rounded hover:bg-netcrab-crab/90"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>

    );
  }

  const totalRowsUsed = packs.reduce((sum, p) => sum + p.usage.rowsUsed, 0);
  const totalRowLimit = packs.reduce((sum, p) => sum + p.usage.rowLimit, 0);

  return (

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-netcrab-text">My Packs</h1>
          <p className="text-netcrab-muted mt-1">All the NetCrab data you've unlocked.</p>
        </div>

        {/* Usage Summary */}
        {packs.length > 0 && (
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <h2 className="text-lg font-semibold text-netcrab-text mb-4">Usage This Month</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-netcrab-muted">
                <span>Total Rows</span>
                <span>
                  {totalRowsUsed.toLocaleString()} / {totalRowLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-netcrab-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-netcrab-crab transition-all"
                  style={{ width: `${Math.min((totalRowsUsed / totalRowLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <div key={pack.packId} className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-netcrab-text">{pack.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-netcrab-aqua/20 text-netcrab-aqua rounded text-xs">
                      {pack.vertical}
                    </span>
                    <span className="text-xs text-netcrab-muted">{pack.category}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    pack.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : pack.status === 'trial'
                      ? 'bg-netcrab-aqua/20 text-netcrab-aqua'
                      : 'bg-netcrab-muted/20 text-netcrab-muted'
                  }`}
                >
                  {pack.status}
                </span>
              </div>

              {/* Usage Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-netcrab-muted mb-1">
                  <span>Rows used</span>
                  <span>
                    {pack.usage.rowsUsed.toLocaleString()} / {pack.usage.rowLimit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-netcrab-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-netcrab-crab transition-all"
                    style={{
                      width: `${Math.min((pack.usage.rowsUsed / pack.usage.rowLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Next Refresh */}
              {pack.nextRefreshAt && (
                <div className="text-xs text-netcrab-muted mb-4">
                  Next refresh: {new Date(pack.nextRefreshAt).toLocaleString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={pack.download.latestSnapshotUrl}
                  className="flex-1 px-4 py-2 bg-netcrab-surface text-netcrab-text rounded hover:bg-netcrab-surface/80 text-sm text-center transition-colors"
                >
                  Download
                </a>
                <button className="flex-1 px-4 py-2 bg-netcrab-surface text-netcrab-text rounded hover:bg-netcrab-surface/80 text-sm transition-colors">
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

  );
}

