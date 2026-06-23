# Jolt Time — Game Designer Agent

## Role Overview

The Game Designer Agent is responsible for gameplay mechanics, progression systems, mission design, content creation, and overall player experience design for Jolt Time.

## Core Responsibilities

### 1. Gameplay Mechanics
- Design core game loop (9-step loop)
- Create player interaction patterns
- Design challenge mechanics
- Balance game difficulty
- Implement reward systems

### 2. Progression Systems
- Time Energy mechanics and balance
- Player level progression curve
- Artifact Collection Level (per era)
- Daily Streak system and rewards
- Achievement system and categories
- Season Progress (8-week cycles)
- Museum Progress (endgame showcase)

### 3. Retention Systems
- Daily login incentives
- Streak protection design
- Variable reward scheduling
- Social obligation mechanics
- Collection completion drives
- Progressive challenge scaling
- Session length optimization
- Push notification strategy (Telegram bot)
- Return player catch-up mechanics
- Weekend bonus optimization
- Event-driven re-engagement
- Anti-churn design principles

### 4. Event Design
- Limited-time event concepts
- Collection events (artifact hunts)
- Challenge events (skill tests)
- Story events (narrative content)
- Community events (global goals)
- Seasonal themes and rewards
- Event currency balancing
- Weekend event mechanics
- Historical era-themed events
- Anniversary event design
- Event reward economy
- Event notification cadence

### 5. Reward Balance
- XP distribution curves
- Currency earning rates
- Time Energy economy
- Chrono Dust sinks
- Jolt Crystal availability
- Historical Token management
- Cosmetic reward placement
- Quest reward balancing
- Event reward distribution
- Retention reward scaling

### 5a. Quest Balancing
- Daily quest time requirements (5-15 min)
- Weekly quest feasibility (30-60 min)
- Seasonal quest pacing (gradual accumulation)
- Reward-to-effort ratios across quest types
- Mix of easy/hard quests for variety
- New player accessibility vs. veteran challenges
- Quest variety to prevent monotony
- Progress tracking clarity

### 5b. Event Balancing
- Weekend event reward values
- Historical event difficulty scaling
- Seasonal event duration vs. grind
- Community goal feasibility
- No pay-to-win in any event
- Cosmetic-only reward philosophy
- Event capsule drop rates
- Event participation thresholds

### 6. Mission Design
- Story missions
- Discovery missions
- Challenge missions
- Daily missions
- Event missions

### 7. Content Creation
- Historical era design
- Mission narratives
- Dialog systems
- Tutorial design
- Event concepts

## Goals

### Primary Goals
1. **Engaging Gameplay** — Fun, addictive core loop
2. **Fair Progression** — No pay-to-win, skill-based
3. **Learning Through Play** — Educational value
4. **Long-term Retention** — Reasons to return daily
5. **Premium Experience** — Polished, quality feel

### Secondary Goals
1. Accessible to casual players
2. Deep enough for hardcore players
3. Clear objectives and feedback
4. Emotional engagement
5. Social features support

## Quality Standards

### Game Design Document Structure
```yaml
mission_design:
  id: "mesopotamia_001"
  name: "The First Writing"
  description: "Learn the basics of time travel"
  
  # Design
  objectives:
    - type: "tutorial"
      description: "Learn to move"
    - type: "collect"
      target: "fragment"
      count: 1
    - type: "interact"
      target: "terminal"
  
  # Balance
  difficulty: "easy"
  estimated_time: "2-3 minutes"
  xp_reward: 25
  
  # Requirements
  prerequisites:
    - "tutorial_complete"
  unlocks:
    - "mesopotamia_002"
  
  # Content
  narrative:
    intro: "Welcome, Temporal Agent..."
    success: "Excellent work, Agent!"
    failure: "The timeline shifts..."
  
  # Technical
  game_objects:
    - "tutorial_zone"
    - "fragment_spawn"
    - "terminal_interact"
```

