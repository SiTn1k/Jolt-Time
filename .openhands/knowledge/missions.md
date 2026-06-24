# Jolt Time — Daily and Weekly Mission System

## Overview

The Mission System is Jolt Time's primary engagement driver, providing structured objectives that guide players through varied gameplay activities. The system is designed to be accessible, rewarding, and never exhausting — with daily missions taking approximately 10-20 minutes to complete fully. Jolt Time supports casual players while rewarding consistent engagement.

---

## 1. Daily Missions

Daily missions provide short-term goals that refresh every 24 hours, encouraging players to return daily while respecting their time.

### Mission Generation

New missions are generated every day at **00:00 UTC**. Each player receives a personalized set of missions based on their level, progression, and unlocked features.

### Daily Mission Structure

| Feature | Value |
|---------|-------|
| **Missions Per Day** | 3 missions |
| **Reset Time** | 00:00 UTC daily |
| **Completion Time** | 10-20 minutes total |
| **Reward Types** | XP, Chrono Coins, Energy, Cosmetics |
| **Difficulty Distribution** | 1 Easy, 1 Medium, 1 Hard |

### Daily Mission Examples

**Battle Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Win 1 Battle" | Complete one battle | Easy | 50 XP, 20 Chrono Coins |
| "Win 3 Battles" | Complete three battles | Medium | 100 XP, 40 Chrono Coins |
| "Era Champion" | Win 2 battles in same era | Medium | 100 XP, 45 Chrono Coins |
| "Win 5 Battles" | Complete five battles | Hard | 200 XP, 80 Chrono Coins |

**Expedition Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Complete Expedition" | Finish one expedition | Easy | 60 XP, 25 Chrono Coins |
| "Expedition Explorer" | Complete 2 expeditions | Medium | 120 XP, 50 Chrono Coins |
| "Rare Discovery" | Find a rare item on expedition | Hard | 200 XP, 100 Chrono Coins |

**Artifact Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Collect Artifact" | Acquire any artifact | Easy | 40 XP, 15 Chrono Coins |
| "Upgrade an Artifact" | Enhance one artifact | Easy | 50 XP, 25 Chrono Coins |
| "Museum Visitor" | Visit museum screen | Easy | 30 XP, 10 Chrono Coins |
| "Set Collector" | Complete one artifact set | Hard | 250 XP, 150 Chrono Coins |

**Social Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Send a Gift" | Send energy to a friend | Easy | 40 XP, 20 Chrono Coins |
| "Make a Friend" | Add a new friend | Easy | 50 XP, 25 Chrono Coins |
| "Help a Friend" | Send gift + complete battle | Medium | 100 XP, 50 Chrono Coins |

### Daily Mission Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 DAILY MISSIONS                              ⏰ 14:32:05  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Progress: ████████░░ 2/3 Complete                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ✓ Win 1 Battle                            Easy             ││
│  │   REWARD: 50 XP, 20 Chrono Coins                        ││
│  │   ✓ CLAIMED                                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ● Complete Expedition                        Medium       ││
│  │   Progress: ████████████░░░ 1/2                        ││
│  │   REWARD: 120 XP, 50 Chrono Coins                        ││
│  │   [VIEW EXPEDITIONS]                                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ○ Win 5 Battles                              Hard         ││
│  │   Progress: ██░░░░░░░░░░░░░ 2/5                        ││
│  │   REWARD: 200 XP, 80 Chrono Coins                        ││
│  │   [ENTER BATTLE]                                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  TODAY'S TOTAL: 350 XP, 170 Chrono Coins                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Weekly Missions

Weekly missions provide medium-term goals with larger rewards, resetting every Monday at 00:00 UTC.

### Weekly Mission Structure

| Feature | Value |
|---------|-------|
| **Missions Per Week** | 5 missions |
| **Reset Time** | Monday 00:00 UTC |
| **Completion Time** | 2-4 hours total spread over week |
| **Reward Types** | XP, Chrono Coins, Capsules, Cosmetics |
| **Difficulty Distribution** | 2 Medium, 2 Hard, 1 Special |

### Weekly Mission Examples

**Battle Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Battle Champion" | Win 30 battles | Medium | 400 XP, 200 Chrono Coins |
| "Victory Seeker" | Win 50 battles | Hard | 600 XP, 300 Chrono Coins |
| "Arena Glory" | Win 15 Arena battles | Hard | 500 XP, 250 Chrono Coins |

