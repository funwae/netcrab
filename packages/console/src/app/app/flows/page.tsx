'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api, type Flow } from '@/lib/api';

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  useEffect(() => {
    const params = {
      orgId: 'acme',
      productId: 'crm-web',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
      limit: 10,
    };

    api
      .getFlows(params)
      .then((response) => setFlows(response.flows))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-navy-600">Loading flows...</div>
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
        <h1 className="text-3xl font-bold text-navy-900">Flows</h1>

        <div className="grid grid-cols-1 gap-4">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="bg-white rounded-lg shadow border border-navy-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedFlow(flow)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">{flow.label}</h3>
                <span className="text-sm text-navy-600">{flow.sessions.toLocaleString()} sessions</span>
              </div>

              {/* Flow Path Visualization */}
              <div className="flex items-center space-x-2 mb-4">
                {flow.path.map((screen, index) => (
                  <div key={index} className="flex items-center">
                    <div className="px-3 py-1 bg-navy-100 text-navy-700 rounded text-sm font-medium">
                      {screen}
                    </div>
                    {index < flow.path.length - 1 && (
                      <span className="mx-2 text-navy-400">→</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-navy-600">Completion Rate</div>
                  <div className="font-semibold text-navy-900">
                    {(flow.completionRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-navy-600">Avg Friction</div>
                  <div className="font-semibold text-navy-900">{flow.avgFriction.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-navy-600">Avg Duration</div>
                  <div className="font-semibold text-navy-900">{flow.avgDurationSec}s</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedFlow && (
          <div className="bg-white rounded-lg shadow border border-navy-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-navy-900">{selectedFlow.label}</h2>
              <button
                onClick={() => setSelectedFlow(null)}
                className="text-navy-500 hover:text-navy-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-navy-600 mb-2">Flow Path</div>
                <div className="flex items-center space-x-2">
                  {selectedFlow.path.map((screen, index) => (
                    <div key={index} className="flex items-center">
                      <div className="px-4 py-2 bg-navy-100 text-navy-700 rounded font-medium">
                        {screen}
                      </div>
                      {index < selectedFlow.path.length - 1 && (
                        <span className="mx-2 text-navy-400 text-xl">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-navy-600">Sessions</div>
                  <div className="font-semibold text-navy-900">
                    {selectedFlow.sessions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-navy-600">Completion Rate</div>
                  <div className="font-semibold text-navy-900">
                    {(selectedFlow.completionRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-navy-600">Avg Friction</div>
                  <div className="font-semibold text-navy-900">
                    {selectedFlow.avgFriction.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-navy-600">Avg Duration</div>
                  <div className="font-semibold text-navy-900">{selectedFlow.avgDurationSec}s</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