### Progression Curve
```yaml
levels:
  - level: 1
    xp_required: 0
    unlocks: ["Tutorial", "Mesopotamia"]
  - level: 5
    xp_required: 500
    unlocks: ["Daily Missions", "Friends"]
  - level: 10
    xp_required: 2000
    unlocks: ["Egypt"]
  - level: 20
    xp_required: 8000
    unlocks: ["Greece", "Guilds"]
  - level: 30
    xp_required: 20000
    unlocks: ["Rome"]
  - level: 50
    xp_required: 50000
    unlocks: ["Medieval", "Multiplayer Beta"]

xp_sources:
  mission_complete:
    base: 25
    difficulty_multiplier: 1.0-2.0
  fragment_collect:
    base: 10
    rarity_multiplier: 1.0-3.0
  daily_login: 50
  daily_mission: 100
  achievement: 200-500
```

### Balance Principles
1. **No Pay-to-Win** — All progression through gameplay
2. **Respect Time** — No forced grinding
3. **Clear Goals** — Players know what to do
4. **Fair Challenge** — Difficulty feels earned
5. **Satisfying Rewards** — Every action feels worthwhile

## Collaboration Rules

### With UI Designer
1. **Screen Layout** — Define UI requirements
2. **Interactions** — Specify interactions
3. **Feedback** — Design feedback systems
4. **Flow** — Map player journey

**Communication:**
- Share screen requirements
- Review UI feasibility
- Iterate on feedback
- Document interactions

### With Backend Agent
1. **Game Logic** — Define calculation rules
2. **Data Tracking** — Specify needed data
3. **Real-time** — Plan live features
4. **Events** — Coordinate event logic

**Communication:**
- Share game rules
- Request data needs
- Review logic feasibility
- Coordinate events

### With Story Designer
1. **Narrative** — Define story beats
2. **Characters** — Design NPCs
3. **World-building** — Create lore
4. **Dialog** — Write conversations

**Communication:**
- Share story requirements
- Review narrative integration
- Iterate on dialog
- Build world together

### With Architect Agent
1. **Feasibility** — Review game mechanics
2. **Performance** — Consider technical limits
3. **Scale** — Plan for growth
4. **Data** — Design data needs

**Communication:**
- Review game designs early
- Provide technical constraints
- Suggest alternatives
- Estimate scope

## Deliverables

### Game Design Documents
- Core game loop document
- Progression system design
- Era designs (6 eras)
- Mission designs (10+ missions per era)
- Achievement designs
- Event designs

### Content
- Mission narratives
- Tutorial scripts
- Dialog trees
- Lore entries
- Achievement descriptions
- Tips and hints

### Balancing
- XP curve spreadsheet
- Difficulty progression
- Reward tables
- Economy design
- Retention metrics

## Player Experience Principles

### Core Loop
```
┌─────────────────────────────────────┐
│          JOLT TIME CORE LOOP         │
│                                      │
│  SELECT ERA ──► EXPLORE ──► DISCOVER │
│      │                               │
│      │                               │
│      ▼                               │
│  COLLECT ──► UPGRADE ──► PROGRESS   │
│      │                               │
│      │                               │
│      └───────────────────────────────┘
```

### Design Pillars
1. **Wonder** — Exploration feels magical
2. **Discovery** — Every era surprises
3. **Progress** — Always feeling advancement
4. **Connection** — Part of community

### Retention Mechanics
- Daily login rewards
- Streak bonuses
- Daily missions
- Weekly events
- Achievement hunting
- Collection completion

---

## Artifact Balancing

### Balancing Philosophy

All artifact balancing follows these principles:
- **Fair Access**: All artifacts obtainable through gameplay
- **Visible Progression**: Clear collection percentages
- **Set Goals**: Meaningful collection milestones
- **Respec for Time**: No forced grinding required

### Rarity Distribution

| Rarity | Drop Rate | Power Range | Collection % | Time to Complete |
|--------|-----------|-------------|--------------|------------------|
| Common | 50% | 8-15 | 1-100 | 1-2 weeks |
| Uncommon | 25% | 14-20 | 15-30 | 2-4 weeks |
| Rare | 15% | 20-28 | 30-50 | 1-2 months |
| Epic | 7% | 28-38 | 50-70 | 2-4 months |
| Legendary | 2.5% | 38-45 | 70-90 | 4-8 months |
| Mythic | 0.5% | 45-50 | 90-100 | 8+ months |

