/**
 * ClickHouse Client for Billing Service
 */

import { createClient, ClickHouseClient } from '@clickhouse/client';

export class BillingClickHouseClient {
  private client: ClickHouseClient;

  constructor(url: string = process.env.CLICKHOUSE_URL || 'http://localhost:8123') {
    this.client = createClient({
      url,
      username: process.env.CLICKHOUSE_USER || 'default',
      password: process.env.CLICKHOUSE_PASSWORD || '',
    });
  }

  async query<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T[]> {
    const result = await this.client.query({
      query,
      query_params: params || {},
      format: 'JSONEachRow',
    });

    const data: T[] = [];
    const stream = result.stream();

    for await (const row of stream) {
      data.push(JSON.parse(row as string) as T);
    }

    return data;
  }

  async insert(table: string, data: unknown[]): Promise<void> {
    await this.client.insert({
      table,
      values: data,
      format: 'JSONEachRow',
    });
  }

  async execute(query: string): Promise<void> {
    await this.client.exec({ query });
  }

  close(): Promise<void> {
    return this.client.close();
  }
}

