# Buyer Authentication, API Keys, and Usage Limits

## Buyer Authentication, API Keys, and Usage Limits

### 1. Identity and Roles

NetCrab uses a shared auth system for:

* **Platform users (sellers)** – already exist for dashboard.
* **Marketplace-only buyers** – new orgs.

User roles:

* `platform_admin`
* `seller_admin`
* `buyer_admin`
* `buyer_viewer`

Org-level role: `seller`, `buyer`, `both`.

---

### 2. Sign Up / Auth

* Auth provider: same system as dashboard (e.g., Auth0/Clerk/own).
* Flows:

  * If an existing NetCrab seller wants to also be buyer: toggle in settings.
  * If a new buyer signs up from marketplace:

    * Org created with role `buyer`.
    * `org_billing_profiles` row created (no Connect ID).

---

### 3. API Key Management

**Schema:**

```sql
CREATE TABLE buyer_api_keys (
  api_key_id    String,
  org_id        String,
  label         String,
  hashed_key    String,
  created_at    DateTime,
  last_used_at  Nullable(DateTime),
  revoked       UInt8
)
ENGINE = ReplacingMergeTree
ORDER BY (org_id, api_key_id);
```

* Frontend can show a one-time plain API key upon creation.
* Key format: `nc_live_<random>`.

**Endpoints:**

* `POST /v1/marketplace/api-keys`
* `GET /v1/marketplace/api-keys`
* `DELETE /v1/marketplace/api-keys/{id}` (soft revoke).

API requests to `/v1/packs/*` require:

* `Authorization: Bearer <api_key>` header.
* Middleware resolves buyer org from `hashed_key` & `org_id`.

---

### 4. Usage Limits / Quotas

**Dimensions:**

* Requests per minute / per hour.
* Rows returned per month per org.
* Optionally, per-pack row limit.

**Schema:**

```sql
CREATE TABLE buyer_usage_counters (
  org_id        String,
  pack_id       String,
  period_start  DateTime,  -- e.g. month start
  rows_returned UInt64,
  requests      UInt64,
  last_updated  DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY (org_id, pack_id, period_start);
```

**Runtime behaviour:**

* On each `GET /v1/packs/{packId}/data`:

  1. Estimate `rows_to_return` (using `LIMIT`/`OFFSET`).
  2. Load current month counters (cache in Redis).
  3. If `rows_returned + rows_to_return` exceeds quota:

     * Return `429` with JSON:

       ```json
       {
         "error": "quota_exceeded",
         "message": "You have reached your 100k row quota for ux_friction_b2b_crm_v1 this month."
       }
       ```

  4. Otherwise, update counter.

**Quota values** tie to subscription tier:

```ts
TierConfig {
  name: 'Standard';
  monthlyRowLimit: 100_000;
  requestPerMinuteLimit: 60;
}
```

