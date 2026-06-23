# Jolt Time — Daily Missions and Activity System

## Overview

The Daily Missions system is Jolt Time's primary engagement driver, providing structured daily objectives that guide players through varied gameplay activities. The system is designed to be **accessible, rewarding, and never exhausting** — with daily activities taking approximately 10-20 minutes to complete fully.

---

## 1. Daily Mission System

### 1.1 Mission Generation

New missions are generated every day at **00:00 UTC**. Each player receives a personalized set of missions based on their:

- Player level and progression
- Unlocked eras and features
- Historical completion patterns
- Recent activity

```
Daily Mission Refresh:
┌─────────────────────────────────────────┐
│  MISSION REGENERATION                   │
│                                         │
│  • Reset Time: 00:00 UTC (daily)       │
│  • Generation: Server-side automated    │
│  • Personalization: Based on player    │
│  • Category Variety: 2-3 categories     │
│  • Difficulty Balance: 1 Easy, 1 Hard  │
│                                         │
│  New missions available in:             │
│  ⏰ 08:34:21                           │
└─────────────────────────────────────────┘
```

### 1.2 Daily Mission Count

Players receive **3 daily missions** per day. This provides:

- Enough variety to prevent monotony
- Sufficient reward opportunities
- Manageable time investment
- Clear completion goals

### 1.3 Mission Categories

| Category | Description | Example Missions |
|----------|-------------|------------------|
| **Login** | Simple daily actions | Open the game, Claim daily reward |
| **Battle** | Combat objectives | Win 3 battles, Complete 2 missions |
| **Artifact** | Collection goals | Collect 3 artifacts, Open a capsule |
| **Collection** | Completion objectives | Upgrade an artifact, Visit museum |
| **Social** | Community activities | Send a gift, Add a friend |
| **AdsGram** | Optional ad watching | Watch 2 rewarded ads (optional) |
| **Exploration** | Discovery goals | Visit a new era, Complete tutorial |

---

## 2. Mission Categories Detail

### 2.1 Login Missions

The simplest mission category, rewarding daily engagement.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Open the Game" | Launch Jolt Time | Easy | 25 XP, 10 Chrono Dust |
| "Claim Daily Reward" | Collect login bonus | Easy | 50 XP, 25 Chrono Dust |
| "Check Notifications" | View notification center | Easy | 15 XP |
| "Visit Home Screen" | Return to main hub | Easy | 10 XP |

### 2.2 Battle Missions

Combat-focused objectives for active players.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Win 1 Battle" | Complete a mission | Easy | 50 XP, 20 Dust |
| "Win 3 Battles" | Complete three missions | Medium | 100 XP, 40 Dust |
| "Win 5 Battles" | Complete five missions | Hard | 200 XP, 80 Dust |
| "Complete Without Energy" | Win a mission using boosts | Hard | 150 XP, 50 Dust, 1hr 2x XP |
| "Era Champion" | Win 2 battles in same era | Medium | 100 XP, 45 Dust |

### 2.3 Artifact Missions

Collection-focused objectives driving progression.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Collect 1 Artifact" | Acquire any artifact | Easy | 40 XP, 15 Dust |
| "Collect 3 Artifacts" | Acquire three artifacts | Medium | 80 XP, 35 Dust |
| "Collect 5 Artifacts" | Acquire five artifacts | Hard | 175 XP, 75 Dust |
| "Rare Find" | Collect a Rare+ artifact | Hard | 200 XP, 100 Dust |
| "Duplicate Collector" | Collect 3 duplicates | Medium | 60 XP, 30 Dust |

### 2.4 Collection Missions

Upgrading and organizing collected items.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Upgrade an Artifact" | Enhance one artifact | Easy | 50 XP, 25 Dust |
| "Upgrade 3 Artifacts" | Enhance three artifacts | Medium | 120 XP, 60 Dust |
| "Visit the Museum" | View museum screen | Easy | 30 XP, 10 Dust |
| "Museum Explorer" | View 3 museum sections | Medium | 75 XP, 30 Dust |
| "Set Collector" | Complete one artifact set | Hard | 250 XP, 150 Dust |

### 2.5 Social Missions

