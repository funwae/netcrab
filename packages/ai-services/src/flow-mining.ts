/**
 * Flow Mining Service
 *
 * Discovers task-flow archetypes from session navigation patterns
 */

import type { FlowArchetype } from './types';

interface ScreenSequence {
  sessionId: string;
  screens: string[];
  duration: number;
  completed: boolean;
}

export class FlowMining {
  /**
   * Mine flow archetypes from screen sequences
   */
  async mineFlows(sequences: ScreenSequence[]): Promise<FlowArchetype[]> {
    // Group sequences by pattern
    const patternMap = new Map<string, ScreenSequence[]>();

    for (const seq of sequences) {
      const pattern = this.normalizePattern(seq.screens);
      if (!patternMap.has(pattern)) {
        patternMap.set(pattern, []);
      }
      patternMap.get(pattern)!.push(seq);
    }

    // Convert to archetypes
    const archetypes: FlowArchetype[] = [];

    for (const [pattern, matchingSeqs] of patternMap.entries()) {
      if (matchingSeqs.length < 10) continue; // Minimum frequency

      const screens = pattern.split('→');
      const avgFriction = matchingSeqs.reduce((sum, s) => sum + (s.completed ? 0.3 : 0.7), 0) / matchingSeqs.length;
      const avgEfficiency = matchingSeqs.reduce((sum, s) => sum + (s.completed ? 0.8 : 0.4), 0) / matchingSeqs.length;
      const avgDuration = matchingSeqs.reduce((sum, s) => sum + s.duration, 0) / matchingSeqs.length;
      const completionRate = matchingSeqs.filter(s => s.completed).length / matchingSeqs.length;

      // Find dropoff points
      const dropoffPoints = this.findDropoffPoints(screens, matchingSeqs);

      archetypes.push({
        id: `flow_${archetypes.length + 1}`,
        label: this.generateFlowLabel(screens),
        path: screens,
        frequency: matchingSeqs.length,
        avgFriction,
        avgEfficiency,
        avgDuration,
        completionRate,
        dropoffPoints,
      });
    }

    // Sort by frequency
    return archetypes.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Normalize screen pattern (remove duplicates, handle variations)
   */
  private normalizePattern(screens: string[]): string {
    // Remove consecutive duplicates
    const normalized: string[] = [];
    let last = '';
    for (const screen of screens) {
      if (screen !== last) {
        normalized.push(screen);
        last = screen;
      }
    }
    return normalized.join('→');
  }

  /**
   * Find dropoff points in a flow
   */
  private findDropoffPoints(
    screens: string[],
    sequences: ScreenSequence[]
  ): Array<{ screen: string; rate: number }> {
    const dropoffs: Array<{ screen: string; count: number }> = [];

    for (let i = 0; i < screens.length - 1; i++) {
      const screen = screens[i];
      const nextScreen = screens[i + 1];

      // Count sequences that drop off at this point
      const dropoffCount = sequences.filter(seq => {
        const screenIndex = seq.screens.indexOf(screen);
        return screenIndex >= 0 && (
          screenIndex === seq.screens.length - 1 || // Last screen
          !seq.screens.includes(nextScreen) // Next screen not reached
        );
      }).length;

      if (dropoffCount > 0) {
        dropoffs.push({
          screen,
          count: dropoffCount,
        });
      }
    }

    const total = sequences.length;
    return dropoffs.map(d => ({
      screen: d.screen,
      rate: d.count / total,
    }));
  }

  /**
   * Generate human-readable flow label
   */
  private generateFlowLabel(screens: string[]): string {
    if (screens.length === 0) return 'Empty Flow';

    // Try to infer task from screen names
    const first = screens[0].toLowerCase();
    const last = screens[screens.length - 1].toLowerCase();

    if (first.includes('home') && last.includes('detail')) {
      return 'Browse to Detail';
    }
    if (first.includes('list') && last.includes('form')) {
      return 'Create from List';
    }
    if (first.includes('form') && last.includes('success')) {
      return 'Form Submission';
    }
    if (screens.some(s => s.toLowerCase().includes('checkout'))) {
      return 'Checkout Flow';
    }

    return `${screens[0]} → ${screens[screens.length - 1]}`;
  }
}