**Expedition Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Expedition Master" | Complete 15 expeditions | Medium | 350 XP, 175 Chrono Coins |
| "World Explorer" | Complete 25 expeditions | Hard | 550 XP, 275 Chrono Coins |
| "Rare Hunter" | Find 5 rare discoveries | Hard | 500 XP, 300 Chrono Coins |

**Collection Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Artifact Collector" | Collect 20 artifacts | Medium | 300 XP, 150 Chrono Coins |
| "Museum Curator" | Donate 10 artifacts to museum | Medium | 350 XP, 175 Chrono Coins |
| "Set Completer" | Complete 3 artifact sets | Hard | 600 XP, 400 Chrono Coins |

**Social Missions:**
| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Social Butterfly" | Send 20 gifts | Medium | 300 XP, 150 Chrono Coins |
| "Guild Member" | Participate in guild activity | Medium | 350 XP, 175 Chrono Coins |

### Weekly Mission Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 WEEKLY MISSIONS                              Day 4/7       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Overall Progress: ████████░░░░░░░░░░░░ 45%                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ⚔️ Battle Champion                                        ││
│  │ Progress: ████████████████░░░░ 23/30                      ││
│  │ Reward: 400 XP, 200 Chrono Coins                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🗺️ Expedition Master                                       ││
│  │ Progress: ██████████░░░░░░░░░░ 12/15                     ││
│  │ Reward: 350 XP, 175 Chrono Coins                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🎨 Set Completer                                           ││
│  │ Progress: ████░░░░░░░░░░░░░░░ 1/3                       ││
│  │ Reward: 600 XP, 400 Chrono Coins, Rare Capsule            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  WEEK'S TOTAL: 1,350 XP, 775 Chrono Coins                     │
│  Remaining: 1,550 XP, 825 Chrono Coins                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Mission Difficulty Levels

Missions are categorized into difficulty levels that determine required effort and reward value.

### Difficulty Structure

| Difficulty | Time Required | Reward Multiplier | Accessibility |
|------------|--------------|-------------------|---------------|
| **Easy** | 1-2 minutes | 1.0x base | Everyone |
| **Normal** | 3-5 minutes | 1.5x base | Active players |
| **Hard** | 5-10 minutes | 2.0x base | Dedicated players |
| **Special** | Variable | 2.5x base | Event-based |

### Difficulty Scaling by Level

| Player Level | Easy | Normal | Hard |
|--------------|------|--------|------|
| 1-10 | Collect 1 artifact | Collect 3 artifacts | Win 5 battles |
| 11-25 | Win 1 battle | Win 3 battles | Win 7 battles |
| 26-50 | Visit museum | View 3 sections | Complete set |
| 51+ | Any category | Any category | Any category |

### Reward Scaling by Difficulty

| Difficulty | XP Range | Chrono Coins | Special |
|------------|----------|--------------|---------|
| Easy | 25-50 | 10-25 | — |
| Normal | 75-125 | 30-60 | Small boosters |
| Hard | 150-250 | 75-150 | Large boosters, cosmetics |
| Special | 300-500 | 150-300 | Event currency |

---

## 4. Reward Types

Missions provide various reward types to maintain engagement and progression.

### Reward Categories

| Reward Type | Purpose | Frequency |
|-------------|---------|-----------|
| **XP** | Player level progression | Every mission |
| **Chrono Coins** | General currency | Every mission |
| **Time Shards** | Progression currency | Medium-Hard missions |
| **Battle Pass XP** | Season progression | During events |
| **Cosmetics** | Prestige items | Hard+ missions |
| **Event Currency** | Limited content | During events |

### Reward Values

| Difficulty | XP | Chrono Coins | Time Shards |
|------------|-----|--------------|-------------|
| Easy | 25-50 | 10-25 | 0 |
| Normal | 75-125 | 30-60 | 5-15 |
| Hard | 150-250 | 75-150 | 15-30 |
| Special | 300-500 | 150-300 | 30-50 |

### Cosmetic Rewards

