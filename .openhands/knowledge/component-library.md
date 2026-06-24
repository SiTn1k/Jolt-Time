# Component Library Architecture

## Overview

This document defines the complete component library architecture for Jolt Time. The library provides reusable, accessible, and consistent UI components built on top of the design system defined in `ui-style.md`.

**Technology Stack:**
- Framework: React + TypeScript
- Styling: CSS Modules with CSS Variables
- Icons: Lucide React
- State: Zustand (via UI Store)

---

## Component Categories

The component library is organized into seven categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Base Components** | Fundamental UI primitives | Button, Input, Card, Badge, Avatar, Progress |
| **Layout Components** | Page and content structure | PageLayout, Section, Grid, Container |
| **Form Components** | User input and controls | TextField, Select, Checkbox, Slider, Toggle |
| **Game Components** | Game-specific UI elements | ArtifactCard, MissionCard, BattleCard, CurrencyDisplay |
| **Social Components** | Social feature elements | FriendCard, GuildCard, LeaderboardEntry, ProfileCard |
| **Modal Components** | Overlay dialogs and popups | ConfirmModal, RewardPopup, InfoModal, CustomModal |
| **Navigation Components** | App navigation elements | BottomNav, Header, Tabs, Breadcrumbs |

---

## Component Philosophy

### Design Principles

1. **Composability**
   - Components build from simple to complex
   - Small components combine into larger ones
   - No component is too small to be reusable

2. **Single Responsibility**
   - Each component does one thing well
   - Presentation and logic are separated
   - Props control behavior, children control content

3. **Predictability**
   - Same inputs always produce same outputs
   - Consistent naming across the library
   - Clear prop interfaces with TypeScript types

### Maintainability

- **Documentation First** — Every component has usage examples
- **Consistent Patterns** — Same structure for all components
- **Easy Testing** — Pure components are simple to unit test
- **Clear Ownership** — Component category defines responsibility

### Accessibility Standards

- **WCAG 2.1 AA Compliance**
- **Semantic HTML** — Proper element choices
- **ARIA Labels** — Where native semantics are insufficient
- **Keyboard Navigation** — Full keyboard support
- **Touch Targets** — Minimum 44x44px

---

## Base Component Structure

Base components are the fundamental building blocks of the UI.

### Button

**Purpose:** Primary interactive element for user actions.

**Variants:**
| Variant | Usage |
|---------|-------|
| `primary` | Main actions, high visibility |
| `secondary` | Secondary actions |
| `ghost` | Subtle actions, background actions |
| `danger` | Destructive actions |

**Sizes:** `small` (36px), `medium` (48px), `large` (56px)

**States:**
- Default, Hover, Active, Focused, Disabled, Loading

**Props Interface:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
}
```

### Input

**Purpose:** Text and number user input.

**Variants:** `default`, `search`, `numeric`

**States:**
- Default, Focused, Error, Disabled, ReadOnly

**Props Interface:**
```typescript
interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'search';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  maxLength?: number;
}
```

### Card

**Purpose:** Container for grouped content.

**Variants:**
| Variant | Usage |
|---------|-------|
| `default` | Standard content card |
| `elevated` | Emphasis with shadow |
| `interactive` | Clickable card with hover state |
| `premium` | Gold border for premium content |

**Props Interface:**
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'interactive' | 'premium';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  children: ReactNode;
}
```

### Badge

**Purpose:** Status indicators and labels.

**Variants:**
| Variant | Color | Usage |
|---------|-------|-------|
| `primary` | Cyan | Active status |
| `success` | Green | Completed, success |
| `warning` | Orange | Warnings, pending |
| `error` | Red | Errors, critical |
| `premium` | Gold | Premium content |
| `muted` | Gray | Disabled, inactive |

**Props Interface:**
```typescript
interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'premium' | 'muted';
  size?: 'small' | 'medium';
  children: ReactNode;
}
```

### Avatar

**Purpose:** User profile representation.

**Sizes:** `small` (32px), `medium` (48px), `large` (64px), `xlarge` (96px)

**Variants:**
| Variant | Usage |
|---------|-------|
| `image` | User uploaded image |
| `initial` | First letter of name |
| `placeholder` | Default avatar |

