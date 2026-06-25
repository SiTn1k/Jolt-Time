# Jolt Time — Shared Types Architecture

## Overview

The Shared Types Architecture establishes TypeScript as the single source of truth for all data structures across the Jolt Time project. By centralizing type definitions, the architecture ensures consistency, improves type safety, and simplifies maintenance across all application layers.

**Architecture Status:** Design Specification Only
**Implementation:** Not Started (building on existing `src/types/` foundation)

---

## 1. Type Categories

The Shared Types system encompasses six primary categories, each serving a distinct architectural layer.

### 1.1 Domain Models

**Purpose:** Represent core business entities and concepts.

**Scope:**
- Player and user entities
- Game entities (artifacts, items, currencies)
- System entities (events, seasons, tournaments)
- Social entities (guilds, friends, leaderboards)

**Characteristics:**
- Rich, nested structures
- Business logic attached
- Long-lived (persist across sessions)

### 1.2 DTOs (Data Transfer Objects)

**Purpose:** Transfer data between application layers with controlled shape.

**Scope:**
- Request DTOs (client → server)
- Response DTOs (server → client)
- Payload DTOs (service → service)
- Transport DTOs (API → external systems)

**Characteristics:**
- Flat, serialized-friendly structures
- No business logic
- Versioned for API compatibility

### 1.3 API Contracts

**Purpose:** Define contracts for external and internal API communication.

**Scope:**
- REST API responses
- RPC function responses
- Edge Function interfaces
- Telegram Bot API types
- Webhook payloads

**Characteristics:**
- Strict schema definitions
- Documented with comments
- Stable across versions

### 1.4 Database Types

**Purpose:** Represent database entities and query results.

**Scope:**
- Table row types (Supabase generated types)
- Query result types
- Migration types
- View types

**Characteristics:**
- Match database schema exactly
- Generated from migrations
- Strict nullability

### 1.5 UI Types

**Purpose:** Support presentation layer type safety.

**Scope:**
- Form state types
- Component prop types
- Modal/dialog types
- Navigation param types

**Characteristics:**
- Framework-specific (React)
- Support component composition
- Often derived from Domain Models

### 1.6 Shared Utility Types

**Purpose:** Reusable type utilities across all categories.

**Scope:**
- Generic containers (Result, Option)
- Pagination and sorting types
- Metadata and status types
- Event and callback types

**Characteristics:**
- Generic and composable
- Framework-agnostic
- Highly reusable

---

## 2. Type Philosophy

The Shared Types system embodies three core principles that guide all type decisions.

### 2.1 Predictability

Types must be consistent and follow predictable patterns.

- **Naming Consistency:** Types follow clear naming conventions
- **Structure Consistency:** Similar domains have similar shapes
- **Behavior Consistency:** Type operations behave predictably

### 2.2 Safety

Types must catch errors at compile time, not runtime.

- **Strict Mode:** TypeScript strict mode enabled globally
- **No Implicit Any:** All types explicitly defined
- **Exhaustive Checks:** Discriminated unions fully covered
- **Null Safety:** Optional types explicitly marked

### 2.3 Maintainability

Types must be easy to understand, modify, and extend.

- **Single Source of Truth:** Each type defined once
- **Clear Documentation:** Complex types have explanatory comments
- **Logical Organization:** Types grouped by domain, not by technical concern

---

## 3. Folder Structure

The types follow a predictable directory structure that mirrors application architecture.

### 3.1 Directory Layout

