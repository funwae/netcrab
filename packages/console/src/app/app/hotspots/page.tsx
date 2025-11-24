'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api, type HotspotDetail } from '@/lib/api';

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
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading hotspots...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-coral-50 border border-coral-200 rounded-lg p-4 text-coral-800">
          Error: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">Hotspots</h1>

        <div className="bg-white rounded-lg shadow border border-navy-200 overflow-hidden">
          <table className="min-w-full divide-y divide-navy-200">
            <thead className="bg-navy-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">
                  Screen / Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">
                  Friction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">
                  Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">
                  Rage Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">
                  Dropoff
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-navy-200">
              {hotspots.map((hotspot) => (
                <tr
                  key={hotspot.screenId}
                  className="hover:bg-navy-50 cursor-pointer"
                  onClick={() => setSelectedHotspot(hotspot)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-navy-900">{hotspot.screenId}</div>
                    <div className="text-sm text-navy-500">{hotspot.route}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-semibold text-navy-900">
                        {hotspot.avgFriction.toFixed(2)}
                      </span>
                      <div className="ml-2 w-16 h-2 bg-navy-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-coral-500"
                          style={{ width: `${hotspot.avgFriction * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                    {hotspot.sessions.toLocaleString()} sessions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-navy-700">
                      {hotspot.avgEfficiency.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-navy-600">
                      {(hotspot.rageClickRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-navy-600">
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
          <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-navy-900">{selectedHotspot.screenId}</h2>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-navy-500 hover:text-navy-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-navy-600">Route</div>
                <div className="font-medium text-navy-900">{selectedHotspot.route}</div>
              </div>
              <div>
                <div className="text-sm text-navy-600">Sessions</div>
                <div className="font-medium text-navy-900">
                  {selectedHotspot.sessions.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-navy-600">Avg Time Spent</div>
                <div className="font-medium text-navy-900">
                  {Math.round(selectedHotspot.avgTimeSpentMs / 1000)}s
                </div>
              </div>
              <div>
                <div className="text-sm text-navy-600">Rage Click Rate</div>
                <div className="font-medium text-navy-900">
                  {(selectedHotspot.rageClickRate * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