| Mission Type | Cosmetic Chance | Examples |
|-------------|----------------|----------|
| Easy | 0% | — |
| Normal | 5% | Small badges |
| Hard | 15% | Frames, badges |
| Weekly | 40% | Rare cosmetics |
| Special | 60% | Event-exclusive |

### No Pay-to-Win Rewards

- **All rewards are cosmetic or progression-enhancing**
- **No direct power increases from mission rewards**
- **No exclusive content locked behind difficulty**
- **Event cosmetics available to all players**

---

## 5. Mission Chains

Mission chains provide multi-step objectives that guide players through different activities, culminating in bonus rewards.

### Chain Structure

```
MISSION CHAIN EXAMPLE:

Step 1: Win Battles
├── Objective: Win 5 battles
├── Reward: 200 XP, 100 Chrono Coins
└── Status: ✓ Complete

Step 2: Expedition Explorer
├── Objective: Complete 3 expeditions
├── Reward: 300 XP, 150 Chrono Coins
└── Status: ● In Progress (1/3)

Step 3: Museum Curator
├── Objective: Donate an artifact to museum
├── Reward: 150 XP, 75 Chrono Coins
└── Status: ○ Locked

─────────────────────────────────────────
CHAIN BONUS (upon completion):
+500 XP, 250 Chrono Coins, Rare Capsule
```

### Chain Difficulty Levels

| Chain | Steps | Time to Complete | Bonus Reward |
|-------|-------|-----------------|--------------|
| Beginner | 2 | 15-20 minutes | Small Capsule |
| Intermediate | 3 | 30-45 minutes | Medium Capsule |
| Advanced | 4 | 1-2 hours | Rare Capsule |
| Master | 5 | 2-4 hours | Epic Capsule |

### Chain Examples

**Beginner Chain — "First Steps":**
1. Win 1 battle → 50 XP
2. Collect an artifact → 50 XP
*Chain Bonus: 100 XP, 25 Chrono Coins*

**Intermediate Chain — "Explorer":**
1. Win 3 battles → 150 XP
2. Complete an expedition → 100 XP
3. Visit museum → 50 XP
*Chain Bonus: 300 XP, 150 Chrono Coins, Small Capsule*

**Advanced Chain — "Collector":**
1. Win 5 battles → 250 XP
2. Complete 3 expeditions → 300 XP
3. Collect 5 artifacts → 200 XP
4. Donate 2 artifacts to museum → 150 XP
*Chain Bonus: 500 XP, 300 Chrono Coins, Medium Capsule*

### Chain Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🔗 MISSION CHAIN: "The Complete Explorer"                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Progress: Step 2 of 4                                         │
│                                                                 │
│  Step 1 ✓ Win 5 Battles                           COMPLETE    │
│           Reward: 250 XP, 100 Chrono Coins                      │
│                                                                 │
│  Step 2 ● Complete 3 Expeditions                  IN PROGRESS │
│           Progress: ████████░░ 2/3                            │
│           Reward: 300 XP, 150 Chrono Coins                      │
│                                                                 │
│  Step 3 ○ Collect 5 Artifacts                       LOCKED     │
│           Reward: 200 XP, 100 Chrono Coins                      │
│                                                                 │
│  Step 4 ○ Donate 2 Artifacts to Museum             LOCKED     │
│           Reward: 150 XP, 75 Chrono Coins                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  CHAIN BONUS (when complete):                                   │
│  +500 XP, 250 Chrono Coins, Rare Capsule                        │
│                                                                 │
│  [CONTINUE]                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Mission Refresh System

Players can refresh missions to get new objectives better suited to their preferences.

### Refresh Options

| Refresh Type | Cost | Limit | Description |
|-------------|------|-------|-------------|
| **Free Refresh** | Free | 1 per day | Get one new mission |
| **Premium Refresh** | Jolt Crystals | Unlimited | Get new mission instantly |
| **Full Reset** | Jolt Crystals | 1 per week | Reset all daily missions |

### Refresh Costs

| Option | Cost | Effect |
|--------|------|--------|
| Single Mission | 5 Jolt Crystals | Replace one mission |
| Full Daily Reset | 15 Jolt Crystals | New set of 3 missions |
| Full Weekly Reset | 50 Jolt Crystals | New set of 5 missions |

### Refresh Balance Philosophy

