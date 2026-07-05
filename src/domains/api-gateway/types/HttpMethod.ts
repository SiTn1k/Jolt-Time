/**
 * HTTP Method Types
 *
 * Supported HTTP methods for API routes.
 */

/**
 * Supported HTTP methods.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

/**
 * All supported HTTP methods as a tuple.
 */
export const HTTP_METHODS: readonly HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

/**
 * HTTP method display names.
 */
export const HTTP_METHOD_DISPLAY: Record<HttpMethod, string> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

/**
 * HTTP method descriptions.
 */
export const HTTP_METHOD_DESCRIPTIONS: Record<HttpMethod, string> = {
  GET: 'Retrieve a resource',
  POST: 'Create a new resource',
  PUT: 'Replace a resource entirely',
  PATCH: 'Partially update a resource',
  DELETE: 'Remove a resource',
  OPTIONS: 'Describe available options for a resource',
} as const;

/**
 * Checks if a string is a valid HTTP method.
 */
export function isHttpMethod(value: string): value is HttpMethod {
  return HTTP_METHODS.includes(value as HttpMethod);
}

/**
 * Safe HTTP method parser.
 */
export function parseHttpMethod(value: string): HttpMethod | null {
  const upper = value.toUpperCase();
  return isHttpMethod(upper) ? upper : null;
}
