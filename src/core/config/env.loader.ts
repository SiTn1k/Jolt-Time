/**
 * Environment Loader
 *
 * Loads and validates environment variables.
 */

import { Environment, ErrorCategory, ErrorSeverity } from '../../shared/constants';
import { ApplicationError } from '../../shared/errors';

/**
 * Environment variable validation schema.
 */
interface EnvSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    default?: string | number | boolean;
    validate?: (value: unknown) => boolean;
  };
}

/**
 * Schema for required environment variables.
 */
const ENV_SCHEMA: EnvSchema = {
  NODE_ENV: {
    type: 'string',
    required: false,
    default: 'development',
    validate: (v) => ['development', 'staging', 'production', 'test'].includes(String(v)),
  },
  SUPABASE_URL: {
    type: 'string',
    required: true,
  },
  SUPABASE_ANON_KEY: {
    type: 'string',
    required: true,
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    type: 'string',
    required: true,
  },
  TELEGRAM_BOT_TOKEN: {
    type: 'string',
    required: true,
  },
  API_VERSION: {
    type: 'string',
    required: false,
    default: 'v1',
  },
  API_TIMEOUT_MS: {
    type: 'number',
    required: false,
    default: 30000,
  },
  LOG_LEVEL: {
    type: 'string',
    required: false,
    default: 'info',
    validate: (v) => ['debug', 'info', 'warn', 'error', 'fatal'].includes(String(v).toLowerCase()),
  },
};

/**
 * Environment variables type.
 */
export interface AppConfig {
  nodeEnv: Environment;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  telegramBotToken: string;
  apiVersion: string;
  apiTimeoutMs: number;
  logLevel: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Load environment variables with validation.
 */
export function loadEnvironment(): AppConfig {
  const errors: string[] = [];
  const config: Partial<AppConfig> = {};

  for (const [key, schema] of Object.entries(ENV_SCHEMA)) {
    const rawValue = process.env[key];
    const envKey = key.toLowerCase();

    // Check required
    if (schema.required && (rawValue === undefined || rawValue === '')) {
      errors.push(`Missing required environment variable: ${key}`);
      continue;
    }

    // Get value with default
    const value = rawValue !== undefined && rawValue !== '' ? rawValue : schema.default;

    if (value === undefined) {
      continue;
    }

    // Type conversion
    let parsedValue: string | number | boolean;
    switch (schema.type) {
      case 'number':
        parsedValue = typeof value === 'number' ? value : parseInt(String(value), 10);
        if (isNaN(parsedValue)) {
          errors.push(`Invalid number for ${key}: ${value}`);
          continue;
        }
        break;
      case 'boolean':
        parsedValue =
          typeof value === 'boolean'
            ? value
            : ['true', '1', 'yes'].includes(String(value).toLowerCase());
        break;
      default:
        parsedValue = String(value);
    }

    // Custom validation
    if (schema.validate && !schema.validate(parsedValue)) {
      errors.push(`Invalid value for ${key}: ${value}`);
      continue;
    }

    // Assign to config using camelCase
    (config as Record<string, unknown>)[envKey] = parsedValue;
  }

  // Add derived values
  const nodeEnv = (config.nodeEnv as Environment) || Environment.DEVELOPMENT;
  config.isDevelopment = nodeEnv === Environment.DEVELOPMENT;
  config.isProduction = nodeEnv === Environment.PRODUCTION;
  config.isTest = nodeEnv === Environment.TEST;

  // Throw if errors
  if (errors.length > 0) {
    throw new ApplicationError({
      message: `Environment validation failed:\n${errors.join('\n')}`,
      code: 'CONFIG_VALIDATION_FAILED',
      category: ErrorCategory.INTERNAL,
      severity: ErrorSeverity.CRITICAL,
      recoverable: false,
    });
  }

  return config as AppConfig;
}

/**
 * Get environment variable safely.
 */
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

/**
 * Get environment variable as number safely.
 */
export function getEnvNumber(key: string, fallback?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }
  return parsed;
}

/**
 * Get environment variable as boolean safely.
 */
export function getEnvBoolean(key: string, fallback?: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

/**
 * Check if environment variable exists.
 */
export function hasEnv(key: string): boolean {
  return process.env[key] !== undefined;
}
