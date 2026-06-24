# UX Architecture

## Overview

This document defines the complete user experience architecture for Jolt Time Telegram Mini App. It establishes patterns, standards, and principles for creating a cohesive and delightful user experience.

**Platform:** Telegram Mini App (mobile-first)
**Architecture Scope:** User flows, interaction patterns, accessibility, reward systems

---

## UX Categories

The user experience is organized into six foundational categories:

| Category | Purpose |
|----------|---------|
| **Onboarding Experience** | First-time user welcome, tutorials, initial rewards |
| **Navigation Experience** | Movement through the app, tab structure, gestures |
| **Reward Experience** | Receiving rewards, celebrations, feedback |
| **Social Experience** | Friends, guilds, sharing, community |
| **Event Experience** | Event participation, progress tracking, achievement |
| **Error Experience** | Error handling, recovery, fallback states |

---

## First-Time User Experience

### Welcome Flow

The onboarding experience introduces players to Jolt Time with minimal friction:

**Entry Point:** User opens the Mini App for the first time via Telegram

**Welcome Sequence:**
1. Telegram authentication (automatic via Mini App SDK)
2. Welcome screen with app introduction (2-3 seconds)
3. Core value proposition (collect artifacts, explore history)
4. Start playing prompt

**Principles:**
- Minimum required information at each step
- Skip option for returning users who reload
- Progress saves at each milestone

### Tutorial Philosophy

**Guided, Not Overwhelming:**
- Contextual tutorials appear during actual gameplay
- First artifact collection happens in controlled environment
- Tutorial tooltips highlight only current action
- Optional advanced tips for curious players

**Teach Through Doing:**
- Players learn by collecting their first artifact
- Reward immediately after first action
- Gradual introduction of features (museum, events, social)

**Tutorial Length:**
- Core tutorial: 2-3 minutes
- Optional deeper tutorials: available anytime in settings
- Skip available for returning players

### First Rewards

**Welcome Reward:**
- Starter pack with 3 common artifacts
- Initial Time Shards and Chrono Coins
- Immediate museum display option

**Reward Experience:**
- Full-screen celebration for first collection
- Artifact details explanation
- Clear "what's next" guidance

---

## Navigation Philosophy

### Core Principles

1. **Intuitive Movement**
   - Bottom navigation always visible
   - Consistent back navigation
   - No hidden menus or gestures required

2. **Minimal Clicks**
   - Maximum 3 taps to any feature
   - Quick actions on home screen
   - Recent items easily accessible

3. **One-Handed Usage**
   - Primary actions in thumb zone
   - Bottom-heavy interaction design
   - Large touch targets throughout

### Navigation Patterns

| Pattern | Usage | Trigger |
|---------|-------|---------|
| Tab Switch | Major section change | Tap bottom nav |
| Push | Deeper into content | Tap list item |
| Modal | Overlay content | Tap action button |
| Sheet | Options/quick actions | Swipe up or tap |

### Transition Standards

| Transition | Duration | Easing |
|------------|----------|--------|
| Tab Switch | Instant | None |
| Push In | 300ms | ease-out |
| Modal Open | 300ms | ease-out |
| Modal Close | 250ms | ease-in-out |

---

## Page Hierarchy

### Primary Areas

**Home**
- Daily quests and missions
- Active event highlight
- Currency balances
- Quick play actions
- Notifications summary

**Museum**
- Museum display view
- Artifact collection
- Chronicle wall
- Trophy room

**Events**
- Current events list
- Event categories
- Leaderboard access
- Season pass status

**Profile**
- Player statistics
- Achievements
- Settings access
- Premium membership

### Secondary Areas

**Settings**
- Game preferences
- Sound and haptics
- Notification controls
- Language selection
- Account management

**PvP Arena**
- Current rank display
- Match history
- Tournament registration
- Leaderboard

**Social Hub**
- Friends list
- Guild management
- Referral program
- Leaderboards

### Navigation Structure

```
Bottom Navigation
├── Home
│   ├── Daily Quests (modal)
│   ├── Event Details (modal)
│   └── Quick Actions
├── Museum
│   ├── Display View
│   ├── Chronicle Wall (push)
│   └── Trophy Room (push)
├── Events
│   ├── Events List
│   ├── Event Details (push)
│   └── Season Pass (push)
├── Profile
│   ├── Statistics
│   ├── Achievements (push)
│   ├── Settings (push)
│   └── Premium (modal)
└── Overlays
    ├── Reward Screen
    ├── Notifications
    └── Confirmation Dialogs
```

