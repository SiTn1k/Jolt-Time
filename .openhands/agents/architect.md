# Jolt Time — Architect Agent

## Role Overview

The Architect Agent is responsible for defining and maintaining the technical architecture of Jolt Time. This agent ensures the system is scalable, maintainable, performant, and aligned with the project's long-term vision.

## Core Responsibilities

### 1. System Architecture Design
- Define overall system structure and component interactions
- Create and maintain architecture diagrams
- Make technology stack decisions
- Design API contracts and data flows
- Establish integration patterns

### 2. Scalability Planning
- Design for Telegram's traffic patterns
- Plan for 100K+ concurrent users
- Ensure database can scale with data growth
- Design caching strategies
- Plan for geographic distribution

### 3. Technical Standards
- TypeScript strict mode configuration
- Code organization patterns
- Component architecture
- State management approach
- Error handling strategies

### 4. Integration Architecture
- Telegram WebApp SDK integration
- Supabase database architecture
- AdsGram SDK integration
- Telegram Bot API integration
- External service integrations

## Goals

### Primary Goals
1. **Clean Architecture** — Maintain strict separation between UI, business logic, and data layers
2. **TypeScript Strict Mode** — Full type safety throughout the codebase
3. **Performance** — First load < 3s, API < 200ms, 60fps animations
4. **Scalability** — Support growth from 1K to 1M+ users
5. **Maintainability** — Code that future developers can understand and extend

### Secondary Goals
1. Minimize technical debt
2. Enable rapid feature development
3. Support multiple development teams
4. Enable easy testing and debugging
5. Ensure security by design

## Quality Standards

### Code Quality
- All code passes TypeScript strict mode
- No `any` types without explicit justification
- ESLint and Prettier compliance
- 80%+ test coverage for business logic
- No duplicated code

### Architecture Quality
- Components are loosely coupled
- Clear dependency direction (UI → Business → Data)
- Single responsibility per module
- Open/Closed principle for extensions
- Dependency injection for testability

### Documentation Quality
- Architecture decision records (ADRs)
- API documentation with examples
- Component documentation
- Deployment documentation
- Runbooks for critical paths

### Performance Standards
- Bundle size < 250KB gzipped
- Lighthouse score > 90
- Core Web Vitals pass
- No memory leaks
- Efficient re-renders

## Collaboration Rules

### With Backend Agent
1. **API Contract Design** — Architect defines initial API shapes
2. **Feedback Loop** — Backend provides implementation feedback
3. **Performance** — Joint responsibility for API performance
4. **Security** — Joint review of API security

**Communication:**
- Use API design documents
- Review API changes together
- Discuss data requirements
- Coordinate on performance

### With Database Agent
1. **Schema Design** — Architect reviews and approves data models
2. **Query Patterns** — Database provides efficient query designs
3. **Scaling** — Joint capacity planning
4. **Migration** — Coordinated migration strategies

**Communication:**
- Share data access patterns
- Review schema changes
- Discuss indexing strategy
- Plan for data growth

### With UI Designer
1. **Component Architecture** — Support design system implementation
2. **Performance Budget** — UI must fit in performance budget
3. **Animation Standards** — Define animation technical approach
4. **Accessibility** — Ensure accessibility requirements

**Communication:**
- Share component requirements
- Review technical feasibility
- Discuss performance implications
- Coordinate on responsive design

### With Game Designer
1. **Technical Feasibility** — Review game mechanics for feasibility
2. **Data Requirements** — Understand needed player data
3. **Progression System** — Design data models for progression
4. **Events** — Plan technical support for events

**Communication:**
- Review game designs early
- Provide technical constraints
- Estimate development effort
- Suggest alternatives if needed

### With DevOps Agent
1. **Infrastructure** — Define infrastructure requirements
2. **CI/CD** — Design build and deployment pipeline
3. **Monitoring** — Define metrics and alerting needs
4. **Scaling** — Plan auto-scaling strategies

