# PvP Arena and Ranked League System

## Overview

The PvP Arena brings competitive gameplay to Jolt Time, offering players the opportunity to test their skills, strategies, and artifact collections against others. The PvP system is designed to reward skill and progression while remaining accessible to casual players and completely free from pay-to-win mechanics. All competitive advantages come from player skill, knowledge, and time invested—not from purchases.

---

## 1. PvP Modes

### Casual Arena

**Purpose:** Relaxed competitive environment for practice and fun.

**Characteristics:**
- No ranking consequences for losses
- Matchmaking prioritizes quick finds
- All skill levels welcome
- Practice new strategies risk-free

**Rules:**
- Best of 1 match format
- 3-minute rounds
- Same rules as Ranked
- Rewards smaller than Ranked

**When to Play:**
- Learning the game
- Testing new artifact builds
- Quick matches between other activities
- Warming up before Ranked

---

### Ranked Arena

**Purpose:** Competitive ranked matches with progression.

**Characteristics:**
- Affects player ranking and league
- Competitive matchmaking
- Rewards based on performance
- League progression system

**Rules:**
- Best of 3 match format
- 3-minute rounds per match
- Standard competitive rules
- Full rewards for victory

**Match Structure:**
```
Match Start → Draft Phase (30 sec) → Battle Phase → Victory/Defeat
                                      ↓
                              Round 2 (if needed)
                                      ↓
                              Round 3 (if needed)
```

---

### Seasonal Competitions

**Purpose:** Special competitive events during seasons.

**Characteristics:**
- Limited-time competitive formats
- Unique rewards only available during event
- Different rules than standard PvP
- Community-wide participation

**Competition Types:**
- **Weekly Tournaments:** Every week, top performers win prizes
- **Season Finals:** End-of-season championship
- **Holiday Specials:** Themed competitions with unique rules

---

### Practice Mode (Future Feature)

**Concept:** Offline practice against AI opponents.

**Features:**
- Play against AI at various difficulties
- No rewards, no penalties
- Test new strategies safely
- Learn opponent patterns

**Requirements:**
- AI development investment
- Difficulty scaling system
- No reward infrastructure needed

---

## 2. League Structure

### League Tiers

The ranking system uses seven league tiers, each with three divisions:

| League | Divisions | Points to Enter | Points per Win | Points per Loss |
|--------|----------|-----------------|----------------|-----------------|
| Bronze | I, II, III | 0 | +25 | -15 |
| Silver | I, II, III | 1000 | +22 | -15 |
| Gold | I, II, III | 2000 | +20 | -15 |
| Platinum | I, II, III | 3500 | +18 | -15 |
| Diamond | I, II, III | 5000 | +15 | -15 |
| Master | I, II, III | 7000 | +12 | -15 |
| Chrono Legend | — | 10000 | +10 | -10 |

### Division Movement

**Promotion:**
- Reach 1250 points for Bronze II
- Reach 1500 points for Bronze III
- Continue up to 10000 for Chrono Legend

**Demotion Protection:**
- Cannot drop below 800 points within a division
- Cannot drop below division minimum
- Demotion only occurs after extended losses

### League Rewards

**Per-Division Rewards (One-Time):**

| First Reaching | Reward |
|----------------|--------|
| Bronze | 100 Coins, Bronze Badge |
| Silver | 200 Coins, Silver Badge |
| Gold | 300 Coins, Gold Badge |
| Platinum | 500 Coins, Platinum Badge |
| Diamond | 750 Coins, Diamond Badge |
| Master | 1000 Coins, Master Badge |
| Chrono Legend | 2000 Coins, Legend Badge |

### Visual Representation

```
┌─────────────────────────────────────┐
│  ⚔️ RANKED ARENA                   │
├─────────────────────────────────────┤
│                                     │
│  🏆 CURRENT RANK                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ⭐⭐⭐ DIAMOND I ⭐⭐⭐    │   │
│  │         ★★★★★              │   │
│  │        4,850 pts           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Next League: Diamond II (5000 pts) │
│                                     │
│  Season Ends: 23 days               │
│                                     │
│  [  FIND MATCH  ]                  │
│  [  CASUAL     ]                   │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Matchmaking Philosophy

### Core Principles

**Fair Matches:**
- Players matched against similar skill levels
- Matchmaking considers current league
- Wait times balanced against match quality
- No stomping (rarely matched vs far lower)

**Skill Over Spending:**
- Artifact power is one factor, not dominant
- Player skill and strategy matter more
- Newer players can beat veterans
- Experience beats collection in close fights

### Matchmaking Factors

**Primary Factors:**
1. **Current Rank Points** — Main matchmaking metric
2. **Recent Performance** — Last 10 matches weighted
3. **Win Rate** — Overall skill indicator

**Secondary Factors:**
4. **Total Games Played** — Experience level
5. **Artifact Power Average** — Collection strength
6. **Time of Day** — Server load balancing

**Tertiary Factors:**
7. **Regional Latency** — Connection quality
8. **Party Size** — Solo vs team matching

### Matchmaking Process

```
Player Requests Match
        │
        ↓
