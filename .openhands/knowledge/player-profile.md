# Jolt Time — Player Profile and Account Progression

## Overview

The Player Profile system is Jolt Time's central hub for displaying player identity, progression, and achievements. It celebrates each player's unique journey through time, showcasing their accomplishments, collection depth, and dedication. All profile elements are cosmetic-only, ensuring fair play while rewarding engagement and mastery.

---

## 1. Player Profile Screen

### 1.1 Main Profile Display

The profile screen serves as the player's personal showcase within Jolt Time.

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                              PROFILE                │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │   [Avatar]         ⭐ LEVEL 32                      │ │
│  │                     "Battle Legend"                   │ │
│  │   @TimeKeeper_Mike                                  │ │
│  │                                                      │ │
│  │   ⭐━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⭐       │ │
│  │   Level 32 → 33                                     │ │
│  │   ████████████████░░░░░░░  67%                     │ │
│  │   2,340 / 3,500 XP                                 │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  ❤️ FAVORITE ARTIFACT                               │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │  🏺 Clay Tablet of Ur                      │   │ │
│  │  │  Level 15 • Ancient Era • Legendary         │   │ │
│  │  │  [Change Favorite]                          │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  📊 COLLECTION STATS                                │ │
│  │                                                      │ │
│  │  Artifacts: 67/82 (82%)                           │ │
│  │  ████████████████████████░░░░░░░  82%            │ │
│  │                                                      │ │
│  │  Era Progress:                                      │ │
│  │  Mesopotamia: 100%  Egypt: 75%  Greece: 60%       │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  🏆 ACHIEVEMENTS: 45/125 (36%)                     │ │
│  │  ██████████████░░░░░░░░░░░░░░░░░░  36%          │ │
│  │                                                      │ │
│  │  [View All Achievements →]                          │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  📅 MEMBER SINCE: January 15, 2026                   │ │
│  │  🔥 LONGEST STREAK: 23 days                         │ │
│  │  🕐 TOTAL PLAY TIME: 127 hours                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  [Edit Profile]  [Share Profile]  [Settings]        │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Profile Elements

| Element | Description | Editable |
|---------|-------------|----------|
| **Avatar** | Telegram profile photo or custom avatar | Custom avatar optional |
| **Nickname** | Display name (from Telegram or custom) | Customizable |
| **Telegram Username** | @username link | From Telegram |
| **Account Level** | Current level with XP progress bar | Progression-based |
| **Player Title** | Active achievement title | Player choice |
| **Join Date** | "Member since" timestamp | Read-only |
| **Favorite Artifact** | Publicly displayed artifact | Always editable |
| **Collection Completion** | X/82 artifacts, percentage | Progression-based |

### 1.3 Profile Tabs

```
┌─────────────────────────────────────────────────────────────┐
│  [Profile]  [Stats]  [Cosmetics]  [Badges]                │
└─────────────────────────────────────────────────────────────┘
```

| Tab | Content |
|-----|---------|
| **Profile** | Main display, avatar, level, title, favorite artifact |
| **Stats** | Lifetime statistics, battle record, collection details |
| **Cosmetics** | Owned frames, backgrounds, borders, auras |
| **Badges** | Achievement badges, event badges, special badges |

---

## 2. Account Level System

### 2.1 Level Structure

Player levels represent overall progression through Jolt Time, from Level 1 (newcomer) to Level 100 (Master of Time).

**Level Range:** 1 to 100

### 2.2 Experience Requirements

The XP curve uses a formula that makes early levels quick while later levels require significant investment.

```yaml
leveling_curve:
  formula: "base_xp * (level ^ exponent)"
  base_xp: 100
  exponent: 1.5
  
level_table:
  level_1: 0 XP
  level_5: 1,118 XP
  level_10: 3,162 XP
  level_15: 5,809 XP
  level_20: 8,944 XP
  level_25: 12,500 XP
  level_30: 16,431 XP
  level_40: 25,394 XP
  level_50: 37,123 XP
  level_60: 50,912 XP
  level_70: 66,615 XP
  level_80: 84,113 XP
  level_90: 103,230 XP
  level_100: 123,800 XP
```

### 2.3 XP Sources

Players gain XP from diverse activities, ensuring multiple progression paths.

