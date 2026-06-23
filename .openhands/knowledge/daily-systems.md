# Jolt Time — Daily Systems and Player Retention

## Overview

Daily systems are the heartbeat of Jolt Time's engagement strategy. They provide consistent reasons to return, reward loyal players, and create healthy gameplay habits without resorting to manipulative mechanics. All systems are designed around three core values: **fairness**, **respect for player time**, and **long-term sustainability**.

---

## 1. Daily Login Rewards

### 1.1 30-Day Reward Cycle

The daily login reward calendar spans 30 days and resets upon completion. Each day builds upon the previous, creating escalating rewards that encourage consistent engagement.

**Calendar Reset Rules:**
- Calendar resets on Day 30 completion
- Player returns to Day 1 with streak bonus level preserved
- Progress cannot be skipped — each day requires login
- Rewards must be claimed before midnight UTC

### 1.2 Reward Structure

The 30-day calendar uses a repeating weekly pattern with escalating daily rewards:

**Daily Reward Table:**

| Day | Chrono Coins | XP | Energy | Fragments | Special Reward |
|-----|-------------|-----|--------|-----------|----------------|
| 1 | 50 | 10 | — | — | — |
| 2 | — | — | 20 | — | — |
| 3 | — | — | — | 3 | — |
| 4 | — | 15 | — | — | +20 Max Energy Cap |
| 5 | 75 | 20 | — | — | — |
| 6 | — | — | 30 | — | — |
| 7 | 100 | 25 | — | 5 | **Rare Pack** |
| 8 | — | — | — | — | — |
| 9 | 100 | 30 | — | — | — |
| 10 | — | — | 40 | — | — |
| 11 | — | 35 | — | 5 | — |
| 12 | 125 | — | — | — | — |
| 13 | — | — | — | 8 | — |
| 14 | 150 | 40 | — | — | — |
| 15 | — | — | 50 | — | +50 Max Energy Cap |
| 16 | — | — | — | 10 | — |
| 17 | 175 | 45 | — | — | — |
| 18 | — | — | — | — | 5 Premium Currency |
| 19 | 200 | 50 | — | — | — |
| 20 | — | — | 60 | 10 | — |
| 21 | 225 | 55 | — | — | **Epic Pack** |
| 22 | — | — | — | 12 | — |
| 23 | 250 | 60 | — | — | — |
| 24 | — | — | 70 | — | — |
| 25 | — | — | — | 15 | +100 Max Energy Cap |
| 26 | 275 | 65 | — | — | — |
| 27 | — | — | — | — | 10 Premium Currency |
| 28 | 300 | 70 | 80 | — | — |
| 29 | — | — | — | 20 | — |
| 30 | 500 | 100 | — | 50 | **Legendary Pack + 25 Premium Currency** |

### 1.3 Special Reward Days

**Day 7 — Weekly Milestone:**
- Guaranteed Rare Pack
- Marks first week's completion
- Foundation for building streak habit

**Day 14 — Bi-Weekly Celebration:**
- 150 Chrono Coins + 40 XP
- 8 Artifact Fragments
- Shows consistent engagement valued

**Day 21 — Mid-Month Achievement:**
- Epic Pack reward
- 225 Chrono Coins + 55 XP
- Approaching final milestone

**Day 30 — Grand Finale:**
- Legendary Pack (highest tier)
- 500 Chrono Coins + 100 XP
- 25 Jolt Crystals (premium currency)
- Celebrates full month commitment

### 1.4 Visual Calendar Design

