# Jolt Time — Game Loop

## Core Gameplay Loop

The game loop is designed to create a satisfying daily rhythm that rewards players for returning consistently while providing depth for long-term engagement.

### The 9-Step Core Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                      JOLT TIME CORE LOOP                          │
│                                                                  │
│  ┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌─────────┐ │
│  │  STEP 1 │───►│   STEP 2    │───►│  STEP 3  │───►│ STEP 4  │ │
│  │  ENTER  │    │   COLLECT   │    │   OPEN   │    │ OBTAIN  │ │
│  │   GAME  │    │ TIME ENERGY │    │ CAPSULES │    │ARTIFACTS│ │
│  └─────────┘    └─────────────┘    └──────────┘    └─────────┘ │
│       │               │                  │                  │     │
│       │               │                  │                  ▼     │
│       │               │                  │           ┌─────────┐ │
│       │               │                  │           │  STEP 5 │ │
│       │               │                  │           │ UPGRADE │ │
│       │               │                  │           │COLLECTION│ │
│       │               │                  │           └─────────┘ │
│       │               │                  │                  │     │
│       │               ▼                  ▼                  ▼     │
│       │          ┌─────────┐    ┌─────────────┐    ┌─────────┐ │
│       │          │  STEP 9 │◄───│   STEP 8    │◄───│  STEP 7 │ │
│       │          │ RETURN  │    │    EARN     │    │COMPLETE │ │
│       │          │  DAILY  │    │  REWARDS   │    │  QUESTS │ │
│       │          └─────────┘    └─────────────┘    └─────────┘ │
│       │                                                       │
│       │                               ┌─────────────┐          │
│       └──────────────────────────────►│   STEP 6    │          │
│                                       │ PARTICIPATE │          │
│                                       │   IN EVENT  │          │
│                                       └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Breakdown

#### Step 1: Enter Game
**What happens:**
- Player opens Telegram Mini App
- Daily login screen appears with streak counter
- Unclaimed daily reward highlighted (if available)
- Notification badge shows pending activities

**Why it matters:**
- First impression of the day
- Sets the tone for engagement
- Shows player their progress at a glance

**Player motivation:**
- "What did I miss yesterday?"
- "Is my streak still intact?"
- "What's new today?"

#### Step 2: Collect Time Energy
**What happens:**
- Time Energy meter displays current amount
- Passive regeneration: 1 Energy per 5 minutes (max 100)
- Complete missions to earn bonus Energy
- Daily energy cap prevents over-farming

**Why it matters:**
- Time Energy is the primary resource
- Controls pacing of gameplay
- Creates natural session breaks

**Player motivation:**
- "I have enough energy to play!"
- "I should wait a bit for energy to regenerate"
- "Let me do a quick mission for more energy"

#### Step 3: Open Historical Capsules
**What happens:**
- Capsules found during missions or purchased
- Three capsule types: Common, Rare, Legendary
- Opening animation with reveal
- Guaranteed rare every 7 days

**Why it matters:**
- Excitement and surprise element
- Collection progression
- Monetization opportunity (optional purchases)

**Player motivation:**
- "What will I get?"
- "I need that rare artifact!"
- "Almost got all the commons"

#### Step 4: Obtain Artifacts
**What happens:**
- Artifacts display in collection
- Each era has unique artifacts
- Rarity determines visual appearance
- Artifacts power up collection level

**Why it matters:**
- Core collection mechanic
- Visual representation of progress
- Gateway to upgrades

**Player motivation:**
- "New artifact unlocked!"
- "This looks amazing in my collection"
- "I need to complete this set"

#### Step 5: Upgrade Collection
**What happens:**
- Use Chrono Dust to upgrade artifacts
- Upgrades increase artifact power
- Set bonuses for complete collections
- Collection level unlocks new content

**Why it matters:**
- Long-term investment
- Power progression
- Endgame depth

