# Quest System

## Overview

The quest system drives player engagement through structured objectives, meaningful rewards, and clear progression paths. Every quest should feel achievable, rewarding, and connected to the core gameplay loop of time travel and artifact collection.

---

## 1. Quest Categories

### Main Story Quests

**Purpose:** Guide players through the narrative and unlock new gameplay features.

**Characteristics:**
- Sequential progression (must complete in order)
- One-time completion only
- Significant rewards for major milestones
- Unlock new eras, features, or game modes

**Structure:**
```
Chapter 1: The Beginning
├── 1.1 First Steps (Tutorial)
├── 1.2 Your First Artifact
├── 1.3 Battle Training
├── 1.4 The Museum Opens
└── 1.5 Chapter Complete

Chapter 2: Ancient Mysteries
├── 2.1 Journey to Mesopotamia
├── 2.2 Decode the Tablet
├── ...
└── Chapter Complete
```

**Reward Tiers:**
- Chapter completion: 500–2000 coins + exclusive artifact
- Major story beat: 100–500 coins + fragments

---

### Daily Quests

**Purpose:** Provide short-term goals that encourage daily engagement.

**Reset Time:** Daily at 00:00 UTC

**Characteristics:**
- Auto-generate each day
- Can be completed in any order
- Reset completely each day
- Must claim rewards before reset

**Daily Quest Examples:**

| Quest | Objective | Difficulty | Rewards |
|-------|-----------|------------|---------|
| Battle Ready | Win 3 battles | Easy | 50 coins, 10 XP |
| Artifact Hunter | Open 2 artifact packs | Medium | 1–3 fragments, 20 XP |
| Upgrade Master | Level up any artifact once | Easy | 30 coins, 15 XP |
| Museum Visitor | View 5 artifacts in museum | Easy | 25 coins, 10 XP |
| Ad Watcher | Watch 1 AdsGram ad | Easy | 15 coins, 5 XP, 1 fragment |
| Daily Reward | Claim daily login bonus | Easy | 100 coins, 50 energy |
| Collector | Collect 1 new artifact | Medium | 2–5 fragments, 30 XP |
| Power Up | Reach 500 total power | Hard | 100 coins, 50 fragments |
| Time Traveler | Play 3 different eras | Medium | 75 coins, 20 XP |
| Diligent Traveler | Complete 5 daily quests | Medium | 150 coins, 1 rare fragment |

---

### Weekly Quests

**Purpose:** Provide medium-term goals with bigger rewards.

**Reset Time:** Weekly on Monday at 00:00 UTC

**Characteristics:**
- More challenging objectives
- Larger reward pools
- Partial completion rewards available

**Weekly Quest Examples:**

| Quest | Objective | Difficulty | Rewards |
|-------|-----------|------------|---------|
| Artifact Collector | Collect 15 artifacts total | Medium | 500 coins, 10 fragments |
| Battle Champion | Win 50 battles | Hard | 750 coins, 5 rare fragments |
| Daily Devotion | Complete 20 daily quests | Medium | 400 coins, 3 epic fragments |
| PvP Contender | Participate in 10 PvP matches | Medium | 600 coins, badge |
| Era Explorer | Visit all 6 eras | Hard | 800 coins, 15 fragments |
| Power House | Reach 2000 total power | Legendary | 1000 coins, 1 legendary fragment |
| Set Builder | Complete 3 artifact sets | Hard | 1200 coins, exclusive frame |
| Streak Keeper | Maintain 7-day login streak | Medium | 500 coins, 20 fragments |

---

### Achievement Quests

**Purpose:** Reward long-term accomplishments and milestones.

**Characteristics:**
- One-time completion
- Persistent progress tracking
- No expiration
- Major prestige rewards

**Achievement Examples:**

| Achievement | Requirement | Rarity | Reward |
|-------------|-------------|--------|--------|
| First Steps | Complete tutorial | Common | Starter pack |
| Collector | Collect 10 artifacts | Common | 200 coins |
| Dedicated | 7-day login streak | Common | 500 coins |
| Historian | Collect 50 artifacts | Rare | 1000 coins, badge |
| Battle Master | Win 500 battles | Epic | 2000 coins, title |
| Museum Curator | Display 20 artifacts | Rare | Exclusive frame |
| Time Lord | Reach max level | Legendary | Mythic artifact |
| Completionist | 100% collection | Mythic | Golden aura |

---

### Event Quests

