# Jolt Time — Daily Quests System

## Overview

Daily Quests are Jolt Time's primary retention system, providing players with fresh goals every 24 hours that reward consistent engagement without requiring excessive time investment.

---

## 1. Purpose & Design Philosophy

### Core Purpose

Daily quests are one of the main retention systems in Jolt Time. They serve multiple objectives:

- **Engagement Driver** — Give players reasons to return daily
- **Gameplay Variety** — Introduce different activities each day
- **Progression Support** — Supplement main progression with steady rewards
- **Discovery Tool** — Guide players toward underutilized features
- **Reward Satisfaction** — Provide immediate, tangible feedback loops

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Never Exhausting** | Total daily quest time: 5-10 minutes |
| **Always Rewarding** | Every completed quest delivers meaningful value |
| **Variety First** | Quest rotation prevents monotony |
| **Choice Empowered** | Players decide which quests to prioritize |
| **Opt-In Ads** | Ad-watching quests are never mandatory |

### UX Philosophy

> Daily quests should feel rewarding and never exhausting.

Every design decision is evaluated against this principle. If a quest feels like a chore, it must be redesigned or removed.

---

## 2. Quest Configuration

### Number of Daily Quests

Players receive exactly **3 daily quests** every day.

**Rationale:**
- 3 quests provide enough variety without overwhelming
- Each quest takes 1-3 minutes to complete
- Total time investment stays under 10 minutes
- Easier to track progress than 5+ quests

### Quest Refresh Schedule

| Event | Timing | Details |
|-------|--------|---------|
| **Daily Reset** | 00:00 UTC | All quests reset simultaneously |
| **New Quest Generation** | Automatic on reset | Server generates new quest set |
| **Progress Retention** | None | Unclaimed rewards expire at reset |
| **Time Zone Handling** | UTC-based | Local display shows countdown to reset |

---

## 3. Quest Categories

### Complete Category List

| Category | Description | Difficulty Available |
|----------|-------------|---------------------|
| **Collect Artifacts** | Acquire artifacts from any source | Easy, Medium |
| **Open Reward Boxes** | Open capsules/reward boxes | Easy, Medium |
| **Visit Museum** | View museum or specific sections | Easy |
| **Complete Battles** | Win missions or challenges | Easy, Medium, Hard |
| **Watch AdsGram Ad** | Watch optional rewarded advertisement | Easy |
| **Use Boosters** | Activate any booster item | Medium |
| **Log In** | Simply open the app | Easy |
| **Upgrade Artifacts** | Enhance owned artifacts | Medium |
| **Complete Tutorials** | Finish tutorial sections | Easy |
| **Social Actions** | Send gifts, add friends | Medium |
| **Explore Eras** | Visit specific eras | Easy, Medium |
| **Win Streaks** | Achieve daily win streaks | Hard |

### Detailed Category Specifications

#### Collect Artifacts

```
Quest Examples:
- "Collect 1 artifact" (Easy)
- "Collect 3 artifacts" (Medium)
- "Collect 5 rare artifacts" (Hard)

Completion Triggers:
- Artifact acquired from any source
- Includes capsules, missions, events, gifts
- Duplicate tracking varies by difficulty
```

#### Open Reward Boxes

```
Quest Examples:
- "Open 2 capsules" (Easy)
- "Open 5 capsules" (Medium)
- "Open a Legendary capsule" (Hard)

Completion Triggers:
- Any capsule opened
- Reward box opened
- Special container opened
```

#### Visit Museum

```
Quest Examples:
- "Visit the Museum" (Easy)
- "View 3 different museum sections" (Medium)
- "View the Hall of Ages" (Hard)

Completion Triggers:
- Navigate to museum screen
- View specific section (3+ seconds)
- Artifact viewed in museum context
```

#### Complete Battles

