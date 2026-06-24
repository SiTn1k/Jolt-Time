# Design System Architecture

## Overview

This document defines the comprehensive design system architecture for Jolt Time. It establishes the visual language, design tokens, and global standards that ensure consistency across all application surfaces.

**Design Identity:** Premium dark futuristic with soft glowing elements
**Platform:** Telegram Mini App (mobile-first)
**Architecture Scope:** Visual tokens, typography, spacing, theming, accessibility

---

## Design Categories

The design system is organized into seven foundational categories:

| Category | Purpose | Implementation |
|----------|---------|----------------|
| **Colors** | Visual identity and semantic meaning | CSS custom properties |
| **Typography** | Text hierarchy and readability | Font families, scales, weights |
| **Spacing** | Layout rhythm and alignment | 8px base unit system |
| **Border Radius** | Shape language and softness | Consistent corner radii |
| **Shadows** | Depth and hierarchy | Elevation levels |
| **Icons** | Visual communication | Stroke-based iconography |
| **Animations** | Motion language and feedback | Standardized timing and easing |

---

## Design Philosophy

### Core Principles

1. **Clarity Over Complexity**
   - Every visual element serves a purpose
   - Avoid decorative complexity that obscures content
   - Clean interfaces enable quick comprehension

2. **Readability First**
   - Text must be legible at all sizes
   - Contrast ratios meet accessibility standards
   - Typography hierarchy guides the eye naturally

3. **Consistency as Foundation**
   - Same patterns produce same results
   - Designers and developers speak the same visual language
   - Updates propagate automatically through token system

4. **Performance Awareness**
   - Animations never block interaction
   - Visual effects optimize for mobile hardware
   - No heavy assets that slow load times

### Visual Identity

Jolt Time's visual identity combines futuristic technology aesthetics with historical theming:

- **Futuristic Elements:** Glowing accents, soft gradients, clean geometry
- **Historical Elements:** Artifact imagery, era-specific color hints, cultural motifs
- **Unifying Theme:** Premium feel that makes players feel valued

---

## Color System

Colors define brand identity and communicate meaning.

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | #00D9FF | Main accent, interactive elements, key actions |
| `--primary-dim` | #00A8C6 | Hover states, secondary emphasis |
| `--primary-glow` | rgba(0, 217, 255, 0.3) | Glow effects, soft emphasis |

**Usage:** Buttons, links, active states, key interactive elements

### Secondary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent` | #00FFE5 | Secondary accent, success highlights |
| `--accent-dim` | #00CCB8 | Hover states for accent elements |
| `--accent-glow` | rgba(0, 255, 229, 0.3) | Accent glow effects |

**Usage:** Complementary accents, achievements, success states

### Premium Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--premium` | #FFD700 | Premium content, rare items, gold accents |
| `--premium-dim` | #CCB000 | Hover states for premium elements |
| `--premium-glow` | rgba(255, 215, 0, 0.3) | Premium glow effects |

**Usage:** Premium features, rare artifacts, special rewards

### Semantic Colors

| Token | Hex | Meaning |
|-------|-----|---------|
| `--success` | #00FF88 | Positive outcomes, completed actions |
| `--warning` | #FFB800 | Caution states, pending items |
| `--error` | #FF4757 | Errors, destructive actions, critical issues |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | #0A0E17 | Main background |
| `--bg-secondary` | #0F1525 | Secondary surfaces, subtle backgrounds |
| `--bg-card` | #131B2E | Card backgrounds, elevated surfaces |
| `--bg-elevated` | #1A2540 | Highest elevation, modal backgrounds |
| `--text-primary` | #FFFFFF | Primary text, headings |
| `--text-secondary` | #B8C5D6 | Secondary text, descriptions |
| `--text-muted` | #6B7A8F | Muted text, placeholders, disabled |

### Background Elevation System

| Level | Token | Usage |
|-------|-------|-------|
| 0 | `--bg-primary` | Base layer, page background |
| 1 | `--bg-secondary` | Section backgrounds |
| 2 | `--bg-card` | Card surfaces, list items |
| 3 | `--bg-elevated` | Modals, dropdowns, tooltips |

