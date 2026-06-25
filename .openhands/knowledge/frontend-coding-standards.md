# Jolt Time — Frontend Coding Standards

## Overview

The Frontend Coding Standards establish official guidelines for all frontend development in the Jolt Time project. These standards ensure code consistency, maintainability, and quality across all contributions.

**Document Status:** Official Standard
**Applies To:** All frontend code in `src/`
**Enforcement:** Code review, linting, TypeScript strict mode

---

## 1. Standards Categories

The Frontend Coding Standards encompass seven primary categories:

### 1.1 React Standards

Guidelines for React component development including structure, responsibilities, and composition patterns.

### 1.2 TypeScript Standards

Strict typing requirements, interface usage, and type safety enforcement.

### 1.3 Component Standards

Standards for reusable, feature, and shared components.

### 1.4 Hook Standards

Guidelines for custom hook creation and usage.

### 1.5 State Management Standards

Best practices for Zustand stores, selectors, and state updates.

### 1.6 Styling Standards

Design system compliance, responsive layouts, and accessibility.

### 1.7 Testing Standards

Unit, component, and integration testing requirements.

---

## 2. Coding Philosophy

The Jolt Time codebase embodies four core principles that guide all development decisions.

### 2.1 Readability

Code must be readable by humans:

- **Clear Intent:** Code expresses what it does, not just how
- **Appropriate Comments:** Comments explain why, not what
- **Consistent Formatting:** Uniform style throughout
- **Meaningful Names:** Variables and functions have descriptive names

### 2.2 Maintainability

Code must be easy to maintain:

- **Single Responsibility:** Each piece of code has one job
- **Loose Coupling:** Components depend on abstractions, not concretions
- **High Cohesion:** Related code is grouped together
- **DRY Principle:** Don't Repeat Yourself

### 2.3 Scalability

Code must support growth:

- **Feature Modules:** Self-contained feature directories
- **Lazy Loading:** Code split for performance
- **Type Safety:** Catch errors at compile time
- **Predictable Patterns:** Same approach works across the codebase

### 2.4 Predictability

Code behavior must be predictable:

- **Consistent Patterns:** Same solution for similar problems
- **Explicit over Implicit:** Clear intent over clever tricks
- **Error Handling:** All error paths considered
- **Type Safety:** No implicit any, no type coercion surprises

---

## 3. React Standards

React development follows consistent patterns for component structure and composition.

### 3.1 Component Structure

Every React component follows a standard structure:

```tsx
// 1. Imports (external first, then internal)
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui';
import { usePlayer } from '@/features/player/hooks';
import type { PlayerCardProps } from './player-card.types';

// 2. Types (if not imported)
interface PlayerCardComponentProps {
  playerId: string;
  variant?: 'compact' | 'expanded';
}

// 3. Component definition
export function PlayerCard({ playerId, variant = 'compact' }: PlayerCardComponentProps) {
  // 4. Hooks first
  const { player, isLoading, error } = usePlayer(playerId);
  
  // 5. State
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 6. Callbacks
  const handleClick = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  // 7. Derived state
  const displayVariant = variant === 'expanded' || isExpanded ? 'expanded' : 'compact';
  
  // 8. Early returns for loading/error states
  if (isLoading) {
    return <PlayerCardSkeleton variant={displayVariant} />;
  }
  
  if (error || !player) {
    return <PlayerCardError playerId={playerId} />;
  }
  
  // 9. Main render
  return (
    <div className={styles.card} data-variant={displayVariant}>
      <PlayerAvatar src={player.avatarUrl} name={player.displayName} />
      <PlayerInfo player={player} />
      <Button onClick={handleClick} variant="ghost">
        {isExpanded ? 'Collapse' : 'Expand'}
      </Button>
    </div>
  );
}

// 10. Sub-components at bottom (if needed)
function PlayerAvatar({ src, name }: { src?: string; name?: string }) {
  // ...
}
```

### 3.2 Component Responsibilities

Components have clear, limited responsibilities:

