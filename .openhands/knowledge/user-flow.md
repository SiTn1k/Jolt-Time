# Jolt Time — First-Time User Flow

## Overview

This document defines the onboarding experience for new Jolt Time players. The goal is high retention during the first session by creating immediate value, teaching core mechanics naturally, and building emotional investment through rewarding interactions.

---

## Retention Goals

| Metric | Target | Why |
|--------|--------|-----|
| Day 1 Retention | >60% | Core loop established |
| Day 7 Retention | >35% | Habit formed |
| First Session Length | 5-10 min | Enough to understand value |
| First Reward to Action | <30 sec | Immediate gratification |
| Tutorial Completion | >90% | Core mechanics learned |

---

## The 10-Step Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FIRST-TIME USER FLOW                             │
│                                                                      │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐            │
│  │ STEP 1  │───►│ STEP 2  │───►│ STEP 3  │───►│ STEP 4  │            │
│  │  OPEN   │    │  START  │    │  INTRO  │    │ STARTER │            │
│  │   BOT   │    │MINI APP│    │ANIMATION│   │ REWARD  │            │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘            │
│       │              │              │              │                │
│       │              │              │              ▼                │
│       │              │              │        ┌─────────┐            │
│       │              │              │        │ STEP 5  │            │
│       │              │              │        │  LEARN  │            │
│       │              │              │        │ BASICS  │            │
│       │              │              │        └─────────┘            │
│       │              │              │              │                │
│       │              │              │              ▼                │
│       │              │              │        ┌─────────┐            │
│       │              │              │        │ STEP 6  │            │
│       │              │              │        │  OPEN   │            │
│       │              │              │        │CAPSULE  │            │
│       │              │              │        └─────────┘            │
│       │              │              │              │                │
│       │              │              │              ▼                │
│       │              │              │        ┌─────────┐            │
│       │              │              │        │ STEP 7  │            │
│       │              │              │        │ OBTAIN  │            │
│       │              │              │        │ARTIFACT │            │
│       │              │              │        └─────────┘            │
│       │              │              │              │                │
│       │              │              │              ▼                │
│       │              │              │        ┌─────────┐            │
│       │              │              │        │ STEP 8  │            │
│       │              │              │        │COMPLETE │            │
│       │              │              │        │  QUEST  │            │
│       │              │              │        └─────────┘            │
│       │              │              │              │                │
│       │              │              │              ▼                │
│       │              │              │        ┌─────────┐            │
│       │              │              │        │ STEP 9  │            │
│       │              │              │        │   SEE   │            │
│       │              │              │        │   ADS   │            │
│       │              │              │        └─────────┘            │
│       │              │              │              │                │
│       │              │              │              ▼                │
│       │              │              │        ┌─────────┐            │
│       │              │              │        │ STEP 10 │            │
│       │              │              │        │CONTINUE │            │
│       │              │              │        │PROGRESS │            │
│       │              │              │        └─────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Open Bot

### What Happens
- User taps "Start" in Telegram bot chat
- Bot sends welcome message with Mini App button
- Button labeled "🚀 Open Jolt Time"

### User Experience
- **Wait Time:** 0-2 seconds
- **Action Required:** Tap "Start" in bot, then tap Mini App button
- **Visual:** Telegram native button, large and inviting

### Design Goals
- Clear call-to-action
- No confusing choices
- One tap to start

### Telegram Bot Message
```
🕐 Welcome to Jolt Time!

Travel through history, collect ancient artifacts, and become a Time Keeper.

Tap the button below to begin your journey!

[🚀 Open Jolt Time]
```

---

## Step 2: Start Mini App

### What Happens
- Mini App launches
- Loading screen appears
- Telegram WebApp SDK initializes
- User data retrieved/authenticated

