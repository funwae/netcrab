'use client';

import Layout from '@/components/Layout';
import { api, type Flow } from '@/lib/api';
import { useEffect, useState } from 'react';

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
          <div className="text-netcrab-muted">Loading flows...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-netcrab-crab/20 border border-netcrab-crab rounded-lg p-4 text-netcrab-crab">
          Error: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-netcrab-text">Flows</h1>

        <div className="grid grid-cols-1 gap-4">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6 hover:border-netcrab-aqua/30 transition-colors cursor-pointer"
              onClick={() => setSelectedFlow(flow)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-netcrab-text">{flow.label}</h3>
                <span className="text-sm text-netcrab-muted">{flow.sessions.toLocaleString()} sessions</span>
              </div>

              {/* Flow Path Visualization */}
              <div className="flex items-center space-x-2 mb-4">
                {flow.path.map((screen, index) => (
                  <div key={index} className="flex items-center">
                    <div className="px-3 py-1 bg-netcrab-surface text-netcrab-text rounded text-sm font-medium">
                      {screen}
                    </div>
                    {index < flow.path.length - 1 && (
                      <span className="mx-2 text-netcrab-muted">→</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-netcrab-muted">Completion Rate</div>
                  <div className="font-semibold text-netcrab-text">
                    {(flow.completionRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-netcrab-muted">Avg Friction</div>
                  <div className="font-semibold text-netcrab-text">{flow.avgFriction.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-netcrab-muted">Avg Duration</div>
                  <div className="font-semibold text-netcrab-text">{flow.avgDurationSec}s</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedFlow && (
          <div className="bg-netcrab-card rounded-lg border border-netcrab-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-netcrab-text">{selectedFlow.label}</h2>
              <button
                onClick={() => setSelectedFlow(null)}
                className="text-netcrab-muted hover:text-netcrab-text"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-netcrab-muted mb-2">Flow Path</div>
                <div className="flex items-center space-x-2">
                  {selectedFlow.path.map((screen, index) => (
                    <div key={index} className="flex items-center">
                      <div className="px-4 py-2 bg-netcrab-surface text-netcrab-text rounded font-medium">
                        {screen}
                      </div>
                      {index < selectedFlow.path.length - 1 && (
                        <span className="mx-2 text-netcrab-muted text-xl">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-netcrab-muted">Sessions</div>
                  <div className="font-semibold text-netcrab-text">
                    {selectedFlow.sessions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-netcrab-muted">Completion Rate</div>
                  <div className="font-semibold text-netcrab-text">
                    {(selectedFlow.completionRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-netcrab-muted">Avg Friction</div>
                  <div className="font-semibold text-netcrab-text">
                    {selectedFlow.avgFriction.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-netcrab-muted">Avg Duration</div>
                  <div className="font-semibold text-netcrab-text">{selectedFlow.avgDurationSec}s</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