| Component Type | Responsibility |
|---------------|----------------|
| **UI Components** | Render UI primitives, apply design system |
| **Feature Components** | Render feature-specific UI, compose primitives |
| **Page Components** | Assemble full pages, handle routing concerns |
| **Container Components** | Connect to state, provide data to presentational components |

**Components SHOULD:**
- Render UI based on props and state
- Handle user interactions via callbacks
- Compose smaller components into larger ones
- Apply design system tokens

**Components SHOULD NOT:**
- Contain business logic (use hooks/services instead)
- Access repositories directly (use services instead)
- Manage global state directly (use stores instead)
- Make API calls directly (use services instead)

### 3.3 Composition Philosophy

Prefer composition over inheritance:

```tsx
// Good: Composition with children
function Card({ children, variant = 'default' }: CardProps) {
  return (
    <div className={styles.card} data-variant={variant}>
      {children}
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <Card>
      <CardHeader>{player.name}</CardHeader>
      <CardBody>{player.bio}</CardBody>
    </Card>
  );
}

// Good: Composition with render props
function ListSection<T>({ items, renderItem }: ListSectionProps<T>) {
  return (
    <div className={styles.section}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// Avoid: Prop drilling
function Grandparent({ data }) {
  return <Parent data={data} />;
}
```

### 3.4 Component File Organization

Component files follow consistent naming:

| Element | Pattern | Example |
|---------|---------|---------|
| Component File | PascalCase.tsx | `PlayerCard.tsx` |
| Component Directory | Same as component | `PlayerCard/` |
| Props Type | ComponentName + Props | `PlayerCardProps` |
| Styles File | Same name + .module.css | `PlayerCard.module.css` |
| Test File | Same name + .test.tsx | `PlayerCard.test.tsx` |

---

## 4. TypeScript Standards

TypeScript provides compile-time safety. All code must use strict typing.

### 4.1 Strict Typing Requirements

```typescript
// ❌ Bad: Implicit any
function processData(data) {
  return data.value;
}

// ✅ Good: Explicit types
function processData(data: DataInput): string {
  return data.value;
}

// ❌ Bad: any type
const value: any = response.data;

// ✅ Good: Unknown with type guard
const value: unknown = response.data;
if (isValidValue(value)) {
  // Use value safely
}

// ❌ Bad: Non-null assertion
const name = user!.displayName;

// ✅ Good: Optional chaining with nullish coalescing
const name = user?.displayName ?? 'Anonymous';
```

### 4.2 Interface Usage

Use interfaces for object shapes that may be extended:

```typescript
// ✅ Good: Interface for object shapes
interface PlayerProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
}

// ✅ Good: Interface extension
interface PremiumPlayer extends PlayerProfile {
  subscriptionTier: 'monthly' | 'yearly';
  benefits: string[];
}

// ✅ Good: Interface composition
interface PlayerCardProps {
  player: PlayerProfile;
  showStats?: boolean;
  onClick?: () => void;
}
```

Use type aliases for unions, intersections, and primitives:

```typescript
// ✅ Good: Type alias for union
type CurrencyType = 'coins' | 'gems' | 'energy';

// ✅ Good: Type alias for intersection
type EarnedReward = Reward & {
  earnedAt: Date;
  source: RewardSource;
};

// ✅ Good: Type alias for utility types
type PartialPlayer = Partial<PlayerProfile>;
type RequiredPlayer = Required<PlayerProfile>;
type ReadonlyPlayer = Readonly<PlayerProfile>;
```

### 4.3 Type Safety Requirements

```typescript
// ✅ Good: Discriminated unions for state
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: Player;
}

interface ErrorState {
  status: 'error';
  error: Error;
}

type PlayerState = LoadingState | SuccessState | ErrorState;

// ✅ Good: Exhaustive type checking
function renderPlayerContent(state: PlayerState) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <PlayerView player={state.data} />;
    case 'error':
      return <ErrorView error={state.error} />;
    default:
      // TypeScript ensures all cases handled
      break;
  }
}

// ✅ Good: Type guards for runtime validation
function isPlayerProfile(value: unknown): value is PlayerProfile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as { id: unknown }).id === 'string'
  );
}
```

