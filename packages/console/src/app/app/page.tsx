'use client';

import { api, type OverviewResponse } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const demoMode = process.env.NEXT_PUBLIC_ENV === 'demo' || process.env.NETCRAB_DEMO_MODE === 'true';
    const params = {
      orgId: demoMode ? 'demo_netcrab' : 'acme',
      productId: 'crm-web',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    };

    api
      .getOverview(params)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-netcrab-card rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-netcrab-card rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4">
        <p className="text-netcrab-crab">Error loading overview: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-netcrab-muted">No data available</div>
    );
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-netcrab-text">Overview</h1>
          <p className="text-netcrab-muted mt-1">Product health at a glance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <div className="text-sm text-netcrab-muted mb-1">Friction Index</div>
            <div className="text-3xl font-bold text-netcrab-text mb-1">{data.frictionIndex.toFixed(2)}</div>
            <div className="text-xs text-netcrab-muted">Lower is better</div>
            <div className="mt-4 h-2 bg-netcrab-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-netcrab-crab transition-all"
                style={{ width: `${Math.min(data.frictionIndex * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <div className="text-sm text-netcrab-muted mb-1">Efficiency Score</div>
            <div className="text-3xl font-bold text-netcrab-text mb-1">{(data.efficiencyScore * 100).toFixed(1)}%</div>
            <div className="text-xs text-netcrab-muted">Higher is better</div>
            <div className="mt-4 h-2 bg-netcrab-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-netcrab-aqua transition-all"
                style={{ width: `${data.efficiencyScore * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <div className="text-sm text-netcrab-muted mb-1">Total Sessions</div>
            <div className="text-3xl font-bold text-netcrab-text mb-1">{data.sessions.toLocaleString()}</div>
            <div className="text-xs text-netcrab-muted">Last 30 days</div>
          </div>
        </div>

        {/* Top Hotspots */}
        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
          <h2 className="text-xl font-semibold text-netcrab-text mb-4">Top Friction Hotspots</h2>
          <div className="space-y-2">
            {data.topHotspots.slice(0, 5).map((hotspot) => (
              <div
                key={hotspot.screenId}
                className="flex items-center justify-between p-3 border border-netcrab-surface rounded-lg hover:border-netcrab-aqua/30 transition-colors"
              >
                <div>
                  <div className="font-medium text-netcrab-text">{hotspot.route}</div>
                  <div className="text-sm text-netcrab-muted">{hotspot.screenId}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-netcrab-text">{hotspot.friction.toFixed(2)}</div>
                  <div className="text-xs text-netcrab-muted">{hotspot.impactSessions} sessions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note of the Day */}
        {data.noteOfTheDay && (
          <div className="bg-netcrab-crab/10 border border-netcrab-crab/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-netcrab-text mb-2">🦀 Crab Note of the Day</h2>
            <h3 className="text-lg font-medium text-netcrab-text mb-2">{data.noteOfTheDay.title}</h3>
            <p className="text-netcrab-muted">{data.noteOfTheDay.summary}</p>
          </div>
        )}
      </div>
  );
}
