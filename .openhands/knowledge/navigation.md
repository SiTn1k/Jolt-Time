# Jolt Time — Navigation Architecture

## Overview

This document defines the navigation structure for Jolt Time Telegram Mini App. Navigation is mobile-first, Telegram Mini App friendly, and optimized for one-handed usage with premium design.

---

## Bottom Navigation Bar

### Design Specifications

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      Page Content                           │
│                        (scroll)                             │
│                                                             │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  │
│  │       │  │       │  │       │  │       │  │       │  │
│  │  🏠   │  │  📦   │  │  🏛️   │  │  🎫   │  │  👤   │  │
│  │       │  │       │  │       │  │       │  │       │  │
│  │  Home │  │Collect│  │Museum │  │Events │  │Profile│  │
│  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Visual Design

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(10, 14, 23, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 217, 255, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding-top: 8px;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
  padding: 8px 12px;
  color: var(--text-muted);
  transition: all 0.2s ease;
  position: relative;
}

.nav-item.active {
  color: var(--primary);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 0 0 3px 3px;
  box-shadow: 0 0 12px var(--primary-glow);
}

.nav-icon {
  width: 28px;
  height: 28px;
  transition: transform 0.2s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px var(--primary));
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.nav-badge {
  position: absolute;
  top: 2px;
  right: 8px;
  min-width: 18px;
  height: 18px;
  background: var(--error);
  border-radius: 9px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
```

### Tab Definitions

| Tab | Icon | Label | Primary Screen | Notifications |
|-----|------|-------|----------------|---------------|
| Home | House | Home | Home Screen | Quests, Events |
| Collection | Archive/Box | Collection | Artifact Collection | Rare finds |
| Museum | Building | Museum | Museum | Milestones |
| Events | Ticket | Events | Events | Event start |
| Profile | User | Profile | Profile | Messages |

---

## Navigation Structure

### Hierarchy

```
Root
├── Bottom Navigation (persistent)
│   ├── Home Tab
│   │   ├── Home Screen
│   │   ├── Daily Quests (modal)
│   │   ├── Quick Actions
│   │   └── Event Details (modal)
│   ├── Collection Tab
│   │   ├── Artifact Collection
│   │   ├── Artifact Details (push)
│   │   ├── Historical Capsules (modal)
│   │   └── Ads Reward Screen (modal)
│   ├── Museum Tab
│   │   ├── Museum Hub
│   │   ├── Hall of Ages (push)
│   │   ├── Chronicle Wall (push)
│   │   └── Trophy Room (push)
│   ├── Events Tab
│   │   ├── Events List
│   │   ├── Event Details (push)
│   │   ├── Leaderboard (push)
│   │   └── Season Pass (push)
│   └── Profile Tab
│       ├── Profile Screen
│       ├── Settings (push)
│       ├── Achievements (push)
│       ├── Telegram Friends (push)
│       ├── Referral (push)
│       └── Premium Membership (modal)
└── Overlays (stack above everything)
    ├── Reward Screen
    ├── Notifications Center
    └── Modals
```

---

## Navigation Patterns

### 1. Tab Navigation
Primary navigation between main sections.

**Behavior:**
- Tap tab icon → Switch to tab's root screen
- Active tab shows cyan highlight bar
- Preserve scroll position when switching tabs
- Reset nested navigation to root on tab switch

**Transition:** Instant switch (no animation)

### 2. Push Navigation
Navigate deeper into content hierarchy.

**Behavior:**
- New screen slides in from right
- Back button returns to previous screen
- Swipe from left edge to go back (Telegram native)
- Header shows screen title and back button

**Transition:** Slide left 300ms ease-out

### 3. Modal Navigation
Present content that overlays current view.

**Behavior:**
- Modal slides up from bottom
- Backdrop dims background
- Tap backdrop to dismiss
- Swipe down to dismiss (optional)

**Transition:** Slide up 300ms ease-out

### 4. Tab-Specific Modals
Screens accessible from specific tabs.

**Examples:**
- Home → Daily Quests modal
- Collection → Capsules modal
- Profile → Premium Membership modal

---

## Telegram Mini App Integration

### Native Back Button

```javascript
// Handle Telegram back button
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  
  // Go back handling
  tg.BackButton.show();
  
  tg.BackButton.onClick(() => {
    if (canGoBack) {
      navigateBack();
    } else {
      tg.BackButton.hide();
    }
  });
}
```

**Behavior:**
- Show back button when nested navigation
- Hide back button on tab roots
- Custom back handling respects navigation stack

### Haptic Feedback

```javascript
// Provide haptic feedback on navigation
function triggerHaptic(type = 'light') {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    switch(type) {
      case 'light':
        Telegram.WebApp.HapticFeedback.impactOccurred('light');
        break;
      case 'medium':
        Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        break;
      case 'success':
        Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        break;
    }
  }
}
```

**Usage:**
- Tab switch → light impact
- Push navigation → light impact
- Modal open → medium impact
- Action success → success notification
- Error → error notification

---

## One-Handed Usage Optimization

### Thumb Zone Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     Content Area                            │
│                    (top 60% of screen)                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   Interactive Zone                          │
│                  (middle 25% of screen)                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐     │
│  │       │  │       │  │       │  │       │  │       │     │
│  │  🏠   │  │  📦   │  │  🏛️   │  │  🎫   │  │  👤   │     │
│  │       │  │       │  │       │  │       │  │       │     │
│  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘     │
│                                                             │
│                    Thumb Rest Zone                          │
│                  (bottom 15% safe)                          │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Primary Actions at Bottom**
   - All primary CTAs positioned in bottom third
   - Bottom navigation always accessible
   - FAB (Floating Action Button) placed for right thumb

2. **Content Scrolls Up**
   - Primary content in scrollable area
   - Navigation targets at natural thumb reach
   - Modal sheets use bottom sheet pattern

3. **Large Touch Targets**
   - Bottom nav items: 60x72px minimum
   - Primary buttons: full width, 52px height
   - List items: 56px minimum height

4. **Gestures Respect Handedness**
   - Swipe back works from either edge
   - No critical actions on far edges
   - Bottom sheet handles center pull

---

## Safe Area Handling

```css
/* iOS Safe Areas */
.bottom-nav {
  padding-bottom: max(
    env(safe-area-inset-bottom),
    8px
  );
}