### 4.4 Avoid Loose Typing

```typescript
// ❌ Bad: Record with any values
const metadata: Record<string, any> = response.metadata;

// ✅ Good: Record with specific types
const metadata: Record<string, string | number> = response.metadata;

// ❌ Bad: Array of any
const items: any[] = data.items;

// ✅ Good: Typed array
const items: Item[] = data.items;

// ❌ Bad: Function returning any
function parseResponse(response: unknown): any {
  return JSON.parse(response as string);
}

// ✅ Good: Generic function with type parameter
function parseResponse<T>(response: string): T {
  return JSON.parse(response) as T;
}
```

---

## 5. Component Standards

Components are categorized by scope and reusability.

### 5.1 Reusable Components

Located in `src/components/ui/` or `src/components/common/`:

**Characteristics:**
- No business logic
- Purely presentational
- Accept props for customization
- Apply design system tokens
- Well-documented API

**Examples:**
- Button, Input, Card, Modal
- Badge, Avatar, Progress
- LoadingSpinner, EmptyState, ErrorBoundary

### 5.2 Feature Components

Located within `src/features/{feature}/components/`:

**Characteristics:**
- Feature-specific functionality
- May contain business logic via hooks
- Composed from reusable components
- Exported from feature module

**Examples:**
- PlayerCard, ArtifactCard, EventCard
- InventoryGrid, MuseumDisplay, BattleArena

### 5.3 Shared Components

Components that span multiple features:

**Characteristics:**
- Used by multiple feature modules
- Located in `src/components/shared/`
- Abstracted from specific features
- Support multiple use cases

**Examples:**
- CurrencyDisplay, RewardPreview, LeaderboardEntry

### 5.4 Component Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **UI Components** | Descriptive name | `IconButton`, `DataTable` |
| **Feature Components** | Feature + Name | `PlayerCard`, `ArtifactDetails` |
| **Page Components** | Entity + Page | `MuseumPage`, `ProfilePage` |
| **Layout Components** | Layout + Purpose | `PageLayout`, `SidebarNav` |
| **Test Components** | Component + Test | `PlayerCard.test` |

---

## 6. Hook Standards

Hooks encapsulate logic and provide stateful functionality to components.

### 6.1 Hook Responsibilities

Hooks should encapsulate logic while remaining reusable:

**Hooks SHOULD:**
- Manage related state and logic together
- Handle one concern (SRP)
- Be composable with other hooks
- Provide clear, typed API
- Handle cleanup in useEffect

**Hooks SHOULD NOT:**
- Access DOM directly (use refs instead)
- Contain business logic (delegate to services)
- Access repositories directly (use services instead)
- Have side effects beyond their concern

### 6.2 Hook Structure

```typescript
// ✅ Good: Well-structured hook
export function usePlayer(playerId: string): UsePlayerResult {
  // 1. State
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 2. Derived state
  const isAuthenticated = player !== null && !error;
  
  // 3. Effects
  useEffect(() => {
    if (!playerId) return;
    
    setIsLoading(true);
    PlayerService.getPlayer(playerId)
      .then(setPlayer)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [playerId]);
  
  // 4. Callbacks
  const refreshPlayer = useCallback(async () => {
    // Implementation
  }, []);
  
  // 5. Return value
  return {
    player,
    isLoading,
    error,
    isAuthenticated,
    refreshPlayer
  };
}
```

### 6.3 Reusable Hook Patterns

```typescript
// ✅ Good: Composable hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// ✅ Good: Option objects for complex params
interface FetchOptions {
  skip?: number;
  limit?: number;
  sortBy?: string;
  filter?: FilterCondition;
}

function useFetch<T>(url: string, options: FetchOptions = {}) {
  // Implementation
}

// Usage
const { data } = useFetch('/api/players', { 
  skip: 0, 
  limit: 10,
  sortBy: 'level'
});
```

