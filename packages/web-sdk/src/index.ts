/**
 * NetCrab Web SDK
 *
 * Lightweight browser SDK for capturing behavioral events
 * without capturing PII or sensitive data.
 */

import type { NetCrabConfig } from './types';
import { EventCapture } from './event-capture';

let eventCapture: EventCapture | null = null;

/**
 * Initialize NetCrab SDK
 */
export async function initNetCrab(config: NetCrabConfig): Promise<void> {
  if (eventCapture) {
    console.warn('[NetCrab] Already initialized');
    return;
  }

  if (!config.orgId || !config.productId || !config.agentUrl) {
    throw new Error('[NetCrab] Missing required config: orgId, productId, agentUrl');
  }

  const enabled = config.enabled !== false;
  const debug = config.debug === true;

  if (debug) {
    console.log('[NetCrab] Initializing with config:', {
      orgId: config.orgId,
      productId: config.productId,
      agentUrl: config.agentUrl,
      enabled,
    });
  }

  // Create event capture instance
  eventCapture = new EventCapture({
    orgId: config.orgId,
    productId: config.productId,
    agentUrl: config.agentUrl,
  });

  if (!enabled) {
    eventCapture.setEnabled(false);
    return;
  }

  // Set up event listeners
  setupEventListeners(eventCapture);

  if (debug) {
    console.log('[NetCrab] Initialized successfully');
  }
}

/**
 * Set up global event listeners
 */
function setupEventListeners(capture: EventCapture): void {
  // Click events
  document.addEventListener('click', (e) => {
    capture.captureClick(e).catch(console.error);
  }, true); // Use capture phase

  // Scroll events (throttled)
  let scrollTimeout: number | null = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout === null) {
      scrollTimeout = window.setTimeout(() => {
        capture.captureScroll().catch(console.error);
        scrollTimeout = null;
      }, 1000);
    }
  }, { passive: true });

  // Navigation events (SPA support)
  let currentUrl = window.location.href;
  const checkNavigation = () => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      capture.captureNavigation(currentUrl).catch(console.error);
    }
  };

  // Check for navigation periodically (for SPAs)
  setInterval(checkNavigation, 1000);

  // Listen to popstate for browser back/forward
  window.addEventListener('popstate', () => {
    capture.captureNavigation(window.location.href).catch(console.error);
  });

  // Focus change events
  window.addEventListener('focus', () => {
    capture.captureFocusChange(true).catch(console.error);
  });

  window.addEventListener('blur', () => {
    capture.captureFocusChange(false).catch(console.error);
  });
}

/**
 * Track a custom event
 */
export async function trackEvent(eventName: string, metadata?: Record<string, unknown>): Promise<void> {
  if (!eventCapture) {
    console.warn('[NetCrab] Not initialized. Call initNetCrab() first.');
    return;
  }
  await eventCapture.captureCustom(eventName, metadata);
}

/**
 * Start tracking a task
 */
export async function startTask(taskName: string, metadata?: Record<string, unknown>): Promise<void> {
  if (!eventCapture) {
    console.warn('[NetCrab] Not initialized. Call initNetCrab() first.');
    return;
  }
  await eventCapture.startTask(taskName, metadata);
}

/**
 * Complete a task
 */
export async function completeTask(taskName: string, metadata?: Record<string, unknown>): Promise<void> {
  if (!eventCapture) {
    console.warn('[NetCrab] Not initialized. Call initNetCrab() first.');
    return;
  }
  await eventCapture.completeTask(taskName, metadata);
}

/**
 * Update user ID
 */
export async function setUserId(userId: string): Promise<void> {
  if (!eventCapture) {
    console.warn('[NetCrab] Not initialized. Call initNetCrab() first.');
    return;
  }
  await eventCapture.updateUserId(userId);
}

/**
 * Enable/disable event capture
 */
export function setEnabled(enabled: boolean): void {
  if (!eventCapture) {
    console.warn('[NetCrab] Not initialized. Call initNetCrab() first.');
    return;
  }
  eventCapture.setEnabled(enabled);
}

/**
 * Destroy the SDK instance
 */
export function destroy(): void {
  if (eventCapture) {
    eventCapture.destroy();
    eventCapture = null;
  }
}

// Export types
export type { NetCrabConfig, NetCrabEvent, EventType, DeviceType } from './types';