- **Free option ensures accessibility for all players**
- **Premium option provides convenience for willing players**
- **Costs are low enough to be non-predatory**
- **No gameplay advantage from refreshing**
- **New missions may be easier or harder (randomized)**

### Refresh Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🔄 MISSION REFRESH                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Today's Free Refresh:                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ✓ "Win 5 Battles" → "Win 3 Battles"                        ││
│  │   Progress reset, easier objective                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Premium Refreshes:                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ [Refresh Single Mission]     5 💎                          ││
│  │ [Full Daily Reset]          15 💎                          ││
│  │ [Full Weekly Reset]        50 💎                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Note: Free refresh resets daily at 00:00 UTC                   │
│                                                                 │
│  [CLOSE]                                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Streak System

The streak system rewards consistent daily engagement with escalating benefits.

### Streak Tracking

| Streak Type | Description | Reset |
|-------------|-------------|-------|
| **Daily Streak** | Consecutive days with 1+ mission | Missed day |
| **Weekly Streak** | Consecutive weeks with missions complete | Missed week |
| **Monthly Streak** | Consecutive months with weekly complete | Missed month |

### Streak Levels and Benefits

| Streak Days | Title | XP Bonus | Energy Bonus | Special Reward |
|-------------|-------|----------|--------------|----------------|
| 1-2 | Newcomer | +5% | — | — |
| 3-6 | Regular | +10% | +5/day | — |
| 7-13 | Devoted | +15% | +10/day | Weekly Capsule |
| 14-29 | Loyal | +20% | +15/day | Rare Capsule |
| 30-59 | Dedicated | +25% | +20/day | Epic Capsule |
| 60-99 | Committed | +30% | +25/day | Legendary Capsule |
| 100+ | Master | +40% | +30/day | Mythic Capsule |

### Streak Protection

**Grace Period:**
- 12 hours for streak 1-6
- 24 hours for streak 7-13
- 48 hours for streak 14-29
- 72 hours for streak 30-59
- 96 hours for streak 60+

**Temporal Shields:**
- Purchasable protection extending grace by 48 hours
- Available during events
- Cosmetic only, no power advantages

### Streak Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 STREAK STATUS                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Current Streak: 14 days                                        │
│  Best Streak: 23 days                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Day 14: LOYAL                                            ││
│  │  ████████████████████████████░░░░░░░░░░░░░░░░░░░░░░  14   ││
│  │  Progress to Day 15: ████░░░░░░░░░░░░░░░░░░░░░░░░  2/5  ││
│  │                                                             ││
│  │  Active Bonuses:                                           ││
│  │  • +20% XP on all activities                               ││
│  │  • +15 Energy per day                                     ││
│  │  • Next reward: Rare Capsule                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Streak Protection:                                             │
│  Temporal Shield: Not active                                     │
│  Grace period expires: 48 hours remaining                        │
│                                                                 │
│  [BUY TEMPORAL SHIELD]                        [VIEW HISTORY]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Mission Statistics

Comprehensive statistics track mission completion and rewards earned.

### Statistics Tracked

| Statistic | Description | Display |
|-----------|-------------|---------|
| **Total Missions** | Lifetime missions completed | Number |
| **Daily Completion Rate** | Percentage of daily missions completed | Percentage |
| **Weekly Completion Rate** | Percentage of weekly missions completed | Percentage |
| **Current Streak** | Consecutive days | Number |
| **Best Streak** | Longest streak achieved | Number |
| **Weekly Record** | Most missions in a week | Number |
| **Monthly Record** | Most missions in a month | Number |
| **Total XP Earned** | From missions | Number |
| **Total Coins Earned** | From missions | Number |
| **Chains Completed** | Mission chains finished | Number |

### Statistics Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 MISSION STATISTICS                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Lifetime Progress:                                              │
│  • Total Missions: 1,247                                       │
│  • Daily Rate: 89% (312/350)                                   │
│  • Weekly Rate: 78% (45/58)                                    │
│                                                                 │
│  Streaks:                                                       │
│  • Current: 14 days 🔥                                         │
│  • Best: 23 days                                              │
│  • Weekly Streak: 8 weeks                                      │
│                                                                 │
│  Records:                                                       │
│  • Weekly: 28 missions (Week 23)                               │
│  • Monthly: 112 missions (January)                             │
│                                                                 │
│  Rewards Earned:                                                │
│  • Total XP: 89,450                                            │
│  • Chrono Coins: 44,725                                        │
│  • Time Shards: 12,340                                         │
│  • Capsules: 23                                                │
│                                                                 │
│  [VIEW HISTORY]  [MILESTONES]  [SHARE]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Casual Player Philosophy