```
Quest Examples:
- "Complete 1 mission" (Easy)
- "Complete 3 missions" (Medium)
- "Complete 5 missions without using energy" (Hard)

Completion Triggers:
- Mission victory confirmed
- Mission complete screen viewed
- Results saved to server
```

#### Watch AdsGram Ad

```
Quest Examples:
- "Watch 1 rewarded ad (optional)" (Easy)
- "Watch 3 rewarded ads today" (Medium)

Critical Rules:
- NEVER required to progress
- NEVER locks better rewards
- ALWAYS clearly labeled "Optional"
- Player must主动触发观看

Completion Triggers:
- Full ad viewed (>95% completion)
- Reward acknowledged
- Only counts toward quest if initiated from quest panel
```

#### Use Boosters

```
Quest Examples:
- "Activate 1 booster" (Medium)
- "Use a 2x XP booster" (Medium)
- "Activate any boost during a mission" (Hard)

Completion Triggers:
- Booster activated from inventory
- Booster effect confirmed active
```

#### Log In

```
Quest Examples:
- "Log in today" (Easy)
- "Log in 3 days this week" (Hard - multi-day)

Completion Triggers:
- App opened
- Main screen rendered
- Session recorded
```

---

## 4. Difficulty Levels

### Difficulty Structure

| Difficulty | Time Required | Challenge Level | Reward Multiplier |
|------------|---------------|-----------------|------------------|
| **Easy** | 1-2 minutes | Minimal | 1.0x base |
| **Medium** | 2-5 minutes | Moderate | 1.5x base |
| **Hard** | 5-10 minutes | Significant | 2.0x base |

### Difficulty Distribution

For each daily set of 3 quests:
- **1 Easy** quest guaranteed
- **1 Medium** quest guaranteed
- **1 Medium or Hard** quest (randomized)

This ensures every player can complete at least 1 quest easily while providing aspirational goals.

### Player-Level Scaling (Future)

Difficulty may be influenced by:
- Player level
- Account age
- Historical completion rates
- Optional difficulty settings

---

## 5. Reward System

### Reward Types

| Reward Type | Examples | Rarity |
|-------------|----------|--------|
| **Coins** | Chrono Dust, Gold | Common |
| **Boosters** | XP Boost, Energy Refill | Common |
| **Artifact Fragments** | Era-specific fragments | Common |
| **Event Resources** | Limited-time currencies | During events |
| **Cosmetic Rewards** | Frames, Badges, Titles | Rare |

### Reward Values by Difficulty

| Difficulty | XP Range | Currency Range | Special |
|------------|----------|----------------|---------|
| Easy | 30-50 | 10-20 | Common fragments |
| Medium | 75-100 | 25-50 | Uncommon fragments |
| Hard | 150-200 | 75-100 | Rare fragments, cosmetics |

### Reward Preview

Every quest card displays its reward before completion:

```
┌─────────────────────────────────────────┐
│  🔔 Quest Card                           │
├─────────────────────────────────────────┤
│                                         │
│  "Collect 3 artifacts"                  │
│  Difficulty: Medium                      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🎁 REWARD PREVIEW               │    │
│  │  ────────────────────────────── │    │
│  │  • 100 XP                       │    │
│  │  • 50 Chrono Dust               │    │
│  │  • 3 Egypt Fragments            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Progress: ██░░░░░░░░ 2/3              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Progress Tracking

### UI Display Requirements

Players must always see:

| Element | Description | Location |
|---------|-------------|----------|
| **Current Progress** | Numeric or visual progress indicator | Quest card |
| **Remaining Requirements** | "Collect 2 more" or "0/3 complete" | Quest card |
| **Reward Preview** | Exact rewards for completion | Quest card |
| **Quest Timer** | Time until daily reset | Screen header |
| **Completion State** | Checkmark or filled indicator | Quest card |

### Progress Indicators

```
Incomplete:
○ Collect 3 artifacts         100 XP
  Progress: ██░░░░░░░░ 2/3