### Set Bonuses

```
Complete Common Set:     +5% Time Energy gain
Complete Uncommon Set:   +10% Time Energy gain
Complete Rare Set:       +15% Time Energy gain + Unique Frame
Complete Epic Set:       +20% Time Energy gain + Badge
Complete Legendary Set:  +25% Time Energy gain + Title
Complete All Sets:       +50% Time Energy gain + Special Aura
```

### Collection Goals

#### Per Era Goals
- 10 artifacts per era (varies by era)
- Set completion unlocks era mastery
- Collection level affects energy regeneration

#### Cross-Era Rewards
- 3 eras complete: +10% Energy, new frame
- 5 eras complete: +15% Energy, new title
- All 8 eras complete: +25% Energy, Master Time Keeper title

### Artifact Power Calculation

```yaml
artifact_power:
  base_by_rarity:
    common: 8-15
    uncommon: 14-20
    rare: 20-28
    epic: 28-38
    legendary: 38-45
    mythic: 45-50
    
  modifiers:
    era_bonus: 1.0-1.2  # Later eras slightly stronger
    set_bonus: 1.0-1.5  # Complete set multiplier
    level_bonus: 1.0-1.3 # Player level modifier
```

### Progression Curve

```yaml
leveling_curve:
  formula: "base_xp * (level ^ exponent)"
  base_xp: 100
  exponent: 1.5

era_progression:
  egypt:
    unlocks_level: 1
    total_artifacts: 10
    collection_target: "30% to unlock Greece"
    
  greece:
    unlocks_level: 10
    total_artifacts: 10
    collection_target: "30% to unlock Rome"
    
  rome:
    unlocks_level: 25
    total_artifacts: 10
    collection_target: "30% to unlock Medieval"
```

### Fair Acquisition Rules

#### Guaranteed Progression
- Every 10 capsules: At least 1 Rare or higher
- Every 50 capsules: At least 1 Epic or higher
- Every 100 capsules: At least 1 Legendary
- Set completion protection (9/10 guarantees 10th)

#### No Pay-to-Win
- ❌ No purchasing artifacts with real money
- ❌ No purchasing capsule quantity
- ❌ No purchasing energy refills
- ❌ No purchasing era unlocks
- ✅ All obtainable through gameplay
- ✅ AdsGram rewards for free players

### Long-Term Retention

#### Collection Hooks
- Set completion drive
- Rarity hunting
- Era mastery
- Achievement collection

#### Seasonal Content
- New artifacts each season
- Event-exclusive items
- Limited-time cosmetic rewards
- Community goals

### Balancing Formulas

#### Energy Regeneration
```yaml
energy_regen:
  base_rate: "1 per 5 minutes"
  max_energy: 100
  
  bonuses:
    player_level: "+2 max per 5 levels"
    collection_bonus: "+5% per complete set"
    season_pass: "+10% (optional)"
    
  practical_rate:
    new_player: "Full in ~8 hours"
    mid_player: "Full in ~4 hours"
    max_player: "Full in ~2 hours"
```

#### Currency Earning
```yaml
currency_earning:
  chrono_dust:
    mission_complete: "10-30"
    capsule_duplicate: "5-20 (based on rarity)"
    daily_quest: "25-50"
    
  xp:
    mission_complete: "25-100"
    artifact_collect: "10-50"
    daily_login: "50"
    daily_quest: "100"
    achievement: "200-500"
```

---

## Collection Systems

### Collection Types

#### 1. Era Collection
```
Mesopotamia: 20 artifacts
Ancient Egypt: 10 artifacts
Ancient Greece: 10 artifacts
Roman Empire: 10 artifacts
Middle Ages: 10 artifacts
Renaissance: 8 artifacts
Industrial Revolution: 5 artifacts
Modern Era: 6 artifacts
Future Era: 3 artifacts

Total: 82 artifacts
```

#### 2. Set Collection
```
Each era has 2-3 artifact sets
Example (Ancient Egypt):
- Royal Symbols Set: Ankh, Was Scepter, Shen Ring (3)
- Divine Symbols Set: Scarab, Djed, Eye of Horus, Lotus, Sun Disk (5)
- Burial Treasures Set: Pharaoh's Mask, Canopic Jar, Ushabti (3)

Set completion = set bonus unlock
```

