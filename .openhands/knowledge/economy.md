# Jolt Time — Game Economy

## Overview

The Jolt Time economy is designed to be fair, transparent, and player-friendly. All currencies serve specific purposes and progression feels rewarding without being pay-to-win.

---

## Currencies

### 1. Time Energy

**Type:** Regenerating Resource
**Purpose:** Primary gameplay fuel

| Property | Value |
|----------|-------|
| Max Capacity | 100 (base), up to 200 with bonuses |
| Regeneration Rate | 1 per 6 minutes (10/hour) |
| Visual | Cyan bar with glow effect |

**Usage:**
- Mission attempts: 10-30 per mission
- Era travel: 5-15 per era
- Special actions: Varies by action

**Sources:**
- Natural regeneration
- Daily login bonus (+50 base)
- Streak bonuses
- Collection completion bonuses
- Event rewards
- AdsGram rewarded ads (optional boost)

**Display:**
```
⚡ Time Energy: ████████░░ 80/100
Next +1: 6 minutes
```

---

### 2. Chrono Dust

**Type:** Soft Currency
**Purpose:** Common upgrades and cosmetics

| Property | Value |
|----------|-------|
| Acquisition | Quests, missions, achievements, events |
| Cap | None (no cap) |
| Visual | Purple crystalline dust |

**Usage:**
| Item | Cost |
|------|------|
| Common artifact upgrade | 50 |
| Uncommon artifact upgrade | 100 |
| Rare artifact upgrade | 200 |
| Profile frame | 500 |
| Badge | 300 |
| Title unlock | 1000 |
| Reroll (mission) | 25 |
| Speed up research | 50 |

**Sources:**
| Source | Amount |
|--------|--------|
| Daily quests | 10-50 |
| Mission completion | 5-25 |
| Achievement unlock | 50-200 |
| Daily login | 10-50 |
| Event completion | 100-500 |
| Duplicate artifact | 20-100 |
| Community goal contribution | 50-200 |

---

### 3. Time Shards (Premium)

**Type:** Hard Currency (Premium)
**Purpose:** Exclusive items and acceleration

| Property | Value |
|----------|-------|
| Acquisition | Real money purchase, AdsGram rewards (project only) |
| Spending | Cosmetics, premium track, optional acceleration |
| Visual | Golden glowing shards |

**Usage:**
| Item | Cost |
|------|------|
| Premium cosmetics | 50-200 |
| Season premium track | 100 |
| Optional acceleration | 10-50 |
| Gift to friend | 25 |

**IMPORTANT:** Players cannot earn Time Shards through gameplay. Time Shards are only obtained through:
1. Direct purchase (real money)
2. AdsGram SDK rewards (for the PROJECT, not players)

---

### 4. Experience (XP)

**Type:** Progression Resource
**Purpose:** Player level advancement

| Property | Value |
|----------|-------|
| Source | All gameplay activities |
| Visual | Blue progress bar |
| Level Cap | None (infinite progression) |

**XP Sources:**
| Activity | XP Earned |
|----------|-----------|
| Mission complete | 25-100 |
| Artifact collected | 10-50 |
| Daily quest | 50-100 |
| Achievement | 200-500 |
| Era discovery | 150 |
| Collection milestone | 300-1000 |

**Level Progression:**
```yaml
leveling:
  formula: "base_xp * (level ^ 1.5)"
  base_xp: 100
  
  milestones:
    level_5: "Unlock Daily Missions"
    level_10: "Unlock Egypt"
    level_15: "Unlock Friends"
    level_20: "Unlock Guilds Preview"
    level_30: "Unlock Rome"
    level_50: "Unlock All Eras"
```

---

## Sources of Income

### Income Principles

1. **Consistent Flow** — Daily activities provide steady resources
2. **Meaningful Rewards** — Every source feels worthwhile
3. **Variety** — Multiple ways to earn prevent boredom
4. **Fairness** — No gameplay advantage for spending

### Income Sources

#### Daily Rewards
```
Daily Login:
├── Day 1: 50 XP, 10 Chrono Dust
├── Day 3: 100 XP, 25 Chrono Dust, Free Capsule
├── Day 7: 250 XP, 50 Dust, Rare Capsule
└── Streak Bonus: +10% XP per 7 days

Daily Quests (Example):
├── Complete 3 missions: 75 XP, 15 Dust
├── Collect artifacts: 50 XP, 25 Dust
├── Visit era: 40 XP, 10 Dust
└── Watch optional ad: 50 XP, 25 Dust
```