```
┌─────────────────────────────────────────────────────────────┐
│                    DAILY REWARDS                            │
│                    Day 1 of 30                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│   [1]  [2]  [3]  [4]  [5]  [6]  [7]                        │
│   ✓    ✓    ✓    ✓    ✓    ✓    ✓                            │
│                                                              │
│   [8]  [9]  [10] [11] [12] [13] [14]                       │
│   ✓    ✓    ✓    ✓    ✓    ✓    ✓                            │
│                                                              │
│   [15] [16] [17] [18] [19] [20] [21]                      │
│   ✓    ✓    ✓    ✓    ✓    ✓    ✓                            │
│                                                              │
│   [22] [23] [24] [25] [26] [27] [28]                      │
│   ✓    ✓    ✓    ✓    ✓    ✓    ✓                            │
│                                                              │
│   [29] [30]                                                  │
│   ✓    ✓                                                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Today's Reward: 500 Coins + 100 XP + 50 Fragments      │  │
│  │                                                          │  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  90% to next reward  │  │
│  │                                                          │  │
│  │               [ CLAIM REWARD ]                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🔥 Streak: 21 days    Bonus: +25%                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Calendar Card States:**
| State | Visual | Interaction |
|-------|--------|-------------|
| Claimed | Checkmark overlay, muted colors | None |
| Available Today | Pulsing cyan border, full color | Tap to claim |
| Locked (Future) | Grayscale, lock icon overlay | Cannot interact |
| Special Day | Gold border, star indicator | Celebration animation |

---

## 2. Login Streak System

### 2.1 Streak Counter

The streak counter tracks consecutive days of player activity. A "day" is measured as any gameplay action within a 24-hour period from midnight UTC.

**Streak Counter Display:**
```
┌─────────────────────────────────────┐
│  🔥 STREAK: 23 DAYS                 │
│  ████████████████████░░░ 92%        │
│                                      │
│  Next: Day 30 (+5% XP bonus)        │
│  +25% XP Bonus Active!               │
└─────────────────────────────────────┘
```

### 2.2 Streak Milestones and Benefits

| Streak Day | Title | XP Bonus | Energy/Day | Special Reward |
|------------|-------|----------|------------|----------------|
| 1 | Newcomer | +5% | — | — |
| 3 | Regular | +10% | +5 | — |
| 7 | Devoted | +15% | +10 | Weekly Capsule |
| 14 | Loyal | +20% | +15 | Rare Capsule |
| 30 | Dedicated | +25% | +20 | Epic Capsule |
| 60 | Committed | +30% | +25 | Legendary Capsule |
| 100 | Master | +40% | +30 | Mythic Capsule |

**Streak Benefits Stack:**
- XP bonus percentage accumulates
- Energy bonus provides passive regeneration boost
- Milestone capsules awarded at each major tier
- Titles and badges unlock at milestones

### 2.3 Missed Day Rules

**Grace Period System:**
Streak protection scales with streak length to reward long-term players:

| Streak Length | Grace Period |
|---------------|--------------|
| 0-6 days | 0 hours (streak ends immediately) |
| 7-13 days | 12 hours |
| 14-29 days | 24 hours |
| 30-59 days | 48 hours |
| 60-99 days | 72 hours |
| 100+ days | 96 hours (4 days) |

**Grace Period Display:**
```
┌─────────────────────────────────────┐
│  🔒 STREAK PROTECTED!               │
│                                      │
│  Your streak of 15 days is safe     │
│  for the next 24 hours.              │
│                                      │
│  Time remaining: 23:45:32           │
└─────────────────────────────────────┘
```

### 2.4 Streak Protection Items

**Temporal Shield:**
- **Acquisition:** 1% drop rate from any pack
- **Effect:** Extends grace period by 48 hours
- **Storage:** Maximum 3 shields in inventory
- **Expiry:** Never expires in inventory
- **Use:** Manual activation only

**Shield Notification:**
```
┌─────────────────────────────────────┐
│  🛡️ TEMPORAL SHIELD ACTIVATED!     │
│                                      │
│  Your streak is now protected       │
│  for an additional 48 hours.        │
│                                      │
│  Remaining shields: 1                │
└─────────────────────────────────────┘
```

### 2.5 Streak Recovery Options

**Quick Recovery (Once per 7 days):**
- Complete 3 missions within 24 hours of missing
- Streak restored to previous level
- Recovery streak starts fresh

**Weekend Warrior Feature:**
- Play on both Saturday AND Sunday
- Streak counter resets but bonuses preserved
- "Weekend Warrior" badge awarded

### 2.6 Streak Loss Handling

**Compassionate Design Principles:**

1. **No Shame Messages**
   - "Your streak ended" not "You failed"
   - "Let's start fresh!" not "You lost everything"

2. **Preserved Bonuses**
   - XP bonus level preserved
   - Collection progress kept
   - All artifacts and items retained
   - Museum progress maintained

3. **Soft Restart**
   - New streak starts immediately
   - First 7 days are "Rebuilding Phase"
   - Double rewards for first 3 days of new streak

---

## 3. Daily Missions

### 3.1 Mission Overview

Daily missions provide structured short-term goals that refresh automatically each day at 00:00 UTC. Players receive 3 personalized missions based on their level and progression.

**Mission Refresh:**
- **Reset Time:** 00:00 UTC daily
- **Generation:** Server-side automated
- **Personalization:** Based on player level, unlocked eras, recent activity
- **Category Variety:** 2-3 different categories per day

### 3.2 Mission Categories

| Category | Description | Example Missions |
|----------|-------------|------------------|
| **Login** | Simple daily actions | Open the game, Claim daily reward |
| **Battle** | Combat objectives | Win 3 battles, Complete 2 missions |
| **Artifact** | Collection goals | Collect 3 artifacts, Open a capsule |
| **Collection** | Completion objectives | Upgrade an artifact, Visit museum |
| **Social** | Community activities | Send a gift, Add a friend |
| **AdsGram** | Optional ad watching | Watch 2 rewarded ads (optional) |
| **Exploration** | Discovery goals | Visit a new era, Complete tutorial |

### 3.3 Daily Mission Examples

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| Quick Win | Win 1 battle | Easy | 50 XP, 20 Dust |
| Collector | Collect 1 artifact | Easy | 40 XP, 15 Dust |
| Museum Visitor | Visit museum | Easy | 30 XP, 10 Dust |
| Upgrader | Enhance 1 artifact | Easy | 50 XP, 25 Dust |
| Explorer | Win 3 battles | Medium | 100 XP, 40 Dust |
| Artifact Hunter | Open 2 artifact packs | Medium | 80 XP, 35 Dust |
| Diligent Traveler | Complete 5 daily quests | Medium | 150 XP, 1 rare fragment |
| Battle Champion | Win 5 battles | Hard | 200 XP, 80 Dust |
| Power Up | Reach 500 total power | Hard | 100 XP, 50 fragments |

### 3.4 Difficulty Distribution

**For each set of 3 daily missions:**
- **1 Easy** mission guaranteed (ensures accessibility)
- **1 Medium** mission guaranteed (moderate challenge)
- **1 Hard** mission (aspirational goal)

**Reward Calculation:**
```
Base Reward × Difficulty Multiplier × Streak Bonus × Event Multiplier
```

### 3.5 Mission Display

```
┌─────────────────────────────────────────┐
│  📋 DAILY MISSIONS             14:32:05│
│  "Resets at 00:00 UTC"                  │
├─────────────────────────────────────────┤
│                                          │
│  Progress: ████████░░ 2/3 Complete     │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ ✓ Win 1 Battle         Easy     │    │
│  │   REWARD: 50 XP, 20 Dust       │    │
│  │   ✓ CLAIMED                     │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ ● Collect 3 Artifacts  Medium   │    │
│  │   Progress: ██████░░░░ 3/3     │    │
│  │   REWARD: 100 XP, 40 Dust       │    │
│  │   [CLAIM REWARD]                │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ ○ Watch 2 Ads (Optional) Hard   │    │
│  │   Progress: ░░░░░░░░░░ 0/2     │    │
│  │   REWARD: 175 XP, 100 Dust      │    │
│  │   [Watch Ad for +50% Bonus]     │    │
│  └─────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