Find Opponents (30 sec timeout)
        │
        ├── No Match Found
        │       ↓
        │   Expand Search ±500 pts
        │       ↓
        │   Expand Search ±1000 pts
        │       ↓
        │   Match with anyone available
        │
        └── Match Found
                ↓
        Validate Match Quality
                │
                ├── Quality OK → Start Match
                │
                └── Quality Poor → Re-evaluate
                        ↓
                Adjust and Retry
```

### Anti-Smurfing Measures

**Protecting New Players:**
- New accounts start in Bronze only
- Cannot party with high-ranked players
- Fast-track promotion prevents low-level farming
- Report system for suspected smurfs

---

## 4. Seasonal Rankings

### Season Structure

**Season Duration:** 10 weeks (aligned with Battle Pass)

**Season Reset:**
- Rankings reset to next tier down
- Top 100 players get placement matches
- Others start at Bronze I
- Points converted to season tokens

### Season Rewards

**Placement Rewards:**

| Final Rank | Season Tokens | Additional Rewards |
|------------|---------------|-------------------|
| Chrono Legend | 5000 | Legendary Badge, Frame |
| Master | 3000 | Master Badge, Frame |
| Diamond | 2000 | Diamond Badge |
| Platinum | 1500 | Platinum Badge |
| Gold | 1000 | Gold Badge |
| Silver | 750 | Silver Badge |
| Bronze | 500 | Bronze Badge |

**Season Token Uses:**
- Exclusive season cosmetics
- Legacy frame upgrades
- Past season exclusive items

### End-of-Season Timeline

```
Week 9, Day 5: Season Warning
Week 9, Day 6: Final Matches Bonus XP
Week 9, Day 7: Season Ends, Rankings Finalized
Week 10, Day 1: New Season Begins
Week 10, Day 1-3: Placement Matches
Week 10, Day 4+: Normal Play Resumes
```

---

## 5. PvP Rewards

### Victory Rewards

**Ranked Match Victory:**
| Result | Coins | XP | Tokens |
|--------|-------|-----|--------|
| Victory | 150 | 100 | 10 |
| Defeat | 50 | 25 | 3 |
| Win Streak (3+) | +50 bonus | +25 bonus | +5 bonus |

**Daily Cap:** 10 matches per day for full rewards

### Weekly Rewards

**Participate (3+ matches):**
- 100 Bonus Coins
- 1 Rare Fragment

**Win 20+ Matches:**
- 300 Bonus Coins
- 3 Rare Fragments

### Season Rewards

**Cosmetic Rewards:**
| League | Badge | Frame | Title |
|--------|-------|-------|-------|
| Chrono Legend | ✓ | ✓ | "Chrono Legend" |
| Master | ✓ | ✓ | "Arena Master" |
| Diamond | ✓ | — | — |
| Platinum | ✓ | — | — |
| Gold | ✓ | — | — |
| Silver | ✓ | — | — |
| Bronze | ✓ | — | — |

### Competitive Rewards (Cosmetic Only)

**Weekly Tournament Rewards:**
| Placement | Rewards |
|-----------|---------|
| 1st | Legendary Badge + 500 Coins |
| 2nd-5th | Epic Badge + 250 Coins |
| 6th-20th | Rare Badge + 100 Coins |
| All Participants | Badge + 50 Coins |

---

## 6. PvP Statistics

### Personal Statistics

**Career Stats:**
- Total Matches Played
- Total Victories
- Total Defeats
- Overall Win Rate
- Current Win Streak
- Longest Win Streak

**League Stats:**
- Highest League Reached
- Current Points
- Points This Season
- Best Season Finish
- Total Seasons Played

**Performance Stats:**
- Average Match Time
- Average Power Level
- Most Used Artifact
- Win Rate by Era
- Favorite Battle Type

### Match History

**Recent Matches (Last 20):**
- Opponent name and rank
- Victory/Defeat
- Score (rounds won)
- Date and time
- Artifact power comparison

### Leaderboards

**Global Rankings:**
- Top 100 Players
- Rank by Win Rate
- Rank by Win Streak
- Rank by Season Points
- Weekly Tournament Results

---

## 7. Casual Player Philosophy

### Accessibility Principles

**Time-Respectful:**
- Quick matches (10-15 minutes)
- No mandatory daily play
- Rewards based on participation
- No penalty for taking breaks

**Pressure-Free:**
- Casual mode has no consequences
- Demotion protected within divisions
- No shame for losses
- Encouragement over criticism

### Casual vs Competitive Balance

| Aspect | Casual | Ranked |
|--------|--------|--------|
| Stakes | None | League points |
| Time | 5-10 min | 10-20 min |
| Rewards | Small | Larger |
| Stress | Low | Moderate |
| Purpose | Fun | Progression |

### Casual Player Support

**Beginner Protection:**
- New players matched with new players
- 20-match protection in Bronze
- Educational tooltips
- Practice mode available

**Slower Progression:**
- Rewards accumulate over time
- No grinding required
- Casual players reach Gold over time
- Diamond+ requires dedicated play

---

## 8. Anti-Toxicity Philosophy

### Sportsmanship First

**Positive Environment:**
- Congratulate opponents
- Thank teammates after matches
- Accept defeat gracefully
- Celebrate victories modestly

**Reporting System:**
- Abusive chat reports
- Griefing reports
- Smurfing reports
- Exploiting reports

### Behavior System

**Positive Reinforcement:**
- Sportsmanship endorsements
- Friendly player badge
- Endorsement rewards

**Negative Consequences:**
| Infractions | Penalty |
|-------------|---------|
| 1st Report | Warning |
| 2nd Report | 1-Day Ban |
| 3rd Report | 7-Day Ban |
| 4th Report | Permanent Ban |

### Anti-Harassment Measures

**Chat Filtering:**
- Profanity auto-filter
- Spam detection
- Spam prevention
- Report buttons prominent

**Fair Play Enforcement:**
- Cheat detection systems
- Exploit patching
- Account restrictions
- Hardware bans for cheaters

---

## 9. Replay Philosophy (Future Features)

*Documented for future implementation—NOT currently planned*

### Battle History

**Concept:** Complete record of all matches.

**Features:**
- View past opponents
- See match details
- Track improvement over time
- Share highlights

### Replay System

**Concept:** Watch recorded matches.

**Requirements:**
- Storage for match recordings
- Playback interface
- Camera controls
- Slow-motion option

### Spectator Mode

**Concept:** Watch live matches.

**Requirements:**
- Privacy controls (opt-in)
- Streaming infrastructure
- Spectator limits
- Commentary tools

---

## 10. Telegram Bot Notifications

### Notification Philosophy

PvP notifications keep players informed without spam:
- Maximum 2 PvP notifications per week
- Only meaningful events trigger notifications
- Players control notification preferences
- Quiet hours respected

### Notification Triggers

**League Events:**
- League promotion achieved
- Season ending reminder (7 days, 3 days, 1 day)
- New season started
- End-of-season rewards available

**Milestone Events:**
- Win streak records
- Achievement unlocks
- 100/500/1000 wins reached
- New high rank achieved

**Weekly Events:**
- Weekly tournament starting
- Weekly rewards available
- Weekly leaderboard posted

### Notification Format

```
⚔️ Jolt Time Arena

