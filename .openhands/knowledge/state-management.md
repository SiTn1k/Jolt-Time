# State Management Architecture

## Overview

This document defines the complete state management architecture for Jolt Time, built on Zustand. The architecture ensures modularity, predictability, and maintainability across all frontend state concerns.

**Technology Stack:**
- State Management: Zustand
- Platform: React + TypeScript (Telegram Mini App)
- Backend: Supabase

---

## Store Categories

The state management system is divided into eight core stores, each responsible for a specific domain:

| Store | Purpose |
|-------|---------|
| **Player Store** | Profile data, statistics, progression, player status |
| **Economy Store** | Currencies, inventory, rewards, marketplace information |
| **Museum Store** | Collections, artifacts, museum decorations |
| **Event Store** | Active events, missions, rewards, participation progress |
| **PvP Store** | Arena battles, tournaments, competitive rankings |
| **Social Store** | Friends, guilds, leaderboards, referrals |
| **Settings Store** | User preferences, game settings, account settings |
| **UI Store** | Modals, loading states, notifications, temporary UI states |

---

## Store Philosophy

### Design Principles

1. **Single Responsibility**
   - Each store owns exactly one domain
   - No store crosses domain boundaries
   - Clear ownership reduces complexity

2. **Minimal Dependencies**
   - Stores do not import other stores directly
   - Cross-store communication uses events or composition
   - Dependencies are explicit and traceable

3. **Future Growth**
   - Architecture supports adding new stores without refactoring
   - Schema changes are isolated to their domain
   - No store becomes a "god object"

### Store Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                     React Components                     │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│  Player  │  Economy │  Museum  │  Event   │    PvP     │
│  Store   │  Store   │  Store   │  Store   │   Store    │
├──────────┴──────────┴──────────┴──────────┼────────────┤
│       Social Store  │  Settings Store     │   UI Store │
└─────────────────────┴─────────────────────┴────────────┘
```

---

## Player Store Structure

The Player Store manages all player identity and progression data.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Profile Data** | Telegram user ID, username, display name, avatar URL, join date |
| **Statistics** | Total playtime, sessions count, artifacts collected, events participated |
| **Progression** | Current era, era progress percentage, unlocked eras, completed quests |
| **Player Status** | Online/offline, last active timestamp, account status, subscription tier |

### State Shape

```typescript
interface PlayerState {
  // Profile
  profile: {
    id: string;
    telegramId: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    joinDate: string;
  } | null;
  
  // Statistics
  statistics: {
    totalPlaytimeMinutes: number;
    sessionsCount: number;
    artifactsCollected: number;
    eventsParticipated: number;
  };
  
  // Progression
  progression: {
    currentEra: string;
    eraProgress: number;
    unlockedEras: string[];
    completedQuestIds: string[];
  };
  
  // Status
  status: {
    isOnline: boolean;
    lastActiveAt: string;
    accountStatus: 'active' | 'suspended' | 'banned';
    subscriptionTier: 'free' | 'plus';
  };
}
```

### Actions

- `fetchProfile()` — Load player profile from Supabase
- `updateProfile(data)` — Update display name, avatar
- `updateStatistics(data)` — Increment playtime, sessions
- `advanceEra(eraId)` — Unlock and set current era
- `updateStatus(status)` — Update online status, subscription

---

## Economy Store Structure

The Economy Store manages all in-game economic systems.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Currencies** | Time Shards, Chrono Coins, Prestige Points, Event Tokens, Jolt Crystals, Research Points, Museum Points |
| **Inventory** | Item slots, max capacity, items array, equipped items |
| **Rewards** | Pending rewards, claimed rewards, reward history |
| **Marketplace** | Listed items, purchase history, my listings |

### State Shape

```typescript
interface EconomyState {
  // Currencies
  currencies: {
    timeShards: number;
    chronoCoins: number;
    prestigePoints: number;
    eventTokens: number;
    joltCrystals: number;
    researchPoints: number;
    museumPoints: number;
  };
  
  // Inventory
  inventory: {
    items: InventoryItem[];
    slotsUsed: number;
    maxSlots: number;
  };
  
  // Rewards
  rewards: {
    pending: Reward[];
    claimed: Reward[];
    history: RewardHistoryEntry[];
  };
  
  // Marketplace
  marketplace: {
    myListings: MarketplaceListing[];
    purchaseHistory: PurchaseRecord[];
  };
}
```

### Actions

- `fetchCurrencies()` — Load all currency balances
- `updateCurrency(type, amount)` — Add or subtract currency
- `fetchInventory()` — Load player inventory
- `addItem(item)` — Add item to inventory
- `removeItem(itemId)` — Remove item from inventory
- `fetchRewards()` — Load pending and claimed rewards
- `claimReward(rewardId)` — Claim a specific reward
- `fetchMarketplaceListings()` — Load user's marketplace activity

---

## Museum Store Structure

The Museum Store manages the player's museum collection and display.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Collections** | Active collections, completed collections, collection progress |
| **Artifacts** | Owned artifacts, artifact details, artifact stats, evolution levels |
| **Museum Decorations** | Purchased decorations, placed decorations, decoration slots |

### State Shape

```typescript
interface MuseumState {
  // Collections
  collections: {
    active: Collection | null;
    completed: string[];
    progress: number;
  };
  
