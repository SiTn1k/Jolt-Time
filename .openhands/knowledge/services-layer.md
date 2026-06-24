# Jolt Time — Services Layer Architecture

> **Single Source of Truth for Service Organization**
>
> This document defines the complete Services Layer architecture for Jolt Time. The Services Layer acts as the business logic layer between UI components, React hooks, Zustand stores, and external systems (Supabase, AdsGram, Telegram).

---

## Table of Contents

1. [Overview](#1-overview)
2. [Service Categories](#2-service-categories)
3. [Service Philosophy](#3-service-philosophy)
4. [Folder Structure](#4-folder-structure)
5. [Player Services](#5-player-services)
6. [Economy Services](#6-economy-services)
7. [Museum Services](#7-museum-services)
8. [Event Services](#8-event-services)
9. [PvP Services](#9-pvp-services)
10. [Social Services](#10-social-services)
11. [Telegram Services](#11-telegram-services)
12. [Analytics Services](#12-analytics-services)
13. [Service Communication Rules](#13-service-communication-rules)
14. [Error Handling Philosophy](#14-error-handling-philosophy)
15. [Transaction Philosophy](#15-transaction-philosophy)
16. [Testing Philosophy](#16-testing-philosophy)
17. [Future Expansion Notes](#17-future-expansion-notes)
18. [Long-Term Philosophy](#18-long-term-philosophy)

---

## 1. Overview

### Services Layer Position

The Services Layer is the **business logic core** of the Jolt Time application:

```
┌─────────────────────────────────────────────────────────────────┐
│                        UI COMPONENTS                             │
│         (React components, screens, features)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         HOOKS LAYER                              │
│    (usePlayer, useEnergy, useMuseum, useTelegramUser, etc.)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICES LAYER                               │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  PLAYER  │ ECONOMY │  MUSEUM  │  EVENTS  │   PVP   │     │
│     │ SERVICES │ SERVICES│ SERVICES │ SERVICES │ SERVICES│     │
│     └─────────────────────────────────────────────────────┘     │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  SOCIAL  │ TELEGRAM │ ANALYTICS │   UTILS  │        │     │
│     │ SERVICES │ SERVICES │ SERVICES  │ SERVICES │        │     │
│     └─────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│     STORES      │ │  REPOSITORIES   │ │ EXTERNAL APIs  │
│   (Zustand)     │ │  (Supabase)     │ │ (AdsGram, TG)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **UI Components** | Render UI, handle user input | `HomePage`, `MuseumScreen` |
| **Hooks** | Bridge components to services | `usePlayer`, `useEnergy` |
| **Services** | Business logic, operations | `PlayerService`, `EnergyService` |
| **Stores** | Client-side state management | `playerStore`, `economyStore` |
| **Repositories** | Data access abstraction | `playerRepository`, `artifactRepository` |
| **External APIs** | Third-party integrations | `Supabase`, `AdsGram`, `Telegram` |

### Services vs Other Layers

| Layer | Should Call | Should NOT Call |
|-------|------------|-----------------|
| **Services** | Repositories, External APIs | UI Components |
| **Hooks** | Services, Stores | Repositories directly |
| **Components** | Hooks | Repositories, Services directly |
| **Stores** | Nothing (subscribes to stores) | UI Components |

---

## 2. Service Categories

### Category Overview

| Category | Services | Purpose |
|----------|----------|---------|
| **Player Services** | Profile, Progression, Settings, Statistics | Player identity and progression |
| **Economy Services** | Currency, Reward, Inventory, Marketplace | In-game economy management |
| **Museum Services** | Artifact, Collection, Exhibition, Expansion | Museum and artifact system |
| **Event Services** | Event, Mission, Reward Distribution, Seasonal | Event and mission management |
| **PvP Services** | Battle, Tournament, Ranking, Matchmaking | Competitive gameplay |
| **Social Services** | Friends, Guild, Referral, Leaderboard | Social features |
| **Telegram Services** | User, Notification, Deep Link, Sharing | Telegram platform integration |
| **Analytics Services** | Analytics, Retention, Monetization, AdsGram | Tracking and metrics |
| **Utility Services** | Utility, Common | Cross-cutting functionality |

### Service Category Diagram

```
SERVICE CATEGORIES:
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICES LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  GAME SERVICES                           │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐        │   │
│  │  │  Player    │ │  Economy   │ │  Museum    │        │   │
│  │  │  Services  │ │  Services  │ │  Services  │        │   │
│  │  └────────────┘ └────────────┘ └────────────┘        │   │
│  │  ┌────────────┐ ┌────────────┐                     │   │
│  │  │  Events    │ │    PvP     │                     │   │
│  │  │  Services  │ │  Services  │                     │   │
│  │  └────────────┘ └────────────┘                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  PLATFORM SERVICES                         │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐          │   │
│  │  │  Social    │ │ Telegram   │ │ Analytics  │          │   │
│  │  │  Services  │ │  Services  │ │  Services  │          │   │
│  │  └────────────┘ └────────────┘ └────────────┘          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  UTILITY SERVICES                         │   │
│  │  ┌────────────┐ ┌────────────┐                           │   │
│  │  │  Common    │ │   Utils    │                           │   │
│  │  │  Service   │ │  Service   │                           │   │
│  │  └────────────┘ └────────────┘                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Service Philosophy

### Core Principles

#### 1. Single Responsibility
Each service owns exactly one domain:
- `PlayerService` → Player data and operations
- `CurrencyService` → Currency operations
- `NotificationService` → Notification scheduling

#### 2. Dependency Injection
Services receive dependencies via constructor injection:
```typescript
class ExampleService {
  constructor(
    private readonly repository: ExampleRepository,
    private readonly analytics: AnalyticsService
  ) {}
}
```

#### 3. Predictable Returns
All service methods return consistent result types:
```typescript
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}
```

#### 4. No UI Dependencies
Services have no imports from React or UI code:
- No React imports
- No component imports
- No hook imports
- Pure TypeScript only

### Service Design Rules

| Rule | Description |
|------|-------------|
| **Business Logic** | All game rules implemented in services |
| **No Direct DB Access** | Components never call Supabase directly |
| **No Direct SDK Access** | Components never call AdsGram/Telegram directly |
| **Centralized Logic** | Same operation always goes through same service |
| **Testable** | Services are independently testable |
| **Documented** | All public methods have JSDoc comments |

### Service vs Repository Pattern

| Aspect | Service | Repository |
|--------|---------|------------|
| **Purpose** | Business logic | Data access |
| **Location** | `services/` | `repositories/` |
| **Dependencies** | Other services, repositories | Supabase client |
| **Returns** | Domain objects, results | Raw data |
| **Validation** | Business rules | Data validation |

---

## 4. Folder Structure

### Services Directory Organization

```
src/services/
├── player/                      # Player domain services
│   ├── ProfileService.ts
│   ├── ProgressionService.ts
│   ├── SettingsService.ts
│   ├── StatisticsService.ts
│   ├── PlayerRepository.ts
│   └── index.ts
├── economy/                     # Economy domain services
│   ├── CurrencyService.ts
│   ├── RewardService.ts
│   ├── InventoryService.ts
│   ├── MarketplaceService.ts
│   ├── EconomyRepository.ts
│   └── index.ts
├── museum/                      # Museum domain services
│   ├── ArtifactService.ts
│   ├── CollectionService.ts
│   ├── ExhibitionService.ts
│   ├── MuseumExpansionService.ts
│   ├── MuseumRepository.ts
│   └── index.ts
├── events/                      # Events domain services
│   ├── EventService.ts
│   ├── MissionService.ts
│   ├── RewardDistributionService.ts
│   ├── SeasonalEventService.ts
│   ├── EventRepository.ts
│   └── index.ts
├── pvp/                         # PvP domain services
│   ├── BattleService.ts
│   ├── TournamentService.ts
│   ├── RankingService.ts
│   ├── MatchmakingService.ts
│   ├── PvPRepository.ts
│   └── index.ts
├── social/                      # Social domain services
│   ├── FriendsService.ts
│   ├── GuildService.ts
│   ├── ReferralService.ts
│   ├── LeaderboardService.ts
│   ├── SocialRepository.ts
│   └── index.ts
├── telegram/                    # Telegram platform services
│   ├── TelegramUserService.ts
│   ├── TelegramNotificationService.ts
│   ├── TelegramDeepLinkService.ts
│   ├── TelegramSharingService.ts
│   ├── TelegramHapticService.ts
│   ├── localization/
│   │   ├── LocalizationService.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── [locale].json
│   └── index.ts
├── analytics/                   # Analytics services
│   ├── AnalyticsService.ts
│   ├── RetentionService.ts
│   ├── MonetizationService.ts
│   ├── AdsGramAnalyticsService.ts
│   ├── EventTrackingService.ts
│   └── index.ts
├── common/                      # Common/shared services
│   ├── BaseService.ts
│   ├── Result.ts
│   ├── ErrorHandler.ts
│   ├── Validator.ts
│   └── index.ts
└── index.ts                     # Main services export
```

### Service File Structure Pattern

```typescript
/**
 * {ServiceName}Service
 * 
 * Core service for managing {domain}.
 * 
 * Features:
 * - {feature 1}
 * - {feature 2}
 * - {feature 3}
 * 
 * Architecture:
 * - This service encapsulates all {domain} business logic
 * - Direct database access is prohibited - use Repository
 * - External API calls go through this service
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseService, ServiceResult } from '../common';

/**
 * Configuration for {ServiceName}Service
 */
export interface {ServiceName}Config {
  supabaseClient: SupabaseClient;
}

/**
 * {Entity} data structure
 */
export interface {Entity} {
  id: string;
  // ... other fields
}

/**
 * {ServiceName}Service class
 */
export class {ServiceName}Service extends BaseService {
  constructor(private readonly config: {ServiceName}Config) {
    super();
  }

  /**
   * Get {entity} by ID
   * 
   * @param id - {entity} identifier
   * @returns {entity} data or error
   */
  async getById(id: string): Promise<ServiceResult<{Entity}>> {
    try {
      // Validation
      if (!id) {
        return this.failure('INVALID_ID', 'ID is required');
      }

      // Fetch via repository
      const data = await this.config.repository.findById(id);
      
      if (!data) {
        return this.failure('NOT_FOUND', '{Entity} not found');
      }

      return this.success(data);
    } catch (error) {
      return this.error(error);
    }
  }

  /**
   * Create new {entity}
   * 
   * @param data - {entity} creation data
   * @returns Created {entity} or error
   */
  async create(data: Create{Entity}Data): Promise<ServiceResult<{Entity}>> {
    try {
      // Business validation
      const validationResult = this.validateCreate(data);
      if (!validationResult.success) {
        return validationResult;
      }

      // Create via repository
      const created = await this.config.repository.create(data);
      
      return this.success(created);
    } catch (error) {
      return this.error(error);
    }
  }

  /**
   * Update {entity}
   */
  async update(id: string, data: Update{Entity}Data): Promise<ServiceResult<{Entity}>> {
    // Implementation
  }

  /**
   * Delete {entity}
   */
  async delete(id: string): Promise<ServiceResult<void>> {
    // Implementation
  }
}

// Singleton pattern for services
let instance: {ServiceName}Service | null = null;

export const get{SeviceName}Service = (config: {ServiceName}Config): {ServiceName}Service => {
  if (!instance) {
    instance = new {ServiceName}Service(config);
  }
  return instance;
};
```

---

## 5. Player Services

Player services manage player identity, progression, and account operations.

### Player Services Architecture

```
PLAYER SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                     PLAYER SERVICE DOMAIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  ProfileService │  │ProgressionService│  │SettingsService │  │
│  │                 │  │                  │  │                 │  │
│  │ • Get profile   │  │ • XP management │  │ • Game settings │  │
│  │ • Update info  │  │ • Level ups     │  │ • Display prefs │  │
│  │ • Avatar       │  │ • Ranks         │  │ • Account mgmt  │  │
│  │ • Username     │  │ • Milestones    │  │                 │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │   PlayerRepository     │                    │
│                    │   (Supabase access)    │                    │
│                    └────────────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ProfileService

**Purpose:** Manage player profile data and identity.

```typescript
// services/player/ProfileService.ts
export interface ProfileService {
  // Profile operations
  getProfile(userId: string): Promise<ServiceResult<PlayerProfile>>;
  updateProfile(userId: string, data: UpdateProfileData): Promise<ServiceResult<PlayerProfile>>;
  updateAvatar(userId: string, avatarUrl: string): Promise<ServiceResult<PlayerProfile>>;
  updateUsername(userId: string, username: string): Promise<ServiceResult<PlayerProfile>>;
  
  // Account operations
  createProfile(telegramUser: TelegramUser): Promise<ServiceResult<PlayerProfile>>;
  deleteAccount(userId: string): Promise<ServiceResult<void>>;
  linkTelegram(userId: string, telegramId: string): Promise<ServiceResult<void>>;
}
```

### ProgressionService

**Purpose:** Manage player progression, XP, and levels.

```typescript
// services/player/ProgressionService.ts
export interface ProgressionService {
  // XP operations
  addXP(userId: string, amount: number): Promise<ServiceResult<ProgressionResult>>;
  getXP(userId: string): Promise<ServiceResult<number>>;
  
  // Level operations
  getLevel(userId: string): Promise<ServiceResult<PlayerLevel>>;
  checkLevelUp(userId: string): Promise<ServiceResult<LevelUpResult>>;
  
  // Rank operations
  getRank(userId: string): Promise<ServiceResult<PlayerRank>>;
  promoteRank(userId: string): Promise<ServiceResult<PlayerRank>>;
  
  // Milestone operations
  getMilestones(userId: string): Promise<ServiceResult<Milestone[]>>;
  claimMilestone(userId: string, milestoneId: string): Promise<ServiceResult<MilestoneReward>>;
}
```

### SettingsService

**Purpose:** Manage player settings and preferences.

```typescript
// services/player/SettingsService.ts
export interface SettingsService {
  // Game settings
  getSettings(userId: string): Promise<ServiceResult<PlayerSettings>>;
  updateSettings(userId: string, settings: Partial<PlayerSettings>): Promise<ServiceResult<PlayerSettings>>;
  
  // Display settings
  updateDisplaySettings(userId: string, settings: DisplaySettings): Promise<ServiceResult<PlayerSettings>>;
  updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<ServiceResult<PlayerSettings>>;
  
  // Account settings
  updateLanguage(userId: string, languageCode: string): Promise<ServiceResult<PlayerSettings>>;
  updatePrivacy(userId: string, privacy: PrivacySettings): Promise<ServiceResult<PlayerSettings>>;
}
```

### StatisticsService

**Purpose:** Track and manage player statistics.

```typescript
// services/player/StatisticsService.ts
export interface StatisticsService {
  // Stats retrieval
  getStatistics(userId: string): Promise<ServiceResult<PlayerStatistics>>;
  getStatistic(userId: string, statKey: string): Promise<ServiceResult<number>>;
  
  // Stats update
  incrementStat(userId: string, statKey: string, amount: number): Promise<ServiceResult<number>>;
  setStat(userId: string, statKey: string, value: number): Promise<ServiceResult<void>>;
  
  // Stats aggregation
  getDailyStats(userId: string, date: Date): Promise<ServiceResult<DailyStatistics>>;
  getWeeklyStats(userId: string, weekStart: Date): Promise<ServiceResult<WeeklyStatistics>>;
  getLifetimeStats(userId: string): Promise<ServiceResult<LifetimeStatistics>>;
}
```

---

## 6. Economy Services

Economy services manage currencies, rewards, inventory, and marketplace operations.

### Economy Services Architecture

```
ECONOMY SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                    ECONOMY SERVICE DOMAIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │CurrencyService  │  │  RewardService  │  │InventoryService │  │
│  │                 │  │                 │  │                 │  │
│  │ • Add currency │  │ • Daily rewards │  │ • Add item      │  │
│  │ • Deduct       │  │ • Quest rewards │  │ • Remove item   │  │
│  │ • Transfer     │  │ • Event rewards │  │ • Use item      │  │
│  │ • Exchange     │  │ • Achievement   │  │ • Equip/unequip │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │   EconomyRepository    │                    │
│                    │   (Supabase access)    │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│           ┌────────────────────────────────────────┐            │
│           │        MarketplaceService              │            │
│           │                                         │            │
│           │ • Create listing  • Purchase item      │            │
│           │ • Cancel listing  • Search listings    │            │
│           └────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### CurrencyService

**Purpose:** Manage all currency operations.

```typescript
// services/economy/CurrencyService.ts
export interface CurrencyService {
  // Balance operations
  getBalance(userId: string, currencyType: CurrencyType): Promise<ServiceResult<number>>;
  getAllBalances(userId: string): Promise<ServiceResult<CurrencyBalances>>;
  
  // Modify operations
  addCurrency(userId: string, currencyType: CurrencyType, amount: number, reason: TransactionReason): Promise<ServiceResult<CurrencyResult>>;
  deductCurrency(userId: string, currencyType: CurrencyType, amount: number, reason: TransactionReason): Promise<ServiceResult<CurrencyResult>>;
  transferCurrency(fromUserId: string, toUserId: string, currencyType: CurrencyType, amount: number): Promise<ServiceResult<CurrencyResult>>;
  
  // Validation
  canAfford(userId: string, currencyType: CurrencyType, amount: number): Promise<ServiceResult<boolean>>;
  
  // History
  getTransactionHistory(userId: string, options: TransactionHistoryOptions): Promise<ServiceResult<Transaction[]>>;
}
```

### RewardService

**Purpose:** Handle all reward distribution.

```typescript
// services/economy/RewardService.ts
export interface RewardService {
  // Reward operations
  claimReward(userId: string, rewardId: string): Promise<ServiceResult<RewardResult>>;
  claimAllRewards(userId: string): Promise<ServiceResult<RewardResult[]>>;
  
  // Reward generation
  generateReward(userId: string, rewardType: RewardType, multiplier?: number): Promise<ServiceResult<Reward>>;
  
  // Event rewards
  distributeEventReward(userId: string, eventId: string, missionId: string): Promise<ServiceResult<EventRewardResult>>;
  
  // Reward validation
  canClaimReward(userId: string, rewardId: string): Promise<ServiceResult<boolean>>;
  getAvailableRewards(userId: string): Promise<ServiceResult<Reward[]>>;
}
```

### InventoryService

**Purpose:** Manage player inventory and items.

```typescript
// services/economy/InventoryService.ts
export interface InventoryService {
  // Inventory operations
  getInventory(userId: string): Promise<ServiceResult<Inventory>>;
  getItemsByCategory(userId: string, category: ItemCategory): Promise<ServiceResult<InventoryItem[]>>;
  
  // Item operations
  addItem(userId: string, item: Item, quantity?: number): Promise<ServiceResult<InventoryItem>>;
  removeItem(userId: string, itemId: string, quantity?: number): Promise<ServiceResult<void>>;
  useItem(userId: string, itemId: string): Promise<ServiceResult<ItemUseResult>>;
  
  // Equipment operations
  equipItem(userId: string, itemId: string, slot: EquipmentSlot): Promise<ServiceResult<EquipmentResult>>;
  unequipItem(userId: string, slot: EquipmentSlot): Promise<ServiceResult<EquipmentResult>>;
  getEquipment(userId: string): Promise<ServiceResult<Equipment>>;
  
  // Inventory management
  hasItem(userId: string, itemId: string, quantity?: number): Promise<ServiceResult<boolean>>;
  getInventoryCapacity(userId: string): Promise<ServiceResult<InventoryCapacity>>;
  expandInventory(userId: string, slots: number): Promise<ServiceResult<InventoryCapacity>>;
}
```

### MarketplaceService

**Purpose:** Handle marketplace listings and trading.

```typescript
// services/economy/MarketplaceService.ts
export interface MarketplaceService {
  // Listing operations
  createListing(userId: string, itemId: string, price: number, currency: CurrencyType): Promise<ServiceResult<Listing>>;
  cancelListing(userId: string, listingId: string): Promise<ServiceResult<void>>;
  expireListing(listingId: string): Promise<ServiceResult<void>>;
  
  // Purchase operations
  purchaseItem(userId: string, listingId: string): Promise<ServiceResult<PurchaseResult>>;
  validatePurchase(userId: string, listingId: string): Promise<ServiceResult<boolean>>;
  
  // Search and browse
  searchListings(options: SearchOptions): Promise<ServiceResult<ListingSearchResult>>;
  getListingsByCategory(category: ItemCategory, pagination: PaginationOptions): Promise<ServiceResult<Listing[]>>;
  getMyListings(userId: string): Promise<ServiceResult<Listing[]>>;
  
  // Price management
  getSuggestedPrice(itemId: string): Promise<ServiceResult<number>>;
  getPriceHistory(itemId: string): Promise<ServiceResult<PricePoint[]>>;
}
```

---

## 7. Museum Services

Museum services manage artifacts, collections, exhibitions, and museum expansion.

### Museum Services Architecture

```
MUSEUM SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                    MUSEUM SERVICE DOMAIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ArtifactService  │  │CollectionService│  │ExhibitionService│  │
│  │                 │  │                 │  │                 │  │
│  │ • Get artifact  │  │ • Get collection│  │ • Get exhibition│  │
│  │ • Add artifact  │  │ • Add artifact  │  │ • Add to exhibit│  │
│  │ • Evolve        │  │ • Complete set  │  │ • Remove        │  │
│  │ • Fuse          │  │ • Get progress  │  │ • Rearrange     │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │   MuseumRepository     │                    │
│                    │   (Supabase access)   │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│           ┌────────────────────────────────────────┐            │
│           │     MuseumExpansionService             │            │
│           │                                         │            │
│           │ • Get museum  • Expand museum          │            │
│           │ • Get slots   • Place decoration       │            │
│           └────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ArtifactService

**Purpose:** Manage player artifacts.

```typescript
// services/museum/ArtifactService.ts
export interface ArtifactService {
  // Artifact retrieval
  getArtifact(userId: string, artifactId: string): Promise<ServiceResult<PlayerArtifact>>;
  getAllArtifacts(userId: string): Promise<ServiceResult<PlayerArtifact[]>>;
  getArtifactsByEra(userId: string, eraId: string): Promise<ServiceResult<PlayerArtifact[]>>;
  
  // Artifact acquisition
  acquireArtifact(userId: string, artifactId: string): Promise<ServiceResult<AcquireResult>>;
  
  // Artifact operations
  evolveArtifact(userId: string, artifactId: string, evolutionId: string): Promise<ServiceResult<EvolveResult>>;
  fuseArtifacts(userId: string, sourceIds: string[], targetId: string): Promise<ServiceResult<FuseResult>>;
  
  // Artifact info
  getArtifactInfo(artifactId: string): Promise<ServiceResult<ArtifactInfo>>;
  getArtifactStats(userId: string): Promise<ServiceResult<ArtifactStats>>;
}
```

### CollectionService

**Purpose:** Manage artifact collections.

```typescript
// services/museum/CollectionService.ts
export interface CollectionService {
  // Collection retrieval
  getCollections(userId: string): Promise<ServiceResult<Collection[]>>;
  getCollection(userId: string, collectionId: string): Promise<ServiceResult<Collection>>;
  getCollectionsByEra(eraId: string): Promise<ServiceResult<Collection[]>>;
  
  // Collection progress
  getCollectionProgress(userId: string, collectionId: string): Promise<ServiceResult<CollectionProgress>>;
  getMissingArtifacts(userId: string, collectionId: string): Promise<ServiceResult<Artifact[]>>;
  
  // Collection completion
  addArtifactToCollection(userId: string, collectionId: string, artifactId: string): Promise<ServiceResult<void>>;
  completeCollection(userId: string, collectionId: string): Promise<ServiceResult<CollectionReward>>;
  
  // Collection management
  lockCollection(userId: string, collectionId: string): Promise<ServiceResult<void>>;
  unlockCollection(userId: string, collectionId: string): Promise<ServiceResult<void>>;
}
```

### ExhibitionService

**Purpose:** Manage museum exhibitions.

```typescript
// services/museum/ExhibitionService.ts
export interface ExhibitionService {
  // Exhibition retrieval
  getExhibitions(userId: string): Promise<ServiceResult<Exhibition[]>>;
  getExhibition(userId: string, exhibitionId: string): Promise<ServiceResult<Exhibition>>;
  
  // Exhibition management
  createExhibition(userId: string, name: string, description: string): Promise<ServiceResult<Exhibition>>;
  updateExhibition(userId: string, exhibitionId: string, data: UpdateExhibitionData): Promise<ServiceResult<Exhibition>>;
  deleteExhibition(userId: string, exhibitionId: string): Promise<ServiceResult<void>>;
  
  // Artifact placement
  addArtifactToExhibition(userId: string, exhibitionId: string, artifactId: string, position: Position): Promise<ServiceResult<void>>;
  removeArtifactFromExhibition(userId: string, exhibitionId: string, artifactId: string): Promise<ServiceResult<void>>;
  rearrangeExhibition(userId: string, exhibitionId: string, arrangement: ArtifactArrangement): Promise<ServiceResult<void>>;
}
```

### MuseumExpansionService

**Purpose:** Handle museum expansion and decoration.

```typescript
// services/museum/MuseumExpansionService.ts
export interface MuseumExpansionService {
  // Museum retrieval
  getMuseum(userId: string): Promise<ServiceResult<Museum>>;
  getMuseumSlots(userId: string): Promise<ServiceResult<MuseumSlot[]>>;
  
  // Expansion
  expandMuseum(userId: string, slots: number): Promise<ServiceResult<ExpansionResult>>;
  getExpansionCost(currentSlots: number, additionalSlots: number): Promise<ServiceResult<ExpansionCost>>;
  
  // Decoration
  placeDecoration(userId: string, slotId: string, decorationId: string): Promise<ServiceResult<void>>;
  removeDecoration(userId: string, slotId: string): Promise<ServiceResult<void>>;
  rearrangeDecorations(userId: string, arrangement: SlotArrangement): Promise<ServiceResult<void>>;
  
  // Decoration info
  getAvailableDecorations(userId: string): Promise<ServiceResult<Decoration[]>>;
  getDecorationInfo(decorationId: string): Promise<ServiceResult<DecorationInfo>>;
}
```

---

## 8. Event Services

Event services manage game events, missions, reward distribution, and seasonal content.

### Event Services Architecture

```
EVENT SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                     EVENT SERVICE DOMAIN                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   EventService  │  │ MissionService  │  │RewardDistService│  │
│  │                 │  │                 │  │                 │  │
│  │ • Get events    │  │ • Get missions │  │ • Calculate     │  │
│  │ • Join event    │  │ • Progress     │  │ • Distribute    │  │
│  │ • Get progress  │  │ • Complete     │  │ • Validate      │  │
│  │ • Leave event   │  │ • Reset daily  │  │ • Record        │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │    EventRepository     │                    │
│                    │   (Supabase access)    │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│           ┌────────────────────────────────────────┐            │
│           │      SeasonalEventService             │            │
│           │                                         │            │
│           │ • Get season   • Claim season rewards │            │
│           │ • Get tier     • Progress season       │            │
│           └────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### EventService

**Purpose:** Manage game events.

```typescript
// services/events/EventService.ts
export interface EventService {
  // Event retrieval
  getActiveEvents(): Promise<ServiceResult<Event[]>>;
  getEvent(eventId: string): Promise<ServiceResult<Event>>;
  getUpcomingEvents(): Promise<ServiceResult<Event[]>>;
  getPastEvents(): Promise<ServiceResult<Event[]>>;
  
  // Event participation
  joinEvent(userId: string, eventId: string): Promise<ServiceResult<EventParticipant>>;
  leaveEvent(userId: string, eventId: string): Promise<ServiceResult<void>>;
  
  // Event progress
  getEventProgress(userId: string, eventId: string): Promise<ServiceResult<EventProgress>>;
  updateEventProgress(userId: string, eventId: string, progress: number): Promise<ServiceResult<void>>;
  
  // Event rewards
  claimEventReward(userId: string, eventId: string, rewardId: string): Promise<ServiceResult<EventReward>>;
  getEventLeaderboard(eventId: string, pagination: PaginationOptions): Promise<ServiceResult<Leaderboard>>;
}
```

### MissionService

**Purpose:** Manage missions and objectives.

```typescript
// services/events/MissionService.ts
export interface MissionService {
  // Mission retrieval
  getMissions(userId: string): Promise<ServiceResult<Mission[]>>;
  getMissionsByCategory(userId: string, category: MissionCategory): Promise<ServiceResult<Mission[]>>;
  getMission(userId: string, missionId: string): Promise<ServiceResult<Mission>>;
  
  // Mission progress
  updateMissionProgress(userId: string, missionId: string, progress: number): Promise<ServiceResult<MissionProgress>>;
  incrementMissionProgress(userId: string, missionId: string, amount: number): Promise<ServiceResult<MissionProgress>>;
  
  // Mission completion
  completeMission(userId: string, missionId: string): Promise<ServiceResult<MissionResult>>;
  claimMissionReward(userId: string, missionId: string): Promise<ServiceResult<MissionReward>>;
  
  // Mission management
  resetDailyMissions(userId: string): Promise<ServiceResult<void>>;
  refreshMissions(userId: string): Promise<ServiceResult<Mission[]>>;
  
  // Mission validation
  canClaimMission(userId: string, missionId: string): Promise<ServiceResult<boolean>>;
}
```

### RewardDistributionService

**Purpose:** Handle reward calculation and distribution.

```typescript
// services/events/RewardDistributionService.ts
export interface RewardDistributionService {
  // Reward calculation
  calculateReward(userId: string, rewardType: RewardType, context: RewardContext): Promise<ServiceResult<Reward>>;
  calculateRewards(userId: string, rewardTypes: RewardType[]): Promise<ServiceResult<Reward[]>>;
  
  // Reward distribution
  distributeReward(userId: string, reward: Reward, reason: string): Promise<ServiceResult<DistributionResult>>;
  distributeRewards(userId: string, rewards: Reward[]): Promise<ServiceResult<DistributionResult[]>>;
  
  // Batch distribution
  distributeEventRewards(eventId: string): Promise<ServiceResult<BatchResult>>;
  distributeDailyRewards(): Promise<ServiceResult<BatchResult>>;
  
  // Validation
  validateRewardDistribution(userId: string, reward: Reward): Promise<ServiceResult<boolean>>;
  
  // History
  getRewardHistory(userId: string, options: RewardHistoryOptions): Promise<ServiceResult<RewardRecord[]>>;
}
```

### SeasonalEventService

**Purpose:** Manage seasonal events and battle passes.

```typescript
// services/events/SeasonalEventService.ts
export interface SeasonalEventService {
  // Season retrieval
  getCurrentSeason(): Promise<ServiceResult<Season>>;
  getSeason(seasonId: string): Promise<ServiceResult<Season>>;
  getSeasonTiers(seasonId: string): Promise<ServiceResult<SeasonTier[]>>;
  
  // Season participation
  joinSeason(userId: string, seasonId: string): Promise<ServiceResult<SeasonParticipant>>;
  getSeasonProgress(userId: string, seasonId: string): Promise<ServiceResult<SeasonProgress>>;
  
  // Tier progression
  addSeasonXP(userId: string, seasonId: string, xp: number): Promise<ServiceResult<TierResult>>;
  claimSeasonTier(userId: string, seasonId: string, tierId: string): Promise<ServiceResult<TierReward>>;
  claimSeasonReward(userId: string, seasonId: string, rewardId: string): Promise<ServiceResult<SeasonReward>>;
  
  // Season management
  resetSeasonProgress(userId: string, seasonId: string): Promise<ServiceResult<void>>;
  calculateSeasonRank(userId: string, seasonId: string): Promise<ServiceResult<number>>;
}
```

---

## 9. PvP Services

PvP services manage battle, tournaments, rankings, and matchmaking.

### PvP Services Architecture

```
PVP SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                      PVP SERVICE DOMAIN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  BattleService  │  │TournamentService│  │RankingService   │  │
│  │                 │  │                 │  │                 │  │
│  │ • Start battle  │  │ • Get tournament│  │ • Get rankings  │  │
│  │ • Perform action│  │ • Join         │  │ • Get rank      │  │
│  │ • End battle    │  │ • Get bracket  │  │ • Update rank   │  │
│  │ • Surrender     │  │ • Claim reward │  │                 │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │      PvPRepository     │                    │
│                    │   (Supabase access)   │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│           ┌────────────────────────────────────────┐            │
│           │       MatchmakingService              │            │
│           │                                         │            │
│           │ • Find match  • Cancel matchmaking    │            │
│           │ • Get status  • Get opponents         │            │
│           └────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### BattleService

**Purpose:** Handle PvP battles.

```typescript
// services/pvp/BattleService.ts
export interface BattleService {
  // Battle lifecycle
  startBattle(userId: string, opponentId: string): Promise<ServiceResult<Battle>>;
  performBattleAction(userId: string, battleId: string, action: BattleAction): Promise<ServiceResult<ActionResult>>;
  endBattle(userId: string, battleId: string): Promise<ServiceResult<BattleResult>>;
  surrender(userId: string, battleId: string): Promise<ServiceResult<BattleResult>>;
  
  // Battle state
  getBattle(battleId: string): Promise<ServiceResult<Battle>>;
  getBattleState(userId: string, battleId: string): Promise<ServiceResult<BattleState>>;
  
  // Battle history
  getBattleHistory(userId: string, options: BattleHistoryOptions): Promise<ServiceResult<BattleRecord[]>>;
  getBattleStats(userId: string): Promise<ServiceResult<BattleStats>>;
}
```

### TournamentService

**Purpose:** Manage tournaments.

```typescript
// services/pvp/TournamentService.ts
export interface TournamentService {
  // Tournament retrieval
  getTournaments(): Promise<ServiceResult<Tournament[]>>;
  getTournament(tournamentId: string): Promise<ServiceResult<Tournament>>;
  getActiveTournaments(): Promise<ServiceResult<Tournament[]>>;
  
  // Tournament participation
  joinTournament(userId: string, tournamentId: string): Promise<ServiceResult<TournamentParticipant>>;
  leaveTournament(userId: string, tournamentId: string): Promise<ServiceResult<void>>;
  
  // Bracket operations
  getTournamentBracket(tournamentId: string): Promise<ServiceResult<TournamentBracket>>;
  getMatchResult(tournamentId: string, matchId: string): Promise<ServiceResult<MatchResult>>;
  
  // Rewards
  claimTournamentReward(userId: string, tournamentId: string): Promise<ServiceResult<TournamentReward>>;
}
```

### RankingService

**Purpose:** Manage player rankings.

```typescript
// services/pvp/RankingService.ts
export interface RankingService {
  // Rankings retrieval
  getRankings(rankingType: RankingType, pagination: PaginationOptions): Promise<ServiceResult<Ranking>>;
  getUserRank(userId: string, rankingType: RankingType): Promise<ServiceResult<UserRanking>>;
  
  // Rank updates
  updateRank(userId: string, rankingType: RankingType, score: number): Promise<ServiceResult<void>>;
  calculateRank(userId: string, rankingType: RankingType): Promise<ServiceResult<number>>;
  
  // Rank rewards
  claimRankingReward(userId: string, rankingType: RankingType, period: RankingPeriod): Promise<ServiceResult<RankingReward>>;
  
  // Rank history
  getRankHistory(userId: string, rankingType: RankingType, options: RankHistoryOptions): Promise<ServiceResult<RankRecord[]>>;
}
```

### MatchmakingService

**Purpose:** Handle opponent matching.

```typescript
// services/pvp/MatchmakingService.ts
export interface MatchmakingService {
  // Matchmaking operations
  findMatch(userId: string, options: MatchmakingOptions): Promise<ServiceResult<MatchResult>>;
  cancelMatchmaking(userId: string): Promise<ServiceResult<void>>;
  
  // Matchmaking status
  getMatchmakingStatus(userId: string): Promise<ServiceResult<MatchmakingStatus>>;
  getMatchmakingQueue(userId: string): Promise<ServiceResult<QueueInfo>>;
  
  // Matchmaking settings
  getMatchmakingSettings(userId: string): Promise<ServiceResult<MatchmakingSettings>>;
  updateMatchmakingSettings(userId: string, settings: MatchmakingSettings): Promise<ServiceResult<void>>;
}
```

---

## 10. Social Services

Social services manage friends, guilds, referrals, and leaderboards.

### Social Services Architecture

```
SOCIAL SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                     SOCIAL SERVICE DOMAIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ FriendsService  │  │  GuildService   │  │ReferralService  │  │
│  │                 │  │                 │  │                 │  │
│  │ • Send request │  │ • Create guild  │  │ • Generate link │  │
│  │ • Accept       │  │ • Join/leave    │  │ • Track referrals│  │
│  │ • Remove       │  │ • Manage members│  │ • Award bonus   │  │
│  │ • Get friends  │  │ • Guild wars   │  │                 │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │   SocialRepository     │                    │
│                    │   (Supabase access)   │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│           ┌────────────────────────────────────────┐            │
│           │     LeaderboardService                  │            │
│           │                                         │            │
│           │ • Get leaderboard  • Get entry          │            │
│           │ • Get nearby      • Get top players    │            │
│           └────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### FriendsService

**Purpose:** Manage friend relationships.

```typescript
// services/social/FriendsService.ts
export interface FriendsService {
  // Friend retrieval
  getFriends(userId: string): Promise<ServiceResult<Friend[]>>;
  getFriendRequests(userId: string): Promise<ServiceResult<FriendRequest[]>>;
  getBlockedUsers(userId: string): Promise<ServiceResult<User[]>>;
  
  // Friend operations
  sendFriendRequest(fromUserId: string, toUserId: string): Promise<ServiceResult<FriendRequest>>;
  acceptFriendRequest(userId: string, requestId: string): Promise<ServiceResult<void>>;
  declineFriendRequest(userId: string, requestId: string): Promise<ServiceResult<void>>;
  removeFriend(userId: string, friendId: string): Promise<ServiceResult<void>>;
  
  // Block operations
  blockUser(userId: string, blockedId: string): Promise<ServiceResult<void>>;
  unblockUser(userId: string, blockedId: string): Promise<ServiceResult<void>>;
  
  // Social graph
  getFriendsOfFriends(userId: string): Promise<ServiceResult<User[]>>;
  getMutualFriends(userId: string, otherUserId: string): Promise<ServiceResult<User[]>>;
}
```

### GuildService

**Purpose:** Manage guilds and guild membership.

```typescript
// services/social/GuildService.ts
export interface GuildService {
  // Guild retrieval
  getGuild(guildId: string): Promise<ServiceResult<Guild>>;
  getGuilds(options: GuildSearchOptions): Promise<ServiceResult<Guild[]>>;
  getGuildMembers(guildId: string): Promise<ServiceResult<GuildMember[]>>;
  
  // Guild operations
  createGuild(userId: string, name: string, description: string): Promise<ServiceResult<Guild>>;
  joinGuild(userId: string, guildId: string): Promise<ServiceResult<void>>;
  leaveGuild(userId: string, guildId: string): Promise<ServiceResult<void>>;
  
  // Guild management
  updateGuild(guildId: string, data: UpdateGuildData): Promise<ServiceResult<Guild>>;
  transferOwnership(guildId: string, newOwnerId: string): Promise<ServiceResult<void>>;
  promoteMember(guildId: string, memberId: string, role: GuildRole): Promise<ServiceResult<void>>;
  kickMember(guildId: string, memberId: string): Promise<ServiceResult<void>>;
  
  // Guild wars
  declareWar(guildId: string, targetGuildId: string): Promise<ServiceResult<GuildWar>>;
  endWar(guildId: string, warId: string): Promise<ServiceResult<WarResult>>;
}
```

### ReferralService

**Purpose:** Handle referral system.

```typescript
// services/social/ReferralService.ts
export interface ReferralService {
  // Referral links
  generateReferralLink(userId: string): Promise<ServiceResult<ReferralLink>>;
  getReferralLink(userId: string): Promise<ServiceResult<ReferralLink>>;
  
  // Referral tracking
  trackReferral(referrerId: string, referredId: string, linkCode: string): Promise<ServiceResult<Referral>>;
  getReferrals(userId: string): Promise<ServiceResult<Referral[]>>;
  getReferralStats(userId: string): Promise<ServiceResult<ReferralStats>>;
  
  // Referral rewards
  claimReferralReward(userId: string, referralId: string): Promise<ServiceResult<ReferralReward>>;
  awardReferrerBonus(userId: string, referredId: string): Promise<ServiceResult<void>>;
}
```

### LeaderboardService

**Purpose:** Manage leaderboards.

```typescript
// services/social/LeaderboardService.ts
export interface LeaderboardService {
  // Leaderboard retrieval
  getLeaderboard(type: LeaderboardType, period: LeaderboardPeriod, pagination: PaginationOptions): Promise<ServiceResult<Leaderboard>>;
  getLeaderboardEntry(leaderboardId: string, userId: string): Promise<ServiceResult<LeaderboardEntry>>;
  getNearbyPlayers(userId: string, type: LeaderboardType, count: number): Promise<ServiceResult<LeaderboardEntry[]>>;
  
  // Rankings
  getPlayerRank(userId: string, type: LeaderboardType, period: LeaderboardPeriod): Promise<ServiceResult<PlayerRank>>;
  getTopPlayers(type: LeaderboardType, period: LeaderboardPeriod, limit: number): Promise<ServiceResult<PlayerRank[]>>;
  
  // Rank changes
  getRankChanges(userId: string, type: LeaderboardType): Promise<ServiceResult<RankChange[]>>;
}
```

---

## 11. Telegram Services

Telegram services provide platform integration for the Telegram Mini App and Bot.

### Telegram Services Architecture

```
TELEGRAM SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                   TELEGRAM SERVICE DOMAIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │TelegramUser     │  │TelegramNotif    │  │TelegramDeepLink │  │
│  │Service          │  │Service          │  │Service          │  │
│  │                 │  │                 │  │                 │  │
│  │ • Get user     │  │ • Schedule notif│  │ • Parse link   │  │
│  │ • Validate     │  │ • Send notif   │  │ • Handle start  │  │
│  │ • Link account │  │ • Manage prefs │  │                 │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │  Telegram Bot API      │                    │
│                    │  (External API)        │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                      │
│  │TelegramSharing  │  │  Localization   │                      │
│  │Service          │  │  Service        │                      │
│  │                 │  │                 │                      │
│  │ • Share content│  │ • Get translation│                      │
│  │ • Generate link│  │ • Set language  │                      │
│  └─────────────────┘  └─────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### TelegramUserService

**Purpose:** Handle Telegram user integration.

```typescript
// services/telegram/TelegramUserService.ts
export interface TelegramUserService {
  // User operations
  getTelegramUser(initData: string): Promise<ServiceResult<TelegramUser>>;
  validateInitData(initData: string): Promise<ServiceResult<boolean>>;
  
  // Account linking
  linkTelegramAccount(userId: string, telegramUserId: number): Promise<ServiceResult<void>>;
  unlinkTelegramAccount(userId: string): Promise<ServiceResult<void>>;
  
  // User info
  getUserFromTelegram(telegramUserId: number): Promise<ServiceResult<User>>;
  syncTelegramProfile(userId: string, telegramUser: TelegramUser): Promise<ServiceResult<void>>;
}
```

### TelegramNotificationService

**Purpose:** Send notifications via Telegram Bot.

```typescript
// services/telegram/TelegramNotificationService.ts
export interface TelegramNotificationService {
  // Notification sending
  sendNotification(userId: string, notification: Notification): Promise<ServiceResult<void>>;
  sendBulkNotifications(userIds: string[], notification: Notification): Promise<ServiceResult<BulkResult>>;
  
  // Scheduling
  scheduleNotification(userId: string, notification: ScheduledNotification): Promise<ServiceResult<string>>;
  cancelScheduledNotification(scheduleId: string): Promise<ServiceResult<void>>;
  
  // Preferences
  getNotificationPreferences(userId: string): Promise<ServiceResult<NotificationPreferences>>;
  updateNotificationPreferences(userId: string, prefs: NotificationPreferences): Promise<ServiceResult<void>>;
}
```

### TelegramDeepLinkService

**Purpose:** Handle deep links from Telegram.

```typescript
// services/telegram/TelegramDeepLinkService.ts
export interface TelegramDeepLinkService {
  // Deep link parsing
  parseDeepLink(link: string): Promise<ServiceResult<DeepLinkData>>;
  validateDeepLink(link: string): Promise<ServiceResult<boolean>>;
  
  // Deep link handling
  handleStartParam(userId: string, startParam: string): Promise<ServiceResult<DeepLinkResult>>;
  handleGameStartParam(userId: string, gameParam: string): Promise<ServiceResult<GameDeepLinkResult>>;
  
  // Deep link generation
  generateDeepLink(userId: string, action: DeepLinkAction, params?: Record<string, string>): Promise<ServiceResult<string>>;
  generateInviteLink(userId: string): Promise<ServiceResult<string>>;
}
```

### TelegramSharingService

**purpose:** Handle sharing functionality.

```typescript
// services/telegram/TelegramSharingService.ts
export interface TelegramSharingService {
  // Sharing
  shareContent(userId: string, content: ShareContent): Promise<ServiceResult<void>>;
  shareAchievement(userId: string, achievementId: string): Promise<ServiceResult<ShareResult>>;
  shareArtifact(userId: string, artifactId: string): Promise<ServiceResult<ShareResult>>;
  shareLeaderboard(userId: string, rankingType: RankingType): Promise<ServiceResult<ShareResult>>;
  
  // Share tracking
  trackShare(userId: string, shareType: ShareType, targetUserId?: string): Promise<ServiceResult<void>>;
  getShareStats(userId: string): Promise<ServiceResult<ShareStats>>;
}
```

### LocalizationService

**Purpose:** Handle translations.

```typescript
// services/telegram/localization/LocalizationService.ts
export interface LocalizationService {
  // Translation
  getTranslation(key: string, locale: string, params?: Record<string, string>): Promise<ServiceResult<string>>;
  getTranslations(locale: string, namespace?: string): Promise<ServiceResult<Translations>>;
  
  // Locale management
  setUserLocale(userId: string, locale: string): Promise<ServiceResult<void>>;
  getUserLocale(userId: string): Promise<ServiceResult<string>>;
  getAvailableLocales(): Promise<ServiceResult<Locale[]>>;
}
```

---

## 12. Analytics Services

Analytics services provide tracking, retention analysis, and monetization monitoring. **AdsGram is a primary revenue system.**

### Analytics Services Architecture

```
ANALYTICS SERVICES:
┌─────────────────────────────────────────────────────────────────┐
│                   ANALYTICS SERVICE DOMAIN                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ AnalyticsService│  │ RetentionService│  │Monetization     │  │
│  │                 │  │                 │  │Service          │  │
│  │ • Track events │  │ • Track DAU/WAU │  │ • Track revenue │  │
│  │ • Track screens│  │ • Churn analysis│  │ • Track ARPU    │  │
│  │ • User tracking│  │ • Retention cur.│  │ • LTV calculat. │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │           │
│           └─────────────────────┼─────────────────────┘           │
│                                 │                                 │
│                                 ▼                                 │
│                    ┌────────────────────────┐                    │
│                    │   Analytics Repository │                    │
│                    │   (Supabase access)    │                    │
│                    └────────────────────────┘                    │
│                                                                  │
│           ┌────────────────────────────────────────┐            │
│           │     AdsGramAnalyticsService            │            │
│           │                                         │            │
│           │ • Track impressions  • Track revenue   │            │
│           │ • Track completions  • Monitor CPM    │            │
│           │ • A/B testing support                  │            │
│           └────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### AnalyticsService

**Purpose:** Central analytics tracking.

```typescript
// services/analytics/AnalyticsService.ts
export interface AnalyticsService {
  // Event tracking
  trackEvent(userId: string, event: AnalyticsEvent): Promise<ServiceResult<void>>;
  trackScreenView(userId: string, screen: ScreenView): Promise<ServiceResult<void>>;
  trackAction(userId: string, action: UserAction): Promise<ServiceResult<void>>;
  
  // User tracking
  identifyUser(userId: string, traits?: UserTraits): Promise<ServiceResult<void>>;
  aliasUser(userId: string, previousId: string): Promise<ServiceResult<void>>;
  
  // Session tracking
  startSession(userId: string): Promise<ServiceResult<Session>>;
  endSession(userId: string, sessionId: string): Promise<ServiceResult<SessionSummary>>;
  
  // Error tracking
  trackError(userId: string, error: ErrorInfo): Promise<ServiceResult<void>>;
}
```

### RetentionService

**Purpose:** Analyze user retention.

```typescript
// services/analytics/RetentionService.ts
export interface RetentionService {
  // Retention metrics
  getDAU(date: Date): Promise<ServiceResult<number>>;
  getWAU(date: Date): Promise<ServiceResult<number>>;
  getMAU(date: Date): Promise<ServiceResult<number>>;
  
  // Retention curves
  getRetentionCurve(startDate: Date, cohortType: CohortType): Promise<ServiceResult<RetentionCurve>>;
  getNDayRetention(startDate: Date, n: number): Promise<ServiceResult<number>>;
  
  // Churn analysis
  getChurnRate(period: DateRange): Promise<ServiceResult<ChurnRate>>;
  identifyChurnedUsers(period: DateRange): Promise<ServiceResult<User[]>>;
  
  // Engagement metrics
  getSessionCount(userId: string, date: Date): Promise<ServiceResult<number>>;
  getAverageSessionLength(userId: string, date: Date): Promise<ServiceResult<number>>;
}
```

### MonetizationService

**Purpose:** Track monetization metrics including AdsGram revenue.

```typescript
// services/analytics/MonetizationService.ts
export interface MonetizationService {
  // Revenue tracking
  trackRevenue(userId: string, revenue: RevenueEvent): Promise<ServiceResult<void>>;
  trackAdRevenue(userId: string, adRevenue: AdRevenueEvent): Promise<ServiceResult<void>>;
  trackPurchase(userId: string, purchase: PurchaseEvent): Promise<ServiceResult<void>>;
  
  // Revenue metrics
  getTotalRevenue(period: DateRange): Promise<ServiceResult<number>>;
  getARPU(period: DateRange): Promise<ServiceResult<number>>;
  getARPPU(period: DateRange): Promise<ServiceResult<number>>;
  getLTV(userId: string): Promise<ServiceResult<number>>;
  
  // Conversion tracking
  getConversionRate(): Promise<ServiceResult<number>>;
  getPayingUserCount(period: DateRange): Promise<ServiceResult<number>>;
  
  // Revenue breakdown
  getRevenueBySource(period: DateRange): Promise<ServiceResult<RevenueBreakdown>>;
}
```

### AdsGramAnalyticsService

**Purpose:** Track AdsGram ad performance. **Critical for revenue monitoring.**

```typescript
// services/analytics/AdsGramAnalyticsService.ts
export interface AdsGramAnalyticsService {
  // Ad tracking
  trackAdImpression(userId: string, impression: AdImpression): Promise<ServiceResult<void>>;
  trackAdView(userId: string, view: AdView): Promise<ServiceResult<void>>;
  trackAdReward(userId: string, reward: AdRewardEvent): Promise<ServiceResult<void>>;
  trackAdError(userId: string, error: AdError): Promise<ServiceResult<void>>;
  
  // Performance metrics
  getAdImpressions(userId: string, period: DateRange): Promise<ServiceResult<number>>;
  getAdCompletionRate(userId: string, period: DateRange): Promise<ServiceResult<number>>;
  getAverageCPM(period: DateRange): Promise<ServiceResult<number>>;
  getEstimatedRevenue(period: DateRange): Promise<ServiceResult<number>>;
  
  // User metrics
  getUserAdStats(userId: string): Promise<ServiceResult<UserAdStats>>;
  getAdEngagementScore(userId: string): Promise<ServiceResult<number>>;
  
  // A/B testing
  getABTestAssignments(userId: string): Promise<ServiceResult<ABTestAssignments>>;
  trackABTestConversion(userId: string, testId: string, variant: string): Promise<ServiceResult<void>>;
  
  // Daily limits
  getDailyAdLimit(userId: string, adType: AdType): Promise<ServiceResult<number>>;
  getDailyAdUsage(userId: string, adType: AdType): Promise<ServiceResult<number>>;
}
```

---

## 13. Service Communication Rules

### Communication Diagram

```
SERVICE COMMUNICATION:
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT LAYER                             │
│         Components ────────────────▶ Hooks                       │
└─────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SERVICE A                              │  │
│  │   ┌────────────────────────────────────────────────┐     │  │
│  │   │  Public Methods (API)                          │     │  │
│  │   └────────────────────────────────────────────────┘     │  │
│  │   ┌────────────────────────────────────────────────┐     │  │
│  │   │  Business Logic                                │     │  │
│  │   └────────────────────────────────────────────────┘     │  │
│  │   ┌────────────────────────────────────────────────┐     │  │
│  │   │  Validation                                     │     │  │
│  │   └────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│              ┌─────────────┼─────────────┐                     │
│              ▼             ▼             ▼                     │
│     ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│     │ REPOSITORY │ │   OTHER    │ │  EXTERNAL  │              │
│     │             │ │  SERVICES  │ │    APIs    │              │
│     └────────────┘ └────────────┘ └────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Communication Rules

| From | To | Allowed | Method |
|------|-----|---------|--------|
| **Component** | Hook | ✓ | Function call |
| **Component** | Service | ✗ | Never direct |
| **Hook** | Service | ✓ | Method call |
| **Hook** | Repository | ✗ | Never direct |
| **Service** | Repository | ✓ | Interface call |
| **Service** | Other Service | ✓ | Method call (limited) |
| **Service** | External API | ✓ | SDK call |

### Dependency Direction

```
ALLOWED DEPENDENCIES:
Component ─▶ Hook ─▶ Service ─▶ Repository
                              │
                              ▼
                         External APIs
                              │
                              ▼
                        Telegram, AdsGram
```

### Cross-Service Communication

Services should minimize dependencies on other services:

```typescript
// ✅ Good: Service uses repository directly
class PlayerService {
  constructor(
    private readonly playerRepo: PlayerRepository,
    private readonly supabase: SupabaseClient
  ) {}
}

// ⚠️ Caution: Service calls another service
class GuildService {
  constructor(
    private readonly guildRepo: GuildRepository,
    private readonly playerService: PlayerService  // Use carefully
  ) {}
}

// ❌ Bad: Circular dependencies
class ServiceA {
  constructor(private readonly serviceB: ServiceB) {}
}
class ServiceB {
  constructor(private readonly serviceA: ServiceA) {}  // ❌ Circular!
}
```

---

## 14. Error Handling Philosophy

### Error Handling Pattern

All service methods return `ServiceResult<T>`:

```typescript
// common/Result.ts
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### Error Code Standards

| Category | Code Pattern | Example |
|----------|--------------|---------|
| **Validation** | `VALIDATION_*` | `VALIDATION_INVALID_INPUT` |
| **Not Found** | `NOT_FOUND` | `PLAYER_NOT_FOUND` |
| **Permission** | `PERMISSION_*` | `PERMISSION_DENIED` |
| **Business** | `BUSINESS_*` | `BUSINESS_INSUFFICIENT_FUNDS` |
| **External** | `EXTERNAL_*` | `EXTERNAL_API_ERROR` |
| **Internal** | `INTERNAL_*` | `INTERNAL_UNKNOWN_ERROR` |

### Error Response Pattern

```typescript
// Service method pattern
async getPlayer(id: string): Promise<ServiceResult<Player>> {
  // 1. Validate input
  if (!id) {
    return this.failure('VALIDATION_ID_REQUIRED', 'Player ID is required');
  }

  // 2. Check business rules
  const exists = await this.playerRepo.exists(id);
  if (!exists) {
    return this.failure('PLAYER_NOT_FOUND', 'Player not found');
  }

  // 3. Execute operation
  try {
    const player = await this.playerRepo.findById(id);
    return this.success(player);
  } catch (error) {
    // 4. Handle errors (no leaking implementation details)
    return this.error(error);
  }
}
```

### Retry Philosophy

| Error Type | Retry | Reason |
|------------|-------|--------|
| **Network** | ✓ | Transient failure |
| **Rate Limit** | ✓ | Temporary throttling |
| **Server Error** | ✓ (limited) | May succeed on retry |
| **Validation** | ✗ | Input problem |
| **Permission** | ✗ | Authorization issue |
| **Not Found** | ✗ | Resource doesn't exist |

---

## 15. Transaction Philosophy

### Transaction Scope

Services manage transactions for atomic operations:

```typescript
// Good: Transaction for atomic operation
async transferCurrency(
  fromUserId: string,
  toUserId: string,
  currencyType: CurrencyType,
  amount: number
): Promise<ServiceResult<TransferResult>> {
  // Start transaction
  const tx = await this.supabase.transaction();
  
  try {
    // Deduct from sender
    const deductResult = await this.deductCurrency(tx, fromUserId, currencyType, amount);
    if (!deductResult.success) {
      await tx.rollback();
      return deductResult;
    }

    // Add to receiver
    const addResult = await this.addCurrency(tx, toUserId, currencyType, amount);
    if (!addResult.success) {
      await tx.rollback();
      return addResult;
    }

    // Commit if both succeed
    await tx.commit();
    return this.success({ fromUserId, toUserId, amount, currencyType });
  } catch (error) {
    await tx.rollback();
    return this.error(error);
  }
}
```

### Operations Requiring Transactions

| Operation | Reason |
|-----------|--------|
| **Currency Transfer** | Both deduct and add must succeed |
| **Inventory Update** | Remove old, add new atomically |
| **Reward Distribution** | Multiple currency/item changes |
| **Level Up** | XP change, level change, reward |
| **Guild Operations** | Multiple member updates |

### Operations NOT Requiring Transactions

| Operation | Reason |
|-----------|--------|
| **Read Operations** | No state change |
| **Single Update** | Only one change |
| **Log Operations** | No business state change |
| **Analytics Events** | Fire-and-forget tracking |

---

## 16. Testing Philosophy

### Testing Strategy

Services are the primary target for unit testing:

| Test Type | Target | Mock Dependencies |
|-----------|--------|-------------------|
| **Unit Tests** | Service methods | Repositories, External APIs |
| **Integration Tests** | Service + Repository | External APIs |
| **E2E Tests** | Full flow | Real services |

### Service Testing Pattern

```typescript
// services/player/PlayerService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlayerService } from './PlayerService';
import { MockPlayerRepository } from './__mocks__/PlayerRepository';

describe('PlayerService', () => {
  let service: PlayerService;
  let mockRepository: MockPlayerRepository;

  beforeEach(() => {
    mockRepository = new MockPlayerRepository();
    service = new PlayerService({
      repository: mockRepository,
    });
  });

  describe('getPlayer', () => {
    it('should return player when found', async () => {
      // Arrange
      const mockPlayer = { id: '1', name: 'Test' };
      mockRepository.findById.mockResolvedValue(mockPlayer);

      // Act
      const result = await service.getPlayer('1');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlayer);
    });

    it('should return error when not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.getPlayer('999');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PLAYER_NOT_FOUND');
    });
  });
});
```

### Testing Checklist

- [ ] All public service methods have unit tests
- [ ] Error cases are tested
- [ ] Validation is tested
- [ ] Edge cases are tested
- [ ] Mock repositories return predictable data
- [ ] Tests are independent (no shared state)
- [ ] Tests follow Arrange-Act-Assert pattern

---

## 17. Future Expansion Notes

These services represent future concepts and should be created when the corresponding features are implemented.

### Future Service Domains

#### AI Services

```typescript
// Future AI-related services (create when implementing AI features)
src/services/ai/
├── AIHistorianService.ts      # AI historian Q&A
├── AINPCDialogueService.ts   # AI NPC conversation
├── ContentGenerationService.ts # AI content generation
├── RecommendationService.ts  # AI recommendations
└── index.ts
```

#### Web3 Services

```typescript
// Future Web3-related services (create when implementing Web3)
src/services/web3/
├── WalletService.ts          # Wallet connection
├── NFTService.ts            # NFT operations
├── TokenService.ts         # Token management
├── BlockchainService.ts     # Blockchain interactions
└── index.ts
```

#### Creator Economy Services

```typescript
// Future creator tools services (create when implementing creator features)
src/services/creator/
├── ContentBuilderService.ts  # Custom content building
├── ExhibitTemplateService.ts # Exhibit templates
├── ContentModerationService.ts # Content review
└── index.ts
```

#### Esports Services

```typescript
// Future esports services (create when implementing esports)
src/services/esports/
├── TournamentService.ts     # Esports tournaments
├── TeamService.ts          # Team management
├── BroadcastService.ts     # Live broadcasts
└── index.ts
```

### Expansion Criteria

Before creating a new service domain:

1. **Domain Isolation** — Does it have a clear domain boundary?
2. **Business Logic** — Does it encapsulate significant logic?
3. **Multiple Operations** — Does it have 3+ related operations?
4. **External Dependencies** — Does it interact with external systems?
5. **Independent Lifecycle** — Can it evolve independently?

---

## 18. Long-Term Philosophy

### Business Core

The Services Layer becomes the **business core** of the application:

| Property | Benefit |
|----------|---------|
| **Single Source of Truth** | All business rules in one place |
| **Consistent Behavior** | Same operation always behaves identically |
| **Easy Updates** | Change once, affects all consumers |
| **Clear Contracts** | Well-defined interfaces |

### Reduced Duplication

Services eliminate duplication:

```
WITHOUT SERVICES (❌):
┌─────────┐    ┌─────────┐    ┌─────────┐
│ ScreenA │    │ ScreenB │    │ ScreenC │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     ▼              ▼              ▼
  [Copy]         [Copy]         [Copy]
  of logic       of logic       of logic
     │              │              │
     ▼              ▼              ▼
  [Bug]           [Bug]          [Bug]

WITH SERVICES (✅):
┌─────────┐    ┌─────────┐    ┌─────────┐
│ ScreenA │    │ ScreenB │    │ ScreenC │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   SERVICE     │
            │  (Single)     │
            └───────────────┘
```

### Simplified Maintenance

| Challenge | Service Solution |
|-----------|------------------|
| **Bug Fix** | Fix in one service, all consumers benefit |
| **Feature Update** | Update service, UI unchanged |
| **Testing** | Test service in isolation |
| **Debugging** | Single location for logic |
| **Documentation** | Service API docs cover all use cases |

### Large-Scale Growth

Services scale with the application:

| Scale | Service Strategy |
|-------|------------------|
| **10 Features** | 10-15 core services |
| **50 Features** | Feature service domains |
| **100+ Features** | Service domain groups |
| **Multi-Team** | Team ownership per service domain |

### Architectural Principles

1. **Service Isolation** — Services own their domain
2. **Clear Interfaces** — Well-defined public APIs
3. **Minimal Dependencies** — Services minimize dependencies
4. **Transaction Boundaries** — Services define transaction scope
5. **Error Abstraction** — Services hide implementation details

### Enforcement

This architecture is enforced through:

- Code review checks
- Dependency analysis
- Architecture tests
- Service ownership documentation

---

## Summary

The Jolt Time Services Layer provides:

| Property | Benefit |
|----------|---------|
| **Business Core** | Single source of truth for business logic |
| **Reusability** | Same operations available everywhere |
| **Testability** | Easy to test in isolation |
| **Maintainability** | Change once, benefit everywhere |
| **Scalability** | Architecture supports growth |
| **Error Handling** | Consistent error patterns |

All business operations must flow through the Services Layer to ensure consistency and maintainability.

---

*Document Version: 1.0*
*Last Updated: 2024*
*Next Review: Quarterly*
