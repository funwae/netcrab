/**
 * NetCrab Pack Builder Types
 */

export type PackKind =
  | 'ux_benchmarks'
  | 'task_flows'
  | 'release_deltas'
  | 'insight_reports';

export interface PackDefinition {
  packId: string;
  kind: PackKind;
  title: string;
  vertical: string;
  description: string;
  table: string;
  fields: string[];
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  minOrgs: number;
  minSessions: number;
  retentionDays: number;
  public: boolean;
}

export interface PackVersion {
  packVersionId: string;
  packId: string;
  major: number;
  minor: number;
  status: 'draft' | 'active' | 'deprecated';
  createdAt: Date;
  notes: string;
}

export interface OrgSettings {
  orgId: string;
  displayName: string;
  vertical: 'B2B_CRM' | 'SUPPORT_DESK' | 'ERP' | 'HRIS' | 'CUSTOM' | 'ANY';
  customVerticalLabel?: string;
  marketplaceOptedIn: boolean;
}