  // Artifacts
  artifacts: {
    owned: Artifact[];
    displayed: string[]; // artifact IDs on display
    totalCollected: number;
    totalPossible: number;
  };
  
  // Decorations
  decorations: {
    owned: Decoration[];
    placed: PlacedDecoration[];
    slotsAvailable: number;
    slotsUsed: number;
  };
}
```

### Actions

- `fetchCollections()` — Load collection progress
- `setActiveCollection(collectionId)` — Set currently viewed collection
- `fetchArtifacts()` — Load owned artifacts
- `displayArtifact(artifactId)` — Place artifact in museum
- `undisplayArtifact(artifactId)` — Remove artifact from museum
- `fetchDecorations()` — Load owned decorations
- `placeDecoration(decorationId, position)` — Place decoration
- `removeDecoration(decorationId)` — Remove decoration

---

## Event Store Structure

The Event Store manages time-limited events and seasonal content.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Active Events** | Current event, event phase, time remaining |
| **Missions** | Available missions, in-progress missions, completed missions |
| **Rewards** | Event-specific rewards, claimable rewards, claimed rewards |
| **Participation** | Progress percentage, contribution points, leaderboard position |

### State Shape

```typescript
interface EventState {
  // Active Events
  activeEvents: {
    current: Event | null;
    upcoming: Event[];
    ended: Event[];
  };
  
  // Missions
  missions: {
    available: Mission[];
    inProgress: MissionProgress[];
    completed: string[];
  };
  
  // Rewards
  rewards: {
    eventRewards: EventReward[];
    claimable: string[]; // reward IDs
    claimed: string[];
  };
  
  // Participation
  participation: {
    progress: number;
    contributionPoints: number;
    leaderboardPosition: number | null;
  };
}
```

### Actions

- `fetchActiveEvents()` — Load current and upcoming events
- `joinEvent(eventId)` — Opt into an event
- `fetchMissions(eventId)` — Load missions for an event
- `updateMissionProgress(missionId, progress)` — Track mission completion
- `claimMissionReward(missionId)` — Claim mission reward
- `fetchEventRewards(eventId)` — Load event-specific rewards
- `claimEventReward(rewardId)` — Claim reward
- `fetchParticipation(eventId)` — Load player event progress

---

## PvP Store Structure

The PvP Store manages competitive gameplay features.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Arena** | Current rank, rank points, win/loss record, active season |
| **Tournaments** | Registered tournaments, tournament progress, results |
| **Rankings** | Global rank, regional rank, friends ranking |

### State Shape

```typescript
interface PvPState {
  // Arena
  arena: {
    currentRank: number;
    rankPoints: number;
    seasonId: string;
    stats: {
      wins: number;
      losses: number;
      draws: number;
    };
    activeMatch: Match | null;
  };
  
  // Tournaments
  tournaments: {
    registered: Tournament[];
    inProgress: TournamentProgress | null;
    history: TournamentResult[];
  };
  
  // Rankings
  rankings: {
    global: number | null;
    regional: number | null;
    friendsPosition: number | null;
  };
}
```

### Actions

- `fetchArenaStatus()` — Load current arena state
- `joinQueue()` — Enter arena matchmaking
- `leaveQueue()` — Exit arena matchmaking
- `fetchTournaments()` — Load available tournaments
- `registerTournament(tournamentId)` — Sign up for tournament
- `fetchRankings()` — Load all ranking positions
- `updateMatchResult(matchId, result)` — Record match outcome

---

## Social Store Structure

The Social Store manages player interactions and community features.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Friends** | Friends list, pending requests, blocked users |
| **Guilds** | Current guild, guild details, guild members |
| **Leaderboards** | Current leaderboard type, entries, player position |
| **Referrals** | Referral code, referred users, referral rewards |

### State Shape

```typescript
interface SocialState {
  // Friends
  friends: {
    list: Friend[];
    pendingRequests: FriendRequest[];
    blocked: string[];
    count: number;
  };
  
  // Guilds
  guild: {
    current: Guild | null;
    members: GuildMember[];
    invitations: GuildInvitation[];
  };
  
  // Leaderboards
  leaderboards: {
    currentType: LeaderboardType;
    entries: LeaderboardEntry[];
    playerPosition: number | null;
    lastUpdated: string;
  };
  
