/**
 * Repository Interfaces
 *
 * Interface definitions for all repositories.
 * These define the contract that implementations must follow.
 */

import type { RepositoryResult } from './base.repository';
import type { QueryOptions } from '../types';
import type { PaginationDto, CursorPaginationDto } from '../dto';

/**
 * User entity.
 */
export interface UserEntity {
  id: string;
  telegramId: number | null;
  username: string | null;
  chatId: number | null;
  notificationsEnabled: boolean;
  lastNotificationAt: Date | null;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Profile entity.
 */
export interface ProfileEntity {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  timezone: string;
  language: string;
  preferences: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Artifact entity.
 */
export interface ArtifactEntity {
  id: string;
  name: string;
  description: string | null;
  era: string;
  rarity: string;
  imageUrl: string | null;
  power: number;
  effects: Record<string, unknown>;
  obtainedFrom: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User artifact entity.
 */
export interface UserArtifactEntity {
  id: string;
  userId: string;
  artifactId: string;
  quantity: number;
  equipped: boolean;
  obtainedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Museum exhibit entity.
 */
export interface MuseumExhibitEntity {
  id: string;
  name: string;
  description: string | null;
  era: string;
  requiredArtifacts: string[];
  rewards: Record<string, unknown>;
  imageUrl: string | null;
  difficulty: string;
  isUnlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User museum progress entity.
 */
export interface UserMuseumProgressEntity {
  id: string;
  userId: string;
  exhibitId: string;
  status: string;
  progress: number;
  completedAt: Date | null;
  startedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Inventory item entity.
 */
export interface InventoryItemEntity {
  id: string;
  userId: string;
  itemType: string;
  itemId: string;
  quantity: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Currency balance entity.
 */
export interface CurrencyBalanceEntity {
  id: string;
  userId: string;
  currencyType: string;
  balance: number;
  updatedAt: Date;
}

/**
 * Currency transaction entity.
 */
export interface CurrencyTransactionEntity {
  id: string;
  userId: string;
  currencyType: string;
  amount: number;
  type: string;
  balanceAfter: number;
  reference: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Progress entity.
 */
export interface ProgressEntity {
  id: string;
  userId: string;
  currentLevel: number;
  totalXp: number;
  achievements: string[];
  stats: Record<string, unknown>;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Season entity.
 */
export interface SeasonEntity {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  rewards: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Season participation entity.
 */
export interface SeasonParticipationEntity {
  id: string;
  userId: string;
  seasonId: string;
  rank: number;
  score: number;
  joinedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Guild entity.
 */
export interface GuildEntity {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  emblemUrl: string | null;
  memberCount: number;
  maxMembers: number;
  totalScore: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Guild member entity.
 */
export interface GuildMemberEntity {
  id: string;
  guildId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  contributedScore: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event entity.
 */
export interface EventEntity {
  id: string;
  name: string;
  description: string | null;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
  rewards: Record<string, unknown>;
  requirements: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event participation entity.
 */
export interface EventParticipationEntity {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  score: number;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification entity.
 */
export interface NotificationEntity {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  status: string;
  scheduledAt: Date | null;
  sentAt: Date | null;
  deduplicationKey: string | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: Date;
}

/**
 * Notification preference entity.
 */
export interface NotificationPreferenceEntity {
  id: string;
  userId: string;
  dailyReminders: boolean;
  events: boolean;
  researchComplete: boolean;
  energyRestored: boolean;
  buildingComplete: boolean;
  marketing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics event entity.
 */
export interface AnalyticsEventEntity {
  id: string;
  userId: string | null;
  eventType: string;
  properties: Record<string, unknown>;
  sessionId: string | null;
  timestamp: Date;
}

/**
 * =============================================================================
 * REPOSITORY INTERFACES
 * =============================================================================
 */

/**
 * User repository interface.
 */
export interface IUserRepository {
  findById(id: string): Promise<RepositoryResult<UserEntity | null>>;
  findByTelegramId(telegramId: number): Promise<RepositoryResult<UserEntity | null>>;
  findAll(options?: QueryOptions): Promise<RepositoryResult<{ items: UserEntity[]; total: number }>>;
  create(data: Partial<UserEntity>): Promise<RepositoryResult<UserEntity>>;
  update(id: string, data: Partial<UserEntity>): Promise<RepositoryResult<UserEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  exists(id: string): Promise<boolean>;
  count(): Promise<RepositoryResult<number>>;
}

/**
 * Profile repository interface.
 */
export interface IProfileRepository {
  findById(id: string): Promise<RepositoryResult<ProfileEntity | null>>;
  findByUserId(userId: string): Promise<RepositoryResult<ProfileEntity | null>>;
  findAll(options?: QueryOptions): Promise<RepositoryResult<{ items: ProfileEntity[]; total: number }>>;
  create(data: Partial<ProfileEntity>): Promise<RepositoryResult<ProfileEntity>>;
  update(id: string, data: Partial<ProfileEntity>): Promise<RepositoryResult<ProfileEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
}

/**
 * Artifact repository interface.
 */
export interface IArtifactRepository {
  findById(id: string): Promise<RepositoryResult<ArtifactEntity | null>>;
  findByEra(era: string, options?: QueryOptions): Promise<RepositoryResult<{ items: ArtifactEntity[]; total: number }>>;
  findByRarity(rarity: string, options?: QueryOptions): Promise<RepositoryResult<{ items: ArtifactEntity[]; total: number }>>;
  findAll(options?: QueryOptions): Promise<RepositoryResult<{ items: ArtifactEntity[]; total: number }>>;
  create(data: Partial<ArtifactEntity>): Promise<RepositoryResult<ArtifactEntity>>;
  update(id: string, data: Partial<ArtifactEntity>): Promise<RepositoryResult<ArtifactEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
}

/**
 * User artifact repository interface.
 */
export interface IUserArtifactRepository {
  findById(id: string): Promise<RepositoryResult<UserArtifactEntity | null>>;
  findByUserId(userId: string, options?: QueryOptions): Promise<RepositoryResult<{ items: UserArtifactEntity[]; total: number }>>;
  findByUserAndArtifact(userId: string, artifactId: string): Promise<RepositoryResult<UserArtifactEntity | null>>;
  findEquipped(userId: string): Promise<RepositoryResult<UserArtifactEntity[]>>;
  create(data: Partial<UserArtifactEntity>): Promise<RepositoryResult<UserArtifactEntity>>;
  update(id: string, data: Partial<UserArtifactEntity>): Promise<RepositoryResult<UserArtifactEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  incrementQuantity(id: string, amount: number): Promise<RepositoryResult<UserArtifactEntity>>;
}

/**
 * Museum repository interface.
 */
export interface IMuseumRepository {
  findExhibitById(id: string): Promise<RepositoryResult<MuseumExhibitEntity | null>>;
  findAllExhibits(options?: QueryOptions): Promise<RepositoryResult<{ items: MuseumExhibitEntity[]; total: number }>>;
  findUnlockedExhibits(era?: string): Promise<RepositoryResult<MuseumExhibitEntity[]>>;
  getUserProgress(userId: string): Promise<RepositoryResult<UserMuseumProgressEntity[]>>;
  getUserExhibitProgress(userId: string, exhibitId: string): Promise<RepositoryResult<UserMuseumProgressEntity | null>>;
  updateUserProgress(userId: string, exhibitId: string, data: Partial<UserMuseumProgressEntity>): Promise<RepositoryResult<UserMuseumProgressEntity>>;
}

/**
 * Inventory repository interface.
 */
export interface IInventoryRepository {
  findById(id: string): Promise<RepositoryResult<InventoryItemEntity | null>>;
  findByUserId(userId: string, options?: QueryOptions): Promise<RepositoryResult<{ items: InventoryItemEntity[]; total: number }>>;
  findByUserAndItem(userId: string, itemType: string, itemId: string): Promise<RepositoryResult<InventoryItemEntity | null>>;
  create(data: Partial<InventoryItemEntity>): Promise<RepositoryResult<InventoryItemEntity>>;
  update(id: string, data: Partial<InventoryItemEntity>): Promise<RepositoryResult<InventoryItemEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  addItem(userId: string, itemType: string, itemId: string, quantity: number): Promise<RepositoryResult<InventoryItemEntity>>;
  removeItem(userId: string, itemType: string, itemId: string, quantity: number): Promise<RepositoryResult<boolean>>;
}

/**
 * Currency repository interface.
 */
export interface ICurrencyRepository {
  getBalance(userId: string, currencyType: string): Promise<RepositoryResult<number>>;
  getAllBalances(userId: string): Promise<RepositoryResult<CurrencyBalanceEntity[]>>;
  setBalance(userId: string, currencyType: string, amount: number): Promise<RepositoryResult<CurrencyBalanceEntity>>;
  addAmount(userId: string, currencyType: string, amount: number, reference?: string): Promise<RepositoryResult<CurrencyBalanceEntity>>;
  subtractAmount(userId: string, currencyType: string, amount: number, reference?: string): Promise<RepositoryResult<CurrencyBalanceEntity>>;
  getTransactions(userId: string, currencyType?: string, options?: QueryOptions): Promise<RepositoryResult<{ items: CurrencyTransactionEntity[]; total: number }>>;
}

/**
 * Progress repository interface.
 */
export interface IProgressRepository {
  findById(id: string): Promise<RepositoryResult<ProgressEntity | null>>;
  findByUserId(userId: string): Promise<RepositoryResult<ProgressEntity | null>>;
  create(data: Partial<ProgressEntity>): Promise<RepositoryResult<ProgressEntity>>;
  update(id: string, data: Partial<ProgressEntity>): Promise<RepositoryResult<ProgressEntity>>;
  addXp(userId: string, amount: number): Promise<RepositoryResult<ProgressEntity>>;
  addAchievement(userId: string, achievement: string): Promise<RepositoryResult<ProgressEntity>>;
}

/**
 * Season repository interface.
 */
export interface ISeasonRepository {
  findById(id: string): Promise<RepositoryResult<SeasonEntity | null>>;
  findActive(): Promise<RepositoryResult<SeasonEntity | null>>;
  findAll(options?: QueryOptions): Promise<RepositoryResult<{ items: SeasonEntity[]; total: number }>>;
  findUpcoming(options?: QueryOptions): Promise<RepositoryResult<{ items: SeasonEntity[]; total: number }>>;
  create(data: Partial<SeasonEntity>): Promise<RepositoryResult<SeasonEntity>>;
  update(id: string, data: Partial<SeasonEntity>): Promise<RepositoryResult<SeasonEntity>>;
  getParticipation(userId: string, seasonId: string): Promise<RepositoryResult<SeasonParticipationEntity | null>>;
  getLeaderboard(seasonId: string, limit?: number): Promise<RepositoryResult<SeasonParticipationEntity[]>>;
  joinSeason(userId: string, seasonId: string): Promise<RepositoryResult<SeasonParticipationEntity>>;
  updateScore(userId: string, seasonId: string, score: number): Promise<RepositoryResult<SeasonParticipationEntity>>;
}

/**
 * Guild repository interface.
 */
export interface IGuildRepository {
  findById(id: string): Promise<RepositoryResult<GuildEntity | null>>;
  findByName(name: string): Promise<RepositoryResult<GuildEntity | null>>;
  findAll(options?: QueryOptions): Promise<RepositoryResult<{ items: GuildEntity[]; total: number }>>;
  create(data: Partial<GuildEntity>): Promise<RepositoryResult<GuildEntity>>;
  update(id: string, data: Partial<GuildEntity>): Promise<RepositoryResult<GuildEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  getMembers(guildId: string, options?: QueryOptions): Promise<RepositoryResult<{ items: GuildMemberEntity[]; total: number }>>;
  addMember(guildId: string, userId: string, role: string): Promise<RepositoryResult<GuildMemberEntity>>;
  removeMember(guildId: string, userId: string): Promise<RepositoryResult<boolean>>;
  updateMemberRole(guildId: string, userId: string, role: string): Promise<RepositoryResult<GuildMemberEntity>>;
  isMember(guildId: string, userId: string): Promise<boolean>;
}

/**
 * Event repository interface.
 */
export interface IEventRepository {
  findById(id: string): Promise<RepositoryResult<EventEntity | null>>;
  findActive(options?: QueryOptions): Promise<RepositoryResult<{ items: EventEntity[]; total: number }>>;
  findAll(options?: QueryOptions): Promise<RepositoryResult<{ items: EventEntity[]; total: number }>>;
  create(data: Partial<EventEntity>): Promise<RepositoryResult<EventEntity>>;
  update(id: string, data: Partial<EventEntity>): Promise<RepositoryResult<EventEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  getParticipation(userId: string, eventId: string): Promise<RepositoryResult<EventParticipationEntity | null>>;
  getLeaderboard(eventId: string, limit?: number): Promise<RepositoryResult<EventParticipationEntity[]>>;
  joinEvent(userId: string, eventId: string): Promise<RepositoryResult<EventParticipationEntity>>;
  updateScore(userId: string, eventId: string, score: number): Promise<RepositoryResult<EventParticipationEntity>>;
}

/**
 * Notification repository interface.
 */
export interface INotificationRepository {
  findById(id: string): Promise<RepositoryResult<NotificationEntity | null>>;
  findByUserId(userId: string, options?: QueryOptions): Promise<RepositoryResult<{ items: NotificationEntity[]; total: number }>>;
  findPending(options?: QueryOptions): Promise<RepositoryResult<NotificationEntity[]>>;
  create(data: Partial<NotificationEntity>): Promise<RepositoryResult<NotificationEntity>>;
  update(id: string, data: Partial<NotificationEntity>): Promise<RepositoryResult<NotificationEntity>>;
  markAsSent(id: string): Promise<RepositoryResult<NotificationEntity>>;
  markAsFailed(id: string, errorMessage: string): Promise<RepositoryResult<NotificationEntity>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  deleteOld(olderThan: Date): Promise<RepositoryResult<number>>;
  getPreferences(userId: string): Promise<RepositoryResult<NotificationPreferenceEntity | null>>;
  updatePreferences(userId: string, data: Partial<NotificationPreferenceEntity>): Promise<RepositoryResult<NotificationPreferenceEntity>>;
}

/**
 * Analytics repository interface.
 */
export interface IAnalyticsRepository {
  trackEvent(eventType: string, userId: string | null, properties?: Record<string, unknown>): Promise<RepositoryResult<void>>;
  trackUserEvent(userId: string, eventType: string, properties?: Record<string, unknown>): Promise<RepositoryResult<void>>;
  getEvents(userId: string, eventType?: string, options?: QueryOptions): Promise<RepositoryResult<{ items: AnalyticsEventEntity[]; total: number }>>;
  getEventsByType(eventType: string, options?: QueryOptions): Promise<RepositoryResult<{ items: AnalyticsEventEntity[]; total: number }>>;
  getUserSessionEvents(userId: string, sessionId: string): Promise<RepositoryResult<AnalyticsEventEntity[]>>;
}