#### Quest Completion
| Quest Type | XP | Chrono Dust | Other |
|------------|-----|-------------|-------|
| Daily | 30-100 | 10-50 | Capsules |
| Weekly | 300-750 | 150-300 | Rare Capsules |
| Season | 1000-5000 | 500-1000 | Cosmetics |
| Historical | 500-1000 | 200-500 | Badges/Frames |

#### Mission Rewards
| Mission Type | Base XP | Base Dust | Fragments |
|--------------|---------|----------|-----------|
| Easy | 25 | 10 | 1-2 |
| Medium | 50 | 25 | 2-4 |
| Hard | 100 | 50 | 4-6 |
| Epic | 200 | 100 | 8-10 |

#### Achievement Rewards
| Achievement Tier | XP | Dust | Special |
|------------------|-----|------|---------|
| Beginner | 100 | 50 | Badge |
| Intermediate | 250 | 150 | Frame |
| Advanced | 500 | 300 | Title |
| Master | 1000 | 500 | Aura |

#### Event Rewards
| Event Type | Duration | Rewards Available |
|------------|----------|-------------------|
| Weekend | 48h | 2x XP, +10% luck |
| Historical | 7 days | Cosmetics, badges |
| Seasonal | 14 days | Exclusive items |
| Community | 3-7 days | Shared pool |

---

## Resource Sinks

### Sink Principles

1. **Clear Value** — Spending feels rewarding
2. **Meaningful Choices** — No wasteful spending
3. **Optional** — Never required for progression
4. **Fair Pricing** — Easy to understand

### Sink Categories

#### Artifact Upgrades
```
Common Artifact:
├── Level 1→2: 50 Dust, +2 Power
├── Level 2→3: 75 Dust, +2 Power
├── Level 3→4: 100 Dust, +3 Power
└── Level 4→5: 150 Dust, +3 Power

Uncommon Artifact:
├── Level 1→2: 100 Dust, +3 Power
├── Level 2→3: 150 Dust, +3 Power
├── Level 3→4: 200 Dust, +4 Power
└── Level 4→5: 300 Dust, +4 Power

Rare Artifact:
├── Level 1→2: 200 Dust, +4 Power
├── Level 2→3: 300 Dust, +4 Power
├── Level 3→4: 400 Dust, +5 Power
└── Level 4→5: 500 Dust, +5 Power
```

#### Rerolls
| Reroll Type | Cost | Effect |
|-------------|------|--------|
| Mission reroll | 25 Dust | New mission objectives |
| Fragment reroll | 15 Dust | Different fragment location |
| Daily quest swap | FREE (or 50 Dust for premium) | New quest selection |

#### Timers
| Timer Type | Normal Duration | Speed Up Cost |
|------------|----------------|---------------|
| Research complete | 1-8 hours | 10-50 Dust |
| Energy full | ~10 hours | Cannot skip |
| Event unlock | Event duration | Cannot skip |

#### Cosmetics
| Category | Item | Cost |
|----------|------|------|
| Frames | Era frames | 300-500 Dust |
| Frames | Special frames | 50-100 Shards |
| Badges | Achievement badges | 100-300 Dust |
| Titles | Rare titles | 500-1000 Dust |
| Auras | Common auras | 200 Dust |
| Auras | Epic auras | 50 Shards |
| Artifacts | Skins | 30-80 Shards |

---

## Economy Rules

### Core Rules

#### 1. No Pay-to-Win
```
ALLOWED:
✓ Purchasing cosmetics
✓ Purchasing convenience (cosmetic-only)
✓ Supporting the project

NEVER ALLOWED:
✗ Buying Time Energy
✗ Buying fragments
✗ Buying artifacts
✗ Buying mission completions
✗ Buying era unlocks
✗ Any gameplay advantage
```

#### 2. Fair Progression
```
PROGRESSION MUST BE:
✓ Achieved through gameplay
✓ Available to all players
✓ Time-based (not money-based)
✓ Skill-rewarding
✓ Consistent and predictable

PROGRESSION MUST NEVER BE:
✗ Blocked by paywalls
✗ Frustratingly slow without payment
✗ Randomized gambling for power
✗ Time-gated excessively
```