### Loading Screen Experience
- **Duration:** 2-4 seconds (minimum for perceived value)
- **Content:**
  - Animated Jolt Time logo
  - Temporal distortion effect on logo
  - Progress bar (smooth, never jumps)
  - Text: "Initializing temporal coordinates..."
  
### Technical Requirements
- Preload critical assets
- Authenticate via Telegram initData
- Fetch user profile or create new
- Cache essential game data

### Loading States
```
Loading Text Cycle:
"Initializing temporal coordinates..." → "Warming up time machines..."
→ "Aligning historical sensors..." → "Preparing artifacts..."
```

### Early Data Fetch
While loading screen shows:
1. Authenticate user
2. Fetch/update player profile
3. Load home screen data
4. Preload first mission assets

---

## Step 3: Intro Animation

### What Happens
- Special first-time intro animation plays
- 3-4 second cinematic showing time travel concept
- Sets the mood and narrative

### Animation Sequence

```
Scene 1 (0-1s): "TIME SHATTERS"
├── Dark screen with cracks of light
├── Cyan/mint particles emerging
└── Sound: Low rumble, temporal distortion

Scene 2 (1-2.5s): "JOURNEY THROUGH AGES"
├── Fast montage of era imagery
├── Mesopotamia pyramids → Egypt → Greece → Rome
├── Artifacts floating through portal
└── Sound: Whoosh, ancient instruments

Scene 3 (2.5-4s): "BECOME A TIME KEEPER"
├── Logo materializes
├── Tagline fades in
├── "Your journey begins now"
└── Sound: Triumphant chime
```

### Skip Option
- Tap anywhere after 2 seconds to skip
- Maintains minimum 2s for brand impact
- Skip transitions directly to Step 4

### Alternative: Quick Intro
If user has reduced motion preference:
- Static logo with tagline
- 1.5 second display
- Fade to reward

---

## Step 4: Receive Starter Reward

### What Happens
- First-time bonus reward displayed
- Generous starter pack to build goodwill
- Immediate value proposition

### Starter Pack Contents
| Item | Quantity | Value |
|------|----------|-------|
| Time Energy | 50 | Immediate play |
| Chrono Dust | 100 | First upgrades |
| Common Capsule | 3 | First collection |
| XP | 100 | Level 2 |

### Reward Screen Design
- **Duration:** 3-4 seconds minimum (celebrate!)
- **Animation:**
  - Items fly in with stagger
  - Glow effects on each item
  - XP counter animates up
  - Confetti/particle burst
- **Sound:** Reward jingle (if sound enabled)

### Visual Layout
```
┌─────────────────────────────────────────┐
│                                         │
│           ✨ STARTER PACK ✨            │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  ⚡ 50 Time Energy          │     │
│    └─────────────────────────────┘     │
│    ┌─────────────────────────────┐     │
│    │  💎 100 Chrono Dust        │     │
│    └─────────────────────────────┘     │
│    ┌─────────────────────────────┐     │
│    │  📦 3 Common Capsules      │     │
│    └─────────────────────────────┘     │
│    ┌─────────────────────────────┐     │
│    │  ⭐ +100 XP                │     │
│    └─────────────────────────────┘     │
│                                         │
│           [Collect Rewards]              │
│                                         │
└─────────────────────────────────────────┘
```

### Button States
- **Initial:** Disabled, "Collecting..."
- **After Animation:** Enabled, pulsing glow, "Collect Rewards"
- **Tap:** Haptic feedback, proceed to Step 5

---

## Step 5: Learn the Basics

### What Happens
- Interactive tutorial begins
- 3 quick lessons teaching core mechanics
- Hands-on practice, not just reading

### Tutorial Structure

#### Lesson 1: Time Energy (30 seconds)
```
UI Element: Energy meter highlighted

Guide: "This is Time Energy — your fuel for time travel.
Each action costs energy. Check back to refill!"

Action: Tap energy meter (shows regeneration info)
Reward: +10 Energy bonus
```

