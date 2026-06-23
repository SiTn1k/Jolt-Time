# Jolt Time — UI/UX Style Guide

## Design Philosophy

> "History comes alive through beautiful design. Every pixel should transport players through time."

Our UI design balances the wonder of historical exploration with modern mobile usability. We create interfaces that feel both ancient and cutting-edge — where stone tablets meet holographic displays.

## Core Visual Identity

### Color Palette

#### Primary Colors (Light Theme)
| Name | Hex | Usage |
|------|-----|-------|
| **Chronos Gold** | `#C9A227` | Primary actions, highlights, achievements |
| **Temporal Blue** | `#1E3A5F` | Headers, navigation, emphasis |
| **Ancient Bronze** | `#8B5E3C` | Secondary elements, borders, icons |

#### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Papyrus Cream** | `#F5E6C8` | Backgrounds, cards |
| **Stone Gray** | `#6B7280` | Body text, secondary information |
| **Ember Red** | `#DC2626` | Errors, warnings, urgent actions |
| **Sage Green** | `#059669` | Success states, progress |

#### Era-Specific Accent Colors
| Era | Primary Accent | Secondary Accent |
|-----|----------------|------------------|
| Mesopotamia | Terracotta `#C2703A` | Clay `#D4A574` |
| Egypt | Lapis `#1E40AF` | Sand `#E5C07B` |
| Greece | Marble White `#F8F8F8` | Olive `#556B2F` |
| Rome | Imperial Purple `#7C3AED` | Legion Red `#991B1B` |
| Medieval | Forest Green `#15803D` | Castle Stone `#78716C` |
| Renaissance | Rich Burgundy `#881337` | Gilt `#D97706` |

#### Dark Theme Adaptations
- Backgrounds: Deep navy `#0F172A` to `#1E293B`
- Cards: Elevated surface `#334155`
- Text: Warm white `#F1F5F9`
- Reduced saturation on era colors

### Typography

#### Font Stack
```
Primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
Headers: 'Cinzel', Georgia, serif (for historical feel)
Monospace: 'JetBrains Mono', 'Fira Code', monospace (for stats)
```

#### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|--------------|
| H1 (Page Title) | 28px | 700 | 1.2 |
| H2 (Section) | 22px | 600 | 1.3 |
| H3 (Card Title) | 18px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Body Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |
| Button | 16px | 500 | 1.0 |
| Tab | 14px | 500 | 1.0 |

#### Telegram Considerations
- Use system fonts where possible for performance
- Ensure text is legible at small sizes
- Support dynamic type scaling

### Spacing System

#### Base Unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Icon padding, tight spacing |
| `space-sm` | 8px | Between related elements |
| `space-md` | 16px | Card padding, section gaps |
| `space-lg` | 24px | Between cards, major sections |
| `space-xl` | 32px | Page margins, large gaps |
| `space-2xl` | 48px | Hero sections |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Small buttons, badges |
| `radius-md` | 8px | Cards, inputs |
| `radius-lg` | 12px | Modals, large cards |
| `radius-xl` | 16px | Feature cards |
| `radius-full` | 9999px | Avatars, pills |

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Cards, buttons |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals, dropdowns |
| `shadow-glow` | 0 0 20px rgba(201,162,39,0.3) | Achievements, highlights |

## Component Design

### Buttons

#### Primary Button
- Background: Chronos Gold gradient
- Text: Dark background color
- Height: 48px minimum
- Border-radius: `radius-lg`
- States:
  - Default: Full opacity
  - Hover: Brightness 110%
  - Active: Scale 0.98
  - Disabled: Opacity 50%
  - Loading: Spinner + "Loading..."

#### Secondary Button
- Background: Transparent
- Border: 2px solid Temporal Blue
- Text: Temporal Blue
- Same sizing as primary

#### Icon Button
- Size: 44x44px (touch-friendly)
- Background: Transparent
- Icon: Era accent color
- States: Same as primary

### Cards

#### Base Card
- Background: Papyrus Cream (light) / Card surface (dark)
- Border: 1px solid Bronze with 20% opacity
- Border-radius: `radius-lg`
- Padding: `space-md`
- Shadow: `shadow-md`

