# Jolt Time — Quests System

## Overview

Quests provide structured goals that guide players through gameplay while rewarding progression. Every quest delivers meaningful rewards that enhance the player experience.

---

## Quest Categories

### 1. Daily Quests

**Purpose:** Encourage daily engagement with varied gameplay.

| Quest | Objective | Reward |
|-------|-----------|--------|
| Daily Login | Log into the game | 50 XP, 10 Chrono Dust |
| Capsule Opener | Open 3 capsules | 75 XP, 1 Free Capsule |
| Energy Collector | Collect Time Energy (max once) | 30 XP, 20 Energy |
| Ad Watcher | Watch 1 AdsGram rewarded ad (optional) | 50 XP, 15 Chrono Dust |
| Artifact Upgrader | Upgrade any artifact once | 100 XP, 50 Chrono Dust |
| Mission Completer | Complete 1 mission | 60 XP, 25 Chrono Dust |
| Explorer | Visit 2 different eras | 40 XP, 15 Chrono Dust |

**Daily Quest Rules:**
- Reset at 00:00 UTC
- Must be completed within 24-hour window
- All daily quests visible from start
- Progress saved automatically

### 2. Weekly Quests

**Purpose:** Provide medium-term goals with better rewards.

| Quest | Objective | Reward |
|-------|-----------|--------|
| Collection Hunter | Collect 5 new artifacts | 500 XP, 1 Rare Capsule |
| Set Completer | Complete 1 artifact set | 750 XP, 1 Epic Capsule |
| Mission Master | Complete 15 missions | 400 XP, 200 Chrono Dust |
| Era Visitor | Visit all unlocked eras | 300 XP, 1 Rare Capsule |
| Time Keeper | Accumulate 1000 Time Energy | 350 XP, 150 Chrono Dust |
| Capsule Collector | Open 25 capsules | 450 XP, 3 Free Capsules |

**Weekly Quest Rules:**
- Reset every Monday at 00:00 UTC
- Progress persists through the week
- Uncompleted quests do not carry over

### 3. Season Quests

**Purpose:** Long-term goals tied to 8-week seasons.

| Quest | Objective | Reward |
|-------|-----------|--------|
| Season Journey | Complete 50 missions | 2000 XP, Season Badge |
| Collector Supreme | Collect 20 artifacts | 3000 XP, 1 Legendary Capsule |
| Era Master | Complete all sets in 3 eras | 2500 XP, Era Title |
| Social Butterfly | Send 10 gifts to friends | 1000 XP, Friend Frame |
| Capsule Champion | Open 100 capsules | 2000 XP, 5 Free Capsules |
| Time Lord | Accumulate 5000 Time Energy | 1500 XP, Chrono Dust x500 |

**Season Quest Rules:**
- Reset each new season
- Track visible in Season Progress screen
- Rewards are season-exclusive

### 4. Historical Quests

**Purpose:** Educate players about history while rewarding collection.

| Quest | Objective | Reward |
|-------|-----------|--------|
| Mesopotamian Scholar | Collect all Mesopotamia artifacts | 1000 XP, "Cradle of Civilization" Badge |
| Egyptian Explorer | Collect all Egypt artifacts | 1000 XP, "Nile Guardian" Badge |
| Greek Historian | Collect all Greece artifacts | 1000 XP, "Hellenic Scholar" Badge |
| Roman Centurion | Collect all Rome artifacts | 1000 XP, "Eternal Legion" Badge |
| Medieval Knight | Collect all Medieval artifacts | 1000 XP, "Castle Defender" Badge |
| Renaissance Artist | Collect all Renaissance artifacts | 1000 XP, "Renaissance Soul" Badge |

**Historical Quest Rewards Include:**
- Era-specific titles
- Unique frames for completed eras
- Museum displays unlocked
- Lore entries revealed

### 5. Collection Quests

**Purpose:** Drive completionist behavior with rare rewards.