Community engagement objectives.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Send a Gift" | Send energy to a friend | Easy | 40 XP, 20 Dust |
| "Make a Friend" | Add a new friend | Easy | 50 XP, 25 Dust |
| "Help a Friend" | Send gift + complete battle | Medium | 100 XP, 50 Dust |
| "Social Butterfly" | Send 3 gifts today | Medium | 80 XP, 40 Dust |

### 2.6 AdsGram Missions

**Strictly optional** ad-watching objectives.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Watch 1 Ad" | View a rewarded ad | Easy | 50 XP, 25 Dust |
| "Watch 2 Ads" | View two rewarded ads | Medium | 100 XP, 50 Dust |
| "Watch 3 Ads" | View three rewarded ads | Hard | 175 XP, 100 Dust |

> **Critical Rule:** Ads are ALWAYS optional. Players may complete all missions without watching any ads. Ads must never block gameplay progression.

### 2.7 Exploration Missions

Discovery-focused objectives.

| Mission | Objective | Difficulty | Reward |
|---------|-----------|------------|--------|
| "Visit Egypt" | Travel to Egypt era | Easy | 40 XP, 15 Dust |
| "Era Tourist" | Visit any new era | Medium | 75 XP, 30 Dust |
| "World Traveler" | Visit 3 different eras | Hard | 150 XP, 60 Dust |
| "Complete Tutorial" | Finish tutorial section | Easy | 50 XP, 20 Dust |

---

## 3. Difficulty Levels

### 3.1 Difficulty Structure

| Difficulty | Time Required | Reward Multiplier | Examples |
|------------|--------------|------------------|----------|
| **Easy** | 1-2 minutes | 1.0x base | Login, simple collection |
| **Medium** | 3-5 minutes | 1.5x base | Multiple actions, some grinding |
| **Hard** | 5-10 minutes | 2.0x base | Significant effort, rare items |

### 3.2 Daily Distribution

For each set of 3 daily missions:

- **1 Easy** mission guaranteed (ensures accessibility)
- **1 Medium** mission guaranteed (moderate challenge)
- **1 Hard** mission (aspirational goal)

### 3.3 Difficulty Scaling

Mission difficulty adapts to player level:

| Player Level | Easy Tasks | Medium Tasks | Hard Tasks |
|--------------|------------|--------------|------------|
| 1-10 | Collect 1 artifact | Collect 3 artifacts | Win 5 battles |
| 11-25 | Win 1 battle | Win 3 battles | Win 7 battles |
| 26-50 | Visit museum | View 3 sections | Complete set |
| 51+ | Any category | Any category | Any category |

---

## 4. Reward System

### 4.1 Reward Types

| Reward Type | Examples | Frequency |
|-------------|----------|-----------|
| **XP** | Experience points | Every mission |
| **Chrono Dust** | Soft currency | Every mission |
| **Energy** | Gameplay resource | Common |
| **Boosters** | Temporary buffs | Medium-Hard missions |
| **Cosmetic Items** | Badges, frames | Hard missions |
| **Event Currency** | Limited tokens | During events |

### 4.2 Reward Values by Difficulty

| Difficulty | XP Range | Dust Range | Special |
|------------|----------|------------|---------|
| Easy | 25-50 | 10-25 | — |
| Medium | 75-125 | 30-60 | Small boosters |
| Hard | 150-250 | 75-150 | Large boosters, cosmetics |

### 4.3 Reward Preview

Every mission displays its reward before completion:

```
┌─────────────────────────────────────────┐
│  📋 MISSION                            │
│  "Win 3 Battles"                      │
│                                         │
│  Difficulty: Medium                     │
│  Progress: ██░░░░░░░░ 2/3            │
│                                         │
│  🎁 REWARD PREVIEW:                     │
│  ┌─────────────────────────────────┐   │
│  │  • 100 XP                       │   │
│  │  • 40 Chrono Dust               │   │
│  │  • 1hr 2x XP Boost             │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Daily Streak System

### 5.1 Streak Integration

Daily mission completion contributes to the overall **Daily Streak System**. See `knowledge/streaks.md` for complete details.

### 5.2 Streak Milestones

| Streak Day | Title | XP Bonus | Energy/Day | Special Unlock |
|------------|-------|----------|------------|---------------|
| 1 | Newcomer | +5% XP | — | — |
| 3 | Regular | +10% XP | +5 Energy | — |
| 7 | Devoted | +15% XP | +10 Energy | Weekly Capsule |
| 14 | Loyal | +20% XP | +15 Energy | Rare Capsule |
| 30 | Dedicated | +25% XP | +20 Energy | Epic Capsule |
| 60 | Committed | +30% XP | +25 Energy | Legendary Capsule |
| 100 | Master | +40% XP | +30 Energy | Mythic Capsule |

### 5.3 Mission-Specific Streak Rewards

Completing all daily missions provides bonus streak contributions:

| Missions Completed | Streak Bonus |
|-------------------|--------------|
| 1 of 3 | +0.33 day |
| 2 of 3 | +0.66 day |
| 3 of 3 | +1 day |

### 5.4 Exclusive Cosmetic Rewards

Long streaks unlock exclusive items:

| Streak | Reward |
|--------|--------|
| 7 days | "Devoted" badge |
| 14 days | "Loyal" frame |
| 30 days | "Dedicated" title + badge |
| 60 days | "Committed" aura |
| 100 days | "Master" animated badge |

---

## 6. Weekly Missions

### 6.1 Weekly Mission Structure

Larger objectives spanning 7 days with better rewards.

| Mission | Objective | Reward |
|---------|-----------|--------|
| "Battle Master" | Win 30 battles | 500 XP, 250 Dust, Rare Capsule |
| "Collector" | Collect 25 artifacts | 600 XP, 300 Dust, Epic Capsule |
| "Era Explorer" | Visit all unlocked eras | 400 XP, 200 Dust, 2hr 2x Boost |
| "Social Hour" | Send 15 gifts | 350 XP, 175 Dust, "Helper" badge |
| "Adventurer" | Complete 50 missions | 750 XP, 400 Dust, Legendary Capsule |

### 6.2 Weekly Reset

- **Reset Time:** Monday 00:00 UTC
- **Duration:** 7 days
- **Progress Tracking:** Cumulative, visible at all times
- **Incomplete Missions:** Do not carry over

### 6.3 Weekly Mission Screen

```
┌─────────────────────────────────────────┐
│  📅 WEEKLY MISSIONS       Day 3 of 7   │
│  Week: June 16-22, 2026               │
├─────────────────────────────────────────┤
│                                         │
│  Progress: ███████░░░░░░ 40%         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔥 Battle Master        18/30  │   │
│  │   Win 30 battles this week      │   │
│  │   Reward: 500 XP, 250 Dust      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎨 Collector             12/25  │   │
│  │   Collect 25 artifacts          │   │
│  │   Reward: 600 XP, 300 Dust      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🌍 Era Explorer          5/8    │   │
│  │   Visit all unlocked eras        │   │
│  │   Reward: 400 XP, 200 Dust      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  WEEKLY TOTAL POTENTIAL:                │
│  2,250 XP + 1,125 Dust + Capsules     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Monthly Missions

### 7.1 Monthly Mission Structure

Long-term objectives with premium rewards.

| Mission | Objective | Reward |
|---------|-----------|--------|
| "Legendary Collector" | Collect 100 artifacts | 2000 XP, 1000 Dust, Legendary Capsule |
| "Battle Veteran" | Win 200 battles | 2500 XP, 1500 Dust, Epic Capsule |
| "Era Master" | Complete 3 full artifact sets | 3000 XP, 2000 Dust, Exclusive Frame |
| "Social Champion" | Send 100 gifts | 1500 XP, 750 Dust, "Champion" badge |

### 7.2 Monthly Reset

- **Reset Time:** 1st of month 00:00 UTC
- **Duration:** 28-31 days
- **Progress:** Persistent throughout month
- **Incomplete:** Reset with month

### 7.3 Premium Monthly Rewards

Monthly missions offer higher-tier cosmetics:

