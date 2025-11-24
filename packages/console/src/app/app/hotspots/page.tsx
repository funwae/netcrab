'use client';

import { api, type HotspotDetail } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function HotspotsPage() {
  const [hotspots, setHotspots] = useState<HotspotDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotDetail | null>(null);

  useEffect(() => {
    const params = {
      orgId: 'acme',
      productId: 'crm-web',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
      limit: 20,
    };

    api
      .getHotspots(params)
      .then((response) => setHotspots(response.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (

        <div className="flex items-center justify-center h-64">
          <div className="text-netcrab-muted">Loading hotspots...</div>
        </div>

    );
  }

  if (error) {
    return (

        <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4 text-netcrab-crab">
          Error: {error}
        </div>

    );
  }

  return (

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-netcrab-text">Hotspots</h1>

        <div className="bg-netcrab-card rounded-lg border border-netcrab-surface overflow-hidden">
          <table className="min-w-full divide-y divide-netcrab-surface">
            <thead className="bg-netcrab-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-netcrab-text uppercase tracking-wider">
                  Screen / Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-netcrab-text uppercase tracking-wider">
                  Friction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-netcrab-text uppercase tracking-wider">
                  Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-netcrab-text uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-netcrab-text uppercase tracking-wider">
                  Rage Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-netcrab-text uppercase tracking-wider">
                  Dropoff
                </th>
              </tr>
            </thead>
            <tbody className="bg-netcrab-card divide-y divide-netcrab-surface">
              {hotspots.map((hotspot) => (
                <tr
                  key={hotspot.screenId}
                  className="hover:bg-netcrab-surface/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedHotspot(hotspot)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-netcrab-text">{hotspot.screenId}</div>
                    <div className="text-sm text-netcrab-muted">{hotspot.route}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-semibold text-netcrab-text">
                        {hotspot.avgFriction.toFixed(2)}
                      </span>
                      <div className="ml-2 w-16 h-2 bg-netcrab-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-netcrab-crab"
                          style={{ width: `${hotspot.avgFriction * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-netcrab-muted">
                    {hotspot.sessions.toLocaleString()} sessions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-netcrab-text">
                      {hotspot.avgEfficiency.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-netcrab-muted">
                      {(hotspot.rageClickRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-netcrab-muted">
                      {(hotspot.dropoffRate * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedHotspot && (
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-netcrab-text">{selectedHotspot.screenId}</h2>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-netcrab-muted hover:text-netcrab-text"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-netcrab-muted">Route</div>
                <div className="font-medium text-netcrab-text">{selectedHotspot.route}</div>
              </div>
              <div>
                <div className="text-sm text-netcrab-muted">Sessions</div>
                <div className="font-medium text-netcrab-text">
                  {selectedHotspot.sessions.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-netcrab-muted">Avg Time Spent</div>
                <div className="font-medium text-netcrab-text">
                  {Math.round(selectedHotspot.avgTimeSpentMs / 1000)}s
                </div>
              </div>
              <div>
                <div className="text-sm text-netcrab-muted">Rage Click Rate</div>
                <div className="font-medium text-netcrab-text">
                  {(selectedHotspot.rageClickRate * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

  );
}