/* Android Navigation Bar */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-nav {
    padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
  }
}

/* Content spacing */
.page-content {
  padding-bottom: calc(
    80px + 
    env(safe-area-inset-bottom, 0px) + 
    var(--space-4)
  );
}
```

### Browser Support
- iOS Safari: env() with fallback
- Android Chrome: env() supported
- Desktop: Fallback values applied

---

## Navigation State Management

### State Structure

```typescript
interface NavigationState {
  currentTab: TabId;
  tabs: {
    [key: TabId]: {
      rootScreen: ScreenId;
      navigationStack: ScreenId[];
      scrollPositions: Record<ScreenId, number>;
    };
  };
  activeModal: ModalId | null;
  previousScreen: ScreenId | null;
}
```

### Navigation Actions

```typescript
type NavigationAction =
  | { type: 'SWITCH_TAB'; payload: TabId }
  | { type: 'PUSH_SCREEN'; payload: ScreenId }
  | { type: 'POP_SCREEN' }
  | { type: 'OPEN_MODAL'; payload: ModalId }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESET_TAB'; payload: TabId };
```

### State Persistence
- Navigation state NOT persisted across sessions
- On app reopen → Home tab, root screens
- Modal state not persisted (user must reopen)

---

## Page Transitions

### Tab Switch
- **Duration:** 0ms (instant)
- **Effect:** Direct component swap
- **State:** Scroll position preserved per tab

### Push Screen
- **Duration:** 300ms
- **Easing:** cubic-bezier(0.16, 1, 0.3, 1)
- **Effect:** Slide in from right (new), slide out to right (old)
- **Gesture:** Swipe from left edge

### Modal Open
- **Duration:** 300ms
- **Easing:** cubic-bezier(0.16, 1, 0.3, 1)
- **Effect:** Slide up from bottom
- **Gesture:** Swipe down to dismiss

### Modal Close
- **Duration:** 250ms
- **Easing:** cubic-bezier(0.65, 0, 0.35, 1)
- **Effect:** Slide down to bottom
- **Backdrop:** Fade out

### Reward Screen
- **Duration:** 400ms
- **Easing:** Spring (0.34, 1.56, 0.64, 1)
- **Effect:** Scale from center with particles

---

## Screen Flow Examples

### Example 1: Daily Quest Completion

```
Home Screen
    │
    ▼ (tap quest)
