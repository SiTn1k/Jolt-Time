# Jolt Time — Gacha and Pack Opening System

## Overview

The Gacha and Pack Opening System is the primary artifact acquisition mechanism in Jolt Time. Players obtain artifacts by opening packs—acquired through gameplay, daily rewards, AdsGram rewarded ads, or optional purchases. The system is built on principles of fairness, transparency, and meaningful progression: no gambling mechanics, no hidden odds, no pay-to-win advantages.

**Core Principle**: Every pack opening should feel rewarding. Every artifact should feel earned. Players must always be able to progress through gameplay alone.

---

## Part I: Pack Types

Seven distinct pack types serve different player needs and acquisition methods. Each pack has a specific price, currency options, rarity range, drop probabilities, and guaranteed reward structure.

---

## 1. Basic Pack

The entry-level pack, freely available through daily login and core gameplay.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BASIC PACK                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: Free (daily login) or 50 Chrono Dust                               │
│  Currencies: Free, Chrono Dust                                                │
│  Minimum Rarity: Common                                                     │
│  Maximum Rarity: Uncommon                                                   │
│                                                                              │
│  Drop Probabilities:                                                         │
│  ├── Common: 85%                                                           │
│  └── Uncommon: 15%                                                         │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Artifact (always)                                                    │
│  ├── 5-15 Chrono Dust (bonus)                                              │
│  └── 10-25 XP (bonus)                                                      │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Daily free pack (once per day)                                        │
│  ├── Daily login reward                                                     │
│  ├── Chrono Dust purchase (50 dust)                                         │
│  └── AdsGram rewarded ad                                                    │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Simple cylinder                                                 │
│  ├── Color: Bronze/Copper (#CD7F32)                                        │
│  ├── Glow: Subtle amber pulse                                              │
│  └── Animation: Gentle spin, minimal particles                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ancient Pack

Focused packs for specific historical eras, ideal for targeted collection building.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ANCIENT PACK                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: 100 Chrono Dust or 1 Event Token                                   │
│  Currencies: Chrono Dust, Event Token                                         │
│  Minimum Rarity: Common                                                     │
│  Maximum Rarity: Epic                                                       │
│                                                                              │
│  Drop Probabilities:                                                         │
│  ├── Common: 50%                                                           │
│  ├── Uncommon: 30%                                                          │
│  ├── Rare: 15%                                                              │
│  └── Epic: 5%                                                              │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Artifact from selected era (always)                                │
│  ├── 10-25 Chrono Dust (bonus)                                             │
│  └── 25-50 XP (bonus)                                                     │
│                                                                              │
│  Era Variants:                                                               │
│  ├── Ancient Egypt Pack                                                     │
│  ├── Ancient Greece Pack                                                    │
│  ├── Roman Empire Pack                                                      │
│  ├── Vikings Pack                                                           │
│  ├── Medieval Europe Pack                                                   │
│  ├── Renaissance Pack                                                       │
│  ├── Industrial Age Pack                                                    │
│  ├── World Wars Pack                                                        │
│  └── Modern Era Pack                                                        │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Chrono Dust purchase                                                   │
│  ├── Event token exchange                                                  │
│  ├── Collection milestone rewards                                            │
│  └── AdsGram rewarded ad (1 per day, era selection)                        │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Angular, artifact-shaped container                               │
│  ├── Color: Era-specific (see Era Color Themes below)                      │
│  ├── Glow: Era-themed glow effect                                           │
│  └── Animation: Era-appropriate reveal sequence                              │
│                                                                              │
│  Era Color Themes:                                                          │
│  ├── Ancient Egypt: Gold (#FFD700) + Lapis (#26619C)                       │
│  ├── Ancient Greece: Olive (#808000) + Marble (#F5F5F5)                    │
│  ├── Roman Empire: Imperial Red (#8B0000) + Bronze (#CD7F32)                │
│  ├── Vikings: Iron Gray (#434343) + Frost Blue (#4A6572)                   │
│  ├── Medieval Europe: Heraldic Blue (#00008B) + Stone (#708090)             │
│  ├── Renaissance: Florentine Red (#8B2323) + Gold (#B8860B)                 │
│  ├── Industrial Age: Steel (#434343) + Brass (#B5A642)                      │
│  ├── World Wars: Olive (#556B2F) + Iron (#434343)                           │
│  └── Modern Era: Freedom Blue (#00008B) + Silver (#C0C0C0)                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Premium Pack

The standard paid pack for players seeking enhanced acquisition rates.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PREMIUM PACK                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: 150 Chrono Dust                                                     │
│  Currencies: Chrono Dust                                                     │
│  Minimum Rarity: Uncommon                                                   │
│  Maximum Rarity: Legendary                                                  │
│                                                                              │
│  Drop Probabilities:                                                         │
│  ├── Uncommon: 40%                                                         │
│  ├── Rare: 35%                                                             │
│  ├── Epic: 20%                                                             │
│  └── Legendary: 5%                                                         │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Artifact (Uncommon or higher, always)                             │
│  ├── 25-50 Chrono Dust (bonus)                                             │
│  └── 50-100 XP (bonus)                                                     │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Chrono Dust purchase                                                   │
│  ├── AdsGram rewarded ad (unlimited, 4-hour cooldown)                      │
│  ├── Daily quest completion                                                 │
│  └── Achievement milestone rewards                                           │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Elegant octagonal capsule                                       │
│  ├── Color: Silver (#C0C0C0) with gold (#FFD700) accents                  │
│  ├── Glow: Dual-tone shimmer (silver + gold)                               │
│  └── Animation: Premium reveal with particle trail                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Legendary Pack

High-stakes packs with significant rarity potential, for serious collectors.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEGENDARY PACK                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: 500 Chrono Dust                                                     │
│  Currencies: Chrono Dust                                                     │
│  Minimum Rarity: Rare                                                       │
│  Maximum Rarity: Mythic                                                     │
│                                                                              │
│  Drop Probabilities:                                                         │
│  ├── Rare: 50%                                                             │
│  ├── Epic: 35%                                                             │
│  ├── Legendary: 13%                                                         │
│  └── Mythic: 2%                                                            │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Artifact (Rare or higher, always)                                   │
│  ├── 50-100 Chrono Dust (bonus)                                             │
│  └── 100-200 XP (bonus)                                                    │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Chrono Dust purchase                                                   │
│  ├── AdsGram rewarded ad (3 per day maximum)                               │
│  ├── Weekly quest milestone rewards                                         │
│  └── Season pass track rewards                                              │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Ornate hexagonal with crown motif                               │
│  ├── Color: Royal Gold (#FFD700) with crimson (#8B0000) accents             │
│  ├── Glow: Intense golden radiance with flame wisps                         │
│  └── Animation: Dramatic royal reveal with golden explosion                   │
│                                                                              │
│  Special Rule:                                                               │
│  ├── Cannot purchase more than 3 Legendary Packs per day                   │
│  └── Pity progress shown prominently before purchase                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Event Pack

Limited-time packs tied to specific game events with exclusive artifacts.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EVENT PACK                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: Free (event milestones) or Event Currency                           │
│  Currencies: Event Currency, Free                                             │
│  Minimum Rarity: Common                                                    │
│  Maximum Rarity: Epic                                                       │
│                                                                              │
│  Drop Probabilities (Event Artifacts):                                      │
│  ├── Common: 45%                                                           │
│  ├── Uncommon: 30%                                                         │
│  ├── Rare: 18%                                                             │
│  └── Epic: 7%                                                              │
│                                                                              │
│  Drop Probabilities (General Pool):                                         │
│  ├── Common: 40%                                                           │
│  ├── Uncommon: 35%                                                         │
│  ├── Rare: 20%                                                             │
│  └── Epic: 5%                                                              │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Artifact (always event-themed)                                       │
│  ├── Event Points (bonus, varies by event)                                 │
│  └── 50-100 XP (bonus)                                                      │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Free at event milestones (participation)                               │
│  ├── Event Currency purchase (limited per event)                           │
│  ├── Community goal completion rewards                                       │
│  └── AdsGram rewarded ad (1 per day during event)                         │
│                                                                              │
│  Event Themes:                                                              │
│  ├── Egyptian Festival — Gold + Lapis theme                                 │
│  ├── Greek Olympics — Olive + Marble theme                                │
│  ├── Roman Triumph — Red + Bronze theme                                    │
│  ├── Medieval Tournament — Blue + Gold theme                               │
│  ├── Renaissance Fair — Red + Gold theme                                    │
│  ├── Industrial Expo — Steel + Brass theme                                │
│  └── Modern Celebration — Blue + Silver theme                              │
│                                                                              │
│  Availability:                                                              │
│  ├── Standard events: 2 weeks                                              │
│  ├── Major events: 1 month                                                │
│  └── Limited events: 1 week                                               │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Hexagonal capsule with event emblem                             │
│  ├── Color: Dynamic based on event theme                                    │
│  ├── Glow: Themed gradient pulse                                            │
│  └── Animation: Dramatic event-themed reveal sequence                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Seasonal Pack

Premium packs tied to season tracks, containing season-exclusive artifacts.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SEASONAL PACK                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: Included in Season Pass OR 200 Chrono Dust standalone                 │
│  Currencies: Season Currency, Chrono Dust                                       │
│  Minimum Rarity: Uncommon                                                   │
│  Maximum Rarity: Legendary                                                  │
│                                                                              │
│  Drop Probabilities (Season Artifacts):                                     │
│  ├── Uncommon: 40%                                                         │
│  ├── Rare: 30%                                                             │
│  ├── Epic: 25%                                                             │
│  └── Legendary: 5%                                                          │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Season-exclusive Artifact                                            │
│  ├── Season XP boost token (7-day, +25% XP)                               │
│  ├── 50-100 Chrono Dust (bonus)                                            │
│  └── 100 XP (bonus)                                                        │
│                                                                              │
│  Season Pass Tiers:                                                         │
│  ├── Free Track: 1 Seasonal Pack every 5 tiers                             │
│  └── Premium Track (+$4.99): 1 Seasonal Pack every 3 tiers                  │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Season Pass track progression                                          │
│  ├── Chrono Dust purchase (standalone)                                       │
│  └── AdsGram rewarded ad (2 per day during season)                         │
│                                                                              │
│  Season Duration:                                                           │
│  ├── 8 weeks per season                                                    │
│  ├── Season currency expires at season end                                   │
│  └── Season artifacts remain in pool permanently                            │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Ornate capsule with season emblem and number                    │
│  ├── Color: Premium gold (#FFD700) with season accent color                │
│  ├── Glow: Golden radiance with season-colored particles                    │
│  └── Animation: Royal reveal with confetti and season emblem burst           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Mystery Pack

Randomized packs offering variety, with mystery bonuses for engagement.

### Pack Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MYSTERY PACK                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Price: 75 Chrono Dust                                                      │
│  Currencies: Chrono Dust                                                     │
│  Minimum Rarity: Common                                                    │
│  Maximum Rarity: Legendary                                                 │
│                                                                              │
│  Drop Probabilities:                                                         │
│  ├── Common: 35%                                                           │
│  ├── Uncommon: 30%                                                         │
│  ├── Rare: 20%                                                             │
│  ├── Epic: 10%                                                             │
│  └── Legendary: 5%                                                          │
│                                                                              │
│  Mystery Bonus (random roll on open):                                       │
│  ├── 50% chance: +10 Chrono Dust bonus                                     │
│  ├── 25% chance: +25 Chrono Dust bonus                                     │
│  ├── 15% chance: Small XP boost (+50 XP)                                   │
│  └── 10% chance: Mystery item (cosmetic or fragment bundle)                │
│                                                                              │
│  Guaranteed Rewards:                                                         │
│  ├── 1 Artifact (always)                                                   │
│  ├── Mystery bonus (roll on open)                                          │
│  └── 10-25 Chrono Dust (base bonus)                                        │
│                                                                              │
│  Acquisition Methods:                                                        │
│  ├── Chrono Dust purchase                                                   │
│  ├── AdsGram rewarded ad (unlimited)                                        │
│  └── Streak milestone rewards (every 7 days)                                │
│                                                                              │
│  Visual Design:                                                              │
│  ├── Shape: Crystal sphere with swirling interior                            │
│  ├── Color: Iridescent purple-blue gradient (#9D4EDD → #3B82F6)           │
│  ├── Glow: Mystical prismatic shimmer                                       │
│  └── Animation: Crystal crack reveal with mystery particle burst             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part II: Pity System

The pity system ensures that no player experiences prolonged streaks without meaningful rewards. Progress toward pity thresholds is persistent and visible.

---

## 2.1 Pity Thresholds

| Threshold | Trigger | Guaranteed Reward |
|-----------|---------|------------------|
| **Every 10 opens** | Open 10 packs | At least 1 Uncommon or higher |
| **Every 25 opens** | Open 25 packs | At least 1 Rare or higher |
| **Every 50 opens** | Open 50 packs | At least 1 Epic or higher |
| **Every 100 opens** | Open 100 packs | At least 1 Legendary |
| **Every 500 opens** | Open 500 packs | At least 1 Mythic |

### Pity Reset Rules

```
PITY PROTECTION GUARANTEES:

1. Pity progress NEVER resets unless:
   ├── Player receives the guaranteed reward at threshold
   ├── Player explicitly requests pity reset (cosmetic only)
   └── Account deletion and recreation

2. Pity progress IS shared across pack types:
   ├── Basic Pack opens count toward pity
   ├── Ancient Pack opens count toward pity
   ├── Premium Pack opens count toward pity
   ├── Legendary Pack opens count toward pity
   └── Mystery Pack opens count toward pity

3. Event and Seasonal Packs have SEPARATE pity tracking:
   ├── Event Pack pity: 10/25/50 thresholds only
   └── Seasonal Pack pity: Independent 10/25/50/100 thresholds

4. Free packs (daily login, ads) DO count toward pity

5. Pity progress is visible in the pack opening UI
```

---

## 2.2 Pity Display UI

```
┌─────────────────────────────────────────┐
│  PACK OPENING                           │
├─────────────────────────────────────────┤
│                                         │
│  Next guarantee:                        │
│  ┌─────────────────────────────────────┐│
│  │ ⚡ 7/10 until Uncommon+            ││
│  │ ████████████████░░░░░░ 70%        ││
│  │                                      ││
│  │ ⭐ 23/25 until Rare+               ││
│  │ ████████████████████░░░ 92%      ││
│  │                                      ││
│  │ 🔮 47/50 until Epic+               ││
│  │ ██████████████████████░ 94%       ││
│  └─────────────────────────────────────┘│
│                                         │
│  "You're close! Next pack is likely    │
│   to be Rare or higher!"               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 2.3 Set Completion Protection

```
SET COMPLETION SAFETY NET:

When player owns 9 of 10 artifacts in a set:
├── Next drop from that set's era is GUARANTEED
├── UI indicator shows "Almost complete!"
├── Specific missing artifact hinted at 75% progress
└── Visual celebration on set completion

This applies to:
├── Era-based sets
├── Civilization sets
├── Special themed sets
└── All collection types
```

---

## Part III: First-Open Bonus System

New players receive enhanced rewards to accelerate early progression and establish collection momentum.

---

## 3.1 New Player Bonuses

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FIRST-TIME PLAYER REWARDS                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WELCOME BUNDLE (One-time, on account creation):                           │
│  ├── 3 Free Basic Packs (instant)                                          │
│  ├── 1 Guaranteed Rare Artifact (from starter pool)                        │
│  ├── 200 Chrono Dust (bonus)                                              │
│  └── 100 XP (bonus)                                                        │
│                                                                              │
│  BEGINNER GUARANTEE (First 20 pack openings):                              │
│  ├── First 10 opens: At least 1 Uncommon guaranteed                       │
│  ├── First 20 opens: At least 1 Rare guaranteed                            │
│  └── Duplicate protection active until 1 of each rarity found            │
│                                                                              │
│  STARTER ERA UNLOCK:                                                        │
│  ├── Ancient Egypt unlocked by default                                     │
│  ├── 3 Ancient Packs provided free                                         │
│  └── Tutorial guides player through first artifact collection               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### First 20 Pack Opening Schedule

| Pack # | Type | Guarantee |
|---------|------|-----------|
| 1 | Free Basic | Common guaranteed |
| 2 | Free Basic | Common guaranteed |
| 3 | Free Basic | Common guaranteed |
| 4 | Welcome Rare | **Rare guaranteed** |
| 5-9 | Basic | Standard rates |
| 10 | Basic | **Uncommon guaranteed** (pity) |
| 11-19 | Basic | Standard rates |
| 20 | Basic | **Rare guaranteed** (beginner pity) |

---

## 3.2 Tutorial Progression Rewards

```
TUTORIAL COMPLETION REWARDS:

Step 1: First artifact collected
└── 1 Basic Pack

Step 2: First battle won
└── 1 Basic Pack + 25 Chrono Dust

Step 3: First set partially completed (3/5)
└── 1 Ancient Pack (Ancient Egypt)

Step 4: Museum visited
└── 50 Chrono Dust

Step 5: Tutorial complete
└── 1 Premium Pack + "Welcome, Traveler" Title
```

---

## Part IV: Daily Free Pack

A free pack available once every 24 hours, encouraging daily engagement.

---

## 4.1 Daily Free Pack Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DAILY FREE PACK                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AVAILABILITY:                                                              │
│  ├── One free pack per 24-hour period                                      │
│  ├── Timer resets at midnight (player timezone) or 24h from last claim  │
│  └── Available to all players, no prerequisites                            │
│                                                                              │
│  TIMER DISPLAY:                                                             │
│  ├── Countdown visible on home screen                                      │
│  ├── Notification option: reminder when pack available                      │
│  ├── Pack button glows when ready                                          │
│  └── Timer shows exact time remaining (HH:MM:SS)                           │
│                                                                              │
│  PACK TYPE:                                                                 │
│  ├── Basic Pack (standard version)                                          │
│  └── Contains: 1 Common/Uncommon artifact + bonuses                        │
│                                                                              │
│  STREAK BONUSES:                                                            │
│  ├── Day 3 streak: +5 Chrono Dust bonus                                  │
│  ├── Day 7 streak: +10 Chrono Dust + 1 Mystery Pack                      │
│  ├── Day 14 streak: +1 Ancient Pack (player choice)                     │
│  ├── Day 30 streak: +1 Premium Pack                                        │
│  └── Streak breaks after 48 hours without claiming                         │
│                                                                              │
│  STREAK PROTECTION:                                                         │
│  ├── 1 grace period per month (24h extra time to claim)                  │
│  ├── Streak shield item (from achievements) extends grace                │
│  └── Streak count visible on profile                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.2 Daily Pack Timer UI

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐│
│  │ 🎁 DAILY PACK READY!              ││
│  │                                      ││
│  │ ┌─────┐                            ││
│  │ │ 📦  │  BASIC PACK               ││
│  │ └─────┘                            ││
│  │                                      ││
│  │ 🔥 Streak: 5 days                  ││
│  │ Next bonus: +15 Dust at Day 7     ││
│  │                                      ││
│  │ [    OPEN PACK    ]                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────── │
│                                         │
│  If unclaimed:                          │
│  ┌─────────────────────────────────────┐│
│  │ ⏰ Next pack in: 14:32:05         ││
│  │                                      ││
│  │ Timer shows exact countdown.        ││
│  │ Pack button is dimmed until ready.  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Part V: AdsGram Reward System

AdsGram is the primary revenue driver. Rewarded ads provide players with enhanced pack-opening opportunities while generating sustainable revenue.

---

## 5.1 Ad-Supported Rewards

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ADSGRAM REWARDED AD OPPORTUNITIES                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AD-SUPPORTED PACK OPENING:                                                 │
│  ├── Watch 1 AdsGram ad → Earn 1 additional pack opening                  │
│  ├── Pack type matches context (Basic, Premium, etc.)                    │
│  ├── Available immediately after ad completion                               │
│  └── Ad watched = pack earned, no direct purchase required                 │
│                                                                              │
│  AD-SUPPORTED CURRENCY BONUS:                                              │
│  ├── Watch ad → +50% Chrono Dust on current activity                     │
│  ├── Watch ad → +100% XP on current activity                               │
│  └── Watch ad → Instant Energy refill (25%)                                │
│                                                                              │
│  AD-SUPPORTED BOOSTERS (Temporary):                                        │
│  ├── Watch ad → +50% artifact drop rate for 1 hour                       │
│  ├── Watch ad → 2x collection progress for next mission                  │
│  └── Watch ad → +25% Chrono Dust gain for 4 hours                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.2 Ad Frequency and Limits

```
ADSGRAM LIMITS PER PLAYER:

Rewarded Video Ads:
├── Daily limit: 5 ads per day
├── Cooldown between ads: 1 hour minimum
├── Context determines reward type
└── Counter shown in UI: "Ads today: 3/5"

Enhanced Daily Pack Ad:
├── 1 enhanced daily pack ad per day
├── Upgrades Basic → Rare Pack equivalent
├── Does not count toward daily limit
└── Shown before or after daily free pack claim

Event Ads:
├── 1 event ad bonus per day during active events
├── Upgrades Event Pack to include Epic guarantee
└── Separate from general daily limit

STREAK BONUS ADS:
├── Available after 7-day streak
├── 1 extra ad per day (6 total instead of 5)
├── Rewards are enhanced (+25% bonus)
└── Resets if streak breaks
```

---

## 5.3 Ad Integration Principles

```
ADSGRAM INTEGRATION RULES:

✅ ALWAYS:
├── Player must initiate ad viewing (tap to watch)
├── Clear reward preview shown BEFORE ad plays
├── Immediate reward delivery after ad completes
├── Skip option available (no reward if skipped)
├── Ad frequency strictly capped
└── Never interrupt active gameplay

❌ NEVER:
├── Auto-play ads without player action
├── Force ads as the only path to progress
├── Make ads feel mandatory or pressured
├── Show misleading "watch ad" buttons
├── Block gameplay until ad is watched
└── guilt-trip players for skipping ads

ADS NEVER FEELS MANDATORY:
├── Players can always progress without watching ads
├── Ad rewards are ENHANCEMENTS, not requirements
├── Clear messaging: "Watch an ad for bonus" not "Watch ad to continue"
└── Free path always available for all content
```

---

## 5.4 Ad Reward Preview UI

```
BEFORE WATCHING AD:
┌─────────────────────────────────────────┐
│                                         │
│  🎬 WATCH AD TO EARN:                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📦 +1 PREMIUM PACK            │   │
│  │  ✨ +50 Chrono Dust bonus       │   │
│  │  ⭐ +100 XP bonus               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Ad count today: 2/5 remaining        │
│                                         │
│  [ WATCH AD ]     [ CONTINUE FREE ]   │
│                                         │
│  ─────────────────────────────────────  │
│  You can continue playing without       │
│  watching. This reward is optional!    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Part VI: Opening Animation Specification

Pack opening animations are a core emotional experience. Rarity directly determines animation intensity, sound design, color palette, and reveal duration.

---

## 6.1 Animation Sequence

Every pack opening follows a five-phase sequence, with each phase scaled by rarity.

```
OPENING ANIMATION PHASES:

Phase 1 — SELECTION (0.5s)
├── Pack appears center screen
├── Pack hovers with subtle float
├── Rarity-appropriate glow begins
└── Anticipation sound builds

Phase 2 — ACTIVATION (1.0-2.0s, varies by rarity)
├── Pack glows intensely
├── Pack shakes with increasing intensity
├── Particle energy gathers around pack
├── Sound reaches crescendo
└── Rarity determines: glow color, shake intensity, particle density

Phase 3 — RELEASE (1.0-2.5s, varies by rarity)
├── Pack bursts open with rarity-colored explosion
├── Light beam projects artifact upward
├── Particle cascade reflects rarity
├── Sound sting plays (rarity-specific)
└── Screen flash at high rarities

Phase 4 — REVEAL (1.0-3.0s, varies by rarity)
├── Artifact rotates slowly, fully illuminated
├── Artifact name and era appear
├── Rarity banner animates in
├── Stats display (power, level)
├── If duplicate: "Fragment +X" shown instead of stats
└── Collection progress updates

Phase 5 — COLLECTION (0.5s)
├── Artifact flies to inventory
├── Progress bar increments
├── Completion check (set/era/rarity)
├── If milestone: celebration animation
└── Return to pack selection
```

---

## 6.2 Rarity Effects Detail

| Rarity | Duration | Glow Color | Particle Count | Sound |
|--------|----------|------------|-----------------|-------|
| **Common** | 2.0s | Amber (#CD7F32) | 10-15 | Soft click |
| **Uncommon** | 2.5s | Green (#22C55E) | 20-25 | Pleasant chime |
| **Rare** | 3.0s | Blue (#3B82F6) | 30-40 | Achievement tone |
| **Epic** | 3.5s | Purple (#A855F7) | 50-60 | Epic sting |
| **Legendary** | 4.0s | Gold (#F59E0B) | 80-100 | Legendary sting + reverb |
| **Mythic** | 5.0s | Rainbow prism | 150+ | Mythic sting + choir |

### Common Animation

```
DURATION: 2.0 seconds total

Visual Effects:
├── Soft amber glow (subtle, not intense)
├── Light particles drift upward (10-15, gray-white)
├── Pack opens with gentle burst
├── Artifact rises with warm light beam
└── Simple fade-in for artifact name

Sound Design:
├── Soft metallic click on activation
├── Gentle whoosh on release
├── Soft chime on reveal
└── No dramatic sting or reverb

Color Palette:
├── Primary: #CD7F32 (bronze)
├── Glow: rgba(205, 127, 50, 0.3)
├── Particles: #F5F5DC (cream white)
└── Text: #FFFFFF on dark background

Screen Effects:
├── No screen flash
├── Minimal particle spread (narrow cone)
├── Artifact scale: 1.0x normal size
└── No persistent aura after reveal
```

### Uncommon Animation

```
DURATION: 2.5 seconds total

Visual Effects:
├── Soft green glow (moderate intensity)
├── Green sparkles rise (20-25 particles)
├── Pack opens with green energy burst
├── Artifact rises with green light trail
└── Artifact name fades in with green accent

Sound Design:
├── Soft chime on activation
├── Green-tinted whoosh on release
├── Pleasant ding on reveal
└── Subtle resonance on completion

Color Palette:
├── Primary: #22C55E (green)
├── Glow: rgba(34, 197, 94, 0.4)
├── Particles: #4ADE80 (bright green)
└── Text: #22C55E rarity label

Screen Effects:
├── Very faint screen tint (green, 5% opacity)
├── Medium particle spread
├── Artifact scale: 1.05x normal size
└── Subtle green shimmer on card border
```

### Rare Animation

```
DURATION: 3.0 seconds total

Visual Effects:
├── Bright blue glow (high intensity)
├── Blue particle stream rises continuously (30-40 particles)
├── Pack opens with blue energy explosion
├── Artifact rises with blue light beam + trailing particles
├── Rarity banner animates: "RARE" in gold-blue
└── "NEW!" badge if first time acquiring

Sound Design:
├── Rising tone on activation
├── Blue-tinted whoosh on release
├── Achievement tone sting on reveal
└── Satisfying confirmation sound

Color Palette:
├── Primary: #3B82F6 (blue)
├── Glow: rgba(59, 130, 246, 0.5)
├── Particles: #60A5FA (bright blue)
├── Secondary particles: #93C5FD (light blue)
└── Text: #3B82F6 rarity label

Screen Effects:
├── Soft blue screen flash (10% opacity, 0.2s)
├── Wide particle spread (full width)
├── Artifact scale: 1.1x normal size
├── Card has pulsing blue border animation (3s loop)
└── Rarity banner drops from top with bounce
```

### Epic Animation

```
DURATION: 3.5 seconds total

Visual Effects:
├── Deep purple aura (very high intensity)
├── Continuous particle emission (50-60 particles)
├── Swirling purple vortex opens pack
├── Artifact rises with purple spiral trail
├── Rarity banner: "EPIC" with purple glow
├── Achievement popup: "Epic Find!"
└── Screen edges glow purple

Sound Design:
├── Deep resonant tone on activation
├── Purple vortex whoosh on release
├── Epic sting on reveal (recognizable)
└── Purple-tinged ambient hum

Color Palette:
├── Primary: #A855F7 (purple)
├── Glow: rgba(168, 85, 247, 0.6)
├── Particles: #C084FC (light purple)
├── Energy wisps: #E879F9 (fuchsia)
└── Text: #A855F7 rarity label with glow

Screen Effects:
├── Purple screen flash (15% opacity, 0.3s)
├── Particles fill entire screen
├── Artifact scale: 1.15x normal size
├── Card has swirling purple border animation (2s loop)
├── Persistent purple aura on card (fades after 5s)
└── Screen edge vignette in purple
```

### Legendary Animation

```
DURATION: 4.0 seconds total

Visual Effects:
├── Golden radiant glow (maximum intensity)
├── Flame-like golden particles rise (80-100 particles)
├── Pack opens with golden explosion
├── Artifact rises with golden light beam + flame wisps
├── Rarity banner: "LEGENDARY" with golden rays
├── Screen-wide golden flash on reveal
├── Achievement popup: "LEGENDARY FIND!"
└── Persistent golden aura around card

Sound Design:
├── Deep golden resonant tone on activation
├── Fire/energy whoosh on release
├── Legendary sting with reverb (2s tail)
└── Triumphant chord on completion

Color Palette:
├── Primary: #F59E0B (gold)
├── Glow: rgba(245, 158, 11, 0.7)
├── Particles: #FCD34D (bright gold)
├── Flame wisps: #FDE68A (light gold)
├── Secondary: #D97706 (dark gold)
└── Text: #F59E0B rarity label with golden glow

Screen Effects:
├── Full golden screen flash (25% opacity, 0.4s)
├── Golden rays emanate from artifact
├── Particles fill and overflow screen edges
├── Artifact scale: 1.2x normal size
├── Card has animated golden border (flame effect)
├── Persistent golden aura on card (fades after 10s)
└── Screen vignette in gold (corners)
```

### Mythic Animation

```
DURATION: 5.0 seconds total

Visual Effects:
├── Prismatic rainbow cascade (all colors cycling)
├── Maximum particle density (150+ particles, all colors)
├── Pack shatters with prismatic explosion
├── Artifact rises on rainbow light beam
├── Rarity banner: "MYTHIC" with rainbow shimmer
├── Full cinematic screen takeover
├── Achievement popup: "MYTHIC! A ONCE-IN-A-LIFETIME FIND!"
├── Persistent prismatic aura (permanent on card)
└── Special Mythic notification to player

Sound Design:
├── Mystical tone on activation (building)
├── Prismatic cascade whoosh on release
├── Mythic sting with choir + reverb (3s tail)
├── Heavenly chord resolution on completion
└── Optional: brief silence then crescendo

Color Palette:
├── Cycles through: #EC4899 → #A855F7 → #3B82F6 → #22C55E → #F59E0B
├── Glow: rgba(236, 72, 153, 0.8) + prismatic shimmer
├── Particles: Rainbow spectrum
├── Energy wisps: All colors
└── Text: Rainbow gradient label

Screen Effects:
├── Full rainbow screen flash (30% opacity, 0.5s)
├── Prismatic particle cascade fills entire screen
├── Artifact scale: 1.25x normal size + subtle float
├── Card has animated rainbow border (3s color cycle)
├── Persistent prismatic aura on card (never fades)
├── Screen-wide prismatic vignette
└── "Mythic Discovery!" celebration animation

Post-Reveal:
├── Mythic artifact card has permanent rainbow shimmer
├── Card displays "MYTHIC" badge always
├── Player receives special Mythic notification
├── Mythic artifacts appear highlighted in all views
└── Collection percentage celebration if applicable
```

---

## 6.3 Animation Timing Summary

| Phase | Common | Uncommon | Rare | Epic | Legendary | Mythic |
|-------|--------|----------|------|------|-----------|--------|
| Selection | 0.5s | 0.5s | 0.5s | 0.5s | 0.5s | 0.5s |
| Activation | 1.0s | 1.0s | 1.0s | 1.5s | 1.5s | 2.0s |
| Release | 0.5s | 0.75s | 1.0s | 1.0s | 1.5s | 2.0s |
| Reveal | 1.0s | 1.0s | 1.5s | 1.5s | 2.0s | 3.0s |
| Collection | 0.5s | 0.5s | 0.5s | 0.5s | 0.5s | 0.5s |
| **Total** | **2.5s** | **2.75s** | **3.0s** | **3.5s** | **4.0s** | **5.0s** |

---

## Part VII: Duplicate Protection System

Duplicates are guaranteed to be meaningful, never feeling like wasted acquisitions.

---

## 7.1 Duplicate Handling Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DUPLICATE PROTECTION RULES                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DUPLICATE CONVERSION:                                                       │
│  ├── All duplicates automatically convert to resources                      │
│  ├── No manual selling of artifacts                                         │
│  ├── Conversion is instant upon duplicate acquisition                        │
│  └── Player is notified of conversion with amount received                  │
│                                                                              │
│  FRAGMENT YIELDS BY RARITY:                                                  │
│  ├── Common: 1-2 fragments                                                  │
│  ├── Uncommon: 3-5 fragments                                                │
│  ├── Rare: 6-10 fragments                                                  │
│  ├── Epic: 15-25 fragments                                                 │
│  ├── Legendary: 40-60 fragments                                           │
│  └── Mythic: 100-150 fragments + SPECIAL REWARD                            │
│                                                                              │
│  COLLECTION PROGRESS PRESERVATION:                                           │
│  ├── Duplicates do NOT reduce collection percentage                         │
│  ├── Duplicate of owned artifact = fragment conversion                     │
│  ├── Collection percentage only increases, never decreases                 │
│  └── "Missing" list never grows from duplicates                            │
│                                                                              │
│  NEW PLAYER PROTECTION:                                                      │
│  ├── First artifact of each rarity: NEVER duplicate                         │
│  ├── Active until player owns at least 1 of each rarity                   │
│  └── UI shows "Protected" indicator on new rarities                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.2 Mythic Duplicate Special Rewards

```
MYTHIC DUPLICATE REWARDS:

When player already owns a Mythic artifact and receives another:

Reward Structure:
├── 100-150 Mythic Fragments (standard)
├── 500 Chrono Dust (bonus)
├── 1 Legendary Pack (guaranteed)
├── "Mythic Duplicate" Badge (first duplicate only)
└── +5% Mythic Collection Progress bonus (permanent)

Mythic Fragment Purpose:
├── Used to craft or upgrade Mythic artifacts (future feature)
├── Cannot be obtained any other way
├── Accumulated for eventual Mythic enhancement system
└── Displayed in dedicated Mythic Fragment counter

Rarity Protection Active Until:
├── Player has at least 1 Mythic artifact
└── "Mythic Protected" badge disappears
```

---

## 7.3 Duplicate Display

```
DUPLICATE ACQUISITION NOTIFICATION:

┌─────────────────────────────────────────┐
│  📦 DUPLICATE RECEIVED                  │
├─────────────────────────────────────────┤
│                                         │
│  You already own:                       │
│  "Ankh of Eternity" (Rare)             │
│                                         │
│  Converted to:                          │
│  ┌─────────────────────────────────┐   │
│  │ ✨ 8 Fragments                  │   │
│  │ 💰 +50 Chrono Dust              │   │
│  │ ⭐ +100 XP                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Collection progress preserved!          │
│  "Ankh of Eternity" still marked       │
│  as collected.                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## Part VIII: Pack Economy Balancing

The pack economy ensures fair progression without pay-to-win advantages. All artifacts remain achievable through gameplay.

---

## 8.1 Anti Pay-to-Win Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FAIR ECONOMY PRINCIPLES                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PROGRESSION THROUGH GAMEPLAY ALWAYS POSSIBLE:                              │
│  ├── All artifacts obtainable without purchases                             │
│  ├── Free daily pack available every 24 hours                               │
│  ├── AdsGram rewarded ads provide free pack opportunities                  │
│  ├── Quest completion yields packs and resources                            │
│  ├── Collection milestones reward packs                                     │
│  └── Events provide free pack acquisition opportunities                    │
│                                                                              │
│  NO PAY-TO-WIN ADVANTAGES:                                                  │
│  ├── No direct artifact purchases with real money                          │
│  ├── No energy shortcuts that favor paying players                         │
│  ├── No era unlocks requiring purchases                                    │
│  ├── No stat advantages for paying players                                │
│  └── No competitive advantages in any game mode                            │
│                                                                              │
│  COSMETIC-ONLY OPTIONAL PURCHASES:                                           │
│  ├── Season Pass: Cosmetics + convenience, no gameplay edge                  │
│  ├── Cosmetic bundles: Frames, badges, auras, avatars                       │
│  └── Ad-free experience (premium subscription): No gameplay impact         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8.2 Expected Progression Rates

```
PLAYER PROGRESSION TIMELINE:

Free-to-Play Player:

Week 1:
├── 7 daily free packs
├── 3 AdsGram packs
├── 5 Quest packs
├── ~5 total artifacts (mostly Common/Uncommon)
└── ~1 Rare artifact (pity guarantee)

Week 2-4:
├── 14-21 daily free packs
├── 6-9 AdsGram packs
├── 10-15 Quest/event packs
├── ~15-25 total artifacts
├── ~5-8 Rare artifacts
└── ~1 Epic (50-pack pity)

Month 1:
├── ~40 total artifacts (all Common, most Uncommon, several Rare)
├── ~2-3 Epic artifacts
├── First Legendary around month 2-3
└── Mythic as long-term goal (6-12+ months)

Dedicated Free Player (daily engagement):
├── 2-4 packs per day (daily + ads + quests)
├── Complete Common/Uncommon collection: 2-4 weeks
├── Complete Rare collection: 2-4 months
├── Complete Epic collection: 6-12 months
├── Complete Legendary collection: 12-18 months
└── Mythic: Long-term aspirational goal
```

---

## 8.3 Pack Economy Summary Table

| Pack Type | Price | Currency | Min Rarity | Max Rarity | Daily Limit |
|-----------|-------|----------|------------|-------------|-------------|
| **Basic** | Free/50 | Free/Dust | Common | Uncommon | Unlimited free |
| **Ancient** | 100 | Dust | Common | Epic | 3 |
| **Premium** | 150 | Dust | Uncommon | Legendary | Unlimited |
| **Legendary** | 500 | Dust | Rare | Mythic | 3 |
| **Event** | Free/Event | Event Currency | Common | Epic | Unlimited (event) |
| **Seasonal** | Pass/200 | Season/Dust | Uncommon | Legendary | Tier-based |
| **Mystery** | 75 | Dust | Common | Legendary | Unlimited |

---

## 8.4 Drop Rate Transparency

```
DROP RATES ARE ALWAYS VISIBLE:

Before opening any pack, players see:
├── Full drop probability breakdown
├── "This pack guarantees at least [rarity]"
├── Current pity progress
├── Next pity threshold
└── Historical open count for this pack type

Displayed Format:
┌─────────────────────────────────────────┐
│  PREMIUM PACK — Drop Rates              │
│                                         │
│  Uncommon: 40%                         │
│  Rare: 35%                             │
│  Epic: 20%                             │
│  Legendary: 5%                         │
│                                         │
│  GUARANTEE:                            │
│  Minimum: Uncommon                      │
│  Next pity: 7 opens until Epic+         │
│  Total opened: 43                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Part IX: Summary

### Pack Types Summary

| Pack | Price | Currency | Min Rarity | Max Rarity | Special |
|------|-------|----------|------------|-------------|---------|
| Basic | Free/50 | Free/Dust | Common | Uncommon | Daily free |
| Ancient | 100 | Dust | Common | Epic | Era-specific |
| Premium | 150 | Dust | Uncommon | Legendary | Standard paid |
| Legendary | 500 | Dust | Rare | Mythic | High stakes |
| Event | Free/Event | Event | Common | Epic | Limited time |
| Seasonal | Pass/200 | Season/Dust | Uncommon | Legendary | Season-exclusive |
| Mystery | 75 | Dust | Common | Legendary | Mystery bonus |

### Pity System Summary

| Threshold | Guarantee | Pack Types |
|-----------|-----------|------------|
| 10 opens | Uncommon+ | All except Event/Seasonal |
| 25 opens | Rare+ | All except Event/Seasonal |
| 50 opens | Epic+ | Premium, Legendary, Mystery |
| 100 opens | Legendary | Legendary only |
| 500 opens | Mythic | Legendary only |

### First-Open Bonuses

- Welcome bundle: 3 free packs + guaranteed Rare + 200 Dust
- First 10 opens: Uncommon+ guaranteed
- First 20 opens: Rare+ guaranteed

### Daily Free Pack

- Available every 24 hours
- Streak bonuses at days 3, 7, 14, 30
- Timer always visible in UI

### AdsGram Rewards

- 5 rewarded ads per day
- Earn packs, currency, boosters
- Never mandatory for progress

### Duplicate Protection

- Auto-convert to fragments
- Mythic duplicates: special bundle + guaranteed Legendary Pack
- Collection progress never decreases

### Economy Principles

- All artifacts obtainable through gameplay
- No pay-to-win mechanics
- Cosmetic-only optional purchases
- Drop rates always transparent

---

*Every pack is a moment of anticipation. Every opening is a step through history. Fair, transparent, and always rewarding.*