/**
 * App API Types
 *
 * Types for Insights API responses
 */

export interface OverviewResponse {
  orgId: string;
  productId: string;
  from: string;
  to: string;
  frictionIndex: number;
  efficiencyScore: number;
  sessions: number;
  topHotspots: Hotspot[];
  noteOfTheDay?: CrabNote;
}

export interface Hotspot {
  screenId: string;
  route: string;
  friction: number;
  impactSessions: number;
  trend: 'up' | 'down' | 'flat';
}

export interface CrabNote {
  id: string;
  title: string;
  summary: string;
  category: 'friction' | 'confusion' | 'efficiency' | 'adoption' | 'conversion';
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
  createdAt: string;
  relatedScreens?: string[];
  recommendations?: string[];
}

export interface HotspotsResponse {
  items: HotspotDetail[];
}

export interface HotspotDetail {
  screenId: string;
  route: string;
  sessions: number;
  avgFriction: number;
  avgEfficiency: number;
  rageClickRate: number;
  dropoffRate: number;
  avgTimeSpentMs: number;
}

export interface Flow {
  id: string;
  label: string;
  path: string[];
  sessions: number;
  completionRate: number;
  avgFriction: number;
  avgDurationSec: number;
}

export interface FlowsResponse {
  flows: Flow[];
}

