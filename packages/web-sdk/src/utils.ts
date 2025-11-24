/**
 * Utility functions for NetCrab Web SDK
 */

import type { DeviceType } from './types';

/**
 * Hash a string using SHA-256 (browser native)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a random session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate a random event ID
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Hash user identifier (non-reversible)
 */
export async function hashUserId(userId: string | undefined): Promise<string> {
  if (!userId) {
    return 'anonymous';
  }
  return hashString(userId);
}

/**
 * Detect device type from user agent
 */
export function detectDeviceType(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Get browser name from user agent
 */
export function getBrowser(): string | undefined {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  return undefined;
}

/**
 * Get OS from user agent
 */
export function getOS(): string | undefined {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X') || ua.includes('macOS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || /iPhone|iPad|iPod/.test(ua)) return 'iOS';
  return undefined;
}

/**
 * Check if element should be ignored
 */
export function shouldIgnoreElement(element: HTMLElement): boolean {
  // Check for data-netcrab-ignore attribute
  if (element.hasAttribute('data-netcrab-ignore')) {
    return true;
  }

  // Check if it's a password field
  if (element instanceof HTMLInputElement && element.type === 'password') {
    return true;
  }

  // Check if it's a textarea (we don't capture content)
  if (element.tagName === 'TEXTAREA') {
    return true;
  }

  // Check parent elements
  let parent = element.parentElement;
  while (parent) {
    if (parent.hasAttribute('data-netcrab-ignore')) {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}

/**
 * Get element label (for hashing)
 */
export function getElementLabel(element: HTMLElement): string | undefined {
  // Try aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Try text content for buttons
  if (element.tagName === 'BUTTON' || element.tagName === 'A') {
    const text = element.textContent?.trim();
    if (text && text.length > 0 && text.length < 100) {
      return text;
    }
  }

  // Try title attribute
  const title = element.getAttribute('title');
  if (title) return title;

  return undefined;
}

