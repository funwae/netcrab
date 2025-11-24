/**
 * AI Services Types
 */

export interface SessionMetrics {
  orgId: string;
  productId: string;
  sessionId: string;
  userHash: string;
  startTs: string;
  endTs: string;
  durationMs: number;
  clickCount: number;
  uniqueScreens: number;
  rageClicks: number;
  backtracks: number;
  contextSwitches: number;
  tasksStarted: number;
  tasksCompleted: number;
  errorEvents: number;
  frustrationScore: number;
  efficiencyScore: number;
  versionTag?: string;
  segment?: string;
}

export interface SessionCluster {
  clusterId: string;
  label: string;
  description: string;
  sessionCount: number;
  avgFrustration: number;
  avgEfficiency: number;
  avgDuration: number;
  avgClicks: number;
  topScreens: string[];
  commonPatterns: string[];
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

export interface FlowArchetype {
  id: string;
  label: string;
  path: string[];
  frequency: number;
  avgFriction: number;
  avgEfficiency: number;
  avgDuration: number;
  completionRate: number;
  dropoffPoints: Array<{ screen: string; rate: number }>;
}