```
MONTHLY MISSION REWARDS:
┌─────────────────────────────────────────┐
│  🏆 LEGENDARY COLLECTOR                │
│                                         │
│  Objective: Collect 100 artifacts       │
│  Progress: 67/100                      │
│                                         │
│  COMPLETION REWARDS:                    │
│  • 2,000 XP                           │
│  • 1,000 Chrono Dust                  │
│  • 1 Legendary Capsule                 │
│  • "Collection Master" Title           │
│  • Exclusive Frame: "Golden Era"       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Mission Reroll System

### 8.1 Free Daily Reroll

Every player receives **1 free reroll per day**.

| Feature | Details |
|---------|---------|
| **Free Rerolls** | 1 per day |
| **Reset** | 00:00 UTC daily |
| **Cost** | Free |
| **Availability** | All players |

### 8.2 How Reroll Works

```
MISSION REROLL FLOW:
┌─────────────────────────────────────────┐
│  Current Mission:                       │
│  "Win 5 Battles" (Hard)                │
│  Reward: 200 XP, 80 Dust               │
│                                         │
│  [ 🔄 REROLL MISSION ]                 │
│                                         │
│  ↓ Swaps to new mission ↓              │
│                                         │
│  New Mission:                           │
│  "Collect 5 Artifacts" (Hard)          │
│  Reward: 175 XP, 75 Dust               │
│                                         │
│  Note: Progress resets for new mission  │
└─────────────────────────────────────────┘
```

### 8.3 Premium Rerolls (Future)

Future Season Pass holders may receive additional rerolls:

| Tier | Additional Rerolls |
|------|-------------------|
| Free | 1 per day |
| Season Pass | 2 per day |
| Premium+ | 3 per day |

### 8.4 Reroll Rules

- Reroll only swaps the selected mission
- Progress on other missions unchanged
- Cannot reroll the same mission twice
- Reroll regenerates from same category pool
- Daily reset restores all 3 original missions

---

## 9. AdsGram Integration

### 9.1 Optional Ad Missions

AdsGram missions are **never required** and clearly labeled as optional.

| Mission | Requirement | Obligation |
|---------|-------------|------------|
| "Watch 1 Ad" | View rewarded ad | Completely opt-in |
| "Watch 2 Ads" | View 2 rewarded ads | Player chooses |
| "Ad Bonus" | Double rewards for watching | Always optional |

### 9.2 Implementation Philosophy

> **Players may complete missions without ads. Ads must never block gameplay.**

```
ADSGRAM PHILOSOPHY:
✅ Missions completable WITHOUT watching ads
✅ Clear labeling: "Optional" or "(Watch Ad)"
✅ Easy opt-out without punishment
✅ Rewards for watching ads are BONUS, not requirement
❌ Never force players to watch ads
❌ Never block gameplay behind ad walls
❌ Never make ads required for progression
```

### 9.3 Ad Reward Acceleration

Players who choose to watch ads receive accelerated rewards:

```
┌─────────────────────────────────────────┐
│  MISSION: "Win 3 Battles"               │
│                                         │
│  BASE REWARD:                           │
│  • 100 XP                              │
│  • 40 Chrono Dust                      │
│                                         │
│  OPTIONAL AD BOOST:                     │
│  Watch ad for +50% bonus:               │
│  • 150 XP (+50)                        │
│  • 60 Dust (+20)                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  [Watch Ad for +50% Reward]     │   │
│  │  [Complete Base Mission]         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 9.4 Anti-Coercion Rules

| Rule | Enforcement |
|------|-------------|
| Ads always optional | Cannot be required for any mission |
| No ad walls | Core gameplay never behind ad |
| Clear labeling | Every ad mission shows "Optional" |
| Easy skip | One tap to complete without ads |
| No punishment | Skipping ads has no penalty |

---

## 10. Anti-Burnout Philosophy

### 10.1 Time Investment Guidelines

Daily activities should take approximately **10-20 minutes** for full completion.

| Mission Type | Time per Mission | Total Daily |
|--------------|------------------|-------------|
| Easy | 1-2 min | 3-6 min |
| Medium | 3-5 min | 9-15 min |
| Hard | 5-10 min | — |

### 10.2 Design Principles

```
ANTI-BURNOUT RULES:
✅ Never force excessive grind
✅ Allow incomplete missions without punishment
✅ Provide variety in daily objectives
✅ Make easy missions accessible to all
✅ Allow skip without penalty
✅ Progressive difficulty respects player time
✅ Weekend activities are bonuses, not requirements
```

### 10.3 Completion Philosophy

Players should feel rewarded for **any** engagement, not pressured to complete everything:

