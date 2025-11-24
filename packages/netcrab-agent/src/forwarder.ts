/**
 * Forward events to cloud ingestion API
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import type { EventBatch } from './types';

export class EventForwarder {
  private cloudUrl: string;
  private apiKey: string;

  constructor(config: { cloudUrl: string; apiKey: string }) {
    this.cloudUrl = config.cloudUrl;
    this.apiKey = config.apiKey;
  }

  /**
   * Forward a batch of events to cloud
   */
  async forward(batch: EventBatch): Promise<void> {
    const url = new URL(`${this.cloudUrl}/v1/events`);
    const data = JSON.stringify(batch);

    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(data),
        },
      };

      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(url, options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`Failed to forward events: ${res.statusCode} ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const url = new URL(`${this.cloudUrl}/health`);
      const client = url.protocol === 'https:' ? https : http;

      return new Promise((resolve) => {
        const req = client.request(url, { method: 'GET' }, (res) => {
          resolve(res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false);
        });

        req.on('error', () => {
          resolve(false);
        });

        req.setTimeout(5000, () => {
          req.destroy();
          resolve(false);
        });

        req.end();
      });
    } catch {
      return false;
    }
  }
}