| Activity | XP Amount | Frequency |
|----------|-----------|-----------|
| Battle Victory | 25-100 | Per battle (based on difficulty) |
| Daily Login | 50 | Daily |
| Daily Quest | 100 | Per quest (3/day) |
| Weekly Quest | 300-750 | Per quest |
| Achievement Unlock | 200-5000 | One-time |
| Artifact Collected | 10-50 | Per artifact (based on rarity) |
| Era Discovery | 150 | First time per era |
| Museum Donation | 25-100 | Per donation |
| Event Completion | 200-1000 | Per event |
| Collection Milestone | 300-1000 | Per milestone |
| Pack Opening | 10-25 | Per pack |

### 2.4 Level Rewards

Each level provides immediate rewards and unlocks.

```yaml
level_rewards:
  every_5_levels:
    level_5: 100 Chrono Dust, Unlock Friends
    level_10: 200 Chrono Dust, Unlock Egypt Era
    level_15: 300 Chrono Dust, Unlock Greece Era
    level_20: 500 Chrono Dust, Unlock Guilds
    level_25: 750 Chrono Dust, Unlock Rome Era
    level_30: 1000 Chrono Dust, Unlock Medieval Era
    level_35: 1250 Chrono Dust, Unlock Renaissance Era
    level_40: 1500 Chrono Dust, Unlock Industrial Era
    level_45: 1750 Chrono Dust
    level_50: 2000 Chrono Dust, Unlock Modern Era, Master Title
    level_55-100: 500 Chrono Dust per level
    
  cosmetic_rewards:
    level_10: Bronze Badge
    level_25: Silver Badge
    level_50: Gold Badge + Frame
    level_75: Platinum Badge + Frame
    level_100: Prismatic Badge + Frame + "Master of Time" Title
```

### 2.5 Level Display

```
┌─────────────────────────────────────────────────────────────┐
│  ⭐ LEVEL 32                                               │
│  "Battle Legend"                                           │
│                                                              │
│  ⭐━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⭐             │
│  Level 32 → 33                                            │
│  ████████████████░░░░░░░  67%                            │
│  2,340 / 3,500 XP                                        │
│                                                              │
│  Next Reward: +100 Chrono Dust                             │
│  Unlocks: Greece Era (2 more levels)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Prestige System

### 3.1 Overview

After reaching Level 100, players can enter Prestige — a reset mechanic that provides cosmetic rewards while preserving collection progress.

### 3.2 Prestige Requirements

| Requirement | Value |
|-------------|-------|
| Minimum Level | 100 |
| Collection Requirement | 50% complete (41/82 artifacts) |
| Achievement Requirement | 50 achievements unlocked |

### 3.3 Prestige Process

**What Resets:**
- Player Level → Returns to Level 1
- XP → Returns to 0
- Currency balances → **Preserved** (no reset)

**What is Preserved:**
- All artifacts
- All collections
- All achievements
- All cosmetics
- All currencies
- All museum progress

### 3.4 Prestige Rewards

| Prestige Level | Title | Icon | Reward |
|---------------|-------|------|--------|
| Prestige 1 | Bronze Time Keeper | ⬤ | Bronze Prestige Frame |
| Prestige 2 | Silver Time Keeper | ⬤⬤ | Silver Prestige Frame |
| Prestige 3 | Gold Time Keeper | ⬤⬤⬤ | Gold Prestige Frame |
| Prestige 4 | Platinum Time Keeper | ◆ | Platinum Prestige Frame |
| Prestige 5 | Diamond Time Keeper | ◆◆ | Diamond Prestige Frame |
| Prestige 10 | Chrono Master | ✦ | Chrono Aura (animated) |
| Prestige 25 | Temporal Legend | ✦✦ | Legendary Prestige Badge |
| Prestige 50 | Master of Time | ✦✦✦ | Mythic Prestige Frame |

### 3.5 Prestige Display

```
┌─────────────────────────────────────────────────────────────┐
│  ⬤⬤ PRESTIGE 2                                           │
│  "Silver Time Keeper"                                      │
│                                                              │
│  Total Prestige XP: 12,450                                  │
│  Prestige Level: 2                                         │
│                                                              │
│  [Enter Prestige 3]                                        │
│  Requires: 75% Collection (62/82), 75 Achievements         │
└─────────────────────────────────────────────────────────────┘
```

### 3.6 Prestige Philosophy

> **Prestige remains entirely cosmetic.** No gameplay advantages are gained through prestige. The only benefits are visual distinction and exclusive cosmetic rewards.

---

## 4. Statistics Section

### 4.1 Lifetime Statistics

The statistics section displays comprehensive player history.

```
┌─────────────────────────────────────────────────────────────┐
│  📊 LIFETIME STATISTICS                                    │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  ⏱️ PLAY TIME                                             │
│  Total: 127 hours                                          │
│  Average: 23 min/day                                        │
│  Most Active: Weekend                                       │
│                                                              │
│  ⚔️ BATTLES                                              │
│  Won: 347  |  Lost: 89  |  Win Rate: 79.6%                │
│  Best Streak: 23                                           │
│  Battles This Week: 45                                    │
│                                                              │
│  🎁 CAPSULES                                              │
│  Opened: 234                                               │
│  Common: 156  Rare: 62  Epic: 14  Legendary: 2            │
│                                                              │
│  🏺 COLLECTION                                            │
│  Artifacts: 67/82 (82%)                                   │
│  Common: 32/32  Uncommon: 24/26  Rare: 11/14            │
│  Epic: 3/6  Legendary: 1/3  Mythic: 0/1                  │
│                                                              │
│  📜 QUESTS                                                │
│  Daily Completed: 89                                       │
│  Weekly Completed: 23                                      │
│  Achievements: 45/125 (36%)                              │
│                                                              │
│  🏛️ MUSEUM                                               │
│  Items Displayed: 23/45                                    │
│  Era Completions: 1 (Mesopotamia)                         │
│                                                              │
│  🔥 STREAKS                                               │
│  Current: 12 days  |  Longest: 23 days                   │
│  Total Login Days: 67                                      │
│                                                              │
│  💰 ECONOMY                                               │
│  Chrono Dust Earned: 45,231                               │
│  Chrono Dust Spent: 38,892                                │
│  Time Shards Earned: 156                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Statistics Tracked