### 6.4 Hook Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| **State Hook** | use + Entity + State | `usePlayerState` |
| **Action Hook** | use + Action | `useClaimReward` |
| **Service Hook** | use + Service | `useAuth` |
| **Query Hook** | use + Query | `usePlayerInventory` |
| **Mutation Hook** | use + Mutation | `useUpdateProfile` |

---

## 7. State Management Standards

State management uses Zustand for global state with clear patterns.

### 7.1 Store Structure

```typescript
// ✅ Good: Well-structured Zustand store
interface PlayerStore {
  // State
  player: Player | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  fetchPlayer: (playerId: string) => Promise<void>;
  updatePlayer: (updates: Partial<Player>) => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  player: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchPlayer: async (playerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const player = await PlayerService.getPlayer(playerId);
      set({ player, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  
  updatePlayer: (updates: Partial<Player>) => {
    const { player } = get();
    if (player) {
      set({ player: { ...player, ...updates } });
    }
  },
  
  clearPlayer: () => {
    set({ player: null, error: null });
  },
}));
```

### 7.2 Selector Patterns

```typescript
// ✅ Good: Simple selector
const player = usePlayerStore(state => state.player);

// ✅ Good: Derived selector
const playerLevel = usePlayerStore(state => state.player?.level ?? 0);

// ✅ Good: Selector with computation
const canClaimReward = usePlayerStore(
  state => state.player?.energy ?? 0 >= REWARD_COST
);

// ✅ Good: Multiple selectors
const { player, isLoading, error } = usePlayerStore(
  useShallow(state => ({
    player: state.player,
    isLoading: state.isLoading,
    error: state.error,
  }))
);
```

### 7.3 Persistence

```typescript
// ✅ Good: Persisted store
interface SettingsStore {
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      notificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        theme: state.theme,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);
```

### 7.4 State Update Patterns

```typescript
// ✅ Good: Immutable updates
updateInventory: (itemId: string, quantity: number) => {
  set(state => ({
    inventory: state.inventory.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  }));
}

// ✅ Good: Optimistic updates with rollback
spendCurrency: async (amount: number) => {
  const previousBalance = get().balance;
  
  // Optimistic update
  set({ balance: get().balance - amount });
  
  try {
    await CurrencyService.spend(amount);
  } catch (error) {
    // Rollback on failure
    set({ balance: previousBalance });
    throw error;
  }
}
```

---

## 8. Service Usage Standards

Components communicate with backend services through hooks and services.

### 8.1 Service Access Pattern

Components must not access repositories or make API calls directly:

```tsx
// ❌ Bad: Direct repository access in component
function PlayerProfile({ playerId }: { playerId: string }) {
  const [player, setPlayer] = useState(null);
  
  useEffect(() => {
    // ❌ Bad: Direct repository access
    playerRepository.getPlayer(playerId).then(setPlayer);
  }, [playerId]);
  
  // ...
}

// ✅ Good: Service accessed through hook
function PlayerProfile({ playerId }: { playerId: string }) {
  const { player, isLoading } = usePlayer(playerId);
  
  if (isLoading) return <Spinner />;
  if (!player) return <NotFound />;
  
  return <ProfileView player={player} />;
}
```

### 8.2 Service Layer Responsibilities

Services encapsulate business logic:

| Service Type | Responsibility |
|-------------|---------------|
| **Domain Services** | Business logic, coordination |
| **API Services** | HTTP requests, response handling |
| **Integration Services** | External service adapters |

### 8.3 Service Composition

```typescript
// ✅ Good: Services compose with repositories
class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    private eventEmitter: EventEmitter
  ) {}
  
  async updatePlayer(playerId: string, updates: Partial<Player>): Promise<Player> {
    // Business logic here
    const player = await this.playerRepository.update(playerId, updates);
    this.eventEmitter.emit('player:updated', { playerId, updates });
    return player;
  }
}
```

---

## 9. Repository Usage Standards

Repositories handle data access and must remain hidden behind services.

### 9.1 Repository Access Pattern

Repositories are internal to the data layer:

