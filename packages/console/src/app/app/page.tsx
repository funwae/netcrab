'use client';

import { api, type OverviewResponse, type Flow, type CrabNote } from '@/lib/api';
import { useEffect, useState } from 'react';
import NetCrabHeroCard from '@/components/shared/NetCrabHeroCard';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function OverviewPage() {
  const [overviewData, setOverviewData] = useState<OverviewResponse | null>(null);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [crabNotes, setCrabNotes] = useState<CrabNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const demoMode = process.env.NEXT_PUBLIC_ENV === 'demo' || process.env.NETCRAB_DEMO_MODE === 'true';

  useEffect(() => {
    const params = {
      orgId: demoMode ? 'demo_netcrab' : 'acme',
      productId: 'crm-web',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    };

    Promise.all([
      api.getOverview(params).catch((err) => {
        console.error('Failed to load overview:', err);
        return null;
      }),
      api.getFlows(params).catch((err) => {
        console.error('Failed to load flows:', err);
        return { flows: [] };
      }),
      api.getCrabNotes(params).catch((err) => {
        console.error('Failed to load crab notes:', err);
        return { notes: [] };
      }),
    ])
      .then(([overview, flowsRes, notesRes]) => {
        setOverviewData(overview);
        setFlows(flowsRes?.flows || []);
        setCrabNotes(notesRes?.notes || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Generate chart data for sessions over time
  const sessionsChartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: Math.floor(Math.random() * 500) + 300,
      friction: (Math.random() * 0.2 + 0.35).toFixed(2),
    };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-netcrab-card rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-netcrab-card rounded animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-48 bg-netcrab-card rounded animate-pulse"></div>
            <div className="h-48 bg-netcrab-card rounded animate-pulse"></div>
          </div>
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

  if (!overviewData) {
    return <div className="text-netcrab-muted">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-netcrab-text">Overview</h1>
        <p className="text-netcrab-muted mt-1">Product health at a glance</p>
      </div>

      {/* Above-the-fold Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Hero Card */}
        <div>
          <NetCrabHeroCard
            orgLabel="demo-netcr"
            productLabel="crm-web"
            frictionIndex={overviewData.frictionIndex}
            efficiencyScore={overviewData.efficiencyScore}
            sessions={overviewData.sessions}
            hotspotsCount={overviewData.topHotspots.length}
            showLabel="Your product"
          />
        </div>

        {/* Right: Top Flows and Crab Notes */}
        <div className="space-y-6">
          {/* Top Flows Card */}
          <div className="bg-netcrab-card rounded-lg border border-netcrab-border p-6">
            <h2 className="text-xl font-semibold text-netcrab-text mb-4">Top Flows</h2>
            <div className="space-y-3">
              {flows.slice(0, 3).map((flow) => (
                <div
                  key={flow.id}
                  className="p-3 bg-netcrab-surface rounded-lg border border-netcrab-border/50 hover:border-netcrab-shell/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-netcrab-text">{flow.label}</div>
                    <div className="text-sm text-netcrab-muted">
                      {(flow.completionRate * 100).toFixed(0)}% complete
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-netcrab-muted">
                    <span>Friction: {flow.avgFriction.toFixed(2)}</span>
                    <span>·</span>
                    <span>{flow.sessions.toLocaleString()} sessions</span>
                  </div>
                </div>
              ))}
              {flows.length === 0 && (
                <div className="text-sm text-netcrab-muted">No flow data available</div>
              )}
            </div>
          </div>

          {/* Crab Notes Card */}
          <div className="bg-netcrab-crab/10 rounded-lg border border-netcrab-crab/30 p-6">
            <h2 className="text-xl font-semibold text-netcrab-text mb-4 flex items-center gap-2">
              <span>🦀</span>
              <span>Latest Crab Notes</span>
            </h2>
            <div className="space-y-3">
              {crabNotes.slice(0, 2).map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-netcrab-surface/50 rounded-lg border border-netcrab-crab/20"
                >
                  <div className="font-medium text-netcrab-text mb-1 text-sm">{note.title}</div>
                  <div className="text-xs text-netcrab-muted line-clamp-2">{note.summary}</div>
                </div>
              ))}
              {crabNotes.length === 0 && (
                <div className="text-sm text-netcrab-muted">No crab notes available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wide Sessions Chart */}
      <div className="bg-netcrab-card rounded-lg border border-netcrab-border p-6">
        <h2 className="text-xl font-semibold text-netcrab-text mb-4">
          Sessions & friction over the last 30 days
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sessionsChartData}>
            <defs>
              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#1f2933' }}
              tickLine={{ stroke: '#1f2933' }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="sessions"
              orientation="left"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#1f2933' }}
              tickLine={{ stroke: '#1f2933' }}
            />
            <YAxis
              yAxisId="friction"
              orientation="right"
              domain={[0, 1]}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#1f2933' }}
              tickLine={{ stroke: '#1f2933' }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1220',
                border: '1px solid #1f2933',
                borderRadius: '6px',
                color: '#e5e7eb',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area
              yAxisId="sessions"
              type="monotone"
              dataKey="sessions"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#sessionsGradient)"
            />
            <Line
              yAxisId="friction"
              type="monotone"
              dataKey="friction"
              stroke="#fb7185"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Hotspots */}
      <div className="bg-netcrab-card rounded-lg border border-netcrab-border p-6">
        <h2 className="text-xl font-semibold text-netcrab-text mb-4">Top Friction Hotspots</h2>
        <div className="space-y-2">
          {overviewData.topHotspots.slice(0, 5).map((hotspot) => (
            <div
              key={hotspot.screenId}
              className="flex items-center justify-between p-3 border border-netcrab-border rounded-lg hover:border-netcrab-shell/30 transition-colors"
            >
              <div>
                <div className="font-medium text-netcrab-text">{hotspot.route}</div>
                <div className="text-sm text-netcrab-muted">{hotspot.screenId}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-netcrab-crab">{hotspot.friction.toFixed(2)}</div>
                <div className="text-xs text-netcrab-muted">{hotspot.impactSessions} sessions</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
