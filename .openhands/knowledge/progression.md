# Jolt Time — Progression Systems

## Overview

Jolt Time features multiple parallel progression systems that provide varied goals and rewards. All progression is gameplay-based with no pay-to-win mechanics.

## 1. Player Level

### System
- Players gain XP from completing activities
- Each level requires more XP than the last
- Levels unlock new content and features

### Level Curve
```yaml
leveling_curve:
  formula: "base_xp * (level ^ exponent)"
  base_xp: 100
  exponent: 1.5

level_table:
  - level: 1
    total_xp: 0
    unlocks: ["Tutorial", "Mesopotamia Era"]
  - level: 2
    total_xp: 100
    unlocks: ["Daily Quests"]
  - level: 3
    total_xp: 341
    unlocks: ["Capsule System"]
  - level: 5
    total_xp: 1118
    unlocks: ["Friends System", "Guilds Preview"]
  - level: 10
    total_xp: 3162
    unlocks: ["Egypt Era"]
  - level: 15
    total_xp: 5809
    unlocks: ["Greece Era"]
  - level: 20
    total_xp: 8944
    unlocks: ["Guilds", "Competitive Mode Preview"]
  - level: 25
    total_xp: 12500
    unlocks: ["Rome Era"]
  - level: 30
    total_xp: 16431
    unlocks: ["Medieval Era"]
  - level: 35
    total_xp: 20724
    unlocks: ["Renaissance Era", "Full Multiplayer"]
  - level: 40
    total_xp: 25394
    unlocks: ["Advanced Events"]
  - level: 50
    total_xp: 37123
    unlocks: ["Master Titles"]
```

### XP Sources
| Activity | XP Amount | Frequency |
|----------|-----------|-----------|
| Complete Mission | 25-100 | Per mission |
| Collect Artifact | 10-50 | Per artifact |
| Daily Login | 50 | Daily |
| Daily Quest | 100 | 3/day |
| Achievement | 200-500 | One-time |
| Event Participation | 150 | Per event |

### Max Level
- **Soft Cap:** Level 50
- **Post-Cap:** XP converts to cosmetic rewards
- **Prestige:** Future feature for replayability

---

## 2. Artifact Collection Level

### System
- Each era has collection level (1-100)
- Collect all artifacts to unlock era mastery
- Collection level affects gameplay stats

### Collection Progression
```yaml
collection_level:
  per_era:
    artifacts_count: 20
    rarity_distribution:
      common: 8      # 40%
      uncommon: 6    # 30%
      rare: 4        # 20%
      legendary: 2   # 10%

  level_calculation:
    formula: "(common * 1) + (uncommon * 2) + (rare * 5) + (legendary * 10)"
    max_per_era: 100

  bonuses:
    level_25: "+5% Time Energy gain"
    level_50: "+10% Time Energy gain, Unique Avatar"
    level_75: "+15% Time Energy gain, Exclusive Frame"
    level_100: "+25% Time Energy gain, Master Title"
```

### Collection Benefits
- **Time Energy Boost:** Higher collection = faster energy regen
- **Set Bonuses:** Complete sets for special effects
- **Visual Rewards:** Frames, badges, and titles
- **Era Mastery:** Special content at max level

---

## 3. Daily Streak

### System
- Consecutive daily logins tracked
- Breaks reset streak to 0
- Higher streaks = better rewards

### Streak Mechanics
```yaml
streak_system:
  reset_condition: "No login for 24 hours"
  grace_period: "None (strict)"
  
  rewards:
    base_daily: 50 XP
    multiplier_by_day:
      1-6: 1.0x
      7-13: 1.5x
      14-20: 2.0x
      21-29: 2.5x
      30+: 3.0x
      
  milestones:
    day_7: "Exclusive Badge"
    day_14: "Rare Artifact Fragment"
    day_30: "Legendary Artifact"
    day_60: "Premium Frame"
    day_100: "Unique Title"

  protection:
    type: "None"
    note: "Streaks are sacred, no protection"
```

### Streak Display
- Fire icon with day count
- Glow intensity increases with streak
- Weekly summary in notifications
- Milestone celebrations

---

## 4. Achievements

### System
- One-time goals across all categories
- Provide permanent rewards and recognition
- Display in player profile