```
src/
├── types/
│   ├── domain/                  # Core business entities
│   │   ├── player/
│   │   │   ├── player.ts
│   │   │   ├── player-stats.ts
│   │   │   └── player-preferences.ts
│   │   ├── artifact/
│   │   │   ├── artifact.ts
│   │   │   ├── artifact-rarity.ts
│   │   │   └── artifact-set.ts
│   │   ├── museum/
│   │   │   ├── museum.ts
│   │   │   └── collection.ts
│   │   ├── economy/
│   │   │   ├── currency.ts
│   │   │   ├── transaction.ts
│   │   │   └── wallet.ts
│   │   ├── event/
│   │   │   ├── event.ts
│   │   │   └── season.ts
│   │   ├── guild/
│   │   │   ├── guild.ts
│   │   │   └── guild-member.ts
│   │   ├── pvp/
│   │   │   ├── battle.ts
│   │   │   └── tournament.ts
│   │   └── social/
│   │       ├── friend.ts
│   │       └── leaderboard.ts
│   ├── dto/                     # Data Transfer Objects
│   │   ├── requests/
│   │   │   ├── claim-reward.dto.ts
│   │   │   ├── spend-currency.dto.ts
│   │   │   └── update-profile.dto.ts
│   │   ├── responses/
│   │   │   ├── player-profile.dto.ts
│   │   │   ├── inventory.dto.ts
│   │   │   └── event-details.dto.ts
│   │   └── payloads/
│   │       ├── reward-payload.ts
│   │       └── notification-payload.ts
│   ├── api/                     # API contract types
│   │   ├── supabase/
│   │   │   ├── supabase-client.ts
│   │   │   └── supabase-types.ts (generated)
│   │   ├── telegram/
│   │   │   ├── telegram-user.ts
│   │   │   ├── telegram-init-data.ts
│   │   │   └── telegram-callback.ts
│   │   └── rpc/
│   │       ├── rpc-request.ts
│   │       └── rpc-response.ts
│   ├── database/                # Database entity types
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── artifact.entity.ts
│   │   │   └── transaction.entity.ts
│   │   ├── queries/
│   │   │   ├── player-queries.ts
│   │   │   └── inventory-queries.ts
│   │   └── migrations/
│   │       └── migration-types.ts
│   ├── ui/                      # Presentation layer types
│   │   ├── forms/
│   │   │   ├── profile-form.ts
│   │   │   ├── settings-form.ts
│   │   │   └── feedback-form.ts
│   │   ├── components/
│   │   │   ├── button.ts
│   │   │   ├── card.ts
│   │   │   └── modal.ts
│   │   ├── navigation/
│   │   │   ├── route-params.ts
│   │   │   └── navigation-state.ts
│   │   └── screens/
│   │       ├── home-screen.ts
│   │       └── museum-screen.ts
│   └── shared/                  # Cross-cutting utility types
│       ├── result.ts
│       ├── pagination.ts
│       ├── sorting.ts
│       ├── filtering.ts
│       ├── metadata.ts
│       ├── status.ts
│       ├── events.ts
│       └── validation.ts
├── features/
│   └── {feature}/
│       └── types/               # Feature-specific types
│           ├── index.ts
│           ├── domain/
│           ├── dto/
│           └── ui/
└── services/
    └── {service}/
        └── types/               # Service-specific types
            └── index.ts
```

### 3.2 Barrel Exports

Each directory should contain an `index.ts` that re-exports all public types:

```typescript
// types/domain/player/index.ts
export * from './player';
export * from './player-stats';
export * from './player-preferences';
```

### 3.3 Feature-Specific Types

Feature modules may contain their own type directories:

```
src/features/museum/types/
├── index.ts
├── museum.types.ts
├── artifact.types.ts
├── collection.types.ts
└── museum-ui.types.ts
```

This allows features to maintain type locality while still following shared standards.

---

## 4. Domain Model Standards

Domain models represent core business entities. Each domain model follows consistent patterns.

### 4.1 Player Model

The Player model represents the core player entity.

```typescript
// types/domain/player/player.ts
interface Player {
  id: string;
  telegramUserId: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  isPremium: boolean;
  isBanned: boolean;
  banReason?: string;
}
```

### 4.2 Artifact Model

The Artifact model represents collectible artifacts.