---

## Typography Philosophy

Typography establishes hierarchy and ensures readability across all devices.

### Font Stack

```
'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

**Rationale:**
- Inter: Designed for screen readability
- System fallbacks: Native feel on each platform
- Universal availability: No custom font loading required

### Type Scale

| Element | Size | Weight | Line Height | Tracking |
|---------|------|--------|-------------|----------|
| **H1** | 28px | 700 | 1.2 | -0.02em |
| **H2** | 24px | 600 | 1.3 | -0.01em |
| **H3** | 20px | 600 | 1.4 | 0 |
| **Body** | 16px | 400 | 1.5 | 0 |
| **Body Small** | 14px | 400 | 1.5 | 0 |
| **Caption** | 12px | 400 | 1.4 | 0.02em |
| **Button** | 16px | 500 | 1 | 0.01em |

### Heading Philosophy

**H1 — Page Titles**
- Largest, boldest text
- Used sparingly for primary focus
- Sets context immediately

**H2 — Section Headers**
- Secondary hierarchy
- Groups related content
- Clear visual break from body

**H3 — Card Titles**
- Content-specific headers
- Consistent within cards
- Supports scanning

### Body Text Philosophy

**Readability Standards:**
- Minimum 16px for body text
- Line height 1.5 for comfortable reading
- Adequate contrast (4.5:1 minimum)
- Moderate letter spacing (no stretching)

**Body Small Usage:**
- Secondary information
- Timestamps and metadata
- Helper text

### Caption Usage

- Labels and categories
- Timestamps and dates
- Supplementary information
- Smallest readable size (12px minimum)

### Label Standards

- All-caps for category labels (letter-spacing: 0.05em)
- Sentence case for button labels
- Numerals use monospace for alignment

---

## Spacing Philosophy

Spacing creates visual rhythm and ensures elements feel intentionally placed.

### Base Unit System

All spacing derives from a 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight internal padding |
| `--space-2` | 8px | Default small gaps |
| `--space-3` | 12px | Small-medium gaps |
| `--space-4` | 16px | Default spacing |
| `--space-5` | 20px | Medium-large gaps |
| `--space-6` | 24px | Large gaps |
| `--space-8` | 32px | Section gaps |
| `--space-10` | 40px | Major section spacing |
| `--space-12` | 48px | Page margins |
| `--space-16` | 64px | Large section breaks |

### Layout Rhythm

**Vertical Rhythm:**
- Related items: 8-12px gap
- Separate sections: 24-32px gap
- Major divisions: 48-64px spacing

**Horizontal Rhythm:**
- Card padding: 16px
- Button padding: 12px vertical, 24px horizontal
- Input padding: 12px
- Icon-to-text gap: 8px

### Responsive Spacing

| Breakpoint | Container Padding | Card Grid Gap |
|------------|-------------------|---------------|
| < 768px | 16px | 16px |
| 768px - 1024px | 24px | 16px |
| > 1024px | 32px | 24px |

---

## Border Radius Philosophy

Corner radius defines the softness and character of UI elements.

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small elements, badges, inputs |
| `--radius-md` | 12px | Buttons, small cards |
| `--radius-lg` | 16px | Cards, panels |
| `--radius-xl` | 20px | Modals, large cards |
| `--radius-full` | 9999px | Pills, avatars, circular buttons |

### Shape Language

**Sharp Edges (radius-sm):**
- Input fields
- Badges and tags
- Data displays

**Soft Edges (radius-md):**
- Buttons
- Small cards
- Action elements

**Rounded (radius-lg):**
- Content cards
- Section containers
- List items

**Fully Rounded (radius-full):**
- Avatar circles
- Icon buttons
- Progress indicators

### Card Appearance

Standard card radius: 16px
- Provides modern, approachable feel
- Consistent with button radius progression
- Large enough to feel intentional

---

## Shadows Philosophy

Shadows create depth hierarchy and indicate elevation.

### Shadow Scale

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle depth, resting state |
| `--shadow-md` | Standard elevation, cards |
| `--shadow-lg` | High elevation, modals |
| `--shadow-glow` | Accent glow, primary emphasis |

### Elevation System

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | None | Flat elements, backgrounds |
| 1 | `--shadow-sm` | Cards at rest, list items |
| 2 | `--shadow-md` | Hovered cards, dropdowns |
| 3 | `--shadow-lg` | Modals, popovers |

### Glow Effects

Glow effects replace traditional shadows for accent elements:

```
--glow-soft: 0 0 20px [color]
--glow-medium: 0 0 40px [color]
--glow-strong: 0 0 60px [color]
```

**Usage:** Interactive element focus, premium content, achievement highlights

---

## Icon Philosophy

Icons communicate quickly and support accessibility.

### Icon Style

| Attribute | Standard |
|-----------|----------|
| **Stroke Width** | 2px |
| **Corner Radius** | 4px |
| **Default Size** | 24px |
| **Small Size** | 20px |
| **Large Size** | 32px |
| **Fill** | None (stroke-based) |
| **Color** | currentColor |

### Accessibility Requirements

- **Descriptive Labels:** Icon-only buttons require aria-label
- **Sufficient Contrast:** Icons must meet 3:1 contrast against background
- **Size Minimum:** 20px for inline, 24px for standalone
- **Touch Target:** 44x44px minimum for tappable icon buttons

### Icon Usage Patterns

**Inline Icons:**
- Adjacent to text labels
- Size matches text size
- Color inherits from parent

**Standalone Icons:**
- Navigation items
- Action buttons
- Status indicators

**Glow Variant:**
- Active navigation items
- Achievement icons
- Premium indicators

---

## Animation Philosophy

Animations enhance user experience without causing delay or discomfort.

### Animation Principles

1. **Purposeful Motion**
   - Animation communicates state change
   - Guides user attention
   - Provides feedback

2. **Subtle Effects**
   - Never distracting or disorienting
   - Fast enough to feel responsive
   - Slow enough to perceive clearly

3. **Performance First**
   - GPU-accelerated properties only
   - No animation blocks interaction
   - Reduced motion respected

### Standard Timings

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-fast` | 150ms | Hover, toggle, micro-interactions |
| `--duration-normal` | 250ms | Transitions, state changes |
| `--duration-slow` | 400ms | Modals, page transitions |
| `--duration-reveal` | 600ms | Content reveals, celebrations |