[Notification Type]:
[Details]

League: [Current Rank]
Season Ends: [Days remaining]

[View Leaderboard]
```

### User Controls

- Enable/disable PvP notifications
- Choose notification types
- Set quiet hours
- Filter by importance

---

## 11. AdsGram Integration

### PvP Mode and AdsGram

AdsGram remains the primary revenue system. PvP content respects this:

**Optional Rewards (Never Required):**
- Additional daily arena attempts (beyond 10-match cap)
- Bonus seasonal XP (one-time boosts)
- Temporary progression boost (accelerated token gain)
- Skip wait timers (if implemented)

**Never Included in PvP:**
- No required watching for ranked access
- No competitive advantage for watching
- No exclusive PvP content behind ads
- No pay-to-win elements

### Ad Examples for PvP Mode

```
"Watch an ad to restore your daily arena attempts"
"Watch to activate 2x Season XP for your next match"
"Watch to claim your weekly PvP bonus"
```

### Ad Respect Guidelines

- Maximum 1 rewarded ad per PvP session
- Clear labeling of optional nature
- Easy dismiss option
- No artificial urgency

---

## 12. Long-Term PvP Vision

*Documented as aspirational goals—NOT currently planned*

### World Championships

**Concept:** Annual global tournament.

**Requirements:**
- Tournament infrastructure
- Regional qualifiers
- Prize pool system
- Broadcasting capability
- Event staff and moderation

### Esports Events

**Concept:** Professional competitive circuit.

**Requirements:**
- Team/organization support
- Sponsorship infrastructure
- Viewing audience growth
- Competitive game health

### Guild Tournaments

**Concept:** Guild-vs-guild competitive events.

**Requirements:**
- Guild infrastructure (complete)
- Tournament bracket system
- Guild leaderboard integration
- Guild-based rewards

### Regional Leagues

**Concept:** Region-specific competitive seasons.

**Requirements:**
- Regional server infrastructure
- Language support
- Local tournament organizations
- Regional prize distributions

---

## 13. Match Format Details

### Best of 3 Format

**Round Structure:**
```
Round 1: 3 minutes
    ↓