---

## Reward UX Philosophy

### Core Principles

1. **Satisfying Presentation**
   - Celebration animation on reward
   - Sound effect for valuable rewards
   - Particle effects for rare items
   - Clear visual hierarchy

2. **Avoid Clutter**
   - One reward type per screen when possible
   - Clear focus on the reward itself
   - Minimal text during celebration
   - Quick dismiss option

3. **Clear Communication**
   - Item name clearly displayed
   - Quantity immediately visible
   - Rarity indicator (color, glow)
   - What to do next (claim, view, continue)

### Reward Types

| Type | Presentation | Duration |
|------|--------------|----------|
| Currency | Amount + icon + animation | 1.5s auto-dismiss |
| Artifact | Full card + celebration | 3s or tap |
| Achievement | Badge + fanfare | 2s or tap |
| Level Up | Progress + new content | 3s or tap |

### Reward Screen Structure

```
┌─────────────────────────────────────┐
│                                     │
│          [Animation/Icon]            │
│                                     │
│           REWARD NAME               │
│                                     │
│           x Quantity                 │
│                                     │
│      [Rarity indicator/color]       │
│                                     │
│         [ Claim Button ]            │
│                                     │
└─────────────────────────────────────┘
```

---

## Loading Experience

### Loading Principles

- **Perceived Speed:** Show something immediately
- **Progress Indication:** Never leave users wondering
- **Friendly Tone:** Loading states should feel warm

### Skeleton Loaders

**Usage:** Content-heavy screens on initial load

**Behavior:**
- Skeleton matches final layout
- Shimmer animation indicates loading
- 150ms minimum display to avoid flash

**Components:**
- SkeletonCard (matches Card component)
- SkeletonText (line, paragraph variants)
- SkeletonAvatar (circular skeleton)
- SkeletonList (multiple items)

### Progress Indicators

**Usage:** Known-duration operations

**Types:**
- Linear progress bar (file uploads, installations)
- Circular spinner (quick operations)
- Percentage counter (data sync)

### Friendly States

**Principles:**
- Never show raw error codes
- Explain what's happening
- Offer next steps when stuck

---

## Error Experience

### Error Principles

1. **Understandable Messages**
   - Plain language, not technical jargon
   - Explain what happened briefly
   - No blaming the user

2. **Recovery Suggestions**
   - Clear next action to resolve
   - Retry button when applicable
   - Alternative paths when possible

3. **Clear Status**
   - Current state always visible
   - No hidden failed states
   - Confirmation for destructive actions

### Error Types

| Type | Message Style | Action |
|------|---------------|--------|
| Network | "Connection issue. Check your internet." | Retry button |
| Auth | "Session expired. Please wait." | Auto-redirect |
| Server | "Something went wrong. We're fixing it." | Retry later |
| Validation | "Please check this field." | Highlight field |
| Permission | "Unable to access. Please try again." | Re-authenticate |

### Error Screen Structure

```
┌─────────────────────────────────────┐
│                                     │
│            [Error Icon]             │
│                                     │
│         Something went wrong        │
│                                     │
│   We couldn't load your progress.   │
│       Please try again in a bit.    │
│                                     │
│         [ Try Again ]               │
│                                     │
│    [ Return to Home ] [ Contact ]   │
│                                     │
└─────────────────────────────────────┘
```

---

## Notification UX

### Notification Principles

1. **Helpful, Not Intrusive**
   - Only important notifications
   - Respect Telegram notification settings
   - No excessive pings

2. **Clear Value**
   - Explain what happened
   - Tell them what to do next
   - Deep link to relevant screen

3. **Localization**
   - All notification text localizable
   - Date/time format respects locale
   - RTL support for applicable languages

### Notification Types

| Type | Trigger | Priority |
|------|---------|----------|
| Daily Reset | Timer | Medium |
| Quest Complete | Action | High |
| Event Start | Timer | High |
| Friend Request | Action | Medium |
| Guild Invite | Action | Medium |
| Achievement | Unlock | High |
| Rank Change | Update | Medium |

### In-App Notifications

- Badge on tab for count
- Toast for quick feedback
- Notification center for history
- Mark all as read option

---

## Mobile Interaction Philosophy

