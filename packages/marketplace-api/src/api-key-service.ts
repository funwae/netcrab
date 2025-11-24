/**
 * API Key Service
 * Manages buyer API keys
 */

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MarketplaceClickHouseClient } from './clickhouse-client';
import type { APIKey } from './types';

export class APIKeyService {
  constructor(private clickhouse: MarketplaceClickHouseClient) {}

  /**
   * Generate a new API key
   */
  generateKey(): string {
    const random = crypto.randomBytes(32).toString('hex');
    return `nc_live_${random}`;
  }

  /**
   * Hash an API key
   */
  async hashKey(key: string): Promise<string> {
    return bcrypt.hash(key, 10);
  }

  /**
   * Verify an API key
   */
  async verifyKey(key: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(key, hashed);
  }

  /**
   * Create a new API key for an org
   */
  async createKey(orgId: string, label: string): Promise<{ key: string; apiKeyId: string }> {
    const key = this.generateKey();
    const hashed = await this.hashKey(key);
    const apiKeyId = crypto.randomUUID();

    await this.clickhouse.query(`
      INSERT INTO buyer_api_keys (
        api_key_id,
        org_id,
        label,
        hashed_key,
        created_at,
        revoked
      ) VALUES (
        '${apiKeyId}',
        '${orgId}',
        '${label}',
        '${hashed}',
        now(),
        0
      )
    `);

    return { key, apiKeyId };
  }

  /**
   * List API keys for an org
   */
  async listKeys(orgId: string): Promise<APIKey[]> {
    const rows = await this.clickhouse.query<{
      api_key_id: string;
      label: string;
      created_at: string;
      last_used_at?: string;
      revoked: number;
    }>(`
      SELECT
        api_key_id,
        label,
        created_at,
        last_used_at,
        revoked
      FROM buyer_api_keys
      WHERE org_id = '${orgId}' AND revoked = 0
      ORDER BY created_at DESC
    `);

    return rows.map(row => ({
      apiKeyId: row.api_key_id,
      label: row.label,
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
      revoked: row.revoked === 1,
    }));
  }

  /**
   * Revoke an API key
   */
  async revokeKey(apiKeyId: string, orgId: string): Promise<void> {
    await this.clickhouse.query(`
      ALTER TABLE buyer_api_keys
      UPDATE revoked = 1
      WHERE api_key_id = '${apiKeyId}' AND org_id = '${orgId}'
    `);
  }

  /**
   * Authenticate using API key
   */
  async authenticate(key: string): Promise<{ orgId: string; apiKeyId: string } | null> {
    // Get all non-revoked keys
    const keys = await this.clickhouse.query<{
      api_key_id: string;
      org_id: string;
      hashed_key: string;
    }>(`
      SELECT api_key_id, org_id, hashed_key
      FROM buyer_api_keys
      WHERE revoked = 0
    `);

    // Try to match the key
    for (const row of keys) {
      const matches = await this.verifyKey(key, row.hashed_key);
      if (matches) {
        // Update last_used_at
        await this.clickhouse.query(`
          ALTER TABLE buyer_api_keys
          UPDATE last_used_at = now()
          WHERE api_key_id = '${row.api_key_id}'
        `);

        return {
          orgId: row.org_id,
          apiKeyId: row.api_key_id,
        };
      }
    }

    return null;
  }
}