### Achievement Categories

#### Collection Achievements
| Name | Requirement | Reward |
|------|-------------|--------|
| First Find | Collect first artifact | 100 XP |
| Collector | Collect 50 artifacts | 200 XP, Badge |
| Museum Curator | Complete 1 era collection | 500 XP, Frame |
| Time Keeper | Collect 200 artifacts | 1000 XP, Title |
| Legendary Hunter | Collect 5 legendary artifacts | 750 XP |
| Complete Collection | Collect all artifacts | 5000 XP, Master Title |

#### Progression Achievements
| Name | Requirement | Reward |
|------|-------------|--------|
| First Steps | Reach Level 5 | 100 XP |
| Scholar | Reach Level 20 | 500 XP |
| Master | Reach Level 40 | 1500 XP |
| Legend | Reach Level 50 | 5000 XP, Unique Title |

#### Social Achievements
| Name | Requirement | Reward |
|------|-------------|--------|
| Social Butterfly | Add 10 friends | 150 XP |
| Guild Founder | Create a guild | 500 XP |
| Team Player | Complete 50 guild quests | 300 XP |
| Helpful Hand | Send gifts to 100 friends | 200 XP |

#### Special Achievements
| Name | Requirement | Reward |
|------|-------------|--------|
| Event Champion | Win 10 events | 1000 XP |
| Streak Master | 30-day streak | 750 XP |
| Perfect Day | Complete all daily quests | 50 XP |
| Speedrunner | Complete mission under time | 100 XP |

### Achievement Display
- Profile badge showcase (top 5)
- Achievement progress bar
- Recently unlocked notification
- Achievement gallery (full list)

---

## 5. Season Progress

### System
- 8-week seasons with themes
- Free and premium tracks
- Seasonal cosmetics and rewards

### Season Structure
```yaml
season:
  duration: "8 weeks"
  theme: "Rotating historical focus"
  
  tracks:
    free:
      tiers: 15
      rewards:
        - 100 XP
        - 50 Chrono Dust
        - Basic cosmetic
        - 200 XP
        - 100 Chrono Dust
        - Common artifact
        - 300 XP
        - 150 Chrono Dust
        - Rare artifact
        - 500 XP
        
    premium:
      cost: "$3.99 or 1500 Jolt Crystals"
      extra_tiers: 15
      total_tiers: 30
      additional_rewards:
        - Exclusive skin
        - 2x XP boost (season)
        - Legendary artifact
        - Premium frame
        - Master title

  season_pass_exclusive:
    - Cosmetic items
    - Player titles
    - Profile frames
    - Avatar decorations
```

### Season Reset
- Progress resets each season
- Purchased premium track: bonus rewards carry over
- Cosmetics remain forever
- Titles remain forever

---

## 6. Museum Progress

### System
- Endgame collection showcase
- Hall of Fame for achievements
- Historical timeline display

### Museum Sections

#### Hall of Ages
- Visual display of all collected artifacts
- Era completion percentage
- Set completion status
- Animated scenes when viewing

#### Chronicle Wall
- Timeline of player's journey
- Major milestones achieved
- Quest completion history
- Events participated

#### Trophy Room
- Achievement badges on display
- Rare item showcase
- Event winner certificates
- Leaderboard rankings

#### Research Lab
- Collection statistics
- Completion percentages
- Rare finds counter
- Play time tracker

### Museum Benefits
- Social sharing of progress
- Guild contribution display
- Profile customization
- Endgame goals

---

## Progression Philosophy

### Fair and Equal
- No pay-to-win advantages
- All players can reach max level
- Cosmetics are the only purchase
- Skill determines leaderboard position

### Visible Progress
- Clear numbers and percentages
- Milestone celebrations
- Progress bars everywhere
- Achievement notifications

### Multiple Goals
- Something for every player type
- Casual: Daily quests, collection
- Hardcore: Leaderboards, achievements
- Social: Guilds, friends
- Completionist: Museum, all achievements

### Respect Time
- No forced grinding required
- Maximum enjoyment in minimum time
- Can catch up after breaks
- No FOMO pressure

---

*Progress is not just about getting stronger. It's about becoming part of the story.*
