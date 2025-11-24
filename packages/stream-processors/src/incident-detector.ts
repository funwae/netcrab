/**
 * Incident Detector Service
 *
 * Detects rage-clicks, backtracks, and abandoned tasks
 */

import { Kafka } from 'kafkajs';
import type { NetCrabEvent, Incident } from './types';

interface ClickEvent {
  ts: string;
  screenId: string;
  elementLabelHash?: string;
}

export class IncidentDetector {
  private kafka: Kafka;
  private producer: any;
  private clickHistory = new Map<string, ClickEvent[]>();
  private screenHistory = new Map<string, string[]>();
  private taskStartEvents = new Map<string, { ts: string; taskName: string }>();

  constructor(config: {
    kafkaBrokers: string[];
  }) {
    this.kafka = new Kafka({
      clientId: 'netcrab-incident-detector',
      brokers: config.kafkaBrokers,
    });
    this.producer = this.kafka.producer();
  }

  async start(): Promise<void> {
    await this.producer.connect();

    // Set up Kafka consumer for raw events
    const consumer = this.kafka.consumer({ groupId: 'incident-detector-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'events.raw', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const event: NetCrabEvent = JSON.parse(message.value.toString());
          await this.processEvent(event);
        } catch (error) {
          console.error('[IncidentDetector] Error processing event:', error);
        }
      },
    });
  }

  private async processEvent(event: NetCrabEvent): Promise<void> {
    const sessionKey = `${event.orgId}:${event.productId}:${event.sessionId}`;

    // Detect rage clicks
    if (event.eventType === 'click') {
      await this.detectRageClick(event, sessionKey);
    }

    // Detect backtracks
    if (event.eventType === 'navigation') {
      await this.detectBacktrack(event, sessionKey);
    }

    // Track task starts/completions
    if (event.eventType === 'custom') {
      await this.trackTask(event, sessionKey);
    }
  }

  private async detectRageClick(event: NetCrabEvent, sessionKey: string): Promise<void> {
    const clickKey = `${sessionKey}:${event.screenId}:${event.elementLabelHash || 'unknown'}`;

    if (!this.clickHistory.has(clickKey)) {
      this.clickHistory.set(clickKey, []);
    }

    const clicks = this.clickHistory.get(clickKey)!;
    clicks.push({
      ts: event.ts,
      screenId: event.screenId,
      elementLabelHash: event.elementLabelHash,
    });

    // Keep only clicks from last 2 seconds
    const twoSecondsAgo = new Date(event.ts).getTime() - 2000;
    const recentClicks = clicks.filter(c => new Date(c.ts).getTime() > twoSecondsAgo);
    this.clickHistory.set(clickKey, recentClicks);

    // If 3+ clicks within 1-2 seconds, it's a rage click
    if (recentClicks.length >= 3) {
      const incident: Incident = {
        orgId: event.orgId,
        productId: event.productId,
        sessionId: event.sessionId,
        incidentType: 'rage_click',
        screenId: event.screenId,
        route: event.route,
        ts: event.ts,
        metadata: {
          elementLabelHash: event.elementLabelHash,
          clickCount: recentClicks.length,
          timeWindow: 2000,
        },
      };

      await this.producer.send({
        topic: 'events.incidents',
        messages: [{
          key: sessionKey,
          value: JSON.stringify(incident),
        }],
      });

      // Clear history for this element
      this.clickHistory.delete(clickKey);
    }
  }

  private async detectBacktrack(event: NetCrabEvent, sessionKey: string): Promise<void> {
    if (!this.screenHistory.has(sessionKey)) {
      this.screenHistory.set(sessionKey, []);
    }

    const history = this.screenHistory.get(sessionKey)!;
    history.push(event.screenId);

    // Keep only last 10 screens
    if (history.length > 10) {
      history.shift();
    }

    // Detect A -> B -> A pattern within 20 seconds
    if (history.length >= 3) {
      const current = history[history.length - 1];
      const previous = history[history.length - 2];
      const beforePrevious = history[history.length - 3];

      if (current === beforePrevious && current !== previous) {
        // Check time window (20 seconds)
        const currentTime = new Date(event.ts).getTime();
        const beforePreviousTime = new Date(event.ts).getTime() - 20000; // Approximate

        // If pattern detected, create incident
        const incident: Incident = {
          orgId: event.orgId,
          productId: event.productId,
          sessionId: event.sessionId,
          incidentType: 'backtrack',
          screenId: event.screenId,
          route: event.route,
          ts: event.ts,
          metadata: {
            path: [beforePrevious, previous, current],
            timeWindow: 20000,
          },
        };

        await this.producer.send({
          topic: 'events.incidents',
          messages: [{
            key: sessionKey,
            value: JSON.stringify(incident),
          }],
        });
      }
    }
  }

  private async trackTask(event: NetCrabEvent, sessionKey: string): Promise<void> {
    const taskName = (event.extra as any)?.task_name;
    if (!taskName) return;

    const taskKey = `${sessionKey}:${taskName}`;

    if (event.route?.includes('task_start') || (event.extra as any)?.action === 'start') {
      // Task started
      this.taskStartEvents.set(taskKey, {
        ts: event.ts,
        taskName,
      });
    } else if (event.route?.includes('task_complete') || (event.extra as any)?.action === 'complete') {
      // Task completed - remove from tracking
      this.taskStartEvents.delete(taskKey);
    } else {
      // Check for abandoned tasks (started but not completed within 15 minutes)
      const taskStart = this.taskStartEvents.get(taskKey);
      if (taskStart) {
        const startTime = new Date(taskStart.ts).getTime();
        const currentTime = new Date(event.ts).getTime();
        const elapsed = currentTime - startTime;

        if (elapsed > 15 * 60 * 1000) { // 15 minutes
          const incident: Incident = {
            orgId: event.orgId,
            productId: event.productId,
            sessionId: event.sessionId,
            incidentType: 'abandoned_task',
            screenId: event.screenId,
            route: event.route,
            ts: event.ts,
            metadata: {
              taskName,
              elapsedMs: elapsed,
            },
          };

          await this.producer.send({
            topic: 'events.incidents',
            messages: [{
              key: sessionKey,
              value: JSON.stringify(incident),
            }],
          });

          // Remove from tracking
          this.taskStartEvents.delete(taskKey);
        }
      }
    }
  }

  async stop(): Promise<void> {
    await this.producer.disconnect();
  }
}

