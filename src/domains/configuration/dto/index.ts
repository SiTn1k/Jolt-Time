/**
 * Configuration Domain DTOs
 *
 * Exports all DTOs for the configuration domain.
 */

export type {
  CreateConfigurationEntryDto,
  UpdateConfigurationEntryDto,
  ConfigurationEntryResponseDto,
  ConfigurationEntrySummaryDto,
} from './ConfigurationEntry.dto';
export { CREATE_CONFIGURATION_ENTRY_VALIDATION } from './ConfigurationEntry.dto';

export type {
  CreateConfigurationGroupDto,
  UpdateConfigurationGroupDto,
  ConfigurationGroupResponseDto,
  ConfigurationGroupSummaryDto,
} from './ConfigurationGroup.dto';
export { CREATE_CONFIGURATION_GROUP_VALIDATION } from './ConfigurationGroup.dto';

export type {
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  FeatureFlagResponseDto,
  FeatureFlagSummaryDto,
} from './FeatureFlag.dto';
export { CREATE_FEATURE_FLAG_VALIDATION } from './FeatureFlag.dto';

export type {
  ConfigurationEntriesResponseDto,
  ConfigurationGroupsResponseDto,
  FeatureFlagsResponseDto,
  ConfigurationStatisticsResponseDto,
  ConfigurationBulkResponseDto,
} from './ConfigurationResponse.dto';