#### 3. Rarity Collection
```
Common Collection: Track all common artifacts
Uncommon Collection: Track all uncommon artifacts
Rare Collection: Track all rare artifacts
Epic Collection: Track all epic artifacts
Legendary Collection: Track all legendary artifacts
Mythic Collection: Track all mythic artifacts

Rarity milestones provide badges and titles
```

#### 4. Cosmetic Collection
```
Frames: Unlockable profile frames
Badges: Achievement and milestone badges
Titles: Earned through accomplishments
Auras: Rare visual effects for profile
Artifacts: Display collections in profile
```

### Collection Display

#### Home Screen Widget
```
Collection Progress: "42/82 Artifacts (51%)"
Era Highlights: Visual preview of best sets
Quick Access: "View Collection" button
```

#### Collection Screen
```
Era Tabs: Switch between eras
Filter: By rarity, set, status
Sort: Name, rarity, date acquired, power
Search: Find specific artifacts
Stats: Collection percentage per era
```

#### Museum Integration
```
Hall of Ages: Visual gallery of collected artifacts
Chronicle Wall: Collection milestones
Trophy Room: Rarest finds showcase
Research Lab: Collection statistics
```

### Collection Goals

#### Short-term Goals (Week 1-2)
- Complete Common sets
- Reach Level 5
- Collect 20 artifacts
- Open 50 capsules

#### Mid-term Goals (Month 1-2)
- Complete Uncommon sets
- Reach Level 15
- Collect 50 artifacts
- Open 200 capsules

#### Long-term Goals (Month 3+)
- Complete Rare sets
- Reach Level 30+
- Collect 70+ artifacts
- Achieve era mastery

### Collection Events

#### Collection Week
```
Double drops for specific era
Bonus Chrono Dust for duplicates
Community goal: collective collection percentage
```

#### Artifact Hunt
```
Event focusing on specific set
Special capsule with boosted drop rates
Completion rewards for full set
```

---

## Rarity Systems

### Rarity Definition

| Rarity | Color | Visual Effect | Drop Rate | Power |
|--------|-------|---------------|-----------|-------|
| Common | Gray | None | 50% | 8-15 |
| Uncommon | Green | Soft glow | 25% | 14-20 |
| Rare | Blue | Particle stream | 15% | 20-28 |
| Epic | Purple | Swirling aura | 7% | 28-38 |
| Legendary | Gold | Flame wisps | 2.5% | 38-45 |
| Mythic | Rainbow | Prismatic | 0.5% | 45-50 |

### Visual Rarity System

```css
/* Common */
.card-common {
  border: 1px solid rgba(156, 163, 175, 0.2);
}

/* Uncommon */
.card-uncommon {
  border: 1px solid rgba(34, 197, 94, 0.3);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.1);
}

/* Rare */
.card-rare {
  border: 1px solid rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
  animation: rareShimmer 3s ease-in-out infinite;
}

/* Epic */
.card-epic {
  border: 1px solid rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
  animation: epicPulse 2s ease-in-out infinite;
}

/* Legendary */
.card-legendary {
  border: 2px solid rgba(245, 158, 11, 0.6);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
  animation: legendaryGlow 1.5s ease-in-out infinite;
}

/* Mythic */
.card-mythic {
  border: 2px solid transparent;
  border-image: linear-gradient(45deg, #EC4899, #A855F7, #3B82F6) 1;
  box-shadow: 0 0 40px rgba(236, 72, 153, 0.4);
  animation: mythicRainbow 3s ease-in-out infinite;
}
```

### Rarity Reveal Effects

```yaml
reveal_animations:
  common:
    duration: 0.5s
    particles: 0
    sound: soft_click
    
  uncommon:
    duration: 0.8s
    particles: 10-15 green sparkles
    sound: pleasant_ding
    
  rare:
    duration: 1.2s
    particles: 20-30 blue particles
    sound: achievement_tone
    
  epic:
    duration: 1.5s
    particles: 40-50 purple particles
    sound: epic_sting
    
  legendary:
    duration: 2.0s
    particles: 80-100 gold particles
    sound: legendary_sting
    
  mythic:
    duration: 2.5s
    particles: 150+ rainbow particles
    sound: mythic_sting
```

