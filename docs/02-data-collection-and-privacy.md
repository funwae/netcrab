# Data Collection & Privacy

## Data Collected

**Event-level telemetry** (no raw content / PII):

* Event types:

  * `click`, `scroll`, `input_meta` (no keystrokes), `navigation`, `focus_change`, `custom_event`

* Metadata (examples):

  * `element_role`, `element_label_hash`, `screen_id`, `app_name`, `route`, `latency_ms`, `error_code`, `device_type`, `os`, `browser`

* Session context:

  * `session_id` (random), `user_hash` (non-reversible), `org_id`, `product_id`, `ts`

> By default: **no keystroke content**, no email, no names, no free-text field values.

## Scrubbing & Hashing

1. SDK-level:

   * DOM inspector avoids capturing `input[type=password]`, textareas, and explicit `data-netcrab-ignore` elements.

   * If text is needed for context (`button` labels), we hash the string into an `element_label_hash`.

2. Agent-level (on-prem):

   * Configurable rules:

     * Domain/app allowlist.

     * Path patterns to ignore (e.g., `/admin`, `/hr`).

     * Additional field removal (e.g., any `userId` fields).

3. Cloud-level:

   * Enforced schema (no arbitrary extra fields).

   * Rejection and logging of events with disallowed keys.

## Consent & Governance

* **Per-customer config**:

  * Internal usage (dashboard) always available once installed.

  * Marketplace participation is **explicit opt-in** with:

    * Data-sharing agreement.

    * Ability to exclude specific products, paths, or segments.

* **Aggregation rules for sale:**

  * No cell (e.g., combination of vertical + flow type) is published with fewer than **k** distinct orgs (e.g., k = 20).

  * Values may have light noise added (differential privacy) to prevent re-identification.

