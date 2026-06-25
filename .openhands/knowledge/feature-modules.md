# Jolt Time — Feature Module Architecture

## Overview

The Feature Module Architecture organizes the Jolt Time application around independent business domains. Each feature module encapsulates all related functionality, enabling isolated development, testing, and deployment while minimizing cross-dependencies and supporting long-term scalability.

**Architecture Status:** Design Specification Only
**Implementation:** Not Started

---

## 1. Module Categories

The Jolt Time application comprises eight primary feature modules, each representing a distinct business domain.

### 1.1 Player Module

**Purpose:** Manage player identity, progression, and personal data.

**Scope:**
- Player profile management
- Level and experience progression
- Achievement tracking and rewards
- Player statistics and history
- Player preferences and settings

**Boundaries:**
- Does not own game content (artifacts, events)
- Does not own social relationships (handled by Social Module)
- Coordinates with Economy Module for currency updates

### 1.2 Museum Module

**Purpose:** Manage artifact collection and museum display systems.

**Scope:**
- Artifact acquisition and management
- Museum display configuration
- Collection tracking and completion
- Artifact evolution and upgrades
- Exhibition management

**Boundaries:**
- Does not handle currency transactions directly
- Coordinates with Economy Module for upgrade costs
- Does not manage player progression

### 1.3 Economy Module

**Purpose:** Manage all economic systems and resource flows.

**Scope:**
- Currency management (coins, gems, energy)
- Inventory operations
- Reward distribution
- Transaction history
- Marketplace economics

**Boundaries:**
- Provides services to other modules
- Does not own player identity
- Coordinates with Event Module for reward events

### 1.4 Event Module

**Purpose:** Manage time-limited events and seasonal content.

**Scope:**
- Event lifecycle management
- Mission and quest tracking
- Season pass management
- Event reward distribution
- Leaderboard tracking

**Boundaries:**
- Does not own game entities directly
- Coordinates with Economy Module for event rewards
- Does not manage player social features

### 1.5 PvP Module

**Purpose:** Manage competitive gameplay systems.

**Scope:**
- Battle system management
- Ranking and league progression
- Tournament organization
- Match history
- Competitive statistics

**Boundaries:**
- Does not own guild relationships
- Coordinates with Economy Module for PvP rewards
- Does not manage non-competitive events

### 1.6 Guild Module

**Purpose:** Manage social group functionality.

**Scope:**
- Guild creation and management
- Member management and roles
- Guild activities and quests
- Guild progression and upgrades
- Guild chat and communication

**Boundaries:**
- Does not manage individual player progression
- Coordinates with Economy Module for guild expenses
- Does not handle PvP-specific functionality

### 1.7 Marketplace Module

**Purpose:** Manage player-to-player trading.

**Scope:**
- Listing creation and management
- Purchase and sale processing
- Price discovery and analytics
- Transaction settlement
- Marketplace moderation

**Boundaries:**
- Does not create game content
- Coordinates with Economy Module for currency transfer
- Does not manage player profiles

### 1.8 Settings Module

**Purpose:** Manage application and player preferences.

**Scope:**
- User preferences storage
- Notification settings
- Display preferences
- Privacy settings
- Account management

**Boundaries:**
- Provides settings data to all modules
- Does not own business logic
- Does not manage game content

---

## 2. Feature Module Philosophy

Each feature module embodies three core principles that guide its design and implementation.

### 2.1 Ownership of Business Logic

Modules own their complete business logic:

- **Self-Contained:** All logic for a domain resides within the module
- **No Leakage:** Business rules don't span multiple modules
- **Clear Boundaries:** Module responsibilities are well-defined

### 2.2 Minimized Cross-Dependencies

Modules communicate through well-defined interfaces:

- **Loose Coupling:** Modules depend on abstractions, not concretions
- **Facade Pattern:** Modules expose minimal, intentional APIs
- **Event Communication:** Modules can communicate via events when appropriate

