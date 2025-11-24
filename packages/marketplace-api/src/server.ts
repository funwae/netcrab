/**
 * Marketplace API Server
 * Fastify server with all marketplace endpoints
 */

import Fastify from 'fastify';
import { MarketplaceClickHouseClient } from './clickhouse-client';
import { PackService } from './pack-service';
import { APIKeyService } from './api-key-service';
import { QuotaMiddleware } from './quota-middleware';
import { DownloadService } from './download-service';
import { MyPacksService } from './my-packs-service';
import { CheckoutService } from './checkout-service';
import { StatementsService } from './statements-service';
import { ConnectService } from './connect-service';
import { OptInService, type OptInSettings } from './opt-in-service';

export function createServer() {
  const fastify = Fastify({ logger: true });

  const clickhouse = new MarketplaceClickHouseClient();
  const packService = new PackService(clickhouse);
  const apiKeyService = new APIKeyService(clickhouse);
  const quotaMiddleware = new QuotaMiddleware(clickhouse);
  const downloadService = new DownloadService(clickhouse);
  const myPacksService = new MyPacksService(clickhouse);
  const checkoutService = new CheckoutService(process.env.STRIPE_SECRET_KEY || '');
  const statementsService = new StatementsService();
  const connectService = new ConnectService(process.env.STRIPE_SECRET_KEY || '');
  const optInService = new OptInService(clickhouse);

  // Org authentication middleware (for logged-in users)
  async function authenticateOrg(request: any, reply: any) {
    // In production, would validate JWT or session
    // For now, extract from header or use default
    const orgId = request.headers['x-org-id'] || 'acme'; // Default for dev
    request.orgId = orgId;
  }

  // API key authentication middleware
  async function authenticateAPIKey(request: any, reply: any) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401).send({ error: { code: 'unauthorized', message: 'Missing or invalid API key' } });
      return;
    }

    const key = authHeader.substring(7);
    const auth = await apiKeyService.authenticate(key);
    if (!auth) {
      reply.code(401).send({ error: { code: 'unauthorized', message: 'Invalid API key' } });
      return;
    }

    request.orgId = auth.orgId;
    request.apiKeyId = auth.apiKeyId;
  }

  // List packs (public)
  fastify.get('/v1/packs', async (request, reply) => {
    const filters: any = {};
    if (request.query) {
      const query = request.query as any;
      if (query.vertical) filters.vertical = query.vertical;
      if (query.category) filters.category = query.category;
      if (query.updateFrequency) filters.updateFrequency = query.updateFrequency;
    }

    const packs = await packService.listPacks(filters);
    return { packs };
  });

  // Get pack detail (public)
  fastify.get('/v1/packs/:packId', async (request, reply) => {
    const { packId } = request.params as { packId: string };
    const pack = await packService.getPackDetail(packId);
    if (!pack) {
      reply.code(404).send({
        error: {
          code: 'not_found',
          message: 'Pack not found',
        },
      });
      return;
    }
    return pack;
  });

  // Query pack data (requires auth)
  fastify.get('/v1/packs/:packId/data', {
    preHandler: authenticateAPIKey,
  }, async (request, reply) => {
    const { packId } = request.params as { packId: string };
    const query = request.query as any;

    // Estimate rows
    const estimatedRows = parseInt(query.limit || '100', 10);

    // Check quota
    const quotaCheck = await quotaMiddleware.checkQuota(
      request.orgId,
      packId,
      estimatedRows
    );

    if (!quotaCheck.allowed) {
      reply.code(429).send({
        error: {
          code: 'quota_exceeded',
          message: quotaCheck.reason || 'Quota exceeded',
        },
      });
      return;
    }

    // Query data
    const data = await packService.queryPackData(packId, {
      from: query.from,
      to: query.to,
      taskType: query.taskType,
      vertical: query.vertical,
      limit: estimatedRows,
      offset: parseInt(query.offset || '0', 10),
    });

    // Update usage
    await quotaMiddleware.updateUsage(request.orgId, packId, data.length);

    return { data, count: data.length };
  });

  // Download pack snapshot (requires auth)
  fastify.get('/v1/packs/:packId/download', {
    preHandler: authenticateAPIKey,
  }, async (request, reply) => {
    const { packId } = request.params as { packId: string };
    const query = request.query as any;
    const format = query.format || 'csv';

    let filepath: string;
    if (format === 'parquet') {
      filepath = await downloadService.generateParquet(packId, query.window);
    } else {
      filepath = await downloadService.generateCSV(packId, query.window);
    }

    return reply.sendFile(filepath);
  });

  // Create API key (requires org auth)
  fastify.post('/v1/marketplace/api-keys', {
    preHandler: authenticateOrg,
  }, async (request, reply) => {
    try {
      const body = request.body as { label: string };
      if (!body.label || body.label.trim().length === 0) {
        reply.code(400).send({
          error: {
            code: 'invalid_request',
            message: 'Label is required',
          },
        });
        return;
      }

      const { key, apiKeyId } = await apiKeyService.createKey(request.orgId, body.label);

      // Return key only once
      return {
        apiKeyId,
        key, // Only returned on creation
        label: body.label,
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to create API key',
        },
      });
    }
  });

  // List API keys
  fastify.get('/v1/marketplace/api-keys', {
    preHandler: authenticateOrg,
  }, async (request, reply) => {
    try {
      const keys = await apiKeyService.listKeys(request.orgId);
      return { keys };
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to list API keys',
        },
      });
    }
  });

  // Revoke API key
  fastify.delete('/v1/marketplace/api-keys/:apiKeyId', {
    preHandler: authenticateOrg,
  }, async (request, reply) => {
    try {
      const { apiKeyId } = request.params as { apiKeyId: string };
      await apiKeyService.revokeKey(apiKeyId, request.orgId);
      return { success: true };
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to revoke API key',
        },
      });
    }
  });

  // Get usage/quota
  fastify.get('/v1/marketplace/usage', {
    preHandler: authenticateAPIKey,
  }, async (request, reply) => {
    const query = request.query as any;
    const usage = await quotaMiddleware.getUsage(request.orgId, query.packId);
    return { usage };
  });

  // Get my packs (buyer dashboard)
  fastify.get('/v1/marketplace/my-packs', {
    preHandler: authenticateOrg,
  }, async (request, reply) => {
    try {
      const packs = await myPacksService.getMyPacks(request.orgId);
      return { packs };
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to load packs',
        },
      });
    }
  });

  // Create checkout session
  fastify.post('/v1/marketplace/packs/:packId/checkout-session', {
    preHandler: authenticateOrg,
  }, async (request, reply) => {
    try {
      const { packId } = request.params as { packId: string };
      const body = request.body as {
        billingTier: 'standard' | 'pro' | 'enterprise';
        successUrl: string;
        cancelUrl: string;
      };

      // Validate pack exists
      const pack = await packService.getPackDetail(packId);
      if (!pack) {
        reply.code(404).send({
          error: {
            code: 'pack_not_found',
            message: 'Pack not found',
          },
        });
        return;
      }

      const checkoutUrl = await checkoutService.createCheckoutSession({
        packId,
        billingTier: body.billingTier,
        successUrl: body.successUrl,
        cancelUrl: body.cancelUrl,
        orgId: request.orgId,
      });

      return { checkoutUrl };
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'checkout_error',
          message: error.message || 'Failed to create checkout session',
        },
      });
    }
  });

  // Get monthly statement
  fastify.get('/v1/marketplace/statements', {
    preHandler: authenticateOrg,
  }, async (request, reply) => {
    try {
      const query = request.query as { month: string };
      if (!query.month) {
        reply.code(400).send({
          error: {
            code: 'invalid_request',
            message: 'Month parameter is required (YYYY-MM-DD)',
          },
        });
        return;
      }

      // Validate month format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(query.month)) {
        reply.code(400).send({
          error: {
            code: 'invalid_request',
            message: 'Month must be in YYYY-MM-DD format',
          },
        });
        return;
      }

      const statement = await statementsService.getStatement(request.orgId, query.month);
      if (!statement) {
        reply.code(404).send({
          error: {
            code: 'not_found',
            message: 'Statement not found for that month',
          },
        });
        return;
      }

      return statement;
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to load statement',
        },
      });
    }
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  return fastify;
}