#### Lesson 2: Collecting Artifacts (45 seconds)
```
UI Element: Floating artifact glows

Guide: "Artifacts are scattered through time.
Tap to collect them!"

Action: Tap floating artifact
Reward: First artifact added to collection
Celebration: Artifact reveal animation
```

#### Lesson 3: Completing Missions (60 seconds)
```
UI Element: Quest marker pulses

Guide: "Complete missions to earn rewards.
Let's try one!"

Action: Tap "Start Mission" button
Gameplay: Simplified single-room mission
Reward: Mission complete, XP gained
```

### Tutorial Design Principles
1. **No Walls** — Skip available for returning players
2. **Immediate Feedback** — Every tap does something visible
3. **Generous Rewards** — Feel rich, not poor
4. **Positive Framing** — "You did it!" not "Correct"
5. **Progress Indicators** — "1/3 lessons complete"

### Tutorial UI
- **Coach Marks:** Highlighted elements with callouts
- **Skip Option:** "Skip Tutorial" in corner
- **Progress Dots:** "• ○ ○" showing position
- **Continue Button:** Appears after each action

---

## Step 6: Open First Capsule

### What Happens
- User receives their first capsule
- Guided to open it with celebration
- First artifact reveal

### Capsule Delivery
```
┌─────────────────────────────────────────┐
│                                         │
│         📦 NEW CAPSULE RECEIVED!        │
│                                         │
│    ┌─────────────────────────────┐     │
│    │                             │     │
│    │      [Capsule Animation]    │     │
│    │                             │     │
│    └─────────────────────────────┘     │
│                                         │
│         [Open Capsule]                   │
│                                         │
└─────────────────────────────────────────┘
```

### Opening Experience
1. **Anticipation Build** (1s)
   - Capsule glows and shakes
   - Light beams emerge
   - Sound builds tension

2. **Reveal** (1.5s)
   - Capsule bursts open
   - Artifact rises with光芒
   - Rarity glow (green=common, blue=rare)
   - Item name and era displayed

3. **Celebration** (1.5s)
   - XP particles fly to bar
   - "New Artifact!" banner
   - "Added to Collection" confirmation
   - Optional: Share button appears

### First Artifact Guaranteed
- First capsule always contains at least Uncommon
- Creates immediate emotional hook
- User sees: "I got something good!"

### Post-Open Options
- **View in Collection:** Navigate to see artifact
- **Open Another:** If more capsules available
- **Continue:** Proceed to quest

---

## Step 7: Obtain First Artifact

### What Happens
- Artifact added to collection
- Collection screen shown briefly
- Artifact's value explained

### Collection Integration
```
┌─────────────────────────────────────────┐
│                                         │
│    First Artifact Unlocked!             │
│                                         │
│    ┌─────────────────────────────┐     │
│    │    [Artifact Preview]        │     │
│    │                             │     │
│    │    "Clay Tablet"             │     │
│    │    ★★☆ ☆☆  Uncommon         │     │
│    │    Mesopotamia Era          │     │
│    └─────────────────────────────┘     │
│                                         │
│    "1/20 in Mesopotamia Collection"    │
│                                         │
│    [View Collection]  [Continue]        │
│                                         │
└─────────────────────────────────────────┘
```

### Collection Motivation
- Shows artifact in context
- "1 of 20" creates completion drive
- Preview of other artifacts teases
- Era badge establishes world-building

### Emotional Hook
- "You found an artifact from 3000 BC!"
- Historical fact displayed
- Connection to real-world wonder

---

## Step 8: Complete First Quest

### What Happens
- Guided quest experience
- Player completes first full mission
- Rewards earned with celebration

### Quest Structure (Tutorial Mission)
```
Mission: "The First Steps"
Era: Mesopotamia
Objective: "Find 3 artifacts"
Energy Cost: 10
Duration: 2-3 minutes
Rewards: 50 XP, 20 Chrono Dust, 1 Capsule
```