### 2.3 Independent Scalability

Modules can scale independently:

- **Stateless Services:** Module logic can be extracted to separate services
- **Database Isolation:** Modules can have dedicated database schemas
- **Deployment Independence:** Modules can be deployed separately if needed

---

## 3. Standard Module Structure

Every feature module follows a consistent directory structure that promotes discoverability and maintainability.

### 3.1 Directory Layout

```
src/features/{module-name}/
├── index.ts                    # Module public API exports
├── README.md                   # Module documentation
│
├── components/                 # React components
│   ├── {ComponentName}.tsx
│   ├── {ComponentName}.module.css
│   └── index.ts
│
├── hooks/                      # Custom React hooks
│   ├── use{Feature}.ts
│   ├── use{Feature}State.ts
│   └── index.ts
│
├── services/                   # Business logic services
│   ├── {Feature}Service.ts
│   ├── {Feature}Validator.ts
│   └── index.ts
│
├── repositories/               # Data access layer
│   ├── {Feature}Repository.ts
│   └── index.ts
│
├── stores/                    # Zustand state management
│   ├── {Feature}Store.ts
│   └── index.ts
│
├── types/                     # TypeScript type definitions
│   ├── {Feature}Types.ts
│   ├── {Feature}DTO.ts
│   └── index.ts
│
├── pages/                     # Page components (if module has dedicated pages)
│   ├── {Feature}Page.tsx
│   └── index.ts
│
├── utils/                     # Module-specific utilities
│   ├── {Feature}Helpers.ts
│   └── index.ts
│
└── constants/                 # Module-specific constants
    ├── {Feature}Config.ts
    └── index.ts
```

### 3.2 Barrel Exports

Each module exposes a clean public API through `index.ts`:

```typescript
// features/player/index.ts
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';

// Named exports for store and services
export { usePlayerStore } from './stores';
export { PlayerService } from './services/PlayerService';
```

### 3.3 Module README Template

Each module should include documentation:

```markdown
# {Module Name}

## Overview
Brief description of the module's purpose.

## Responsibilities
- What the module owns
- What the module coordinates with

## Public API
Available exports and usage examples.

## State Management
Store structure and state shape.

## Dependencies
External module dependencies.
```

---

## 4. Player Module Architecture

The Player Module manages player identity, progression, and personal data.

### 4.1 Module Structure

```
src/features/player/
├── components/
│   ├── ProfileCard.tsx
│   ├── LevelProgress.tsx
│   ├── AchievementBadge.tsx
│   ├── StatsGrid.tsx
│   └── ProfileEditModal.tsx
├── hooks/
│   ├── usePlayer.ts
│   ├── usePlayerStats.ts
│   ├── useAchievements.ts
│   └── usePlayerProgress.ts
├── services/
│   ├── PlayerService.ts
│   ├── ProgressionService.ts
│   ├── AchievementService.ts
│   └── PlayerValidator.ts
├── repositories/
│   └── PlayerRepository.ts
├── stores/
│   └── playerStore.ts
├── types/
│   ├── player.types.ts
│   ├── achievement.types.ts
│   ├── stats.types.ts
│   └── index.ts
├── pages/
│   └── ProfilePage.tsx
├── utils/
│   ├── levelCalculations.ts
│   └── statsCalculations.ts
└── constants/
    ├── levelConfig.ts
    └── achievementIds.ts
```

### 4.2 Profile Subdomain

```typescript
// types/player/profile.types.ts
interface PlayerProfile {
  id: string;
  telegramUserId: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  isPremium: boolean;
}
```

### 4.3 Progression Subdomain

```typescript
// types/player/progression.types.ts
interface PlayerProgression {
  playerId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalPlayTime: number;
  currentEra: EraId;
  unlockedEras: EraId[];
}
```

### 4.4 Achievements Subdomain

```typescript
// types/player/achievement.types.ts
interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  reward: Reward;
  isUnlocked: boolean;
  unlockedAt?: Date;
}
```