```
COMPLETION PHILOSOPHY:
┌─────────────────────────────────────────┐
│  PROGRESS: 2/3 MISSIONS                │
│                                         │
│  ✓ Mission 1: Complete! (+100 XP)     │
│  ✓ Mission 2: Complete! (+80 XP)      │
│  ○ Mission 3: Incomplete               │
│                                         │
│  Today's Earned: 180 XP                │
│  Remaining: 75 XP available            │
│                                         │
│  No pressure! Complete when ready.     │
│  Resets in: 08:34:21                   │
│                                         │
└─────────────────────────────────────────┘
```

### 10.4 Quality of Life

| Feature | Implementation |
|---------|----------------|
| **Incomplete Missions** | Carry rewards but reset daily |
| **Flexible Completion** | Any order, any time of day |
| **No Hardcore Requirement** | Casual play fully supported |
| **Session Flexibility** | Multiple short sessions OK |

---

## 11. Future Expansion

### 11.1 Seasonal Missions

Major objectives aligned with 8-week seasons.

```yaml
seasonal_missions:
  reset: "Every season (8 weeks)"
  count: "3-5 major quests"
  difficulty: "Hard"
  
  examples:
    - "Complete all era collections"
    - "Reach Level 50"
    - "Collect 500 artifacts"
  
  rewards:
    - Season-exclusive cosmetics
    - "Season Champion" title
    - Exclusive animated badges
```

### 11.2 Guild Missions

Group objectives for guild members.

```yaml
guild_missions:
  available: "Guild members only"
  types:
    - collective: "Guild total contributions"
    - cooperative: "Group objectives"
    - competitive: "Guild vs guild"
  
  examples:
    - "Guild collects 10,000 artifacts"
    - "Complete 5 raids together"
    - "Win guild war"
  
  rewards:
    - Guild points
    - Shared guild bonuses
    - Individual contributions tracked
```

### 11.3 Friend Missions

Objectives involving friend interactions.

```yaml
friend_missions:
  available: "Players with 1+ friends"
  types:
    - gift_exchange: "Send/receive gifts"
    - battles: "Challenge friends"
    - cooperation: "Help complete friend goals"
  
  examples:
    - "Send 5 gifts to friends"
    - "Challenge a friend to battle"
    - "Help friend complete mission"
  
  rewards:
    - Bonus XP for social actions
    - Friend-themed cosmetics
    - "Best Pal" badges
```

### 11.4 Event Missions

Limited-time objectives during special events.

```yaml
event_missions:
  available: "During events only"
  duration: "3-14 days typical"
  count: "5-10 quests"
  difficulty: "Variable"
  
  examples:
    - "Collect 50 event artifacts"
    - "Complete event story"
    - "Reach event leaderboard top 100"
  
  rewards:
    - Event-exclusive items
    - Event badges
    - Event currencies
```

### 11.5 Collaborative Missions

Community-wide objectives.

```yaml
collaborative_missions:
  scope: "All active players"
  tracking: "Aggregate community progress"
  duration: "7-14 days"
  
  examples:
    - "Community collects 1M artifacts"
    - "Global playtime milestone"
    - "Festival participation rate"
  
  rewards:
    - Universal bonuses for all
    - Celebration events
    - Community achievement badges
```

### 11.6 System Architecture

```yaml
mission_system_architecture:
  base_mission:
    id: string
    category: enum
    difficulty: enum
    description: string
    requirements: object
    rewards: object
    is_ads: boolean
  
  mission_providers:
    daily_provider: "3 missions, balanced difficulty"
    weekly_provider: "5 missions, medium-hard"
    monthly_provider: "4 missions, hard"
    seasonal_provider: "3-5 quests, hard"
    guild_provider: "Group objectives"
    friend_provider: "Social objectives"
    event_provider: "Variable scope"
  
  reroll_system:
    free_rerolls: 1
    premium_rerolls: 2-3
    reroll_scope: "Single mission only"
```

---

## 12. Full Mission Structure Summary

### 12.1 Mission Types

