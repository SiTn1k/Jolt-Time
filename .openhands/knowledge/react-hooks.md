# Jolt Time — React Hooks Architecture

> **Single Source of Truth for Hook Organization**
>
> This document defines the complete React hooks architecture for Jolt Time. All custom hooks must follow this structure to ensure consistency, reusability, and maintainability.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Hook Categories](#2-hook-categories)
3. [Hook Philosophy](#3-hook-philosophy)
4. [Folder Structure](#4-folder-structure)
5. [Data Hooks Architecture](#5-data-hooks-architecture)
6. [Feature Hooks Architecture](#6-feature-hooks-architecture)
7. [Telegram Hooks Architecture](#7-telegram-hooks-architecture)
8. [UI Hooks Architecture](#8-ui-hooks-architecture)
9. [Analytics Hooks Architecture](#9-analytics-hooks-architecture)
10. [Utility Hooks Architecture](#10-utility-hooks-architecture)
11. [Hook Naming Standards](#11-hook-naming-standards)
12. [Error Handling Philosophy](#12-error-handling-philosophy)
13. [Performance Philosophy](#13-performance-philosophy)
14. [Testing Notes](#14-testing-notes)
15. [Future Expansion Notes](#15-future-expansion-notes)
16. [Long-Term Philosophy](#16-long-term-philosophy)

---

## 1. Overview

### Purpose

React hooks serve as the bridge between React components and the underlying business logic, state management, and platform integrations. They encapsulate reusable logic that would otherwise be duplicated across components.

### Architecture Position

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Screen    │  │  Feature    │  │   Shared    │          │
│  │  Component  │  │  Component  │  │  Component  │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────────────────────────────────────────┐       │
│  │                    HOOKS                        │       │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐  │       │
│  │  │  Data   │ │Feature  │ │Telegram │ │  UI    │  │       │
│  │  │ Hooks   │ │ Hooks   │ │ Hooks   │ │ Hooks  │  │       │
│  │  └─────────┘ └─────────┘ └─────────┘ └────────┘  │       │
│  └─────────────────────────────────────────────────┘       │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         ▼                 ▼                 ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Zustand   │  │  Supabase   │  │  Telegram   │          │
│  │   Stores    │  │    API      │  │    SDK      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Relationship with Other Architecture Layers

| Layer | Relationship |
|-------|--------------|
| **Components** | Hooks provide data and logic to components |
| **Stores** | Data hooks consume Zustand stores |
| **Services** | Hooks call service layer for external operations |
| **API** | Data hooks use repositories for backend communication |

---

## 2. Hook Categories

### Category Overview

| Category | Purpose | Location | Examples |
|----------|---------|----------|----------|
| **Data Hooks** | Fetch and manage domain data | `hooks/data/` | `usePlayer`, `useMuseum` |
| **Feature Hooks** | Feature-specific business logic | `features/*/hooks/` | `useBattle`, `useGuild` |
| **Telegram Hooks** | Telegram platform integration | `hooks/telegram/` | `useTelegramUser`, `useTelegramTheme` |
| **UI Hooks** | UI state and interactions | `hooks/ui/` | `useModal`, `useToast` |
| **Analytics Hooks** | Tracking and metrics | `hooks/analytics/` | `useAnalytics`, `useAdsTracking` |
| **Utility Hooks** | Generic reusable utilities | `hooks/utils/` | `useDebounce`, `useLocalStorage` |

### Category Responsibilities

```
HOOK CATEGORIES:
┌────────────────────────────────────────────────────────────────┐
│  DATA HOOKS                                                     │
│  ───────────────────────────────────────────────────────────  │
│  • Fetch domain data from stores/API                           │
│  • Provide derived data computations                           │
│  • Handle loading/error states                                 │
│  • Sync with backend                                           │
├────────────────────────────────────────────────────────────────┤
│  FEATURE HOOKS                                                 │
│  ───────────────────────────────────────────────────────────  │
│  • Encapsulate feature-specific business logic                │
│  • Coordinate between multiple data hooks                     │
│  • Handle feature state machines                              │
│  • Expose feature actions                                     │
├────────────────────────────────────────────────────────────────┤
│  TELEGRAM HOOKS                                                │
│  ───────────────────────────────────────────────────────────  │
│  • Access Telegram Web App SDK                                │
│  • Handle platform-specific behaviors                         │
│  • Theme and viewport management                              │
│  • Share and navigation                                       │
├────────────────────────────────────────────────────────────────┤
│  UI HOOKS                                                      │
│  ───────────────────────────────────────────────────────────  │
│  • Manage UI state (modals, toasts, loading)                  │
│  • Handle user interactions                                   │
│  • Pagination and infinite scroll                             │
│  • Form state management                                      │
├────────────────────────────────────────────────────────────────┤
│  ANALYTICS HOOKS                                              │
│  ───────────────────────────────────────────────────────────  │
│  • Track user events and actions                             │
│  • Monitor monetization metrics                               │
│  • A/B testing support                                       │
│  • Performance metrics                                        │
├────────────────────────────────────────────────────────────────┤
│  UTILITY HOOKS                                                │
│  ───────────────────────────────────────────────────────────  │
│  • Generic reusable patterns                                 │
│  • Cross-cutting concerns                                    │
│  • Platform-agnostic logic                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Hook Philosophy

### Core Principles

#### 1. Single Responsibility
Each hook should do one thing well:
- `usePlayer` — Player data and profile
- `useEnergy` — Energy state and operations
- `useModal` — Modal visibility and state

#### 2. Composability
Hooks should compose with other hooks:
```typescript
// Composable pattern
const useBattle = () => {
  const player = usePlayer();
  const energy = useEnergy();
  const analytics = useAnalytics();
  
  return { player, energy, analytics };
};
```

#### 3. Predictability
Hooks should have consistent behavior:
- Same inputs → Same outputs
- Stable return interface
- Clear error handling

#### 4. Testability
Every hook should be testable:
- No hidden dependencies
- Clear contract
- Mockable external dependencies

### Hook Design Rules

| Rule | Description |
|------|-------------|
| **No Duplication** | If logic appears in 2+ components, create a hook |
| **Pure Where Possible** | Hooks should be deterministic when possible |
| **Minimal Side Effects** | Side effects should be explicit and controlled |
| **Type Safe** | Full TypeScript types for all inputs and outputs |
| **Documented** | JSDoc for complex hooks |

### When to Create a Hook

**Create a hook when:**
- Logic is reused across 2+ components
- Complex state management is needed
- Business logic should be isolated from UI
- An action involves multiple stores or services
- Data transformation is needed

**Do NOT create a hook when:**
- Logic is used in only one component and is simple
- It would merely wrap a single function call
- It adds unnecessary complexity

---

## 4. Folder Structure

### Hook Directory Organization

```
src/
├── hooks/                      # Shared hooks directory
│   ├── data/                  # Data hooks
│   │   ├── usePlayer.ts
│   │   ├── useProfile.ts
│   │   ├── useMuseum.ts
│   │   ├── useInventory.ts
│   │   ├── useEvents.ts
│   │   ├── useLeaderboard.ts
│   │   ├── useEnergy.ts
│   │   ├── useCurrency.ts
│   │   ├── useQuests.ts
│   │   ├── useAchievements.ts
│   │   ├── useGuild.ts
│   │   ├── useFriends.ts
│   │   └── index.ts
│   ├── feature/               # Feature hooks (deprecated - use features/)
│   ├── telegram/              # Telegram platform hooks
│   │   ├── useTelegramUser.ts
│   │   ├── useTelegramTheme.ts
│   │   ├── useTelegramViewport.ts
│   │   ├── useTelegramBackButton.ts
│   │   ├── useTelegramShare.ts
│   │   ├── useTelegramHaptic.ts
│   │   ├── useTelegramStorage.ts
│   │   ├── useTelegramMainButton.ts
│   │   └── index.ts
│   ├── ui/                   # UI state hooks
│   │   ├── useModal.ts
│   │   ├── useToast.ts
│   │   ├── useLoading.ts
│   │   ├── usePagination.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useForm.ts
│   │   ├── useCountdown.ts
│   │   ├── useCountUp.ts
│   │   ├── useTabs.ts
│   │   ├── useAccordion.ts
│   │   ├── useTooltip.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   ├── analytics/             # Analytics hooks
│   │   ├── useAnalytics.ts
│   │   ├── useEventTracking.ts
│   │   ├── useAdsTracking.ts
│   │   ├── useScreenTracking.ts
│   │   ├── useMonetizationTracking.ts
│   │   └── index.ts
│   ├── utils/                # Utility hooks
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useSessionStorage.ts
│   │   ├── useTimeout.ts
│   │   ├── useInterval.ts
│   │   ├── useOnce.ts
│   │   ├── usePrevious.ts
│   │   ├── useToggle.ts
│   │   ├── useMemo.ts
│   │   ├── useC还记得吗.ts
│   │   ├── useHover.ts
│   │   ├── useFocus.ts
│   │   ├── useKeyPress.ts
│   │   ├── useSwipe.ts
│   │   └── index.ts
│   └── index.ts              # Main hooks export
└── features/                  # Feature modules
    └── {feature-name}/
        ├── hooks/            # Feature-specific hooks
        │   ├── use{Feature}.ts
        │   └── index.ts
        └── ...
```

### Feature-Specific Hooks

```
src/features/{feature-name}/hooks/
├── index.ts                  # Feature hooks export
├── use{FeatureName}.ts      # Primary feature hook
├── use{FeatureName}Actions.ts # Action hooks
├── use{FeatureName}State.ts  # State hooks
└── use{FeatureName}Utils.ts  # Utility hooks
```

### Hook File Structure Pattern

Each hook file should follow this pattern:

```typescript
/**
 * Hook description
 * 
 * @description
 * Detailed description of what the hook does,
 * when to use it, and any important notes.
 * 
 * @example
 * const { data, isLoading } = useExample({ userId: '123' });
 */

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/stores';
import type { ExampleData, ExampleParams } from './types';

// Types
export interface UseExampleOptions {
  userId: string;
  enabled?: boolean;
}

export interface UseExampleResult {
  data: ExampleData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Hook implementation
export const useExample = (options: UseExampleOptions) => {
  // Implementation
};

// Default export (optional, for convenience)
// export default useExample;
```

### Index File Pattern

```typescript
// hooks/data/index.ts
export { usePlayer } from './usePlayer';
export { useProfile } from './useProfile';
export { useMuseum } from './useMuseum';
export { useInventory } from './useInventory';
export { useEvents } from './useEvents';
export { useLeaderboard } from './useLeaderboard';
export type { UsePlayerOptions, UsePlayerResult } from './usePlayer';
// ... other exports
```

---

## 5. Data Hooks Architecture

Data hooks provide access to domain data through Zustand stores and Supabase repositories.

### Data Hook Pattern

```typescript
// Pattern for all data hooks
interface Use{Entity}Options {
  // Query parameters
}

interface Use{Entity}Result {
  // State
  data: EntityData | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  
  // Actions
  refetch: () => Promise<void>;
  update: (data: Partial<EntityData>) => void;
  
  // Derived state
  isEmpty: boolean;
  isError: boolean;
}
```

### Core Data Hooks

#### usePlayer

**Purpose:** Access and manage player profile data.

```typescript
// hooks/data/usePlayer.ts
export interface UsePlayerOptions {
  userId?: string;
  enabled?: boolean;
}

export interface UsePlayerResult {
  // State
  player: Player | null;
  isLoading: boolean;
  error: Error | null;
  
  // Profile actions
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  
  // Derived
  level: number;
  displayName: string;
  avatarUrl: string | null;
}
```

**Store Integration:** Player Store

#### useProfile

**Purpose:** Access detailed profile information.

```typescript
// hooks/data/useProfile.ts
export interface UseProfileOptions {
  userId?: string;
}

export interface UseProfileResult {
  profile: Profile | null;
  statistics: PlayerStatistics | null;
  achievements: Achievement[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

#### useMuseum

**Purpose:** Access museum and artifact collection data.

```typescript
// hooks/data/useMuseum.ts
export interface UseMuseumOptions {
  userId?: string;
}

export interface UseMuseumResult {
  museum: Museum | null;
  collections: Collection[];
  artifacts: Artifact[];
  isLoading: boolean;
  error: Error | null;
  addArtifact: (artifact: Artifact) => Promise<void>;
  removeArtifact: (artifactId: string) => Promise<void>;
  upgradeMuseum: () => Promise<void>;
  getCollectionProgress: (collectionId: string) => Progress;
}
```

#### useInventory

**Purpose:** Manage player inventory and items.

```typescript
// hooks/data/useInventory.ts
export interface UseInventoryOptions {
  userId?: string;
  category?: ItemCategory;
}

export interface UseInventoryResult {
  items: InventoryItem[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  addItem: (item: Item) => Promise<void>;
  removeItem: (itemId: string, quantity: number) => Promise<void>;
  useItem: (itemId: string) => Promise<void>;
  equipItem: (itemId: string, slot: EquipmentSlot) => Promise<void>;
  unequipItem: (slot: EquipmentSlot) => Promise<void>;
}
```

#### useEvents

**Purpose:** Access active events and missions.

```typescript
// hooks/data/useEvents.ts
export interface UseEventsOptions {
  userId?: string;
  status?: 'active' | 'upcoming' | 'completed';
}

export interface UseEventsResult {
  events: GameEvent[];
  missions: Mission[];
  currentEvent: GameEvent | null;
  isLoading: boolean;
  error: Error | null;
  claimReward: (eventId: string, missionId: string) => Promise<void>;
  progressEvent: (eventId: string) => void;
}
```

#### useLeaderboard

**Purpose:** Access rankings and leaderboard data.

```typescript
// hooks/data/useLeaderboard.ts
export interface UseLeaderboardOptions {
  type: LeaderboardType;
  period?: 'daily' | 'weekly' | 'seasonal' | 'all';
  limit?: number;
  offset?: number;
}

export interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  playerRank: number | null;
  totalParticipants: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### Data Hooks List

| Hook | Store | Purpose |
|------|-------|---------|
| `usePlayer` | Player Store | Player profile and progression |
| `useProfile` | Player Store | Detailed profile with stats |
| `useMuseum` | Museum Store | Museum and collections |
| `useInventory` | Economy Store | Inventory and items |
| `useEvents` | Event Store | Active events and missions |
| `useLeaderboard` | Social Store | Rankings and scores |
| `useEnergy` | Player Store | Energy state and management |
| `useCurrency` | Economy Store | Currency balances |
| `useQuests` | Player Store | Quest progress |
| `useAchievements` | Player Store | Achievement progress |
| `useGuild` | Social Store | Guild membership and data |
| `useFriends` | Social Store | Friends list and requests |

### Data Hooks Architecture Diagram

```
DATA HOOKS ARCHITECTURE:
┌─────────────────────────────────────────────────────────────┐
│                      React Component                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA HOOKS                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │usePlayer│ │useMuseum│ │useEvents│ │useInventory│        │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘          │
│       │            │           │            │                │
└───────┼────────────┼───────────┼────────────┼────────────────┘
        │            │           │            │
        ▼            ▼           ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                     ZUSTAND STORES                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Player  │ │ Museum  │ │ Events  │ │Economy │          │
│  │ Store   │ │ Store   │ │ Store   │ │ Store  │          │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘          │
│       │            │           │            │                │
└───────┼────────────┼───────────┼────────────┼────────────────┘
        │            │           │            │
        ▼            ▼           ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE REPOSITORIES                     │
│         (for server-side data and persistence)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Feature Hooks Architecture

Feature hooks encapsulate feature-specific business logic and coordinate between multiple data hooks and stores.

### Feature Hook Pattern

```typescript
// Pattern for feature hooks
export interface Use{Feature}Options {
  // Feature-specific options
}

export interface Use{Feature}Result {
  // Feature state
  isActive: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Feature data
  data: FeatureData | null;
  
  // Feature actions
  start: () => Promise<void>;
  stop: () => void;
  update: (data: Partial<FeatureData>) => Promise<void>;
  
  // Coordinated data hooks
  player: ReturnType<typeof usePlayer>;
  energy: ReturnType<typeof useEnergy>;
}
```

### Core Feature Hooks

#### useBattle

**Purpose:** Handle PvP battle logic and state management.

```typescript
// features/pvp/hooks/useBattle.ts
export interface UseBattleOptions {
  battleId?: string;
  opponentId?: string;
}

export interface UseBattleResult {
  // Battle state
  battle: Battle | null;
  phase: 'idle' | 'matching' | 'ready' | 'in_progress' | 'completed';
  isLoading: boolean;
  error: Error | null;
  
  // Battle actions
  findMatch: () => Promise<void>;
  cancelMatch: () => void;
  performAction: (action: BattleAction) => Promise<void>;
  surrender: () => Promise<void>;
  
  // Coordinated hooks
  player: ReturnType<typeof usePlayer>;
  energy: ReturnType<typeof useEnergy>;
  analytics: ReturnType<typeof useAnalytics>;
}
```

#### useMarketplace

**Purpose:** Handle marketplace listings and trading.

```typescript
// features/marketplace/hooks/useMarketplace.ts
export interface UseMarketplaceOptions {
  type?: 'buy' | 'sell';
  category?: ItemCategory;
  sortBy?: 'price' | 'recent' | 'popular';
}

export interface UseMarketplaceResult {
  listings: Listing[];
  myListings: Listing[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  createListing: (item: Item, price: number) => Promise<void>;
  cancelListing: (listingId: string) => Promise<void>;
  purchase: (listingId: string) => Promise<void>;
  search: (query: string) => Promise<void>;
}
```

#### useGuild

**Purpose:** Handle guild membership and guild operations.

```typescript
// features/guilds/hooks/useGuild.ts
export interface UseGuildOptions {
  guildId?: string;
  userId?: string;
}

export interface UseGuildResult {
  guild: Guild | null;
  members: GuildMember[];
  myRole: GuildRole | null;
  isLoading: boolean;
  error: Error | null;
  
  // Guild actions
  createGuild: (name: string, description: string) => Promise<void>;
  joinGuild: (guildId: string) => Promise<void>;
  leaveGuild: () => Promise<void>;
  promoteMember: (memberId: string) => Promise<void>;
  kickMember: (memberId: string) => Promise<void>;
  updateSettings: (settings: GuildSettings) => Promise<void>;
}
```

#### useArtifactCollection

**Purpose:** Manage artifact collection progress and unlocks.

```typescript
// features/museum/hooks/useArtifactCollection.ts
export interface UseArtifactCollectionOptions {
  collectionId?: string;
  eraId?: string;
}

export interface UseArtifactCollectionResult {
  collection: ArtifactCollection | null;
  artifacts: Artifact[];
  progress: CollectionProgress;
  missingArtifacts: Artifact[];
  isComplete: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Collection actions
  unlockArtifact: (artifactId: string) => Promise<void>;
  evolveArtifact: (artifactId: string, evolutionId: string) => Promise<void>;
  completeCollection: () => Promise<void>;
}
```

#### useMuseumExpansion

**Purpose:** Handle museum expansion and decoration.

```typescript
// features/museum/hooks/useMuseumExpansion.ts
export interface UseMuseumExpansionOptions {
  userId?: string;
}

export interface UseMuseumExpansionResult {
  museum: Museum;
  availableSlots: number;
  maxSlots: number;
  decorations: Decoration[];
  isLoading: boolean;
  error: Error | null;
  
  // Expansion actions
  expand: (slots: number) => Promise<void>;
  placeDecoration: (slot: number, decorationId: string) => Promise<void>;
  removeDecoration: (slot: number) => Promise<void>;
  rearrangeDecorations: (arrangement: SlotArrangement) => Promise<void>;
}
```

### Feature Hooks Architecture Diagram

```
FEATURE HOOKS ARCHITECTURE:
┌─────────────────────────────────────────────────────────────┐
│                      React Component                         │
│                                                              │
│  const { battle, performAction } = useBattle({ battleId });│
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE HOOK                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                    useBattle                         │     │
│  │  • Coordinates data hooks                           │     │
│  │  • Manages feature state machine                    │     │
│  │  • Encapsulates business logic                     │     │
│  │  • Handles side effects                             │     │
│  └─────────────────────────────────────────────────────┘     │
│       │           │            │            │               │
│       ▼           ▼            ▼            ▼               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │usePlayer│ │useEnergy│ │useMuseum│ │useAnalytics│        │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘          │
│       │           │            │            │                │
└───────┼───────────┼────────────┼────────────┼────────────────┘
        │           │            │            │
        ▼           ▼            ▼            ▼
   [Data Hooks follow data hooks architecture]
```

---

## 7. Telegram Hooks Architecture

Telegram hooks provide access to the Telegram Web App SDK and handle platform-specific behaviors.

### Telegram Hook Pattern

```typescript
// Pattern for Telegram hooks
export interface UseTelegram{Feature}Options {
  // Hook-specific options
}

export interface UseTelegram{Feature}Result {
  // Telegram data
  value: TelegramValue;
  
  // Actions
  set: (value: TelegramValue) => void;
  
  // Convenience
  isAvailable: boolean;
}
```

### Telegram Hooks List

#### useTelegramUser

**Purpose:** Access Telegram user information.

```typescript
// hooks/telegram/useTelegramUser.ts
export interface UseTelegramUserResult {
  user: TelegramUser | null;
  userId: string | null;
  username: string | null;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  languageCode: string | null;
  isPremium: boolean;
  isBot: boolean;
  isAvailable: boolean;
}
```

#### useTelegramTheme

**Purpose:** Access and respond to Telegram theme changes.

```typescript
// hooks/telegram/useTelegramTheme.ts
export interface UseTelegramThemeResult {
  themeParams: ThemeParams;
  colorScheme: 'light' | 'dark';
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  isAvailable: boolean;
}
```

#### useTelegramViewport

**Purpose:** Track viewport changes.

```typescript
// hooks/telegram/useTelegramViewport.ts
export interface UseTelegramViewportResult {
  width: number;
  height: number;
  isExpanded: boolean;
  viewportExpanded: boolean;
  viewportStableHeight: number;
  isAvailable: boolean;
}
```

#### useTelegramBackButton

**Purpose:** Control the Telegram back button.

```typescript
// hooks/telegram/useTelegramBackButton.ts
export interface UseTelegramBackButtonResult {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (handler: () => void) => void;
  offClick: (handler: () => void) => void;
  isAvailable: boolean;
}
```

#### useTelegramShare

**Purpose:** Handle sharing functionality.

```typescript
// hooks/telegram/useTelegramShare.ts
export interface UseTelegramShareOptions {
  text: string;
  url?: string;
}

export interface UseTelegramShareResult {
  share: (options?: UseTelegramShareOptions) => Promise<void>;
  canShare: boolean;
  isAvailable: boolean;
}
```

#### useTelegramHaptic

**Purpose:** Control haptic feedback.

```typescript
// hooks/telegram/useTelegramHaptic.ts
export interface UseTelegramHapticResult {
  impact: (style: 'light' | 'medium' | 'heavy') => void;
  notification: (type: 'success' | 'warning' | 'error') => void;
  selection: () => void;
  isAvailable: boolean;
}
```

#### useTelegramMainButton

**Purpose:** Control the Telegram main button.

```typescript
// hooks/telegram/useTelegramMainButton.ts
export interface UseTelegramMainButtonResult {
  isVisible: boolean;
  isEnabled: boolean;
  text: string;
  color: string;
  textColor: string;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  setText: (text: string) => void;
  setColor: (color: string) => void;
  setTextColor: (color: string) => void;
  onClick: (handler: () => void) => void;
  offClick: (handler: () => void) => void;
  isAvailable: boolean;
}
```

#### useTelegramStorage

**Purpose:** Access Telegram storage.

```typescript
// hooks/telegram/useTelegramStorage.ts
export interface UseTelegramStorageResult {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  isAvailable: boolean;
}
```

### Telegram Hooks Architecture Diagram

```
TELEGRAM HOOKS ARCHITECTURE:
┌─────────────────────────────────────────────────────────────┐
│                    TELEGRAM SDK                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   WebApp     │ │    Theme     │ │   Haptic    │       │
│  │   User       │ │   Params     │ │   Feedback  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    TELEGRAM HOOKS                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │useTGUser│ │useTGTheme│ │useTGHaptic│ │useTGShare│        │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘          │
│       │            │            │            │                │
└───────┼────────────┼────────────┼────────────┼────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                      React Components                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Header    │  │  GameScreen │  │  Profile    │         │
│  │  useTGUser  │  │  useTGHaptic│  │ useTGShare  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. UI Hooks Architecture

UI hooks manage UI state and interactions that are not specific to any domain.

### UI Hook Pattern

```typescript
// Pattern for UI hooks
export interface Use{UIElement}Options {
  // Hook-specific options
}

export interface Use{UIElement}Result {
  // State
  isOpen: boolean;
  isLoading: boolean;
  
  // Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  
  // Helpers
  setLoading: (loading: boolean) => void;
}
```

### Core UI Hooks

#### useModal

**Purpose:** Manage modal visibility and state.

```typescript
// hooks/ui/useModal.ts
export interface UseModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
  initialOpen?: boolean;
}

export interface UseModalResult {
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setContent: (content: ReactNode) => void;
  content: ReactNode | null;
}
```

#### useToast

**Purpose:** Manage toast notifications.

```typescript
// hooks/ui/useToast.ts
export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: ToastAction;
}

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  action?: ToastAction;
}

export interface UseToastResult {
  toasts: Toast[];
  show: (message: string, options?: ToastOptions) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  success: (message: string) => string;
  error: (message: string) => string;
  warning: (message: string) => string;
  info: (message: string) => string;
}
```

#### useLoading

**Purpose:** Manage loading states.

```typescript
// hooks/ui/useLoading.ts
export interface UseLoadingOptions {
  initialState?: boolean;
}

export interface UseLoadingResult {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}
```

#### usePagination

**Purpose:** Handle pagination logic.

```typescript
// hooks/ui/usePagination.ts
export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  offset: number;
  hasNext: boolean;
  hasPrevious: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  reset: () => void;
}
```

#### useInfiniteScroll

**Purpose:** Handle infinite scroll loading.

```typescript
// hooks/ui/useInfiniteScroll.ts
export interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number, pageSize: number) => Promise<T[]>;
  pageSize?: number;
  initialData?: T[];
}

export interface UseInfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}
```

#### useForm

**Purpose:** Manage form state.

```typescript
// hooks/ui/useForm.ts
export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

export interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  handleSubmit: () => Promise<void>;
  reset: () => void;
  validate: () => boolean;
}
```

#### useCountdown

**Purpose:** Countdown timer functionality.

```typescript
// hooks/ui/useCountdown.ts
export interface UseCountdownOptions {
  endTime: Date | number;
  onComplete?: () => void;
  interval?: number;
}

export interface UseCountdownResult {
  timeLeft: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  isComplete: boolean;
  progress: number; // 0-1
}
```

### UI Hooks Architecture Diagram

```
UI HOOKS ARCHITECTURE:
┌─────────────────────────────────────────────────────────────┐
│                      UI STATE                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Modals  │ │ Toasts  │ │ Loading │ │  Forms  │          │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘          │
│       │            │            │            │                │
└───────┼────────────┼────────────┼────────────┼────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                      UI HOOKS                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │useModal │ │useToast │ │useLoading│ │useForm  │          │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬─────┘          │
│       │            │            │            │                │
└───────┼────────────┼────────────┼────────────┼────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                      React Components                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Modal    │  │   Toast    │  │    Form     │         │
│  │  Container │  │  Container │  │   Wrapper   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Analytics Hooks Architecture

Analytics hooks provide tracking capabilities for user behavior, monetization, and performance metrics. AdsGram is a primary revenue system and must be properly tracked.

### Analytics Hook Pattern

```typescript
// Pattern for analytics hooks
export interface UseAnalyticsResult {
  track: (event: string, properties?: Record<string, unknown>) => void;
  trackScreen: (screen: string) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
}
```

### Core Analytics Hooks

#### useAnalytics

**Purpose:** Main analytics tracking interface.

```typescript
// hooks/analytics/useAnalytics.ts
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export interface UseAnalyticsResult {
  // Event tracking
  track: (event: string, properties?: Record<string, unknown>) => void;
  trackScreen: (screen: string, params?: Record<string, unknown>) => void;
  
  // User identification
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  alias: (userId: string, aliasId: string) => void;
  
  // Session tracking
  startSession: () => void;
  endSession: () => void;
  
  // Error tracking
  trackError: (error: Error, context?: Record<string, unknown>) => void;
}
```

#### useEventTracking

**Purpose:** Track game event participation.

```typescript
// hooks/analytics/useEventTracking.ts
export interface UseEventTrackingResult {
  // Event participation
  trackEventStart: (eventId: string, eventType: string) => void;
  trackEventComplete: (eventId: string, result: EventResult) => void;
  trackEventAbandon: (eventId: string, reason?: string) => void;
  
  // Mission tracking
  trackMissionStart: (missionId: string, eventId: string) => void;
  trackMissionComplete: (missionId: string, eventId: string, reward: Reward) => void;
  trackMissionFail: (missionId: string, eventId: string, reason: string) => void;
  
  // Progress tracking
  trackProgress: (eventId: string, progress: number) => void;
}
```

#### useAdsTracking

**Purpose:** Track AdsGram ad views and revenue. **Critical for monetization.**

```typescript
// hooks/analytics/useAdsTracking.ts
export interface AdViewEvent {
  adId: string;
  adType: 'rewarded' | 'interstitial' | 'banner';
  placement: string;
  duration: number;
  completed: boolean;
  rewardType?: string;
  rewardAmount?: number;
}

export interface UseAdsTrackingResult {
  // Ad viewing
  trackAdImpression: (ad: AdViewEvent) => void;
  trackAdStart: (adId: string, adType: AdType) => void;
  trackAdComplete: (adId: string, reward: AdReward) => void;
  trackAdSkip: (adId: string) => void;
  trackAdError: (adId: string, error: string) => void;
  
  // Revenue tracking
  trackAdRevenue: (amount: number, currency: string) => void;
  
  // User activity
  trackAdClick: (placement: string) => void;
  
  // Analytics access
  getAdStats: () => Promise<AdStatistics>;
}
```

#### useScreenTracking

**Purpose:** Track screen views and navigation.

```typescript
// hooks/analytics/useScreenTracking.ts
export interface ScreenTrackingOptions {
  screenName: string;
  params?: Record<string, unknown>;
}

export interface UseScreenTrackingResult {
  trackScreenView: (options: ScreenTrackingOptions) => void;
  trackNavigation: (from: string, to: string) => void;
}
```

#### useMonetizationTracking

**Purpose:** Track all monetization events including AdsGram revenue.

```typescript
// hooks/analytics/useMonetizationTracking.ts
export interface MonetizationEvent {
  type: 'ad_revenue' | 'purchase' | 'subscription' | 'referral_bonus';
  amount: number;
  currency: string;
  source: string;
  properties?: Record<string, unknown>;
}

export interface UseMonetizationTrackingResult {
  // Revenue events
  trackAdRevenue: (event: MonetizationEvent) => void;
  trackPurchase: (event: MonetizationEvent) => void;
  trackSubscription: (event: MonetizationEvent) => void;
  
  // Metrics
  getLifetimeValue: () => Promise<number>;
  getAverageRevenuePerUser: () => Promise<number>;
  getConversionRate: () => Promise<number>;
}
```

### Analytics Hooks Architecture Diagram

```
ANALYTICS HOOKS ARCHITECTURE:
┌─────────────────────────────────────────────────────────────┐
│                      ANALYTICS LAYER                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   useAnalytics                        │  │
│  │  • Central tracking interface                         │  │
│  │  • User identification                               │  │
│  │  • Error tracking                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐  │
│  │useEvent    │ │useAds      │ │useScreen   │ │useMono- │  │
│  │Tracking    │ │Tracking    │ │Tracking    │ │tization │  │
│  └────────────┘ └─────┬──────┘ └────────────┘ └────┬────┘  │
└───────────────────────┼────────────────────────────┼────────┘
                        │                            │
                        ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ANALYTICS SERVICES                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  AdsGram     │  │  Supabase    │  │  Custom      │       │
│  │  Analytics   │  │  Analytics   │  │  Metrics     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Utility Hooks Architecture

Utility hooks provide generic reusable patterns that are not specific to any domain.

### Core Utility Hooks

| Hook | Purpose |
|------|---------|
| `useDebounce` | Delay value updates |
| `useThrottle` | Limit function call frequency |
| `useLocalStorage` | Persist state to localStorage |
| `useSessionStorage` | Persist state to sessionStorage |
| `useTimeout` | Handle timeout callbacks |
| `useInterval` | Handle interval callbacks |
| `usePrevious` | Access previous value |
| `useToggle` | Toggle boolean state |
| `useMemo` | Memoize computed values |
| `useCallback` | Memoize callbacks |
| `useHover` | Track hover state |
| `useFocus` | Track focus state |
| `useKeyPress` | Track key press |
| `useSwipe` | Track swipe gestures |
| `useMediaQuery` | Match media queries |

### Utility Hook Pattern

```typescript
// Pattern for utility hooks
export const use{Utility} = <T>(initialValue: T) => {
  // Implementation
  return value;
};
```

### Utility Hooks List

#### useDebounce

```typescript
// hooks/utils/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  // Returns debounced value
};
```

#### useThrottle

```typescript
// hooks/utils/useThrottle.ts
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  // Returns throttled function
};
```

#### useLocalStorage

```typescript
// hooks/utils/useLocalStorage.ts
export interface UseLocalStorageOptions<T> {
  key: string;
  initialValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}
```

#### useMediaQuery

```typescript
// hooks/utils/useMediaQuery.ts
export interface UseMediaQueryResult {
  matches: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}
```

---

## 11. Hook Naming Standards

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Data Hooks** | `use{Entity}` | `usePlayer`, `useMuseum`, `useEvents` |
| **Feature Hooks** | `use{FeatureName}` | `useBattle`, `useGuild`, `useMarketplace` |
| **Telegram Hooks** | `useTelegram{Feature}` | `useTelegramUser`, `useTelegramTheme` |
| **UI Hooks** | `use{UIElement}` | `useModal`, `useToast`, `useForm` |
| **Analytics Hooks** | `use{TrackingType}` | `useAnalytics`, `useEventTracking` |
| **Utility Hooks** | `use{UtilityName}` | `useDebounce`, `useLocalStorage` |

### Prefix Patterns

| Prefix | Usage | Example |
|--------|-------|---------|
| `use` | All hooks | `usePlayer`, `useModal` |
| `useTelegram` | Telegram platform | `useTelegramUser` |
| `useFeature` | Feature modules | `useBattle` |
| `useTracking` | Analytics | `useEventTracking` |

### Return Pattern

```typescript
// Standard return interface
export interface Use{HookName}Result {
  // State (alphabetically sorted)
  data: DataType | null;
  error: Error | null;
  isLoading: boolean;
  
  // Derived state
  isEmpty: boolean;
  isError: boolean;
  isSuccess: boolean;
  
  // Actions
  refetch: () => Promise<void>;
  reset: () => void;
  
  // Specific functionality
  // ... more specific returns
}
```

### Type Export Pattern

```typescript
// Export types alongside hook
export interface Use{Entity}Options {
  // ...
}

export interface Use{Entity}Result {
  // ...
}

export const use{Entity} = (options: Use{Entity}Options): Use{Entity}Result => {
  // implementation
};

// Also export types for consumers
export type { Use{Entity}Result as {Entity}HookResult };
```

---

## 12. Error Handling Philosophy

### Error Handling Pattern

All hooks should handle errors consistently:

```typescript
export interface Use{HookName}Result {
  // ... other state
  
  error: Error | null;
  isError: boolean;
  
  // Error handling
  retry: () => Promise<void>;
  clearError: () => void;
}
```

### Loading/Error State Pattern

```
STATE TRANSITIONS:
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─────────┐    fetch    ┌──────────┐   success   ┌────────┐ │
│  │ initial │ ──────────▶│ loading  │ ──────────▶ │ data   │ │
│  └─────────┘            └──────────┘             └────────┘ │
│       │                      │                        │     │
│       │                      │ error                  │     │
│       │                      ▼                        │     │
│       │                 ┌─────────┐                   │     │
│       │                 │  error  │◀──────────────────┘     │
│       │                 └─────────┘    retry              │
│       │                      │                              │
│       │                      │ clear                        │
│       ▼                      ▼                              │
│  ┌─────────┐            ┌─────────┐                         │
│  │ initial │◀───────────│ loading │                         │
│  └─────────┘   reset    └─────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Error Handling Requirements

| Requirement | Description |
|-------------|-------------|
| **Loading State** | Every async hook exposes `isLoading` |
| **Error State** | Every async hook exposes `error` and `isError` |
| **Retry Mechanism** | Every async hook provides `retry()` |
| **Clear Error** | Users can clear error via `clearError()` |
| **Graceful Degradation** | Hooks should still return usable data on error when possible |

### Error Recovery

```typescript
// Example error recovery pattern
export const usePlayer = (options: UsePlayerOptions): UsePlayerResult => {
  const [state, setState] = useState<PlayerState>('idle');
  const [error, setError] = useState<Error | null>(null);
  
  const fetch = useCallback(async () => {
    setState('loading');
    setError(null);
    
    try {
      const data = await playerRepository.get(options.userId);
      setState('success');
      return data;
    } catch (e) {
      setError(e as Error);
      setState('error');
      throw e;
    }
  }, [options.userId]);
  
  const retry = useCallback(async () => {
    await fetch();
  }, [fetch]);
  
  const clearError = useCallback(() => {
    setError(null);
    if (state === 'error') {
      setState('idle');
    }
  }, [state]);
  
  return {
    // ... other returns
    error,
    isError: state === 'error',
    retry,
    clearError,
  };
};
```

---

## 13. Performance Philosophy

### Performance Guidelines

| Guideline | Description |
|-----------|-------------|
| **Memoization** | Use `useMemo` and `useCallback` appropriately |
| **Stable References** | Avoid creating new objects/arrays on every render |
| **Lazy Evaluation** | Defer expensive computations |
| **Unsubscribe** | Always clean up subscriptions |
| **Minimal Renders** | Structure state to minimize re-renders |

### Memoization Pattern

```typescript
// Memoize expensive computations
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(data, options);
}, [data, options]);

// Memoize callbacks
const handleAction = useCallback(async () => {
  await performAction(data);
}, [data]);
```

### Subscription Cleanup

```typescript
// Always clean up subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('changes')
    .on('*', handleChange)
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, [handleChange]);
```

### Avoiding Unnecessary Renders

```typescript
// Structure hooks to minimize re-renders
// ❌ Bad: Returns new object on every call
return {
  user,
  profile,  // New reference each time
  settings: { ...settings },  // New object
};

// ✅ Good: Use stable references
return {
  user,
  profile,
  settings,
};  // Stable reference if settings doesn't change

// Or use useMemo for derived values
const derivedValue = useMemo(() => ({
  fullName: `${profile.firstName} ${profile.lastName}`,
  isComplete: checkCompleteness(profile),
}), [profile]);
```

### Performance Checklist

- [ ] Does the hook use `useMemo` for expensive computations?
- [ ] Does the hook use `useCallback` for callbacks passed to children?
- [ ] Does the hook clean up all subscriptions in `useEffect` return?
- [ ] Are all dependencies in `useEffect`/`useCallback`/`useMemo` listed correctly?
- [ ] Does the hook avoid creating new objects/arrays on every render?
- [ ] Is the hook's state structure optimal for its consumers?

---

## 14. Testing Notes

### Testing Strategy

| Test Type | Tool | Scope |
|-----------|------|-------|
| **Unit Tests** | Vitest | Pure hook logic |
| **Integration Tests** | Vitest + Testing Library | Hook + store/service |
| **Component Tests** | Vitest + Testing Library | Hook in component context |

### Testing Patterns

#### Unit Test Pattern

```typescript
// hooks/data/usePlayer.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlayer } from './usePlayer';

// Mock dependencies
vi.mock('@/stores/playerStore', () => ({
  usePlayerStore: () => ({
    player: mockPlayer,
    setPlayer: vi.fn(),
  }),
}));

describe('usePlayer', () => {
  it('should return player data', async () => {
    const { result } = renderHook(() => usePlayer());
    
    await waitFor(() => {
      expect(result.current.player).toEqual(mockPlayer);
    });
  });
  
  it('should handle errors', async () => {
    // Test error case
  });
  
  it('should expose retry function', async () => {
    // Test retry
  });
});
```

#### Async Hook Testing

```typescript
// Testing async hooks
describe('useAsyncOperation', () => {
  it('should start in loading state', () => {
    const { result } = renderHook(() => useAsyncOperation());
    expect(result.current.isLoading).toBe(true);
  });
  
  it('should transition to success state', async () => {
    const { result } = renderHook(() => useAsyncOperation());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(expectedData);
    });
  });
  
  it('should handle errors', async () => {
    const { result } = renderHook(() => useAsyncOperation());
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });
});
```

#### Telegram Hook Testing

```typescript
// Testing Telegram hooks
describe('useTelegramUser', () => {
  beforeEach(() => {
    // Mock Telegram WebApp
    global.Telegram.WebApp = {
      initDataUnsafe: {
        user: mockTelegramUser,
      },
    } as any;
  });
  
  it('should return user data', () => {
    const { result } = renderHook(() => useTelegramUser());
    
    expect(result.current.user).toEqual(mockTelegramUser);
    expect(result.current.isAvailable).toBe(true);
  });
  
  it('should handle unavailable state', () => {
    delete global.Telegram.WebApp;
    
    const { result } = renderHook(() => useTelegramUser());
    
    expect(result.current.isAvailable).toBe(false);
  });
});
```

### Testing Checklist

- [ ] All data hooks have unit tests
- [ ] Error states are tested
- [ ] Loading states are tested
- [ ] Retry mechanisms are tested
- [ ] Async operations handle all states correctly
- [ ] Telegram hooks handle unavailable state
- [ ] Mocks are properly isolated
- [ ] Tests are deterministic

---

## 15. Future Expansion Notes

These hooks represent future concepts and should be created when the corresponding features are implemented.

### Future Hooks

#### AI Hooks

```typescript
// Future AI-related hooks (create when implementing AI features)
src/hooks/ai/
├── useAIHistorian.ts       # AI historian Q&A
├── useAINPCDialogue.ts    # AI NPC conversation
├── useContentGeneration.ts # AI content generation
└── index.ts
```

#### Web3 Hooks

```typescript
// Future Web3-related hooks (create when implementing Web3)
src/hooks/web3/
├── useNFTInventory.ts     # NFT collection
├── useWalletConnection.ts # Wallet connection
├── useTokenBalance.ts     # Token balance
└── index.ts
```

#### Creator Tools Hooks

```typescript
// Future creator tools hooks (create when implementing creator features)
src/hooks/creator/
├── useContentBuilder.ts   # Content builder
├── useCustomExhibits.ts   # Custom exhibit creation
└── index.ts
```

#### Esports Hooks

```typescript
// Future esports hooks (create when implementing esports)
src/hooks/esports/
├── useTournamentBracket.ts # Tournament management
├── useTeamManagement.ts    # Team operations
└── index.ts
```

### Expansion Criteria

Before creating a new hook category:

1. **Reusability** — Will this hook be used in 2+ places?
2. **Complexity** — Does it justify encapsulation?
3. **Independence** — Is it standalone or does it need deep integration?
4. **Testing** — Can it be tested in isolation?

---

## 16. Long-Term Philosophy

### Modularity

Hooks should remain modular:
- Each hook has a single responsibility
- Hooks compose to build complex functionality
- Clear interfaces between hooks
- Minimal coupling

### Simplified Development

Hooks simplify development by:
- Centralizing reusable logic
- Providing consistent patterns
- Reducing component complexity
- Making testing easier

### Future Scaling

Hook architecture scales through:
- Feature hooks for domain-specific logic
- Data hooks for domain data access
- Utility hooks for cross-cutting concerns
- Clear category separation

### Architecture Principles

1. **Composability** — Hooks build on each other
2. **Single Responsibility** — Each hook does one thing
3. **Predictability** — Same inputs → Same outputs
4. **Testability** — Easy to test in isolation
5. **Type Safety** — Full TypeScript coverage

### Migration Path

When refactoring to hooks:

1. **Identify Logic** — Find duplicated logic in components
2. **Extract Hook** — Create a new hook for the logic
3. **Test Hook** — Write tests for the hook
4. **Update Components** — Update components to use the hook
5. **Document** — Add documentation

### Enforcement

This architecture is enforced through:
- Code review checks
- Linting rules
- Type checking
- Test coverage requirements

---

## Summary

The Jolt Time hooks architecture provides:

| Property | Benefit |
|----------|---------|
| **Modular** | Each hook has single responsibility |
| **Reusable** | Logic centralized in hooks |
| **Predictable** | Consistent patterns everywhere |
| **Testable** | Easy to test in isolation |
| **Scalable** | Architecture supports growth |
| **Type-Safe** | Full TypeScript coverage |

All custom hooks must follow this architecture to ensure consistency and maintainability.

---

*Document Version: 1.0*
*Last Updated: 2024*
*Next Review: Quarterly*