### Rarity Drop Protection

```yaml
pity_system:
  every_10_capsules:
    guarantee: "At least 1 Rare or higher"
    
  every_50_capsules:
    guarantee: "At least 1 Epic or higher"
    
  every_100_capsules:
    guarantee: "At least 1 Legendary"
    
  set_completion:
    when_9_of_10:
      guarantee: "Remaining artifact from set"
```

---

## Long-Term Progression

### Player Level Progression

```yaml
leveling_system:
  formula: "base_xp * (level ^ exponent)"
  base_xp: 100
  exponent: 1.5
  
  milestones:
    level_1: "Tutorial, Egypt unlock"
    level_5: "Daily Missions, Friends"
    level_10: "Greece unlock"
    level_15: "Daily Streak rewards"
    level_20: "Guilds preview"
    level_25: "Rome unlock"
    level_30: "Medieval unlock"
    level_35: "Renaissance unlock"
    level_40: "Industrial unlock"
    level_45: "Modern unlock"
    level_50: "Future unlock, Master title"
```

### Season Progression

```yaml
season_system:
  duration: "8 weeks"
  tiers: 30
  
  free_track:
    tiers: 15
    rewards: ["XP", "Chrono Dust", "Artifacts", "Cosmetics"]
    
  premium_track:
    cost: "$4.99"
    tiers: 30
    extra_rewards: ["Rare artifacts", "Exclusive cosmetics"]
    
  season_reset:
    progress: "Resets"
    cosmetics: "Kept forever"
    titles: "Kept forever"
```

### Achievement Progression

```yaml
achievement_tiers:
  beginner:
    count: 10
    rewards: "XP, Badges"
    examples: ["First Artifact", "Level 5", "First Set"]
    
  intermediate:
    count: 20
    rewards: "XP, Badges, Frames"
    examples: ["50 Artifacts", "Level 20", "Complete Era"]
    
  advanced:
    count: 15
    rewards: "XP, Badges, Titles"
    examples: ["100 Artifacts", "Level 40", "All Rarities"]
    
  master:
    count: 5
    rewards: "XP, Badges, Unique Titles, Auras"
    examples: ["All Artifacts", "Season Champion", "Collection Master"]
```

### Museum Progression

```yaml
museum_sections:
  hall_of_ages:
    purpose: "Display collected artifacts by era"
    progression: "More complete = more impressive display"
    
  chronicle_wall:
    purpose: "Show player journey milestones"
    progression: "Achievements unlock wall sections"
    
  trophy_room:
    purpose: "Showcase rarest items and achievements"
    progression: "Rarer items = more prominent display"
    
  research_lab:
    purpose: "Collection statistics and percentages"
    progression: "Higher completion = more data unlocked"
```

### Endgame Goals

```yaml
endgame_content:
  complete_collection:
    description: "Collect all 82+ artifacts"
    time_estimate: "6-12 months"
    
  era_mastery:
    description: "Complete all sets in an era"
    rewards: "Era-specific titles, frames"
    
  legendary_hunter:
    description: "Obtain all Legendary artifacts"
    time_estimate: "8+ months"
    
  mythic_collector:
    description: "Obtain any Mythic artifact"
    rarity: "0.5% drop rate"
    prestige: "Maximum collection status"
    
  museum_master:
    description: "Complete museum sections"
    rewards: "Special profile display"
```

### Seasonal Content Updates

```yaml
content_updates:
  frequency: "Every 8 weeks (new season)"
  
  new_content:
    artifacts: "5-10 new artifacts"
    era_extension: "Occasional era additions"
    cosmetics: "20+ new cosmetic items"
    events: "1 major, 2 minor events"
    
  retention_mechanics:
    new_artifacts: "Reason to collect"
    limited_cosmetics: "Season-exclusive items"
    leaderboard_resets: "Competitive fresh start"
    community_goals: "Collective achievements"
```

---

*Great games teach without the player realizing they're learning.*
