/**
 * Event capture functionality for NetCrab Web SDK
 */

import type { NetCrabEvent, EventType, DeviceType } from './types';
import {
  generateEventId,
  generateSessionId,
  hashString,
  hashUserId,
  detectDeviceType,
  getBrowser,
  getOS,
  shouldIgnoreElement,
  getElementLabel,
} from './utils';

export class EventCapture {
  private sessionId: string;
  private userHash: string;
  private productId: string;
  private orgId: string;
  private agentUrl: string;
  private eventQueue: NetCrabEvent[] = [];
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds
  private flushTimer: number | null = null;
  private enabled = true;

  constructor(config: { orgId: string; productId: string; agentUrl: string; userId?: string }) {
    this.orgId = config.orgId;
    this.productId = config.productId;
    this.agentUrl = config.agentUrl;
    this.sessionId = generateSessionId();
    this.userHash = 'anonymous'; // Will be set async

    // Initialize user hash
    this.initializeUserHash(config.userId);

    // Start batch flush timer
    this.startFlushTimer();

    // Capture page unload to flush remaining events
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  private async initializeUserHash(userId?: string): Promise<void> {
    this.userHash = await hashUserId(userId);
  }

  private startFlushTimer(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Capture a click event
   */
  async captureClick(event: MouseEvent): Promise<void> {
    if (!this.enabled) return;
    if (!event.target || !(event.target instanceof HTMLElement)) return;
    if (shouldIgnoreElement(event.target)) return;

    const element = event.target;
    const label = getElementLabel(element);
    let elementLabelHash: string | undefined;

    if (label) {
      elementLabelHash = await hashString(label);
    }

    const metadata = {
      element_type: element.tagName.toLowerCase(),
      element_label_hash: elementLabelHash,
      device_type: detectDeviceType() as DeviceType,
      browser: getBrowser(),
      os: getOS(),
    };

    await this.captureEvent('click', {
      url: window.location.href,
      screen_name: document.title,
      app_name: window.location.hostname,
    }, metadata);
  }

  /**
   * Capture a scroll event (throttled)
   */
  private scrollThrottle: number | null = null;
  async captureScroll(): Promise<void> {
    if (!this.enabled) return;
    if (this.scrollThrottle !== null) return;

    this.scrollThrottle = window.setTimeout(() => {
      this.scrollThrottle = null;
    }, 1000); // Throttle to once per second

    const metadata = {
      device_type: detectDeviceType() as DeviceType,
      browser: getBrowser(),
      os: getOS(),
    };

    await this.captureEvent('scroll', {
      url: window.location.href,
      screen_name: document.title,
      app_name: window.location.hostname,
    }, metadata);
  }

  /**
   * Capture a navigation event
   */
  async captureNavigation(url: string, screenName?: string): Promise<void> {
    if (!this.enabled) return;

    const metadata = {
      device_type: detectDeviceType() as DeviceType,
      browser: getBrowser(),
      os: getOS(),
    };

    await this.captureEvent('navigation', {
      url,
      screen_name: screenName || document.title,
      app_name: window.location.hostname,
    }, metadata);
  }

  /**
   * Capture a focus change event
   */
  async captureFocusChange(hasFocus: boolean): Promise<void> {
    if (!this.enabled) return;

    const metadata = {
      device_type: detectDeviceType() as DeviceType,
      browser: getBrowser(),
      os: getOS(),
      focused: hasFocus,
    };

    await this.captureEvent('focus_change', {
      url: window.location.href,
      screen_name: document.title,
      app_name: window.location.hostname,
    }, metadata);
  }

  /**
   * Capture a custom event
   */
  async captureCustom(eventName: string, metadata: Record<string, unknown> = {}): Promise<void> {
    if (!this.enabled) return;

    const fullMetadata = {
      ...metadata,
      custom_event_name: eventName,
      device_type: detectDeviceType() as DeviceType,
      browser: getBrowser(),
      os: getOS(),
    };

    await this.captureEvent('custom', {
      url: window.location.href,
      screen_name: document.title,
      app_name: window.location.hostname,
    }, fullMetadata);
  }

  /**
   * Start tracking a task
   */
  async startTask(taskName: string, metadata: Record<string, unknown> = {}): Promise<void> {
    await this.captureCustom(`task_start:${taskName}`, {
      ...metadata,
      task_name: taskName,
    });
  }

  /**
   * Complete a task
   */
  async completeTask(taskName: string, metadata: Record<string, unknown> = {}): Promise<void> {
    await this.captureCustom(`task_complete:${taskName}`, {
      ...metadata,
      task_name: taskName,
    });
  }

  /**
   * Internal method to capture an event
   */
  private async captureEvent(
    eventType: EventType,
    location: { url: string; screen_name?: string; app_name?: string },
    metadata: Record<string, unknown>
  ): Promise<void> {
    const event: NetCrabEvent = {
      event_id: generateEventId(),
      session_id: this.sessionId,
      user_hash: this.userHash,
      product_id: this.productId,
      location,
      event_type: eventType,
      ts: new Date().toISOString(),
      metadata: metadata as any,
    };

    this.eventQueue.push(event);

    // Flush if batch size reached
    if (this.eventQueue.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Flush events to agent
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(`${this.agentUrl}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_id: this.orgId,
          product_id: this.productId,
          events,
          ts: new Date().toISOString(),
        }),
        keepalive: true, // Important for beforeunload
      });

      if (!response.ok) {
        console.warn('[NetCrab] Failed to send events:', response.statusText);
        // Re-queue events on failure (up to a limit)
        if (this.eventQueue.length < 100) {
          this.eventQueue.unshift(...events);
        }
      }
    } catch (error) {
      console.warn('[NetCrab] Error sending events:', error);
      // Re-queue events on failure (up to a limit)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * Enable/disable event capture
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopFlushTimer();
    } else {
      this.startFlushTimer();
    }
  }

  /**
   * Update user ID (re-hash)
   */
  async updateUserId(userId: string): Promise<void> {
    this.userHash = await hashUserId(userId);
  }

  /**
   * Destroy the event capture instance
   */
  destroy(): void {
    this.stopFlushTimer();
    this.flush();
    this.enabled = false;
  }
}