### 4.5 Statistics Subdomain

```typescript
// types/player/stats.types.ts
interface PlayerStatistics {
  playerId: string;
  totalGamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  artifactsCollected: number;
  timePlayed: number;
  // ... additional stat categories
}
```

---

## 5. Museum Module Architecture

The Museum Module manages artifact collection and museum display systems.

### 5.1 Module Structure

```
src/features/museum/
├── components/
│   ├── ArtifactCard.tsx
│   ├── MuseumDisplay.tsx
│   ├── CollectionGrid.tsx
│   ├── ArtifactDetailsModal.tsx
│   └── ExhibitionView.tsx
├── hooks/
│   ├── useArtifacts.ts
│   ├── useMuseumDisplay.ts
│   ├── useCollections.ts
│   └── useArtifactEvolution.ts
├── services/
│   ├── MuseumService.ts
│   ├── ArtifactService.ts
│   ├── CollectionService.ts
│   └── MuseumValidator.ts
├── repositories/
│   ├── ArtifactRepository.ts
│   └── MuseumRepository.ts
├── stores/
│   └── museumStore.ts
├── types/
│   ├── artifact.types.ts
│   ├── museum.types.ts
│   ├── collection.types.ts
│   └── index.ts
├── pages/
│   └── MuseumPage.tsx
├── utils/
│   ├── artifactCalculations.ts
│   └── displayLayout.ts
└── constants/
    ├── rarityConfig.ts
    └── artifactSetBonuses.ts
```

### 5.2 Artifacts Subdomain

```typescript
// types/museum/artifact.types.ts
interface Artifact {
  id: string;
  definitionId: string;
  name: string;
  description: string;
  era: EraId;
  rarity: ArtifactRarity;
  setId?: string;
  level: number;
  experience: number;
  stats: ArtifactStats;
  acquiredAt: Date;
  ownerId: string;
}

interface ArtifactDefinition {
  id: string;
  name: string;
  description: string;
  era: EraId;
  rarity: ArtifactRarity;
  baseStats: ArtifactStats;
  setId?: string;
  imageUrl: string;
  isUnique: boolean;
}
```

### 5.3 Collections Subdomain

```typescript
// types/museum/collection.types.ts
interface Collection {
  id: string;
  name: string;
  description: string;
  era: EraId;
  requiredArtifacts: string[];
  bonusType: CollectionBonusType;
  bonusValue: number;
  isComplete: boolean;
  completionProgress: number;
}
```

### 5.4 Exhibitions Subdomain

```typescript
// types/museum/exhibition.types.ts
interface MuseumDisplay {
  id: string;
  ownerId: string;
  name: string;
  slots: DisplaySlot[];
  theme: MuseumTheme;
  totalPower: number;
}

interface DisplaySlot {
  slotId: number;
  position: { row: number; col: number };
  artifactId?: string;
  isUnlocked: boolean;
  unlockCost?: CurrencyCost;
}
```

---

## 6. Economy Module Architecture

The Economy Module manages all economic systems and resource flows.

### 6.1 Module Structure

```
src/features/economy/
├── components/
│   ├── CurrencyDisplay.tsx
│   ├── InventoryGrid.tsx
│   ├── TransactionList.tsx
│   ├── RewardPreview.tsx
│   └── SpendingModal.tsx
├── hooks/
│   ├── useCurrency.ts
│   ├── useInventory.ts
│   ├── useTransactions.ts
│   └── useRewards.ts
├── services/
│   ├── EconomyService.ts
│   ├── CurrencyService.ts
│   ├── InventoryService.ts
│   ├── RewardService.ts
│   └── EconomyValidator.ts
├── repositories/
│   ├── CurrencyRepository.ts
│   ├── InventoryRepository.ts
│   └── TransactionRepository.ts
├── stores/
│   └── economyStore.ts
├── types/
│   ├── currency.types.ts
│   ├── inventory.types.ts
│   ├── transaction.types.ts
│   ├── reward.types.ts
│   └── index.ts
├── pages/
│   └── InventoryPage.tsx
├── utils/
│   ├── currencyCalculations.ts
│   └── priceCalculations.ts
└── constants/
    ├── currencyConfig.ts
    └── rewardMultipliers.ts
```

