# Jolt Time — Folder Architecture

> **Single Source of Truth for Project Organization**
>
> This document defines the complete folder and project structure for the Jolt Time codebase. All future code must follow this structure to ensure consistency, scalability, and maintainability.

---

## Table of Contents

1. [Top-Level Architecture](#1-top-level-architecture)
2. [Frontend Structure (`src/`)](#2-frontend-structure-src)
3. [Feature-Based Architecture](#3-feature-based-architecture)
4. [Component Architecture](#4-component-architecture)
5. [Service Layer Structure](#5-service-layer-structure)
6. [Store Structure](#6-store-structure)
7. [Backend Structure](#7-backend-structure)
8. [Asset Structure](#8-asset-structure)
9. [Testing Structure](#9-testing-structure)
10. [Documentation Structure](#10-documentation-structure)
11. [Naming Standards](#11-naming-standards)
12. [Scaling Philosophy](#12-scaling-philosophy)
13. [Future Expansion Notes](#13-future-expansion-notes)
14. [Long-Term Philosophy](#14-long-term-philosophy)

---

## 1. Top-Level Architecture

```
Jolt-Time/
├── src/                      # Frontend application source code
├── public/                   # Static public assets
├── docs/                     # External documentation
├── scripts/                  # Build and deployment scripts
├── tests/                    # Cross-cutting test files
├── supabase/                 # Backend configuration and migrations
├── assets/                   # Global shared assets
├── .openhands/               # Agent knowledge and system docs
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Directory Purposes

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `src/` | Frontend application | React components, hooks, services, stores, types |
| `public/` | Static assets served as-is | Favicon, manifest, static images |
| `docs/` | External documentation | API docs, deployment guides, user guides |
| `scripts/` | Automation scripts | Build scripts, deployment automation, database scripts |
| `tests/` | Cross-cutting tests | Test configuration, shared fixtures, e2e tests |
| `supabase/` | Backend infrastructure | Edge Functions, RPC Functions, migrations, seeds |
| `assets/` | Global shared assets | Icons, images, illustrations, sounds, animations |
| `.openhands/` | Agent knowledge base | System docs, knowledge files, rules, agents |

### `.openhands/` Structure

```
.openhands/
├── knowledge/                # Feature and system knowledge files
│   ├── master-index.md
│   ├── game-loop.md
│   ├── economy.md
│   ├── museum-system.md
│   ├── pvp-arena.md
│   ├── events.md
│   └── [feature-system].md
├── agents/                   # Agent designer files
│   ├── museum-designer.md
│   ├── economy-designer.md
│   └── [feature]-designer.md
├── rules.md                  # Development rules
├── system.md                 # Master system documentation
└── folder-architecture.md    # This document
```

---

## 2. Frontend Structure (`src/`)

```
src/
├── app/                      # App-level setup and providers
│   ├── App.tsx               # Root application component
│   ├── AppProviders.tsx      # Context providers wrapper
│   └── app.css               # App-level styles
├── pages/                    # Route-level page components
│   ├── HomePage.tsx
│   ├── MuseumPage.tsx
│   ├── EventsPage.tsx
│   └── ProfilePage.tsx
├── features/                  # Feature-based modules (see Section 3)
├── components/                # Shared components (see Section 4)
├── hooks/                     # Shared custom React hooks
├── services/                  # External service integrations
├── repositories/             # Data access layer (Supabase)
├── stores/                    # Zustand state management
├── utils/                     # Utility functions
├── types/                     # TypeScript type definitions
├── constants/                 # Application constants
├── layouts/                   # Layout components
├── providers/                 # React context providers
├── assets/                    # Component-specific assets
├── pages/                     # Page-level components (deprecated, use features)
├── screens/                   # Full-screen components (deprecated, use features)
└── index.ts                   # Public API exports
```

### Directory Purposes

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `app/` | App-level setup | Root component, providers, global styles |
| `pages/` | Route pages | Components mapped to routes |
| `features/` | Feature modules | Self-contained feature packages |
| `components/` | Shared components | Reusable UI components |
| `hooks/` | Custom hooks | Reusable React hooks |
| `services/` | External services | API clients, Telegram, AdsGram |
| `repositories/` | Data access | Supabase data fetching and mutations |
| `stores/` | State management | Zustand stores |
| `utils/` | Helper functions | Pure utility functions |
| `types/` | Type definitions | TypeScript interfaces and types |
| `constants/` | Constants | Application-wide constants |
| `layouts/` | Layout components | Page layout wrappers |
| `providers/` | Context providers | React context providers |

### Current State vs Target

**Current State (Legacy):**
```
src/
├── screens/                  # Screen components (legacy)
├── services/                 # Services (partially legacy)
├── types/                    # Type definitions
├── api/                      # API calls (deprecated)
├── database/                 # Database utilities (legacy)
└── index.ts                  # Exports
```

**Target State (Feature-Based):**
```
src/
├── app/                      # App setup
├── pages/                    # Route pages
├── features/                 # Feature modules (NEW)
├── components/               # Shared components
├── hooks/                    # Custom hooks
├── services/                 # External services
├── repositories/             # Data access
├── stores/                   # Zustand stores
├── utils/                    # Utilities
├── types/                    # Type definitions
├── constants/                # Constants
├── layouts/                   # Layouts
├── providers/                 # Providers
└── index.ts                  # Exports
```

---

## 3. Feature-Based Architecture

Features are self-contained modules that encapsulate all related functionality.

### Feature Directory Structure

```
src/features/{feature-name}/
├── index.ts                  # Public API exports
├── {featureName}.module.css  # Feature styles
├── components/               # Feature-specific components
│   ├── {FeatureName}Card.tsx
│   ├── {FeatureName}List.tsx
│   ├── {FeatureName}Modal.tsx
│   └── index.ts
├── hooks/                    # Feature-specific hooks
│   ├── use{FeatureName}.ts
│   └── index.ts
├── services/                 # Feature-specific services
│   ├── {featureName}Api.ts
│   └── index.ts
├── stores/                   # Feature-specific stores (optional)
│   ├── {featureName}Store.ts
│   └── index.ts
├── types/                    # Feature-specific types
│   ├── {featureName}.types.ts
│   └── index.ts
├── utils/                    # Feature-specific utilities
│   ├── {featureName}Utils.ts
│   └── index.ts
└── constants/                # Feature-specific constants
    ├── {featureName}Constants.ts
    └── index.ts
```

### Core Features

```
src/features/
├── core/                     # Core game systems
│   ├── player/               # Player profile and progression
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── index.ts
│   ├── energy/              # Energy system
│   ├── progression/         # XP, levels, ranks
│   └── inventory/           # Item inventory
├── museum/                   # Museum and artifact system
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── events/                   # Event system
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── pvp/                      # PvP arena and tournaments
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── profile/                   # User profile and settings
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── economy/                   # Currency and economy
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── guilds/                    # Guild system
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── marketplace/               # Marketplace and trading
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── social/                    # Friends and social features
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── rewards/                   # Daily rewards and bonuses
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── quests/                    # Quest and mission system
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
├── world-map/                 # World map and navigation
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── index.ts
└── battle-pass/               # Battle pass system
    ├── components/
    ├── hooks/
    ├── services/
    ├── stores/
    ├── types/
    └── index.ts
```

### Feature Module Rules

1. **Self-Contained**: Each feature module contains everything it needs
2. **No Cross-Feature Imports**: Features should not import from other features directly
3. **Public API Only**: Features communicate via exported hooks and services
4. **Isolated State**: Feature-specific stores are isolated per feature
5. **Shared Layer**: Use `src/components/`, `src/hooks/`, `src/services/` for cross-feature code

---

## 4. Component Architecture

### Component Categories

```
src/components/
├── ui/                       # Base UI primitives
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   ├── Input/
│   ├── Card/
│   ├── Badge/
│   ├── Avatar/
│   ├── Progress/
│   ├── Modal/
│   ├── Tooltip/
│   ├── Skeleton/
│   └── index.ts
├── layout/                    # Layout components
│   ├── PageLayout/
│   │   ├── PageLayout.tsx
│   │   ├── PageLayout.module.css
│   │   └── index.ts
│   ├── Section/
│   ├── Grid/
│   ├── Container/
│   ├── Flex/
│   ├── Stack/
│   └── index.ts
├── form/                     # Form components
│   ├── TextField/
│   │   ├── TextField.tsx
│   │   ├── TextField.module.css
│   │   └── index.ts
│   ├── Select/
│   ├── Checkbox/
│   ├── Slider/
│   ├── Toggle/
│   ├── Radio/
│   └── index.ts
├── game/                      # Game-specific components
│   ├── CurrencyDisplay/
│   │   ├── CurrencyDisplay.tsx
│   │   ├── CurrencyDisplay.module.css
│   │   └── index.ts
│   ├── ArtifactCard/
│   ├── MissionCard/
│   ├── BattleCard/
│   ├── EnergyBar/
│   ├── ProgressBar/
│   ├── LevelBadge/
│   └── index.ts
├── social/                    # Social feature components
│   ├── FriendCard/
│   ├── GuildCard/
│   ├── LeaderboardEntry/
│   ├── ReferralCard/
│   └── index.ts
├── modals/                    # Modal components
│   ├── ConfirmModal/
│   ├── RewardPopup/
│   ├── InfoModal/
│   ├── ErrorModal/
│   └── index.ts
├── navigation/                # Navigation components
│   ├── BottomNav/
│   │   ├── BottomNav.tsx
│   │   ├── BottomNav.module.css
│   │   └── index.ts
│   ├── Header/
│   ├── Tabs/
│   ├── Breadcrumbs/
│   ├── TabBar/
│   └── index.ts
└── shared/                    # Cross-feature shared components
    ├── LoadingSpinner/
    ├── ErrorBoundary/
    ├── EmptyState/
    ├── AsyncContent/
    ├── ConfirmButton/
    └── index.ts
```

### Component Naming Conventions

| Category | Prefix | Example |
|----------|--------|---------|
| UI Primitives | None | `Button.tsx`, `Card.tsx` |
| Layout | None | `PageLayout.tsx`, `Section.tsx` |
| Form | None | `TextField.tsx`, `Select.tsx` |
| Game | None | `ArtifactCard.tsx`, `CurrencyDisplay.tsx` |
| Social | None | `FriendCard.tsx`, `LeaderboardEntry.tsx` |
| Modals | Modal | `ConfirmModal.tsx`, `RewardPopup.tsx` |
| Navigation | None | `BottomNav.tsx`, `Header.tsx` |
| Feature Components | `{FeatureName}` | `MuseumCard.tsx`, `EventBanner.tsx` |

### Component Structure Pattern

Each component follows this pattern:

```
{ComponentName}/
├── {ComponentName}.tsx        # Main component
├── {ComponentName}.module.css # Component styles
├── {ComponentName}.types.ts  # Prop types (if complex)
├── {ComponentName}.test.tsx   # Tests (if applicable)
└── index.ts                   # Re-export
```

---

## 5. Service Layer Structure

### Service Organization

```
src/services/
├── telegram/                  # Telegram platform services
│   ├── TelegramBot.ts
│   ├── BotService.ts
│   ├── MiniAppIntegration.ts
│   ├── InlineKeyboard.ts
│   ├── BotLogger.ts
│   ├── localization/
│   │   ├── Localization.ts
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── es.json
│   │   │   └── [locale].json
│   │   └── index.ts
│   └── index.ts
├── ads/                       # AdsGram integration
│   ├── AdsGramService.ts
│   ├── AdsGramAdapter.ts
│   ├── AdRepository.ts
│   ├── AdScheduler.ts
│   ├── AdRewardService.ts
│   └── index.ts
├── analytics/                 # Analytics services
│   ├── AnalyticsService.ts
│   ├── EventTracker.ts
│   ├── MetricsCollector.ts
│   └── index.ts
├── api/                       # API service layer
│   ├── apiClient.ts           # Base API client
│   ├── supabaseClient.ts      # Supabase client
│   ├── endpoints/
│   │   ├── player.ts
│   │   ├── museum.ts
│   │   ├── events.ts
│   │   └── [feature].ts
│   └── index.ts
└── notification/              # Notification services
    ├── NotificationService.ts
    ├── UserPreferencesService.ts
    ├── InactivePlayerService.ts
    ├── notification-messages.ts
    └── index.ts
```

### Service Pattern

Services follow the singleton pattern with dependency injection:

```typescript
// Example service structure
class ExampleService {
  private static instance: ExampleService;
  
  private constructor(
    private readonly apiClient: ApiClient,
    private readonly store: ExampleStore
  ) {}
  
  static getInstance(): ExampleService {
    if (!ExampleService.instance) {
      ExampleService.instance = new ExampleService(
        ApiClient.getInstance(),
        ExampleStore.getInstance()
      );
    }
    return ExampleService.instance;
  }
  
  async doSomething(): Promise<Result> {
    // Implementation
  }
}

export const getExampleService = ExampleService.getInstance;
```

---

## 6. Store Structure

### Zustand Store Organization

```
src/stores/
├── player/                    # Player store module
│   ├── playerStore.ts         # Player state and actions
│   ├── playerSelectors.ts     # Memoized selectors
│   ├── playerPersistence.ts   # Persistence configuration
│   └── index.ts
├── economy/                   # Economy store module
│   ├── economyStore.ts
│   ├── economySelectors.ts
│   ├── economyPersistence.ts
│   └── index.ts
├── museum/                    # Museum store module
│   ├── museumStore.ts
│   ├── museumSelectors.ts
│   ├── museumPersistence.ts
│   └── index.ts
├── events/                    # Events store module
│   ├── eventsStore.ts
│   ├── eventsSelectors.ts
│   ├── eventsPersistence.ts
│   └── index.ts
├── pvp/                       # PvP store module
│   ├── pvpStore.ts
│   ├── pvpSelectors.ts
│   ├── pvpPersistence.ts
│   └── index.ts
├── social/                    # Social store module
│   ├── socialStore.ts
│   ├── socialSelectors.ts
│   ├── socialPersistence.ts
│   └── index.ts
├── settings/                  # Settings store module
│   ├── settingsStore.ts
│   ├── settingsSelectors.ts
│   ├── settingsPersistence.ts
│   └── index.ts
├── ui/                        # UI store module
│   ├── uiStore.ts
│   ├── uiSelectors.ts
│   └── index.ts
├── rootStore.ts               # Root store combining all stores
├── StoreProvider.tsx           # React context provider
└── index.ts                   # Store exports
```

### Store Module Pattern

```typescript
// stores/player/playerStore.ts
interface PlayerState {
  id: string;
  name: string;
  level: number;
  experience: number;
  // ... other state
}

interface PlayerActions {
  setPlayer: (player: PlayerState) => void;
  updateExperience: (amount: number) => void;
  // ... other actions
}

type PlayerStore = PlayerState & PlayerActions;

export const createPlayerStore = () => {
  return create<PlayerStore>((set, get) => ({
    // Initial state
    id: '',
    name: '',
    level: 1,
    experience: 0,
    
    // Actions
    setPlayer: (player) => set(player),
    updateExperience: (amount) => set((state) => ({
      experience: state.experience + amount
    })),
  }));
};
```

### Persistence Strategy

| Store | Persistence | Sync |
|-------|-------------|------|
| Player | Full | On meaningful change |
| Economy | Full | On meaningful change |
| Museum | Full | On meaningful change |
| Events | Partial | On session end |
| PvP | None | Real-time only |
| Social | Partial | On meaningful change |
| Settings | Full | Immediate |
| UI | None | Session only |

---

## 7. Backend Structure

### Supabase Organization

```
supabase/
├── functions/                 # Edge Functions
│   ├── _shared/              # Shared code across functions
│   │   ├── cors.ts
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │   └── database.ts
│   ├── send-notification/    # Notification sending function
│   │   ├── index.ts
│   │   └── types.ts
│   ├── process-ad-reward/    # Ad reward processing
│   ├── daily-reset/          # Daily reset cron
│   ├── calculate-rankings/   # Ranking calculations
│   ├── cleanup-inactive/     # Inactive user cleanup
│   └── [feature]-function/   # Feature-specific functions
├── migrations/               # Database migrations
│   ├── 001_add_telegram_fields_to_users.sql
│   ├── 002_create_notification_preferences.sql
│   ├── 003_create_notifications_queue.sql
│   └── [timestamp]_[description].sql
├── seeds/                     # Database seeds
│   ├── 001_currencies.sql
│   ├── 002_artifacts.sql
│   ├── 003_eras.sql
│   └── [description].sql
├── rpc/                       # RPC Function definitions
│   ├── player/
│   │   ├── get_player.sql
│   │   ├── update_player.sql
│   │   └── [operation].sql
│   ├── museum/
│   │   └── [operation].sql
│   └── [feature]/
│       └── [operation].sql
├── triggers/                  # Database triggers
│   ├── on_user_create.sql
│   ├── on_inventory_update.sql
│   └── [description].sql
├── views/                     # Database views
│   ├── player_stats.sql
│   ├── leaderboard.sql
│   └── [description].sql
└── config.toml                # Supabase configuration
```

### Migration Naming Convention

```
{timestamp}_{sequence}_{description}.sql
```

Examples:
- `001_add_telegram_fields_to_users.sql`
- `002_create_notification_preferences.sql`
- `20240115_001_create_user_daily_rewards.sql`

### Edge Function Structure

```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user from auth header
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process request
    const { data } = await req.json();
    
    // Business logic here
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 8. Asset Structure

### Global Assets Organization

```
assets/
├── icons/                    # Icon assets
│   ├── currency/            # Currency icons
│   │   ├── shard.svg
│   │   ├── chrono-coin.svg
│   │   └── [currency].svg
│   ├── ui/                  # UI icons
│   │   ├── settings.svg
│   │   ├── close.svg
│   │   └── [icon].svg
│   ├── navigation/          # Navigation icons
│   │   ├── home.svg
│   │   ├── museum.svg
│   │   └── [nav].svg
│   ├── features/            # Feature-specific icons
│   │   ├── artifact.svg
│   │   ├── event.svg
│   │   └── [feature].svg
│   └── misc/                # Miscellaneous icons
├── images/                  # Image assets
│   ├── backgrounds/         # Background images
│   │   ├── home-bg.webp
│   │   └── [page]-bg.webp
│   ├── cards/               # Card backgrounds
│   │   ├── common-card.webp
│   │   ├── rare-card.webp
│   │   └── [rarity]-card.webp
│   ├── avatars/             # Avatar images
│   │   ├── default-avatar.webp
│   │   └── [avatar].webp
│   └── ui/                  # UI images
├── illustrations/           # Illustration assets
│   ├── empty-state/         # Empty state illustrations
│   ├── achievements/         # Achievement illustrations
│   ├── rewards/             # Reward illustrations
│   └── [category]/          # Category illustrations
├── sounds/                  # Sound effects
│   ├── ui/                  # UI sounds
│   │   ├── click.mp3
│   │   ├── success.mp3
│   │   └── [sound].mp3
│   ├── game/                # Game sounds
│   │   ├── level-up.mp3
│   │   ├── reward.mp3
│   │   └── [sound].mp3
│   └── music/               # Background music
│       ├── main-theme.mp3
│       └── [theme].mp3
├── animations/               # Animation assets
│   ├── lottie/              # Lottie animation files
│   │   ├── loading.json
│   │   ├── reward.json
│   │   └── [animation].json
│   ├── rive/                # Rive animation files
│   └── [format]/            # Other animation formats
└── fonts/                    # Custom fonts
    ├── primary/
    └── secondary/
```

### Component-Specific Assets

```
src/features/museum/components/ArtifactCard/
├── ArtifactCard.tsx
├── ArtifactCard.module.css
└── assets/
    ├── artifact-placeholder.svg
    └── [image].svg
```

### Asset Loading Strategy

| Asset Type | Loading Strategy | Format |
|------------|------------------|--------|
| Icons | Inline SVG / Icon component | SVG |
| Images | Lazy loading / CDN | WebP |
| Illustrations | On-demand | SVG / WebP |
| Sounds | Preload critical / Lazy load others | MP3 |
| Animations | On-demand | Lottie JSON |
| Fonts | Subset + preload | WOFF2 |

---

## 9. Testing Structure

### Test Organization

```
tests/
├── unit/                     # Unit tests
│   ├── setup.ts             # Test setup
│   ├── utils/               # Utility function tests
│   │   ├── formatCurrency.test.ts
│   │   └── [util].test.ts
│   ├── hooks/               # Hook tests
│   │   ├── usePlayer.test.ts
│   │   └── [hook].test.ts
│   └── services/            # Service tests
│       ├── EnergyService.test.ts
│       └── [service].test.ts
├── integration/              # Integration tests
│   ├── api/                 # API integration tests
│   │   ├── player.api.test.ts
│   │   └── [feature].api.test.ts
│   ├── stores/              # Store integration tests
│   │   └── [store].integration.test.ts
│   └── database/            # Database integration tests
│       └── [feature].db.test.ts
├── e2e/                      # End-to-end tests
│   ├── pages/               # Page object models
│   │   ├── HomePage.ts
│   │   ├── MuseumPage.ts
│   │   └── [Page].ts
│   ├── flows/               # User flow tests
│   │   ├── onboarding.spec.ts
│   │   ├── gameplay.spec.ts
│   │   └── [flow].spec.ts
│   ├── fixtures/            # Test fixtures
│   │   ├── users.json
│   │   └── [fixture].json
│   └── playwright.config.ts
├── fixtures/                 # Shared test fixtures
│   ├── mockPlayer.json
│   ├── mockArtifacts.json
│   └── [fixture].json
├── mocks/                    # Mock configurations
│   ├── server.ts            # MSW server setup
│   ├── handlers/            # Request handlers
│   └── [mocks].ts
├── setup.ts                  # Global test setup
├── teardown.ts               # Global test teardown
└── vitest.config.ts          # Test configuration
```

### Test Naming Conventions

| Test Type | File Pattern | Example |
|-----------|--------------|---------|
| Unit | `{name}.test.ts` | `formatCurrency.test.ts` |
| Hook | `use{Feature}.test.ts` | `usePlayer.test.ts` |
| Component | `{Component}.test.tsx` | `Button.test.tsx` |
| Integration | `{feature}.integration.test.ts` | `player.integration.test.ts` |
| E2E | `{flow}.spec.ts` | `onboarding.spec.ts` |
| API | `{feature}.api.test.ts` | `museum.api.test.ts` |

### Test Coverage Requirements

| Category | Target Coverage |
|----------|----------------|
| Utility Functions | 95%+ |
| Custom Hooks | 90%+ |
| Service Methods | 90%+ |
| Store Actions | 85%+ |
| Components | Key interactions |
| API Endpoints | 80%+ |

---

## 10. Documentation Structure

### Documentation Organization

```
docs/
├── architecture/             # Architecture documentation
│   ├── system-overview.md
│   ├── folder-architecture.md
│   ├── api-architecture.md
│   ├── database-schema.md
│   └── [topic]-architecture.md
├── gameplay/                  # Gameplay documentation
│   ├── getting-started.md
│   ├── progression.md
│   ├── artifacts.md
│   ├── museum.md
│   ├── pvp.md
│   ├── events.md
│   ├── guilds.md
│   └── [feature]-guide.md
├── business/                  # Business documentation
│   ├── monetization.md
│   ├── economy-balance.md
│   ├── roadmap.md
│   └── [topic].md
├── technical/                 # Technical documentation
│   ├── setup.md
│   ├── deployment.md
│   ├── environment.md
│   ├── troubleshooting.md
│   ├── contributing.md
│   └── [topic].md
├── api/                       # API documentation
│   ├── endpoints/
│   │   ├── player.md
│   │   ├── museum.md
│   │   └── [feature].md
│   ├── webhooks.md
│   └── [topic].md
└── README.md                  # Documentation index
```

### Knowledge Files (`.openhands/knowledge/`)

```
.openhands/knowledge/
├── master-index.md            # Master documentation index
├── system-overview.md         # System overview
├── game-loop.md               # Core game loop
├── progression.md             # Progression system
├── economy.md                 # Economy system
├── currencies.md              # Currency details
├── museum.md                  # Museum system
├── artifacts.md              # Artifact system
├── events.md                  # Event system
├── pvp.md                     # PvP system
├── social.md                  # Social features
├── monetization.md            # Monetization strategy
├── analytics.md               # Analytics setup
├── api-architecture.md        # API design
├── database-schema.md         # Database design
├── telegram-architecture.md   # Telegram integration
├── component-library.md       # Component specs
├── design-system.md           # Design tokens
├── state-management.md        # State management
├── testing.md                 # Testing strategy
├── performance.md              # Performance guidelines
├── accessibility.md           # Accessibility guidelines
├── security.md                # Security guidelines
└── [feature-system].md        # Feature-specific docs
```

---

## 11. Naming Standards

### File Naming

| Type | Convention | Examples |
|------|------------|----------|
| Components | PascalCase | `ArtifactCard.tsx`, `CurrencyDisplay.tsx` |
| Hooks | camelCase with `use` prefix | `usePlayer.ts`, `useEnergy.ts` |
| Services | camelCase | `telegramBot.ts`, `adsGramService.ts` |
| Stores | camelCase with `Store` suffix | `playerStore.ts`, `economyStore.ts` |
| Types | PascalCase | `Player.ts`, `Artifact.ts` |
| Utils | camelCase | `formatCurrency.ts`, `dateUtils.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ENERGY.ts`, `API_ENDPOINTS.ts` |
| Styles | Same as component | `ArtifactCard.module.css` |
| Tests | Same as target + `.test` | `ArtifactCard.test.tsx` |
| Config | camelCase or kebab-case | `vite.config.ts`, `tsconfig.json` |

### Folder Naming

| Type | Convention | Examples |
|------|------------|----------|
| Features | kebab-case | `museum/`, `battle-pass/` |
| Components | PascalCase | `ArtifactCard/` | |
| Hooks | camelCase | `usePlayer/` |
| Services | camelCase | `telegram/` |
| Stores | kebab-case | `player/` |
| Types | camelCase | `types/` |
| Utils | camelCase | `utils/` |
| Constants | kebab-case | `constants/` |

### Component Naming

| Type | Pattern | Examples |
|------|---------|----------|
| Base Components | `{Name}` | `Button`, `Card`, `Input` |
| Feature Components | `{Feature}{Name}` | `MuseumCard`, `EventBanner` |
| Page Components | `{Name}Page` | `HomePage`, `ProfilePage` |
| Layout Components | `{Name}Layout` | `MainLayout`, `GameLayout` |
| Modal Components | `{Name}Modal` | `ConfirmModal`, `RewardModal` |
| Utility Components | `{Name}Utils` | `DateUtils`, `FormatUtils` |

### Hook Naming

| Type | Pattern | Examples |
|------|---------|----------|
| State Hooks | `use{StateName}` | `usePlayer`, `useEnergy` |
| Derived Hooks | `use{Computation}` | `usePlayerLevel`, `useCanAfford` |
| Effect Hooks | `use{Action}` | `useFetchPlayer`, `useSubscribe` |
| Custom Hooks | `use{Description}` | `useCountdown`, `useMediaQuery` |

### Type Naming

| Type | Pattern | Examples |
|------|---------|----------|
| Interfaces | `{Name}` or `I{Name}` | `Player`, `IPlayerData` |
| Types | `{Name}Type` | `PlayerStateType`, `RewardType` |
| Enums | `{Name}Enum` or `{Name}s` | `PlayerStatus`, `RewardTypes` |
| Props | `{ComponentName}Props` | `ButtonProps`, `CardProps` |
| State | `{Feature}State` | `PlayerState`, `MuseumState` |
| Actions | `{Feature}Actions` | `PlayerActions`, `GameActions` |

---

## 12. Scaling Philosophy

### 10 Features: Baseline

At 10 features, the architecture supports:

```
src/features/
├── core/           # Player, Energy, Progression, Inventory
├── museum/         # Museum system
├── events/         # Event system
├── pvp/            # PvP arena
├── profile/        # User profile
├── economy/        # Currency system
├── guilds/         # Guild system
├── rewards/        # Daily rewards
├── quests/         # Quest system
└── social/         # Friends system
```

### 50 Features: Extended

At 50 features, the architecture supports:

```
src/features/
├── core/           # Core systems
├── museum/         # Museum + Collections + Exhibits
├── events/         # Events + Seasons + Challenges
├── pvp/            # Arena + Tournaments + Leagues
├── profile/        # Profile + Settings + Stats
├── economy/        # Economy + Marketplace + Wallet
├── guilds/         # Guilds + Wars + Alliances
├── rewards/        # Rewards + Daily + Streaks
├── quests/         # Quests + Missions + Objectives
├── social/         # Social + Friends + Chat
├── world/          # World Map + Travel + Eras
├── battle-pass/    # Battle Pass + Seasons
├── leaderboards/   # Rankings + Seasons
├── achievements/   # Achievements + Milestones
├── artifacts/      # Artifacts + Evolution + Sets
├── capsules/       # Capsules + Gacha + Collections
├── gifts/          # Gifts + Trading + Exchange
├── support/        # Support + Tickets + FAQ
├── admin/          # Admin Tools + Moderation
├── analytics/      # Analytics + Metrics + Reports
└── [feature]/     # New features follow same pattern
```

### 100+ Features: Enterprise

At 100+ features, the architecture introduces domain grouping:

```
src/
├── features/
│   ├── core/              # Core game systems
│   │   ├── player/
│   │   ├── energy/
│   │   ├── progression/
│   │   ├── inventory/
│   │   └── _shared/      # Shared core utilities
│   ├── gameplay/          # Gameplay features
│   │   ├── museum/
│   │   ├── artifacts/
│   │   ├── world/
│   │   ├── quests/
│   │   └── _shared/
│   ├── social/             # Social features
│   │   ├── friends/
│   │   ├── guilds/
│   │   ├── chat/
│   │   └── _shared/
│   ├── competitive/        # Competitive features
│   │   ├── pvp/
│   │   ├── tournaments/
│   │   ├── leaderboards/
│   │   └── _shared/
│   ├── events/             # Event features
│   │   ├── seasonal/
│   │   ├── limited/
│   │   ├── challenges/
│   │   └── _shared/
│   ├── monetization/       # Monetization features
│   │   ├── shop/
│   │   ├── marketplace/
│   │   ├── battle-pass/
│   │   ├── subscriptions/
│   │   └── _shared/
│   ├── systems/            # System features
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── achievements/
│   │   └── _shared/
│   └── platform/           # Platform features
│       ├── admin/
│       ├── analytics/
│       ├── support/
│       └── _shared/
```

### Scaling Principles

1. **Domain Grouping**: Group related features by domain at scale
2. **Shared Layer**: Extract common patterns to `src/components/`, `src/hooks/`, `src/services/`
3. **Clear Boundaries**: Features communicate only through public APIs
4. **Incremental**: Add domains only when features exceed manageable count
5. **Refactor Tolerance**: Structure supports moving features between domains

---

## 13. Future Expansion Notes

These folders represent future concepts and should be created when the corresponding features are implemented.

### Planned Expansions

```
# Future folder structure - create when implementing

# AI Integration
src/features/ai/
├── chat/                    # AI chat assistant
├── recommendations/          # AI-powered recommendations
├── content-generation/       # AI content generation
└── npc-dialogue/            # AI NPC dialogue

# Web3 Integration
src/features/web3/
├── wallet/                  # Wallet integration
├── nft/                     # NFT marketplace
├── tokens/                  # Token management
└── blockchain/               # Blockchain interactions

# Creator Tools
src/features/creator/
├── builder/                 # Custom content builder
├── editor/                  # Content editor
├── templates/               # Content templates
└── sharing/                # Content sharing

# Esports
src/features/esports/
├── tournaments/             # Esports tournaments
├── teams/                  # Team management
├── broadcasts/              # Live broadcasts
└── betting/                # (if applicable)

# LiveOps
src/features/liveops/
├── campaigns/               # Live operations campaigns
├── experiments/             # A/B experiments
├── feature-flags/           # Feature flags
└── announcements/           # In-app announcements
```

### Future Directory Structure

```
# Additional top-level directories for future phases

# /workspace/project/Jolt-Time/
├── web/                     # Standalone web application (future)
├── admin/                   # Admin dashboard (future)
├── creator-portal/          # Content creator portal (future)
├── api-docs/                # Public API documentation (future)
├── scripts/                 # Already exists
│   ├── deploy/              # Deployment scripts
│   ├── ci/                  # CI/CD scripts
│   ├── db/                  # Database scripts
│   └── analytics/           # Analytics scripts
└── infrastructure/          # Infrastructure as code (future)
    ├── terraform/
    └── kubernetes/
```

### Expansion Decision Criteria

Before creating a new top-level directory, evaluate:

1. **Scale**: Will it contain 5+ features?
2. **Independence**: Is it largely independent from existing features?
3. **Team Ownership**: Will a specific team own it?
4. **Deployment**: Does it have distinct deployment requirements?

If all answers are yes, create a new domain group.

---

## 14. Long-Term Philosophy

### Predictability

The folder structure follows consistent patterns:

- **Location Consistency**: Files are always in expected locations
- **Naming Consistency**: Files follow documented naming conventions
- **Pattern Consistency**: All features follow the same internal structure
- **Import Consistency**: Import paths follow predictable patterns

### Scalability

The structure scales from 10 to 100+ features:

- **Feature Modules**: Self-contained feature packages
- **Domain Grouping**: Features group by domain at scale
- **Shared Layer**: Common code extracted to shared directories
- **Clear Boundaries**: Features have well-defined interfaces

### Reduced Technical Debt

The structure prevents common technical debt:

- **No Circular Dependencies**: Clear dependency direction
- **No Feature Envy**: Features own their code
- **No God Components**: Components have single responsibilities
- **No Magic Numbers**: Constants are centralized

### Simplified Onboarding

New team members can navigate the codebase:

- **Intuitive Layout**: Structure matches mental model
- **Consistent Patterns**: Same patterns everywhere
- **Clear Documentation**: This document serves as guide
- **Feature Isolation**: Features can be understood in isolation

### Architectural Principles

1. **Feature Isolation**: Features do not import from each other
2. **Shared Layer**: Cross-cutting concerns in shared directories
3. **Clear Hierarchy**: Clear layers (UI → Hook → Service → Repository → API)
4. **Single Responsibility**: Each file does one thing well
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Migration Path

When restructuring legacy code:

1. **Identify Features**: Extract code into feature modules
2. **Move to Shared**: Extract common code to shared directories
3. **Update Imports**: Update all import paths
4. **Test Thoroughly**: Ensure all functionality works
5. **Document Changes**: Update this document

### Enforcement

This structure is enforced through:

1. **Code Review**: PRs check structure compliance
2. **ESLint Rules**: Lint rules enforce naming conventions
3. **Automated Checks**: CI validates structure
4. **Documentation**: This document serves as reference

---

## Summary

The Jolt Time folder architecture provides:

| Property | Benefit |
|----------|---------|
| **Predictable** | Files in expected locations |
| **Scalable** | Handles 10 to 100+ features |
| **Maintainable** | Clear separation of concerns |
| **Onboardable** | Easy for new team members |
| **Flexible** | Adapts to changing requirements |
| **Testable** | Clear testing structure |

All future code must follow this structure to ensure consistency and maintainability.

---

*Document Version: 1.0*
*Last Updated: 2024*
*Next Review: Quarterly*