### 3.6 Auto-Refresh Behavior

- Missions track progress automatically in background
- Progress syncs in real-time with server
- Completed missions auto-claim rewards
- No manual refresh needed
- New missions available at next UTC midnight

---

## 4. Weekly Missions

### 4.1 Overview

Weekly missions provide medium-term goals with larger rewards. They reset every Monday at 00:00 UTC and encourage sustained engagement throughout the week.

**Reset Time:** Weekly on Monday at 00:00 UTC

### 4.2 Weekly Mission Examples

| Mission | Objective | Difficulty | Rewards |
|---------|-----------|------------|---------|
| Artifact Collector | Collect 15 artifacts | Medium | 500 Coins, 10 Fragments |
| Battle Champion | Win 50 battles | Hard | 750 Coins, 5 Rare Fragments |
| Daily Devotion | Complete 20 daily quests | Medium | 400 Coins, 3 Epic Fragments |
| Era Explorer | Visit all 6 eras | Hard | 800 Coins, 15 Fragments |
| Power House | Reach 2000 total power | Legendary | 1000 Coins, 1 Legendary Fragment |
| Set Builder | Complete 3 artifact sets | Hard | 1200 Coins, Exclusive Frame |
| Streak Keeper | Maintain 7-day login streak | Medium | 500 Coins, 20 Fragments |