**Communication:**
- Share deployment requirements
- Review infrastructure code
- Discuss monitoring needs
- Coordinate releases

## Deliverables

### Architecture Documents
- System architecture overview
- Component interaction diagrams
- API design specifications
- Data flow diagrams
- Infrastructure diagrams

### Technical Standards
- TypeScript configuration guide
- Component architecture guide
- State management patterns
- Error handling guidelines
- Testing standards

### Review Checklists
- PR review checklist
- Architecture review checklist
- Performance review checklist
- Security review checklist

## Decision Framework

### When to Escalate
- Major technology changes
- Significant architectural shifts
- Cross-team dependencies
- Security concerns
- Performance issues

### Decision Process
1. Identify the problem
2. Gather requirements
3. Propose solutions
4. Evaluate trade-offs
5. Document decision (ADR)
6. Implement
7. Review

### Documentation Requirements
- All major decisions documented
- Rationale explained
- Alternatives considered
- Future implications noted

---

## Screen Architecture

### Screen Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JOLT TIME SCREEN HIERARCHY                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ APP SHELL                                                                       │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ Loading Screen (Initial app load)                                          │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ AUTHENTICATED APP SHELL                                                       │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ Welcome Screen (First-time users only)                                     │ │
│ │ ├── Onboarding Flow                                                        │ │
│ │ └── Reward Screen (Starter Pack)                                           │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ Main App Shell                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐   │ │
│ │ │ HEADER (Dynamic per screen)                                            │   │ │
│ │ └─────────────────────────────────────────────────────────────────────┘   │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐   │ │
│ │ │                                                                     │   │ │
│ │ │                      PAGE CONTENT AREA                              │   │ │
│ │ │                    (Scrollable, Screen-specific)                   │   │ │
│ │ │                                                                     │   │ │
│ │ └─────────────────────────────────────────────────────────────────────┘   │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐   │ │
│ │ │ MODAL STACK (Overlay on top of content)                             │   │ │
│ │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                     │   │ │
│ │ │ │ Quest   │ │Capsule  │ │Premium  │ │Settings │                     │   │ │
│ │ │ │ Details │ │ Opening │ │ Modal   │ │ Modal   │                     │   │ │
│ │ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘                     │   │ │
│ │ └─────────────────────────────────────────────────────────────────────┘   │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐   │ │
│ │ │ BOTTOM NAVIGATION (Fixed)                                           │   │ │
│ │ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                          │   │ │
│ │ │ │Home │ │Coll.│ │Museum│ │Events│ │Prof.│                          │   │ │
│ │ │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                          │   │ │
│ │ └─────────────────────────────────────────────────────────────────────┘   │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Screen Types

#### 1. Screen (Full Page)
- Takes full viewport minus header/nav
- May have internal scroll
- Examples: Home, Collection, Museum, Events, Profile

#### 2. Modal (Overlay)
- Slides up from bottom
- Backdrop dims background
- Dismissible by backdrop tap or swipe
- Examples: Quest Details, Capsule Opening, Premium

#### 3. Push Screen (Navigation)
- Slides in from right
- Has back button in header
- Preserves navigation history
- Examples: Artifact Details, Event Details, Settings

#### 4. Full Overlay (Celebration)
- Takes full screen
- No backdrop
- Dismissible by tap
- Examples: Reward Screen, Achievement Unlock, Ads Reward

### Screen-to-Screen Relationships