In Progress (Partial):
◐ Collect 3 artifacts         100 XP
  Progress: ████░░░░░░ 2/3

Complete (Unclaimed):
● Collect 3 artifacts         100 XP ✓
  [CLAIM REWARD]

Completed & Claimed:
✓ Collect 3 artifacts         100 XP ✓
  Claimed!
```

### Real-Time Updates

- Progress updates within 1 second of action
- No manual refresh required
- Server validation for anti-abuse
- Offline progress calculated on login

---

## 7. Quest Generation Algorithm

### Generation Rules

1. **3 quests per day** — Always exactly 3
2. **Balanced difficulty** — See difficulty distribution above
3. **No duplicates** — Same category can repeat but not exact match
4. **Player-relevant** — Based on player level and unlocked features
5. **Varied categories** — Maximum 2 quests from same category

### Generation Parameters

```yaml
quest_generation:
  daily_count: 3
  difficulty_distribution:
    easy: 1  # Always exactly 1
    medium: 1-2  # At least 1
    hard: 0-1  # Maximum 1
  
  category_constraints:
    max_same_category: 2
    exclude_locked: true
    prefer_unlocked: true
  
  player_factors:
    level: 1-50
    unlocked_eras: 1-7
    tutorial_complete: boolean
    artifact_count: integer
```

### Example Daily Quest Sets

**New Player (Level 5):**
1. "Log in today" (Easy) — Reward: 30 XP, 10 Dust
2. "Open 2 capsules" (Easy) — Reward: 50 XP, 15 Dust
3. "Visit Egypt" (Medium) — Reward: 75 XP, 25 Dust

**Mid-Game Player (Level 20):**
1. "Collect 3 artifacts" (Easy) — Reward: 50 XP, 20 Dust
2. "Complete 3 missions" (Medium) — Reward: 100 XP, 50 Dust
3. "Watch an ad (optional)" (Easy) — Reward: 50 XP, 30 Dust

**Veteran Player (Level 40):**
1. "Use a booster" (Medium) — Reward: 100 XP, 40 Dust
2. "Complete 5 missions" (Hard) — Reward: 200 XP, 100 Dust
3. "Collect 3 Epic artifacts" (Hard) — Reward: 250 XP, 3 Epic Fragments

---

## 8. AdsGram Integration

### Integration Philosophy

> Players must never be forced to watch ads.

AdsGram is the primary business model of Jolt Time. However, player trust and enjoyment take priority over short-term revenue.

### Ad-Based Quests

| Quest Type | Requirement | Obligation |
|------------|-------------|------------|
| **Optional Reward Quest** | "Watch 1 ad to earn bonus" | Completely opt-in |
| **Ad Watch Challenge** | "Watch an ad (optional)" | Player chooses |
| **Boosted Reward** | "+50% reward if you watch ad" | Player chooses |

### Implementation Rules

1. **Never Lock Content** — Ad quests never block progression
2. **Always Optional** — Clear labeling "Optional" or "(Watch Ad)"
3. **Separate Tracking** — Ad completion tracked independently
4. **Easy Opt-Out** — Can complete base quest without ads
5. **No Pressure** — No countdown timers forcing ad decisions

### Visual Design for Ad Quests

```
┌─────────────────────────────────────────┐
│  📺 Watch an ad (Optional)     Easy    │
│                                         │
│  Watch a short ad to earn:              │
│  • 50 XP (base)                         │
│  • +25 XP bonus                         │
│  • +15 Chrono Dust bonus                │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  [ ▶ Watch Ad for Bonus ]       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  or skip to complete base quest         │
└─────────────────────────────────────────┘
```

---

## 9. Anti-Abuse Systems

### Double-Claim Prevention

**Players cannot claim rewards multiple times.**

| Protection Layer | Mechanism |
|------------------|-----------|
| **Server Validation** | Quest completion verified server-side |
| **State Tracking** | `is_claimed` flag on quest record |
| **Atomic Operations** | Claim operation is atomic transaction |
| **Idempotency** | Duplicate requests return existing state |
| **Rate Limiting** | Max 10 claim requests per minute |

### Progress Manipulation Prevention

| Attack Vector | Prevention |
|---------------|------------|
| **Session Replay** | Unique session tokens per action |
| **Progress Inflation** | Server recalculates from raw events |
| **Time Manipulation** | Server timestamp authoritative |
| **Multi-Account** | IP/device limits on quests |
| **Bot Detection** | Behavioral analysis on quest completion |

### Claim Flow

```
Client Request                    Server Validation
     │                                  │
     │──── Claim Quest ─────────────────>│
     │                                  │ Check:
     │                                  │ 1. Quest exists?
     │                                  │ 2. Progress complete?
     │                                  │ 3. Already claimed?
     │                                  │ 4. Valid player?
     │                                  │ 5. Rate limit ok?
     │<─── Success/Failure ─────────────│
     │                                  │
     v                                  v