### 4.3 Weekly Reward Structure

| Difficulty | XP Range | Dust Range | Special |
|------------|----------|------------|---------|
| Medium | 350-500 | 175-300 | Capsules |
| Hard | 500-750 | 300-500 | Rare cosmetics |
| Legendary | 750-1000 | 500-750 | Epic cosmetics |

### 4.4 Event Support

During active events, weekly missions may include:
- Event-specific objectives (collect event tokens)
- Event currency bonus multipliers
- Limited-time event rewards

---

## 5. Monthly Objectives

### 5.1 Overview

Monthly objectives track longer-term goals that encourage collection and progression depth. They reset at the start of each calendar month.

**Reset Time:** First day of each month, 00:00 UTC

### 5.2 Monthly Objective Categories

**Collection Goals:**
| Objective | Requirement | Reward |
|-----------|-------------|--------|
| Collector I | Collect 50 artifacts | 1000 Coins, Bronze Badge |
| Collector II | Collect 100 artifacts | 2000 Coins, Silver Badge |
| Collector III | Collect 200 artifacts | 5000 Coins, Gold Badge |
| Era Completion | Complete any era 100% | 3000 Coins, Era Frame |

**Battle Goals:**
| Objective | Requirement | Reward |
|-----------|-------------|--------|
| Battle Veteran | Win 200 battles | 1500 Coins, Battle Badge |
| Battle Master | Win 500 battles | 3000 Coins, Veteran Frame |
| PvP Contender | Participate in 50 PvP matches | 2000 Coins, Arena Badge |

**Progression Goals:**
| Objective | Requirement | Reward |
|-----------|-------------|--------|
| Level Up | Reach Level 20 | 2500 Coins, 50 Fragments |
| Artifact Power | Reach 5000 total artifact power | 3000 Coins, Power Frame |
| Set Collector | Complete 5 artifact sets | 2000 Coins, Collector Title |

**Museum Goals:**
| Objective | Requirement | Reward |
|-----------|-------------|--------|
| Curator I | Display 20 artifacts in museum | 1000 Coins, Bronze Badge |
| Curator II | Display 50 artifacts in museum | 2500 Coins, Silver Badge |
| Historian | Visit all museum sections | 1500 Coins, Scholar Title |

### 5.3 Monthly Milestone Rewards

| Milestone | Total Progress | Bonus Reward |
|-----------|----------------|--------------|
| Bronze | 25% complete | +10% XP for month |
| Silver | 50% complete | +25% XP for month |
| Gold | 75% complete | +50% XP for month |
| Platinum | 100% complete | +100% XP for month + Exclusive Badge |

---

## 6. Comeback Rewards

### 6.1 Overview

Comeback rewards welcome returning players and ensure that taking breaks doesn't feel punishing. The longer the absence, the more generous the return bonus.

### 6.2 Inactivity Thresholds

| Days Absent | Welcome Bonus |
|-------------|---------------|
| 1 day | Normal daily reward |
| 2-3 days | 1.5x daily reward |
| 4-7 days | 2x daily reward + Free Capsule |
| 8-14 days | 2.5x daily reward + Rare Capsule |
| 15-30 days | 3x daily reward + Epic Capsule |
| 30+ days | 3x daily reward + Legendary Capsule + Welcome Back Badge |

### 6.3 Welcome Back Flow

