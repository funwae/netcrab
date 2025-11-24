/**
 * HTTP server for NetCrab Agent
 */

import express, { Express, Request, Response } from 'express';
import compression from 'compression';
import type { AgentConfig } from './types';
import { EventScrubber } from './scrubber';
import { EventBatcher } from './batcher';
import { EventForwarder } from './forwarder';

export class AgentServer {
  private app: Express;
  private config: AgentConfig;
  private scrubber: EventScrubber;
  private batcher: EventBatcher;
  private forwarder: EventForwarder;
  private stats = {
    eventsReceived: 0,
    eventsForwarded: 0,
    eventsFiltered: 0,
    batchesSent: 0,
    errors: 0,
  };

  constructor(config: AgentConfig) {
    this.config = config;
    this.app = express();

    // Initialize components
    this.scrubber = new EventScrubber({
      allowedDomains: config.allowedDomains,
      ignoredPaths: config.ignoredPaths,
    });

    this.forwarder = new EventForwarder({
      cloudUrl: config.cloudIngestionUrl,
      apiKey: config.apiKey,
    });

    this.batcher = new EventBatcher({
      batchSize: config.batchSize || 50,
      flushInterval: config.flushInterval || 5000,
      onFlush: async (batch) => {
        await this.forwarder.forward(batch);
        this.stats.batchesSent++;
        this.stats.eventsForwarded += batch.events.length;
      },
    });

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        stats: this.stats,
      });
    });

    // Status endpoint
    this.app.get('/status', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        config: {
          orgId: this.config.orgId,
          batchSize: this.config.batchSize,
          flushInterval: this.config.flushInterval,
        },
        stats: this.stats,
        cloudHealth: 'checking...',
      });

      // Check cloud health asynchronously
      this.forwarder.healthCheck().then(healthy => {
        // Could emit via WebSocket or store for next request
      });
    });

    // Event ingestion endpoint
    this.app.post('/v1/events', async (req: Request, res: Response) => {
      try {
        const { org_id, product_id, events, ts } = req.body;

        if (!org_id || !product_id || !Array.isArray(events)) {
          return res.status(400).json({
            error: 'Invalid request: missing org_id, product_id, or events array',
          });
        }

        this.stats.eventsReceived += events.length;

        // Scrub events
        const scrubbedEvents = this.scrubber.scrubBatch(events);
        this.stats.eventsFiltered += events.length - scrubbedEvents.length;

        // Apply sample rate if configured
        let sampledEvents = scrubbedEvents;
        if (this.config.sampleRate && this.config.sampleRate < 1) {
          sampledEvents = scrubbedEvents.filter(() => Math.random() < this.config.sampleRate!);
        }

        // Add to batch queue
        for (const event of sampledEvents) {
          this.batcher.add(event, org_id, product_id);
        }

        res.json({
          received: events.length,
          processed: sampledEvents.length,
          filtered: events.length - scrubbedEvents.length,
        });
      } catch (error) {
        this.stats.errors++;
        console.error('[NetCrab Agent] Error processing events:', error);
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });

    // Stats endpoint
    this.app.get('/stats', (req: Request, res: Response) => {
      res.json(this.stats);
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    const port = this.config.port || 7000;
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`[NetCrab Agent] Server running on http://localhost:${port}`);
        console.log(`[NetCrab Agent] Health: http://localhost:${port}/health`);
        console.log(`[NetCrab Agent] Status: http://localhost:${port}/status`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    this.batcher.stop();
    // Express server cleanup would go here
  }
}

