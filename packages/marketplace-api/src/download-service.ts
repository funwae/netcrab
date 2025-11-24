/**
 * Download Service
 * Generates CSV/Parquet files for pack data
 */

import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { MarketplaceClickHouseClient } from './clickhouse-client';

export class DownloadService {
  constructor(
    private clickhouse: MarketplaceClickHouseClient,
    private downloadDir: string = './downloads'
  ) {
    // Ensure download directory exists
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  /**
   * Generate CSV file for pack data
   */
  async generateCSV(
    packId: string,
    window?: string
  ): Promise<string> {
    // Query pack data
    let query = `SELECT * FROM mp_ux_friction_daily WHERE pack_id = '${packId}'`;
    if (window) {
      // Parse window (e.g., "2025-11" or "2025Q1")
      if (window.includes('Q')) {
        // Quarter handling would go here
      } else {
        const [year, month] = window.split('-');
        query += ` AND toYear(date) = ${year} AND toMonth(date) = ${month}`;
      }
    }

    const data = await this.clickhouse.query<Record<string, unknown>>(query);

    if (data.length === 0) {
      throw new Error('No data found for pack');
    }

    // Generate CSV
    const filename = `${packId}_${window || 'all'}_${Date.now()}.csv`;
    const filepath = path.join(this.downloadDir, filename);

    const headers = Object.keys(data[0]);
    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: headers.map(h => ({ id: h, title: h })),
    });

    await csvWriter.writeRecords(data);

    return filepath;
  }

  /**
   * Generate Parquet file (simplified - would use parquetjs in production)
   */
  async generateParquet(
    packId: string,
    window?: string
  ): Promise<string> {
    // For now, just return CSV path
    // In production, would use parquetjs or similar
    return this.generateCSV(packId, window);
  }

  /**
   * Clean up old download files
   */
  async cleanup(maxAgeHours: number = 24): Promise<void> {
    const files = fs.readdirSync(this.downloadDir);
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    for (const file of files) {
      const filepath = path.join(this.downloadDir, file);
      const stats = fs.statSync(filepath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath);
      }
    }
  }
}