```typescript
// types/domain/artifact/artifact.ts
interface Artifact {
  id: string;
  artifactDefId: string;
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

type ArtifactRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface ArtifactStats {
  power?: number;
  defense?: number;
  speed?: number;
  special?: number;
}
```

### 4.3 Museum Model

The Museum model represents the player's museum display.

```typescript
// types/domain/museum/museum.ts
interface Museum {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  displaySlots: DisplaySlot[];
  totalPower: number;
  artifactsOnDisplay: number;
  totalArtifacts: number;
  theme: MuseumTheme;
  createdAt: Date;
  updatedAt: Date;
}

interface DisplaySlot {
  slotId: number;
  artifactId?: string;
  position: { row: number; col: number };
  isUnlocked: boolean;
  unlockCost?: number;
}
```

### 4.4 Event Model

The Event model represents time-limited events.

```typescript
// types/domain/event/event.ts
interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  rewards: EventReward[];
  requirements: EventRequirement[];
  leaderboardEnabled: boolean;
  isActive: boolean;
}

type EventType = 'daily' | 'weekly' | 'seasonal' | 'special';

interface EventReward {
  tier: number;
  rewardType: RewardType;
  amount: number;
  threshold: number;
}

interface EventRequirement {
  type: RequirementType;
  value: number;
}
```

### 4.5 Guild Model

The Guild model represents player guilds/clans.

```typescript
// types/domain/guild/guild.ts
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
}

interface GuildMember {
  userId: string;
  guildId: string;
  role: GuildRole;
  joinedAt: Date;
  contributedPower: number;
}

type GuildRole = 'leader' | 'officer' | 'member';
```

### 4.6 Season Model

The Season model represents competitive seasons.

```typescript
// types/domain/event/season.ts
interface Season {
  id: string;
  number: number;
  name: string;
  startDate: Date;
  endDate: Date;
  battlePassId: string;
  isActive: boolean;
  isCompleted: boolean;
  rewards: SeasonReward[];
}

interface SeasonReward {
  tier: number;
  tierName: string;
  isPremiumOnly: boolean;
  rewards: TierReward[];
}
```

---

## 5. DTO Standards

DTOs (Data Transfer Objects) transfer data between application layers without exposing internal structures.

### 5.1 Request DTOs

Request DTOs define the expected shape of incoming data.

```typescript
// types/dto/requests/claim-reward.dto.ts
interface ClaimRewardRequest {
  playerId: string;
  rewardType: RewardType;
  rewardId: string;
  timestamp: number;
}

interface SpendCurrencyRequest {
  playerId: string;
  currencyType: CurrencyType;
  amount: number;
  reason: SpendReason;
  targetId?: string;
}
```

### 5.2 Response DTOs

Response DTOs define the shape of outgoing data.

```typescript
// types/dto/responses/player-profile.dto.ts
interface PlayerProfileResponse {
  id: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  isPremium: boolean;
  joinedAt: Date;
}

interface InventoryResponse {
  items: InventoryItem[];
  totalItems: number;
  capacity: number;
  usedCapacity: number;
}
```

### 5.3 Payload DTOs

Payload DTOs define structured data for service communication.

```typescript
// types/dto/payloads/reward-payload.ts
interface RewardPayload {
  playerId: string;
  rewards: Reward[];
  source: RewardSource;
  transactionId: string;
  timestamp: Date;
}

interface Reward {
  type: RewardType;
  amount: number;
  metadata?: Record<string, unknown>;
}
```

### 5.4 Transport Objects

Transport objects serialize data for external systems.

```typescript
// types/dto/transport/notification-transport.ts
interface NotificationTransport {
  recipientId: string;
  notificationType: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  priority: 'low' | 'normal' | 'high';
}
```

---

## 6. API Contract Standards

API contracts define data shapes for all API communication.

### 6.1 API Response Contract

Standard wrapper for all API responses.

