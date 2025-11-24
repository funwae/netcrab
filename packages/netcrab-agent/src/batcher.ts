/**
 * Event batching and forwarding
 */

import type { EventBatch } from './types';

export class EventBatcher {
  private batchSize: number;
  private flushInterval: number;
  private queue: any[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private onFlush: (batch: EventBatch) => Promise<void>;

  constructor(config: {
    batchSize: number;
    flushInterval: number;
    onFlush: (batch: EventBatch) => Promise<void>;
  }) {
    this.batchSize = config.batchSize;
    this.flushInterval = config.flushInterval;
    this.onFlush = config.onFlush;
    this.startFlushTimer();
  }

  /**
   * Add event to batch
   */
  add(event: any, orgId: string, productId: string): void {
    this.queue.push({
      ...event,
      _orgId: orgId,
      _productId: productId,
    });

    // Flush if batch size reached
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush current batch
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    // Group events by org/product
    const batches = new Map<string, any[]>();

    for (const event of events) {
      const key = `${event._orgId}:${event._productId}`;
      if (!batches.has(key)) {
        batches.set(key, []);
      }
      const { _orgId, _productId, ...cleanEvent } = event;
      batches.get(key)!.push(cleanEvent);
    }

    // Send each batch
    for (const [key, batchEvents] of batches) {
      const [orgId, productId] = key.split(':');
      const batch: EventBatch = {
        org_id: orgId,
        product_id: productId,
        events: batchEvents,
        ts: new Date().toISOString(),
      };

      try {
        await this.onFlush(batch);
      } catch (error) {
        console.error('[NetCrab Agent] Failed to flush batch:', error);
        // Re-queue on failure (up to a limit)
        if (this.queue.length < 1000) {
          this.queue.push(...events);
        }
      }
    }
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop flush timer
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    // Final flush
    this.flush();
  }
}

