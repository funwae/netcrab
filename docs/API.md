# API Contract Specifications

## Core Types

```typescript
export type NetCrabEventType =
  | 'click'
  | 'scroll'
  | 'input_meta'
  | 'navigation'
  | 'focus_change'
  | 'custom';

export interface NetCrabEvent {
  orgId: string;
  productId: string;
  sessionId: string;
  userHash: string;
  ts: string; // ISO8601
  eventType: NetCrabEventType;
  screenId: string;
  route: string;
  appName?: string;
  elementType?: string;
  elementLabelHash?: string;
  errorCode?: string;
  latencyMs?: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  os?: string;
  browser?: string;
  extra?: Record<string, unknown>;
}

export interface NetCrabBatch {
  agentId: string;
  sdkVersion: string;
  events: NetCrabEvent[];
}
```

---

## Ingestion API

### `POST /v1/events/batch`

Accepts event batches from NetCrab Agents.

**Request Headers:**
```
Authorization: Bearer <agent-api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "agentId": "agent-123",
  "sdkVersion": "1.0.0",
  "events": [
    {
      "orgId": "acme",
      "productId": "crm-web",
      "sessionId": "s_abc123",
      "userHash": "u_9fe23...",
      "ts": "2025-11-23T17:04:28.123Z",
      "eventType": "click",
      "screenId": "lead_detail",
      "route": "/leads/42",
      "appName": "acme-crm",
      "elementType": "button",
      "elementLabelHash": "lbl_save",
      "deviceType": "desktop",
      "browser": "Chrome",
      "os": "Windows"
    }
  ]
}
```

**Response:**
```json
{
  "status": "ok",
  "accepted": 123,
  "rejected": 0
}
```

**Authentication:**
- Agent API key in `Authorization: Bearer <token>` header
- Optional mTLS for additional security

**Error Responses:**
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Invalid or missing API key
- `500 Internal Server Error` - Server error

---

## Insights API (Dashboard)

### `GET /v1/insights/overview`

Get overview metrics for a product.

**Query Parameters:**
- `orgId` (required) - Organization ID
- `productId` (required) - Product ID
- `from` (required) - Start date (ISO8601 or YYYY-MM-DD)
- `to` (required) - End date (ISO8601 or YYYY-MM-DD)

**Response:**
```json
{
  "orgId": "acme",
  "productId": "crm-web",
  "from": "2025-11-01",
  "to": "2025-11-23",
  "frictionIndex": 0.62,
  "efficiencyScore": 0.74,
  "sessions": 182340,
  "topHotspots": [
    {
      "screenId": "billing_page",
      "route": "/settings/billing",
      "friction": 0.81,
      "impactSessions": 32412,
      "trend": "up"
    },
    {
      "screenId": "export_modal",
      "route": "/leads/export",
      "friction": 0.77,
      "impactSessions": 12004,
      "trend": "flat"
    }
  ],
  "noteOfTheDay": {
    "id": "note_2025_11_23",
    "title": "Export rage-clicks after v2.3",
    "summary": "Users often click 'Export' three or more times in a row after the 2.3 release, then abandon the page. Error 500 frequency is elevated.",
    "createdAt": "2025-11-23T11:00:00Z"
  }
}
```

---

### `GET /v1/insights/hotspots`

Get friction hotspots for a product.

**Query Parameters:**
- `orgId` (required) - Organization ID
- `productId` (required) - Product ID
- `from` (required) - Start date
- `to` (required) - End date
- `limit` (optional) - Max results (default: 20)

**Response:**
```json
{
  "items": [
    {
      "screenId": "billing_page",
      "route": "/settings/billing",
      "sessions": 32412,
      "avgFriction": 0.81,
      "avgEfficiency": 0.55,
      "rageClickRate": 0.22,
      "dropoffRate": 0.31,
      "avgTimeSpentMs": 45000
    }
  ]
}
```

---

### `GET /v1/flows/top`

Get discovered task flows for a product.

**Query Parameters:**
- `orgId` (required) - Organization ID
- `productId` (required) - Product ID
- `from` (required) - Start date
- `to` (required) - End date
- `limit` (optional) - Max results (default: 10)

**Response:**
```json
{
  "flows": [
    {
      "id": "flow_1",
      "label": "Lead creation",
      "path": [
        "home",
        "leads_list",
        "lead_new_form",
        "lead_detail"
      ],
      "sessions": 5230,
      "completionRate": 0.86,
      "avgFriction": 0.41,
      "avgDurationSec": 72
    }
  ]
}
```

---

## Marketplace API (Data Buyer)

### `GET /v1/packs`

List available data packs.

**Query Parameters:**
- `vertical` (optional) - Filter by vertical
- `limit` (optional) - Max results (default: 20)

**Response:**
```json
{
  "packs": [
    {
      "id": "ux_friction_b2b_crm_v1",
      "title": "B2B CRM UX Friction Benchmarks v1",
      "vertical": "B2B_CRM",
      "updateFrequency": "daily",
      "samplePreview": {
        "medianClicks": 9.2,
        "medianDurationSec": 63.1,
        "meanFriction": 0.58
      }
    }
  ]
}
```

---

### `GET /v1/packs/{packId}/data`

Get data from a specific pack.

**Path Parameters:**
- `packId` (required) - Pack ID

**Query Parameters:**
- `from` (required) - Start date
- `to` (required) - End date
- `taskType` (optional) - Filter by task type
- `vertical` (optional) - Filter by vertical

**Response:**
```json
{
  "packId": "ux_friction_b2b_crm_v1",
  "from": "2025-11-01",
  "to": "2025-11-23",
  "rows": [
    {
      "date": "2025-11-22",
      "taskType": "create_lead",
      "flowComplexity": 3,
      "medianClicks": 8,
      "medianDurationSec": 52,
      "meanFriction": 0.46,
      "p90Friction": 0.71,
      "sampleSessions": 12400,
      "orgCount": 37
    }
  ]
}
```

---

## Health & Status

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-23T17:04:28.123Z"
}
```

---

### `GET /v1/agent/status`

Agent status (for agent health monitoring).

**Response:**
```json
{
  "status": "ok",
  "agentId": "agent-123",
  "lastEvent": "2025-11-23T17:04:28.123Z",
  "eventsQueued": 42
}
```