```
Player Returns After 3+ Days:
     │
     ▼
┌─────────────────────────────────────┐
│  👋 WELCOME BACK, TIME KEEPER!      │
│                                      │
│  We missed you! While you were away: │
│  • 7 days of daily rewards saved     │
│  • Egypt Week event happened         │
│  • New artifacts discovered          │
│                                      │
│  🎁 Welcome Back Chest:               │
│  • 7 Daily Capsules                  │
│  • 500 Chrono Coins                  │
│  • +50% XP for 24 hours             │
│                                      │
│  Your streak bonus (+25% XP) is      │
│  still intact!                       │
│                                      │
│  [ CLAIM WELCOME BACK ]              │
└─────────────────────────────────────┘
```

### 6.4 Preserved Progress

When a player returns:
- **Streak bonus level:** Preserved (never lost)
- **All artifacts:** Retained
- **Collection progress:** Maintained
- **Museum unlocks:** Kept
- **Premium subscription:** Active (if applicable)

---

## 7. Push Notification System

### 7.1 Overview

Telegram Bot notifications are the primary channel for re-engagement. They are designed to be **useful**, **timely**, and **never spammy**.

### 7.2 Core Principles

1. **Value-First** — Every notification provides genuine value
2. **Respectful** — Never spam, never guilt-trip
3. **Actionable** — Clear next steps when possible
4. **Optional** — Users can disable any notification type
5. **Timely** — Sent at optimal times for engagement

### 7.3 Notification Limits

| Category | Daily Limit | Notes |
|----------|-------------|-------|
| Maximum Total | 4 per day | Never exceeded |
| Daily Login Reminder | 1 per day | 10:00 AM local |
| Energy Restored | 1 per cycle | When threshold reached |
| New Quests | 1 per day | At reset |
| Event Start | 1 per event | At launch |
| Event Ending | 1 per event | 24h before end |
| Streak Warning | Never | Not used — too stressful |

### 7.4 Notification Types

**1. Daily Reward Reminder**
```
⏰ Your Daily Reward Awaits!

Time Energy: ████████░░ 80/100
Daily Reward: 🎁 Ready to claim!
Streak: 🔥 Day 7 (bonus active!)

Weekend Bonus: Active! 2x XP!
[Continue Your Journey] → Jolt Time
```

**2. Energy Restored**
```
⚡ Time Energy Restored!

Your energy is back — ready for a mission?
Current Energy: ████░░░░░░ 40/100

[Quick Mission] → Mesopotamia
```

**3. New Quests Available**
```
📜 New Daily Quests Ready!

Quest 1: Complete 3 missions → +100 XP, +25 Dust
Quest 2: Collect 2 artifacts → +50 XP
Quest 3: Help a friend → +25 XP, +10 Energy

Progress: 0/3 complete

[View Quests] → Jolt Time
```

**4. Event Started**
```
🎭 New Event: "Greek Olympics" (Week 3)

Join the ancient Games in Athens!
🏛️ Compete in 5 historical challenges
🏆 Earn exclusive "Olympic Champion" title
🪙 Historical Tokens: 500 available

Duration: 7 days remaining

[Enter Event] → Jolt Time
```

**5. Streak Milestone**
```
🔥 STREAK MILESTONE: 30 DAYS!

Congratulations, Time Keeper!
You've been dedicated for a full month!

🏆 Rewards Unlocked:
• +25% XP Bonus (permanent)
• Epic Capsule earned
• "Dedicated" badge added

[Claim Rewards] → Jolt Time
```

**6. Weekend Bonus**
```
🌟 WEEKEND BONUS STARTS IN 14 HOURS!

🏖️ SATURDAY & SUNDAY SPECIALS:
• 2x XP on all activities
• +10% Capsule luck
• -25% Energy costs
• Double fragments!

[Preview Rewards] → Jolt Time
```

**7. Comeback Reward**
```
👋 Welcome Back, Time Keeper!

We missed you! While you were away:
• 7 days of daily rewards saved
• New artifacts discovered

🎁 Welcome Back Chest:
• 7 Daily Capsules
• 500 Chrono Coins
• +50% XP for 24 hours

Your streak bonus (+25% XP) is still intact!

[Claim Welcome Back] → Jolt Time
```

### 7.5 User Control Settings