```typescript
// types/api/contracts/api-response.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

interface ResponseMetadata {
  timestamp: Date;
  requestId: string;
  version: string;
}
```

### 6.2 RPC Response Contract

Response wrapper for Supabase RPC functions.

```typescript
// types/api/rpc/rpc-response.ts
interface RpcResponse<T> {
  data: T | null;
  error: RpcError | null;
}

interface RpcError {
  code: string;
  message: string;
  details?: unknown;
}
```

### 6.3 Edge Function Response Contract

Response wrapper for Supabase Edge Functions.

```typescript
// types/api/edge/edge-function-response.ts
interface EdgeFunctionResponse<T = unknown> {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
}
```

### 6.4 Telegram Integration Contracts

Types for Telegram Bot API integration.

```typescript
// types/api/telegram/telegram-types.ts
interface TelegramInitData {
  queryId: string;
  user: TelegramUser;
  chat?: TelegramChat;
  chatType?: string;
  chatInstance?: string;
  startParam?: string;
  canSendAfter?: number;
  authDate: number;
  hash: string;
}

interface TelegramUser {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
}
```

---

## 7. Database Type Standards

Database types represent entities and query results from Supabase.

### 7.1 Table Model Types

Types that mirror database table structures.

```typescript
// types/database/entities/user.entity.ts
interface UserEntity {
  id: string;
  telegram_user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  experience: number;
  is_premium: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}
```

### 7.2 Query Result Types

Types for database query results.

```typescript
// types/database/queries/player-queries.ts
interface PlayerQueryResult {
  player: UserEntity;
  stats: PlayerStatsEntity;
  preferences: PlayerPreferencesEntity;
}

interface PlayerWithInventory extends UserEntity {
  inventory: InventoryItemEntity[];
  artifacts: ArtifactEntity[];
}
```

### 7.3 Relationship Types

Types for related entity patterns.

```typescript
// types/database/relationships/player-artifact.ts
interface PlayerArtifactRelation {
  playerId: string;
  artifactId: string;
  acquiredAt: Date;
  currentSlot?: number;
}

interface ArtifactDefinition {
  id: string;
  name: string;
  era: string;
  rarity: string;
  baseStats: ArtifactStats;
}
```

---

## 8. UI Type Standards

UI types support the presentation layer with component and form types.

### 8.1 Form Types

Types for form state and validation.

```typescript
// types/ui/forms/profile-form.ts
interface ProfileFormState {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
}

interface ProfileFormErrors {
  username?: string;
  displayName?: string;
  bio?: string;
}

interface ProfileFormActions {
  submit: (data: ProfileFormState) => Promise<void>;
  validate: (data: ProfileFormState) => ProfileFormErrors;
  reset: () => void;
}
```

### 8.2 Component Prop Types

Types for reusable component props.

```typescript
// types/ui/components/button.ts
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 8.3 Modal Types

Types for modal and dialog components.

```typescript
// types/ui/components/modal.ts
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  children: React.ReactNode;
}

interface ConfirmDialogProps extends ModalProps {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'warning' | 'info';
}
```

### 8.4 Navigation Types

Types for routing and navigation.

```typescript
// types/ui/navigation/route-params.ts
interface RouteParams {
  home: undefined;
  museum: { tab?: 'display' | 'inventory' };
  events: { eventId?: string };
  profile: { tab?: 'stats' | 'achievements' | 'settings' };
  artifact: { artifactId: string };
  guild: { guildId: string };
}
```

---

## 9. Shared Utility Types

Shared utility types provide reusable type patterns across all domains.

### 9.1 Result Type

Generic Result type for operations that can succeed or fail.

```typescript
// types/shared/result.ts
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

interface Option<T> {
  isSome(): this is Some<T>;
  isNone(): this is None;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  map<U>(fn: (value: T) => U): Option<U>;
}