```typescript
// ❌ Bad: Component accessing repository
import { playerRepository } from '@/repositories/playerRepository';

function PlayerBadge({ playerId }: { playerId: string }) {
  const player = playerRepository.getPlayer(playerId);
  // ❌ Bad: Bypasses service layer
}
```

Repositories should only be accessed by services:

```typescript
// ✅ Good: Service accesses repository
// src/services/PlayerService.ts
import { playerRepository } from '@/repositories/playerRepository';

class PlayerService {
  async getPlayer(playerId: string): Promise<Player> {
    return playerRepository.getPlayer(playerId);
  }
}

// ✅ Good: Component uses hook -> service -> repository
// Component uses hook
const { player } = usePlayer(playerId);
```

### 9.2 Repository Responsibilities

Repositories handle:

- Database queries and mutations
- Response transformation
- Error translation
- Caching (optional)

Repositories do not handle:

- Business logic (services do this)
- UI concerns (components do this)
- Cross-repository operations (services coordinate)

---

## 10. Naming Standards

Consistent naming across the codebase improves discoverability.

### 10.1 Component Naming

| Type | Convention | Example |
|------|------------|---------|
| **Component** | PascalCase | `PlayerCard`, `InventoryGrid` |
| **Component File** | PascalCase.tsx | `PlayerCard.tsx` |
| **Component Dir** | Same as component | `PlayerCard/` |
| **Props Type** | ComponentName + Props | `PlayerCardProps` |
| **Styles** | ComponentName.module.css | `PlayerCard.module.css` |

### 10.2 Hook Naming

| Type | Convention | Example |
|------|------------|---------|
| **Custom Hook** | use + Description | `usePlayer`, `useInventory` |
| **State Hook** | use + Entity + State | `useModalState` |
| **Async Hook** | use + Action | `useClaimReward` |

### 10.3 Service Naming

| Type | Convention | Example |
|------|------------|---------|
| **Service Class** | PascalCase | `PlayerService`, `CurrencyService` |
| **Service Instance** | camelCase | `playerService` |
| **Repository** | PascalCase | `PlayerRepository` |

### 10.4 Type Naming

| Type | Convention | Example |
|------|------------|---------|
| **Interface** | PascalCase, noun | `Player`, `CurrencyBalance` |
| **Type Alias** | PascalCase | `CurrencyType`, `PlayerState` |
| **Enum** | PascalCase, singular | `RewardType`, `GuildRole` |
| **Enum Member** | PascalCase | `COINS`, `PREMIUM` |
| **DTO** | Entity + Request/Response | `PlayerRequest`, `PlayerResponse` |

### 10.5 Constant Naming

| Type | Convention | Example |
|------|------------|---------|
| **Constant** | SCREAMING_SNAKE_CASE | `MAX_ENERGY`, `DEFAULT_PAGE_SIZE` |
| **Config Object** | camelCase | `currencyConfig` |
| **Environment Var** | SCREAMING_SNAKE_CASE | `VITE_API_URL` |

---

## 11. File Organization Standards

Files follow consistent structure and organization.

### 11.1 Import Order

```typescript
// 1. React and React DOM
import { useState, useEffect } from 'react';

// 2. External libraries
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// 3. Internal absolute imports (@/ paths)
import { Button } from '@/components/ui';
import { usePlayer } from '@/features/player/hooks';

// 4. Relative imports
import { PlayerCard } from './PlayerCard';
import { PlayerCardStyles } from './PlayerCard.module.css';

// 5. Type imports (separate line)
import type { Player } from '@/types/domain/player';
```

### 11.2 File Placement

| Content | Location |
|---------|----------|
| React Components | `src/components/` or `src/features/{feature}/components/` |
| Custom Hooks | `src/hooks/` or `src/features/{feature}/hooks/` |
| Services | `src/services/` or `src/features/{feature}/services/` |
| Repositories | `src/repositories/` or `src/features/{feature}/repositories/` |
| Types | `src/types/` or `src/features/{feature}/types/` |
| Stores | `src/stores/` or `src/features/{feature}/stores/` |
| Utils | `src/utils/` or `src/features/{feature}/utils/` |

