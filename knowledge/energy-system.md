# Energy and Daily Reward System

## Overview

The energy system regulates player pacing and engagement by limiting how many battles can be fought per session. The daily reward system provides consistent value accumulation and reinforces daily return habits. Together, these systems create sustainable player progression without feeling restrictive or pay-to-win.

---

## 1. Energy System

### Core Mechanics

Energy is the primary gate for gameplay actions. Players must manage their energy pool strategically to maximize progression.

### Energy Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Maximum Energy | 100 | Base starting cap |
| Regeneration Rate | 1 per 3 minutes | 20 per hour |
| Offline Regeneration | Yes | Caps at maximum |
| Energy Overflow | No | Cannot exceed maximum |
| Minimum to Start Battle | 10 | Cannot battle with less |

### Energy Display

```
┌─────────────────────────────────────────┐
│  ⚡ 75 / 100    [████████████░░░░░] 75%  │
│  Full in: 1h 15m                        │
└─────────────────────────────────────────┘
```

### Energy Consumption

| Action | Energy Cost | Notes |
|--------|-------------|-------|
| PvP Battle | 15 | Competitive mode |
| Story Battle (Easy) | 5 | Early game content |
| Story Battle (Medium) | 10 | Mid-game content |
| Story Battle (Hard) | 15 | Late-game content |
| Story Battle (Legend) | 20 | End-game content |
| Event Battle | 10 | Special events |
| Boss Battle | 25 | High-value targets |

### Offline Regeneration

- Energy regenerates while player is offline
- Maximum offline regeneration: Full cap (100)
- Rate matches active regeneration: 1 per 3 minutes
- No penalty for being offline
- Cap enforcement on return

### Energy Cap Behavior

- Energy cannot exceed maximum under any circumstance
- When at cap, regeneration pauses (no waste)
- Visual indicator shows "FULL" status
- Push notification at 100%: "Your energy is full!"

---

## 2. Energy Restoration Sources

### Passive Regeneration

**Active Play:**
- 1 energy every 3 minutes
- Consistent regardless of activity
- Timer visible in UI

**Offline Play:**
- Same rate applies
- Calculated on return
- Immediate visual feedback

### Daily Rewards

Energy restoration included in daily calendar:

| Day | Energy Restored |
|-----|-----------------|
| Day 4 | +20 max energy cap (permanent) |
| Day 11 | +30 energy |
| Day 18 | +30 energy |
| Day 25 | +30 energy |
| Day 30 | +50 energy |

### Achievement Rewards

One-time bonuses for milestones:

| Achievement | Energy Bonus |
|-------------|--------------|
| First Battle | 10 energy |
| 10 Battles | 20 energy |
| 50 Battles | 30 energy |
| 100 Battles | 50 energy |
| 500 Battles | 100 energy |

### Event Rewards

- Event currencies may include energy refills
- Special events: "Double energy weekend"
- Login bonuses during events include energy

### Premium Rewards

- Premium subscription: +50 max energy (permanent)
- Premium daily login: 2x energy restoration
- Optional: Energy tank upgrade (cosmetic +50 cap)

### AdsGram Integration (Optional)

**IMPORTANT:** AdsGram is the PRIMARY monetization source, but energy bonuses from ads are ALWAYS OPTIONAL.

| Ad Type | Energy Reward | Obligation |
|---------|---------------|------------|
| Rewarded Video | +20 energy | Never required |
| Daily Bonus Ad | +50% daily reward | Optional upgrade |
| Energy Refill Ad | Full energy restore | Can wait for regen |

**Ad Rules:**
- Never force ads to progress
- Always allow natural regeneration
- Ads feel like bonus, not requirement
- Maximum 1 energy ad per session
- Never auto-play unskippable ads

---

## 3. Daily Reward System

### 30-Day Reward Calendar

The daily reward calendar provides escalating rewards to reinforce daily engagement.

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY REWARDS                                │
│                 Day 1 of 30                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│   [1]  [2]  [3]  [4]  [5]  [6]  [7]                             │
│   ✓   ✓   ✓   ✓   ✓   ✓   ✓                                      │
│                                                                 │
│   [8]  [9]  [10] [11] [12] [13] [14]                            │
│   ✓   ✓   ✓   ✓   ✓   ✓   ✓                                      │
│                                                                 │
│   [15] [16] [17] [18] [19] [20] [21]                            │
│   ✓   ✓   ✓   ✓   ✓   ✓   ✓                                      │
│                                                                 │
│   [22] [23] [24] [25] [26] [27] [28]                            │
│   ✓   ✓   ✓   ✓   ✓   ✓   ✓                                      │
│                                                                 │
│   [29] [30]                                                     │
│   ✓   ✓                                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Today's Reward: 75 Coins + 15 XP + 3 Fragments        │   │
│  │                                                         │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  70% to next reward         │   │
│  │                                                         │   │
│  │              [ CLAIM REWARD ]                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Streak: 🔥 7 days    Bonus: +20%                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Reward Table

