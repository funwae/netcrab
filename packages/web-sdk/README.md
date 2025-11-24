# @netcrab/web

Browser JavaScript SDK for NetCrab. Captures clicks, scrolls, navigation, and focus changes without capturing PII.

## Installation

```bash
npm install @netcrab/web
```

## Usage

### Basic Setup

```javascript
import { initNetCrab } from '@netcrab/web';

initNetCrab({
  orgId: 'your-org-id',
  productId: 'your-product-id',
  agentUrl: 'https://agent.yourcompany.local',
  debug: true // optional
});
```

### Track Custom Events

```javascript
import { trackEvent } from '@netcrab/web';

trackEvent('feature_used', {
  feature_name: 'export',
  feature_version: '1.2.3'
});
```

### Track Tasks

```javascript
import { startTask, completeTask } from '@netcrab/web';

// Start a task
await startTask('checkout', {
  cart_value: 99.99
});

// ... user completes checkout ...

// Complete the task
await completeTask('checkout', {
  success: true,
  payment_method: 'credit_card'
});
```

### Update User ID

```javascript
import { setUserId } from '@netcrab/web';

// When user logs in
await setUserId('user-123');

// When user logs out
await setUserId('anonymous');
```

### Enable/Disable

```javascript
import { setEnabled } from '@netcrab/web';

// Disable tracking (e.g., for admin users)
setEnabled(false);

// Re-enable
setEnabled(true);
```

## Features

- **Automatic Event Capture**: Clicks, scrolls, navigation, focus changes
- **PII Protection**: Automatically avoids password fields, textareas, and `data-netcrab-ignore` elements
- **Client-side Hashing**: User IDs and element labels are hashed before sending
- **Session Tracking**: Automatic session ID generation
- **SPA Support**: Detects navigation in single-page applications
- **Batching**: Events are batched and sent efficiently
- **Privacy-first**: No keystrokes, no personal content captured

## Configuration

```typescript
interface NetCrabConfig {
  orgId: string;           // Required: Your organization ID
  productId: string;       // Required: Your product ID
  agentUrl: string;        // Required: NetCrab Agent URL
  sampleRate?: number;     // Optional: 0-1, default 1.0
  enabled?: boolean;       // Optional: default true
  debug?: boolean;         // Optional: default false
}
```

## Ignoring Elements

Add `data-netcrab-ignore` attribute to any element to exclude it from tracking:

```html
<button data-netcrab-ignore>Admin Only</button>
<div data-netcrab-ignore>
  <!-- This entire section won't be tracked -->
</div>
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires native `crypto.subtle` API for hashing
