/**
 * Internal API for Billing Service
 * Exposes endpoints for other services (like marketplace-api) to query statements
 */

import Fastify from 'fastify';
import { StatementGenerator } from './statement-generator';

export function createInternalAPI() {
  const fastify = Fastify({ logger: true });

  const generator = new StatementGenerator();

  // Internal auth middleware (in production, would use service-to-service auth)
  async function authenticateInternal(request: any, reply: any) {
    const authHeader = request.headers.authorization;
    const expectedToken = process.env.INTERNAL_API_TOKEN || 'internal-token';

    if (authHeader !== `Bearer ${expectedToken}`) {
      reply.code(401).send({ error: 'unauthorized' });
      return;
    }
  }

  // Get statement for org
  fastify.get('/internal/statements', {
    preHandler: authenticateInternal,
  }, async (request, reply) => {
    try {
      const query = request.query as { orgId: string; month: string };

      if (!query.orgId || !query.month) {
        reply.code(400).send({
          error: {
            code: 'invalid_request',
            message: 'orgId and month are required',
          },
        });
        return;
      }

      const monthDate = new Date(query.month);
      const statement = await generator.generateStatement(query.orgId, monthDate);

      return statement;
    } catch (error: any) {
      reply.code(500).send({
        error: {
          code: 'internal_error',
          message: error.message || 'Failed to generate statement',
        },
      });
    }
  });

  return fastify;
}

