# Marketplace UI – Seller & Buyer Experiences

## Marketplace UI – Seller & Buyer Experiences

### 1. Seller View (inside NetCrab Console)

Route: `/app/marketplace/seller`

Sections:

#### 1.1 "Your Contributions" Panel

Cards:

* **"This month's projected revenue"**

  * Big number: `$2,450.32`.
  * Breakdown mini-chart per pack.

* **Pack contribution list:**

  Table columns:

  * Pack
  * Sessions contributed
  * Share estimate (this month)
  * Status (active / building / low coverage)

Row example:

| Pack                              | Sessions | Est. share | Status |
| --------------------------------- | -------- | ---------: | ------ |
| B2B CRM UX Friction Benchmarks v1 | 182,340  |  $1,820.11 | Active |
| Support Desk Flows v1             | 77,902   |    $630.21 | Active |

Click row → modal with:

* Graph of your sessions contribution over time.
* Explanation: "Your org currently contributes 18% of sessions in this pack."

#### 1.2 Opt-in / Opt-out Toggles

Section: "Data sharing preferences".

* For each pack category:

  * Checkbox: "Include my anonymized data in UX Benchmarks pack."
  * Shows:

    * Impact on revenue.
    * Rough description of what is shared.

* Per-product overrides:

  * Table: product → vertical → packs.
  * Column with toggles.

Microcopy:
"NetCrab never shares PII or identifiers. Only aggregated patterns like 'median clicks to complete checkout'."

#### 1.3 Payouts & Statements

Route: `/app/marketplace/payouts`

* Summary card:

  * "Total payout to date"
  * "Next payout date"

* List of month rows:

| Month    | Amount | Status  | Statement |
| -------- | ------ | ------- | --------- |
| Nov 2025 | $2,450 | Pending | [View]    |
| Oct 2025 | $1,988 | Paid    | [View]    |

"View" opens statement page with details from `OrgMonthlyStatement`.

Button: `Connect Stripe to receive payouts` if not configured.

---

### 2. Buyer View (Marketplace Catalog)

Main route: `/marketplace` (public) and `/app/marketplace/buyer` (authed).

#### 2.1 Catalog Page

Grid of pack cards.

Card design:

* Pack title.
* Vertical badge: "B2B CRM".
* Category: "UX Benchmarks".
* Update frequency: "Daily".
* Price: "From $499/mo".
* Tiny sample: something like:

  "Median clicks: 8–10 · Median duration: 45–75s · 37 products"

Buttons:

* `View details`
* `Get this pack`

Filters on left:

* Vertical (multi-select).
* Category.
* Update frequency.
* Price range slider.

#### 2.2 Pack Detail Page

Sections:

1. **Hero:**

   * Title, vertical, category, update frequency.
   * Headline: "See how your CRM compares to 37 other products."

2. **Quick stats:**

   * "37+ contributing products."
   * "480k sessions per month."
   * "Median friction: 0.57."

3. **Sample chart:**

   * Line chart of friction over 30 days (dummy, from sampleData).

4. **Schema preview:**

   * Collapsible panel listing fields, types.

5. **"What you can do with this pack"**

   * Bulleted use cases.

6. **Pricing & Plan selector:**

   * Radiobuttons: "Standard", "Pro", "Enterprise contact".
   * CTA: `Subscribe & get access`.

7. **Compliance blurb:**

   * Short note re: anonymization, DP, no user-level data.

---

### 3. My Packs Page (Buyer Dashboard)

Route: `/app/marketplace/my-packs`

* List of packs buyer has access to.

* For each:

  * Next refresh time.
  * Row usage this month vs quota (progress bar).
  * Buttons:

    * `Download latest snapshot`
    * `Open in BI` (future)
    * `View API docs`

* API key management snippet right here:

  * "Your API key: ●●●●… (Regenerate)"

---

### 4. NetCrab Tone & Microcopy

Keep your "approachable and friendly" voice:

* Examples:

  * "This pack is fed by 37 products—your data included if you want to join the party."
  * "You've almost used up your 100k rows this month. Hungry for more? Upgrade your plan."
  * "Crab fact: A group of crabs is called a cast. Your pack is part of the NetCrab cast."

Minimal jokes in enterprise areas; more fun in marketing and Crab Notes.

