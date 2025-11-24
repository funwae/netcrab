# Data Products & Marketplace

## 6.1 What NetCrab Sells

NetCrab **does not** sell user-level data or anything that could profile an individual. It sells:

1. **UX Benchmark Packs**

   * Aggregated metrics by **vertical** and **task type**.

   * Example pack: `ux_friction_b2b_crm_v1`.

   * Buyers: product teams, market analysts, UX agencies.

2. **Task-flow Archetype Packs**

   * Common user journeys for a given vertical.

   * Example pack: `flows_support_ticketing_v1`.

   * Data: abstracted flow graphs with weighted edges, cluster descriptions.

3. **Release Delta & Trend Packs**

   * How friction changes around major feature launches (across many products).

   * Example: `releases_enterprise_saas_q1_2026`.

4. **Insight Report Packs (Narrative)**

   * PDF-like / HTML reports summarizing:

     * "Top 10 UX anti-patterns in B2B CRM onboarding, 2025."

   * Generated from the same underlying data.

## 6.2 Why Buyers Care

* **Benchmarking:**

  * "Is our 12-click checkout actually normal for our industry?"

* **Product Strategy:**

  * Prioritize redesigns in flows that industry leaders have already smoothed.

* **Competitive Landscape:**

  * Without naming names, see the *distribution* of friction across an entire vertical.

* **UX Research Acceleration:**

  * Replace or augment slow qualitative field studies with broad quantitative behavior.

## 6.3 Why Sellers (Customers) Join

* **Direct Value:**

  * Even without selling, they get the best analytics of their own product's friction/efficiency.

* **Revenue Participation:**

  * Each pack tracks:

    * `org_count`

    * Weighted contribution of sessions per org.

  * Monthly revenue from pack sales is split by contribution:

    ```text
    org_share = (org_sessions_in_packs / total_sessions_in_packs) * pool_after_fee
    ```

* **Network Effect:**

  * The more participants, the stronger and more valuable the benchmarks → higher revenue.

## 6.4 Data Packaging

For each **Pack**, we define:

```jsonc
{
  "pack_id": "ux_friction_b2b_crm_v1",
  "title": "B2B CRM UX Friction Benchmarks v1",
  "description": "Aggregated friction and efficiency scores for common B2B CRM workflows.",
  "vertical": "B2B_CRM",
  "schema": {
    "table": "mp_ux_friction_daily",
    "fields": [
      "date", "task_type", "flow_complexity",
      "median_clicks", "median_duration_s",
      "mean_frict_score", "p90_frict_score"
    ]
  },
  "update_frequency": "daily",
  "min_orgs": 20,
  "min_sessions": 10000
}
```

Delivery methods:

* **Download:** CSV/Parquet.

* **API:** `/api/packs/{pack_id}/query` (filter by date range / task / vertical).

* **BI Connectors:** prebuilt connectors for Looker, Tableau, PowerBI.