| Type | Count | Difficulty | Reset |
|------|-------|------------|-------|
| **Daily** | 3 | Easy/Medium/Hard | 00:00 UTC |
| **Weekly** | 5 | Medium/Hard | Monday 00:00 UTC |
| **Monthly** | 4 | Hard | 1st of month |
| **Seasonal** | 3-5 | Hard | 8-week seasons |
| **Event** | 5-10 | Variable | Event duration |
| **Guild** | 3 | Medium/Hard | Weekly |
| **Friend** | 3 | Easy/Medium | Daily |

### 12.2 Mission Categories

| Category | Daily | Weekly | Monthly |
|----------|-------|--------|---------|
| Login | ✓ | — | — |
| Battle | ✓ | ✓ | ✓ |
| Artifact | ✓ | ✓ | ✓ |
| Collection | ✓ | ✓ | ✓ |
| Social | ✓ | ✓ | ✓ |
| AdsGram | ✓ | — | — |
| Exploration | ✓ | ✓ | — |

### 12.3 Reward Tiers

| Mission Type | XP Range | Dust Range | Special |
|--------------|----------|------------|---------|
| Easy Daily | 25-50 | 10-25 | — |
| Medium Daily | 75-125 | 30-60 | Small boosters |
| Hard Daily | 150-250 | 75-150 | Large boosters |
| Weekly | 350-750 | 175-400 | Capsules |
| Monthly | 1500-3000 | 750-2000 | Legendary items |
| Seasonal | 2000-5000 | 1000-3000 | Exclusive cosmetics |

---

## 13. Reward Philosophy

### 13.1 Reward Principles

```
REWARD PHILOSOPHY:
✅ Every mission delivers meaningful value
✅ Rewards scale with effort required
✅ Cosmetics as aspirational goals
✅ No gameplay power via rewards
✅ Fair progression without pay-to-win
✅ boosters enhance rather than gate
```

### 13.2 Reward Balance

| Difficulty | Time | XP/Dust Ratio | Special |
|-----------|------|---------------|---------|
| Easy | 1-2 min | 1.0x | — |
| Medium | 3-5 min | 1.5x | Small boost |
| Hard | 5-10 min | 2.0x | Large boost/cosmetic |

### 13.3 Cosmetic Reward Placement

| Mission Difficulty | Cosmetic Chance | Example Rewards |
|-------------------|----------------|-----------------|
| Easy | 0% | — |
| Medium | 10% | Small badges |
| Hard | 25% | Frames, badges |
| Weekly | 50% | Rare cosmetics |
| Monthly | 75% | Legendary items |

---

## 14. Streak System Overview

### 14.1 Streak Integration with Missions

| Daily Missions | Streak Contribution |
|----------------|---------------------|
| 0 complete | +0 days |
| 1 complete | +0.33 days |
| 2 complete | +0.66 days |
| 3 complete | +1 day |

### 14.2 Streak Benefits

| Streak Level | Title | Benefits |
|--------------|-------|----------|
| 1-2 | Newcomer | +5% XP |
| 3-6 | Regular | +10% XP, +5 Energy/day |
| 7-13 | Devoted | +15% XP, +10 Energy, Weekly Capsule |
| 14-29 | Loyal | +20% XP, +15 Energy, Rare Capsule |
| 30-59 | Dedicated | +25% XP, +20 Energy, Epic Capsule |
| 60-99 | Committed | +30% XP, +25 Energy, Legendary Capsule |
| 100+ | Master | +40% XP, +30 Energy, Mythic Capsule |

### 14.3 Streak Protection

- **Grace Period:** 12-96 hours based on streak length
- **Temporal Shields:** Extend grace by 48 hours
- **Recovery:** Complete 3 missions within 24 hours

---

## 15. Retention Strategy

### 15.1 Mission-Driven Retention

| Retention Goal | Mission Strategy |
|---------------|------------------|
| Daily Return | Short, easy daily missions |
| Session Length | Multiple quick objectives |
| Progression | Cumulative weekly/monthly goals |
| Community | Social and guild missions |
| Long-term | Seasonal objectives |

### 15.2 Retention Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Daily Mission Completion | >70% | Players completing all 3 |
| Average Missions/Day | 2.5 | Engagement depth |
| Weekly Mission Completion | >40% | Mid-term engagement |
| Monthly Mission Completion | >20% | Long-term retention |

### 15.3 Anti-Churn Design

