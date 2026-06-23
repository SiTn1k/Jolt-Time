# Jolt Time — UI Designer Agent

## Role Overview

The UI Designer Agent is responsible for creating the visual design, user interface components, interaction patterns, and overall user experience for Jolt Time. This agent bridges the gap between game design intent and technical implementation.

## Core Responsibilities

### 1. Visual Design System

**Responsible for:**
- Color palette definition
- Typography standards
- Spacing and layout system
- Icon design guidelines
- Animation principles
- Era-specific theming

**Design Reference:** See `knowledge/ui-style.md`

### 2. Component Library

**Core Components:**

#### Buttons
```
Primary Button
├── Default: Chronos Gold gradient, dark text
├── Hover: Brightness 110%
├── Active: Scale 0.98
├── Disabled: 50% opacity
├── Loading: Spinner + disabled state
└── Sizes: Small (36px), Medium (44px), Large (52px)

Secondary Button
├── Default: Transparent, blue border
├── Hover: Light blue fill
├── Active: Darker blue fill
└── Same size variants

Icon Button
├── Default: 44x44px, transparent
├── Hover: Light background
├── Active: Darker background
└── Variants: Filled, Outlined, Ghost
```

#### Cards
```
Era Card (320x180px mobile)
├── Background: Era-specific image
├── Overlay: Gradient bottom
├── Title: Cinzel font, white
├── Badge: Time period, top-left
├── Lock icon: If locked
└── Shadow: shadow-lg

Shard Card (100x140px)
├── Background: Rarity color glow
├── Image: Shard illustration
├── Name: Bottom text
├── Rarity: Star indicators
├── Collected: Checkmark overlay
└── Animation: Shimmer on new

Mission Card (full-width)
├── Left: Mission icon
├── Center: Title + description
├── Right: XP reward + status
├── Progress: Bottom bar
└── Lock: Grayscale if locked
```

#### Navigation
```
Bottom Tab Bar (56px + safe area)
├── 5 tabs: Home, Explore, Quests, Collection, Profile
├── Icons: 24x24px
├── Active: Gold color + label
├── Inactive: Gray color
└── Haptic: On tap

Header Bar (44px + safe area)
├── Left: Back/Menu
├── Center: Title
├── Right: Actions
└── Style: Blur background
```

#### Forms
```
Text Input
├── Height: 48px
├── Border: 2px, rounded-md
├── Focus: Gold border
├── Error: Red border + message
└── Variants: Default, Search, Number

Slider
├── Track: 4px height
├── Fill: Gold gradient
├── Thumb: 24px circle
└── Labels: Min/Max values

Toggle
├── Size: 52x28px
├── Off: Gray background
├── On: Gold background
└── Animation: 200ms ease
```

### 3. Screen Designs

#### Home Screen
```
┌─────────────────────────────────┐
│ [Header: Jolt Time logo + ⚙️]   │
├─────────────────────────────────┤
│                                 │
│   [Daily Reward Banner]         │
│   Streak: 🔥 5 days             │
│                                 │
│   ┌─────────────────────────┐   │
│   │    CURRENT ERA          │   │
│   │    Mesopotamia          │   │
│   │    [Continue Button]    │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────┐ ┌─────┐ ┌─────┐       │
│   │ ERA │ │ ERA │ │ ERA │       │
│   │  2  │ │  3  │ │  4  │ ...  │
│   └─────┘ └─────┘ └─────┘       │
│                                 │
│   [Quests] [Daily] [Events]     │
│                                 │
├─────────────────────────────────┤
│ [🏠] [🔍] [📜] [💎] [👤]        │
└─────────────────────────────────┘
```

#### Explore Screen
```
┌─────────────────────────────────┐
│ [← Back]  Explore Eras  [🔍]   │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │ 🏛️ Ancient Egypt        │   │
│   │ 2500 BCE • ★★★☆☆         │   │
│   │ Progress: 6/10 shards   │   │
│   │ ████████░░ 60%          │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ ⚔️ Ancient Greece       │   │
│   │ 500 BCE • ★★★☆☆         │   │
│   │ Progress: 0/10 shards   │   │
│   │ 🔒 Complete Egypt first │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ 🏛️ Roman Empire         │   │
│   │ 100 CE • ★★★★☆          │   │
│   │ Progress: 0/10 shards   │   │
│   │ 🔒 Complete Greece first│   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

#### Mission Screen
```
┌─────────────────────────────────┐
│ [←] Mission: The First Writing  │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │      [Illustration]     │   │
│   │      Mesopotamia         │   │
│   └─────────────────────────┘   │
│                                 │
│   "In the ancient city of Uruk, │
│    a young scribe dreams of     │
│    creating the first writing..."│
│                                 │
│   ┌─────────────────────────┐   │
│   │ OBJECTIVES               │   │
│   │ ○ Find clay tablet       │   │
│   │ ○ Talk to the elder      │   │
│   │ ○ Create your name       │   │
│   └─────────────────────────┘   │
│                                 │
│   Rewards: +25 XP 💎           │
│                                 │
│   ┌─────────────────────────┐   │
│   │     ▶️ START MISSION     │   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