| Day | Coins | XP | Energy | Fragments | Premium | Special |
|-----|-------|-----|--------|-----------|---------|---------|
| 1 | 50 | 10 | — | — | — | — |
| 2 | — | — | 20 | — | — | — |
| 3 | — | — | — | 3 | — | — |
| 4 | — | 15 | — | — | — | +20 max energy cap |
| 5 | 75 | 20 | — | — | — | — |
| 6 | — | — | 30 | — | — | — |
| 7 | 100 | 25 | — | 5 | — | **Rare Pack** |
| 8 | — | — | — | — | — | — |
| 9 | 100 | 30 | — | — | — | — |
| 10 | — | — | 40 | — | — | — |
| 11 | — | 35 | — | 5 | — | — |
| 12 | 125 | — | — | — | — | — |
| 13 | — | — | — | 8 | — | — |
| 14 | 150 | 40 | — | — | — | — |
| 15 | — | — | 50 | — | — | +50 max energy cap |
| 16 | — | — | — | 10 | — | — |
| 17 | 175 | 45 | — | — | — | — |
| 18 | — | — | — | — | 5 | — |
| 19 | 200 | 50 | — | — | — | — |
| 20 | — | — | 60 | 10 | — | — |
| 21 | 225 | 55 | — | — | — | **Epic Pack** |
| 22 | — | — | — | 12 | — | — |
| 23 | 250 | 60 | — | — | — | — |
| 24 | — | — | 70 | — | — | — |
| 25 | — | — | — | 15 | — | +100 max energy cap |
| 26 | 275 | 65 | — | — | — | — |
| 27 | — | — | — | — | 10 | — |
| 28 | 300 | 70 | 80 | — | — | — |
| 29 | — | — | — | 20 | — | — |
| 30 | 500 | 100 | — | 50 | 25 | **Legendary Pack** |

### Calendar Reset Rules

- Calendar resets on Day 30 completion
- Player returns to Day 1 with streak bonus
- Progress cannot be skipped
- Each day requires login to claim

---

## 4. Daily Streak System

### Streak Counter

Tracks consecutive days of player activity.

**Definition of "Day":**
- Any game action within 24-hour period
- Measured from player's local midnight
- Requires minimum 1-minute play time

### Streak Mechanics

| Day | Streak Bonus | Bonus Reward |
|-----|--------------|--------------|
| 1 | 1.0x | None |
| 2 | 1.05x | +10 coins |
| 3 | 1.1x | +25 coins |
| 5 | 1.15x | +50 coins, 5 fragments |
| 7 | 1.2x | +100 coins, rare fragment |
| 14 | 1.25x | +200 coins, epic fragment |
| 30 | 1.3x | +500 coins, legendary fragment |
| 60 | 1.35x | +750 coins, exclusive badge |
| 100 | 1.5x | +1000 coins, mythic artifact |

**Streak Bonus Formula:**
```
Final Reward = Base Reward × Streak Multiplier + Bonus Reward
```

### Missed Day Logic

**When Player Misses a Day:**

| Time Since Last Login | Outcome |
|----------------------|---------|
| < 24 hours | Streak intact |
| 24–48 hours | Streak warning sent |
| > 48 hours | Streak resets to 0 |

**Grace Period:**
- 24-hour grace after missed day
- Player can recover streak once per month (free)
- Additional recoveries cost premium currency

### Recovery Mechanics

**Free Monthly Recovery:**
- Automatic once per calendar month
- Activated by playing within 24 hours of miss
- Notification: "Welcome back! Your streak was saved."

**Premium Recovery:**
- Cost: 10 premium currency
- Available up to 48 hours after miss
- Restores streak to previous value
- One recovery per miss maximum

---

## 5. Welcome Rewards (Day 1-7 Onboarding)

### Onboarding Reward Calendar

The first 7 days provide accelerated rewards to new players.

| Day | Reward | Purpose |
|-----|--------|---------|
| 1 | 200 Coins + 50 Energy | Start playing immediately |
| 2 | 3 Common Fragments + 25 XP | Introduce collection |
| 3 | 1 Common Artifact + 30 Energy | First artifact reward |
| 4 | 100 Coins + 10 XP | Momentum building |
| 5 | 5 Common Fragments + 50 Energy | Fragment focus |
| 6 | 150 Coins + 40 XP | Coin accumulation |
| 7 | 1 Rare Artifact + 75 Energy | First rare item, celebration |

