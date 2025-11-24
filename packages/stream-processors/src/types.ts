/**
 * Stream Processor Types
 */

export type NetCrabEventType = 'click' | 'scroll' | 'input_meta' | 'navigation' | 'focus_change' | 'custom';

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface NetCrabEvent {
  orgId: string;
  productId: string;
  sessionId: string;
  userHash: string;
  ts: string; // ISO8601
  eventType: NetCrabEventType;
  screenId: string;
  route: string;
  appName?: string;
  elementType?: string;
  elementLabelHash?: string;
  errorCode?: string;
  latencyMs?: number;
  deviceType: DeviceType;
  os?: string;
  browser?: string;
  extra?: Record<string, unknown>;
}

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
  frustrationScore: number; // 0-1
  efficiencyScore: number; // 0-1
  versionTag?: string;
  segment?: string;
}

export interface Incident {
  orgId: string;
  productId: string;
  sessionId: string;
  incidentType: 'rage_click' | 'backtrack' | 'abandoned_task';
  screenId: string;
  route: string;
  ts: string;
  metadata: Record<string, unknown>;
}