  // Referrals
  referrals: {
    code: string;
    referredUsers: string[];
    rewardsEarned: ReferralReward[];
  };
}
```

### Actions

- `fetchFriends()` — Load friends list
- `sendFriendRequest(userId)` — Send friend request
- `respondToRequest(requestId, accept)` — Accept or decline
- `fetchGuild()` — Load current guild
- `createGuild(name)` — Create new guild
- `joinGuild(guildId)` — Join existing guild
- `leaveGuild()` — Leave current guild
- `fetchLeaderboard(type)` — Load leaderboard entries
- `fetchReferralCode()` — Load referral code and history

---

## Settings Store Structure

The Settings Store manages user preferences and configuration.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Game Settings** | Sound enabled, music volume, effects volume, notifications enabled |
| **Display Settings** | Theme, font size, animations enabled |
| **Account Settings** | Language, linked accounts, privacy settings |

### State Shape

```typescript
interface SettingsState {
  // Game Settings
  game: {
    soundEnabled: boolean;
    musicVolume: number;
    effectsVolume: number;
    notificationsEnabled: boolean;
    hapticsEnabled: boolean;
  };
  
  // Display Settings
  display: {
    theme: 'dark' | 'light' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    animationsEnabled: boolean;
    reducedMotion: boolean;
  };
  
  // Account Settings
  account: {
    language: string;
    timezone: string;
    privacySettings: {
      showProfile: boolean;
      showProgress: boolean;
      allowFriendRequests: boolean;
    };
  };
}
```

### Actions

- `fetchSettings()` — Load all settings
- `updateGameSettings(settings)` — Update game preferences
- `updateDisplaySettings(settings)` — Update display preferences
- `updateAccountSettings(settings)` — Update account preferences
- `resetToDefaults()` — Reset all settings to defaults

---

## UI Store Structure

The UI Store manages ephemeral state that does not persist.

### Supported Data

| Category | Data Points |
|----------|-------------|
| **Modals** | Active modal type, modal props, modal stack |
| **Loading States** | Global loading, screen-specific loading, operation loading |
| **Notifications** | Toast messages, alert messages, inline messages |
| **Temporary States** | Selected items, expanded sections, form drafts |

### State Shape

```typescript
interface UIState {
  // Modals
  modals: {
    active: ModalType | null;
    props: Record<string, unknown>;
    stack: ModalType[];
  };
  
  // Loading States
  loading: {
    global: boolean;
    screens: Record<string, boolean>;
    operations: Record<string, boolean>;
  };
  
  // Notifications
  notifications: {
    toasts: Toast[];
    alerts: Alert[];
    inline: InlineMessage[];
  };
  
  // Temporary States
  temporary: {
    selectedItems: string[];
    expandedSections: string[];
    formDrafts: Record<string, unknown>;
    dragState: DragState | null;
  };
}
```

### Actions

- `openModal(type, props?)` — Open a modal with optional props
- `closeModal()` — Close the active modal
- `closeAllModals()` — Clear modal stack
- `setGlobalLoading(loading)` — Set global loading state
- `setScreenLoading(screen, loading)` — Set screen-specific loading
- `setOperationLoading(operation, loading)` — Set operation loading
- `showToast(toast)` — Display a toast notification
- `dismissToast(id)` — Dismiss a toast
- `showAlert(alert)` — Display an alert
- `selectItem(itemId)` — Toggle item selection
- `clearSelection()` — Clear all selections
- `setFormDraft(formId, data)` — Save form draft
- `clearFormDraft(formId)` — Clear form draft

---

## Persistence Philosophy

State is categorized by persistence requirements.

### Persistent State

Data that survives app restarts and is stored in Supabase:

| Store | Persistent Data |
|-------|-----------------|
| Player | Profile, statistics, progression, status |
| Economy | Currencies, inventory, rewards |
| Museum | Collections, artifacts, decorations |
| Settings | All settings |

**Persistence Rules:**
- Synced to Supabase on every meaningful change
- Loaded on app initialization
- Optimistic updates with rollback on failure
- Conflict resolution favors server state

### Temporary State

Data that exists only during the current session:

| Store | Temporary Data |
|-------|----------------|
| UI | Modals, loading states, notifications, selections |
| Event | Active match state, queue status |
| PvP | Current match, matchmaking state |

**Temporary Rules:**
- Reset on app restart
- Never persisted to database
- Managed entirely in memory

### Session State

Data that persists across page navigations but not app restarts:

| Store | Session Data |
|-------|--------------|
| UI | Expanded sections, form drafts |
| Event | Partially completed missions |
| Social | Recently viewed profiles |

**Session Rules:**
- Cleared on hard app refresh or restart
- Survives component unmount/remount
- Useful for preserving user context

---

## Async Data Philosophy

All stores handle asynchronous operations consistently.

### Loading States

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
```

