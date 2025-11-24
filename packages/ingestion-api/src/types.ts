/**
 * NetCrab Ingestion API Types
 *
 * Aligned with API contract specifications
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

export interface NetCrabBatch {
  agentId: string;
  sdkVersion: string;
  events: NetCrabEvent[];
}

export interface BatchResponse {
  status: 'ok' | 'error';
  accepted: number;
  rejected: number;
  errors?: string[];
}