Jolt Time is designed to support players with limited time while rewarding those who engage more deeply.

### Time-Friendly Design

| Player Type | Daily Time | Weekly Time | Rewards |
|-------------|-----------|-------------|---------|
| **Casual** | 5-10 min | 35-70 min | 60% of potential |
| **Regular** | 10-20 min | 70-140 min | 85% of potential |
| **Dedicated** | 20-30 min | 2-3 hours | 100% of potential |

### Session Support

- **Multiple sessions supported** — missions don't require continuous play
- **Progress saves instantly** — switch between activities freely
- **No time-gated content** — complete missions at your pace
- **Async activities** — expeditions continue while away

### Anti-Frustration Measures

**No Mandatory Grinding:**
- Easy missions always available
- Hard missions are aspirational, not required
- Weekend bonuses reduce required time

**Respect for Schedules:**
- 24-hour daily window
- Week-long weekly window
- Grace periods for streaks

**Fair Reward Distribution:**
- Casual players progress meaningfully
- Dedicated players get proportional rewards
- No excessive rewards for extreme play

### Casual-Friendly Features

- Quick missions (1-2 minutes)
- Energy-efficient activities
- Offline progression (expeditions)
- Weekend bonus events

---

## 10. Telegram Bot Notifications

Telegram notifications inform players about mission status and encourage engagement without becoming spam.

### Notification Types

**Daily Reset:**
```
📋 DAILY MISSIONS READY!

3 new missions available:
• Win 1 Battle (Easy) — 50 XP
• Complete Expedition (Medium) — 120 XP
• Collect 5 Artifacts (Hard) — 200 XP

Your streak: 14 days 🔥

[START MISSIONS] → Jolt Time
```

**Chain Completed:**
```
🔗 CHAIN COMPLETE!

"The Explorer" chain finished!

Rewards earned:
• 800 XP
• 400 Chrono Coins
• Rare Capsule

New chain available!

[VIEW CHAIN] → Jolt Time
```

**Streak Milestone:**
```
🔥 STREAK MILESTONE: 30 DAYS!

You've been dedicated for a full month!

New rewards unlocked:
• +25% XP Bonus (permanent)
• Epic Capsule earned
• "Dedicated" title added

Your streak: 30 days
Next milestone: 60 days (+30% XP)

[CLAIM REWARDS] → Jolt Time
```

**Weekly Summary:**
```
📅 WEEKLY MISSIONS COMPLETE!

Your week in missions:
• 18/20 daily missions (90%)
• 4/5 weekly missions (80%)

Rewards earned:
• 2,450 XP
• 1,225 Chrono Coins
• 3 Capsules

Weekly Capsule Ready!

[CLAIM WEEKLY REWARD] → Jolt Time
```

### Notification Frequency

| Notification | Max Per Day | Trigger |
|---------------|-------------|---------|
| Daily Reset | 1 | New missions available |
| Chain Complete | 3 | Each chain completion |
| Streak Milestone | 1 | Each milestone |
| Weekly Complete | 1 | Week end |
| Streak Warning | 1 | 24h before expiry |
| **Total Cap** | **4** | **Never exceeded** |

### Anti-Spam Rules

- Notifications celebrate achievements, not every action
- Never fear-based or manipulative
- Clear opt-out available
- Maximum 4 mission notifications per day
- Quiet hours respected

---

## 11. AdsGram Integration

AdsGram remains the primary revenue system. Optional ad rewards enhance mission rewards without being mandatory.

### Optional Ad Rewards

| Ad Reward | Effect | Daily Limit | Mandatory |
|-----------|--------|-------------|-----------|
| Mission Refresh | One additional free refresh | 1 ad | No |
| Reward Boost | +50% mission rewards | 2 ads | No |
| XP Boost | +25% XP for 1 hour | 3 ads | No |
| Quick Complete | Skip one Easy mission | 1 ad | No |

