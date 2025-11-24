/**
 * App API Server
 *
 * REST API for dashboard and insights
 */

import express, { Express, Request, Response } from 'express';
import compression from 'compression';
import { ClickHouseClient } from './clickhouse-client';
import { InsightsService } from './insights-service';
import type { CrabNote } from './types';

export class AppApiServer {
  private app: Express;
  private insightsService: InsightsService;

  constructor(config: {
    clickhouseUrl: string;
    llmProvider?: 'openai' | 'anthropic' | 'mock';
    llmApiKey?: string;
    llmModel?: string;
  }) {
    this.app = express();

    const clickhouse = new ClickHouseClient(config.clickhouseUrl);

    // LLM config from environment
    const llmConfig = {
      provider: (process.env.LLM_PROVIDER || 'mock') as 'openai' | 'anthropic' | 'mock',
      apiKey: process.env.LLM_API_KEY,
      model: process.env.LLM_MODEL,
    };

    this.insightsService = new InsightsService(clickhouse, llmConfig);

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(compression());
    this.app.use(express.json());
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

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
      });
    });

    // Overview endpoint
    this.app.get('/v1/insights/overview', async (req: Request, res: Response) => {
      try {
        const { orgId, productId, from, to } = req.query;

        if (!orgId || !productId || !from || !to) {
          return res.status(400).json({
            error: 'Missing required parameters: orgId, productId, from, to',
          });
        }

        const overview = await this.insightsService.getOverview({
          orgId: orgId as string,
          productId: productId as string,
          from: from as string,
          to: to as string,
        });

        res.json(overview);
      } catch (error) {
        console.error('[App API] Error getting overview:', error);
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });

    // Hotspots endpoint
    this.app.get('/v1/insights/hotspots', async (req: Request, res: Response) => {
      try {
        const { orgId, productId, from, to, limit } = req.query;

        if (!orgId || !productId || !from || !to) {
          return res.status(400).json({
            error: 'Missing required parameters: orgId, productId, from, to',
          });
        }

        const hotspots = await this.insightsService.getHotspots({
          orgId: orgId as string,
          productId: productId as string,
          from: from as string,
          to: to as string,
          limit: limit ? parseInt(limit as string, 10) : undefined,
        });

        res.json(hotspots);
      } catch (error) {
        console.error('[App API] Error getting hotspots:', error);
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });

    // Flows endpoint
    this.app.get('/v1/flows/top', async (req: Request, res: Response) => {
      try {
        const { orgId, productId, from, to, limit } = req.query;

        if (!orgId || !productId || !from || !to) {
          return res.status(400).json({
            error: 'Missing required parameters: orgId, productId, from, to',
          });
        }

        const flows = await this.insightsService.getTopFlows({
          orgId: orgId as string,
          productId: productId as string,
          from: from as string,
          to: to as string,
          limit: limit ? parseInt(limit as string, 10) : undefined,
        });

        res.json(flows);
      } catch (error) {
        console.error('[App API] Error getting flows:', error);
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });

    // Crab Notes endpoint
    this.app.get('/v1/crab-notes', async (req: Request, res: Response) => {
      try {
        const { orgId, productId, from, to, limit } = req.query;

        if (!orgId || !productId || !from || !to) {
          return res.status(400).json({
            error: 'Missing required parameters: orgId, productId, from, to',
          });
        }

        const notes = await this.insightsService.getCrabNotes({
          orgId: orgId as string,
          productId: productId as string,
          from: from as string,
          to: to as string,
          limit: limit ? parseInt(limit as string, 10) : undefined,
        });

        res.json({ notes });
      } catch (error) {
        console.error('[App API] Error getting crab notes:', error);
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });

    // Single Crab Note endpoint
    this.app.get('/v1/crab-notes/:screenId', async (req: Request, res: Response) => {
      try {
        const { orgId, productId, friction, sessions } = req.query;
        const { screenId } = req.params;

        if (!orgId || !productId || !friction || !sessions) {
          return res.status(400).json({
            error: 'Missing required parameters: orgId, productId, friction, sessions',
          });
        }

        // Get route from hotspots or use default
        const route = req.query.route as string || `/${screenId}`;

        const note = await this.insightsService.getCrabNote({
          orgId: orgId as string,
          productId: productId as string,
          screenId,
          route,
          friction: parseFloat(friction as string),
          sessions: parseInt(sessions as string, 10),
        });

        res.json(note);
      } catch (error) {
        console.error('[App API] Error getting crab note:', error);
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });
  }

  /**
   * Start the server
   */
  async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`[App API] Server running on http://localhost:${port}`);
        console.log(`[App API] Health: http://localhost:${port}/health`);
        console.log(`[App API] Overview: http://localhost:${port}/v1/insights/overview`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    // Cleanup would go here
  }
}