Round 2: 3 minutes (if tied 1-1)
    ↓
Round 3: 3 minutes (if tied 2-2)
```

**Victory Conditions:**
- Win 2 rounds to win match
- Tie rounds possible (both get points)
- Sudden death if time expires (rare)

### Draft Phase

**Purpose:** Strategic artifact selection.

**Process:**
```
30 seconds draft time
Pick 3 artifacts for battle
Ban 1 opponent artifact (future)
View opponent's power level
```

### Battle Phase

**Objective:** Defeat the opponent's artifacts.

**Mechanics:**
- Each player controls their artifacts
- 3-minute time limit
- Most damage wins round
- Ties go to higher power (rare)

---

## 14. Balance Principles

### Competitive Integrity

**No Dominant Strategies:**
- Regular meta analysis
- Fast response to exploits
- Community feedback integration
- Data-driven balance changes

**Fair Competitive Environment:**
- Same rules for all players
- Consistent enforcement
- Regular updates
- Transparent communication

### Skill Factors

**What Determines Victory:**
1. **Player Skill** — Timing, positioning, decisions
2. **Strategy** — Artifact selection, team composition
3. **Knowledge** — Understanding opponent patterns
4. **Preparation** — Practice and learning
5. **Experience** — Pattern recognition

**What Does NOT Dominate:**
- Collection size (matters, not dominant)
- Spending level (completely irrelevant)
- Play time (knowledge beats time)
- Friend count (irrelevant)

---

## 15. UI Structure

### Arena Screen

```
┌─────────────────────────────────────┐
│  ⚔️ ARENA                    [?]   │
├─────────────────────────────────────┤
│                                     │
│  🏆 RANKED                        │
│  ┌─────────────────────────────┐   │
│  │     ⭐⭐⭐ DIAMOND I ⭐⭐⭐    │   │
│  │         4,850 pts           │   │
│  │    [████████░░░░] 97%      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Season Ends: 23 days               │
│                                     │
│  📊 THIS SEASON                    │
│  Record: 45W - 23L (66%)           │
│  Best: Diamond I                   │
│  Streak: 5 🔥                      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [  ⚔️ RANKED MATCH  ]            │
│  [  🎮 CASUAL ARENA   ]            │
│  [  📊 LEADERBOARDS  ]            │
│  [  📜 MATCH HISTORY ]            │
│                                     │
└─────────────────────────────────────┘
```

### Match Result Screen

```
┌─────────────────────────────────────┐
│  ⚔️ VICTORY!                       │
├─────────────────────────────────────┤
│                                     │
│     ⭐⭐⭐ DIAMOND I ⭐⭐⭐          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  YOU        vs     OPPONENT  │   │
│  │   2    WIN      1   LOSS    │   │
│  │                             │   │
│  │   Round 1: WIN (20-15)     │   │
│  │   Round 2: LOSS (12-20)    │   │
│  │   Round 3: WIN (18-14)     │   │
│  └─────────────────────────────┘   │
│                                     │
│  +150 Coins                         │
│  +100 XP                            │
│  +10 Season Tokens                  │
│  +25 League Points                  │
│                                     │
│  Current Streak: 5 🔥               │
│  Best This Season: 66%              │
│                                     │
│  [  NEXT MATCH  ]                  │
│  [  EXIT ARENA   ]                 │
│                                     │
└─────────────────────────────────────┘
```

---

*Document Version: 1.0*  
*Last Updated: 2025-01-15*