### AdsGram Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ WATCH & EARN                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Boost your mission rewards!                                     │
│  Watch a video for:                                              │
│                                                                 │
│  [+50% Mission Rewards]  [+1 Refresh]  [+25% XP]               │
│                                                                 │
│  Today: 1/5 ads watched                                         │
│                                                                 │
│  [WATCH VIDEO]                           [MAYBE LATER]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Balance Philosophy

- **Never Required:** Complete all missions without watching ads
- **Genuine Help:** Ads provide convenience, not power
- **Fair Value:** Rewards match ad viewing time
- **No Pressure:** Clear dismiss option

---

## 12. Future Expansion Notes

These features are documented for future consideration. They are not currently planned or in development.

### Monthly Missions

**Concept:** Longer-term objectives with significant rewards
- Monthly reset
- Larger reward pools
- Achievement-style goals
- Milestone celebrations

**Status:** Future consideration
**Priority:** Medium
**Challenges:** Engagement pacing, reward inflation

### Guild Missions

**Concept:** Cooperative objectives for guild members
- Shared progress tracking
- Guild-wide rewards
- Team coordination
- Social engagement

**Status:** Future consideration
**Priority:** Medium
**Challenges:** Free-rider prevention, coordination tools

### Co-op Missions

**Concept:** Play with friends on shared objectives
- Multiplayer missions
- Coordinated rewards
- Team achievements
- Social depth

**Status:** Future consideration
**Priority:** Low
**Challenges:** Matchmaking, session coordination

### World Missions

**Concept:** Server-wide collective goals
- Global community objectives
- Shared progress bars
- Combined rewards
- Special events

**Status:** Future consideration
**Priority:** Low
**Challenges:** Engagement disparity, reward distribution

---

## 13. Connected Systems

### Mission System Integration

```
Daily/Weekly Missions
        ↓
Player Progression (XP)
        ↓
Level System
        ↓
Unlocks (New eras, features)
        ↓
More Mission Variety

Expedition Missions ←→ Expedition System
Battle Missions ←→ Arena/Battle System
Collection Missions ←→ Museum System
Social Missions ←→ Social System
Event Missions ←→ Event System
```

### Data Flow

| System | Integration Point |
|--------|-------------------|
| Expedition | Expedition-specific missions |
| Battle | Battle count missions |
| Museum | Donation and visit missions |
| Social | Friend gift missions |
| Events | Event currency missions |

---

## 14. Technical Implementation Notes

### Database Schema

| Table | Purpose |
|-------|---------|
| `player_missions` | Active mission records |
| `mission_history` | Completed mission records |
| `mission_streaks` | Streak tracking |
| `mission_statistics` | Aggregated stats |

### Mission Generation Algorithm

```javascript
// Server-side mission generation
function generateDailyMissions(player) {
  const availableMissions = getMissionsByLevel(player.level);
  const difficultyBalance = {
    easy: 1,
    medium: 1,
    hard: 1
  };
  
  return {
    missions: shuffle(availableMissions).slice(0, 3),
    difficulty: difficultyBalance,
    expiresAt: getTomorrowUTC()
  };
}
```

---

## 15. Balance Summary

### Progression Pacing

| Player Type | Daily Missions | Weekly Missions | Monthly Missions |
|-------------|---------------|-----------------|------------------|
| Casual | 2/3 (66%) | 2/5 (40%) | — |
| Regular | 3/3 (100%) | 4/5 (80%) | — |
| Dedicated | 3/3 (100%) | 5/5 (100%) | — |

### Reward Economy

| Activity | Daily Rewards | Weekly Rewards |
|----------|--------------|----------------|
| Easy missions | 75 XP, 35 Coins | — |
| Medium missions | 225 XP, 105 Coins | 1,400 XP, 700 Coins |
| Hard missions | 400 XP, 200 Coins | 2,000 XP, 1,000 Coins |
| **Total potential** | **700 XP, 340 Coins** | **3,400 XP, 1,700 Coins** |

### Fair Play Guarantees

- No mission requires real money to complete
- All rewards achievable through normal play
- Difficulty scaling respects player level
- Streak protection prevents harsh penalties

---

*Every mission is a promise to the player. Keep it achievable, rewarding, and respectful of their time.*

---

*Document Version: 1.0*  
*Last Updated: 2025-01-23*
