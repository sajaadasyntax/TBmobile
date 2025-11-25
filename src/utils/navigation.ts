import Constants from 'expo-constants';
import { config } from '../../config';

// Get web URL from config (prioritize expo config, then local config file)
const WEB_URL = Constants.expoConfig?.extra?.webUrl || config.webUrl;

/**
 * Get the full URL for a dashboard route
 */
export function getDashboardUrl(path: string = '/dashboard/contractor'): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${WEB_URL}${cleanPath}`;
}

/**
 * Common dashboard routes
 */
export const ROUTES = {
  DASHBOARD: '/dashboard/contractor',
  JOBS: '/jobs',
  CURRENT_JOBS: '/dashboard/contractor/current-jobs',
  JOB_HISTORY: '/dashboard/contractor/job-history',
  MESSAGES: '/dashboard/contractor/messages',
  REVIEWS: '/dashboard/contractor/reviews',
  PAYMENTS: '/dashboard/contractor/payments',
  COMMISSIONS: '/dashboard/contractor/commissions',
  INVOICES: '/dashboard/contractor/invoices',
  KYC: '/dashboard/kyc',
  DISPUTES: '/dashboard/contractor/disputes',
  PROFILE: '/dashboard/contractor/profile',
} as const;

/**
 * Check if URL is a TrustBuild internal URL
 */
export function isInternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const webUrlObj = new URL(WEB_URL);
    return urlObj.hostname === webUrlObj.hostname;
  } catch (error) {
    return false;
  }
}

/**
 * Check if URL should be handled by the WebView
 */
export function shouldHandleInWebView(url: string): boolean {
  // Handle all TrustBuild URLs in WebView
  if (isInternalUrl(url)) {
    return true;
  }

  // External links should open in browser
  return false;
}

/**
 * Extract route from full URL
 */
export function getRouteFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (error) {
    return '/';
  }
}

