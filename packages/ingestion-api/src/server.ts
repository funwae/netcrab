/**
 * NetCrab Ingestion API Server
 */

import express, { Express, Request, Response } from 'express';
import compression from 'compression';
import type { NetCrabBatch, BatchResponse } from './types';
import { EventValidator } from './event-validator';
import { EventBusPublisher } from './event-bus';

export class IngestionServer {
  private app: Express;
  private validator: EventValidator;
  private eventBus: EventBusPublisher;
  private apiKeys: Set<string>;

  constructor(config: {
    port: number;
    kafkaBrokers: string[];
    apiKeys: string[];
  }) {
    this.app = express();
    this.validator = new EventValidator();
    this.eventBus = new EventBusPublisher({
      brokers: config.kafkaBrokers,
      clientId: 'netcrab-ingestion-api',
    });
    this.apiKeys = new Set(config.apiKeys);

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // CORS (for development)
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });
  }

  private authenticate(req: Request, res: Response, next: () => void): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.substring(7);
    if (!this.apiKeys.has(token)) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    next();
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
      });
    });

    // Batch ingestion endpoint
    this.app.post('/v1/events/batch', this.authenticate.bind(this), async (req: Request, res: Response) => {
      try {
        const batch = req.body as NetCrabBatch;

        // Validate batch structure
        const batchValidation = this.validator.validateBatch(batch);
        if (!batchValidation.valid) {
          return res.status(400).json({
            status: 'error',
            accepted: 0,
            rejected: batch.events?.length || 0,
            errors: [batchValidation.error!],
          } as BatchResponse);
        }

        // Validate and filter events
        const { validEvents, rejected, errors } = this.validator.validateAndFilterBatch(batch);

        // Publish valid events to event bus
        if (validEvents.length > 0) {
          try {
            await this.eventBus.publishEvents(validEvents);
          } catch (error) {
            console.error('[Ingestion API] Failed to publish events:', error);
            return res.status(500).json({
              status: 'error',
              accepted: 0,
              rejected: batch.events.length,
              errors: ['Failed to publish events to event bus'],
            } as BatchResponse);
          }
        }

        const response: BatchResponse = {
          status: 'ok',
          accepted: validEvents.length,
          rejected,
        };

        if (errors.length > 0) {
          response.errors = errors;
        }

        res.json(response);
      } catch (error) {
        console.error('[Ingestion API] Error processing batch:', error);
        res.status(500).json({
          status: 'error',
          accepted: 0,
          rejected: 0,
          errors: ['Internal server error'],
        } as BatchResponse);
      }
    });
  }

  /**
   * Start the server
   */
  async start(port: number): Promise<void> {
    // Connect to event bus
    await this.eventBus.connect();

    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`[Ingestion API] Server running on http://localhost:${port}`);
        console.log(`[Ingestion API] Health: http://localhost:${port}/health`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    await this.eventBus.disconnect();
  }
}