| Category | Statistics |
|----------|------------|
| **Play Time** | Total hours, average per day, most active period |
| **Battles** | Won, lost, win rate, best streak, this week |
| **Capsules** | Opened by rarity, total |
| **Collection** | Total artifacts, by rarity, by era, completion % |
| **Quests** | Daily completed, weekly completed, total |
| **Achievements** | Unlocked, total, percentage |
| **Museum** | Items displayed, era completions |
| **Streaks** | Current, longest, total days |
| **Economy** | Dust earned, dust spent, shards earned |

### 4.3 Weekly Summary

```
┌─────────────────────────────────────────────────────────────┐
│  📅 THIS WEEK                                              │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  Battles: 45 won / 12 lost (79%)                           │
│  Capsules: 12 opened                                       │
│  Artifacts: +8 new                                        │
│  XP Earned: 3,450                                         │
│  Days Active: 6/7                                           │
│                                                              │
│  vs Last Week: ⬆️ +15% activity                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Favorite Artifact System

### 5.1 Overview

Players can select one artifact to display prominently on their profile as their "signature piece."

### 5.2 Selection Rules

| Rule | Description |
|------|-------------|
| Any Owned Artifact | Can select any artifact in inventory |
| Change Anytime | No cooldown, instant change |
| Visible to All | Shown on public profile |
| Default | Most recently acquired legendary+ |

### 5.3 Favorite Display

```
┌─────────────────────────────────────────────────────────────┐
│  ❤️ FAVORITE ARTIFACT                                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │   🏺 Clay Tablet of Ur                              │ │
│  │   ═══════════════════════════════                    │ │
│  │   Level 15  •  Ancient Era  •  Legendary           │ │
│  │   Power: 847  •  Set: Royal Library (4/6)           │ │
│  │                                                      │ │
│  │   "One of the earliest written records of human    │ │
│  │    civilization, dating to 2600 BCE."               │ │
│  │                                                      │ │
│  │   [Change Favorite]                                  │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5.4 Selection Screen