### 11.3 Barrel Exports

Use barrel exports for clean public APIs:

```typescript
// src/features/player/index.ts
export { usePlayer, usePlayerStats, usePlayerProgress } from './hooks';
export { PlayerService } from './services/PlayerService';
export type { Player, PlayerProfile, PlayerStats } from './types';

// src/features/player/hooks/index.ts
export { usePlayer } from './usePlayer';
export { usePlayerStats } from './usePlayerStats';
```

---

## 12. Performance Standards

Frontend performance ensures smooth user experience.

### 12.1 Efficient Rendering

```tsx
// ✅ Good: Memoized callbacks prevent re-renders
const handleClick = useCallback(() => {
  onItemSelect(item.id);
}, [onItemSelect, item.id]);

// ✅ Good: Memoized derived values
const sortedItems = useMemo(() => 
  items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ Good: React.memo for pure components
const ItemCard = React.memo(function ItemCard({ item }: ItemCardProps) {
  return <div>{item.name}</div>;
});
```

### 12.2 Memoization Guidelines

| Situation | Action |
|-----------|--------|
| Callback in dependency array | `useCallback` |
| Computed value from state | `useMemo` |
| Pure component receiving props | `React.memo` |
| Expensive calculation | `useMemo` |

### 12.3 Lazy Loading

```tsx
// ✅ Good: Lazy load pages
const MuseumPage = lazy(() => import('./pages/MuseumPage'));
const BattlePage = lazy(() => import('./pages/BattlePage'));

// ✅ Good: Lazy load heavy components
const Chart = lazy(() => import('./components/Chart'));

// Usage with Suspense
function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MuseumPage />
    </Suspense>
  );
}
```

### 12.4 Bundle Optimization

```typescript
// ✅ Good: Named imports (tree-shakeable)
import { Button, Card } from '@/components/ui';

// ❌ Bad: Namespace imports (cannot tree-shake)
import * as UI from '@/components/ui';
```

---

## 13. Styling Standards

Styling follows the design system and maintains accessibility.

### 13.1 Design System Compliance

```tsx
// ✅ Good: Use design tokens
<div className={styles.card} data-variant="primary">
  <h2 className={styles.title}>{title}</h2>
</div>

// CSS
.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.title {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}
```

### 13.2 Responsive Layouts

```css
/* ✅ Good: Mobile-first responsive */
.container {
  width: 100%;
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    max-width: 1200px;
    padding: var(--space-8);
  }
}

/* ✅ Good: Touch-friendly targets */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3) var(--space-4);
}
```

### 13.3 Accessibility

```tsx
// ✅ Good: Accessible button
<Button
  onClick={handleClick}
  disabled={isLoading}
  aria-label="Claim daily reward"
  aria-describedby={error ? 'error-message' : undefined}
>
  {isLoading ? <Spinner size="sm" /> : 'Claim'}
</Button>

// ✅ Good: Form with labels
<label htmlFor="username">Username</label>
<input
  id="username"
  type="text"
  value={username}
  onChange={handleChange}
  aria-invalid={hasError}
/>
{hasError && (
  <span id="username-error" role="alert">
    {errorMessage}
  </span>
)}
```

---

## 14. Error Handling Standards

Error handling provides good UX while protecting system integrity.

### 14.1 User-Friendly Errors

```tsx
// ✅ Good: User-friendly error display
function PlayerProfile({ playerId }: { playerId: string }) {
  const { player, isLoading, error } = usePlayer(playerId);
  
  if (error) {
    return (
      <ErrorView
        title="Unable to load profile"
        message="Please try again in a few moments."
        action={{ label: 'Retry', onClick: retry }}
      />
    );
  }
  
  // ...
}
```

### 14.2 Recovery Actions

```tsx
// ✅ Good: Recovery-oriented error handling
interface ErrorViewProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

function ErrorView({ title, message, action, secondaryAction }: ErrorViewProps) {
  return (
    <div className={styles.error}>
      <ErrorIcon />
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
      {secondaryAction && (
        <Button variant="ghost" onClick={secondaryAction.onClick}>
          {secondaryAction.label}
        </Button>
      )}
    </div>
  );
}
```

