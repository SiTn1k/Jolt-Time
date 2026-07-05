/**
 * API Version Types
 *
 * Supported API versioning for routes.
 */

/**
 * Supported API versions.
 */
export type ApiVersion = 'v1' | 'v2' | 'v3';

/**
 * All supported API versions as a tuple.
 */
export const API_VERSIONS: readonly ApiVersion[] = ['v1', 'v2', 'v3'];

/**
 * API version display names.
 */
export const API_VERSION_DISPLAY: Record<ApiVersion, string> = {
  v1: 'Version 1',
  v2: 'Version 2',
  v3: 'Version 3',
} as const;

/**
 * API version prefixes (for URL path construction).
 */
export const API_VERSION_PREFIX: Record<ApiVersion, string> = {
  v1: '/api/v1',
  v2: '/api/v2',
  v3: '/api/v3',
} as const;

/**
 * Checks if a string is a valid API version.
 */
export function isApiVersion(value: string): value is ApiVersion {
  return API_VERSIONS.includes(value as ApiVersion);
}

/**
 * Safe API version parser.
 */
export function parseApiVersion(value: string): ApiVersion | null {
  const lower = value.toLowerCase();
  return isApiVersion(lower) ? lower : null;
}