**Props Interface:**
```typescript
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  status?: 'online' | 'offline' | 'in-game';
  onClick?: () => void;
}
```

### Progress Bar

**Purpose:** Visual progress indication.

**Variants:**
| Variant | Usage |
|---------|-------|
| `default` | Standard progress |
| `animated` | Shimmer effect for loading |
| `segmented` | Discrete steps |
| `circular` | Circular progress indicator |

**Props Interface:**
```typescript
interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'animated' | 'segmented' | 'circular';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  showValue?: boolean;
}
```

---

## Layout Component Structure

Layout components structure the page and content organization.

### PageLayout

**Purpose:** Root layout wrapper for all pages.

**Structure:**
```
<PageLayout>
  <Header />
  <main>{children}</main>
  <BottomNav />
</PageLayout>
```

**Responsibilities:**
- Safe area handling (Telegram Mini App)
- Keyboard-aware scrolling
- Scroll restoration

### Section

**Purpose:** Logical content grouping with optional header.

**Props Interface:**
```typescript
interface SectionProps {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  noPadding?: boolean;
  children: ReactNode;
}
```

### Grid

**Purpose:** Responsive grid layout for card collections.

**Props Interface:**
```typescript
interface GridProps {
  columns?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'small' | 'medium' | 'large';
  children: ReactNode;
}
```

### Container

**Purpose:** Centered content wrapper with max-width.

**Props Interface:**
```typescript
interface ContainerProps {
  size?: 'small' | 'medium' | 'large' | 'full';
  centerContent?: boolean;
  children: ReactNode;
}
```

---

## Navigation Component Structure

Navigation components enable app-wide movement.

### BottomNav

**Purpose:** Primary app navigation on mobile.

**Items:**
| Item | Icon | Route |
|------|------|-------|
| Home | Home | `/` |
| Events | Calendar | `/events` |
| Museum | Building | `/museum` |
| Social | Users | `/social` |
| Profile | User | `/profile` |

**Behavior:**
- Fixed position at bottom
- Active state with cyan indicator
- Haptic feedback on press
- Badge support for notifications

### Header

**Purpose:** Page-level header with title and actions.

**Props Interface:**
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}
```

### Tabs

**Purpose:** In-page content switching.

**Props Interface:**
```typescript
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}
```

### Breadcrumbs

**Purpose:** Navigation path indication.

**Props Interface:**
```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}
```

---

## Modal System Philosophy

Modals interrupt the current flow to focus attention on critical information or actions.

### Modal Types

| Type | Purpose | User Action |
|------|---------|-------------|
| **Confirm** | Destructive action confirmation | Accept/Cancel |
| **Reward** | Display earned rewards | View/Claim |
| **Info** | Important information display | Acknowledge |
| **Custom** | Flexible content container | Close |

### Modal Architecture

```
useUIStore
  ├── activeModal: ModalType | null
  ├── modalProps: Record<string, unknown>
  └── stack: ModalType[]

ModalContainer (renders active modal)
  ├── ConfirmModal
  ├── RewardPopup
  ├── InfoModal
  └── CustomModal