### 14.3 Error Boundaries

```tsx
// ✅ Good: Error boundary for graceful degradation
class FeatureErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorView title="Something went wrong" message="" />;
    }
    return this.props.children;
  }
}
```

---

## 15. AdsGram Integration Standards

AdsGram monetization integrates safely across the frontend.

### 15.1 Safe Reward Integration

```tsx
// ✅ Good: Reward hooks with validation
function useAdReward() {
  const [isWatching, setIsWatching] = useState(false);
  const [canWatch, setCanWatch] = useState(false);
  
  // Check eligibility before showing ad
  const checkEligibility = useCallback(async () => {
    const result = await AdsGramService.checkEligibility();
    setCanWatch(result.eligible);
    return result;
  }, []);
  
  // Watch ad with proper tracking
  const watchAd = useCallback(async (rewardType: RewardType) => {
    if (!canWatch) {
      throw new Error('Cannot watch ad at this time');
    }
    
    setIsWatching(true);
    try {
      const result = await AdsGramService.showAd(rewardType);
      // Track reward in analytics
      analytics.track('ad_reward_earned', {
        rewardType,
        amount: result.amount
      });
      return result;
    } finally {
      setIsWatching(false);
    }
  }, [canWatch, rewardType]);
  
  return {
    watchAd,
    isWatching,
    canWatch,
    checkEligibility
  };
}
```

### 15.2 Tracking Integration

```tsx
// ✅ Good: Comprehensive ad tracking
function AdRewardButton({ rewardType, children }: AdRewardButtonProps) {
  const { watchAd, isWatching, canWatch } = useAdReward();
  
  const handleClick = async () => {
    // Track attempt
    analytics.track('ad_opportunity', {
      feature: 'economy',
      action: 'double_coins',
      timestamp: Date.now()
    });
    
    await watchAd(rewardType);
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={!canWatch || isWatching}
      loading={isWatching}
    >
      {children}
    </Button>
  );
}
```

### 15.3 Duplicate Prevention

```tsx
// ✅ Good: Idempotent reward handling
function useAdRewardState() {
  const [rewardClaimed, setRewardClaimed] = useState(false);
  
  const claimReward = useCallback(async (viewId: string, amount: number) => {
    // Prevent duplicate claims
    if (rewardClaimed) {
      console.warn('Reward already claimed for this view');
      return;
    }
    
    try {
      await AdsGramService.claimReward(viewId, amount);
      setRewardClaimed(true);
    } catch (error) {
      if (isDuplicateError(error)) {
        console.warn('Duplicate reward claim prevented');
      }
      throw error;
    }
  }, [rewardClaimed]);
  
  return { claimReward, rewardClaimed };
}
```

---

## 16. Testing Standards

Testing ensures code correctness and prevents regressions.

### 16.1 Unit Testing

```typescript
// ✅ Good: Unit test for utility function
describe('formatCurrency', () => {
  it('formats positive numbers with currency symbol', () => {
    const result = formatCurrency(1000);
    expect(result).toBe('1,000 coins');
  });
  
  it('handles zero', () => {
    const result = formatCurrency(0);
    expect(result).toBe('0 coins');
  });
  
  it('formats negative numbers with minus sign', () => {
    const result = formatCurrency(-500);
    expect(result).toBe('-500 coins');
  });
});
```

### 16.2 Component Testing