### Touch-Friendly Controls

**Touch Targets:**
- Minimum 44x44px for all interactive elements
- Recommended 48x48px for frequent actions
- Primary buttons full-width on mobile

**Spacing:**
- Minimum 8px between tappable elements
- Group related actions together
- Separate distinct action zones

### Responsive Layouts

**Mobile-First:**
- Single column layouts default
- Cards stack vertically
- Bottom navigation always accessible

**Content Priority:**
- Most important content at top
- Progressive disclosure for details
- Collapse secondary information

### Short Interaction Paths

**Principles:**
- 3 taps maximum to any feature
- No deep menu diving
- Quick actions on home screen
- Recently used items surfaced

**Gesture Support:**
- Pull to refresh
- Swipe back to return
- Long press for context menus
- Double tap for favorites

---

## AdsGram UX Notes

### Integration Philosophy

AdsGram provides primary revenue for project sustainability while respecting player experience.

### Design Integration

**Visual Consistency:**
- Ads match Jolt Time styling
- Same card radius and shadows
- Consistent typography
- Branded close button

**Placement:**
- Natural breaks in flow
- Never during active gameplay
- After completing actions
- Between content screens

### Player Respect

**Never Interrupts:**
- Active battles or quests
- Social conversations
- Important progress moments
- Tutorial sequences

**Clear Value Exchange:**
- Rewards always worthwhile
- Clear reward amount shown
- Skip option always available
- No repeated ads for same content

**Frequency Controls:**
- Daily cap respected
- User-controlled frequency
- No guilt-trip mechanics
- No false urgency

---

## Accessibility Notes

### Readable Layouts

**Typography:**
- Minimum 14px for body text
- 16px default for readability
- High contrast ratios (7:1+)
- Scalable text respects user settings

**Structure:**
- Clear visual hierarchy
- Consistent layouts
- Logical reading order
- Adequate white space

### Reduced Complexity

**Principles:**
- Simple navigation paths
- Clear action labels
- Minimal decorative elements
- Straightforward flows

**Visual:**
- Avoid excessive animation
- Simple color combinations
- Clear iconography
- Limited depth effects

### Inclusive Interactions

**Input:**
- Multiple input methods supported
- No precision-only interactions
- Fallback for gesture-only actions
- Voice input where applicable

**Output:**
- Visual with non-visual alternatives
- Sound with visual cues
- Color with shape/text distinction
- Motion with static alternatives

---

## Future Expansion Notes

### Adaptive Interfaces (Future Concept)

Dynamic interfaces that adjust based on user behavior and preferences.

**Examples:**
- Frequently used features promoted
- Rarely used features deprioritized
- Skill-level based complexity
- Personalized home screen

### Personalized Dashboards (Future Concept)

User-customizable home screens with widget-like components.

**Examples:**
- Drag-and-drop widgets
- Custom card arrangement
- Widget size options
- Theme customization

### AI Recommendations (Future Concept)

Intelligent suggestions for gameplay and content discovery.

**Examples:**
- Artifact collection suggestions
- Quest completion order
- Friend recommendations
- Event participation timing

### Dynamic Home Screens (Future Concept)

Home screens that change based on current events and player state.

**Examples:**
- Event prominence during active events
- Quest urgency indicators
- Seasonal visual treatments
- Milestone celebrations

---

## Long-Term Philosophy

### Respect Player Time

- **Quick Sessions:** Full experience in 5-minute sessions
- **No Forced Watching:** Never require waiting
- **Resume Easily:** Pick up where left off
- **Respect Attention:** No attention-grabbing tricks

### Remain Enjoyable

- **Positive Reinforcement:** Rewards feel earned
- **Progress Feeling:** Always making headway
- **Social Enjoyment:** Friends enhance experience
- **Discovery:** New content to find regularly

### Provide Smooth Experiences

- **Fast Loading:** Under 2 seconds typical
- **No Crashes:** Stability above all
- **Graceful Degradation:** Works even when imperfect
- **Clear Communication:** Always know what's happening

---

## Related Documentation

- **Navigation:** `.openhands/knowledge/navigation.md`
- **Component Library:** `.openhands/knowledge/component-library.md`
- **Design System:** `.openhands/knowledge/design-system.md`
- **Accessibility:** `.openhands/knowledge/accessibility.md`

---

*Last Updated: 2026-06-24*