```

### Confirmation Dialogs

**Usage:** Destructive or irreversible actions.

**Content:**
- Title: Action description
- Body: Consequences explanation
- Actions: Cancel (secondary), Confirm (danger)

### Reward Popups

**Usage:** Display earned rewards.

**Content:**
- Celebratory animation
- Reward icon and name
- Quantity display
- Claim button

### Information Modals

**Usage:** Important but non-blocking information.

**Content:**
- Title: Topic summary
- Body: Detailed information
- Action: Acknowledge button

---

## Game Component Structure

Game components are specialized UI elements for gameplay features.

### ArtifactCard

**Purpose:** Display artifact information.

**Content:**
- Artifact image/illustration
- Name and era
- Rarity indicator
- Stats summary
- Evolution level

**States:**
- Default, Selected, Locked, OnDisplay

**Interactions:**
- Tap: View details
- Long press: Quick actions menu

### MissionCard

**Purpose:** Display mission/quest information.

**Content:**
- Mission title
- Description
- Progress bar
- Reward preview
- Time remaining (if applicable)

**States:**
- Available, InProgress, Completed, Expired

### BattleCard

**Purpose:** Display PvP battle information.

**Content:**
- Opponent avatar and name
- Player rank badge
- Reward preview
- Match type indicator

**States:**
- Waiting, InProgress, Victory, Defeat

### CurrencyDisplay

**Purpose:** Show currency balance.

**Content:**
- Currency icon
- Amount (formatted)
- Trend indicator (optional)

**Variants:**
- Compact (icon + number)
- Full (icon + name + number)
- Animated (balance change)

### MuseumItemCard

**Purpose:** Display item in museum context.

**Content:**
- Item visual
- Name plate
- Display slot indicator
- Rarity glow effect

---

## Social Component Structure

Social components display player relationships and community features.

### FriendCard

**Purpose:** Display friend information.

**Content:**
- Avatar with status
- Display name
- Level/progress
- Last active time
- Quick actions (message, remove)

### GuildCard

**Purpose:** Display guild information.

**Content:**
- Guild emblem
- Guild name
- Member count
- Rank indicator
- Join button (if not member)

### LeaderboardEntry

**Purpose:** Display leaderboard row.

**Content:**
- Rank number
- Player avatar
- Player name
- Score/value
- Trend indicator (up/down/stable)

**Variants:**
- Compact (list view)
- Expanded (detail view)

### ProfileCard

**Purpose:** Display player profile summary.

**Content:**
- Large avatar
- Display name
- Level badge
- Join date
- Quick stats
- Action buttons (friend, message)

---

## Form Component Structure

Form components handle user input across the application.

### TextField

**Purpose:** Single-line text input.

**Extends:** Base Input component with form-specific features.

### Select

**Purpose:** Dropdown selection.

**Props Interface:**
```typescript
interface SelectProps {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
}
```

### Checkbox

**Purpose:** Boolean toggle.

**Props Interface:**
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}
```

### Slider

**Purpose:** Range value selection.

**Props Interface:**
```typescript
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}
```

### Toggle

**Purpose:** Binary on/off selection.

**Props Interface:**
```typescript
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
```

---

## Design Consistency Philosophy

All components maintain consistent behavior and appearance.

### Visual Language

**Consistent Elements:**
- Border radius: 8px (small), 12px (medium), 16px (large), 20px (cards)
- Shadows: 3 levels (sm, md, lg) plus glow variants
- Spacing: 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48)
- Typography: Inter font, scale defined in ui-style.md

### Theme System

**CSS Variables:**
```css
:root {
  /* Colors (from ui-style.md) */
  --bg-primary: #0A0E17;
  --bg-card: #131B2E;
  --primary: #00D9FF;
  --accent: #00FFE5;
  --premium: #FFD700;
  
  /* Semantic */
  --success: #00FF88;
  --warning: #FFB800;
  --error: #FF4757;
  
  /* Component-specific */
  --button-height-medium: 48px;
  --card-padding: 16px;
  --input-height: 48px;
}
```

### Animation Consistency

**Standard Timings:**
- Fast: 150ms (hover, toggle)
- Normal: 250ms (transitions)
- Slow: 400ms (modals, reveals)
- Reveal: 600ms (page transitions)

**Standard Easing:**
- Ease out: `cubic-bezier(0.16, 1, 0.3, 1)`
- Ease in-out: `cubic-bezier(0.65, 0, 0.35, 1)`
- Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)`

### Interaction Patterns

**Hover States:**
- Subtle color shift
- Shadow increase
- Scale 1.02 for interactive cards

**Active States:**
- Scale 0.98
- Color darken
- Shadow decrease

**Focus States:**
- 2px cyan outline
- 2px offset

---

## Loading and Empty States

Every component handles loading, empty, and error states gracefully.

### Skeleton Loaders

**Purpose:** Indicate content is loading.

**Variants:**
- SkeletonText (line)
- SkeletonAvatar (circle)
- SkeletonCard (rectangle)
- SkeletonList (multiple lines)

**Animation:** Shimmer effect with gradient sweep.

**Usage:**
```tsx
<Card>
  <SkeletonAvatar size="medium" />
  <SkeletonText lines={2} />