### Onboarding Goals

1. **Immediate Engagement:** Play within first session
2. **Core Loop Mastery:** Understand collection and battles
3. **First Artifact:** Experience artifact acquisition
4. **Momentum Building:** Return for Day 2, 3, 7
5. **Celebration:** First rare item creates excitement

### Onboarding Notifications

| Day | Notification | Timing |
|-----|--------------|--------|
| Day 1 | "Welcome to Jolt Time! Claim your starter reward!" | Signup |
| Day 2 | "Day 2 reward ready! You got this." | 24h later |
| Day 3 | "Your first artifact awaits!" | 48h later |
| Day 7 | "Complete your first week for a Rare artifact!" | 6 days later |

### Onboarding Retention Targets

| Metric | Target |
|--------|--------|
| Day 1 retention | >80% |
| Day 3 retention | >60% |
| Day 7 retention | >40% |

---

## 6. Reward Categories

### Currency Rewards

| Category | Icon | Acquisition | Usage |
|----------|------|-------------|-------|
| Coins | 🪙 | Battles, quests, daily | Artifacts, upgrades, cosmetics |
| Energy | ⚡ | Regeneration, rewards | Battle entry |
| XP | 📊 | Battles, quests, collection | Player level |
| Premium | ⭐ | Rare rewards, purchases | Premium items, recovery |
| Event Tokens | 🎫 | Event participation | Event rewards |

### Fragment Rewards

| Fragment Type | Drop Source | Usage |
|---------------|-------------|-------|
| Common | Duplicates, easy quests | Level 1-3 upgrades |
| Rare | Medium quests, achievements | Level 4-6 upgrades |
| Epic | Hard quests, events | Level 7-9 upgrades |
| Legendary | Legendary quests, completion | Level 10 upgrades |
| Mythic | Rare events, milestones | Special upgrades |

### Non-Currency Rewards

| Reward | Description | Rarity |
|--------|-------------|--------|
| Common Pack | 1-3 common artifacts | Common |
| Rare Pack | 1 rare artifact + commons | Uncommon |
| Epic Pack | 1 epic artifact + rares | Rare |
| Legendary Pack | 1 legendary artifact + epics | Epic |
| Energy Cap Up | Permanent +20 max energy | Uncommon |
| Badge | Profile display | Variable |
| Frame | Profile picture frame | Rare |

---

## 7. UI Behavior

### Daily Reward Screen

**Layout:**
```
┌─────────────────────────────────────────┐
│  ← Back              DAILY REWARDS      │
│  ─────────────────────────────────────  │
│                                         │
│  Calendar View (4 weeks visible)        │
│  Today: Day 15 of 30                    │
│                                         │
│  [1]  [2]  [3]  [4]  [5]  [6]  [7]     │
│   ✓    ✓    ✓    ✓    ✓    ✓    ✓       │
│                                         │
│  [8]  [9]  [10] [11] [12] [13] [14]    │
│   ✓    ✓    ✓    ✓    ✓    ✓    ✓       │
│                                         │
│  [15] [16] [17] [18] [19] [20] [21]    │
│   ✓    ✓    ✓   TODAY   🔒    🔒        │
│                                         │
│  [22] [23] [24] [25] [26] [27] [28]    │
│   🔒   🔒   🔒    🔒    🔒    🔒    🔒   │
│                                         │
│  [29] [30]                              │
│   🔒    🔒                              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Day 15 Reward                   │   │
│  │  ──────────────────────────────  │   │
│  │  🪙 +50 Max Energy Cap (PERM)   │   │
│  │                                 │   │
│  │  Reward Preview:                │   │
│  │  ⚡ +50 Energy                  │   │
│  │                                 │   │
│  │         [ CLAIM ]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔥 Streak: 15 days    Bonus: +25%     │
│                                         │
└─────────────────────────────────────────┘
```

### Card States

**Claimed State (Previous Days):**
- Checkmark overlay
- Reward amount shown
- Muted colors
- Not interactive

**Available State (Today):**
- Pulsing border animation
- Full color display
- Claim button active
- Reward preview prominent

**Locked State (Future Days):**
- Grayscale appearance
- Lock icon overlay
- Reward hidden until reached
- Cannot interact

### Claim Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | Blue gradient, enabled | Tap to claim |
| Loading | Spinner animation | Processing claim |
| Claimed | Gray with checkmark | Already received |
| Locked | Gray, disabled | Not yet available |

### Animation Ideas

**Claim Animation Sequence:**
1. Button press compression (100ms)
2. Reward icons fly out of card (200ms)
3. Particle burst at destination (300ms)
4. Checkmark appears on calendar (100ms)
5. Streak counter increments (200ms)
6. Success sound plays