**Purpose:** Limited-time content tied to real-world events or updates.

**Characteristics:**
- Time-limited (typically 7–30 days)
- Special event currency
- Exclusive rewards unavailable elsewhere
- May introduce new artifacts or features

**Event Structure:**
```
Summer Solstice Event (June 2025)
├── Collect Solar Fragments (daily)
├── Visit each era during daylight hours
├── Win battles with sun-themed artifacts
├── Share event progress
└── Grand Prize: Sun Medallion artifact
```

---

### Era Quests

**Purpose:** Deep-dive content specific to each historical era.

**Characteristics:**
- Unlocked when player reaches era
- Must visit era to progress
- Era-specific artifacts as rewards
- Build historical knowledge

**Era Quest Example (Ancient Egypt):**
```
Pharaoh's Legacy
├── Build the Pyramid (5 stages)
│   ├── Quarry 100 stones
│   ├── Transport materials
│   ├── Hire workers
│   ├── Lay foundation
│   └── Complete construction
├── Decode Hieroglyphs (3 stages)
├── Bury the Pharaoh (2 stages)
└── Reward: Ankh of Eternity (Legendary)
```

---

## 2. Reward Types

### Currency Rewards

| Currency | Icon | Usage | Quest Frequency |
|----------|------|-------|-----------------|
| Coins | 🪙 | Artifacts, upgrades, cosmetics | Common |
| Energy | ⚡ | Battle entry, time travel | Common |
| Artifact Fragments | 💎 | Upgrade artifacts | Common |
| XP | 📊 | Player level progression | Very Common |
| Premium Currency | ⭐ | Rare purchases, premium items | Rare |
| Event Tokens | 🎫 | Event-specific rewards | During events |

### Non-Currency Rewards

| Reward | Description |
|--------|-------------|
| Artifact | Directly award specific artifact |
| Badge | Profile display item |
| Frame | Profile picture frame |
| Title | Username title |
| Aura | Visual profile effect |
| Emote | Chat expression |
| Background | Profile backdrop |

---

## 3. Quest Difficulty Levels

### Difficulty Tiers

