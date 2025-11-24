/**
 * NetCrab Agent Types
 */

export interface AgentConfig {
  port?: number;
  cloudIngestionUrl: string;
  apiKey: string;
  orgId: string;
  batchSize?: number;
  flushInterval?: number; // milliseconds
  allowedDomains?: string[];
  ignoredPaths?: string[];
  sampleRate?: number; // 0-1
}

export interface EventBatch {
  org_id: string;
  product_id: string;
  events: any[];
  ts: string;
}

export interface ScrubbingRule {
  field: string;
  action: 'remove' | 'hash' | 'mask';
}