**Calendar Transition:**
- Week scroll with smooth slide
- New week fades in from right
- Locked days animate to available state

**Streak Animation:**
- Fire icon flames on streak milestones
- Counter number rolls up
- Bonus multiplier pulses

---

## 8. Push Notifications

### Notification Schedule

| Notification | Time | Trigger |
|--------------|------|---------|
| Daily Reward | 9:00 AM local | New day begins |
| Energy Full | 10:00 AM local | When energy reaches 100 |
| Streak Warning | 10:00 PM local | If no activity today |
| Weekly Reset | Monday 8:00 AM | New week, new rewards |

### Notification Messages

**Daily Reward:**
"Your daily reward is ready! Tap to claim your bonus."

**Energy Full:**
"Your energy is full! Ready for some battles?"

**Streak Warning:**
"Don't lose your 🔥7-day streak! Play for just 1 minute."

**Weekly Reset:**
"New week, new rewards! Check out your fresh quest list."

### Notification Rules

1. **Maximum 4 per day** — Never exceed this under any circumstance
2. **Respect preferences** — Immediate opt-out on request
3. **Local time zones** — Send at appropriate local hours
4. **Value messaging** — Always mention benefit to player
5. **Clear CTA** — Direct action, not vague reminders

---

## 9. Future Support

### VIP Reward Tracks

**VIP Tiers:**
- Free: Basic daily rewards
- Bronze ($2.99/mo): Enhanced daily + streak protection
- Silver ($5.99/mo): Double energy cap + faster regen
- Gold ($9.99/mo): All previous + exclusive VIP calendar

**VIP Daily Calendar (Example):**
| Day | Bronze | Silver | Gold |
|-----|--------|--------|------|
| 1 | +10% coins | +20% coins | +30% coins + 1 fragment |
| 7 | Rare pack | Epic pack | Legendary pack |
| 30 | Epic pack | Legendary pack | Mythic + Legendary |

### Seasonal Calendars

**Quarterly Themes:**
- Spring: Growth and new beginnings
- Summer: Adventure and exploration
- Autumn: Harvest and collection
- Winter: Reflection and celebration

**Seasonal Rewards:**
- Themed cosmetics
- Seasonal artifacts
- Exclusive frames and badges
- Bonus multipliers

### Special Holidays

**Holiday Events:**
- New Year's Day: +300% rewards
- Anniversary (launch date): Legendary rewards
- Halloween: Spooky artifacts
- Summer Solstice: Extended play bonuses

**Holiday Calendar:**
- 7-day special calendar during holidays
- Free premium currency on major holidays
- Exclusive limited-time artifacts

### Anniversary Rewards

**Year 1 Anniversary:**
- Day 1: Mythic artifact
- Day 7: Legendary artifact
- Day 30: Exclusive anniversary badge + aura

---

## 10. System Integration

### Connected Systems

**Quest System:**
- Daily quests reward coins, fragments, XP
- Achievement quests grant permanent bonuses
- Event quests provide special currencies

**Battle System:**
- Energy cost for all battles
- Win rewards scale with difficulty
- Streak bonus applies to battle rewards

**Artifact Progression:**
- Fragments from rewards upgrade artifacts
- Energy enables artifact-granting battles
- Daily rewards include artifact packs

### Economy Flow

```
Passive Regen ─────┐
                  │
Daily Rewards ────┼──→ Energy ──→ Battle ──→ Rewards ──→ Progression
                  │                              │
Achievements ─────┤                              ↓
                  │                       Coins/Fragments/XP
Event Rewards ────┤                              │
                  │                              ↓
Premium ──────────┘                       Artifact Upgrades
```

---

## 11. Economy Balance Rules

### Core Principles

1. **No Pay-to-Win:** All content achievable through gameplay
2. **Ads Are Bonus:** Never required for progression
3. **Fair Value:** Time investment matches rewards
4. **Sustainable:** Economy supports long-term play
5. **Transparent:** No hidden mechanics or inflation

### Energy Economy

| Metric | Target | Action if Off |
|--------|--------|---------------|
| Avg battles per session | 8-12 | Adjust energy cost |
| Energy waste at cap | <5% | Adjust regen rate |
| Offline catch-up | 2-4 hours | Adjust offline cap |

### Reward Economy

| Metric | Target | Action if Off |
|--------|--------|---------------|
| Daily coin accumulation | 200-400 | Adjust quest rewards |
| Fragment acquisition | 15-30/day | Adjust duplicate rates |
| Premium currency leak | <5% | Monitor economy health |

---

*Document Version: 1.0*  
*Last Updated: 2025-01-15*