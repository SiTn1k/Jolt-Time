/**
 * Config Index
 *
 * Central export for configuration system.
 */

export { loadEnvironment, getEnv, getEnvNumber, getEnvBoolean, hasEnv } from './env.loader';
export type { AppConfig } from './env.loader';
export { ConfigProvider, initializeConfig, getConfig } from './runtime.config';
