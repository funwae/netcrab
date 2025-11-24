/**
 * Sessionizer Service
 *
 * Groups events into sessions and calculates session metrics
 */

import { Kafka } from 'kafkajs';
import type { NetCrabEvent, SessionMetrics } from './types';

interface SessionState {
  orgId: string;
  productId: string;
  sessionId: string;
  userHash: string;
  events: NetCrabEvent[];
  startTs: string;
  lastTs: string;
  screenHistory: string[];
  rageClicks: number;
  backtracks: number;
  contextSwitches: number;
  tasksStarted: number;
  tasksCompleted: number;
  errorEvents: number;
}

export class Sessionizer {
  private sessions = new Map<string, SessionState>();
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private flushInterval = 60000; // 1 minute
  private flushTimer: NodeJS.Timeout | null = null;
  private kafka: Kafka;
  private producer: any;

  constructor(config: {
    kafkaBrokers: string[];
    sessionTimeout?: number;
  }) {
    this.kafka = new Kafka({
      clientId: 'netcrab-sessionizer',
      brokers: config.kafkaBrokers,
    });
    this.producer = this.kafka.producer();
    if (config.sessionTimeout) {
      this.sessionTimeout = config.sessionTimeout;
    }
  }

  async start(): Promise<void> {
    await this.producer.connect();
    this.startFlushTimer();

    // Set up Kafka consumer for raw events
    const consumer = this.kafka.consumer({ groupId: 'sessionizer-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'events.raw', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const event: NetCrabEvent = JSON.parse(message.value.toString());
          await this.processEvent(event);
        } catch (error) {
          console.error('[Sessionizer] Error processing event:', error);
        }
      },
    });
  }

  private async processEvent(event: NetCrabEvent): Promise<void> {
    const sessionKey = `${event.orgId}:${event.productId}:${event.sessionId}`;
    let session = this.sessions.get(sessionKey);

    if (!session) {
      // New session
      session = {
        orgId: event.orgId,
        productId: event.productId,
        sessionId: event.sessionId,
        userHash: event.userHash,
        events: [],
        startTs: event.ts,
        lastTs: event.ts,
        screenHistory: [],
        rageClicks: 0,
        backtracks: 0,
        contextSwitches: 0,
        tasksStarted: 0,
        tasksCompleted: 0,
        errorEvents: 0,
      };
      this.sessions.set(sessionKey, session);
    }

    // Update session
    session.events.push(event);
    session.lastTs = event.ts;

    // Track screen navigation
    if (event.eventType === 'navigation') {
      const lastScreen = session.screenHistory[session.screenHistory.length - 1];
      if (lastScreen && lastScreen === event.screenId) {
        // Same screen, skip
      } else {
        session.screenHistory.push(event.screenId);
      }
    }

    // Track errors
    if (event.errorCode) {
      session.errorEvents++;
    }

    // Track tasks
    if (event.eventType === 'custom') {
      const taskName = (event.extra as any)?.task_name;
      if (taskName) {
        if (event.route?.includes('task_start')) {
          session.tasksStarted++;
        } else if (event.route?.includes('task_complete')) {
          session.tasksCompleted++;
        }
      }
    }

    // Check if session should be closed (timeout)
    const eventTime = new Date(event.ts).getTime();
    const lastTime = new Date(session.lastTs).getTime();
    if (eventTime - lastTime > this.sessionTimeout) {
      await this.closeSession(sessionKey);
    }
  }

  private async closeSession(sessionKey: string): Promise<void> {
    const session = this.sessions.get(sessionKey);
    if (!session) return;

    // Calculate metrics
    const metrics = this.calculateMetrics(session);

    // Publish to sessionized topic
    await this.producer.send({
      topic: 'events.sessionized',
      messages: [{
        key: sessionKey,
        value: JSON.stringify(metrics),
      }],
    });

    // Remove from active sessions
    this.sessions.delete(sessionKey);
  }

  private calculateMetrics(session: SessionState): SessionMetrics {
    const startTime = new Date(session.startTs).getTime();
    const endTime = new Date(session.lastTs).getTime();
    const durationMs = endTime - startTime;

    // Count clicks
    const clickCount = session.events.filter(e => e.eventType === 'click').length;

    // Unique screens
    const uniqueScreens = new Set(session.screenHistory).size;

    // Detect backtracks (A -> B -> A pattern)
    let backtracks = 0;
    for (let i = 2; i < session.screenHistory.length; i++) {
      if (session.screenHistory[i] === session.screenHistory[i - 2]) {
        backtracks++;
      }
    }

    // Calculate frustration score (heuristic)
    const frustrationScore = this.calculateFrustrationScore(session);

    // Calculate efficiency score (heuristic)
    const efficiencyScore = this.calculateEfficiencyScore(session, durationMs, clickCount);

    return {
      orgId: session.orgId,
      productId: session.productId,
      sessionId: session.sessionId,
      userHash: session.userHash,
      startTs: session.startTs,
      endTs: session.lastTs,
      durationMs,
      clickCount,
      uniqueScreens,
      rageClicks: session.rageClicks,
      backtracks,
      contextSwitches: session.contextSwitches,
      tasksStarted: session.tasksStarted,
      tasksCompleted: session.tasksCompleted,
      errorEvents: session.errorEvents,
      frustrationScore,
      efficiencyScore,
    };
  }

  private calculateFrustrationScore(session: SessionState): number {
    // Sigmoid function: frustration = sigmoid(w_rage * rage_clicks + w_back * backtracks + w_err * error_events)
    const w_rage = 0.3;
    const w_back = 0.2;
    const w_err = 0.4;
    const w_ab = 0.1;

    const abandonedTasks = Math.max(0, session.tasksStarted - session.tasksCompleted);
    const rawScore = w_rage * session.rageClicks + w_back * session.backtracks + w_err * session.errorEvents + w_ab * abandonedTasks;

    // Sigmoid normalization to 0-1
    return 1 / (1 + Math.exp(-rawScore));
  }

  private calculateEfficiencyScore(session: SessionState, durationMs: number, clickCount: number): number {
    // Efficiency = sigmoid(w_t * (-duration_normalized) + w_clk * (-clicks_per_task_normalized))
    const w_t = 0.5;
    const w_clk = 0.3;
    const w_nav = 0.2;

    // Normalize duration (assume 5 minutes = 1.0, longer = lower)
    const durationNormalized = Math.min(1.0, 300000 / durationMs); // 5 min = 1.0

    // Normalize clicks per task (assume 5 clicks per task = 1.0)
    const tasks = Math.max(1, session.tasksCompleted);
    const clicksPerTask = clickCount / tasks;
    const clicksNormalized = Math.min(1.0, 5 / clicksPerTask);

    // Unnecessary navigation (inverse of unique screens / total screens)
    const uniqueScreensCount = new Set(session.screenHistory).size;
    const navEfficiency = session.screenHistory.length > 0
      ? uniqueScreensCount / session.screenHistory.length
      : 1.0;

    const rawScore = w_t * durationNormalized + w_clk * clicksNormalized + w_nav * navEfficiency;

    // Sigmoid normalization to 0-1
    return 1 / (1 + Math.exp(-rawScore * 2)); // Scale by 2 for better distribution
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(async () => {
      // Close sessions that have timed out
      const now = Date.now();
      for (const [key, session] of this.sessions.entries()) {
        const lastTime = new Date(session.lastTs).getTime();
        if (now - lastTime > this.sessionTimeout) {
          await this.closeSession(key);
        }
      }
    }, this.flushInterval);
  }

  async stop(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Close all remaining sessions
    for (const key of this.sessions.keys()) {
      await this.closeSession(key);
    }

    await this.producer.disconnect();
  }
}