type Some<T> = { isSome: true; value: T };
type None = { isSome: false };
```

### 9.2 Pagination Type

Standardized pagination types.

```typescript
// types/shared/pagination.ts
interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CursorPagination {
  cursor?: string;
  limit: number;
}

interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}
```

### 9.3 Sorting Type

Standardized sorting types.

```typescript
// types/shared/sorting.ts
type SortOrder = 'asc' | 'desc';

interface SortableField<T> {
  field: keyof T;
  order: SortOrder;
}

interface MultiSort<T> {
  sorts: SortableField<T>[];
}

type SortConfig<T> = SortableField<T> | MultiSort<T>;
```

### 9.4 Filtering Type

Standardized filtering types.

```typescript
// types/shared/filtering.ts
interface FilterCondition<T> {
  field: keyof T;
  operator: FilterOperator;
  value: unknown;
}

type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

interface FilterGroup<T> {
  logic: 'and' | 'or';
  conditions: FilterCondition<T>[];
}
```

### 9.5 Metadata Type

Types for attaching metadata to entities.

```typescript
// types/shared/metadata.ts
interface EntityMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
}

interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletable {
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
}
```

### 9.6 Status Tracking Type

Types for entity status management.

```typescript
// types/shared/status.ts
type EntityStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

type OperationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

interface StatusTransition<T extends string> {
  from: T;
  to: T;
  timestamp: Date;
  reason?: string;
}

interface StatusHistory<T extends string> {
  current: T;
  transitions: StatusTransition<T>[];
}
```

---

## 10. Error Contract Standards

Standardized types for error handling across the application.

### 10.1 Error Types

```typescript
// types/shared/errors.ts
interface JoltError {
  id: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: LocalizedMessage;
  details?: Record<string, unknown>;
  timestamp: Date;
  traceId: string;
}

type ErrorCategory =
  | 'validation'
  | 'business'
  | 'database'
  | 'api'
  | 'security'
  | 'telegram'
  | 'internal';

type ErrorSeverity = 1 | 2 | 3 | 4 | 5;

interface LocalizedMessage {
  key: string;
  params?: Record<string, string | number>;
  fallback: string;
}
```

### 10.2 Warning Types

```typescript
// types/shared/warnings.ts
interface JoltWarning {
  id: string;
  code: string;
  message: LocalizedMessage;
  severity: WarningSeverity;
  data?: Record<string, unknown>;
}

type WarningSeverity = 'low' | 'medium' | 'high';
```

### 10.3 Validation Result Types

```typescript
// types/shared/validation.ts
interface ValidationResult<T = unknown> {
  valid: boolean;
  code: ValidationCode;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  data?: T;
}

interface ValidationError {
  field: string;
  code: string;
  message: LocalizedMessage;
  value?: unknown;
}

type ValidationCode = string;
```

---

## 11. AdsGram Type Standards

AdsGram monetization types are critical for project revenue.

### 11.1 Reward Event Types

```typescript
// types/adsgram/reward-events.ts
interface AdRewardEvent {
  viewId: string;
  userId: string;
  adCategory: AdCategory;
  rewardType: RewardType;
  rewardAmount: number;
  timestamp: Date;
  sessionId: string;
  adsgramAdId?: string;
}

