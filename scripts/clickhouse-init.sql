-- NetCrab ClickHouse Schema Initialization
-- Run this script to create all required tables

-- Raw events table
CREATE TABLE IF NOT EXISTS events_raw (
  org_id String,
  product_id String,
  session_id String,
  user_hash String,
  event_id String,
  ts DateTime64(3, 'UTC'),
  event_type Enum8('click' = 1, 'scroll' = 2, 'input_meta' = 3, 'navigation' = 4, 'focus_change' = 5, 'custom' = 6),
  screen_id String,
  route String,
  app_name String,
  element_type Nullable(String),
  element_label_h Nullable(String),
  error_code Nullable(String),
  latency_ms Nullable(Float32),
  device_type Enum8('desktop' = 1, 'mobile' = 2, 'tablet' = 3),
  os Nullable(String),
  browser Nullable(String),
  extra JSON
)
ENGINE = MergeTree
PARTITION BY (org_id, toDate(ts))
ORDER BY (org_id, product_id, ts, session_id);

-- Session metrics table
CREATE TABLE IF NOT EXISTS fact_sessions (
  org_id String,
  product_id String,
  session_id String,
  user_hash String,
  start_ts DateTime64(3, 'UTC'),
  end_ts DateTime64(3, 'UTC'),
  duration_ms UInt64,
  click_count UInt32,
  unique_screens UInt16,
  rage_clicks UInt16,
  backtracks UInt16,
  context_switches UInt16,
  tasks_started UInt16,
  tasks_completed UInt16,
  error_events UInt16,
  frustration_score Float32,
  efficiency_score Float32,
  version_tag Nullable(String),
  segment Nullable(String)
)
ENGINE = ReplacingMergeTree
PARTITION BY (org_id, toDate(start_ts))
ORDER BY (org_id, product_id, start_ts, session_id);

-- Screen hotspots aggregate table
CREATE TABLE IF NOT EXISTS fact_screen_hotspots (
  org_id String,
  product_id String,
  screen_id String,
  route String,
  date Date,
  sessions UInt64,
  avg_frustration Float32,
  avg_efficiency Float32,
  rage_click_rate Float32,
  dropoff_rate Float32,
  avg_time_spent_ms UInt64
)
ENGINE = SummingMergeTree
PARTITION BY (org_id, toYearWeek(date))
ORDER BY (org_id, product_id, screen_id, date);

-- Market pack tables (for Phase 3)
CREATE TABLE IF NOT EXISTS mp_ux_friction_daily (
  pack_id String,
  date Date,
  vertical LowCardinality(String),
  task_type LowCardinality(String),
  flow_complexity UInt8,
  median_clicks Float32,
  median_duration_s Float32,
  mean_frict_score Float32,
  p90_frict_score Float32,
  sample_sessions UInt64,
  org_count UInt32
)
ENGINE = MergeTree
PARTITION BY (pack_id, toYearWeek(date))
ORDER BY (pack_id, vertical, task_type, date);