Quest Detail Modal
    │
    ▼ (complete quest)
Reward Screen (full overlay)
    │
    ▼ (tap continue)
Back to Home Screen
```

### Example 2: Viewing Artifact

```
Collection Tab → Collection Screen
    │
    ▼ (tap artifact)
Artifact Details (push navigation)
    │
    ▼ (tap "View Set")
Other Artifact Details (push)
    │
    ▼ (tap back)
Back to previous Details
    │
    ▼ (tap back)
Back to Collection
```

### Example 3: Premium Purchase

```
Profile Tab → Profile Screen
    │
    ▼ (tap Premium banner)
Premium Membership Modal
    │
    ▼ (tap Subscribe)
Telegram Payment Flow
    │
    ▼ (success)
Premium Activated Overlay
    │
    ▼ (tap done)
Back to Profile (updated)
```

---

## Deep Linking

### URL Structure

```
https://t.me/jolttimebot/jolttime
├── ?start=home              # Home tab
├── ?start=collection       # Collection tab
├── ?start=event_id123      # Specific event
├── ?start=artifact_id456   # Specific artifact
└── ?start=profile          # Profile tab
```

### Handling Deep Links

```javascript
// Parse start parameter
function handleDeepLink(params) {
  const target = params.get('start');
  
  switch(target) {
    case 'home':
      switchTab('home');
      break;
    case 'collection':
      switchTab('collection');
      break;
    case 'event_id123':
      switchTab('events');
      pushScreen('event-details', { eventId: '123' });
      break;
    case 'artifact_id456':
      switchTab('collection');
      pushScreen('artifact-details', { artifactId: '456' });
      break;
    case 'profile':
      switchTab('profile');
      break;
    default:
      switchTab('home');
  }
}
```

---

## Loading & Error States

### Tab Loading
- Show skeleton on first load per tab
- Cache content for instant tab switch
- Background refresh when tab becomes active

### Push Navigation Loading
- Skeleton screen for new pushed screen
- Preserve previous screen visible behind
- Error state with retry button

### Modal Loading
- Centered spinner for initial load
- Content skeleton when data ready
- Error state with dismiss option

---

## Accessibility

### Screen Reader Support
- All navigation elements have aria-labels
- Current tab announced on switch
- Screen changes announced
- Modal announcements on open/close

### Keyboard Navigation
- Tab key cycles through nav items
- Enter activates selected item
- Escape closes modals
- Arrow keys for horizontal tab scroll

### VoiceOver/TalkBack
```jsx
<button 
  className="nav-item"
  aria-label="Home tab, 3 new notifications"
  aria-current="page"
>
  <Icon className="nav-icon" aria-hidden="true" />
  <span className="nav-label">Home</span>
</button>
```

---

## Performance Considerations

### Bundle Splitting
- Each tab loads its own bundle chunk
- Modals lazy-loaded on first open
- Heavy screens (Museum, Events) deferred

### Memory Management
- Unmount screens when popped from stack
- Keep only 3 screens in history max
- Release resources on tab switch

### Animation Performance
- Use transform/opacity only
- GPU-accelerated animations
- Throttle scroll handlers
- requestAnimationFrame for sync

---

*Navigation should feel invisible — the content is the experience.*