**Loading State Rules:**
- Every async action sets loading to true before starting
- Loading set to false on success or error
- UI shows loading indicators based on loading state
- No loading state for synchronous operations

### Error Handling

**Error Handling Rules:**
- Errors captured and stored in state
- User-friendly error messages displayed
- Errors logged for debugging
- Retry mechanism available for recoverable errors

### Retry Logic

```typescript
interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}
```

**Default Retry Configuration:**
- Max attempts: 3
- Initial delay: 1000ms
- Max delay: 10000ms
- Backoff: exponential

**Retry Rules:**
- Automatic retry for network failures
- Manual retry for user-initiated actions
- No automatic retry for auth failures
- Exponential backoff prevents server overload

---

## Naming Standards

Consistent naming across all stores ensures maintainability.

### Store Names

| Store | Naming Convention | File Location |
|-------|------------------|---------------|
| Player Store | `usePlayerStore` | `src/stores/playerStore.ts` |
| Economy Store | `useEconomyStore` | `src/stores/economyStore.ts` |
| Museum Store | `useMuseumStore` | `src/stores/museumStore.ts` |
| Event Store | `useEventStore` | `src/stores/eventStore.ts` |
| PvP Store | `usePvPStore` | `src/stores/pvpStore.ts` |
| Social Store | `useSocialStore` | `src/stores/socialStore.ts` |
| Settings Store | `useSettingsStore` | `src/stores/settingsStore.ts` |
| UI Store | `useUIStore` | `src/stores/uiStore.ts` |

### State Properties

| Property Type | Naming Convention | Example |
|---------------|-------------------|---------|
| Single entity | `camelCase singular` | `currentEvent` |
| Collections | `CamelCase plural` | `activeEvents` |
| Booleans | `is/has/can prefix` | `isLoading`, `hasError` |
| Counts | `count or total prefix` | `count`, `totalItems` |
| Timestamps | `At suffix` | `lastUpdatedAt` |

### Action Names

| Action Type | Naming Convention | Example |
|-------------|-------------------|---------|
| Fetch | `fetch*` | `fetchProfile()` |
| Create | `create*` | `createGuild()` |
| Update | `update*` | `updateCurrency()` |
| Delete | `delete*` | `deleteFriend()` |
| Toggle | `toggle*` | `toggleSound()` |
| Set | `set*` | `setActiveModal()` |

---

## Future Expansion Notes

The architecture supports future stores without modification to existing code.

### NFT Store (Future Concept)

Conceptual responsibility: NFT artifacts, Web3 wallet integration, blockchain-based collectibles.

**Design Notes:**
- Will not be implemented until Web3 integration is approved
- Placeholder store structure documented in `nft-system.md`
- Depends on external Web3 infrastructure

### Creator Store (Future Concept)

Conceptual responsibility: Creator content, custom artifacts, community submissions.

**Design Notes:**
- Planned for Creator Ecosystem phase
- Will interface with moderation systems
- Requires approval workflow integration

### Esports Store (Future Concept)

Conceptual responsibility: Tournament brackets, spectator mode, competitive stats.

**Design Notes:**
- Planned for Multiplayer phase
- Real-time updates via Supabase Realtime
- Requires match history and replay systems

### AI Systems Store (Future Concept)

Conceptual responsibility: AI companion, smart recommendations, adaptive difficulty.

**Design Notes:**
- No concrete timeline
- Will use external AI API integration
- Requires careful data privacy consideration

---

## Long-Term Philosophy

### Simplify Development

- **Clear Ownership:** Developers know exactly which store owns which data
- **Predictable Patterns:** Same patterns across all stores reduce cognitive load
- **Easy Testing:** Isolated stores are easy to unit test
- **Fast Onboarding:** New team members understand architecture quickly

### Remain Scalable

- **Horizontal Growth:** New stores can be added without modifying existing ones
- **Vertical Growth:** Stores can grow in complexity without restructuring
- **Performance:** Small stores mean minimal re-renders and fast updates
- **Bundle Size:** Code splitting keeps initial load manageable

### Improve Maintainability

- **Debuggability:** State changes are traceable and predictable
- **Refactoring Safety:** Changes are isolated to their domain
- **Documentation:** This document serves as authoritative reference
- **Consistency:** Naming and patterns are uniform across codebase

---

## Related Documentation

- **Database Schema:** `.openhands/knowledge/database-schema.md`
- **API Architecture:** `.openhands/knowledge/api-architecture.md`
- **Museum System:** `.openhands/knowledge/museum-system.md`
- **Economy System:** `.openhands/knowledge/economy-system.md`
- **Events:** `.openhands/knowledge/events.md`
- **PvP Arena:** `.openhands/knowledge/pvp-arena.md`
- **Social System:** `.openhands/knowledge/social-system.md`
- **Settings:** `.openhands/knowledge/settings.md`

---

*Last Updated: 2026-06-24*
