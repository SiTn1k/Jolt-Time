/**
 * IntegrationType
 *
 * Defines the types of external service integrations supported by Jolt Time.
 */

/**
 * Supported integration types.
 *
 * Integration MUST NEVER:
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute business logic
 *
 * Integration is a gateway for external services - it only stores
 * providers, requests, and responses as a foundation layer.
 */
export type IntegrationType =
  | 'telegram'
  | 'webhook'
  | 'rest_api'
  | 'payment'
  | 'email'
  | 'storage'
  | 'ai'
  | 'other';

/**
 * Display names for integration types.
 */
export const INTEGRATION_TYPE_DISPLAY: Record<IntegrationType, string> = {
  telegram: 'Telegram',
  webhook: 'Webhook',
  rest_api: 'REST API',
  payment: 'Payment',
  email: 'Email',
  storage: 'Storage',
  ai: 'AI Service',
  other: 'Other',
};

/**
 * Validates if a value is a valid IntegrationType.
 */
export function isValidIntegrationType(value: string): value is IntegrationType {
  return [
    'telegram',
    'webhook',
    'rest_api',
    'payment',
    'email',
    'storage',
    'ai',
    'other',
  ].includes(value);
}
