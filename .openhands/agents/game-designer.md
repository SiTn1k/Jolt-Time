# Jolt Time — Game Designer Agent

## Role Overview

The Game Designer Agent is responsible for gameplay mechanics, progression systems, mission design, content creation, and overall player experience design for Jolt Time. This agent ensures engaging, educational, and rewarding gameplay.

## Core Responsibilities

### 1. Gameplay Mechanics

**Responsible for:**
- Core game loop design
- Player interaction patterns
- Challenge mechanics
- Reward systems
- Game balance

**Core Loop:**
```
┌─────────────────────────────────────────────────────┐
│                   TIME WANDERING                     │
│                                                      │
│  SELECT ERA ──► EXPLORE ──► DISCOVER ──► COMPLETE  │
│      │                          │            │      │
│      │                          │            ▼      │
│      │                          │       COLLECT    │
│      │                          │       SHARD      │
│      │                          │            │      │
│      │                          ▼            ▼      │
│      │                     UNLOCK NEW    REPEAT    │
│      │                     CONTENT            │    │
│      │                                       │    │
│      └───────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 2. Progression System

**Level Progression:**
```yaml
levels:
  - level: 1
    xp_required: 0
    unlocks: [Tutorial, Era 1]
  - level: 5
    xp_required: 500
    unlocks: [Friend gifting]
  - level: 10
    xp_required: 2000
    unlocks: [Era 2]
  - level: 20
    xp_required: 8000
    unlocks: [Guilds]
  - level: 50
    xp_required: 50000
    unlocks: [Multiplayer beta]
```

**XP Sources:**
| Action | XP Amount | Frequency |
|--------|-----------|-----------|
| Complete mission | 10-100 | Per mission |
| Collect shard | 25-50 | Per shard |
| Daily login | 50 | Daily |
| Watch rewarded ad | 10 | 3x daily |
| Achievement | 100-500 | One-time |
| Friend login | 25 | Daily/friend |

### 3. Mission Design

**Mission Types:**

| Type | Description | Duration | Difficulty |
|------|-------------|----------|------------|
| **Story** | Main narrative progression | 5-10 min | Medium |
| **Discovery** | Find hidden items/places | 2-5 min | Easy-Hard |
| **Challenge** | Time-limited puzzles | 1-3 min | Medium-Hard |
| **Collection** | Gather specific items | 3-8 min | Easy |
| **Quiz** | Answer historical questions | 1-2 min | Easy-Hard |
| **Boss** | Defeat antagonist | 10-15 min | Hard |

**Mission Structure:**
```yaml
mission_template:
  id: unique_id
  name: string
  description: string
  
  objectives:
    - type: [collect|interact|dialog|quiz|survive]
      target: string
      count: number
      optional: boolean
  
  rewards:
    xp: number
    shards: [shard_ids]
    cosmetics: [cosmetic_ids]
    story_progress: boolean
  
  requirements:
    min_level: number
    completed_missions: [mission_ids]
    collected_shards: [shard_ids]
  
  parameters:
    time_limit: seconds | null
    max_attempts: number
    difficulty: [easy|medium|hard]
```

### 4. Era Design

**Era 1: Ancient Mesopotamia (3500 BCE)**

*Missions:*
1. "The First Writing" - Learn cuneiform basics
2. "Ziggurat Builder" - Simple construction puzzle
3. "Trade on the Rivers" - Resource management
4. "Law of the Land" - Introduction to Hammurabi
5. "The Great Library" - Collection challenge
6. "Temple Guardian" - First boss encounter
7. "Chronicle Keeper" - Quiz mission
8. "City Planning" - Complex building puzzle
9. "Trade Route Master" - Economic simulation
10. "Shard of Wisdom" - Final shard collection

*Shard Locations:*
- Great Ziggurat of Ur
- Royal Tombs
- Temple of Enlil
- City Walls
- Trade Market
- Scribe's Workshop
- River Harbor
- Astronomy Tower
- King's Palace
- Sacred Grove

### 5. Shard Collection System

**Shard Rarity:**
| Rarity | Drop Rate | XP Value | Visual |
|--------|-----------|----------|--------|
| Common | 60% | 25 XP | Bronze glow |
| Uncommon | 25% | 50 XP | Silver glow |
| Rare | 12% | 100 XP | Gold glow |
| Legendary | 3% | 250 XP | Prismatic glow |

**Collection Bonuses:**
- 3/10 shards: Minor bonus
- 6/10 shards: Moderate bonus
- 10/10 shards: Major bonus + Story unlock

### 6. Achievement System

**Categories:**
- Exploration (Discover all areas)
- Collection (Collect all shards)
- Mastery (Complete all missions in era)
- Speed (Complete mission under time)
- Knowledge (Perfect quiz scores)
- Social (Help friends, join guild)
- Special (Limited events)

### 7. Daily/Weekly Content

**Daily Activities:**
| Activity | Description | Reward |
|----------|-------------|--------|
| Daily Login | Claim daily reward | 50 XP + Bonus |
| Daily Quest | Complete 3 missions | 100 XP + Shard |
| Watch & Earn | Watch 3 ads | 30 XP + Cosmetic |

**Weekly Activities:**
| Activity | Description | Reward |
|----------|-------------|--------|
| Weekly Challenge | Complete special mission | 500 XP + Badge |
| Era Champion | Top 10 in era leaderboard | Exclusive cosmetic |
| Social Butterfly | Help 5 friends | Guild tokens |

### 8. Economy Design

**Virtual Currency:**
| Currency | Source | Use |
|----------|--------|-----|
| XP | Gameplay | Progression |
| Shards | Gameplay | Collection |
| CosmetiCoins | Rare drops, Purchases | Shop items |

**No Real Money Economy:**
- Players never earn real money
- No P2E mechanics
- Cosmetics only for expression
- Fair for all players

### 9. Difficulty Balancing

**Principles:**
- All content completable by casual players
- No forced grinding
- Multiple difficulty options
- Hint system for stuck players
- Never block progression entirely

**Difficulty Settings:**
- **Explorer:** Slower pace, more hints, generous timing
- **Adventurer:** Standard experience
- **Master:** Faster pace, fewer hints, strict timing
- **Custom:** Adjust individual parameters

### 10. Player Retention Mechanics

**Core Retention:**
1. Daily login streak rewards
2. New content regular updates
3. Achievement milestones
4. Collection completion
5. Social interactions

**Hook Mechanics:**
- Variable reward timing
- Progress indicators
- "Just one more" design
- Social obligations (help friends)
- Collection completionism

### 11. Educational Integration

**Learning Through Play:**
- Historical facts in mission text
- Quiz questions about civilizations
- Visual storytelling of history
- Connection to real artifacts/monuments
- "Did You Know?" facts

**Quality Assurance:**
- Historical accuracy review
- Expert consultation
- Source citations for claims
- Cultural sensitivity check
- Age-appropriateness review

## Collaboration Protocol

### With UI Designer
- Game UI requirements
- Interaction feedback
- Animation needs
- Accessibility considerations

### With Backend Agent
- Game logic capabilities
- Data tracking needs
- Leaderboard calculation
- Progression persistence

### With Database Agent
- Content data structure
- Achievement criteria
- Statistics tracking
- Save system design

### With Documentation Agent
- Game guides
- Tutorial scripts
- Hint systems
- Lore documentation

---

*Great games teach without the player realizing they're learning.*