### 6.2 Currencies Subdomain

```typescript
// types/economy/currency.types.ts
interface CurrencyBalance {
  playerId: string;
  currencies: Record<CurrencyType, number>;
}

type CurrencyType = 'coins' | 'gems' | 'energy' | 'time_shards';

interface CurrencyCost {
  type: CurrencyType;
  amount: number;
}

interface CurrencyTransaction {
  id: string;
  playerId: string;
  type: CurrencyType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reason: TransactionReason;
  createdAt: Date;
}
```

### 6.3 Inventory Subdomain

```typescript
// types/economy/inventory.types.ts
interface InventoryItem {
  id: string;
  playerId: string;
  itemDefId: string;
  quantity: number;
  acquiredAt: Date;
  expiresAt?: Date;
}

interface InventorySlot {
  index: number;
  itemId?: string;
  isLocked: boolean;
  unlockCost?: CurrencyCost;
}

interface InventoryState {
  playerId: string;
  items: InventoryItem[];
  slots: InventorySlot[];
  capacity: number;
  usedCapacity: number;
}
```

### 6.4 Rewards Subdomain

```typescript
// types/economy/reward.types.ts
interface Reward {
  type: RewardType;
  amount: number;
  metadata?: Record<string, unknown>;
}

type RewardType = 'coins' | 'gems' | 'energy' | 'artifact' | 'item' | 'experience';

interface RewardGrant {
  playerId: string;
  rewards: Reward[];
  source: RewardSource;
  transactionId: string;
}
```

---

## 7. Event Module Architecture

The Event Module manages time-limited events and seasonal content.

### 7.1 Module Structure

```
src/features/events/
├── components/
│   ├── EventCard.tsx
│   ├── EventList.tsx
│   ├── MissionTracker.tsx
│   ├── SeasonPassView.tsx
│   ├── EventLeaderboard.tsx
│   └── RewardPreview.tsx
├── hooks/
│   ├── useEvents.ts
│   ├── useMissions.ts
│   ├── useSeasonPass.ts
│   └── useEventLeaderboard.ts
├── services/
│   ├── EventService.ts
│   ├── MissionService.ts
│   ├── SeasonService.ts
│   ├── LeaderboardService.ts
│   └── EventValidator.ts
├── repositories/
│   ├── EventRepository.ts
│   ├── MissionRepository.ts
│   └── SeasonRepository.ts
├── stores/
│   └── eventStore.ts
├── types/
│   ├── event.types.ts
│   ├── mission.types.ts
│   ├── season.types.ts
│   ├── leaderboard.types.ts
│   └── index.ts
├── pages/
│   ├── EventsPage.tsx
│   └── SeasonPassPage.tsx
├── utils/
│   ├── eventCalculations.ts
│   └── leaderboardCalculations.ts
└── constants/
    ├── eventConfig.ts
    └── seasonRewards.ts
```

### 7.2 Events Subdomain

```typescript
// types/events/event.types.ts
interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  requirements: EventRequirement[];
  rewards: EventReward[];
  leaderboardEnabled: boolean;
  isActive: boolean;
}

type EventType = 'daily' | 'weekly' | 'seasonal' | 'special';

interface EventRequirement {
  type: RequirementType;
  value: number;
}
```

### 7.3 Missions Subdomain

```typescript
// types/events/mission.types.ts
interface Mission {
  id: string;
  eventId?: string;
  name: string;
  description: string;
  type: MissionType;
  requirement: MissionRequirement;
  rewards: Reward[];
  isCompleted: boolean;
  progress: number;
  expiresAt?: Date;
}

type MissionType = 'daily' | 'weekly' | 'event' | 'achievement';
```

