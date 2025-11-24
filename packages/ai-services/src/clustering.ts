/**
 * Session Clustering Service
 *
 * Groups sessions into behavioral clusters using KMeans or HDBSCAN
 */

import type { SessionMetrics, SessionCluster } from './types';

export class SessionClustering {
  /**
   * Extract features from session metrics for clustering
   */
  private extractFeatures(sessions: SessionMetrics[]): number[][] {
    return sessions.map(session => [
      session.frustrationScore,
      session.efficiencyScore,
      session.clickCount / 100, // Normalize
      session.durationMs / 100000, // Normalize to 100 seconds
      session.uniqueScreens / 10, // Normalize
      session.rageClicks,
      session.backtracks,
      session.errorEvents,
      session.tasksCompleted > 0 ? 1 : 0, // Binary: task completion
    ]);
  }

  /**
   * Simple KMeans clustering implementation
   * For production, use a library like ml-kmeans or scikit-learn
   */
  async clusterSessions(
    sessions: SessionMetrics[],
    k: number = 3
  ): Promise<Map<number, SessionMetrics[]>> {
    if (sessions.length === 0) {
      return new Map();
    }

    const features = this.extractFeatures(sessions);
    const clusters = this.kMeans(features, k);

    // Group sessions by cluster
    const clusterMap = new Map<number, SessionMetrics[]>();
    for (let i = 0; i < sessions.length; i++) {
      const clusterId = clusters[i];
      if (!clusterMap.has(clusterId)) {
        clusterMap.set(clusterId, []);
      }
      clusterMap.get(clusterId)!.push(sessions[i]);
    }

    return clusterMap;
  }

  /**
   * Simple KMeans algorithm
   */
  private kMeans(features: number[][], k: number, maxIterations: number = 100): number[] {
    const n = features.length;
    const dim = features[0].length;

    // Initialize centroids randomly
    const centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * n);
      centroids.push([...features[randomIndex]]);
    }

    const assignments = new Array(n).fill(0);

    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign points to nearest centroid
      let changed = false;
      for (let i = 0; i < n; i++) {
        let minDist = Infinity;
        let bestCluster = 0;
        for (let j = 0; j < k; j++) {
          const dist = this.euclideanDistance(features[i], centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = j;
          }
        }
        if (assignments[i] !== bestCluster) {
          changed = true;
        }
        assignments[i] = bestCluster;
      }

      if (!changed) break;

      // Update centroids
      for (let j = 0; j < k; j++) {
        const clusterPoints = features.filter((_, i) => assignments[i] === j);
        if (clusterPoints.length > 0) {
          centroids[j] = clusterPoints[0].map((_, d) => {
            return clusterPoints.reduce((sum, point) => sum + point[d], 0) / clusterPoints.length;
          });
        }
      }
    }

    return assignments;
  }

  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  /**
   * Generate cluster descriptions
   */
  generateClusterDescriptions(
    clusters: Map<number, SessionMetrics[]>
  ): SessionCluster[] {
    const descriptions: SessionCluster[] = [];

    for (const [clusterId, sessions] of clusters.entries()) {
      const avgFrustration = sessions.reduce((sum, s) => sum + s.frustrationScore, 0) / sessions.length;
      const avgEfficiency = sessions.reduce((sum, s) => sum + s.efficiencyScore, 0) / sessions.length;
      const avgDuration = sessions.reduce((sum, s) => sum + s.durationMs, 0) / sessions.length;
      const avgClicks = sessions.reduce((sum, s) => sum + s.clickCount, 0) / sessions.length;

      // Determine cluster label based on characteristics
      let label = 'Standard Session';
      if (avgFrustration > 0.7 && avgDuration < 60000) {
        label = 'High-friction Short Sessions';
      } else if (avgFrustration < 0.3 && avgEfficiency > 0.7) {
        label = 'Fast Success Sessions';
      } else if (avgDuration > 300000) {
        label = 'Long Wandering Sessions';
      } else if (avgClicks > 50) {
        label = 'High Activity Sessions';
      }

      descriptions.push({
        clusterId: `cluster_${clusterId}`,
        label,
        description: this.generateClusterDescription(avgFrustration, avgEfficiency, avgDuration, avgClicks),
        sessionCount: sessions.length,
        avgFrustration,
        avgEfficiency,
        avgDuration,
        avgClicks,
        topScreens: [], // Would be populated from screen data
        commonPatterns: [], // Would be populated from flow analysis
      });
    }

    return descriptions;
  }

  private generateClusterDescription(
    frustration: number,
    efficiency: number,
    duration: number,
    clicks: number
  ): string {
    const parts: string[] = [];

    if (frustration > 0.7) {
      parts.push('high frustration');
    } else if (frustration < 0.3) {
      parts.push('low frustration');
    }

    if (efficiency > 0.7) {
      parts.push('high efficiency');
    } else if (efficiency < 0.3) {
      parts.push('low efficiency');
    }

    if (duration < 60000) {
      parts.push('short duration');
    } else if (duration > 300000) {
      parts.push('long duration');
    }

    if (clicks > 50) {
      parts.push('high click activity');
    }

    return `Sessions with ${parts.join(', ')}.`;
  }
}

