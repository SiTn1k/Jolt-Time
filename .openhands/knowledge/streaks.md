# Jolt Time — Streak System

## Overview

The streak system rewards consistent engagement without punishing players for occasional breaks. Missing one day should not completely destroy progression.

---

## Streak Levels

### Milestone Rewards

| Streak Day | Title | Reward Bonus | Special Unlock |
|------------|-------|--------------|---------------|
| 1 | Newcomer | +5% XP | — |
| 3 | Regular | +10% XP, +5 Energy/day | — |
| 7 | Devoted | +15% XP, +10 Energy/day | Weekly Capsule |
| 14 | Loyal | +20% XP, +15 Energy/day | Rare Capsule |
| 30 | Dedicated | +25% XP, +20 Energy/day | Epic Capsule |
| 60 | Committed | +30% XP, +25 Energy/day | Legendary Capsule |
| 100 | Master | +40% XP, +30 Energy/day | Mythic Capsule |

### Streak Benefits Stack

```
Day 1:   +5% XP
Day 3:   +10% XP, +5 Energy/day
Day 7:   +15% XP, +10 Energy/day, Weekly Capsule
Day 14:  +20% XP, +15 Energy/day, Rare Capsule
Day 30:  +25% XP, +20 Energy/day, Epic Capsule
Day 60:  +30% XP, +25 Energy/day, Legendary Capsule
Day 100: +40% XP, +30 Energy/day, Mythic Capsule
```

---

## Streak Protection

### Grace Period

| Streak Length | Grace Period |
|---------------|--------------|
| 0-6 days | 0 hours (streak ends immediately) |
| 7-13 days | 12 hours |
| 14-29 days | 24 hours |
| 30-59 days | 48 hours |
| 60-99 days | 72 hours |
| 100+ days | 96 hours (4 days) |

### Grace Period Display

```
┌─────────────────────────────────────┐
│     🔒 STREAK PROTECTED!            │
│                                     │
│  Your streak of 15 days is safe     │
│  for the next 24 hours.             │
│                                     │
│  Time remaining: 23:45:32           │
└─────────────────────────────────────┘
```

---

## Streak Recovery

### Missed Day Recovery Options

**Option 1: Quick Recovery (Once per 7 days)**
- Complete 3 missions within 24 hours of missing
- Streak restored to previous level
- Recovery streak starts fresh

**Option 2: Temporal Shield (Rare Item)**
- Found in capsules (1% chance)
- Grants 48-hour grace period extension
- Can be stockpiled (max 3)
- Never expires in inventory

**Option 3: Weekend Bonus**
- Playing Saturday-Sunday resets streak counter
- Streak starts fresh but bonuses preserved
- "Weekend Warrior" badge awarded

### Recovery Flow

```
Streak Broken
     │
     ▼
┌─────────────────────────────────────┐
│  Streak Lost                        │
│                                     │
│  Don't worry! Recovery options:      │
│                                     │
│  [Complete 3 Missions - 24h window]  │
│  [Use Temporal Shield]              │
│  [Start Fresh This Weekend]         │
│                                     │
│  Your bonuses are preserved!        │
└─────────────────────────────────────┘
```

---

## Streak Display

### Home Screen Widget

```
┌─────────────────────────────────────┐
│  🔥 STREAK: 23 DAYS                 │
│  ████████████████████░░░ 92%        │
│                                     │
│  Next: Day 30 (+5% XP)              │
│  +25% XP Bonus Active!              │
└─────────────────────────────────────┘
```

### Streak Screen

```
┌─────────────────────────────────────┐
│     🔥 YOUR STREAK                   │
├─────────────────────────────────────┤
│                                     │
│         DAY 23                       │
│     ════════════════                 │
│                                     │
│  Streak Benefits:                   │
│  ✓ +25% XP on all activities        │
│  ✓ +20 Energy/day                   │
│  ✓ Priority support access          │
│  ✓ Exclusive "Loyal" badge          │
│                                     │
│  Next Milestone: Day 30             │
│  Reward: Epic Capsule + +5% XP      │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Protection Status:              ││
│  │ 23 days + 48h grace             ││
│  └─────────────────────────────────┘│
│                                     │
│  Temporal Shields: 2 available      │
│  [Use Shield to extend protection]  │
└─────────────────────────────────────┘
```

---

## Streak Freeze (Temporal Shield)

### Shield Mechanics

- **Drop Rate:** 1% from any capsule
- **Duration:** Extends grace period by 48 hours
- **Inventory:** Max 3 shields stored
- **Use:** Manual activation only
- **Trading:** Cannot be traded or sold

### Shield Notification

