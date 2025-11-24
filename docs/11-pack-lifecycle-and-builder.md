# Pack Lifecycle & Pack Builder Service

## NetCrab Pack Lifecycle & Pack Builder Service

### 1. Concepts Recap

* **Pack** = a defined, versioned **data product**.

* Types (from earlier docs):

  * UX Benchmark Packs
  * Task-flow Archetype Packs
  * Release Delta & Trend Packs
  * Insight Report Packs

* Data lives in **mp_*** ClickHouse tables, e.g. `mp_ux_friction_daily`.

---

### 2. Pack Definition Model

**Goal:** Pack behaviour should be driven by config, not code.

```ts
// marketplace/pack-definitions.ts

export type PackKind =
  | 'ux_benchmarks'
  | 'task_flows'
  | 'release_deltas'
  | 'insight_reports';

export interface PackDefinition {
  packId: string;          // "ux_friction_b2b_crm_v1"
  kind: PackKind;
  title: string;
  vertical: string;        // "B2B_CRM"
  description: string;
  table: string;           // ClickHouse table name
  fields: string[];        // columns exposed externally
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  minOrgs: number;         // default 20
  minSessions: number;     // default 10000
  retentionDays: number;   // how far back buyers can query
  public: boolean;         // visible in catalog?
}
```

Could also be stored as YAML:

```yaml
packId: ux_friction_b2b_crm_v1
kind: ux_benchmarks
title: "B2B CRM UX Friction Benchmarks v1"
vertical: "B2B_CRM"
description: >
  Aggregated friction and efficiency scores for common B2B CRM workflows.
table: mp_ux_friction_daily
fields:
  - date
  - task_type
  - flow_complexity
  - median_clicks
  - median_duration_s
  - mean_frict_score
  - p90_frict_score
  - sample_sessions
  - org_count
updateFrequency: daily
minOrgs: 20
minSessions: 10000
retentionDays: 365
public: true
```

Pack definitions are loaded at service startup and cached.

---

### 3. Determining `vertical` and `task_type`

#### 3.1 Vertical

Onboarding for a seller org:

* In `org_settings` we store:

```ts
OrgSettings {
  orgId: string;
  displayName: string;
  vertical: 'B2B_CRM' | 'SUPPORT_DESK' | 'ERP' | 'HRIS' | 'CUSTOM';
  customVerticalLabel?: string; // if CUSTOM
}
```

* Vertical is chosen in onboarding wizard ("What best describes your product?").
* For pack eligibility:

  * `orgSettings.vertical` must match `pack.vertical`.
  * Or for generic packs, `vertical = "ANY"`.

#### 3.2 Task Type

Two sources:

1. **Explicit SDK tagging** (preferred):

   ```ts
   netcrab.startTask('create_ticket', { label: 'Create support ticket' });
   netcrab.completeTask('create_ticket', { success: true });
   ```

   These map directly into `fact_sessions` / `task_events` tables.

2. **Inferred from flows:**

   * For sessions without explicit task tags, we cluster flows and auto-assign names like:

     * `"generic_navigation"`, `"search_and_detail"`, `"checkout_like"`.

   * These auto-types are included in packs but flagged as `inferred: true`.

Schema for task mapping:

```sql
CREATE TABLE dim_task_types (
  org_id          String,
  product_id      String,
  task_type         String,   -- "create_ticket"
  task_label        String,   -- "Create support ticket"
  inferred          UInt8,    -- 0/1
  created_at        DateTime,
  updated_at        DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (org_id, product_id, task_type);
```

---

### 4. Pack Builder Service Architecture

**Service name:** `marketpack-builder`

Responsibilities:

1. Run scheduled aggregation jobs for each pack & pack type.
2. Enforce privacy constraints (`minOrgs`, `minSessions`, DP noise).
3. Populate `mp_*` tables.
4. Maintain **pack versioning** state.

**Inputs:**

* `fact_sessions`, `fact_screen_hotspots`, `flow_archetypes`, `release_events`.
* `org_settings`, `org_marketplace_opt_in`.

**Outputs:**

* `mp_ux_friction_daily`, `mp_task_flows`, `mp_release_deltas`, `mp_insight_reports`.
* Job logs.