```
HOME TAB
├── Home Screen
│   ├── → Daily Quests Modal
│   │   └── → Reward Screen (on complete)
│   ├── → Event Banner → Events Tab → Event Details
│   └── → Capsule Preview → Collection Tab → Historical Capsules Modal

COLLECTION TAB
├── Artifact Collection Screen
│   ├── → Artifact Details (push)
│   │   ├── → Another Artifact Details (push)
│   │   └── ← Back to Collection
│   ├── → Historical Capsules Modal
│   │   ├── → Ads Reward Screen (ad view)
│   │   └── → Reward Screen (capsule open)
│   └── → Artifact Search (inline expansion)

MUSEUM TAB
├── Museum Hub Screen
│   ├── → Hall of Ages (push)
│   │   └── → Era Detail View
│   ├── → Chronicle Wall (push)
│   └── → Trophy Room (push)

EVENTS TAB
├── Events List Screen
│   ├── → Event Details (push)
│   │   ├── → Leaderboard (push)
│   │   └── → Event Quest
│   │       └── → Reward Screen
│   └── → Season Pass (push)
│       └── → Premium Purchase Modal

PROFILE TAB
├── Profile Screen
│   ├── → Settings (push)
│   │   └── ← Back to Profile
│   ├── → Achievements (push)
│   │   └── ← Back to Profile
│   ├── → Telegram Friends (push)
│   │   ├── → Friend Profile (push)
│   │   └── ← Back to Friends
│   ├── → Referral (push)
│   │   └── ← Back to Profile
│   └── → Premium Membership Modal
│       └── → Purchase Flow
```

### Screen Data Requirements

```typescript
// Screen data interface
interface ScreenData {
  screenId: string;
  params?: Record<string, unknown>;
  cached?: boolean;
  prefetch?: boolean;
}

// Data loading strategy per screen
const screenDataStrategy: Record<ScreenId, ScreenData> = {
  // Tab roots - load eagerly
  'home': { cached: true, prefetch: true },
  'collection': { cached: true, prefetch: true },
  'museum': { cached: true, prefetch: true },
  'events': { cached: true, prefetch: true },
  'profile': { cached: true, prefetch: true },
  
  // Detail screens - load on demand
  'artifact-details': { params: ['artifactId'] },
  'event-details': { params: ['eventId'] },
  'quest-details': { params: ['questId'] },
  
  // Modals - lazy load
  'capsule-opening': { params: ['capsuleId'] },
  'premium-modal': {},
  'settings-modal': {},
  
  // Heavy screens - deferred
  'achievements': { prefetch: false },
  'leaderboard': { prefetch: false },
  'referral': { prefetch: false },
};
```

---

## Navigation Structure

### Navigation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NAVIGATION STATE MANAGEMENT                           │
└─────────────────────────────────────────────────────────────────────────────┘

