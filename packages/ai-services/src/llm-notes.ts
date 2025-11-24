/**
 * LLM-powered Crab Notes Generator
 *
 * Generates plain-language insights from session clusters and metrics
 */

import type { SessionCluster, CrabNote, SessionMetrics } from './types';

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'mock';
  apiKey?: string;
  model?: string;
}

export class LLMNotesGenerator {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Generate Crab Note from cluster statistics
   */
  async generateNoteFromCluster(
    cluster: SessionCluster,
    topScreens: string[],
    errorCodes: string[]
  ): Promise<CrabNote> {
    if (this.config.provider === 'mock') {
      return this.generateMockNote(cluster, topScreens, errorCodes);
    }

    // For OpenAI/Anthropic, construct prompt and call API
    const prompt = this.buildClusterPrompt(cluster, topScreens, errorCodes);

    try {
      const note = await this.callLLM(prompt);
      return note;
    } catch (error) {
      console.error('[LLM Notes] Error calling LLM, falling back to mock:', error);
      return this.generateMockNote(cluster, topScreens, errorCodes);
    }
  }

  /**
   * Generate Crab Note from hotspot data
   */
  async generateNoteFromHotspot(
    screenId: string,
    route: string,
    friction: number,
    sessions: number,
    rageClickRate: number,
    errorCodes: string[]
  ): Promise<CrabNote> {
    if (this.config.provider === 'mock') {
      return this.generateMockHotspotNote(screenId, route, friction, sessions, rageClickRate, errorCodes);
    }

    const prompt = this.buildHotspotPrompt(screenId, route, friction, sessions, rageClickRate, errorCodes);

    try {
      const note = await this.callLLM(prompt);
      return note;
    } catch (error) {
      console.error('[LLM Notes] Error calling LLM, falling back to mock:', error);
      return this.generateMockHotspotNote(screenId, route, friction, sessions, rageClickRate, errorCodes);
    }
  }

  /**
   * Build prompt for cluster analysis
   */
  private buildClusterPrompt(
    cluster: SessionCluster,
    topScreens: string[],
    errorCodes: string[]
  ): string {
    return `Analyze this user session cluster and provide insights:

Cluster: ${cluster.label}
Description: ${cluster.description}
Session Count: ${cluster.sessionCount}
Average Frustration: ${cluster.avgFrustration.toFixed(2)}
Average Efficiency: ${cluster.avgEfficiency.toFixed(2)}
Average Duration: ${Math.round(cluster.avgDuration / 1000)}s
Average Clicks: ${Math.round(cluster.avgClicks)}
Top Screens: ${topScreens.join(', ')}
Error Codes: ${errorCodes.join(', ') || 'None'}

Provide:
1. A short title (max 60 chars)
2. A 2-3 sentence summary explaining what's happening
3. Category: friction, confusion, efficiency, adoption, or conversion
4. Severity: low, medium, or high
5. 2-3 specific recommendations

Format as JSON:
{
  "title": "...",
  "summary": "...",
  "category": "...",
  "severity": "...",
  "recommendations": ["...", "..."]
}`;
  }

  /**
   * Build prompt for hotspot analysis
   */
  private buildHotspotPrompt(
    screenId: string,
    route: string,
    friction: number,
    sessions: number,
    rageClickRate: number,
    errorCodes: string[]
  ): string {
    return `Analyze this UX friction hotspot and provide insights:

Screen: ${screenId}
Route: ${route}
Friction Score: ${friction.toFixed(2)} (0-1 scale)
Affected Sessions: ${sessions}
Rage Click Rate: ${(rageClickRate * 100).toFixed(1)}%
Error Codes: ${errorCodes.join(', ') || 'None'}

Provide:
1. A short title (max 60 chars)
2. A 2-3 sentence summary explaining the issue
3. Category: friction, confusion, efficiency, adoption, or conversion
4. Severity: low, medium, or high
5. 2-3 specific recommendations for improvement

Format as JSON:
{
  "title": "...",
  "summary": "...",
  "category": "...",
  "severity": "...",
  "recommendations": ["...", "..."]
}`;
  }

