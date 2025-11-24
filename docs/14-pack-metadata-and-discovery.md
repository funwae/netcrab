# Pack Metadata, Discovery, and Previews

## Pack Metadata, Discovery, and Previews

### 1. Metadata Schema

```sql
CREATE TABLE marketplace_packs (
  pack_id         String,
  latest_version  String,     -- "ux_friction_b2b_crm_v1.3"
  kind            String,
  vertical        String,
  title           String,
  short_desc      String,
  long_desc       String,
  update_frequency String,
  public          UInt8,
  base_price_usd  Decimal(18,2),
  created_at      DateTime,
  updated_at      DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id);
```

```sql
CREATE TABLE marketplace_pack_categories (
  pack_id     String,
  category    String   -- "UX Benchmarks", "Task Flows", "Releases"
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, category);
```

```sql
CREATE TABLE marketplace_pack_samples (
  pack_id       String,
  sample_kind   String,      -- "row", "chart"
  payload       JSON,        -- e.g., one or a few rows, or chart data
  created_at    DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, sample_kind);
```

---

### 2. Discovery & Catalog

**Facets:**

* Vertical (B2B CRM, Support Desk, etc.)
* Category (Benchmarks, Flows, Releases, Reports)
* Data granularity (daily, weekly).
* Update frequency.
* Price band.

**`GET /v1/packs` response shape:**

```json
{
  "packs": [
    {
      "id": "ux_friction_b2b_crm_v1",
      "title": "B2B CRM UX Friction Benchmarks v1",
      "shortDesc": "Daily friction and efficiency metrics for core CRM workflows.",
      "vertical": "B2B_CRM",
      "category": "UX Benchmarks",
      "updateFrequency": "daily",
      "basePriceUsd": "499.00",
      "samplePreview": {
        "medianClicks": 8.9,
        "medianDurationSec": 61.2,
        "meanFriction": 0.57
      }
    }
  ]
}
```

---

### 3. Pack Detail Page Metadata

**`GET /v1/packs/{packId}`:**

```json
{
  "id": "ux_friction_b2b_crm_v1",
  "title": "B2B CRM UX Friction Benchmarks v1",
  "vertical": "B2B_CRM",
  "category": "UX Benchmarks",
  "updateFrequency": "daily",
  "longDesc": "This pack aggregates frustration and efficiency metrics across...",
  "schema": {
    "fields": [
      { "name": "date", "type": "date", "description": "UTC date" },
      { "name": "task_type", "type": "string", "description": "Normalized task type label" },
      ...
    ]
  },
  "sampleData": [
    {
      "date": "2025-11-22",
      "task_type": "create_lead",
      "flow_complexity": 3,
      "median_clicks": 8,
      "median_duration_s": 52,
      "mean_frict_score": 0.46,
      "p90_frict_score": 0.71
    }
  ],
  "charts": [
    {
      "type": "line",
      "title": "Median friction over last 30 days",
      "data": [
        { "date": "2025-10-25", "mean_frict_score": 0.60 },
        ...
      ]
    }
  ],
  "pricing": {
    "monthly": "499.00",
    "currency": "USD"
  },
  "eligibility": {
    "minOrgs": 20,
    "minSessions": 10000,
    "orgCountCurrent": 37,
    "sessionCountCurrent": 480000
  }
}
```

---

### 4. Sample Data Generation

Pack builder takes a few **representative rows** from `mp_*` tables:

```sql
INSERT INTO marketplace_pack_samples
SELECT
  'ux_friction_b2b_crm_v1',
  'row',
  toJSONString(tuple(date, task_type, flow_complexity,
                     median_clicks, median_duration_s,
                     mean_frict_score, p90_frict_score)) AS payload,
  now()
FROM mp_ux_friction_daily
WHERE pack_id = 'ux_friction_b2b_crm_v1'
ORDER BY date DESC
LIMIT 5;
```

* Optional: add small noise to values used in samples.

