-- Initial Pack Definitions
-- These are seed data for marketplace packs

-- UX Benchmark Pack: B2B CRM
INSERT INTO marketplace_packs (
  pack_id,
  latest_version,
  kind,
  vertical,
  title,
  short_desc,
  long_desc,
  update_frequency,
  public,
  base_price_usd,
  created_at,
  updated_at
) VALUES (
  'ux_friction_b2b_crm_v1',
  'ux_friction_b2b_crm_v1.0',
  'ux_benchmarks',
  'B2B_CRM',
  'B2B CRM UX Friction Benchmarks v1',
  'Daily friction and efficiency metrics for core CRM workflows.',
  'This pack aggregates frustration and efficiency metrics across B2B CRM products. Includes median clicks, duration, friction scores, and efficiency scores for common task types like lead creation, contact management, and deal tracking.',
  'daily',
  1,
  499.00,
  now(),
  now()
);

INSERT INTO marketplace_pack_categories (pack_id, category, created_at)
VALUES ('ux_friction_b2b_crm_v1', 'UX Benchmarks', now());

-- Task Flow Pack: Support Desk
INSERT INTO marketplace_packs (
  pack_id,
  latest_version,
  kind,
  vertical,
  title,
  short_desc,
  long_desc,
  update_frequency,
  public,
  base_price_usd,
  created_at,
  updated_at
) VALUES (
  'flows_support_ticketing_v1',
  'flows_support_ticketing_v1.0',
  'task_flows',
  'SUPPORT_DESK',
  'Support Desk Task Flows v1',
  'Common user journey patterns for support ticket workflows.',
  'Discover the most common task flow patterns in support desk products. Includes ticket creation, assignment, resolution, and escalation flows with completion rates and friction metrics.',
  'daily',
  1,
  399.00,
  now(),
  now()
);

INSERT INTO marketplace_pack_categories (pack_id, category, created_at)
VALUES ('flows_support_ticketing_v1', 'Task Flows', now());

-- Pack Versions
INSERT INTO pack_versions (
  pack_version_id,
  pack_id,
  major,
  minor,
  status,
  notes,
  created_at
) VALUES
  ('ux_friction_b2b_crm_v1.0', 'ux_friction_b2b_crm_v1', 1, 0, 'active', 'Initial release', now()),
  ('flows_support_ticketing_v1.0', 'flows_support_ticketing_v1', 1, 0, 'active', 'Initial release', now());