### 7.4 Seasons Subdomain

```typescript
// types/events/season.types.ts
interface Season {
  id: string;
  number: number;
  name: string;
  startDate: Date;
  endDate: Date;
  battlePassId: string;
  isActive: boolean;
}

interface SeasonPass {
  seasonId: string;
  tiers: SeasonTier[];
  playerProgress: number;
  purchasedTier?: number;
}
```

---

## 8. PvP Module Architecture

The PvP Module manages competitive gameplay systems.

### 8.1 Module Structure

```
src/features/pvp/
├── components/
│   ├── BattleArena.tsx
│   ├── BattleCard.tsx
│   ├── RankingDisplay.tsx
│   ├── LeagueBadge.tsx
│   ├── MatchHistory.tsx
│   └── TournamentBracket.tsx
├── hooks/
│   ├── useBattle.ts
│   ├── useRankings.ts
│   ├── useLeagues.ts
│   └── useMatchHistory.ts
├── services/
│   ├── PvPService.ts
│   ├── BattleService.ts
│   ├── RankingService.ts
│   ├── TournamentService.ts
│   └── PvPValidator.ts
├── repositories/
│   ├── BattleRepository.ts
│   ├── RankingRepository.ts
│   └── TournamentRepository.ts
├── stores/
│   └── pvpStore.ts
├── types/
│   ├── battle.types.ts
│   ├── ranking.types.ts
│   ├── league.types.ts
│   ├── tournament.types.ts
│   └── index.ts
├── pages/
│   ├── ArenaPage.tsx
│   └── TournamentPage.tsx
├── utils/
│   ├── battleCalculations.ts
│   └── rankingCalculations.ts
└── constants/
    ├── leagueConfig.ts
    └── battleRewards.ts
```

### 8.2 Battles Subdomain

```typescript
// types/pvp/battle.types.ts
interface Battle {
  id: string;
  player1Id: string;
  player2Id: string;
  status: BattleStatus;
  winnerId?: string;
  startedAt: Date;
  endedAt?: Date;
  rounds: BattleRound[];
}

type BattleStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
```

### 8.3 Rankings Subdomain

```typescript
// types/pvp/ranking.types.ts
interface PlayerRanking {
  playerId: string;
  leagueId: string;
  division: number;
  rank: number;
  rating: number;
  wins: number;
  losses: number;
  streak: number;
}

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  rating: number;
  leagueId: string;
}
```

### 8.4 Leagues Subdomain

```typescript
// types/pvp/league.types.ts
interface League {
  id: string;
  name: string;
  tier: number;
  divisions: number[];
  minRating: number;
  maxRating: number;
  rewards: SeasonReward[];
}

type LeagueTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
```

---

## 9. Guild Module Architecture

The Guild Module manages social group functionality.

### 9.1 Module Structure

```
src/features/guilds/
├── components/
│   ├── GuildCard.tsx
│   ├── GuildHeader.tsx
│   ├── MemberList.tsx
│   ├── MemberCard.tsx
│   ├── GuildChat.tsx
│   ├── GuildActivity.tsx
│   └── CreateGuildModal.tsx
├── hooks/
│   ├── useGuild.ts
│   ├── useGuildMembers.ts
│   ├── useGuildActivities.ts
│   └── useGuildProgression.ts
├── services/
│   ├── GuildService.ts
│   ├── MemberService.ts
│   ├── GuildActivityService.ts
│   └── GuildValidator.ts
├── repositories/
│   ├── GuildRepository.ts
│   ├── MemberRepository.ts
│   └── ActivityRepository.ts
├── stores/
│   └── guildStore.ts
├── types/
│   ├── guild.types.ts
│   ├── member.types.ts
│   ├── activity.types.ts
│   ├── role.types.ts
│   └── index.ts
├── pages/
│   ├── GuildPage.tsx
│   └── GuildListPage.tsx
├── utils/
│   ├── guildCalculations.ts
│   └── permissionChecks.ts
└── constants/
    ├── guildConfig.ts
    └── guildPermissions.ts
```