```tsx
// ✅ Good: Component test with user interaction
describe('PlayerCard', () => {
  it('displays player name', () => {
    render(<PlayerCard player={mockPlayer} />);
    expect(screen.getByText(mockPlayer.displayName)).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<PlayerCard player={mockPlayer} onClick={onClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### 16.3 Hook Testing

```tsx
// ✅ Good: Hook test with renderHook
describe('usePlayer', () => {
  it('returns player data on success', async () => {
    mockPlayerService.getPlayer.mockResolvedValue(mockPlayer);
    
    const { result, waitFor } = renderHook(() => usePlayer('123'));
    
    await waitFor(() => expect(result.current.player).toEqual(mockPlayer));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('handles errors', async () => {
    mockPlayerService.getPlayer.mockRejectedValue(new Error('Not found'));
    
    const { result, waitFor } = renderHook(() => usePlayer('123'));
    
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.player).toBeNull();
  });
});
```

### 16.4 Integration Testing

```tsx
// ✅ Good: Integration test for user flow
describe('Claim Reward Flow', () => {
  it('completes full reward claim cycle', async () => {
    render(
      <AuthProvider>
        <RewardProvider>
          <RewardScreen />
        </RewardProvider>
      </AuthProvider>
    );
    
    // Check available reward
    expect(screen.getByText('Daily Reward Available')).toBeInTheDocument();
    
    // Click claim button
    await userEvent.click(screen.getByRole('button', { name: 'Claim' }));
    
    // Verify reward received
    await waitFor(() => {
      expect(screen.getByText('Reward Claimed!')).toBeInTheDocument();
    });
  });
});
```

---

## 17. Code Review Philosophy

Code reviews maintain quality and share knowledge.

### 17.1 Review Focus Areas

| Area | Focus |
|------|-------|
| **Maintainability** | Is code easy to understand and modify? |
| **Correctness** | Does code do what it's supposed to do? |
| **Consistency** | Does code follow established patterns? |
| **Scalability** | Will code work as the codebase grows? |
| **Performance** | Are there obvious performance issues? |
| **Security** | Are there potential security concerns? |

### 17.2 Review Checklist

**Functionality:**
- [ ] Code implements the required functionality
- [ ] Edge cases are handled
- [ ] Error cases are handled gracefully
- [ ] User experience is appropriate

**Code Quality:**
- [ ] Code follows naming conventions
- [ ] Functions are reasonably sized
- [ ] Logic is clear and readable
- [ ] No code duplication

**Type Safety:**
- [ ] Types are explicit and correct
- [ ] No use of `any` without justification
- [ ] Type guards used where appropriate

**Testing:**
- [ ] New code has appropriate tests
- [ ] Tests cover edge cases
- [ ] Tests are maintainable

---

## 18. Future Expansion Notes

Frontend standards may evolve to accommodate future technologies.

### 18.1 AI-Assisted Development

Future standards may address:

- AI code generation guidelines
- AI-assisted code review
- AI-powered testing suggestions
- AI documentation tools

### 18.2 Web3 Frontend Standards

Future blockchain features may require:

- Wallet connection patterns
- Transaction signing flows
- NFT display components
- Token balance integration

### 18.3 Creator Tools Standards

User-generated content may need:

- Content editor components
- Media upload handling
- Preview and publish flows
- Moderation integration

### 18.4 Esports UI Standards

Competitive features may require:

- Real-time updates
- Match visualization
- Tournament bracket display
- Spectator controls

---

## 19. Long-Term Philosophy

Frontend standards embody principles for sustainable development.

### 19.1 Code Quality

Standards ensure code quality through:

- Consistent patterns across the codebase
- Clear expectations for contributors
- Automated enforcement where possible

### 19.2 Reduced Technical Debt

Following standards prevents:

- Inconsistent code styles
- Difficult-to-maintain patterns
- Accumulated shortcuts
- Knowledge silos

### 19.3 Accelerated Development

Standards accelerate development by:

- Reducing decision overhead
- Enabling confident refactoring
- Supporting parallel development
- Easing code reviews

### 19.4 Simplified Onboarding

New developers benefit from:

- Clear, documented patterns
- Predictable code structure
- Consistent naming
- Examples to follow

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `.openhands/knowledge/folder-architecture.md` | Project structure |
| `.openhands/knowledge/feature-modules.md` | Feature organization |
| `.openhands/knowledge/shared-types.md` | Type standards |
| `.openhands/knowledge/validation-layer.md` | Validation patterns |
| `.openhands/knowledge/design-system.md` | Design tokens and UI |

---

*Last Updated: 2026-06-25*