| Quest | Objective | Reward |
|-------|-----------|--------|
| Common Collector | Collect all Common artifacts | 500 XP, Common Master Frame |
| Uncommon Hunter | Collect all Uncommon artifacts | 1000 XP, Uncommon Master Frame |
| Rare Seeker | Collect all Rare artifacts | 2000 XP, Rare Master Badge |
| Epic Chaser | Collect all Epic artifacts | 3000 XP, Epic Master Title |
| Legendary Finder | Collect all Legendary artifacts | 5000 XP, Legendary Aura |
| Mythic Guardian | Collect any Mythic artifact | 10000 XP, Mythic Title, Rainbow Aura |

### 6. Special Event Quests

**Purpose:** Limited-time content during events.

| Quest | Objective | Reward |
|-------|-----------|--------|
| Event Starter | Complete event tutorial | 100 XP, Event Capsule |
| Event Participant | Collect 10 event items | 300 XP, Event Badge |
| Event Champion | Complete all event missions | 1000 XP, Exclusive Cosmetic |
| Community Goal | Contribute to global target | Shared reward pool |

**Event Quest Rules:**
- Only available during event duration
- Cannot be completed after event ends
- Progress tracked in Event screen

---

## Quest Display

### Quest Screen Layout

```
┌─────────────────────────────────────┐
│           TODAY'S QUESTS            │
├─────────────────────────────────────┤
│ 🔄 Daily    [3/7 Complete]         │
│ 📅 Weekly    [2/6 Complete]         │
│ 🏆 Season    [5/20 Complete]         │
│ 📜 Historical [12/50 Complete]      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🔔 Daily Quests                     │
├─────────────────────────────────────┤
│ ✓ Log in today              50 XP  │
│ ○ Open 3 capsules         75 XP     │
│ ○ Watch an ad (optional)   50 XP    │
│ ○ Upgrade an artifact      100 XP   │
│ ○ Visit 2 eras             40 XP    │
│ ○ Collect Time Energy      30 XP    │
│ ○ Complete 1 mission       60 XP    │
└─────────────────────────────────────┘

Progress: ████████░░ 57%
```

---

## Reward Philosophy

### Fair Rewards
- Every quest provides tangible progression
- No quest requires spending real money
- Rewards scale with effort required

### Visible Progress
- Progress bars for all quests
- Percentage completion always visible
- Notifications on quest completion

### Variety
- Multiple quest types prevent monotony
- Players choose which quests to pursue
- No forced completion of any single quest

---

## AdsGram Integration

**Optional Quests:**
- Watching AdsGram ads is never required
- Ads appear only when player chooses
- Rewarded ads feel helpful, not mandatory

**Optional Ad Quest Examples:**
- "Boost your progress" - Watch 1 ad for bonus rewards
- "Double your luck" - Watch 1 ad for 2x capsule chance
- "Quick energy" - Watch 1 ad for instant energy refill

**Philosophy:**
Players should feel rewarded for watching ads, not punished for skipping them.

---

## Quest Balance Guidelines

### Time Investment
- Daily quests: 5-15 minutes total
- Weekly quests: 30-60 minutes total
- Season quests: Gradual accumulation over weeks

### Reward Scaling
| Category | Time Required | XP Range | Currency Range |
|----------|---------------|----------|----------------|
| Daily | 5-15 min | 30-100 | 10-50 |
| Weekly | 30-60 min | 300-750 | 150-300 |
| Season | Weeks | 1000-5000 | 500-1000 |

### Accessibility
- New players can complete most daily quests
- Some quests require progression (era unlocks)
- No quest should feel impossible

---

## Technical Notes

### Quest Tracking
- Server-side validation for all quest progress
- Real-time progress updates
- Offline progress calculation where applicable

### Quest Refresh
- Daily: 00:00 UTC
- Weekly: Monday 00:00 UTC
- Season: Aligned with content updates (8 weeks)

---

*Every quest is a promise to the player. Keep it meaningful.*
