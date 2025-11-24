/**
 * ClickHouse Client Wrapper
 */

import { createClient } from '@clickhouse/client';

export class ClickHouseClient {
  private client: ReturnType<typeof createClient>;

  constructor(url: string) {
    this.client = createClient({
      url,
    });
  }

  /**
   * Execute a query and return results
   */
  async query<T = any>(query: string, params?: Record<string, any>): Promise<T[]> {
    // Replace parameter placeholders with actual values
    let finalQuery = query;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        const placeholder = `{${key}: String}`;
        const valueStr = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : String(value);
        finalQuery = finalQuery.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), valueStr);
      }
    }

    const result = await this.client.query({
      query: finalQuery,
      format: 'JSONEachRow',
    });

    const data = await result.json<T>();
    return Array.isArray(data) ? data : [];
  }

  /**
   * Execute a query and return a single row
   */
  async queryOne<T = any>(query: string, params?: Record<string, any>): Promise<T | null> {
    const results = await this.query<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Close the client
   */
  async close(): Promise<void> {
    await this.client.close();
  }
}

