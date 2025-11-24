-- NetCrab Marketplace Database Schema
-- ClickHouse and PostgreSQL tables for marketplace functionality

-- ============================================================================
-- ClickHouse Tables (Analytics)
-- ============================================================================

-- Task flow archetype packs
CREATE TABLE IF NOT EXISTS mp_task_flows (
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
  org_count        UInt32,
  created_at       DateTime DEFAULT now()
)
ENGINE = MergeTree
PARTITION BY (pack_id, date_window)
ORDER BY (pack_id, vertical, task_type, archetype_id);

-- Release delta packs
CREATE TABLE IF NOT EXISTS mp_release_deltas (
  pack_id          String,
  date_window      String,
  vertical         String,
  release_version  String,
  task_type        String,
  friction_delta   Float32,  -- change from pre-release baseline
  efficiency_delta Float32,
  sample_sessions  UInt64,
  org_count        UInt32,
  created_at       DateTime DEFAULT now()
)
ENGINE = MergeTree
PARTITION BY (pack_id, date_window)
ORDER BY (pack_id, vertical, release_version, task_type);

-- Insight report packs (summary data)
CREATE TABLE IF NOT EXISTS mp_insight_reports (
  pack_id          String,
  report_date      Date,
  vertical         String,
  report_type      String,   -- "top_anti_patterns", "trend_analysis", etc.
  insights         String,   -- JSON blob of insights
  sample_sessions  UInt64,
  org_count        UInt32,
  created_at       DateTime DEFAULT now()
)
ENGINE = MergeTree
PARTITION BY (pack_id, toYearMonth(report_date))
ORDER BY (pack_id, vertical, report_date, report_type);

-- Intermediate flow clustering results
CREATE TABLE IF NOT EXISTS flow_archetypes (
  org_id           String,
  product_id       String,
  date_window      String,
  task_type        String,
  archetype_id     String,
  steps            Array(String),
  avg_duration_s   Float32,
  avg_frict_score  Float32,
  sample_sessions  UInt64,
  created_at       DateTime DEFAULT now()
)
ENGINE = MergeTree
PARTITION BY (org_id, date_window)
ORDER BY (org_id, product_id, task_type, archetype_id);

-- Task type mapping
CREATE TABLE IF NOT EXISTS dim_task_types (
  org_id           String,
  product_id       String,
  task_type        String,
  task_label       String,
  inferred         UInt8,    -- 0/1
  created_at       DateTime DEFAULT now(),
  updated_at       DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (org_id, product_id, task_type);

-- ============================================================================
-- PostgreSQL/ClickHouse Operational Tables
-- ============================================================================

-- Pack metadata
CREATE TABLE IF NOT EXISTS marketplace_packs (
  pack_id         String PRIMARY KEY,
  latest_version  String,
  kind            String,
  vertical        String,
  title           String,
  short_desc      String,
  long_desc       String,
  update_frequency String,
  public          UInt8,
  base_price_usd  Decimal(18,2),
  created_at      DateTime DEFAULT now(),
  updated_at      DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (pack_id);

-- Pack categories
CREATE TABLE IF NOT EXISTS marketplace_pack_categories (
  pack_id     String,
  category    String,
  created_at  DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, category);

-- Pack samples (for previews)
CREATE TABLE IF NOT EXISTS marketplace_pack_samples (
  pack_id       String,
  sample_kind   String,      -- "row", "chart"
  payload       String,      -- JSON
  created_at    DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, sample_kind);

-- Pack revenue tracking
CREATE TABLE IF NOT EXISTS marketplace_pack_revenue (
  pack_id        String,
  month          Date,
  gross_revenue  Decimal(18,2),
  platform_fee   Decimal(18,2),
  pool_after_fee Decimal(18,2),
  created_at     DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, month);

-- Org contributions to packs
CREATE TABLE IF NOT EXISTS marketplace_org_contrib (
  pack_id          String,
  month            Date,
  org_id           String,
  sessions_in_pack UInt64,
  created_at       DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, month, org_id);

-- Org payouts
CREATE TABLE IF NOT EXISTS marketplace_org_payouts (
  payout_id        String PRIMARY KEY,
  org_id           String,
  month            Date,
  currency         FixedString(3),
  amount           Decimal(18,2),
  status           String,  -- 'pending', 'processing', 'paid', 'failed'
  stripe_transfer_id Nullable(String),
  created_at       DateTime DEFAULT now(),
  updated_at       DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (org_id, month, payout_id);

-- Billing profiles (Stripe integration)
CREATE TABLE IF NOT EXISTS org_billing_profiles (
  org_id             String PRIMARY KEY,
  role               String,  -- 'seller', 'buyer', 'both'
  stripe_customer_id Nullable(String),
  stripe_connect_id  Nullable(String),
  billing_email      String,
  country            String,
  created_at         DateTime DEFAULT now(),
  updated_at         DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (org_id);

-- Buyer API keys
CREATE TABLE IF NOT EXISTS buyer_api_keys (
  api_key_id    String PRIMARY KEY,
  org_id        String,
  label         String,
  hashed_key    String,
  created_at    DateTime DEFAULT now(),
  last_used_at  Nullable(DateTime),
  revoked       UInt8 DEFAULT 0
)
ENGINE = ReplacingMergeTree
ORDER BY (org_id, api_key_id);

-- Usage counters (quota tracking)
CREATE TABLE IF NOT EXISTS buyer_usage_counters (
  org_id        String,
  pack_id       String,
  period_start  DateTime,  -- month start
  rows_returned UInt64 DEFAULT 0,
  requests      UInt64 DEFAULT 0,
  last_updated  DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(last_updated)
ORDER BY (org_id, pack_id, period_start);

-- Org settings (vertical, opt-in)
CREATE TABLE IF NOT EXISTS org_settings (
  org_id              String PRIMARY KEY,
  display_name        String,
  vertical            String,  -- 'B2B_CRM', 'SUPPORT_DESK', 'ERP', 'HRIS', 'CUSTOM'
  custom_vertical_label Nullable(String),
  marketplace_opted_in UInt8 DEFAULT 0,
  created_at          DateTime DEFAULT now(),
  updated_at          DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (org_id);

-- Pack org membership (which orgs are in which packs)
CREATE TABLE IF NOT EXISTS pack_org_membership (
  pack_id     String,
  org_id      String,
  opted_in    UInt8 DEFAULT 0,
  created_at  DateTime DEFAULT now(),
  updated_at  DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (pack_id, org_id);

-- Pack versions
CREATE TABLE IF NOT EXISTS pack_versions (
  pack_version_id String PRIMARY KEY,
  pack_id         String,
  major           UInt32,
  minor           UInt32,
  status          String,  -- 'draft', 'active', 'deprecated'
  notes           String,
  created_at      DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, major, minor);

-- Buyer subscriptions
CREATE TABLE IF NOT EXISTS buyer_subscriptions (
  id                  String PRIMARY KEY,
  org_id              String,
  pack_id             String,
  stripe_customer_id  String,
  stripe_subscription_id String,
  billing_tier        String,  -- 'standard', 'pro', 'enterprise', 'trial'
  status              String,  -- 'active', 'past_due', 'cancelled', 'trial'
  current_period_start String,
  current_period_end   String,
  created_at          DateTime DEFAULT now(),
  updated_at          DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (org_id, pack_id);
