# Revenue Share & Billing System

## Revenue Share & Billing System

### 1. Roles

* **Seller org** (NetCrab telemetry customer, opted into packs).
* **Buyer org** (marketplace customer).
* **NetCrab platform** (you).

---

### 2. Pricing & Fees

Working assumptions you can tweak:

* **Pack pricing:** subscription **per pack**:

  * e.g. `ux_friction_b2b_crm_v1` = $499/month.

* **Platform fee:** 30% of gross pack revenue.
* **Remainder:** 70% distributed to contributing seller orgs.

Foundation concept:

```text
gross_revenue_per_pack_month = Σ(buyer_subscriptions_for_pack)
platform_fee = gross * 0.30
pool_after_fee = gross - platform_fee
org_share = (org_sessions_in_pack / total_sessions_in_pack) * pool_after_fee
```

---

### 3. Schema

```sql
CREATE TABLE marketplace_pack_revenue (
  pack_id        String,
  month          Date,   -- truncated first of month
  gross_revenue  Decimal(18,2),
  platform_fee   Decimal(18,2),
  pool_after_fee Decimal(18,2),
  created_at     DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, month);
```

```sql
CREATE TABLE marketplace_org_contrib (
  pack_id      String,
  month        Date,
  org_id       String,
  sessions_in_pack UInt64,
  created_at   DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (pack_id, month, org_id);
```

```sql
CREATE TABLE marketplace_org_payouts (
  payout_id        String,
  org_id           String,
  month            Date,
  currency         FixedString(3),
  amount           Decimal(18,2),
  status           Enum8('pending' = 1, 'processing' = 2, 'paid' = 3, 'failed' = 4),
  stripe_transfer_id Nullable(String),
  created_at       DateTime,
  updated_at       DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (org_id, month, payout_id);
```

---

### 4. Payment Processing Integration

Choose **Stripe** with **Stripe Connect Express**:

* Seller org sets up payout account:

  * In NetCrab UI: `Settings → Marketplace → Payouts`.
  * Click "Connect Stripe" → OAuth to Stripe Connect.

* Buyer org pays via Stripe checkout (cards; later invoices).

Tables:

```sql
CREATE TABLE org_billing_profiles (
  org_id           String,
  role             Enum8('seller' = 1, 'buyer' = 2, 'both' = 3),
  stripe_customer_id String,
  stripe_connect_id  Nullable(String), -- for sellers
  billing_email      String,
  country            String,
  created_at         DateTime,
  updated_at         DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (org_id);
```

---

### 5. Monthly Payout Job

Cron: `0 6 5 * *` – 5th of each month, 06:00 UTC.

Steps:

1. For each pack:

   * Query Stripe for revenue (or track subscriptions in your DB).
   * Insert into `marketplace_pack_revenue`.

2. Compute contributions:

   ```sql
   INSERT INTO marketplace_org_contrib
   SELECT
     :pack_id AS pack_id,
     :month   AS month,
     org_id,
     sum(sample_sessions) AS sessions_in_pack,
     now()
   FROM mp_ux_friction_daily
   WHERE pack_id = :pack_id AND toStartOfMonth(date) = :month
   GROUP BY org_id;
   ```

3. Compute `total_sessions_in_pack`.

4. For each `(pack_id, org_id)`:

   * `org_share = (sessions_in_pack / total_sessions_in_pack) * pool_after_fee`.
   * Accumulate across packs into `org_month_total`.

5. Create `marketplace_org_payouts` row per org with amount.

6. For each org with `stripe_connect_id`:

   * Call Stripe Connect Payout/Transfer API, set status accordingly.

If `stripe_connect_id` missing:

* Leave as `pending` and show UI message: "Connect payout account to receive $X for November."

---

### 6. Monthly Statement Format

Stored as JSON blob or a view:

```ts
OrgMonthlyStatement {
  orgId: string;
  month: string; // "2025-11-01"
  currency: 'USD';
  totalAmount: string; // "2450.32"
  packs: Array<{
    packId: string;
    packTitle: string;
    grossRevenue: string;
    orgContributionSessions: number;
    orgShareAmount: string;
  }>;
}
```

API:

* `GET /v1/marketplace/statements?month=2025-11-01`

UI:

* Downloadable PDF/CSV + web view.

