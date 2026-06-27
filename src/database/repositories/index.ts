/**
 * Repositories Index
 *
 * Central export for all repositories.
 */

// Base classes
export { BaseRepository, type RepositoryResult } from './base.repository';

// RPC provider
export { RpcProvider, createRpcProvider, type RpcOptions, type RpcResponse } from './rpc.provider';

// Cache manager
export { 
  CacheManager, 
  MemoryCacheBackend, 
  createMemoryCacheManager, 
  type CacheOptions, 
  type CacheEntry, 
  type CacheStats,
  type ICacheBackend 
} from './cache.manager';

// Health monitor
export { HealthMonitor, createHealthMonitor, type HealthMonitorConfig, type HealthMetrics } from './health.monitor';

// Repository interfaces
export type {
  UserEntity,
  ProfileEntity,
  ArtifactEntity,
  UserArtifactEntity,
  MuseumExhibitEntity,
  UserMuseumProgressEntity,
  InventoryItemEntity,
  CurrencyBalanceEntity,
  CurrencyTransactionEntity,
  ProgressEntity,
  SeasonEntity,
  SeasonParticipationEntity,
  GuildEntity,
  GuildMemberEntity,
  EventEntity,
  EventParticipationEntity,
  NotificationEntity,
  NotificationPreferenceEntity,
  AnalyticsEventEntity,
  IUserRepository,
  IProfileRepository,
  IArtifactRepository,
  IUserArtifactRepository,
  IMuseumRepository,
  IInventoryRepository,
  ICurrencyRepository,
  IProgressRepository,
  ISeasonRepository,
  IGuildRepository,
  IEventRepository,
  INotificationRepository,
  IAnalyticsRepository,
} from './interfaces';

// Concrete repositories
export { UserRepository } from './user.repository';
export { NotificationRepository } from './notification.repository';