### 9.2 Guild Management Subdomain

```typescript
// types/guilds/guild.types.ts
interface Guild {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  memberIds: string[];
  memberCount: number;
  maxMembers: number;
  level: number;
  experience: number;
  totalPower: number;
  createdAt: Date;
  isPublic: boolean;
  inviteCode?: string;
  bannerUrl?: string;
}
```

### 9.3 Members Subdomain

```typescript
// types/guilds/member.types.ts
interface GuildMember {
  userId: string;
  guildId: string;
  role: GuildRole;
  joinedAt: Date;
  contributedPower: number;
  lastActiveAt: Date;
  nickname?: string;
}

type GuildRole = 'leader' | 'officer' | 'member';
```

### 9.4 Activities Subdomain

```typescript
// types/guilds/activity.types.ts
interface GuildActivity {
  id: string;
  guildId: string;
  type: ActivityType;
  actorId: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

type ActivityType = 'member_joined' | 'member_left' | 'member_kicked' | 'role_changed' | 'guild_upgraded';
```

---

## 10. Marketplace Module Architecture

The Marketplace Module manages player-to-player trading.

### 10.1 Module Structure

```
src/features/marketplace/
├── components/
│   ├── ListingCard.tsx
│   ├── ListingGrid.tsx
│   ├── ListingDetails.tsx
│   ├── CreateListingModal.tsx
│   ├── PurchaseConfirmation.tsx
│   └── PriceHistory.tsx
├── hooks/
│   ├── useListings.ts
│   ├── useMarketplaceAnalytics.ts
│   └── useUserListings.ts
├── services/
│   ├── MarketplaceService.ts
│   ├── ListingService.ts
│   ├── PurchaseService.ts
│   └── MarketplaceValidator.ts
├── repositories/
│   ├── ListingRepository.ts
│   └── TransactionRepository.ts
├── stores/
│   └── marketplaceStore.ts
├── types/
│   ├── listing.types.ts
│   ├── purchase.types.ts
│   ├── analytics.types.ts
│   └── index.ts
├── pages/
│   ├── MarketplacePage.tsx
│   └── MyListingsPage.tsx
├── utils/
│   ├── priceCalculations.ts
│   └── listingHelpers.ts
└── constants/
    ├── marketplaceConfig.ts
    └── feeStructure.ts
```

### 10.2 Listings Subdomain

```typescript
// types/marketplace/listing.types.ts
interface Listing {
  id: string;
  sellerId: string;
  itemType: ItemType;
  itemId: string;
  price: CurrencyCost;
  status: ListingStatus;
  createdAt: Date;
  expiresAt?: Date;
  viewCount: number;
}

type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';
```

### 10.3 Purchases Subdomain

```typescript
// types/marketplace/purchase.types.ts
interface Purchase {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  price: CurrencyCost;
  status: PurchaseStatus;
  completedAt?: Date;
  createdAt: Date;
}

type PurchaseStatus = 'pending' | 'completed' | 'refunded' | 'disputed';
```

---

## 11. Shared Resource Philosophy

Not everything belongs inside a module. This section defines where resources should reside.

### 11.1 Resources Inside Modules

Each module should own:

- **Domain Logic:** All business rules specific to the module
- **Module State:** Zustand stores managing module state
- **Module Types:** Types that don't span multiple modules
- **Module Components:** Components that render only module data
- **Module Services:** Services implementing module business logic

### 11.2 Shared Globally

These resources should remain in shared directories:

| Resource | Location | Reason |
|----------|----------|--------|
| **UI Primitives** | `components/ui/` | Shared across all modules |
| **Layout Components** | `components/layout/` | Global app structure |
| **Base Hooks** | `hooks/` | Reusable React patterns |
| **Shared Types** | `types/shared/` | Cross-cutting type definitions |
| **Shared Utils** | `utils/` | Pure utility functions |
| **API Client** | `api/` | External communication |
| **Repository Base** | `repositories/` | Data access patterns |
| **Constants** | `constants/` | Global app constants |

### 11.3 Reusable Across Modules

Resources that can be used by multiple modules:

```typescript
// Shared components used by multiple modules
- Button, Input, Card, Modal
- CurrencyDisplay, ProgressBar, Badge
- LoadingSpinner, EmptyState, ErrorBoundary

// Shared hooks
- useDebounce, useLocalStorage, useQuery
- useAuth, useNotification

// Shared types
- Result<T, E>, PaginatedResult<T>
- CurrencyCost, Reward, EntityMetadata
```

---

## 12. Dependency Rules

Modules must follow strict dependency rules to maintain architecture integrity.

### 12.1 Allowed Dependencies

Modules may depend on:

| Dependency | Direction | Example |
|------------|-----------|---------|
| **Shared Resources** | Module → Shared | Import Button from components/ui |
| **Domain Types** | Module → Types | Import Player type |
| **Shared Utils** | Module → Utils | Import formatDate from utils |
| **Events/Callbacks** | Module → Module | Communicate via events |

### 12.2 Forbidden Dependencies

Modules must NOT:

- **Directly import** another module's stores
- **Call** another module's services directly
- **Access** another module's repositories
- **Render** another module's components

### 12.3 Inter-Module Communication

Modules communicate through:

```typescript
// Event-based communication
eventBus.emit('player:leveled_up', { playerId, newLevel });

// Service facade (via shared infrastructure)
const playerFacade = container.resolve('IPlayerService');

// Shared state (read-only)
const globalState = useGlobalStore();
```

### 12.4 Circular Dependency Prevention

Circular dependencies are prevented by:

| Pattern | Implementation |
|---------|---------------|
| **Hierarchical Imports** | Core → Domain → Feature |
| **Facade Pattern** | Modules expose facades, not internals |
| **Event Communication** | Decoupled via event bus |
| **Shared Contracts** | Depend on abstractions, not concretions |

---

## 13. Scaling Philosophy

The architecture supports growth from small to enterprise scale.

### 13.1 10 Modules (Current Scale)

At baseline feature count:

- **Structure:** All modules in `src/features/`
- **Shared:** Common utilities in `src/shared/`
- **Build:** Single bundle or simple code splitting
- **Team:** Small team, modules assigned by domain

### 13.2 50 Modules (Extended Scale)

As feature count grows:

- **Grouping:** Modules grouped by domain (social/, combat/, economy/)
- **Shared:** Domain-specific shared packages
- **Build:** Lazy loading per domain
- **Team:** Domain teams with module ownership

```
src/features/
├── core/          # Player, Economy, Settings
├── content/       # Museum, Events, Seasons
├── social/        # Guilds, Friends, Chat
├── combat/        # PvP, Battles, Tournaments
└── meta/          # Analytics, Admin, Config
```

### 13.3 100+ Modules (Enterprise Scale)

At maximum feature count:

- **Packages:** Modules as independent npm packages
- **Monorepo:** Shared code in packages/
- **Build:** Micro-frontends per domain
- **Team:** Platform teams with module contracts

```
packages/
├── @jolt/core/         # Shared infrastructure
├── @jolt/ui/           # Component library
├── @jolt/data/         # Data layer
├── features/
│   ├── @jolt/player/
│   ├── @jolt/museum/
│   └── ...
```

### 13.4 Scaling Triggers

| Metric | Warning | Action |
|--------|---------|--------|
| Modules > 20 | Review module boundaries | Consider grouping |
| Cross-module imports > 30% | Review coupling | Introduce events/facades |
| Build time > 5 min | Optimize code splitting | Consider monorepo packages |
| Team size > 50 | Domain team structure | Platform teams |

---