### Easing Functions

| Token | Curve | Usage |
|-------|-------|-------|
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Entering elements |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Symmetric transitions |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy feedback |

### Key Animations

| Animation | Type | Usage |
|-----------|------|-------|
| **fadeIn** | Opacity 0→1 | Modal appearance |
| **slideUp** | Translate + opacity | Card entry |
| **scaleIn** | Scale + opacity | Button feedback |
| **glowPulse** | Box-shadow | Achievement emphasis |
| **float** | Translate Y | Decorative motion |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Theme Support

The design system supports multiple themes for future customization.

### Theme Architecture

```
CSS Custom Properties (tokens)
       ↓
Theme Selector ([data-theme="dark"])
       ↓
Component Styles (tokens reference)
```

### Dark Theme (Default)

Current Jolt Time implementation.

**Characteristics:**
- Background: #0A0E17 (deep blue-black)
- Cards: #131B2E (elevated blue)
- Primary: #00D9FF (bright cyan)
- Text: High contrast white on dark

### Light Theme (Future)

Optional future implementation.

**Requirements:**
- Complete token override
- Adjusted contrast ratios
- Preserved brand identity
- Accessibility validation

### Theme Variable Structure

```css
:root {
  /* Core tokens - always present */
  --bg-primary: #0A0E17;
  --primary: #00D9FF;
  --text-primary: #FFFFFF;
}

[data-theme="light"] {
  --bg-primary: #F5F7FA;
  --primary: #0099CC;
  --text-primary: #1A1A2E;
}
```

### Future Theme Types

| Theme Type | Description | Implementation |
|------------|-------------|----------------|
| **System** | Follows device preference | `prefers-color-scheme` |
| **User Choice** | Manual selection stored | Settings persistence |
| **Seasonal** | Limited-time event themes | Conditional loading |
| **Premium** | Subscriber-exclusive | Feature flag |

