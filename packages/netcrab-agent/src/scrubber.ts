/**
 * Event scrubbing and hashing utilities
 */

import crypto from 'crypto';
import type { ScrubbingRule } from './types';

export class EventScrubber {
  private allowedDomains: string[];
  private ignoredPaths: string[];
  private scrubbingRules: ScrubbingRule[];

  constructor(config: {
    allowedDomains?: string[];
    ignoredPaths?: string[];
    scrubbingRules?: ScrubbingRule[];
  }) {
    this.allowedDomains = config.allowedDomains || [];
    this.ignoredPaths = config.ignoredPaths || [];
    this.scrubbingRules = config.scrubbingRules || [];
  }

  /**
   * Hash a string using SHA-256
   */
  private hashString(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Check if event should be filtered
   */
  shouldFilter(event: any): boolean {
    // Check domain allowlist
    if (this.allowedDomains.length > 0) {
      const url = event.location?.url || '';
      const domain = new URL(url).hostname;
      if (!this.allowedDomains.some(allowed => domain.includes(allowed))) {
        return true; // Filter out
      }
    }

    // Check ignored paths
    if (this.ignoredPaths.length > 0) {
      const url = event.location?.url || '';
      if (this.ignoredPaths.some(path => url.includes(path))) {
        return true; // Filter out
      }
    }

    return false;
  }

  /**
   * Scrub an event according to rules
   */
  scrubEvent(event: any): any {
    // Deep clone to avoid mutating original
    const scrubbed = JSON.parse(JSON.stringify(event));

    // Apply scrubbing rules
    for (const rule of this.scrubbingRules) {
      this.applyRule(scrubbed, rule);
    }

    // Remove any disallowed fields
    this.removeDisallowedFields(scrubbed);

    return scrubbed;
  }

  /**
   * Apply a single scrubbing rule
   */
  private applyRule(obj: any, rule: ScrubbingRule, path = ''): void {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;

      if (rule.field === currentPath || key === rule.field) {
        switch (rule.action) {
          case 'remove':
            delete obj[key];
            break;
          case 'hash':
            if (typeof obj[key] === 'string') {
              obj[key] = this.hashString(obj[key]);
            }
            break;
          case 'mask':
            if (typeof obj[key] === 'string') {
              obj[key] = '***';
            }
            break;
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        this.applyRule(obj[key], rule, currentPath);
      }
    }
  }

  /**
   * Remove disallowed fields from event
   */
  private removeDisallowedFields(event: any): void {
    const disallowedFields = [
      'email',
      'username',
      'password',
      'ssn',
      'credit_card',
      'phone',
      'address',
    ];

    const removeFields = (obj: any): void => {
      for (const key in obj) {
        const lowerKey = key.toLowerCase();
        if (disallowedFields.some(field => lowerKey.includes(field))) {
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          removeFields(obj[key]);
        }
      }
    };

    removeFields(event);
  }

  /**
   * Scrub a batch of events
   */
  scrubBatch(events: any[]): any[] {
    return events
      .filter(event => !this.shouldFilter(event))
      .map(event => this.scrubEvent(event));
  }
}