</Card>
```

### Empty States

**Purpose:** Inform user when no content exists.

**Structure:**
- Icon (illustrative)
- Title (what's empty)
- Description (why it's empty)
- Action button (optional)

**Example:**
```
┌─────────────────────────┐
│                         │
│         [Icon]          │
│                         │
│    No Friends Yet       │
│                         │
│  Add friends to compare │
│    your progress!       │
│                         │
│   [+ Add Friend]        │
│                         │
└─────────────────────────┘
```

### Error States

**Purpose:** Inform user when something failed.

**Structure:**
- Error icon
- Error title
- Error description
- Retry button

**Behavior:**
- Error message is user-friendly
- Retry action attempts the operation again
- Fallback to cached data when available

---

## Accessibility Notes

### Readable Text

- **Contrast Ratio:** Minimum 4.5:1 for body text
- **Font Size:** Minimum 14px for body, 12px for captions
- **Font Weight:** Appropriate weights for hierarchy
- **Line Height:** 1.5 for body text

### Touch-Friendly Interactions

- **Target Size:** Minimum 44x44px, recommended 48x48px
- **Spacing:** Minimum 8px between interactive elements
- **Feedback:** Visual and haptic feedback on press
- **Gestures:** Support for swipe, long press where appropriate

### Keyboard Compatibility

- **Focus Order:** Logical tab order following visual layout
- **Focus Indicators:** Visible focus state for all interactive elements
- **Keyboard Actions:** Enter/Space for buttons, Escape for modals
- **Skip Links:** Skip navigation on long pages (where applicable)

### Screen Reader Support

- **Semantic HTML:** Proper element choices (button, nav, main)
- **ARIA Labels:** Descriptive labels for icon-only buttons
- **ARIA Described:** Additional context for complex components
- **Live Regions:** Announce dynamic content changes

### Reduced Motion

**Respects System Preference:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Future Expansion Notes

The component library architecture supports future categories without modification.

### NFT Components (Future Concept)

Conceptual components: NFTGrid, NFTDetailCard, WalletConnector, TradeConfirmation.

**Design Notes:**
- Will integrate when Web3 features are approved
- Requires wallet connection UI
- Trade confirmations with blockchain status

### Creator Components (Future Concept)

Conceptual components: CreatorBadge, ContentCard, SubmissionForm, ModerationStatus.

**Design Notes:**
- For user-generated content display
- Requires moderation status indicators
- Submission workflow components

### Esports Components (Future Concept)

Conceptual components: BracketView, MatchTimer, SpectatorOverlay, TournamentCard.

**Design Notes:**
- For competitive tournament features
- Real-time update indicators
- Bracket visualization components

### AI Assistant Components (Future Concept)

Conceptual components: ChatBubble, AIIcon, SuggestionChip, ContextualHelp.

**Design Notes:**
- For AI companion feature
- Chat-style interface
- Contextual suggestion system

---

## Long-Term Philosophy

### Reduce Development Time

- **Reusable Components** — Build once, use everywhere
- **Consistent Patterns** — No need to redesign common UI
- **Documentation** — Clear examples speed implementation
- **Testing** — Well-designed components are easy to test

### Improve Consistency

- **Single Source of Truth** — One component, many uses
- **Design System Integration** — Automatic design updates
- **Predictable Behavior** — Same interactions everywhere
- **Accessibility** — Built-in accessibility compliance

### Simplify Maintenance

- **Isolated Changes** — Modify one component, fix everywhere
- **No Duplication** — Single component vs copy-paste
- **Version Control** — Clear component history
- **Deprecation Path** — Graceful component retirement

---

## Related Documentation

- **UI Style Guide:** `.openhands/knowledge/ui-style.md`
- **State Management:** `.openhands/knowledge/state-management.md`
- **Screens:** `.openhands/knowledge/screens.md`
- **Navigation:** `.openhands/knowledge/navigation.md`
- **Accessibility:** `.openhands/knowledge/accessibility.md`

---

*Last Updated: 2026-06-24*
