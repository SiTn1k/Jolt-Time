# Repository Pattern Architecture

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Status:** Architecture Specification

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Philosophy](#repository-philosophy)
3. [Repository Categories](#repository-categories)
4. [Folder Structure](#folder-structure)
5. [Player Repository Architecture](#player-repository-architecture)
6. [Economy Repository Architecture](#economy-repository-architecture)
7. [Museum Repository Architecture](#museum-repository-architecture)
8. [Event Repository Architecture](#event-repository-architecture)
9. [PvP Repository Architecture](#pvp-repository-architecture)
10. [Social Repository Architecture](#social-repository-architecture)
11. [Analytics Repository Architecture](#analytics-repository-architecture)
12. [Data Access Rules](#data-access-rules)
13. [Repository Interface Philosophy](#repository-interface-philosophy)
14. [Error Handling Standards](#error-handling-standards)
15. [Caching Philosophy](#caching-philosophy)
16. [Testing Philosophy](#testing-philosophy)
17. [Future Expansion Notes](#future-expansion-notes)
18. [Long-Term Philosophy](#long-term-philosophy)

---

## Overview

The Repository Pattern establishes Jolt Time's **Data Access Layer** — the exclusive pathway for all database operations. This architectural decision ensures complete isolation between business logic and data persistence, enabling maintainability, testability, and future scalability.

### Core Principle

```
Components → Hooks → Services → Repositories → Supabase
```

**Rule:** Services MUST NEVER communicate directly with Supabase. All database operations MUST pass through repositories.

---

## Repository Philosophy

### Encapsulation of Data Access

Repositories encapsulate all data retrieval and persistence logic:

- **Single Responsibility:** Each repository handles one domain of data
- **Implementation Hiding:** Services remain unaware of database structure
- **Query Abstraction:** Complex queries are wrapped in meaningful methods
- **Data Transformation:** Raw database rows are mapped to domain objects

### Independence from Business Logic

Repositories operate independently of how data is used:

| Repository Focus | Service Focus |
|-----------------|---------------|
| Data persistence | Business rules |
| Query optimization | User interactions |
| Database structure | Game mechanics |
| Index management | Validation logic |

### Database Implementation Isolation

Repositories shield the application from database concerns:

- **Table Changes:** Only repositories need updating when schema changes
- **Query Performance:** Optimization happens without affecting services
- **Database Migration:** Repositories abstract migration complexity
- **Multi-Database Support:** Future database changes are facilitated

---

## Repository Categories

### Category Overview

| Category | Repositories | Domain |
|----------|-------------|--------|
| **Player** | Profile, Statistics, Settings, Progression | Player identity and state |
| **Economy** | Currency, Inventory, Transaction, Marketplace | In-game economy |
| **Museum** | Artifact, Collection, Museum, Exhibition | Museum and artifacts |
| **Events** | Event, Mission, Reward, Season | Event systems |
| **PvP** | Battle, Tournament, Ranking, Matchmaking | Competitive gameplay |
| **Social** | Friend, Guild, Leaderboard, Chat | Social features |
| **Analytics** | Analytics, Retention, Monetization | Data and metrics |

### Category Responsibilities

#### Player Repositories
Manage player identity, preferences, and progression data.

#### Economy Repositories
Handle currency flows, inventory management, and marketplace operations.

#### Museum Repositories
Control artifact data, collection tracking, and museum displays.

#### Event Repositories
Manage event lifecycle, missions, rewards, and seasonal content.

#### PvP Repositories
Handle competitive matches, rankings, and tournament brackets.

#### Social Repositories
Manage friend relationships, guilds, leaderboards, and communication.

#### Analytics Repositories
Track player behavior, retention metrics, and monetization data.

---

## Folder Structure

### Repository Directory Architecture

```
src/
└── repositories/
    ├── index.ts                      # Repository exports and factory
    ├── base/
    │   ├── BaseRepository.ts         # Abstract base class
    │   ├── RepositoryInterface.ts    # Core interface definitions
    │   └── types.ts                  # Shared repository types
    ├── player/
    │   ├── index.ts
    │   ├── ProfileRepository.ts
    │   ├── StatisticsRepository.ts
    │   ├── SettingsRepository.ts
    │   └── ProgressionRepository.ts
    ├── economy/
    │   ├── index.ts
    │   ├── CurrencyRepository.ts
    │   ├── InventoryRepository.ts
    │   ├── TransactionRepository.ts
    │   └── MarketplaceRepository.ts
    ├── museum/
    │   ├── index.ts
    │   ├── ArtifactRepository.ts
    │   ├── CollectionRepository.ts
    │   ├── MuseumRepository.ts
    │   └── ExhibitionRepository.ts
    ├── events/
    │   ├── index.ts
    │   ├── EventRepository.ts
    │   ├── MissionRepository.ts
    │   ├── RewardRepository.ts
    │   └── SeasonRepository.ts
    ├── pvp/
    │   ├── index.ts
    │   ├── BattleRepository.ts
    │   ├── TournamentRepository.ts
    │   ├── RankingRepository.ts
    │   └── MatchmakingRepository.ts
    ├── social/
    │   ├── index.ts
    │   ├── FriendRepository.ts
    │   ├── GuildRepository.ts
    │   ├── LeaderboardRepository.ts
    │   └── ChatRepository.ts
    ├── analytics/
    │   ├── index.ts
    │   ├── AnalyticsRepository.ts
    │   ├── RetentionRepository.ts
    │   ├── MonetizationRepository.ts
    │   └── AdsRepository.ts
    └── infrastructure/
        ├── cache/
        │   ├── CacheStrategy.ts
        │   ├── LocalCache.ts
        │   ├── MemoryCache.ts
        │   └── DistributedCache.ts
        └── SupabaseClient.ts
```

### Migration from Current Location

**Current Location:**
```
src/services/{Name}Repository.ts
```

**Target Location:**
```
src/repositories/{category}/{Name}Repository.ts
```

**Example Migration:**
```
src/services/DailyRewardRepository.ts → src/repositories/events/DailyRewardRepository.ts
src/services/EnergyRepository.ts → src/repositories/economy/EnergyRepository.ts
src/services/AdRepository.ts → src/repositories/analytics/AdsRepository.ts
```

---

## Player Repository Architecture

### ProfileRepository

**Purpose:** Manage player profile data and identity information.

**Database Tables:**
- `users`
- `player_profiles`
- `telegram_users`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getProfile(userId)` | `PlayerProfile \| null` | Get player profile |
| `createProfile(data)` | `PlayerProfile` | Create new profile |
| `updateProfile(userId, data)` | `boolean` | Update profile fields |
| `getProfileByTelegramId(telegramId)` | `PlayerProfile \| null` | Find by Telegram ID |
| `searchProfiles(query, options)` | `PlayerProfile[]` | Search profiles |
| `deleteProfile(userId)` | `boolean` | Soft delete profile |

**Data Contract:**
```typescript
interface PlayerProfile {
  id: string;
  telegramId: string;
  username?: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}
```

---

### StatisticsRepository

**Purpose:** Track and retrieve player statistics across all game systems.

**Database Tables:**
- `player_statistics`
- `game_statistics`
- `lifetime_statistics`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getStatistics(userId)` | `PlayerStatistics` | Get all statistics |
| `getStatistic(userId, key)` | `number` | Get specific stat |
| `incrementStatistic(userId, key, amount)` | `boolean` | Increment stat value |
| `resetStatistics(userId)` | `boolean` | Reset to defaults |
| `getStatisticsHistory(userId, options)` | `StatisticHistory[]` | Historical data |
| `bulkUpdateStatistics(userId, updates)` | `boolean` | Batch update |

**Data Contract:**
```typescript
interface PlayerStatistics {
  userId: string;
  totalPlayTime: number;
  totalEnergySpent: number;
  totalEnergyRestored: number;
  artifactsCollected: number;
  artifactsEvolved: number;
  missionsCompleted: number;
  pvpMatchesPlayed: number;
  pvpMatchesWon: number;
  friendsAdded: number;
  guildsJoined: number;
  eventsParticipated: number;
  adsWatched: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  updatedAt: Date;
}
```

---

### SettingsRepository

**Purpose:** Manage player preferences and application settings.

**Database Tables:**
- `user_settings`
- `notification_preferences`
- `privacy_settings`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getSettings(userId)` | `UserSettings` | Get all settings |
| `updateSettings(userId, settings)` | `boolean` | Update settings |
| `getNotificationPreferences(userId)` | `NotificationPreferences` | Get notifications |
| `updateNotificationPreferences(userId, prefs)` | `boolean` | Update notifications |
| `resetToDefaults(userId)` | `boolean` | Reset all settings |
| `getPrivacySettings(userId)` | `PrivacySettings` | Get privacy config |

---

### ProgressionRepository

**Purpose:** Track player progression through levels, eras, and milestones.

**Database Tables:**
- `player_progression`
- `era_progress`
- `milestone_completions`
- `achievement_progress`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getProgression(userId)` | `PlayerProgression` | Get full progression |
| `getEraProgress(userId, eraId)` | `EraProgress` | Get era-specific progress |
| `advanceEra(userId, eraId)` | `boolean` | Mark era complete |
| `getMilestones(userId, category?)` | `Milestone[]` | Get milestones |
| `completeMilestone(userId, milestoneId)` | `boolean` | Mark milestone done |
| `getAchievements(userId)` | `Achievement[]` | Get achievements |

---

## Economy Repository Architecture

### CurrencyRepository

**Purpose:** Manage player currency balances and operations.

**Database Tables:**
- `user_currencies`
- `currency_transactions`
- `currency_ledger`

**Responsibilities:**
- Store currency balances (coins, gems, time shards)
- Record all currency movements
- Maintain transaction history
- Handle currency grants and deductions

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getBalance(userId, currencyType)` | `number` | Get currency balance |
| `getAllBalances(userId)` | `CurrencyBalances` | Get all balances |
| `addCurrency(userId, type, amount, context)` | `boolean` | Add currency |
| `deductCurrency(userId, type, amount, context)` | `boolean` | Remove currency |
| `transferCurrency(from, to, type, amount)` | `boolean` | Transfer between users |
| `getTransactionHistory(userId, options)` | `Transaction[]` | History with filters |

**Data Contract:**
```typescript
interface CurrencyTransaction {
  id: string;
  userId: string;
  currencyType: 'coins' | 'gems' | 'time_shards' | 'energy';
  amount: number;
  balanceAfter: number;
  transactionType: 'grant' | 'deduct' | 'transfer' | 'refund';
  context: string;
  relatedEntityId?: string;
  createdAt: Date;
}
```

---

### InventoryRepository

**Purpose:** Manage player inventory items and storage.

**Database Tables:**
- `user_inventory`
- `inventory_items`
- `item_metadata`

**Responsibilities:**
- Store owned items and quantities
- Track item acquisition and removal
- Manage inventory limits and expansion
- Handle item stacking and bundling

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getInventory(userId)` | `InventoryItem[]` | Get all items |
| `getItem(userId, itemId)` | `InventoryItem \| null` | Get specific item |
| `addItem(userId, itemId, quantity)` | `boolean` | Add to inventory |
| `removeItem(userId, itemId, quantity)` | `boolean` | Remove from inventory |
| `hasItem(userId, itemId, quantity?)` | `boolean` | Check item ownership |
| `updateItemMetadata(userId, itemId, metadata)` | `boolean` | Update item data |
| `getInventoryByCategory(userId, category)` | `InventoryItem[]` | Filter by category |

---

### TransactionRepository

**Purpose:** Record and query economic transactions for audit and analytics.

**Database Tables:**
- `economy_transactions`
- `marketplace_transactions`
- `trade_history`

**Responsibilities:**
- Create immutable transaction records
- Support financial auditing
- Enable economic analytics
- Track trade and marketplace activity

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `recordTransaction(data)` | `string` | Create transaction record |
| `getTransactions(userId, options)` | `Transaction[]` | Query with filters |
| `getTransactionById(id)` | `Transaction \| null` | Lookup specific |
| `verifyTransactionIntegrity(txId)` | `boolean` | Audit verification |
| `getPendingTransactions(userId)` | `Transaction[]` | Incomplete transactions |
| `finalizeTransaction(txId)` | `boolean` | Mark complete |

---

### MarketplaceRepository

**Purpose:** Handle marketplace listings, offers, and trade operations.

**Database Tables:**
- `marketplace_listings`
- `marketplace_offers`
- `marketplace_history`

**Responsibilities:**
- Manage item listings
- Process offers and bids
- Handle transaction completion
- Enforce marketplace rules

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `createListing(userId, itemId, price)` | `string` | Create listing |
| `cancelListing(listingId)` | `boolean` | Cancel listing |
| `getListing(listingId)` | `Listing \| null` | Get listing details |
| `searchListings(query, filters)` | `Listing[]` | Find listings |
| `getUserListings(userId)` | `Listing[]` | User's active listings |
| `createOffer(listingId, buyerId, amount)` | `string` | Place offer |
| `acceptOffer(offerId)` | `boolean` | Accept offer |
| `completeTransaction(listingId)` | `boolean` | Finalize sale |

---

## Museum Repository Architecture

### ArtifactRepository

**Purpose:** Manage artifact data, acquisition, and properties.

**Database Tables:**
- `artifacts`
- `artifact_variants`
- `user_artifacts`

**Responsibilities:**
- Store artifact definitions
- Track user artifact ownership
- Manage artifact evolution and upgrades
- Handle artifact rarity and tier data

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getArtifact(artifactId)` | `Artifact \| null` | Get artifact definition |
| `getArtifactBySlug(slug)` | `Artifact \| null` | Find by URL slug |
| `getUserArtifacts(userId)` | `UserArtifact[]` | User's artifacts |
| `acquireArtifact(userId, artifactId)` | `boolean` | Add to collection |
| `evolveArtifact(userId, artifactId, targetTier)` | `boolean` | Upgrade artifact |
| `getArtifactStats(artifactId)` | `ArtifactStats` | Statistics data |
| `searchArtifacts(query, filters)` | `Artifact[]` | Search catalog |

---

### CollectionRepository

**Purpose:** Track artifact collections and completion status.

**Database Tables:**
- `artifact_collections`
- `collection_requirements`
- `user_collection_progress`

**Responsibilities:**
- Define collection groupings
- Track completion percentage
- Award collection bonuses
- Manage set bonuses

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getCollections()` | `Collection[]` | All collections |
| `getCollection(collectionId)` | `Collection \| null` | Specific collection |
| `getUserCollectionProgress(userId, collectionId)` | `CollectionProgress` | Progress tracking |
| `getUserCompletedCollections(userId)` | `string[]` | Completed IDs |
| `checkCollectionCompletion(userId, collectionId)` | `boolean` | Completion status |
| `awardCollectionBonus(userId, collectionId)` | `boolean` | Grant rewards |

---

### MuseumRepository

**Purpose:** Manage museum display configuration and user museum state.

**Database Tables:**
- `museums`
- `museum_displays`
- `user_museums`
- `display_slots`

**Responsibilities:**
- Store museum layouts
- Track display configurations
- Manage exhibition slots
- Handle museum expansion

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getMuseum(museumId)` | `Museum \| null` | Get museum data |
| `getUserMuseum(userId)` | `UserMuseum` | User's museum |
| `updateDisplay(userId, slotId, artifactId)` | `boolean` | Place artifact |
| `getDisplaySlots(userId)` | `DisplaySlot[]` | All slots |
| `expandMuseum(userId, direction)` | `boolean` | Add display area |
| `getDisplayConfiguration(userId)` | `DisplayConfig` | Full layout |
| `saveDisplayConfiguration(userId, config)` | `boolean` | Persist layout |

---

### ExhibitionRepository

**Purpose:** Handle time-limited exhibitions and special displays.

**Database Tables:**
- `exhibitions`
- `exhibition_artifacts`
- `user_exhibition_visits`

**Responsibilities:**
- Manage exhibition lifecycle
- Track special artifact displays
- Record visitor interactions
- Handle exhibition rewards

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getActiveExhibitions()` | `Exhibition[]` | Current exhibitions |
| `getExhibition(exhibitionId)` | `Exhibition \| null` | Exhibition details |
| `visitExhibition(userId, exhibitionId)` | `boolean` | Record visit |
| `getExhibitionArtifacts(exhibitionId)` | `Artifact[]` | Featured artifacts |
| `hasVisitedExhibition(userId, exhibitionId)` | `boolean` | Visit check |
| `getExhibitionRewards(userId, exhibitionId)` | `Reward[]` | Available rewards |

---

## Event Repository Architecture

### EventRepository

**Purpose:** Manage event definitions, scheduling, and lifecycle.

**Database Tables:**
- `events`
- `event_schedule`
- `event_participation`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getEvent(eventId)` | `Event \| null` | Get event data |
| `getActiveEvents()` | `Event[]` | Currently running |
| `getUpcomingEvents(limit?)` | `Event[]` | Future events |
| `getEventsByType(type)` | `Event[]` | Filter by type |
| `createEvent(data)` | `string` | New event |
| `updateEvent(eventId, data)` | `boolean` | Modify event |
| `participate(userId, eventId)` | `boolean` | Join event |
| `getParticipantCount(eventId)` | `number` | Participation stats |

---

### MissionRepository

**Purpose:** Track missions, objectives, and completion status.

**Database Tables:**
- `missions`
- `mission_objectives`
- `user_mission_progress`
- `user_objective_completion`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getMission(missionId)` | `Mission \| null` | Get mission |
| `getUserMissions(userId, status?)` | `UserMission[]` | User's missions |
| `getMissionProgress(userId, missionId)` | `MissionProgress` | Progress data |
| `updateObjectiveProgress(userId, objectiveId, value)` | `boolean` | Track progress |
| `completeObjective(userId, objectiveId)` | `boolean` | Mark complete |
| `claimMissionReward(userId, missionId)` | `Reward[]` | Receive rewards |
| `getAvailableMissions(userId)` | `Mission[]` | Completable missions |

---

### RewardRepository

**Purpose:** Handle reward definitions, calculation, and distribution.

**Database Tables:**
- `rewards`
- `reward_pools`
- `reward_history`
- `reward_claims`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getReward(rewardId)` | `Reward \| null` | Get reward definition |
| `calculateReward(rewardId, context)` | `RewardResult` | Compute reward value |
| `distributeReward(userId, rewardId, context)` | `boolean` | Grant to user |
| `claimReward(userId, claimId)` | `Reward[]` | Claim pending reward |
| `getClaimableRewards(userId)` | `RewardClaim[]` | Available claims |
| `getRewardHistory(userId, options)` | `RewardHistory[]` | Distribution history |
| `getPoolRewards(poolId)` | `Reward[]` | Pool contents |

---

### SeasonRepository

**Purpose:** Manage seasonal content, battle passes, and season progression.

**Database Tables:**
- `seasons`
- `season_tiers`
- `user_season_progress`
- `season_rewards`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getCurrentSeason()` | `Season \| null` | Active season |
| `getSeason(seasonId)` | `Season \| null` | Season data |
| `getSeasonTiers(seasonId)` | `SeasonTier[]` | All tiers |
| `getUserSeasonProgress(userId, seasonId)` | `SeasonProgress` | User's progress |
| `addSeasonExperience(userId, seasonId, xp)` | `boolean` | Award XP |
| `claimSeasonReward(userId, seasonId, tierId)` | `Reward[]` | Claim tier reward |
| `getSeasonLeaderboard(seasonId, limit?)` | `LeaderboardEntry[]` | Rankings |

---

## PvP Repository Architecture

### BattleRepository

**Purpose:** Manage PvP battle records, matchmaking, and combat history.

**Database Tables:**
- `pvp_battles`
- `battle_participants`
- `battle_reports`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `createBattle(data)` | `string` | New battle record |
| `getBattle(battleId)` | `Battle \| null` | Battle details |
| `getUserBattleHistory(userId, options)` | `Battle[]` | User's battles |
| `updateBattleResult(battleId, result)` | `boolean` | Record outcome |
| `getBattleReport(battleId)` | `BattleReport` | Detailed report |
| `getRecentOpponents(userId, limit?)` | `string[]` | Recent matchups |

---

### TournamentRepository

**Purpose:** Handle tournament brackets, entries, and progression.

**Database Tables:**
- `tournaments`
- `tournament_brackets`
- `tournament_entries`
- `tournament_matches`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getTournament(tournamentId)` | `Tournament \| null` | Tournament data |
| `getActiveTournaments()` | `Tournament[]` | Open tournaments |
| `registerEntry(userId, tournamentId)` | `string` | Join tournament |
| `getUserEntries(userId)` | `TournamentEntry[]` | User's entries |
| `getBracket(tournamentId)` | `Bracket` | Tournament bracket |
| `recordMatchResult(matchId, result)` | `boolean` | Update bracket |
| `getTournamentLeaderboard(tournamentId)` | `LeaderboardEntry[]` | Rankings |

---

### RankingRepository

**Purpose:** Track player rankings, ratings, and league standings.

**Database Tables:**
- `player_rankings`
- `ranking_history`
- `league_divisions`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getPlayerRanking(userId)` | `Ranking` | Current ranking |
| `getRankings(league?, limit?)` | `Ranking[]` | Leaderboard |
| `updateRanking(userId, newRating)` | `boolean` | Rating change |
| `getRankingHistory(userId, season?)` | `RankingHistory[]` | Historical ranks |
| `getLeagueDivisions()` | `Division[]` | All divisions |
| `promoteUser(userId)` | `boolean` | League promotion |
| `demoteUser(userId)` | `boolean` | League demotion |

---

### MatchmakingRepository

**Purpose:** Handle match finding, queue management, and opponent selection.

**Database Tables:**
- `matchmaking_queue`
- `matchmaking_history`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `joinQueue(userId, preferences)` | `string` | Enter matchmaking |
| `leaveQueue(userId)` | `boolean` | Exit matchmaking |
| `findMatch(userId)` | `Match \| null` | Find opponent |
| `getQueuePosition(userId)` | `number` | Position in queue |
| `getMatchmakingHistory(userId)` | `MatchmakingRecord[]` | Past matches |
| `cancelPendingMatches(userId)` | `number` | Cancel all |

---

## Social Repository Architecture

### FriendRepository

**Purpose:** Manage friend relationships and social connections.

**Database Tables:**
- `friendships`
- `friend_requests`
- `blocked_users`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getFriends(userId)` | `Friend[]` | User's friends |
| `getPendingRequests(userId)` | `FriendRequest[]` | Incoming requests |
| `sendFriendRequest(fromId, toId)` | `string` | Send request |
| `acceptFriendRequest(requestId)` | `boolean` | Accept request |
| `rejectFriendRequest(requestId)` | `boolean` | Decline request |
| `removeFriend(userId, friendId)` | `boolean` | Remove friendship |
| `blockUser(userId, blockedId)` | `boolean` | Block user |
| `unblockUser(userId, blockedId)` | `boolean` | Unblock user |
| `isBlocked(userId, otherId)` | `boolean` | Check block status |

---

### GuildRepository

**Purpose:** Handle guilds, memberships, and guild management.

**Database Tables:**
- `guilds`
- `guild_members`
- `guild_applications`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getGuild(guildId)` | `Guild \| null` | Guild data |
| `createGuild(data)` | `string` | Create guild |
| `updateGuild(guildId, data)` | `boolean` | Modify guild |
| `getGuildMembers(guildId)` | `GuildMember[]` | Member list |
| `getUserGuild(userId)` | `GuildMembership \| null` | User's guild |
| `joinGuild(userId, guildId)` | `boolean` | Become member |
| `leaveGuild(userId)` | `boolean` | Depart guild |
| `getGuildApplications(userId)` | `Application[]` | Pending applications |
| `approveApplication(applicationId)` | `boolean` | Accept applicant |

---

### LeaderboardRepository

**Purpose:** Manage global and social leaderboards.

**Database Tables:**
- `leaderboards`
- `leaderboard_entries`
- `leaderboard_snapshots`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getLeaderboard(boardId, options?)` | `LeaderboardEntry[]` | Get rankings |
| `getUserRank(userId, boardId)` | `number` | User's position |
| `updateScore(userId, boardId, score)` | `boolean` | Update entry |
| `getFriendsLeaderboard(userId, boardId)` | `LeaderboardEntry[]` | Friends only |
| `getGuildLeaderboard(guildId, boardId)` | `LeaderboardEntry[]` | Guild rankings |
| `getLeaderboardSnapshot(boardId, date)` | `LeaderboardEntry[]` | Historical data |
| `createLeaderboard(boardId, config)` | `boolean` | New leaderboard |

---

### ChatRepository

**Purpose:** Handle guild chat and social messaging.

**Database Tables:**
- `guild_chat_messages`
- `direct_messages`
- `chat_attachments`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getChatHistory(chatId, options)` | `Message[]` | Message history |
| `sendMessage(chatId, senderId, content)` | `string` | Post message |
| `deleteMessage(messageId)` | `boolean` | Remove message |
| `editMessage(messageId, content)` | `boolean` | Modify message |
| `reactToMessage(messageId, userId, emoji)` | `boolean` | Add reaction |
| `getUnreadCount(userId, chatId)` | `number` | Unread messages |
| `markAsRead(userId, chatId, messageId)` | `boolean` | Update read status |

---

## Analytics Repository Architecture

### AnalyticsRepository

**Purpose:** Central repository for general analytics data collection and retrieval.

**Database Tables:**
- `analytics_events`
- `analytics_sessions`
- `analytics_user_activity`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `logEvent(data)` | `string` | Record analytics event |
| `logSession(sessionData)` | `string` | Session start/end |
| `getEvents(userId, options)` | `AnalyticsEvent[]` | Query events |
| `getSessionData(sessionId)` | `SessionData \| null` | Session details |
| `getUserActivitySummary(userId, period)` | `ActivitySummary` | Activity metrics |
| `getGlobalMetrics(startDate, endDate)` | `GlobalMetrics` | Aggregate data |

---

### RetentionRepository

**Purpose:** Track player retention, engagement, and churn metrics.

**Database Tables:**
- `user_retention_metrics`
- `cohort_analytics`
- `churn_predictions`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `recordLogin(userId, date)` | `boolean` | Track login |
| `getRetentionCohort(cohortDate)` | `RetentionData` | Cohort retention |
| `getUserRetentionScore(userId)` | `number` | Churn probability |
| `getD1Retention(date)` | `number` | Day 1 retention |
| `getD7Retention(date)` | `number` | Day 7 retention |
| `getD30Retention(date)` | `number` | Day 30 retention |
| `getEngagementScore(userId)` | `number` | Engagement metric |
| `getInactiveUsers(thresholdDays)` | `string[]` | At-risk users |

---

### MonetizationRepository

**Purpose:** Handle monetization tracking, purchases, and revenue analytics.

**Database Tables:**
- `purchase_transactions`
- `revenue_analytics`
- `premium_subscriptions`

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `recordPurchase(data)` | `string` | Log purchase |
| `getPurchases(userId)` | `Purchase[]` | User purchases |
| `getRevenueByDate(startDate, endDate)` | `RevenueData[]` | Daily revenue |
| `getAverageRevenuePerUser(date)` | `number` | ARPU |
| `getConversionRate(date)` | `number` | Pay user percentage |
| `getLifetimeValue(userId)` | `number` | LTV estimate |
| `getPremiumUsers(date?)` | `number` | Subscriber count |

---

### AdsRepository

**Purpose:** Manage AdsGram integration data, ad views, and advertising analytics.

**Database Tables:**
- `ads_views`
- `ads_statistics`
- `user_ad_settings`

**Responsibilities:**
- Record ad view events
- Track revenue from AdsGram
- Manage user ad preferences
- Aggregate advertising metrics

**Core Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `recordAdView(data)` | `string` | Log ad view |
| `getAdViews(userId, options)` | `AdView[]` | User's ad history |
| `getDailyAdCount(userId, date)` | `number` | Daily limit check |
| `getAdsStatistics(startDate, endDate)` | `AdsStatistics` | Aggregated stats |
| `getUserAdSettings(userId)` | `UserAdSettings` | Preferences |
| `updateUserAdSettings(userId, settings)` | `boolean` | Save preferences |
| `getRevenueEstimates(options)` | `RevenueEstimate[]` | Revenue breakdown |
| `getAdsPerformanceByType()` | `PerformanceByType` | Category metrics |

**AdsGram Integration:**
```typescript
interface AdsGramMetrics {
  totalViews: number;
  uniqueViewers: number;
  estimatedRevenue: number;
  averageECPM: number;
  viewsByDay: Record<string, number>;
  revenueByDay: Record<string, number>;
  topPerformingCategories: AdCategory[];
}
```

---

## Data Access Rules

### Supabase Tables

Repositories interact with tables through consistent patterns:

| Pattern | Usage |
|---------|-------|
| `select()` | Read operations with filtering |
| `insert()` | Create new records |
| `update()` | Modify existing records |
| `upsert()` | Create or update |
| `delete()` | Remove records (soft delete preferred) |

**Example Pattern:**
```typescript
// Repository method
async getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await this.supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return this.mapProfile(data);
}
```

### RPC Functions

Repositories may call RPC functions for complex operations:

```typescript
// Complex business logic via RPC
async executeComplexOperation(userId: string, params: ComplexParams): Promise<Result> {
  const { data, error } = await this.supabase
    .rpc('execute_complex_operation', {
      p_user_id: userId,
      p_params: params
    });

  if (error) {
    throw new RepositoryError('Operation failed', error);
  }

  return data;
}
```

### Edge Functions

External operations use Edge Functions:

```typescript
// External API calls via Edge Function
async fetchExternalData(endpoint: string): Promise<ExternalData> {
  const { data, error } = await this.supabase.functions
    .invoke('fetch-external', {
      body: { endpoint }
    });

  if (error) {
    throw new RepositoryError('External fetch failed', error);
  }

  return data;
}
```

### Realtime Systems

Repositories support Realtime subscriptions for live updates:

```typescript
// Subscribe to changes
subscribeToChanges(userId: string, callback: (change) => void): () => void {
  return this.supabase
    .channel(`user-${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_data',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}
```

---

## Repository Interface Philosophy

### Predictable Methods

All repositories follow consistent method signatures:

```typescript
interface BaseRepository<T, CreateInput, UpdateInput> {
  // Primary CRUD
  getById(id: string): Promise<T | null>;
  create(input: CreateInput): Promise<T>;
  update(id: string, input: UpdateInput): Promise<T | null>;
  delete(id: string): Promise<boolean>;

  // Bulk operations
  getMany(ids: string[]): Promise<T[]>;
  createMany(inputs: CreateInput[]): Promise<T[]>;
  deleteMany(ids: string[]): Promise<number>;

  // Queries
  findBy(options: QueryOptions): Promise<T[]>;
  exists(id: string): Promise<boolean>;
}
```

### Consistent Return Types

| Operation | Return Type | Null Handling |
|-----------|-------------|---------------|
| Get single | `T \| null` | Return null if not found |
| Get many | `T[]` | Return empty array |
| Create | `T` | Throw on failure |
| Update | `T \| null` | Return null if not found |
| Delete | `boolean` | Return false if not found |
| Count | `number` | Return 0 on error |

### Standardized Data Contracts

All domain objects follow TypeScript interfaces:

```typescript
interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: RepositoryError;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

---

## Error Handling Standards

### Error Types

```typescript
// Repository-specific error types
class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

class NotFoundError extends RepositoryError {
  constructor(entity: string, id: string) {
    super(
      `${entity} not found: ${id}`,
      'NOT_FOUND',
      undefined,
      { entity, id }
    );
  }
}

class ValidationError extends RepositoryError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', undefined, context);
  }
}

class ConcurrencyError extends RepositoryError {
  constructor(entity: string, id: string) {
    super(
      `Concurrent modification detected for ${entity}: ${id}`,
      'CONCURRENCY_ERROR',
      undefined,
      { entity, id }
    );
  }
}
```

### Error Handling Pattern

```typescript
async getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new RepositoryError(
        'Failed to fetch profile',
        'FETCH_ERROR',
        error,
        { userId }
      );
    }

    return this.mapProfile(data);
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error;
    }
    throw new RepositoryError(
      'Unexpected error fetching profile',
      'UNKNOWN',
      error as Error,
      { userId }
    );
  }
}
```

### Response Normalization

Repositories normalize all database responses:

| Database Response | Repository Response |
|-------------------|-------------------|
| `{ data, error }` with error | Throw `RepositoryError` or return null |
| `{ data: null }` | Return null |
| `{ data: [...] }` empty | Return `[]` |
| `{ data: [...] }` with items | Return mapped items |
| `{ count }` | Return `count \|\| 0` |

---

## Caching Philosophy

### Caching Architecture

Repositories support future caching implementations:

```
┌─────────────┐
│   Service   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Repository │──────┐
└──────┬──────┘      │
       │             ▼
       │      ┌─────────────┐
       │      │ Cache Layer  │
       │      └──────┬──────┘
       │             │
       ▼             ▼
┌─────────────┐
│   Supabase   │
└─────────────┘
```

### Cache Strategy Interface

```typescript
interface CacheStrategy<T> {
  // Cache operations
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;

  // Cache-aside pattern
  getOrSet(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
}
```

### Local Cache Support

Future browser localStorage caching:

```typescript
interface LocalCacheOptions {
  storageKey: string;
  serialize: <T>(value: T) => string;
  deserialize: <T>(value: string) => T;
  maxSize: number;
}
```

### Memory Cache Support

In-memory caching for session data:

```typescript
interface MemoryCacheOptions {
  maxSize: number;
  ttl: number;
  evictionPolicy: 'lru' | 'fifo' | 'lfu';
}
```

### Distributed Cache Support

Future Redis or similar distributed caching:

```typescript
interface DistributedCacheOptions {
  connectionString: string;
  keyPrefix: string;
  defaultTtl: number;
  retryAttempts: number;
}
```

### Cache Invalidation

```typescript
// Invalidation strategies
interface CacheInvalidation {
  // Tag-based invalidation
  invalidateByTags(...tags: string[]): Promise<void>;
  
  // Pattern invalidation
  invalidatePattern(pattern: string): Promise<void>;
  
  // Event-based invalidation
  invalidateOnChange(table: string, callback: (change) => void): void;
}
```

---

## Testing Philosophy

### Testability Principles

Repositories are designed for independent testing:

1. **Dependency Injection:** Supabase client is injectable
2. **Interface Segregation:** Clear method contracts
3. **No Side Effects:** Methods are pure where possible
4. **Separation of Concerns:** Query logic separate from business logic

### Mocking Support

```typescript
// Repository accepts any Supabase-like client
class UserRepository {
  constructor(private supabase: SupabaseClient) {}

  async getUser(id: string): Promise<User | null> {
    const { data } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }
}

// Tests can inject mock
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: mockUser })
      })
    })
  })
};

const repo = new UserRepository(mockSupabase);
```

### Test Categories

| Category | Scope | Tools |
|----------|-------|-------|
| Unit Tests | Repository methods | Jest, Vitest |
| Integration Tests | Database operations | Test database |
| Mock Tests | Service-repository integration | Mock Supabase |

### Isolation Strategy

```typescript
describe('PlayerRepository', () => {
  let repository: PlayerRepository;
  let mockSupabase: MockSupabaseClient;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    repository = new PlayerRepository(mockSupabase);
  });

  describe('getProfile', () => {
    it('should return null when profile not found', async () => {
      mockSupabase.setupQuery(null);
      const result = await repository.getProfile('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return mapped profile when found', async () => {
      const dbProfile = { id: '123', display_name: 'Test' };
      mockSupabase.setupQuery(dbProfile);
      const result = await repository.getProfile('123');
      expect(result).toEqual({ id: '123', displayName: 'Test' });
    });
  });
});
```

---

## Future Expansion Notes

These repositories represent **future concepts** for potential implementation. They are documented for architectural awareness and planning purposes.

### AI Repository

**Concept:** Repository for AI-generated content and recommendations.

```typescript
// Future: AI-driven personalization
interface AIRepository {
  getRecommendations(userId: string): Promise<Recommendation[]>;
  recordAIInteraction(userId: string, data: AIData): Promise<void>;
  getContentGenerationHistory(userId: string): Promise<GeneratedContent[]>;
}
```

### Creator Repository

**Concept:** Repository for user-generated content and creator tools.

```typescript
// Future: Creator economy support
interface CreatorRepository {
  getCreatorProfile(userId: string): Promise<CreatorProfile>;
  getCreatedContent(creatorId: string): Promise<CreatedItem[]>;
  submitForReview(content: ContentSubmission): Promise<string>;
  getContentReviews(creatorId: string): Promise<Review[]>;
}
```

### NFT Repository

**Concept:** Repository for blockchain-based assets and ownership.

```typescript
// Future: NFT and Web3 integration
interface NFTRepository {
  mintNFT(userId: string, artifactId: string): Promise<NFTData>;
  getUserNFTs(userId: string): Promise<NFT[]>;
  transferNFT(fromId: string, toId: string, nftId: string): Promise<boolean>;
  getNFTMetadata(nftId: string): Promise<NFTMetadata>;
}
```

### Web3 Repository

**Concept:** Repository for decentralized features and wallet integration.

```typescript
// Future: Web3 and blockchain features
interface Web3Repository {
  connectWallet(userId: string, walletAddress: string): Promise<boolean>;
  getWalletInfo(userId: string): Promise<WalletInfo>;
  getOnChainTransactions(address: string): Promise<Transaction[]>;
  verifyOwnership(userId: string, asset: Asset): Promise<boolean>;
}
```

### Esports Repository

**Concept:** Repository for competitive gaming and tournament management.

```typescript
// Future: Esports and competitive features
interface EsportsRepository {
  getTeam(teamId: string): Promise<EsportsTeam>;
  createTeam(userId: string, teamData: TeamData): Promise<string>;
  registerTeamForTournament(teamId: string, tournamentId: string): Promise<boolean>;
  getMatchResults(matchId: string): Promise<MatchResult>;
}
```

---

## Long-Term Philosophy

### Infrastructure Isolation

The Repository Layer provides complete infrastructure isolation:

| Benefit | Description |
|---------|-------------|
| **Database Independence** | Switch databases without rewriting services |
| **Schema Flexibility** | Evolve database without affecting business logic |
| **Performance Tuning** | Optimize queries without service changes |
| **Security Isolation** | Contain database credentials at repository level |

### Simplified Maintenance

Repositories reduce maintenance burden:

```
Without Repository Pattern:
Service → Database (tightly coupled)
- Schema changes cascade to all services
- Query bugs affect multiple features
- Testing requires full database

With Repository Pattern:
Service → Repository → Database (decoupled)
- Schema changes isolated to repositories
- Query bugs contained to repository layer
- Testing uses repository mocks
```

### Future Database Changes

The Repository Layer facilitates future changes:

| Future Change | Repository Impact | Service Impact |
|--------------|-------------------|----------------|
| PostgreSQL → MySQL | Rewrite repositories | No change |
| Supabase → Firebase | Rewrite repositories | No change |
| Add Redis caching | Add to repositories | No change |
| Shard database | Update repository routing | No change |
| Change schema | Update repository queries | No change |

### Scalability Support

Repositories enable horizontal scaling:

1. **Read Replicas:** Route read queries to replicas via repository configuration
2. **Write Scaling:** Implement sharding strategies in repository layer
3. **Caching:** Add cache layer without modifying services
4. **CQRS:** Separate read/write repositories for complex domains

### Architectural Evolution

The Repository Pattern supports Jolt Time's growth:

```
Phase 1: Foundation
└── Basic repositories (current)

Phase 2: Expansion
├── Advanced repositories
├── Caching layer
└── Analytics repositories

Phase 3: Scale
├── Distributed caching
├── Read replicas
└── Sharding support

Phase 4: Ecosystem
├── NFT Repository
├── Creator Repository
└── Web3 Repository
```

---

## Implementation Notes

### Migration from Current Services

The following files require migration to the repository structure:

| Current Location | Target Location |
|-----------------|-----------------|
| `src/services/DailyRewardRepository.ts` | `src/repositories/events/DailyRewardRepository.ts` |
| `src/services/EnergyRepository.ts` | `src/repositories/economy/EnergyRepository.ts` |
| `src/services/AdRepository.ts` | `src/repositories/analytics/AdsRepository.ts` |

### Next Steps

1. Create base repository interfaces and classes
2. Establish folder structure
3. Migrate existing repositories to new locations
4. Update service imports
5. Implement caching strategy interfaces
6. Add comprehensive tests

---

*Building the future through the lens of the past.*