[Show Reward]                   [Update DB + Log]
```

---

## 10. Telegram Notifications

### Notification Strategy

Telegram bot notifications remind players about unfinished daily quests.

### Notification Types

| Type | Trigger | Timing | Content |
|------|---------|--------|---------|
| **Reminder** | Quests incomplete | 6 hours before reset | "You have 2 quests left!" |
| **Motivational** | Near reset | 2 hours before reset | "Daily reset soon! Quick, claim your rewards" |
| **Streak Alert** | Streak at risk | 1 hour before reset | "Don't lose your 15-day streak!" |
| **Return Nudge** | Player inactive | 18 hours after last login | "Your quests are waiting!" |

### User Control

- All notifications opt-in
- Frequency settings: Off, Low, Normal, High
- Quiet hours respected
- Category toggles (quests, streaks, events)

### Notification Format

```
┌─────────────────────────────────────────┐
│  🔔 Jolt Time — Quest Reminder          │
├─────────────────────────────────────────┤
│                                         │
│  You have unfinished quests!            │
│                                         │
│  ○ Collect 3 artifacts (2/3)          │
│  ○ Complete 1 mission (0/1)             │
│                                         │
│  ⏰ Resets in 2 hours                   │
│                                         │
│  [Quick Claim] → Open App               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 11. Future Quest Systems

### Architecture for Extensibility

The Daily Quests system must support future quest types without major refactoring.

### Weekly Quests

```
Configuration:
- Reset: Monday 00:00 UTC
- Duration: 7 days
- Count: 5-7 quests per week
- Difficulty: Medium to Hard
- Rewards: Premium cosmetics, rare capsules

Integration: Shares UI with Daily Quests
```

### Monthly Quests

```
Configuration:
- Reset: 1st of month 00:00 UTC
- Duration: 28-31 days
- Count: 4-6 quests
- Difficulty: Hard
- Rewards: Legendary cosmetics, exclusive titles

Example: "Complete 50 missions this month"
```

### Seasonal Quests

```
Configuration:
- Reset: Aligned with seasons (8 weeks)
- Duration: ~56 days
- Count: 3-5 major quests
- Difficulty: Hard
- Rewards: Season-exclusive cosmetics, auras

Example: "Complete all era collections"
```

### Premium Quests

```
Configuration:
- Available: Season Pass holders only
- Count: 3 quests per day (in addition to free)
- Difficulty: Medium to Hard
- Rewards: Higher value, exclusive items

Exclusive Rewards:
- Premium frame variants
- Avatar decorations
- Animated badges
```

### Event Quests

```
Configuration:
- Available: During limited events
- Reset: Event end date
- Duration: 3-14 days typical
- Count: 5-10 quests
- Difficulty: Variable

Integration: Separate event tab in quest screen
```

### System Architecture