```
RETENTION FEATURES:
✅ Easy missions for casual players
✅ Flexible completion (any order, any time)
✅ No punishment for incomplete missions
✅ Multiple session support
✅ Variety prevents boredom
✅ Clear reward visibility
✅ Streak bonuses reward consistency
✅ Return player catch-up rewards
```

---

## 16. Technical Implementation Notes

### 16.1 Data Model

```typescript
interface DailyMission {
  id: string;
  playerId: string;
  category: MissionCategory;
  difficulty: Difficulty;
  description: string;
  requirements: MissionRequirement;
  progress: number;
  isComplete: boolean;
  isClaimed: boolean;
  rewards: MissionReward[];
  expiresAt: Date;
  createdAt: Date;
}

interface MissionRequirement {
  type: 'login' | 'battle' | 'collect' | 'upgrade' | 'social' | 'watch' | 'visit';
  target: string;
  count: number;
  metadata?: object;
}

interface MissionReward {
  type: 'xp' | 'dust' | 'energy' | 'booster' | 'cosmetic' | 'currency';
  itemId?: string;
  quantity: number;
}
```

### 16.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/missions/daily` | GET | Get daily missions |
| `/missions/weekly` | GET | Get weekly missions |
| `/missions/monthly` | GET | Get monthly missions |
| `/missions/progress` | POST | Update mission progress |
| `/missions/claim` | POST | Claim mission reward |
| `/missions/reroll` | POST | Reroll a mission |

### 16.3 Performance Requirements

| Metric | Target |
|--------|--------|
| Mission Load | < 100ms |
| Progress Update | < 50ms |
| Claim Processing | < 200ms |
| Reroll Response | < 150ms |

---

## 17. Example Screens

### 17.1 Daily Missions Screen

```
┌─────────────────────────────────────────┐
│  📋 DAILY MISSIONS           ⏰ 14:32:05│
│  "Resets at 00:00 UTC"                  │
├─────────────────────────────────────────┤
│                                         │
│  Progress: ████████░░ 2/3 Complete   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✓ Win 1 Battle         Easy     │   │
│  │   REWARD: 50 XP, 20 Dust       │   │
│  │   ✓ CLAIMED                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ● Collect 3 Artifacts  Medium  │   │
│  │   Progress: ██████░░░░ 3/3    │   │
│  │   REWARD: 100 XP, 40 Dust       │   │
│  │   [CLAIM REWARD]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ○ Watch 2 Ads (Optional) Hard  │   │
│  │   Progress: ░░░░░░░░░░ 0/2    │   │
│  │   REWARD: 175 XP, 100 Dust      │   │
│  │   [Watch Ad for +50% Bonus]     │   │
│  │   or [Skip - Complete Later]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│  TODAY'S TOTAL: 325 XP, 160 Dust       │
│  Claimed: 150 XP, 60 Dust              │
│  Pending: 175 XP, 100 Dust             │
│                                         │
│  🔄 REROLL AVAILABLE (1 free today)     │
│                                         │
└─────────────────────────────────────────┘
```

### 17.2 Weekly Progress Screen

```
┌─────────────────────────────────────────┐
│  📅 WEEKLY MISSIONS          Day 4/7   │
├─────────────────────────────────────────┤
│                                         │
│  Overall Progress: ████████░░ 65%     │
│                                         │
│  🔥 Battle Master                       │
│  ████████████████░░░░░░ 23/30          │
│  Reward: 500 XP, 250 Dust               │
│                                         │
│  🎨 Collector                          │
│  ██████████████░░░░░░░ 18/25          │
│  Reward: 600 XP, 300 Dust               │
│                                         │
│  🌍 Era Explorer                        │
│  ██████████████████░░ 6/8              │
│  Reward: 400 XP, 200 Dust               │
│                                         │
│  👥 Social Hour                        │
│  ████░░░░░░░░░░░░░░░░ 8/15           │
│  Reward: 350 XP, 175 Dust              │
│                                         │
│  ⚔️ Adventurer                         │
│  ██████████░░░░░░░░░░░░ 32/50         │
│  Reward: 750 XP, 400 Dust              │
│                                         │
└─────────────────────────────────────────┘
```

---

*Daily missions are the rhythm of Jolt Time — a steady heartbeat of engagement that rewards every visit without demanding excessive time.*