```
┌─────────────────────────────────────┐
│  🛡️ TEMPORAL SHIELD ACTIVATED!      │
│                                     │
│  Your streak is now protected      │
│  for an additional 48 hours.        │
│                                     │
│  Remaining shields: 1               │
│                                     │
│  Shield expires: Never (in inventory)│
│  Grace period: +48 hours           │
└─────────────────────────────────────┘
```

---

## Streak Loss Handling

### Compassionate Design

When a streak is lost:

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

### Streak Loss Screen

```
┌─────────────────────────────────────┐
│     STREAK ENDED                     │
│                                     │
│  You played 23 days in a row!       │
│  Amazing dedication, Time Keeper.   │
│                                     │
│  Don't worry — your progress is     │
│  safe and sound.                    │
│                                     │
│  ✓ All artifacts preserved          │
│  ✓ XP bonus level: +25% (kept!)    │
│  ✓ Collection progress: 67%         │
│  ✓ Museum unlocks: 4 halls          │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  START NEW STREAK:                  │
│  Day 1 Bonus: 2x rewards today!     │
│                                     │
│  [ START FRESH ]                    │
└─────────────────────────────────────┘
```

---

## Weekend Streak Reset

### Weekend Warrior Feature

**Activation:** Play on both Saturday and Sunday

**Benefits:**
- Streak counter resets to 0
- All percentage bonuses preserved
- "Weekend Warrior" badge awarded
- No penalty to overall streak bonus level

### Weekend Warrior Badge

```
┌─────────────────────────────────────┐
│  🏆 WEEKEND WARRIOR                 │
│                                     │
│  You played both Saturday AND       │
│  Sunday this weekend!               │
│                                     │
│  Your streak bonus (+25% XP)        │
│  remains intact!                    │
│                                     │
│  Badge added to your collection.   │
└─────────────────────────────────────┘
```

---

## Streak Statistics

### Player Stats Tracked

| Stat | Description |
|------|-------------|
| Current Streak | Days since last miss |
| Longest Streak | All-time record |
| Total Active Days | Days played (including breaks) |
| Streak Survival Rate | % of started streaks that reached 7+ days |
| Recovery Count | Number of streaks recovered |

### Stats Display

```
┌─────────────────────────────────────┐
│     📊 STREAK STATISTICS            │
├─────────────────────────────────────┤
│                                     │
│  Current Streak:      23 days       │
│  Longest Streak:     47 days       │
│  Total Active Days:  156 days      │
│  Streak Survival:    78%           │
│  Recoveries:         3 times       │
│                                     │
│  You've been a Time Keeper for      │
│  over 5 months!                     │
│                                     │
│  [Share Stats] [View History]       │
└─────────────────────────────────────┘
```

---

## Anti-Frustration Measures

### Design Principles

1. **Never Punish Harshly**
   - Streak loss is temporary setback
   - No permanent progression loss
   - Easy recovery options available

2. **Encourage Rather Than Shame**
   - Positive messaging always
   - No "streak at risk" panic notifications
   - Gentle reminders, not ultimatums

3. **Respect Real Life**
   - Long streaks = longer grace periods
   - Vacation mode for extended absences
   - Temporal Shields as safety net

4. **Celebrate Every Milestone**
   - Each streak level feels special
   - Rewards visible and valuable
   - Progress toward next level clear

---

## Technical Implementation

### Streak Tracking

```
streak_data:
  current_streak: 23
  longest_streak: 47
  last_login_date: "2026-06-22"
  streak_bonus_level: 6
  grace_period_end: "2026-06-24T00:00:00Z"
  shields_available: 2
  weekend_warrior_active: false
```

### Login Validation

- Server-side timestamp validation
- UTC-based day calculation
- Timezone-aware grace periods
- No client-side streak manipulation

---

## Balance Guidelines

### Streak Value vs. Effort

| Streak Day | Time Invested | Bonus Value | Fair? |
|------------|---------------|-------------|-------|
| 7 | 1 week | Moderate | ✅ |
| 30 | 1 month | Good | ✅ |
| 60 | 2 months | Great | ✅ |
| 100 | 3+ months | Amazing | ✅ |

### Recovery Balance

- Recovery should be achievable
- Not trivially easy
- Meaningful engagement required
- Worthwhile to maintain streak

---

## Notification Strategy

### Streak Notifications (User-Controlled)

| Notification | Timing | Message |
|--------------|--------|---------|
| Daily Reminder | Configurable | "Your daily reward awaits!" |
| Streak at Risk | Never | Not used — too stressful |
| Streak Lost | After grace | "Start fresh today?" |
| Milestone | On achievement | "23 day streak! Keep going!" |

---

*Streaks should inspire joy, not anxiety. A streak is a celebration of play, not a chain.*