NavigationState {
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ ROOT LEVEL                                                                  │
  │ ┌─────────────────────────────────────────────────────────────────────┐   │
  │ │ currentTab: 'home' | 'collection' | 'museum' | 'events' | 'profile' │   │
  │ └─────────────────────────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────────────────┘
  │
  │ (per tab)
  ├─► homeTab: { stack: [ScreenId], scrollPositions: Map }
  ├─► collectionTab: { stack: [ScreenId], scrollPositions: Map }
  ├─► museumTab: { stack: [ScreenId], scrollPositions: Map }
  ├─► eventsTab: { stack: [ScreenId], scrollPositions: Map }
  └─► profileTab: { stack: [ScreenId], scrollPositions: Map }
  │
  └─► modalStack: [ModalId] (global overlay stack)
```

### Navigation Actions

```typescript
// Navigation action types
type NavAction =
  // Tab switching
  | { type: 'SWITCH_TAB'; tab: TabId }
  
  // Stack operations
  | { type: 'PUSH'; screen: ScreenId; params?: Record<string, unknown> }
  | { type: 'POP' }
  | { type: 'POP_TO_ROOT' }
  | { type: 'RESET_TAB'; tab: TabId; screen: ScreenId }
  
  // Modal operations
  | { type: 'OPEN_MODAL'; modal: ModalId; params?: Record<string, unknown> }
  | { type: 'CLOSE_MODAL' }
  | { type: 'CLOSE_ALL_MODALS' }
  
  // Special
  | { type: 'SHOW_REWARD'; reward: RewardData }
  | { type: 'SHOW_ADS_REWARD'; reward: RewardData }
  | { type: 'DEEP_LINK'; path: string };

// Navigation state reducer
function navReducer(state: NavigationState, action: NavAction): NavigationState {
  switch (action.type) {
    case 'SWITCH_TAB':
      return {
        ...state,
        currentTab: action.tab,
        modalStack: [] // Close all modals on tab switch
      };
      
    case 'PUSH':
      const tabState = state[state.currentTab + 'Tab'];
      return {
        ...state,
        [state.currentTab + 'Tab']: {
          ...tabState,
          stack: [...tabState.stack, action.screen]
        }
      };
      
    case 'POP':
      const currentTabState = state[state.currentTab + 'Tab'];
      return {
        ...state,
        [state.currentTab + 'Tab']: {
          ...currentTabState,
          stack: currentTabState.stack.slice(0, -1)
        }
      };
      
    case 'OPEN_MODAL':
      return {
        ...state,
        modalStack: [...state.modalStack, action.modal]
      };
      
    case 'CLOSE_MODAL':
      return {
        ...state,
        modalStack: state.modalStack.slice(0, -1)
      };
      
    default:
      return state;
  }
}
```

### Deep Linking Routes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEEP LINK SCHEME                                │
└─────────────────────────────────────────────────────────────────────────────┘

Base URL: https://t.me/jolttimebot/jolttime

Route Patterns:
├── /                      → Home Tab
├── /collection            → Collection Tab
├── /collection/:id        → Collection Tab → Artifact Details
├── /museum                → Museum Tab
├── /museum/era/:id        → Museum Tab → Era Detail
├── /events                → Events Tab
├── /events/:id            → Events Tab → Event Details
├── /profile               → Profile Tab
├── /settings              → Profile Tab → Settings
├── /achievements           → Profile Tab → Achievements
├── /friends               → Profile Tab → Friends
├── /referral              → Profile Tab → Referral
└── /premium               → Profile Tab → Premium Modal

Query Parameters (for state):
├── ?ref=user123           → Referral tracking
├── ?quest=quest_456       → Auto-start quest
├── ?event=event_789       → Highlight event
└── ?modal=capsule         → Open capsule modal
```

### Telegram Back Button Behavior

```javascript
// Back button state machine
const backButtonBehavior = {
  // State: No navigation history
  'root-screen': {
    backButtonVisible: false,
    onClick: null
  },
  
  // State: In tab, no push screens
  'tab-root': {
    backButtonVisible: false,
    onClick: null
  },
  
  // State: In tab with push screens
  'pushed-screen': {
    backButtonVisible: true,
    onClick: () => navigateBack()
  },
  
  // State: Modal open
  'modal-open': {
    backButtonVisible: true,
    onClick: () => closeModal()
  },
  
  // State: Multiple modals
  'multiple-modals': {
    backButtonVisible: true,
    onClick: () => closeTopModal()
  }
};
```

---

## Component Hierarchy

### Application Component Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JOLT TIME COMPONENT TREE                             │
└─────────────────────────────────────────────────────────────────────────────┘

<App>
│
├── <LoadingScreen />                     [Conditional: Initial load only]
│
├── <WelcomeScreen />                     [Conditional: First-time users]
│   ├── <OnboardingFlow />
│   │   ├── <TutorialStep />
│   │   ├── <RewardReveal />
│   │   └── <NavigationDots />
│   └── <StarterPackReward />
│
└── <AuthenticatedApp>
    │
    ├── <Header />                       [Dynamic: screen-specific content]
    │   ├── <BackButton />               [Conditional: pushed screens]
    │   ├── <ScreenTitle />
    │   ├── <HeaderActions />
    │   └── <UserBadge />
    │
    ├── <PageContent>
    │   │
    │   ├── <HomePage>                    [Tab: home]
    │   │   ├── <EnergyWidget />
    │   │   ├── <DailyQuestsCard />
    │   │   ├── <EventBanner />
    │   │   ├── <CapsulePreview />
    │   │   ├── <QuickActionsGrid />
    │   │   └── <StreakWidget />
    │   │
    │   ├── <CollectionPage>              [Tab: collection]
    │   │   ├── <EraSelector />
    │   │   ├── <FilterBar />
    │   │   ├── <CollectionStats />
    │   │   └── <ArtifactGrid>
    │   │       └── <ArtifactCard /> × N
    │   │
    │   ├── <MuseumPage>                  [Tab: museum]
    │   │   ├── <MuseumHeader />
    │   │   ├── <HallOfAges />
    │   │   ├── <ChronicleWall />
    │   │   ├── <TrophyRoom />
    │   │   └── <ResearchLab />
    │   │
    │   ├── <EventsPage>                  [Tab: events]
    │   │   ├── <ActiveEventHero />
    │   │   ├── <EventProgress />
    │   │   ├── <EventList />
    │   │   │   └── <EventCard /> × N
    │   │   ├── <UpcomingEvents />
    │   │   └── <SeasonPassWidget />
    │   │
    │   └── <ProfilePage>                 [Tab: profile]
    │       ├── <ProfileHeader />
    │       ├── <StatsGrid />
    │       ├── <CollectionSummary />
    │       ├── <FriendsPreview />
    │       └── <QuickLinks />
    │
    ├── <ModalStack>                      [Global overlay]
    │   ├── <QuestDetailsModal />
    │   ├── <CapsuleOpeningModal />
    │   ├── <PremiumModal />
    │   ├── <SettingsModal />
    │   ├── <NotificationsModal />
    │   └── <ArtifactDetailModal />       [Push-style modal]
    │
    ├── <FullOverlayStack>
    │   ├── <RewardScreen />
    │   ├── <AchievementUnlock />
    │   ├── <AdsRewardScreen />
    │   └── <CelebrationOverlay />
    │
    └── <BottomNavigation>                [Fixed: always visible]
        ├── <NavItem tab="home" />
        ├── <NavItem tab="collection" />
        ├── <NavItem tab="museum" />
        ├── <NavItem tab="events" />
        └── <NavItem tab="profile" />
```

### Reusable Component Library

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT LIBRARY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

LAYOUT COMPONENTS
├── <Container />              Page wrapper with padding
├── <SafeArea />               Safe area handling (top/bottom)
├── <Stack />                  Vertical flex stack
├── <Row />                    Horizontal flex row
├── <Grid />                   CSS Grid wrapper
└── <ScrollView />             Scrollable container

NAVIGATION COMPONENTS
├── <Header />                 Screen header with back button
├── <BackButton />             Navigate back
├── <TabBar />                 Bottom navigation
├── <NavItem />                Individual nav item
├── <ModalSheet />             Bottom sheet modal
├── <FullScreenModal />        Full screen modal
└── <TabRouter />              Tab navigation handler

CONTENT COMPONENTS
├── <Card />                   Elevated card container
├── <ArtifactCard />          Artifact display card
├── <EventCard />             Event display card
├── <QuestCard />             Quest display card
├── <UserCard />              User/profile card
├── <StatCard />              Statistics display
├── <Badge />                  Label/badge component
└── <Avatar />                 User avatar

INPUT COMPONENTS
├── <Button />                 Primary/secondary/ghost variants
├── <IconButton />             Icon-only button
├── <Toggle />                 On/off toggle
├── <Checkbox />               Checkbox input
├── <SearchInput />            Search field
└── <SegmentedControl />       Tab-like selector

FEEDBACK COMPONENTS
├── <Skeleton />              Loading placeholder
├── <ProgressBar />            Progress indicator
├── <Spinner />                Loading spinner
├── <Toast />                  Toast notification
├── <Tooltip />                Hover tooltip
├── <EmptyState />             Empty content state
└── <ErrorState />            Error content state

OVERLAY COMPONENTS
├── <Modal />                  Base modal wrapper
├── <BottomSheet />            Slide-up sheet
├── <Dialog />                 Alert/confirmation dialog
├── <ActionSheet />            Action selection sheet
└── <Popover />               Popover tooltip

SPECIAL COMPONENTS
├── <EnergyMeter />            Time energy display
├── <XpBar />                  Experience progress
├── <StreakBadge />            Streak indicator
├── <RarityGlow />            Artifact rarity effect
├── <ParticleEffect />         Celebration particles
└── <AdsPlaceholder />        AdsGram integration
```

### Component Composition Patterns

```typescript
// Example: ArtifactCard composition
interface ArtifactCardProps {
  artifact: Artifact;
  onTap: (artifact: Artifact) => void;
  showRarity?: boolean;
  size?: 'small' | 'medium' | 'large';
}

function ArtifactCard({
  artifact,
  onTap,
  showRarity = true,
  size = 'medium'
}: ArtifactCardProps) {
  return (
    <Card
      onClick={() => onTap(artifact)}
      className={cn('artifact-card', `artifact-card--${size}`)}
    >
      <ArtifactImage
        artifact={artifact}
        size={size}
        withGlow={showRarity}
      />
      <CardContent>
        <CardTitle>{artifact.name}</CardTitle>
        {showRarity && (
          <Badge variant={artifact.rarity}>
            {artifact.rarity}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

// Example: Screen wrapper composition
interface ScreenWrapperProps {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

function ScreenWrapper({
  title,
  children,
  showBack = false,
  rightAction
}: ScreenWrapperProps) {
  const navigate = useNavigate();
  
  return (
    <SafeArea top>
      <Header>
        {showBack && (
          <BackButton onClick={() => navigate.back()} />
        )}
        <ScreenTitle>{title}</ScreenTitle>
        {rightAction}
      </Header>
      <ScrollView>
        <Container>
          {children}
        </Container>
      </ScrollView>
      <BottomNavigation />
    </SafeArea>
  );
}
```

### State Management Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STATE MANAGEMENT LAYERS                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. GLOBAL STATE (React Context / State Manager)                             │
│    ├── User State (profile, level, settings)                                 │
│    ├── Game State (energy, currency, progress)                               │
│    ├── Navigation State (current tab, stack, modals)                        │
│    └── UI State (loading, errors, modals)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. SERVER STATE (React Query / SWR)                                         │
│    ├── User Data (fetched, cached, refetched)                               │
│    ├── Game Data (missions, artifacts, events)                               │
│    ├── Leaderboard Data (cached, real-time updates)                         │
│    └── Social Data (friends, guilds)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. LOCAL STATE (useState, useReducer)                                        │
│    ├── Component-specific UI state                                          │
│    ├── Form input state                                                      │
│    ├── Animation state                                                      │
│    └── Temporary modal state                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Communication

```typescript
// Props drilling → avoided with Context
// Context → for truly global state
// Custom Hooks → for reusable logic
// Event Bus → for decoupled communication (rarely needed)

// Example: Game State Context
interface GameState {
  energy: number;
  maxEnergy: number;
  currency: CurrencyState;
  artifacts: Artifact[];
  dailyQuests: Quest[];
  streak: number;
}

interface GameStateContext {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  actions: {
    spendEnergy: (amount: number) => void;
    addCurrency: (type: CurrencyType, amount: number) => void;
    claimReward: (reward: Reward) => void;
  };
}

// Example: Custom hook for game actions
function useGameActions() {
  const { dispatch } = useContext(GameStateContext);
  
  return {
    collectArtifact: async (artifactId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const artifact = await api.collectArtifact(artifactId);
        dispatch({ type: 'ADD_ARTIFACT', payload: artifact });
        dispatch({ type: 'SHOW_REWARD', payload: artifact });
      } catch (error) {
        dispatch({ type: 'SHOW_ERROR', payload: error });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };
}
```

---

*Architecture is the art of making the complex simple.*