---

## Accessibility Notes

The design system prioritizes inclusive design.

### Color Contrast

| Content Type | Minimum Ratio | Jolt Time Standard |
|--------------|---------------|-------------------|
| Body text | 4.5:1 | 7:1+ for primary text |
| Large text (18px+) | 3:1 | 5:1+ for headings |
| UI components | 3:1 | 4:1+ for interactive |

### Touch Target Sizes

| Target Type | Minimum | Recommended |
|-------------|---------|-------------|
| Standard | 44x44px | 48x48px |
| Critical actions | 44x44px | 52x52px |
| Navigation items | 48x48px | 48x48px |

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

- Visible focus for keyboard navigation
- Hidden outline for mouse users
- Custom focus indicators for branded feel

### Screen Reader Support

- Semantic HTML structure
- ARIA labels for icon-only elements
- Live regions for dynamic content
- Skip links for long pages

---

## AdsGram Design Notes

AdsGram integration must feel native to Jolt Time's experience.

### Design Integration

**Reward Interfaces:**
- Match card styling and radius
- Use primary glow effects
- Consistent button styles
- Same typography scale

**Placement Philosophy:**
- Rewards feel earned, not sold
- Natural breaks in user flow
- Respects player attention
- Never interrupts active gameplay

### Monetization Boundaries

- **No Aggressive Design:** No flashing, pulsing, or attention-grabbing beyond standard glow
- **Consistent Colors:** AdsGram elements use Jolt Time palette
- **Predictable Placement:** Consistent locations for reward opportunities
- **Respectful Frequency:** Clear caps, no manipulation

### Reward UI Standards

| Element | Standard |
|---------|----------|
| Button style | Primary gradient |
| Card radius | 16px (radius-lg) |
| Animation | Standard timing (250ms) |
| Icon style | Consistent stroke weight |
| Typography | Same scale as app |

---

## Future Expansion Notes

The design system architecture supports future visual expansions.

### Seasonal Themes

Limited-time themes for cultural celebrations.

**Examples:**
- Lunar New Year (red/gold accents)
- Summer Festival (warm highlights)
- Winter Holidays (cool blues, snow effects)

**Implementation:**
- CSS variable overrides
- Conditional theme loading
- Asset bundle management

### Premium Themes

Subscriber-exclusive visual upgrades.

**Examples:**
- Alternative color schemes
- Unique glow effects
- Custom avatar frames
- Exclusive card styles

**Implementation:**
- Feature flag controlled
- Extended token set
- Premium badge integration

### Creator Themes

User-generated visual content.

**Examples:**
- Custom card backgrounds
- Personalized badges
- Community icon packs

**Implementation:**
- User-generated CSS
- Moderation workflow
- Theme preview system

### Event Themes

Temporary event visual treatments.

**Examples:**
- Tournament brackets
- Battle pass tiers
- Limited collections

**Implementation:**
- Event flag activation
- Automatic expiration
- Gradual rollout

---

## Long-Term Philosophy

### Simplify Development

- **Token-Based Updates:** Change once, update everywhere
- **Predictable Patterns:** No redesigning common elements
- **Documentation:** Clear standards reduce questions
- **Component Library:** Pre-built, tested components

### Maintain Consistency

- **Single Source of Truth:** Design tokens in code
- **Automated Enforcement:** Linting and validation
- **Cross-Platform:** Same tokens for all surfaces
- **Version Control:** Clear change history

### Strengthen Identity

- **Recognizable Style:** Jolt Time feels like Jolt Time
- **Brand Cohesion:** Every screen reinforces identity
- **Quality Perception:** Premium feel from consistency
- **Player Trust:** Reliable, polished experience

---

## Related Documentation

- **UI Style Guide:** `.openhands/knowledge/ui-style.md`
- **Component Library:** `.openhands/knowledge/component-library.md`
- **Accessibility:** `.openhands/knowledge/accessibility.md`
- **AdsGram:** `.openhands/knowledge/adsgram.md`

---

*Last Updated: 2026-06-24*