---

### 5. Pack Generation Schedule & Triggers

#### 5.1 Schedules

* **UX benchmarks & flows:** daily (nightly UTC).
* **Release delta packs:** daily, but only recompute windows around recorded releases.
* **Insight report packs:** weekly.

Example using a job runner like BullMQ / Temporal / Airflow; for spec we say:

* Cron jobs:

  * `0 2 * * *` – daily packs (02:00 UTC).
  * `0 3 * * 1` – weekly insight packs (Mondays at 03:00 UTC).

#### 5.2 Triggers

* Pack rebuild is triggered when:

  * Regular cron runs.
  * A new org becomes **opted-in** to marketplace and has enough data.
  * A new pack definition is deployed or updated.

`marketpack-builder` subscribes to events:

* `org_marketplace_opted_in`
* `pack_definition_updated`

and enqueues incremental rebuilds for affected packs if needed.

---

### 6. Pack Versioning Strategy

* **Immutable pack versions**:

  ```ts
  PackVersion {
    packVersionId: string;     // e.g. "ux_friction_b2b_crm_v1.3"
    packId: string;            // "ux_friction_b2b_crm_v1"
    major: number;
    minor: number;
    status: 'draft' | 'active' | 'deprecated';
    createdAt: Date;
    notes: string;
  }
  ```

* `major` bumps when schema changes (breaking).

* `minor` bumps for methodology changes or substantial DP parameters.

* Buyers subscribe to a **packId** and an `autoUpgrade: boolean`:

  * If `autoUpgrade = true`, they always see the latest active version.
  * If false, they stick to a version until they manually upgrade.

---

### 7. Aggregation Logic Examples

#### 7.1 UX Benchmark Pack (`mp_ux_friction_daily`)

Pseudocode:

```sql
INSERT INTO mp_ux_friction_daily
SELECT
  p.pack_id AS pack_id,
  toDate(s.start_ts) AS date,
  tt.task_type,
  flow_complexity,                 -- from dim_task_complexity
  median(click_count) AS median_clicks,
  median(duration_ms) / 1000 AS median_duration_s,
  avg(frustration_score) AS mean_frict_score,
  quantileExact(0.9)(frustration_score) AS p90_frict_score,
  count() AS sample_sessions,
  uniqExact(org_id) AS org_count
FROM fact_sessions s
JOIN org_settings o USING (org_id)
JOIN dim_task_types tt USING (org_id, product_id, task_type)
JOIN pack_org_membership pom USING (org_id)
JOIN pack_definitions p ON p.pack_id = 'ux_friction_b2b_crm_v1'
WHERE
  p.vertical = o.vertical
  AND s.start_ts BETWEEN :from AND :to
  AND pom.opted_in = 1
GROUP BY date, tt.task_type, flow_complexity;
```

After insert, a follow-up validation job checks:

* No rows where `org_count < minOrgs`.
* No rows where `sample_sessions < minSessions`.

Those rows are dropped or generalized (e.g., `task_type = 'OTHER'` bucket).

#### 7.2 Task-flow Archetype Pack (`mp_task_flows`)

Schema:

```sql
CREATE TABLE mp_task_flows (
  pack_id          String,
  date_window      String,   -- "2025Q1", "2025-11"
  vertical         String,
  task_type        String,
  archetype_id     String,
  archetype_label  String,
  steps            Array(String),  -- ["home","list","detail","success"]
  avg_duration_s   Float32,
  avg_frict_score  Float32,
  sample_sessions  UInt64,
  org_count        UInt32
)
ENGINE = MergeTree
PARTITION BY (pack_id, date_window)
ORDER BY (pack_id, vertical, task_type, archetype_id);
```

Builder:

1. Use clustering job that outputs `flow_archetypes`:

   ```sql
   CREATE TABLE flow_archetypes (
     org_id          String,
     product_id      String,
     date_window     String,
     task_type       String,
     archetype_id    String,
     steps           Array(String),
     avg_duration_s  Float32,
     avg_frict_score Float32,
     sample_sessions UInt64
   ) ...
   ```

2. Then aggregate across orgs into `mp_task_flows`, same `minOrgs/minSessions` rules.