```
┌─────────────────────────────────────┐
│  🔔 NOTIFICATION SETTINGS           │
├─────────────────────────────────────┤
│                                      │
│  DAILY ENGAGEMENT:                   │
│  [✓] Daily reward reminder           │
│      Time: [08:00 ▼]                │
│                                      │
│  [✓] Weekend bonus alert            │
│                                      │
│  EVENTS:                             │
│  [✓] Event start notifications      │
│  [ ] Event end warnings              │
│                                      │
│  QUIET HOURS:                        │
│  [✓] Enabled                         │
│  From: [22:00] To: [08:00]         │
│                                      │
│  [ SAVE SETTINGS ]                  │
└─────────────────────────────────────┘
```

### 7.6 Anti-Spam Rules

**Hard Limits:**
- Maximum 4 notifications per 24 hours
- Maximum 1 notification per category per 12 hours
- No notification sent before 8:00 AM local
- No notification sent after 10:00 PM local

**Never Send:**
- ❌ Deceptive claims ("You won!")
- ❌ Fear tactics ("Your streak will end!")
- ❌ Multiple repeats of same message
- ❌ Notifications for inactive users (>7 days)

---

## 8. AdsGram Integration

### 8.1 Revenue Model

**AdsGram is the PRIMARY revenue source for Jolt Time.** Players receive in-game rewards for watching ads. The revenue (real money) flows to project development.

**Key Principle:**
> **PROJECT earns from AdsGram. PLAYERS do NOT earn money from AdsGram.**

### 8.2 Player Rewards from Ads

| Ad Type | Time Shards | Chrono Coins | Event Tokens | Energy Bonus |
|---------|-------------|--------------|--------------|--------------|
| Rewarded Video | 2-5 | 25-50 | 10-25 | +20 |
| Daily Bonus Ad | 5-10 | 50-100 | 25-50 | +50 |
| Event Ad | 5-15 | 75-150 | 50-100 | +30 |
| Interstitial | — | — | — | — |

### 8.3 Ad-Based Daily Rewards

**Additional Daily Rewards:**
- Extra Time Shards (2-10 per day via ads)
- Bonus Chrono Coins (up to 100 per day via ads)
- Additional Daily Pack (upgrade Basic → Rare)
- Temporary Boosters (2x XP, 2x Fragments)

### 8.4 AdsGram Rules

1. **Rewarded ads:** Player-initiated, always optional
2. **Maximum 5 rewarded ads per day**
3. **1-hour cooldown between rewarded ads**
4. **Interstitial ads:** At natural breaks only, skippable after 5 seconds
5. **Never required for gameplay progression**
6. **Always provide non-ad alternative**

### 8.5 Daily Mission Integration (Optional)

| Mission | Objective | Reward |
|---------|-----------|--------|
| Watch 1 Ad | View a rewarded ad | 50 XP, 25 Dust |
| Watch 2 Ads | View two rewarded ads | 100 XP, 50 Dust |
| Watch 3 Ads | View three rewarded ads | 175 XP, 100 Dust |

> **Critical Rule:** Ads are ALWAYS optional. Players may complete all missions without watching any ads.

---

## 9. Retention Philosophy

### 9.1 Core Values

**Reward Active Players:**
- Daily login rewards acknowledge consistent engagement
- Streak bonuses scale with dedication
- Monthly objectives celebrate long-term commitment
- Comeback rewards ensure healthy break-taking

**Avoid Addiction Mechanics:**
- No streak loss threats or panic notifications
- No artificial urgency or FOMO manipulation
- No pay-to-continue mechanics
- No energy that blocks gameplay for extended periods

**Avoid Punishment Systems:**
- Streak loss is a soft reset, not a penalty
- Bonus levels are preserved even after breaks
- Return players receive generous welcome packages
- No permanent progression loss

**Encourage Healthy Daily Sessions:**
- Quick session: 5-10 minutes for daily activities
- Medium session: 15-20 minutes for deeper engagement
- Long session: 30+ minutes for extensive play
- All session lengths are valid and rewarded

### 9.2 Session Design Principles

**Quick Session (< 5 min):**
- Collect daily reward
- Open free capsule
- Complete 1-2 daily missions

**Medium Session (5-15 min):**
- All of the above
- Explore an era
- Complete more missions
- Check event progress

**Long Session (15+ min):**
- All of the above
- Deep era exploration
- Collection management
- Social interaction