  /**
   * Call LLM API (OpenAI or Anthropic)
   */
  private async callLLM(prompt: string): Promise<CrabNote> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else if (this.config.provider === 'anthropic') {
      return this.callAnthropic(prompt);
    }
    throw new Error('Unsupported LLM provider');
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<CrabNote> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a UX analyst helping product teams understand user behavior. Provide clear, actionable insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      id: `note_${Date.now()}`,
      title: content.title,
      summary: content.summary,
      category: content.category,
      severity: content.severity,
      confidence: 0.8,
      createdAt: new Date().toISOString(),
      recommendations: content.recommendations,
    };
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(prompt: string): Promise<CrabNote> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.content[0].text);

    return {
      id: `note_${Date.now()}`,
      title: content.title,
      summary: content.summary,
      category: content.category,
      severity: content.severity,
      confidence: 0.8,
      createdAt: new Date().toISOString(),
      recommendations: content.recommendations,
    };
  }

  /**
   * Generate mock note (for development/testing)
   */
  private generateMockNote(
    cluster: SessionCluster,
    topScreens: string[],
    errorCodes: string[]
  ): CrabNote {
    let category: CrabNote['category'] = 'friction';
    let severity: CrabNote['severity'] = 'medium';
    let title = '';
    let summary = '';

    if (cluster.avgFrustration > 0.7) {
      category = 'friction';
      severity = 'high';
      title = `High friction detected in ${cluster.label}`;
      summary = `Users in this cluster (${cluster.sessionCount} sessions) are experiencing high frustration (${cluster.avgFrustration.toFixed(2)}). Average session duration is ${Math.round(cluster.avgDuration / 1000)}s with ${Math.round(cluster.avgClicks)} clicks.`;
    } else if (cluster.avgEfficiency > 0.7) {
      category = 'efficiency';
      severity = 'low';
      title = `Efficient user patterns in ${cluster.label}`;
      summary = `This cluster shows efficient user behavior with ${cluster.avgEfficiency.toFixed(2)} efficiency score. Users complete tasks quickly with minimal friction.`;
    } else {
      category = 'confusion';
      severity = 'medium';
      title = `Mixed patterns in ${cluster.label}`;
      summary = `This cluster shows varied user behavior with ${cluster.sessionCount} sessions. Consider investigating specific user segments.`;
    }

    return {
      id: `note_${Date.now()}`,
      title,
      summary,
      category,
      severity,
      confidence: 0.7,
      createdAt: new Date().toISOString(),
      recommendations: [
        'Review top screens for UX improvements',
        'Analyze error patterns',
        'Consider A/B testing alternative flows',
      ],
    };
  }

  /**
   * Generate mock hotspot note
   */
  private generateMockHotspotNote(
    screenId: string,
    route: string,
    friction: number,
    sessions: number,
    rageClickRate: number,
    errorCodes: string[]
  ): CrabNote {
    const category: CrabNote['category'] = friction > 0.7 ? 'friction' : 'confusion';
    const severity: CrabNote['severity'] = friction > 0.7 ? 'high' : friction > 0.5 ? 'medium' : 'low';

    let title = '';
    if (rageClickRate > 0.2) {
      title = `Rage-clicking detected on ${screenId}`;
    } else if (friction > 0.7) {
      title = `High friction on ${screenId}`;
    } else {
      title = `Friction detected on ${screenId}`;
    }

    const summary = `Users are experiencing ${(friction * 100).toFixed(0)}% friction on ${route}. ${sessions} sessions affected. ${rageClickRate > 0.2 ? `Rage-clicking rate is ${(rageClickRate * 100).toFixed(1)}%.` : ''} ${errorCodes.length > 0 ? `Error codes observed: ${errorCodes.join(', ')}.` : ''}`;

    return {
      id: `note_${Date.now()}`,
      title,
      summary,
      category,
      severity,
      confidence: 0.75,
      createdAt: new Date().toISOString(),
      relatedScreens: [screenId],
      recommendations: [
        'Review UI elements for clarity',
        'Check for loading states and error handling',
        'Consider simplifying the flow',
      ],
    };
  }
}