#### Shard Card (Collectible)
- Golden glow border on hover
- Shimmer animation on new shards
- Era-specific background pattern
- Progress indicator for collection

#### Era Card
- Hero image with gradient overlay
- Era name in Cinzel font
- Time period badge
- Difficulty indicator
- Lock/unlock state

### Navigation

#### Bottom Tab Bar
- Height: 56px + safe area
- 5 tabs: Home, Explore, Quests, Collection, Profile
- Active: Chronos Gold icon + label
- Inactive: Stone Gray icon only
- Haptic feedback on tap

#### Header
- Height: 44px + safe area
- Left: Back button or menu
- Center: Page title (Cinzel)
- Right: Action icons (notifications, settings)
- Blur background on scroll

### Forms & Inputs

#### Text Input
- Height: 48px
- Border: 2px solid Stone Gray
- Focus: Border Chronos Gold
- Placeholder: Stone Gray 50%
- Error: Border Ember Red + message below

#### Slider
- Track: Stone Gray 30%
- Fill: Chronos Gold gradient
- Thumb: 24px circle with shadow
- Era-themed thumb variants

#### Toggle
- Size: 52x28px
- Off: Stone Gray background
- On: Chronos Gold background
- Smooth 200ms transition

### Feedback Elements

#### Toast Notifications
- Position: Top + safe area
- Background: Temporal Blue (dark)
- Text: White
- Duration: 3 seconds
- Swipe to dismiss

#### Loading States
- Skeleton: Animated shimmer
- Spinner: Era-themed (hourglass, sundial, etc.)
- Progress: Linear or circular with percentage

#### Empty States
- Illustration: Era-appropriate artwork
- Message: Encouraging, actionable
- CTA: Primary button to resolve

## Animation Guidelines

### Principles
1. **Purposeful** — Every animation has meaning
2. **Quick** — 150-300ms for micro-interactions
3. **Smooth** — 60fps minimum, ease-out curves
4. **Subtle** — Enhance, don't distract

### Animation Tokens
| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `duration-fast` | 150ms | ease-out | Hover, toggle |
| `duration-normal` | 250ms | ease-in-out | Page transitions |
| `duration-slow` | 400ms | ease-out | Modal, dropdown |
| `duration-reveal` | 600ms | cubic-bezier | Card reveals |

### Key Animations
- **Shard Collection:** Burst particles + golden ripple + haptic
- **Time Travel:** Warp effect + timeline sweep + arrival particles
- **Level Up:** Confetti burst + glow pulse + sound
- **Achievement:** Stamp effect + badge reveal + fanfare

## Responsive Design

### Breakpoints
| Name | Width | Usage |
|------|-------|-------|
| `xs` | 320px | Small phones |
| `sm` | 375px | Standard phones |
| `md` | 428px | Large phones, phablets |
| `lg` | 768px | Tablets, desktop |

### Layout Patterns
- **Mobile (< 428px):** Single column, full-width cards
- **Phablet (428-768px):** Wider cards, more padding
- **Tablet (768px+):** Grid layout, sidebar navigation

### Telegram-Specific
- Safe area insets respected
- Bottom sheet modals preferred
- Native feel for iOS/Android
- Theme sync with Telegram

## Accessibility

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 against adjacent colors

### Motion Sensitivity
- Respect `prefers-reduced-motion`
- Disable animations when set
- Keep essential feedback (loading, errors)

### Screen Reader Support
- Semantic HTML elements
- ARIA labels on icons
- Role attributes where needed
- Focus management

## Visual Assets

### Icon Library
- Custom icons for core features
- Outlined style for navigation
- Filled style for selected states
- Era-specific icon variants

### Illustrations
- Hand-drawn style for empty states
- Geometric patterns for era backgrounds
- Particle systems for celebrations
- No photographic images

### Photography
- Used sparingly for era content
- Sepia/filtered for historical feel
- Always have text alternative

---

*Design is not just what it looks like. Design is how it feels.*
