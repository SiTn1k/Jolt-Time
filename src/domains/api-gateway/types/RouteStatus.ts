/**
 * Route Status Types
 *
 * Status values for API routes.
 */

/**
 * Route status values.
 */
export type RouteStatus = 'active' | 'disabled' | 'deprecated' | 'maintenance';

/**
 * All route statuses as a tuple.
 */
export const ROUTE_STATUSES: readonly RouteStatus[] = ['active', 'disabled', 'deprecated', 'maintenance'];

/**
 * Route status display names.
 */
export const ROUTE_STATUS_DISPLAY: Record<RouteStatus, string> = {
  active: 'Active',
  disabled: 'Disabled',
  deprecated: 'Deprecated',
  maintenance: 'Maintenance',
} as const;

/**
 * Route status colors for UI.
 */
export const ROUTE_STATUS_COLORS: Record<RouteStatus, string> = {
  active: '#00D9FF',
  disabled: '#FF4757',
  deprecated: '#FFA502',
  maintenance: '#5352ED',
} as const;

/**
 * Checks if a route status represents an available route.
 */
export function isAvailableRouteStatus(status: RouteStatus): boolean {
  return status === 'active';
}

/**
 * Checks if a route status represents an unavailable route.
 */
export function isUnavailableRouteStatus(status: RouteStatus): boolean {
  return status === 'disabled' || status === 'maintenance';
}

/**
 * Checks if a route status represents a deprecated route.
 */
export function isDeprecatedRouteStatus(status: RouteStatus): boolean {
  return status === 'deprecated';
}