```
┌─────────────────────────────────────────────────────────────┐
│  SELECT FAVORITE ARTIFACT                        [X]      │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  [Search artifacts...]                                      │
│                                                              │
│  SORT: [By Rarity ▼]  FILTER: [All Eras ▼]               │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ 🏆 Clay Tablet of Ur           [SELECT]            │ │
│  │    Level 15 • Legendary                           │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ ⚔️ Spartan Shield                 [SELECT]          │ │
│  │    Level 12 • Epic                                  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ 📜 Leonardo's Notes            [SELECT]              │ │
│  │    Level 10 • Rare                                 │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Profile Cosmetics

### 6.1 Overview

Profile cosmetics are visual customizations that allow players to express their identity. **All cosmetics are purely cosmetic — they do not affect gameplay.**

### 6.2 Cosmetic Categories

| Category | Examples | Acquisition |
|----------|----------|-------------|
| **Profile Frames** | Bronze, Silver, Gold, Platinum, Prismatic | Level rewards, achievements |
| **Animated Borders** | Fire, Water, Electric, Chrono | Special events, Prestige |
| **Backgrounds** | Era themes, Abstract patterns | Season pass, events |
| **Auras** | Chrono Glow, Golden Aura, Prismatic | Prestige milestones |
| **Badges** | Achievement badges, Event badges | Achievements, events |
| **Titles** | "Battle Legend", "Time Keeper" | Achievement unlocks |

### 6.3 Frame Gallery

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR FRAMES                                              │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  OWNED:                                                    │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │
│  │Bronze │ │Silver │ │ Gold  │ │Platinum│               │
│  │ ✓     │ │ ✓     │ │ ✓     │ │  ✓    │               │
│  └───────┘ └───────┘ └───────┘ └───────┘               │
│                                                              │
│  ┌───────┐ ┌───────┐ ┌───────┐                          │
│  │Prism  │ │Prestige│ │Chrono │                          │
│  │ 🔒   │ │Bronze │ │ Aura  │                          │
│  └───────┘ │  ✓    │ │ 🔒   │                          │
│            └───────┘ └───────┘                            │
│                                                              │
│  LOCKED: Level 75+ required                               │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Cosmetic Acquisition

| Cosmetic | Source | Type |
|----------|--------|------|
| Bronze Frame | Level 10 | Level reward |
| Silver Frame | Level 25 | Level reward |
| Gold Frame | Level 50 | Level reward |
| Platinum Frame | Level 75 | Level reward |
| Prismatic Frame | Level 100 | Level reward |
| Prestige Frames | Prestige levels | Prestige reward |
| Event Frames | Event completion | Event reward |
| Season Frames | Season pass | Season reward |
| Achievement Frames | Epic/Legendary achievements | Achievement reward |

### 6.5 Active Cosmetics

Players can equip multiple cosmetics simultaneously:

| Slot | Item Type | Default |
|------|-----------|---------|
| Frame | Profile border | Basic (level 1) |
| Background | Profile backdrop | Era default |
| Badge 1 | Achievement badge | Most recent |
| Badge 2 | Achievement badge | — |
| Badge 3 | Achievement badge | — |
| Title | Display title | Active title |

---

## 7. Badge System

### 7.1 Badge Categories

| Category | Description | Acquisition |
|----------|-------------|-------------|
| **Achievement** | Earned from achievements | Automatic on unlock |
| **Event** | Limited-time events | Event participation |
| **Special** | Launch, anniversary, milestone | Special occasions |
| **Season** | Season completion | Season pass |
| **Prestige** | Prestige level | Prestige milestones |

### 7.2 Notable Badges

| Badge | Category | Requirement | Rarity |
|-------|----------|-------------|--------|
| **Beta Player** | Special | Played during beta | Legendary |
| **Founder** | Special | Day 1 players | Legendary |
| **Historian** | Achievement | Complete all museum entries | Epic |
| **Event Champion** | Event | Win 10 events | Epic |
| **Collection Master** | Achievement | Collect all artifacts | Legendary |
| **Battle Legend** | Achievement | Win 1000 battles | Legendary |
| **Time Keeper** | Achievement | 100-day streak | Epic |
| **Social Butterfly** | Achievement | Add 50 friends | Epic |
| **Season Hero** | Season | Complete 5 seasons | Epic |
| **Prestige 10** | Prestige | Reach Prestige 10 | Epic |

### 7.3 Badge Showcase

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR BADGES (23/50)                                       │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  SHOWCASE (3 slots):                                       │
│  ┌───────┐ ┌───────┐ ┌───────┐                          │
│  │Founder │ │Battle │ │Historian│                         │
│  │ ★★★★★ │ │Legend │ │  ★★★  │                          │
│  └───────┘ └───────┘ └───────┘                          │
│                                                              │
│  [Edit Showcase]                                            │
│                                                              │
│  ALL BADGES:                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ★★★★★ FOUNDER                                       │   │
│  │ Day 1 player - 2026                                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ★★★★ BATTLE LEGEND                                 │   │
│  │ Win 1000 battles                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ★★★ HISTORIAN                                      │   │
│  │ Complete all museum entries                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Badge Display Rules

- **Achievement badges:** Permanent, never removed
- **Event badges:** Permanent after earning
- **Special badges:** Permanent
- **Season badges:** Permanent after season completion
- **Showcase slots:** Unlocked at 10, 30, 50 achievements

---

## 8. Public Profile Visibility

### 8.1 Visibility Settings

Players control who can see their full profile.

| Setting | Description |
|---------|-------------|
| **Public** | Anyone can view full profile |
| **Friends Only** | Only Telegram friends can view |
| **Private** | Only self-visible |

### 8.2 Profile Visibility Settings

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 PROFILE VISIBILITY                                     │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  Who can see your profile?                                  │
│                                                              │
│  ○ Public                                                  │
│    Everyone can view your profile                          │
│                                                              │
│  ● Friends Only                                            │
│    Only your Telegram friends can view                     │
│                                                              │
│  ○ Private                                                 │
│    Only you can see your profile                           │
│                                                              │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  VISIBLE TO OTHERS:                                       │
│  ✓ Level and Title                                        │
│  ✓ Collection %                                            │
│  ✓ Favorite Artifact                                       │
│  ✓ Badges (showcase only)                                 │
│  ✓ Join Date                                               │
│                                                              │
│  🔒 Always Hidden:                                         │
│  • Exact XP and progress                                    │
│  • Currency balances                                       │
│  • Full statistics                                         │
│  • Inventory contents                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Public Profile (Other Player View)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 TimeKeeper_Mike                                        │
│  ⭐ Level 32 • "Battle Legend"                           │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  Artifacts: 67/82 (82%)                                   │
│  Achievements: 45/125                                     │
│  Joined: January 15, 2026                                  │
│                                                              │
│  ❤️ Favorite: Clay Tablet of Ur (Lvl 15)                 │
│                                                              │
│  🏆 Badges: Founder, Battle Legend, Historian            │
│                                                              │
│  [View Full Profile] (if Friends Only)                     │
│  [Send Gift]  [Add Friend]                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Hall of Fame System

### 9.1 Overview

The Hall of Fame celebrates top players across various categories, providing recognition and goals for competitive players.

### 9.2 Leaderboard Categories

| Category | Ranking Criteria | Display |
|----------|------------------|--------|
| **Highest Level** | Player level (1-100) | Top 100 |
| **Top Collectors** | Artifacts collected (percentage) | Top 100 |
| **Museum Masters** | Museum score | Top 50 |
| **Achievement Hunters** | Achievements unlocked | Top 100 |
| **Battle Champions** | Total battles won | Top 100 |
| **Event Winners** | Events won | Top 50 |
| **Prestige Elite** | Prestige level | Top 25 |

### 9.3 Hall of Fame Display

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 HALL OF FAME                                          │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  CATEGORY: [Level ▼]  PERIOD: [All Time ▼]                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🥇 1. @ChronoMaster                                │   │
│  │     Level 87 • Prestige 3                          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🥈 2. @TimeKeeper_Elite                           │   │
│  │     Level 82 • Prestige 2                          │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🥉 3. @ArtifactQueen                              │   │
│  │     Level 78 • Prestige 1                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [4] @CollectorPro .......... Level 75                    │
│  [5] @BattleMaster .......... Level 72                    │
│  [6] @MuseumKeeper ......... Level 70                    │
│                                                              │
│  Your Rank: #147                                          │
│  Level 32 • Need Level 45 for Top 100                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 9.4 Era-Specific Leaderboards

| Era | Leaderboard | Criteria |
|-----|-------------|----------|
| Mesopotamia | Mesopotamia Masters | Era-specific artifacts |
| Egypt | Egyptian Elite | Era-specific artifacts |
| Greece | Greek Champions | Era-specific artifacts |
| Rome | Roman Legends | Era-specific artifacts |

### 9.5 Hall of Fame Rewards

- **Top 10:** Special "Hall of Fame" badge
- **Top 100:** Featured on public leaderboard
- **Monthly #1:** Animated crown icon (30 days)
- **Weekly #1:** Special "Weekly Champion" badge

---

## 10. Profile Philosophy

### 10.1 Core Values

**Celebrate Progression:**
- Every level feels earned
- Visible progress everywhere
- Milestone celebrations
- Achievement recognition

**Encourage Collection:**
- Collection percentage prominent
- Artifact showcase options
- Set completion tracking
- Era progress display

**Reward Dedication:**
- Long-term achievements recognized
- Streak tracking visible
- Play time acknowledged
- Rare accomplishments celebrated

**Avoid Pay-to-Win:**
- All cosmetics purely visual
- No gameplay advantages via profile
- Level-based content unlocked by play, not purchase
- Achievements earnable by all

### 10.2 Design Principles

```
PROFILE DESIGN RULES:
✅ Every player profile tells a story
✅ Progress is visible and celebrated
✅ Cosmetics are expressive, not powerful
✅ Statistics are comprehensive but respectful
✅ Privacy controls are granular
✅ Competition is optional, not mandatory
✅ Social features enhance without pressure
```

### 10.3 Anti-P2W Commitment

| Allowed | Never Allowed |
|---------|----------------|
| Cosmetic frames | Level-boosting items |
| Cosmetic badges | XP multipliers |
| Cosmetic titles | Battle advantages |
| Cosmetic backgrounds | Collection shortcuts |
| Profile customization | Any gameplay power |

### 10.4 Player Expression

The profile system allows players to express:

- **Identity:** Custom avatar, nickname, favorite artifact
- **Achievement:** Badges, frames, titles
- **Dedication:** Level, play time, streaks
- **Collection:** Artifact count, era completion
- **Personality:** Background choices, aura effects

---

## 11. Profile Data Structure

### 11.1 Player Profile Schema

```yaml
player_profile:
  user_id: "Telegram user ID"
  
  display:
    nickname: "Player-chosen or Telegram name"
    custom_avatar: "URL or null"
    telegram_username: "@username"
    
  progression:
    level: 32
    current_xp: 2340
    xp_to_next_level: 3500
    prestige_level: 0
    total_prestige_xp: 0
    
  showcase:
    active_title: "Battle Legend"
    active_frame: "gold_frame"
    active_background: "ancient_era"
    active_aura: null
    favorite_artifact_id: "artifact_123"
    badge_showcase: ["badge_founder", "badge_battle_legend", "badge_historian"]
    
  visibility:
    profile_visibility: "friends_only"  # public, friends_only, private
    show_level: true
    show_collection: true
    show_statistics: false
    
  lifetime_stats:
    total_playtime_seconds: 457200
    battles_won: 347
    battles_lost: 89
    capsules_opened: 234
    artifacts_collected: 67
    quests_completed: 112
    achievements_unlocked: 45
    museum_items: 23
    current_streak: 12
    longest_streak: 23
    total_login_days: 67
    dust_earned: 45231
    dust_spent: 38892
    
  metadata:
    joined_at: "2026-01-15T00:00:00Z"
    last_active: "2026-06-23T14:30:00Z"