### Quest Experience

#### Entry
- Quest banner with progress
- "Ready to begin?" modal
- Energy cost shown clearly
- Estimated time displayed

#### During Quest
- Simplified environment (1 room)
- 3 artifacts clearly marked
- Tutorial prompts guide
- Progress indicator visible

#### Completion
- Victory animation
- Rewards summary
- XP bar animation
- New content unlocked notification

### Completion Rewards Screen
```
┌─────────────────────────────────────────┐
│                                         │
│         🎉 QUEST COMPLETE! 🎉           │
│                                         │
│         "The First Steps"               │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  ⭐ +50 XP                   │     │
│    │  💎 +20 Chrono Dust          │     │
│    │  📦 +1 Common Capsule        │     │
│    └─────────────────────────────┘     │
│                                         │
│    ┌─────────────────────────────┐     │
│    │   ████████████░░░░  75%    │     │
│    │   Level 2 (175/500 XP)     │     │
│    └─────────────────────────────┘     │
│                                         │
│         [Continue Adventure]            │
│                                         │
└─────────────────────────────────────────┘
```

---

## Step 9: See Rewarded AdsGram Ad

### What Happens
- User encounters first rewarded ad
- Opt-in, not forced
- Clear value proposition
- Positive ad experience

### Ad Placement
**Location:** After completing first quest
**Trigger:** Natural break before returning to home
**Purpose:** Introduce monetization model gently

### Ad Screen Design
```
┌─────────────────────────────────────────┐
│                                         │
│    ⚡ DOUBLE YOUR REWARDS! ⚡          │
│                                         │
│    Watch a short video to get:         │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  📦 +1 Extra Capsule        │     │
│    │  ⭐ +25 Bonus XP             │     │
│    └─────────────────────────────┘     │
│                                         │
│    ┌─────────────────────────────┐     │
│    │                             │     │
│    │   [AdsGram Ad Placeholder] │     │
│    │                             │     │
│    │   Video plays here          │     │
│    │                             │     │
│    └─────────────────────────────┘     │
│                                         │
│    [Watch & Claim]    [Continue Free]  │
│                                         │
└─────────────────────────────────────────┘
```

### User Choice
- **Watch & Claim:** Load AdsGram ad, reward on completion
- **Continue Free:** Skip ad, proceed with base rewards only

### Ad Experience
- **Pre-Ad:** Value clearly shown
- **During Ad:** Full-screen, skippable after 5s
- **Post-Ad:** Immediate reward confirmation
- **Post-Skip:** Graceful transition, no guilt

### AdsGram Integration
```javascript
// Reward callback
function handleAdReward() {
  grantReward({
    capsule: 1,
    xp: 25
  });
  showRewardScreen();
}
```

### Key Principles
1. **Never Forced** — Clear skip option always visible
2. **Transparent Value** — User knows exactly what they're getting
3. **Respects Time** — Short ads, skippable
4. **Positive Framing** — "Unlock more" not "Watch ad to continue"
5. **Quality Ads Only** — No misleading or frustrating creatives

---

## Step 10: Continue Progression

### What Happens
- User lands on Home Screen
- Sees their progress and next actions
- Understands the game loop
- Ready for self-directed play

### Home Screen State (Post-Onboarding)
```
┌─────────────────────────────────────────┐
│  👤 Lv.2    ⚡ 60/100    🔥 Day 1       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎫 EVENT: Ancient Egypt        │   │
│  │    Ends in 5d 12h              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  TODAY'S QUESTS                        │
│  ┌───────────┐ ┌───────────┐ ┌─────┐  │
│  │ Quest 1  │ │ Quest 2  │ │ ... │  │
│  │  0/1     │ │  0/1     │ │     │  │
│  └───────────┘ └───────────┘ └─────┘  │
│                                         │
│  YOUR CAPSULES                         │
│  📦 4 Common    📦 1 Rare             │
│                                         │
│  QUICK ACTIONS                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │Play │ │Caps.│ │Coll.│ │More │     │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
│                                         │
└─────────────────────────────────────────┘

┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 🏠│ │ 📦│ │ 🏛│ │ 🎫│ │ 👤│
└───┘ └───┘ └───┘ └───┘ └───┘
```

