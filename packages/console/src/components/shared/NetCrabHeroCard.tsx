'use client';

import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';

interface NetCrabHeroCardProps {
  orgLabel?: string;
  productLabel?: string;
  frictionIndex?: number;
  efficiencyScore?: number;
  sessions?: number;
  hotspotsCount?: number;
  showLabel?: string;
}

const radarData = [
  { label: 'Onboarding', friction: 0.76 },
  { label: 'Billing', friction: 0.81 },
  { label: 'Support', friction: 0.42 },
  { label: 'Reporting', friction: 0.55 },
  { label: 'Search', friction: 0.49 },
];

const lineData = [
  { day: 'Mon', friction: 0.39 },
  { day: 'Tue', friction: 0.41 },
  { day: 'Wed', friction: 0.44 },
  { day: 'Thu', friction: 0.42 },
  { day: 'Fri', friction: 0.45 },
  { day: 'Sat', friction: 0.40 },
  { day: 'Sun', friction: 0.42 },
];

// Transform radar data for Recharts
const radarChartData = radarData.map((item) => ({
  area: item.label,
  friction: item.friction * 100, // Scale to 0-100 for better visualization
  fullMark: 100,
}));

export default function NetCrabHeroCard({
  orgLabel = 'acme-org',
  productLabel = 'crm-web',
  frictionIndex = 0.42,
  efficiencyScore = 0.78,
  sessions = 12450,
  hotspotsCount = 3,
  showLabel = 'Sample data',
}: NetCrabHeroCardProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('30d');

  return (
    <div className="bg-netcrab-surface rounded-lg border border-netcrab-border p-6 shadow-xl relative w-full max-w-[480px]">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-netcrab-border">
        <div>
          <div className="text-xs text-netcrab-muted mb-1">
            {orgLabel} / {productLabel}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timeframe === '7d'
                  ? 'bg-netcrab-crab/20 text-netcrab-crab border border-netcrab-crab/30'
                  : 'text-netcrab-muted hover:text-netcrab-text'
              }`}
            >
              Last 7 days
            </button>
            <span className="text-netcrab-muted">·</span>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timeframe === '30d'
                  ? 'bg-netcrab-crab/20 text-netcrab-crab border border-netcrab-crab/30'
                  : 'text-netcrab-muted hover:text-netcrab-text'
              }`}
            >
              Last 30 days
            </button>
          </div>
        </div>
        <span className="px-2 py-1 bg-netcrab-shell/20 text-netcrab-shell text-xs rounded border border-netcrab-shell/30">
          {showLabel}
        </span>
      </div>

      {/* Metrics Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900/60 rounded-lg p-3 border border-netcrab-border/50">
          <div className="text-xs text-netcrab-muted mb-1">Friction Index</div>
          <div className="text-2xl font-bold text-netcrab-crab">{frictionIndex.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-3 border border-netcrab-border/50">
          <div className="text-xs text-netcrab-muted mb-1">Task Efficiency</div>
          <div className="text-2xl font-bold text-netcrab-shell">{(efficiencyScore * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-3 border border-netcrab-border/50">
          <div className="text-xs text-netcrab-muted mb-1">Sessions</div>
          <div className="text-2xl font-bold text-netcrab-text">
            {sessions >= 1000 ? `${(sessions / 1000).toFixed(1)}k` : sessions.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-3 border border-netcrab-border/50">
          <div className="text-xs text-netcrab-muted mb-1">Crabby Hotspots</div>
          <div className="text-2xl font-bold text-netcrab-text">{hotspotsCount}</div>
        </div>
      </div>

      {/* Visualization Zone */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Radar Chart */}
        <div>
          <div className="text-xs font-medium text-netcrab-text mb-2">Friction by area</div>
          <ResponsiveContainer width="100%" height={140}>
            <RadarChart data={radarChartData}>
              <PolarGrid stroke="#1f2933" />
              <PolarAngleAxis
                dataKey="area"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                className="text-xs"
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar
                name="Friction"
                dataKey="friction"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div>
          <div className="text-xs font-medium text-netcrab-text mb-2">Friction over last 7 days</div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="frictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={{ stroke: '#1f2933' }}
                tickLine={{ stroke: '#1f2933' }}
              />
              <YAxis
                domain={[0.35, 0.5]}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={{ stroke: '#1f2933' }}
                tickLine={{ stroke: '#1f2933' }}
                tickFormatter={(value) => value.toFixed(2)}
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
                type="monotone"
                dataKey="friction"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#frictionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Annotation */}
      <div className="text-xs text-netcrab-muted italic pt-3 border-t border-netcrab-border/50">
        Onboarding and Billing show elevated friction vs Support.
      </div>
    </div>
  );
}

