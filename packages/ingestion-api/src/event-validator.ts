/**
 * Event validation for Ingestion API
 */

import type { NetCrabEvent, NetCrabBatch } from './types';

export class EventValidator {
  /**
   * Validate a single event
   */
  validateEvent(event: any): { valid: boolean; error?: string } {
    // Required fields
    if (!event.orgId || typeof event.orgId !== 'string') {
      return { valid: false, error: 'Missing or invalid orgId' };
    }
    if (!event.productId || typeof event.productId !== 'string') {
      return { valid: false, error: 'Missing or invalid productId' };
    }
    if (!event.sessionId || typeof event.sessionId !== 'string') {
      return { valid: false, error: 'Missing or invalid sessionId' };
    }
    if (!event.userHash || typeof event.userHash !== 'string') {
      return { valid: false, error: 'Missing or invalid userHash' };
    }
    if (!event.ts || typeof event.ts !== 'string') {
      return { valid: false, error: 'Missing or invalid ts' };
    }
    if (!event.eventType || !['click', 'scroll', 'input_meta', 'navigation', 'focus_change', 'custom'].includes(event.eventType)) {
      return { valid: false, error: 'Missing or invalid eventType' };
    }
    if (!event.screenId || typeof event.screenId !== 'string') {
      return { valid: false, error: 'Missing or invalid screenId' };
    }
    if (!event.route || typeof event.route !== 'string') {
      return { valid: false, error: 'Missing or invalid route' };
    }
    if (!event.deviceType || !['desktop', 'mobile', 'tablet'].includes(event.deviceType)) {
      return { valid: false, error: 'Missing or invalid deviceType' };
    }

    // Validate ISO8601 timestamp
    const ts = new Date(event.ts);
    if (isNaN(ts.getTime())) {
      return { valid: false, error: 'Invalid ISO8601 timestamp' };
    }

    return { valid: true };
  }

  /**
   * Validate a batch
   */
  validateBatch(batch: any): { valid: boolean; error?: string } {
    if (!batch.agentId || typeof batch.agentId !== 'string') {
      return { valid: false, error: 'Missing or invalid agentId' };
    }
    if (!batch.sdkVersion || typeof batch.sdkVersion !== 'string') {
      return { valid: false, error: 'Missing or invalid sdkVersion' };
    }
    if (!Array.isArray(batch.events)) {
      return { valid: false, error: 'Missing or invalid events array' };
    }
    if (batch.events.length === 0) {
      return { valid: false, error: 'Events array is empty' };
    }
    if (batch.events.length > 1000) {
      return { valid: false, error: 'Batch size exceeds maximum (1000)' };
    }

    return { valid: true };
  }

  /**
   * Validate and filter events in a batch
   */
  validateAndFilterBatch(batch: NetCrabBatch): {
    validEvents: NetCrabEvent[];
    rejected: number;
    errors: string[];
  } {
    const validEvents: NetCrabEvent[] = [];
    const errors: string[] = [];

    for (let i = 0; i < batch.events.length; i++) {
      const event = batch.events[i];
      const validation = this.validateEvent(event);

      if (validation.valid) {
        validEvents.push(event as NetCrabEvent);
      } else {
        errors.push(`Event ${i}: ${validation.error}`);
      }
    }

    return {
      validEvents,
      rejected: batch.events.length - validEvents.length,
      errors,
    };
  }
}