```yaml
quest_system_architecture:
  base_quest:
    id: string
    category: enum
    difficulty: enum
    requirements: object
    rewards: object
    is_ads: boolean
  
  quest_provider:
    daily_provider: "3 quests, 1Easy/1Medium/1Hard"
    weekly_provider: "5 quests, Medium-Hard"
    monthly_provider: "4 quests, Hard"
    seasonal_provider: "3 quests, Hard"
    event_provider: "5-10 quests, Variable"
  
  quest_scheduler:
    daily_cron: "0 0 * * *"  # Midnight UTC
    weekly_cron: "0 0 * * 1"  # Monday midnight
    monthly_cron: "0 0 1 * *" # 1st of month
    seasonal_cron: "0 0 * * 0" # Aligned with seasons
```

---

## 12. Technical Implementation

### Data Model

```typescript
interface DailyQuest {
  id: string;
  playerId: string;
  category: QuestCategory;
  difficulty: Difficulty;
  description: string;
  requirements: QuestRequirement;
  progress: number;
  isComplete: boolean;
  isClaimed: boolean;
  rewards: QuestReward[];
  expiresAt: Date;
  createdAt: Date;
}

interface QuestRequirement {
  type: string;        // "collect", "complete", "visit"
  target: string;       // "artifact", "mission", "museum"
  count: number;        // Required count
  metadata?: object;    // Additional constraints
}

interface QuestReward {
  type: string;         // "xp", "currency", "item"
  itemId: string;       // Specific item ID
  quantity: number;      // Amount
}
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quests/daily` | GET | Get player's daily quests |
| `/quests/daily/progress` | POST | Update quest progress |
| `/quests/daily/claim` | POST | Claim completed quest reward |
| `/quests/daily/refresh` | POST | Refresh quest (watch ad only) |

### Performance Requirements

| Metric | Target |
|--------|--------|
| Quest Load | < 100ms |
| Progress Update | < 50ms |
| Claim Processing | < 200ms |
| Concurrent Users | 100,000+ |

---

## 13. Success Metrics

### Key Performance Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Daily Quest Completion Rate** | > 70% | Quests completed / generated |
| **Quest Claim Rate** | > 95% | Claims / completions |
| **Average Quests per Player** | 2.5 / day | Total completed / unique players |
| **Return Rate** | > 60% | Daily active returning players |
| **Ad Quest Participation** | 30-50% | Optional ad acceptance rate |
| **Quest Abandonment** | < 5% | Started but not completed |

---

## 14. Example Screens

### Daily Quests Screen

```
┌─────────────────────────────────────────┐
│  📋 DAILY QUESTS           ⏰ 14:32:05  │
│  "Resets at 00:00 UTC"                  │
├─────────────────────────────────────────┤
│                                         │
│  Progress: ████████░░ 2/3 Complete     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ✓ Collect 3 artifacts   Easy   │    │
│  │   REWARD: 50 XP, 20 Dust       │    │
│  │   ✓ CLAIMED                     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ● Open 2 capsules       Easy   │    │
│  │   Progress: ██████░░░░ 2/2      │    │
│  │   REWARD: 75 XP, 25 Dust        │    │
│  │   [CLAIM REWARD]                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ○ Watch an ad (Optional) Easy  │    │
│  │   REWARD: 50 XP + Bonus         │    │
│  │   [Watch Ad for +50% Reward]    │    │
│  │   or [Complete Base Quest]      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ○ Complete 1 mission     Medium│    │
│  │   Progress: ░░░░░░░░░░ 0/1      │    │
│  │   REWARD: 100 XP, 50 Dust       │    │
│  │   REWARD PREVIEW LOCKED         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │
│  DAILY REWARDS                          │
│  Today's Total: 225 XP, 95 Dust         │
│  Claimed: 50 XP, 20 Dust               │
│  Pending: 175 XP, 75 Dust              │
└─────────────────────────────────────────┘
```

---

*Daily quests are the heartbeat of Jolt Time — a promise to players that every return is worth their time.*