#### Collection Screen
```
┌─────────────────────────────────┐
│ [←] My Shards (42/60)          │
├─────────────────────────────────┤
│                                 │
│   Filter: [All▼] Sort: [Recent▼]│
│                                 │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│   │ 💎 │ │ 💎 │ │ 💎 │ │ 💎 │   │
│   │ ★  │ │ ★  │ │ ☆  │ │ ★★ │   │
│   └────┘ └────┘ └────┘ └────┘   │
│                                 │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│   │ 💎 │ │ 💎 │ │ 💎 │ │ 💎 │   │
│   │ ★  │ │ ☆  │ │ ★★ │ │ ★  │   │
│   └────┘ └────┘ └────┘ └────┘   │
│                                 │
│   [Era 1 ▼] [Era 2 ] [Era 3 ]  │
│                                 │
├─────────────────────────────────┤
│ [🏠] [🔍] [📜] [💎] [👤]        │
└─────────────────────────────────┘
```

### 4. Interaction Patterns

#### Gestures
| Gesture | Action |
|---------|--------|
| Tap | Select, Confirm |
| Long Press | Info tooltip |
| Swipe Left | Next mission |
| Swipe Right | Previous |
| Swipe Down | Pull to refresh |
| Pinch | Zoom (where applicable) |
| Drag | Reorder, Move items |

#### Animations
| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Page transition | 250ms | ease-in-out | Screen changes |
| Modal appear | 300ms | spring | Popups |
| Card tap | 150ms | ease-out | Feedback |
| Shard collect | 500ms | custom | Celebration |
| Time travel | 800ms | warp | Era transitions |
| Button press | 100ms | ease | Immediate feedback |

### 5. Accessibility

**Requirements:**
- Minimum touch target: 44x44px
- Color contrast: 4.5:1 text, 3:1 UI
- Focus indicators for keyboard nav
- Screen reader labels
- Reduced motion support
- Scalable text (up to 200%)

### 6. Responsive Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| xs | 320px | Single column, full cards |
| sm | 375px | Single column, full cards |
| md | 428px | Single column, full cards |
| lg | 768px | 2-column grid, sidebar |

### 7. Telegram Integration

**WebApp SDK Usage:**
```javascript
// Theme detection
MainButton.setText('START');
if (window.Telegram.WebApp.colorScheme === 'dark') {
  // Apply dark theme
}

// Haptic feedback
window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

// Close
window.Telegram.WebApp.close();
```

### 8. Era-Specific Theming

| Era | Primary | Secondary | Accent | Pattern |
|-----|---------|-----------|--------|---------|
| Mesopotamia | Terracotta | Clay | Gold | Cuneiform |
| Egypt | Lapis | Sand | Gold | Hieroglyph |
| Greece | Marble | Olive | Bronze | Greek key |
| Rome | Purple | Red | Gold | Laurel |
| Medieval | Forest | Stone | Silver | Heraldic |
| Renaissance | Burgundy | Gilt | Cream | Floral |

### 9. Prototype Workflow

**Tools:**
- Figma for design
- Protopie or Principle for prototypes
- Zeplin for specs (if needed)

**Deliverables:**
- Component library in Figma
- Screen designs for all views
- Interactive prototypes
- Design tokens (CSS variables)
- Asset export (SVG, PNG @2x, @3x)

## Collaboration Protocol

### With Game Designer
- Review game mechanics UI needs
- Validate interaction feasibility
- Prototype game screens
- Iterate on feedback

### With Backend Agent
- Confirm data display requirements
- Validate form inputs
- Test API-driven UI
- Optimize for performance

### With Architect Agent
- Discuss component architecture
- Validate technical approach
- Review performance budgets
- Plan for scale

### With Documentation Agent
- Create UI documentation
- Document interaction patterns
- Provide asset specifications
- Write UX guidelines

---

*Design is not just what it looks like and feels like. Design is how it works.*
