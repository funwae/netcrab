/**
 * Event Bus Publisher
 *
 * Publishes events to Kafka/Redpanda
 */

import { Kafka } from 'kafkajs';
import type { NetCrabEvent } from './types';

export class EventBusPublisher {
  private kafka: Kafka;
  private producer: any;
  private connected = false;

  constructor(config: {
    brokers: string[];
    clientId: string;
  }) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
    });
    this.producer = this.kafka.producer();
  }

  /**
   * Connect to Kafka
   */
  async connect(): Promise<void> {
    if (this.connected) return;

    await this.producer.connect();
    this.connected = true;
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;

    await this.producer.disconnect();
    this.connected = false;
  }

  /**
   * Publish events to the raw events topic
   */
  async publishEvents(events: NetCrabEvent[]): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    // Group events by org/product for partitioning
    const eventsByKey = new Map<string, NetCrabEvent[]>();

    for (const event of events) {
      const key = `${event.orgId}:${event.productId}`;
      if (!eventsByKey.has(key)) {
        eventsByKey.set(key, []);
      }
      eventsByKey.get(key)!.push(event);
    }

    // Publish each group
    const messages = [];
    for (const [key, groupEvents] of eventsByKey) {
      for (const event of groupEvents) {
        messages.push({
          topic: 'events.raw',
          messages: [{
            key,
            value: JSON.stringify(event),
            timestamp: Date.now().toString(),
          }],
        });
      }
    }

    if (messages.length > 0) {
      await this.producer.sendBatch({
        topicMessages: messages,
      });
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.connected) {
        await this.connect();
      }
      return true;
    } catch (error) {
      console.error('[EventBus] Health check failed:', error);
      return false;
    }
  }
}

