# NetCrab Console UX

## 7.1 Visual Style

* Overall vibe: **Friendly analyst crab**:

  * Color palette: deep navy, sand, coral accent.

  * Rounded corners, soft shadows, no "dark surveillance" vibe.

* Microcopy: conversational, non-accusatory ("Your users are bumping into this step." instead of "Users failing").

## 7.2 Global Layout

* **Top bar:** logo + "NetCrab", environment switcher (Org / Product), date range picker, user menu.

* **Left nav:**

  * Overview

  * Flows

  * Hotspots

  * Crab Notes (AI insights)

  * Marketplace

  * Settings

## 7.3 Overview (Home)

Components:

1. **Frustration & Efficiency Cards**

   * Big numbers + sparkline:

     * "Friction Index: 0.62 (▲ 0.08 this week)"

     * "Efficiency Score: 0.74 (▼ 0.02)"

2. **"Today's Crabby Areas"**

   * Top 3 screens with highest friction + "View details" buttons.

3. **Flow Snapshot**

   * Mini Sankey: top path, dropoff labeled "users scuttled away here".

4. **Crab Note**

   * Speech bubble with AI-generated insight:

     * "I noticed many short, high-friction sessions around the billing page after Tuesday's deploy."

## 7.4 Flows Page

* Large interactive flow diagram.

* Left filter panel:

  * Task type, user segment, device, version, friction range.

* Clicking any node:

  * Metrics: avg time on step.

  * Avg clicks.

  * Associated frustration score.

## 7.5 Hotspots Page

* Table with:

  * Screen / Route, `Friction`, `Impact`, `Trend`, `Top Symptoms`.

* On row click:

  * Timeline view of events.

  * Embedded chart: rage-click rate over time.

  * Reference LLM summary & recommended experiment ideas.

## 7.6 Marketplace Page (Seller View)

* "Your Contributions" panel:

  * Packs you are in.

  * Last month's revenue & sessions contributed.

* "Opt-in / Opt-out" toggles by product / task category.

* "What buyers see" preview:

  * Non-sensitive example of how your data appears (fully aggregated).

## 7.7 Marketplace Page (Public/Buyer View)

* Card grid of packs:

  * Category, description, data preview, price.

* Pack details page:

  * Schema, sample chart, methodology, minimum coverage.

