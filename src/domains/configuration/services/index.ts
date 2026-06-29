/**
 * Configuration Domain Services
 *
 * Exports all services for the configuration domain.
 */

export { ConfigurationCache } from './ConfigurationCache';
export type { CacheEntry, CacheStatistics, ConfigurationCacheOptions } from './ConfigurationCache';

export { FeatureFlagEngine } from './FeatureFlagEngine';
export type {
  FeatureFlagUserContext,
  FeatureFlagEnvironmentContext,
  FeatureFlagEvaluationResult,
  FeatureFlagEvaluationOptions,
} from './FeatureFlagEngine';
export { FeatureFlagEvaluationReason } from './FeatureFlagEngine';

export { ConfigurationResolution } from './ConfigurationResolution';
export type {
  ConfigurationResolutionContext,
  ResolvedConfiguration,
  ConfigurationResolutionOptions,
} from './ConfigurationResolution';
export { ConfigurationResolutionSource, ConfigurationKeySegment } from './ConfigurationResolution';
export type { IConfigurationOverrideProvider } from './ConfigurationResolution';

export { ConfigurationService } from './ConfigurationService';
export type { ConfigurationServiceOptions, ConfigurationSummary } from './ConfigurationService';

export { ConfigurationValidationService } from './ConfigurationValidationService';
export type {
  ValidationErrorType,
  ValidationError,
  BatchValidationResult,
} from './ConfigurationValidationService';