```

### 11.2 Cosmetic Inventory Schema

```yaml
cosmetic_inventory:
  user_id: "Telegram user ID"
  
  owned:
    frames: ["bronze", "silver", "gold"]
    backgrounds: ["default", "ancient_era", "egyptian_theme"]
    badges: ["founder", "battle_legend", "historian", ...]
    auras: []
    
  equipped:
    frame: "gold"
    background: "ancient_era"
    aura: null
    
  unlocked_showcase_slots: 2  # Unlocked at 10, 30 achievements
```

---

## 12. Integration with Other Systems

### 12.1 Connected Systems

| System | Connection | Data Flow |
|--------|------------|-----------|
| **Level System** | XP sources feed level | Profile shows level |
| **Achievement System** | Badges unlock | Profile showcases badges |
| **Collection System** | Artifact count | Profile shows completion |
| **Museum System** | Museum progress | Profile shows museum % |
| **Streak System** | Streak data | Profile shows current/longest |
| **Economy System** | Currency earned/spent | Private stats |
| **Social System** | Friends list | Profile visibility |
| **Season System** | Season badges | Profile shows season progress |

### 12.2 Cross-System Display

```
┌─────────────────────────────────────────────────────────────┐
│  📊 PROGRESSION SUMMARY                                    │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  Level 32  ████████████░░░░░░░░░  Prestige 0              │
│                                                              │
│  Collection: 67/82 (82%)        Achievements: 45/125 (36%) │
│  ████████████████████████░░░░░  ██████████████░░░░░░░░░░ │
│                                                              │
│  Museum: 23/45 (51%)            Streak: 12 days           │
│  ██████████████████░░░░░░░░░░░  🔥🔥🔥                  │
│                                                              │
│  Battles: 347W / 89L (79%)      Play Time: 127h          │
└─────────────────────────────────────────────────────────────┘
```

---

*Every profile tells the story of a player's journey through time. Let that story be worth telling.*