| Difficulty | Color | Time Estimate | Base Reward Multiplier |
|------------|-------|---------------|------------------------|
| Easy | Green (#22C55E) | 5–15 min | 1.0x |
| Medium | Blue (#3B82F6) | 15–45 min | 1.5x |
| Hard | Purple (#8B5CF6) | 45–120 min | 2.5x |
| Legendary | Gold (#F59E0B) | 2–4 hours | 5.0x |

### Reward Calculation

```
Base Reward × Difficulty Multiplier × Streak Bonus × Event Multiplier
```

**Example:**
- Daily Quest base: 50 coins
- Hard difficulty: 50 × 2.5 = 125 coins
- With 7-day streak (+10%): 125 × 1.1 = 137.5 ≈ 138 coins
- During event (+25%): 138 × 1.25 = 172.5 ≈ 173 coins

### Difficulty Guidelines by Category

| Category | Typical Difficulties |
|----------|---------------------|
| Daily Quests | Easy, Medium |
| Weekly Quests | Medium, Hard, Legendary |
| Achievement Quests | Medium, Hard, Legendary |
| Event Quests | Easy, Medium, Hard |
| Era Quests | Medium, Hard |

---

## 4. Quest UI Behavior

### Main Quest Screen Layout

```
┌─────────────────────────────────────────┐
│  QUESTS                           🔄️   │
│  ─────────────────────────────────────  │
│                                         │
│  [  Active  ] [ Completed ] [ Locked ]  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📋 Daily Quest                  │   │
│  │                                 │   │
│  │ Win 3 Battles                  │   │
│  │ ████████░░░░░ 3/5              │   │
│  │                                 │   │
│  │ Rewards: 🪙50  ⚡10  📊15XP    │   │
│  │                    [  CLAIM  ]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔒 Weekly Quest                 │   │
│  │ (Unlocks in 2 days)            │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Section Definitions

**Active Section**
- Shows all incomplete quests
- Quests appear as cards with progress
- Claim buttons enabled when complete
- Sorted by difficulty (harder at top)

**Completed Section**
- Shows claimed quests from current period
- Checkmark badge on completed items
- Collapsed view (rewards hidden)
- Scroll through history

**Locked Section**
- Shows future content requirements
- Progress bar toward unlock
- Preview of upcoming rewards
- Teases upcoming content

### Progress Bar Behavior

- Real-time updates as player progresses
- Smooth animation on increment
- Color matches difficulty tier
- Shows exact fraction (e.g., "3/5")
- Pulses when nearly complete

### Reward Preview

- Always visible on quest card
- Shows all reward types with icons
- Quantity clearly displayed
- Slight glow effect on high-value rewards

### Claim Button States

| State | Appearance | Action |
|-------|------------|--------|
| Locked | Gray, disabled | N/A |
| In Progress | Hidden | N/A |
| Ready | Green, pulsing | Tap to claim |
| Claimed | Gray, checkmark | Already claimed |

### Completion Animation

1. **Button Press:** Button compresses
2. **Reward Popup:** Floating rewards fly to destination
3. **Particle Burst:** Celebratory particles
4. **Sound Effect:** Coin/achievement chime
5. **Card Update:** Quest moves to Completed tab

---

## 5. Retention Mechanics

### Daily Streak System

**Streak Counter:** Days of consecutive activity

| Streak Days | Bonus Multiplier | Extra Reward |
|-------------|------------------|--------------|
| 1 | 1.0x | None |
| 2 | 1.05x | +10 coins |
| 3 | 1.1x | +25 coins |
| 5 | 1.15x | +50 coins, 5 fragments |
| 7 | 1.2x | +100 coins, rare fragment |
| 14 | 1.25x | +200 coins, epic fragment |
| 30 | 1.3x | +500 coins, legendary fragment |
| 60 | 1.35x | +750 coins, exclusive badge |
| 100 | 1.5x | +1000 coins, mythic artifact |

### Streak Mechanics

**Daily Check-In:**
- Must perform any game action to maintain streak
- Minimum: open app and play 1 minute
- Check-in resets at 00:00 UTC

**Streak Freeze:**
- Players can purchase streak freeze (premium)
- Auto-applied once per month for free
- Preserves streak through missed day

### Missed Day Recovery

**Recovery Window:** 24 hours after missed day

If player returns within 24 hours:
- Option to restore streak for 1 premium currency
- Must watch short ad or pay fee
- Streak restored to previous value
- No recovery after 24 hours

**Grace Period:**
- Day 1 miss: Warning notification
- Day 2 miss: Streak breaks, reset to 0
- Recovery available until Day 2 at original missed time

### Weekly Reset

**Monday 00:00 UTC:**
- Daily quests reset completely
- Weekly quests refresh
- Streak counter persists
- New weekly objectives appear

**Friday Bonus:**
- Double XP on all quests
- 1.5x fragment drop rate
- Free daily pack

### Monthly Challenge

**First of Month:**
- 30-day marathon quest line
- Cumulative objectives (play X total days)
- Major reward for completion
- Progress persists across weeks

**Example Monthly Challenge:**
```
June Marathon
├── Play 5 days → 100 coins
├── Play 10 days → 250 coins + badge
├── Play 20 days → 500 coins + frame
├── Play 30 days → 1000 coins + legendary artifact
```

---

## 6. Push Notifications

### Notification Philosophy

- Maximum 4 notifications per day
- Value-first messaging
- Never manipulative or FOMO-inducing
- Full user control over preferences

### Notification Types

**Quest Reminders:**

| Notification | Trigger | Message |
|--------------|---------|---------|
| Daily Quests Ready | 9:00 AM local | "Your daily quests are ready! Tap to start earning rewards." |
| Quests Expiring | 11:00 PM local | "3 daily quests expire at midnight. Finish them now!" |
| Weekly Refresh | Monday 8:00 AM | "New weekly missions await! Check out the bigger rewards." |

**Reward Notifications:**

| Notification | Trigger | Message |
|--------------|---------|---------|
| Rewards Waiting | 1 hour after claimable | "New rewards are waiting in your quest log." |
| Streak Reminder | 10:00 PM if no activity | "Don't lose your 7-day streak! Play for just 1 minute." |
| Bonus Active | Friday 12:00 AM | "Weekend bonus is live! Double XP and extra fragments." |

**Event Notifications:**

| Notification | Trigger | Message |
|--------------|---------|---------|
| Event Start | Event launch | "The Summer Solstice event has begun! Join the celebration." |
| Event Ending | 24h before end | "2 more days in the Solstice event. Claim your rewards!" |
| New Content | Major update | "New era unlocked! Explore Ancient Egypt today." |

### Notification Rules

1. **No spam:** Never send more than 4 per day
2. **Opt-out respected:** Immediate unsubscribe on request
3. **Time zones:** Send at appropriate local times
4. **Value focus:** Always mention what's in it for player
5. **Actionable:** Clear call-to-action, not vague

---

## 7. Quest Progression Integration

### Connected Systems

**Battle Integration:**
- Win/lose tracked for quest progress
- Specific artifact requirements possible
- Era-specific battle quests
- PvP match tracking

**Artifact Collection Integration:**
- New artifact detection triggers collection quests
- Duplicate management through fragments
- Set completion tracking
- Power threshold achievements

**Event Integration:**
- Events can add new quest categories
- Seasonal currencies tracked separately
- Collaboration quests for partnerships
- Limited-time objectives

### Quest → Reward → Progression Flow

```
Quest Completion
    ↓
Reward Distribution
    ↓
Player Resources Increase
    ↓
Ability to Complete Harder Content
    ↓
New Quests Unlocked
    ↓
Cycle Repeats
```

---

## 8. Future Support

### Seasonal Quests

**Structure:**
- 4 seasons per year (Spring, Summer, Autumn, Winter)
- Each season has unique theme and mechanics
- Seasonal quests run 3 months
- Seasonal currency and exclusive rewards
- Progress resets each season (new challenges)

**Example Seasonal Theme:**
```
Spring Awakening (March–May)
├── Theme: Growth and new beginnings
├── Currency: Bloom Petals 🌸
├── Mechanics: Plant seeds, nurture with daily play
├── Rewards: Garden artifacts, flower badges
└── Premium: Season Pass for bonus rewards
```

### Special Collaborations

**Partnership Quest Lines:**
- Museum partnerships for authentic artifacts
- Educational institution tie-ins
- Historical society collaborations
- Limited-time only

**Example Collaboration:**
```
British Museum Partnership
├── Duration: 2 weeks
├── Exclusive artifacts from museum collection
├── Educational content about real pieces
├── Donation option to museum (optional)
└── Unique "Museum Curator" badge
```

### Limited-Time Missions

**Flash Missions:**
- 24–72 hour duration
- Urgent objectives with premium rewards
- Often tied to real-world events
- Cannot be completed after expiration

**Example Flash Mission:**
```
Eclipse Event (April 8, 2025)
├── Duration: 8 hours only
├── Objective: Watch eclipse through time travel
├── Reward: Solar Crown artifact
└── Requirement: Must be online during eclipse window
```

---

## 9. AdsGram Integration

### Ad Placement Principles

**Core Rule:** Ads are always optional and rewarding. Never force or manipulate.

**Acceptable Ad Placements:**
- Quest rewards that include ad watching (player choice)
- Bonus rewards for watching ads
- "Skip wait time" optional ad
- Double reward option (watch ad for bonus)

**Never Include:**
- Required ads to progress
- Ads blocking content
- Auto-playing unskippable ads
- Interrupting gameplay flow

### Ad Quest Examples

| Quest | Description | Reward | Obligation |
|-------|-------------|--------|------------|
| Bonus Hunter | Watch 1 ad for bonus rewards | 2x daily reward | Optional |
| Quick Boost | Watch ad to skip 1-hour wait | Instant progress | Optional |
| Collector+ | Watch ad to guarantee rare artifact | Rare drop | Optional |
| Weekend Special | Watch ad for double weekend bonus | 2x everything | Optional |

### Ad Frequency Guidelines

- Maximum 1 ad per gameplay session
- Never more than 3 ads per day
- Always provide non-ad alternative
- Respect user疲劳 (fatigue) signals

---

## 10. Quest Configuration

### Quest Data Schema

```yaml
quest:
  id: string              # Unique identifier
  category: enum          # main|daily|weekly|achievement|event|era
  name: string            # Display name
  description: string     # Player-facing description
  objective: object       # Target and progress mechanism
  difficulty: enum        # easy|medium|hard|legendary
  rewards: object         # Reward distribution
  requirements: object    # Prerequisites
  limits: object          # Time limits, attempts
  tracking: object        # Progress display settings
```

### Reward Distribution Rules

1. **No duplicate rewards** in same quest
2. **Scaled difficulty** = scaled rewards
3. **Time investment** should match reward value
4. **Premium currency** only in rare achievements
5. **Event tokens** only during active events

---

*Document Version: 1.0*  
*Last Updated: 2025-01-15*