## 14. AdsGram Integration Notes

The AdsGram monetization system integrates across multiple modules.

### 14.1 Optional Monetization Hooks

Monetization hooks should be optional and non-blocking:

```typescript
// Module exports monetization hook (optional)
export function useMonetization() {
  const [watchAd, { loading }] = useAdsGramReward();
  
  return {
    watchAd,
    isLoading: loading,
    isAvailable: useFeatureFlag('monetization')
  };
}
```

### 14.2 Reward Integrations

Each module defines its reward integration point:

| Module | Reward Hook | Example |
|--------|-------------|---------|
| **Economy** | `useAdReward('currency')` | Double coins |
| **Events** | `useAdReward('skip')` | Skip event wait |
| **PvP** | `useAdReward('revive')` | Battle revival |

### 14.3 Monetization Analytics

Modules should track monetization-relevant events:

```typescript
// Track when module triggers ad opportunity
analytics.track('ad_opportunity', {
  module: 'economy',
  action: 'double_coins',
  playerLevel: player.level
});
```

### 14.4 Revenue Protection

Monetization integrity is protected by:

- **Validation Layer:** All reward claims validated server-side
- **AdsGram Types:** Strict type definitions for reward payloads
- **Callback Verification:** HMAC signature validation for all callbacks

---

## 15. Future Expansion Notes

The Feature Module system accommodates future business domains.

### 15.1 AI Module

Future AI-powered features:

```typescript
// features/ai/ (future)
- AICompanion: Interactive AI guide
- AIRecommendations: Personalized suggestions
- AIAnalytics: Advanced player insights
```

### 15.2 Creator Economy Module

Future UGC and creator features:

```typescript
// features/creator/ (future)
- ContentCreator: User-generated guides
- QuizBuilder: Custom quiz creation
- ArtSubmission: Community art integration
```

### 15.3 Web3 Module

Future blockchain features:

```typescript
// features/web3/ (future)
- WalletConnection: TON wallet integration
- NFTDisplay: NFT gallery and trading
- TokenExchange: In-game token swap
```

### 15.4 NFT Module

Future NFT-specific features:

```typescript
// features/nft/ (future)
- NFTInventory: Blockchain-based items
- NFTMarketplace: NFT trading
- NFTCollections: Achievement NFTs
```

### 15.5 Esports Module

Future competitive features:

```typescript
// features/esports/ (future)
- TournamentOrganizer: Bracket management
- TeamBuilder: Team formation
- SpectatorMode: Live match viewing
```

### 15.6 LiveOps Module

Future operational features:

```typescript
// features/liveops/ (future)
- EventScheduler: Live event management
- FeatureFlags: Gradual rollouts
- ABTesting: Experiment management
```

---

## 16. Long-Term Philosophy

The Feature Module system embodies principles for sustainable project growth.

### 16.1 Simplified Development

Modules enable parallel development:

- Teams work on different modules simultaneously
- Clear ownership reduces coordination overhead
- Well-defined interfaces enable confident changes

### 16.2 Improved Maintainability

Modular code is easier to maintain:

- Changes are isolated to affected modules
- Testing is focused and fast
- Bug fixes don't introduce regressions elsewhere

### 16.3 Reduced Complexity

Small, focused modules reduce cognitive load:

- Developers understand one module at a time
- Onboarding is easier with clear boundaries
- Code navigation is intuitive

### 16.4 Support Long-Term Growth

The architecture anticipates growth:

- New modules don't require restructuring
- Scaling paths are well-defined
- Technical debt is contained

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `.openhands/knowledge/folder-architecture.md` | Folder structure standards |
| `.openhands/knowledge/shared-types.md` | Type organization across modules |
| `.openhands/knowledge/validation-layer.md` | Validation patterns |
| `.openhands/knowledge/adsgram.md` | AdsGram monetization |
| `.openhands/knowledge/economy.md` | Economy system details |

---

*Last Updated: 2026-06-25*