### What User Sees
1. **Level Progress:** "Level 2" with XP bar
2. **Energy Status:** 60/100 (regenerating)
3. **Daily Streak:** "Day 1" just started
4. **Active Event:** Something exciting happening
5. **Available Quests:** Clear next actions
6. **Capsules:** Rewards to open
7. **Quick Actions:** Easy access to features

### Emotional State
- **Excited:** Got lots of stuff
- **Empowered:** Knows what to do next
- **Curious:** Wants to explore
- **Invested:** Already has collection starting

---

## Onboarding Analytics Events

### Track Key Moments
```javascript
// Event tracking
analytics.track('onboarding_step_completed', {
  step: 1-10,
  time_spent_ms: timestamp,
  skipped: boolean,
  device_type: string
});
```

### Critical Metrics
| Event | Good | Poor |
|-------|------|------|
| Step 2 completion | >95% | <80% |
| Step 4 reward collected | >95% | <85% |
| Tutorial completion | >90% | <70% |
| Step 9 ad viewed | >40% | <20% |
| Return Day 1 | >60% | <40% |

---

## Onboarding Variations

### Returning User (Skip to Home)
Users who played before:
1. Open Mini App
2. Brief loading (cached)
3. Jump directly to Home Screen
4. "Welcome back!" toast

### Reduced Motion Users
- Skip intro animation (1.5s static)
- Reduce particle effects
- Faster transitions (150ms)
- No confetti animations

### Slow Connection
- Progressive loading
- Skeleton screens
- Optimistic UI updates
- Background asset loading

---

## Tutorial Exit Points

### User Can Leave At
1. **Step 2:** Close app before loading completes
2. **Step 3:** Skip intro animation
3. **Step 5:** Skip tutorial option
4. **Step 9:** Choose "Continue Free" over ad

### Recovery Flows
- **Return after close:** Resume where left off
- **Skip tutorial:** Home screen with guidance tooltips
- **Skip ad:** Normal flow continues

---

## First Session Optimization

### Goal: 5-10 Minutes
```
Minimum Path:
Step 1-3: 5 seconds
Step 4: 4 seconds
Step 5: 2 minutes
Step 6-7: 1 minute
Step 8: 2 minutes
Step 9: 30 seconds
Step 10: Browse home

Total: ~10 minutes
```

### Pacing
- **0-30 sec:** Wow moments (reward, intro)
- **30 sec-2 min:** Learning (tutorial)
- **2-5 min:** Doing (first quest)
- **5-10 min:** Exploring (home, collection)
- **10+ min:** Self-directed play

---

## Post-Onboarding Hooks

### Day 1 Retention Triggers
1. **Streak:** "Don't break your streak!"
2. **Event:** "Limited time event ends tomorrow!"
3. **Capsule:** "2 new capsules waiting!"
4. **Friend:** "3 friends started playing!"
5. **Quest:** "New quests available!"

### Push Notifications (Opt-in)
- Daily reminder (configurable time)
- Streak at risk warning
- Event ending soon
- Friend activity

---

## Anti-Frustration Measures

### Don't Do This
- ❌ Force watching ads
- ❌ Block progress without payment
- ❌ Make tutorial too long
- ❌ Give worthless rewards
- ❌ Confusing UI on first load
- ❌ Make user feel scammed

### Do This Instead
- ✅ Immediate value
- ✅ Respected time
- ✅ Clear next actions
- ✅ Celebrated achievements
- ✅ Intuitive design
- ✅ Generous onboarding

---

*Every new player should feel like they just discovered something amazing.*