### 9.3 Retention Metrics Targets

| Metric | Target | Industry Average |
|--------|--------|-----------------|
| D1 Retention | >50% | 35-45% |
| D7 Retention | >25% | 15-20% |
| D30 Retention | >12% | 5-8% |
| Avg Session | >5 min | 3-4 min |
| Sessions/Day | 1.5-2 | 1.2-1.5 |

### 9.4 Anti-Predatory Design Checklist

```
✅ DO:
├── Welcome return messages
├── Catch-up mechanics for absentees
├── Multiple engagement paths
├── Meaningful rewards
├── Player-controlled notifications
└── Positive framing

❌ NEVER:
├── Streak loss threats
├── Artificial urgency
├── FOMO manipulation
├── Pay-to-continue mechanics
├── Energy that blocks for hours
└── Shame messages
```

### 9.5 Healthy Gaming Support

- Session time awareness displayed
- Reminders to take breaks
- No "infinite" gameplay loops
- Quiet hours respected
- Notification fatigue prevention

---

## 10. Weekend Bonus System

### 10.1 Saturday & Sunday Specials

| Bonus | Description |
|-------|-------------|
| Double Capsule Luck | +10% to all capsule drop rates |
| Double XP | All XP gains doubled |
| Reduced Energy Cost | -25% energy for all missions |
| Bonus Fragments | +50% artifact fragments from missions |
| Free Mission Skip | 1 free skip per day (no ad required) |

### 10.2 Weekend Notification

```
┌─────────────────────────────────────┐
│  🌟 WEEKEND BONUS ACTIVE! 🌟        │
│                                      │
│  Sat-Sun Specials:                   │
│  • 2x XP on all activities          │
│  • +10% capsule luck                │
│  • -25% energy costs                │
│  • +50% fragments                   │
│                                      │
│  Enjoy your weekend, Time Keeper!   │
└─────────────────────────────────────┘
```

---

## 11. System Integration

### 11.1 Connected Systems

| System | Connection | Currency Flow |
|--------|------------|---------------|
| Daily Login | Rewards calendar | Chrono Coins, XP, Fragments |
| Streak System | Bonus multiplier | XP bonus, Energy bonus |
| Daily Missions | Objectives | XP, Dust, Energy |
| Weekly Missions | Objectives | XP, Dust, Capsules |
| Monthly Objectives | Long-term goals | XP, Dust, Cosmetics |
| Comeback System | Re-engagement | Capsules, Dust, XP boost |
| Notifications | Re-engagement | Reminders, value messages |
| AdsGram | Revenue + rewards | Time Shards, Coins, Energy |

### 11.2 Reset Timing

- All resets at 00:00 UTC
- Server-side validation
- Client shows local time with UTC reference
- Grace period based on local midnight

### 11.3 Progress Persistence

- Real-time sync with server
- Offline progress calculated on login
- Quest progress saved immediately
- No client-side manipulation possible

---

## 12. Quick Reference

### 12.1 Daily Time Investment

| Activity | Time Required |
|----------|---------------|
| Claim login reward | 30 seconds |
| Open daily capsule | 10 seconds |
| Complete daily missions | 5-10 minutes |
| Total daily time | 6-12 minutes |

### 12.2 Streak Benefits Quick Reference

| Day | XP Bonus | Energy/Day | Capsule |
|-----|----------|------------|---------|
| 1 | +5% | — | — |
| 3 | +10% | +5 | — |
| 7 | +15% | +10 | Weekly |
| 14 | +20% | +15 | Rare |
| 30 | +25% | +20 | Epic |
| 60 | +30% | +25 | Legendary |
| 100 | +40% | +30 | Mythic |

### 12.3 Comeback Reward Quick Reference

| Absence | Bonus Multiplier | Capsule Tier |
|---------|------------------|--------------|
| 1 day | 1x | Normal |
| 2-3 days | 1.5x | Normal |
| 4-7 days | 2x | Free |
| 8-14 days | 2.5x | Rare |
| 15-30 days | 3x | Epic |
| 30+ days | 3x | Legendary |

---

*Every day in Jolt Time should feel like a small celebration. Retention is earned through respect, not manipulation. Give players reasons to return, never excuses to fear loss.*