#### 3. Premium Only Accelerates
```
PREMIUM (Time Shards) CAN:
✓ Speed up cosmetic waits
✓ Unlock extra cosmetic slots
✓ Purchase exclusive cosmetics
✓ Support the project directly

PREMIUM CANNOT:
✗ Grant gameplay power
✗ Skip gameplay requirements
✗ Provide any advantage in missions
✗ Give exclusive fragments
```

---

## Economy Balance

### Income vs. Sink Balance

**Daily Player (Casual):**
```
Income:
- Daily login: ~100 XP, 50 Dust
- 3 missions: ~150 XP, 75 Dust
- Daily quest: ~100 XP, 50 Dust
- Total: ~350 XP, ~175 Dust

Sink Usage:
- 1 artifact upgrade: ~100 Dust
- Rerolls: ~50 Dust
- Save for cosmetics: ~25 Dust
```

**Weekly Player (Regular):**
```
Income:
- 7 daily logins: ~700 XP, 350 Dust
- 15 missions: ~750 XP, 375 Dust
- Weekly quest: ~400 XP, 200 Dust
- Total: ~1850 XP, ~925 Dust

Sink Usage:
- Artifact upgrades: ~500 Dust
- Cosmetics savings: ~400 Dust
```

**Seasonal Player (Active):**
```
Income:
- 56 daily logins: ~5600 XP, 2800 Dust
- 100 missions: ~5000 XP, 2500 Dust
- Season quests: ~3000 XP, 1000 Dust
- Events: ~2000 XP, 1000 Dust
- Total: ~15,600 XP, ~7300 Dust

Sink Usage:
- Multiple artifact upgrades: ~3000 Dust
- Premium cosmetic: ~500 Dust
- Season pass: 100 Shards (optional)
```

---

### Economy Health Metrics

| Metric | Target | Warning |
|--------|--------|---------|
| Dust circulation | Positive for F2P | Negative = inflation |
| Energy regeneration | Satisfies gameplay | Too slow = frustration |
| Progression rate | 1 level/week casual | Stalled = churn |
| Cosmetic availability | 1 affordable/week | Too rare = demotivation |

---

## Premium vs. Free Balance

### Free Player Experience
```
EVERYTHING ACCESSIBLE:
✓ All eras
✓ All artifacts
✓ All missions
✓ All quests
✓ All achievements
✓ Competitive gameplay

LIMITED BUT FAIR:
- Cosmetic selection (smaller pool)
- Progression pace (moderate)
- Session length (unlimited play, energy gates)
```

### Paying Player Experience
```
ADDITIONAL ONLY:
+ More cosmetic options
+ Slightly faster progression
+ Premium cosmetics
+ Convenience features
+ Supporting the project

NOTHING GAMEPLAY:
- No power advantages
- No content access
- No competitive edge
```

---

## Anti-Inflation Measures

### Dust Cap (Optional)
- Maximum 50,000 Dust in wallet
- Excess converts to "Dust Overflow" (cosmetic only)
- Prevents extreme wealth accumulation

### Sink Adjustment
- Monitor economy health monthly
- Adjust costs based on player feedback
- Add new sinks when player wealth increases
- Limited-time sinks during events

---

## Technical Implementation

### Currency Data Structure
```yaml
player_currencies:
  user_id: "123456789"
  
  time_energy:
    current: 80
    max: 100
    last_updated: "2026-06-23T15:00:00Z"
    
  chrono_dust:
    balance: 2450
    lifetime_earned: 15000
    
  time_shards:
    balance: 0
    lifetime_purchased: 0
    
  experience:
    current_xp: 4500
    level: 12
```

### Transaction Log
```yaml
transaction:
  id: "txn_123456"
  user_id: "123456789"
  type: "earn" | "spend"
  currency: "chrono_dust"
  amount: 50
  source: "mission_complete"
  timestamp: "2026-06-23T15:00:00Z"
```

---

## Economy Design Checklist

- [ ] All currencies have clear purpose
- [ ] Income sources are varied and rewarding
- [ ] Sinks are meaningful and valuable
- [ ] No pay-to-win mechanics exist
- [ ] Free players can progress steadily
- [ ] Premium offers convenience, not power
- [ ] Economy is monitored and balanced
- [ ] Players understand the economy

---

*An honest economy builds trust. Trust builds retention.*
