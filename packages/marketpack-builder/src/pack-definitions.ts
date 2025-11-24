/**
 * Pack Definition Loader
 * Loads pack definitions from YAML/JSON config files
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type { PackDefinition } from './types';

export class PackDefinitionLoader {
  private definitions: Map<string, PackDefinition> = new Map();

  /**
   * Load all pack definitions from a directory
   */
  loadFromDirectory(dirPath: string): void {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const def = yaml.load(content) as PackDefinition;

        // Validate required fields
        this.validateDefinition(def);

        this.definitions.set(def.packId, def);
      } else if (file.endsWith('.json')) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const def = JSON.parse(content) as PackDefinition;

        this.validateDefinition(def);
        this.definitions.set(def.packId, def);
      }
    }
  }

  /**
   * Get a pack definition by ID
   */
  getDefinition(packId: string): PackDefinition | undefined {
    return this.definitions.get(packId);
  }

  /**
   * Get all pack definitions
   */
  getAllDefinitions(): PackDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * Get pack definitions by kind
   */
  getByKind(kind: PackDefinition['kind']): PackDefinition[] {
    return Array.from(this.definitions.values()).filter(def => def.kind === kind);
  }

  /**
   * Get pack definitions by vertical
   */
  getByVertical(vertical: string): PackDefinition[] {
    return Array.from(this.definitions.values()).filter(
      def => def.vertical === vertical || def.vertical === 'ANY'
    );
  }

  /**
   * Validate pack definition
   */
  private validateDefinition(def: PackDefinition): void {
    const required = ['packId', 'kind', 'title', 'vertical', 'table', 'fields'];
    for (const field of required) {
      if (!(field in def)) {
        throw new Error(`Pack definition missing required field: ${field}`);
      }
    }

    if (!['ux_benchmarks', 'task_flows', 'release_deltas', 'insight_reports'].includes(def.kind)) {
      throw new Error(`Invalid pack kind: ${def.kind}`);
    }

    if (!['daily', 'weekly', 'monthly'].includes(def.updateFrequency)) {
      throw new Error(`Invalid update frequency: ${def.updateFrequency}`);
    }

    // Set defaults
    if (def.minOrgs === undefined) def.minOrgs = 20;
    if (def.minSessions === undefined) def.minSessions = 10000;
    if (def.retentionDays === undefined) def.retentionDays = 365;
    if (def.public === undefined) def.public = true;
  }
}
