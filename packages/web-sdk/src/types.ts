/**
 * NetCrab Web SDK Types
 *
 * Aligned with API contract specifications
 */

export type NetCrabEventType = 'click' | 'scroll' | 'input_meta' | 'navigation' | 'focus_change' | 'custom';

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface NetCrabConfig {
  orgId: string;
  productId: string;
  agentUrl: string;
  sampleRate?: number; // 0-1, default 1.0
  enabled?: boolean; // default true
  debug?: boolean; // default false
}

/**
 * Core NetCrab event structure matching API contract
 */
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

/**
 * Batch structure for agent forwarding
 */
export interface NetCrabBatch {
  agentId: string;
  sdkVersion: string;
  events: NetCrabEvent[];
}

/**
 * Legacy event format (for internal SDK use before transformation)
 */
export interface EventMetadata {
  element_role?: string;
  element_label_hash?: string;
  screen_id?: string;
  app_name?: string;
  route?: string;
  latency_ms?: number;
  error_code?: string;
  device_type: DeviceType;
  os?: string;
  browser?: string;
  [key: string]: unknown;
}

