'use client';

import { useEffect, useState } from 'react';
import { api, type OverviewResponse } from '@/lib/api';

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Default params - in production would come from context/state
    // In demo mode, use demo_netcrab org
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
        <div className="h-8 bg-navy-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-navy-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
        <p className="text-coral-800">Error loading overview: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">Overview</h1>
        <p className="text-navy-600 mt-1">Product health at a glance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <div className="text-sm text-navy-600 mb-1">Friction Index</div>
          <div className="text-3xl font-bold text-navy-900">{data.frictionIndex.toFixed(2)}</div>
          <div className="text-xs text-navy-500 mt-2">Lower is better</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <div className="text-sm text-navy-600 mb-1">Efficiency Score</div>
          <div className="text-3xl font-bold text-navy-900">{(data.efficiencyScore * 100).toFixed(1)}%</div>
          <div className="text-xs text-navy-500 mt-2">Higher is better</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
          <div className="text-sm text-navy-600 mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-navy-900">{data.sessions.toLocaleString()}</div>
          <div className="text-xs text-navy-500 mt-2">Last 30 days</div>
        </div>
      </div>

      {/* Top Hotspots */}
      <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
        <h2 className="text-xl font-semibold text-navy-900 mb-4">Top Friction Hotspots</h2>
        <div className="space-y-2">
          {data.topHotspots.slice(0, 5).map((hotspot) => (
            <div key={hotspot.screenId} className="flex items-center justify-between p-3 border border-navy-100 rounded">
              <div>
                <div className="font-medium text-navy-900">{hotspot.route}</div>
                <div className="text-sm text-navy-500">{hotspot.screenId}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-navy-900">{hotspot.friction.toFixed(2)}</div>
                <div className="text-xs text-navy-500">{hotspot.impactSessions} sessions</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note of the Day */}
      {data.noteOfTheDay && (
        <div className="bg-coral-50 border border-coral-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-navy-900 mb-2">Crab Note of the Day</h2>
          <h3 className="text-lg font-medium text-navy-800 mb-2">{data.noteOfTheDay.title}</h3>
          <p className="text-navy-700">{data.noteOfTheDay.summary}</p>
        </div>
      )}
    </div>
  );
}
