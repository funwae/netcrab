# Buyer Purchase Flow & Pricing

## Buyer Purchase Flow & Pricing

### 1. Buyer Journey Overview

1. Land on `netcrab.net` marketplace section or public pack page.
2. Click **"Buy this pack"**.
3. Sign up / log in (if not already).
4. Choose plan:

   * **Full subscription** (recommended).
   * Optional **API-only** with metered usage.

5. Enter payment details (Stripe Checkout).
6. After success:

   * Pack appears in `My Packs`.
   * Buyer receives:

     * Download link for latest snapshot.
     * API key and endpoint instructions.

---

### 2. Pricing Models

Choose something like:

* **Per-pack monthly subscription:**

  * Includes:

    * Unlimited downloads of daily/weekly updates.
    * Fair-use API access (with quotas described below).

Example tiers:

* `Standard` – 1 pack, 100k API rows/month – $499/mo.
* `Pro` – up to 5 packs, 1M API rows/month – $1500/mo.
* `Enterprise` – custom.

Within each tier, each pack has a base share of revenue to allocate.

---

### 3. Payment Methods

* Stripe Checkout:

  * Card payments by default.
  * Future: Stripe Invoicing for enterprise / offline contracting.

---

### 4. License & Usage Terms (Summary for UI)

Non-lawyer-friendly summary in UI (legal text lives in ToS):

* Internal use within buyer's org.
* No re-selling or re-publishing raw data.
* You can publish analyses and derived insights.
* No use for individual profiling, only product/UX analysis.

---

### 5. Download vs API Access

After purchase:

* **Downloads:**

  * Latest snapshot as CSV/Parquet.
  * Optional zipped bundles per month.

  Endpoint:

  * `GET /v1/packs/{packId}/download?format=parquet&window=2025-11`

* **API Access:**

  * Query by date range, task_type, vertical etc.
  * Rate-limited & row-count limited.

  Endpoint (earlier):

  * `GET /v1/packs/{packId}/data`

Additional filter params:

* `from`, `to`, `taskType`, `vertical`, `limit`, `offset`.