interface AdRewardClaimed {
  eventId: string;
  playerId: string;
  rewardType: RewardType;
  amount: number;
  adViewId: string;
  claimedAt: Date;
}
```

### 11.2 Monetization Tracking Types

```typescript
// types/adsgram/monetization.ts
interface MonetizationEvent {
  playerId: string;
  eventType: MonetizationEventType;
  revenue: number;
  currency: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

type MonetizationEventType =
  | 'impression'
  | 'click'
  | 'rewarded_view'
  | 'interstitial_view';

interface MonetizationSummary {
  playerId: string;
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  totalRewardedViews: number;
  periodStart: Date;
  periodEnd: Date;
}
```

### 11.3 Ad Response Types

```typescript
// types/adsgram/ad-responses.ts
interface AdShowResponse {
  success: boolean;
  adId?: string;
  error?: AdError;
}

interface AdRewardResponse {
  success: boolean;
  rewardType: RewardType;
  amount: number;
  transactionId: string;
}

interface AdError {
  code: AdErrorCode;
  message: string;
  retryable: boolean;
}

type AdErrorCode =
  | 'NO_AD_AVAILABLE'
  | 'USER_NOT_ELIGIBLE'
  | 'COOLDOWN_ACTIVE'
  | 'DAILY_LIMIT_REACHED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
```

### 11.4 Reward Verification Types

```typescript
// types/adsgram/verification.ts
interface RewardVerificationRequest {
  viewId: string;
  userId: string;
  expectedReward: AdReward;
  timestamp: number;
  signature: string;
}

interface RewardVerificationResult {
  valid: boolean;
  reason?: string;
  rewardAmount?: number;
  rewardType?: RewardType;
}
```

---

## 12. Naming Standards

Type naming follows consistent patterns for discoverability and maintenance.

### 12.1 Type Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Interface | PascalCase, noun | `Player`, `Artifact` |
| Type Alias | PascalCase, noun | `CurrencyType`, `Rarity` |
| Enum | PascalCase, singular | `RewardType`, `GuildRole` |
| Enum Member | PascalCase | `COINS`, `PREMIUM` |

### 12.2 Naming Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `{Entity}Entity` | Database row type | `UserEntity` |
| `{Entity}Model` | Domain model | `PlayerModel` |
| `{Entity}DTO` | Data transfer object | `PlayerDTO` |
| `{Entity}Response` | API response | `PlayerResponse` |
| `{Entity}Request` | API request | `ClaimRewardRequest` |
| `{Entity}Props` | Component props | `ButtonProps` |
| `{Entity}State` | UI state | `FormState` |
| `{Entity}Event` | Event data | `AdRewardEvent` |
| `I{Entity}` | Interface prefix | `IAdsAdapter` |
| `{Entity}Result` | Operation result | `ClaimResult` |

### 12.3 Disambiguation Rules

| Situation | Rule | Example |
|-----------|------|---------|
| Database vs Domain | Use `Entity` suffix for DB | `UserEntity` vs `Player` |
| Request vs Response | Use `Request`/`Response` suffix | `SpendRequest`, `SpendResponse` |
| Input vs Output | Use `Input`/`Output` suffix | `PlayerInput`, `LeaderboardOutput` |

---

## 13. Versioning Philosophy

Types must support versioning to enable API evolution.

### 13.1 Backward Compatibility

Types must remain backward compatible:

- **Additive Changes:** New optional fields can be added
- **Non-Breaking Changes:** Existing fields never removed or renamed
- **Default Values:** New required fields must have defaults

### 13.2 Version Naming

| Version Strategy | Format | Example |
|-----------------|--------|---------|
| Major Version | `v{number}` | `v1`, `v2` |
| API Version | `v{number}` in path | `/api/v1/players` |
| Type Version | Inline version comment | `// v1` |

### 13.3 Schema Evolution

| Change Type | Breaking? | Approach |
|-------------|-----------|---------|
| Add optional field | No | Add field with `?` |
| Add required field | Yes | New type version |
| Rename field | Yes | Add alias, deprecate old |
| Remove field | Yes | Mark deprecated, remove later |
| Change type | Yes | New field with different name |

---

## 14. Testing Philosophy

Types should improve reliability and reduce runtime errors.

### 14.1 Compile-Time Validation

TypeScript types provide compile-time safety:

- **Strict Mode:** Catch errors before runtime
- **No Implicit Any:** All values typed
- **Exhaustive Checks:** Discriminated unions fully covered

### 14.2 Runtime Validation Support

Types can support runtime validation:

```typescript
// Runtime type guards
function isPlayer(value: unknown): value is Player {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'telegramUserId' in value
  );
}

// Schema validation (e.g., with Zod)
const PlayerSchema = z.object({
  id: z.string().uuid(),
  telegramUserId: z.string(),
  username: z.string().optional(),
  level: z.number().int().positive()
});
```

### 14.3 Type Testing Strategies

| Strategy | Purpose |
|----------|---------|
| Type assertions | Verify type inference |
| Compile errors | Test invalid assignments |
| Runtime guards | Validate external data |
| Property-based testing | Test type transformations |

---

## 15. Future Expansion Notes

The Shared Types system is designed to accommodate future type requirements.

### 15.1 AI Models

Future AI-related types:

```typescript
// types/domain/ai/ai-models.ts (future)
interface AIModelConfig {
  modelId: string;
  provider: 'openai' | 'anthropic' | 'custom';
  parameters: Record<string, unknown>;
}

interface AICompletionRequest {
  model: AIModelConfig;
  prompt: string;
  maxTokens: number;
  temperature: number;
}
```

### 15.2 Creator Economy Models

Future creator system types:

```typescript
// types/domain/creator/creator-models.ts (future)
interface CreatorProfile {
  userId: string;
  displayName: string;
  contentTypes: ContentType[];
  followerCount: number;
  verificationStatus: VerificationStatus;
  revenueShare: number;
}

type ContentType = 'guide' | 'video' | 'art' | 'quiz';
type VerificationStatus = 'unverified' | 'pending' | 'verified';
```

### 15.3 NFT Models

Future Web3/NFT types:

```typescript
// types/domain/web3/nft-models.ts (future)
interface NFTMetadata {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: NFTAttribute[];
  blockchain: 'ton' | 'ethereum';
}

interface NFTOwnership {
  ownerAddress: string;
  tokenId: string;
  acquisitionDate: Date;
  transactionHash: string;
}
```

### 15.4 Web3 Models

Future blockchain types:

```typescript
// types/domain/web3/web3-models.ts (future)
interface WalletConnection {
  address: string;
  blockchain: Blockchain;
  connectedAt: Date;
  permissions: WalletPermission[];
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: TransactionStatus;
  confirmedAt?: Date;
}
```

### 15.5 Esports Models

Future competitive gaming types:

```typescript
// types/domain/esports/esports-models.ts (future)
interface TournamentRegistration {
  playerId: string;
  tournamentId: string;
  registeredAt: Date;
  seed?: number;
  bracketPosition?: number;
}

interface MatchResult {
  matchId: string;
  tournamentId: string;
  player1Id: string;
  player2Id: string;
  winnerId: string;
  score: MatchScore;
  completedAt: Date;
}
```

---

## 16. Long-Term Philosophy

The Shared Types system embodies principles for long-term project success.

### 16.1 Consistency

All data structures follow the same patterns:

- Types are organized by domain, not by technical layer
- Naming conventions are enforced consistently
- Similar concepts have similar shapes

### 16.2 Bug Reduction

Type safety catches errors early:

- No type coercion surprises
- Exhaustive switch statements
- Clear interface contracts

### 16.3 Scalability Support

Types support project growth:

- New domains can be added without restructuring
- Feature-specific types co-locate with features
- Shared types prevent duplication

### 16.4 Simplified Onboarding

Clear type documentation aids new developers:

- Types are self-documenting
- Domain models reflect business concepts
- Consistent patterns are easy to learn

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `.openhands/knowledge/folder-architecture.md` | Folder structure standards |
| `.openhands/knowledge/validation-layer.md` | Validation type contracts |
| `.openhands/knowledge/error-handling.md` | Error handling patterns |
| `.openhands/knowledge/api-architecture.md` | API design standards |
| `.openhands/knowledge/adsgram.md` | AdsGram monetization types |

---

*Last Updated: 2026-06-25*