**Player motivation:**
- "My artifacts are getting stronger"
- "I unlocked set bonus!"
- "Almost maxed this era collection"

#### Step 6: Complete Quests
**What happens:**
- Daily quests refresh every 24 hours
- Main story quests advance narrative
- Side quests provide extra content
- Challenge quests test skill

**Why it matters:**
- Core gameplay content
- Story progression
- XP and rewards

**Player motivation:**
- "I need to finish this quest"
- "What's the next story beat?"
- "Challenge quest for bonus rewards"

#### Step 7: Earn Rewards
**What happens:**
- XP for player level
- Chrono Dust for upgrades
- Jolt Crystals (premium currency)
- Historical Tokens (event currency)
- Achievement progress

**Why it matters:**
- Feeling of accomplishment
- Multiple reward types
- Different progression paths

**Player motivation:**
- "Level up!"
- "Got great rewards!"
- "Achievement unlocked!"

#### Step 8: Return Daily
**What happens:**
- Daily login streak system
- Streak multiplier increases rewards
- Break in streak resets progress
- Weekly milestone rewards

**Why it matters:**
- Retention driver #1
- Rewards consistent engagement
- Creates habit

**Streak Rewards:**
| Day | Reward Multiplier |
|-----|------------------|
| 1-6 | 1.0x |
| 7-13 | 1.5x |
| 14-20 | 2.0x |
| 21-29 | 2.5x |
| 30+ | 3.0x + Bonus |

**Player motivation:**
- "Keep the streak going!"
- "I'll lose my 15-day streak!"
- "Bonus day tomorrow!"

#### Step 9: Participate in Events
**What happens:**
- Limited-time events every 2-4 weeks
- Event-specific currency and rewards
- Special story content
- Leaderboard competitions

**Why it matters:**
- Fresh content injection
- FOMO without pressure
- Community engagement

**Event Types:**
- **Collection Events** — Gather specific artifacts
- **Challenge Events** — Complete difficult missions
- **Story Events** — Limited narrative content
- **Community Events** — Global goals and rewards

**Player motivation:**
- "Limited time event!"
- "I can get exclusive rewards!"
- "Let's see if we hit the global goal"

## Retention-Focused Design

### Daily Touchpoints

| Touchpoint | Frequency | Purpose |
|------------|-----------|---------|
| Daily Login | 1x/day | Anchor habit |
| Daily Quests | 3/day | Core loop |
| Energy Cap | Every 4h | Return trigger |
| Streak | Ongoing | Loss aversion |
| Events | Weekly | Content refresh |

### Hook Mechanics

1. **Variable Rewards**
   - Capsules provide unpredictable rewards
   - Mission completion has chance for bonus
   - Achievements unlock unexpectedly

2. **Social Obligations**
   - Help friends with energy
   - Guild contributions
   - Friend leaderboards

3. **Collection Completion**
   - Incomplete sets feel wrong
   - New artifacts create gaps
   - Set bonuses reward completion

4. **Progressive Challenges**
   - Difficulty scales with player
   - Always something to achieve
   - Goals feel achievable

### Session Design

**Short Session (5 min):**
- Claim daily reward
- Complete 1-2 quick missions
- Check leaderboard

**Medium Session (15 min):**
- Play through daily quests
- Open capsules
- Collection management

**Long Session (30+ min):**
- Story mission deep dive
- Event participation
- Achievement hunting

## Anti-Frustration Design

### Prevent Player Burnout
- No forced waiting (energy regenerates)
- No hard walls (missions always completable)
- No punishment for breaks (streak protected)
- Always something to do (multiple systems)

### Fair Play
- All players compete equally
- No pay-to-win advantages
- Leaderboards have skill-based matchmaking
- Events are completable f2p

### Quality of Life
- Auto-save progress
- Offline progress for collection
- Cross-session continuity
- Clear explanations

---

*Every loop is a small victory. Every return is a new beginning.*
