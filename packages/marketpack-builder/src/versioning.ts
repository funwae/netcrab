/**
 * Pack Versioning System
 * Manages immutable pack versions with major/minor bumps
 */

import type { PackVersion } from './types';

export class PackVersionManager {
  /**
   * Parse version string (e.g., "ux_friction_b2b_crm_v1.3")
   */
  parseVersion(versionId: string): { packId: string; major: number; minor: number } | null {
    const match = versionId.match(/^(.+)_v(\d+)\.(\d+)$/);
    if (!match) return null;

    const [, packId, majorStr, minorStr] = match;
    return {
      packId,
      major: parseInt(majorStr, 10),
      minor: parseInt(minorStr, 10),
    };
  }

  /**
   * Generate next version ID
   */
  nextVersion(packId: string, currentMajor: number, currentMinor: number, bumpType: 'major' | 'minor'): string {
    if (bumpType === 'major') {
      return `${packId}_v${currentMajor + 1}.0`;
    } else {
      return `${packId}_v${currentMajor}.${currentMinor + 1}`;
    }
  }

  /**
   * Create a new pack version
   */
  createVersion(
    packId: string,
    currentVersion: PackVersion | null,
    bumpType: 'major' | 'minor',
    status: PackVersion['status'] = 'draft',
    notes: string = ''
  ): PackVersion {
    let major = 1;
    let minor = 0;

    if (currentVersion) {
      major = currentVersion.major;
      minor = currentVersion.minor;
    }

    const versionId = this.nextVersion(packId, major, minor, bumpType);
    const [newMajor, newMinor] = versionId.split('_v')[1].split('.').map(Number);

    return {
      packVersionId: versionId,
      packId,
      major: newMajor,
      minor: newMinor,
      status,
      createdAt: new Date(),
      notes,
    };
  }

  /**
   * Check if version is active
   */
  isActive(version: PackVersion): boolean {
    return version.status === 'active';
  }

  /**
   * Check if version is deprecated
   */
  isDeprecated(version: PackVersion): boolean {
    return version.status === 'deprecated';
  }
}

