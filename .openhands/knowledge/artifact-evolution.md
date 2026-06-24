# Jolt Time — Artifact Fusion and Evolution System

## Overview

The Artifact Fusion and Evolution System provides deep progression mechanics for Jolt Time's collected artifacts. Players can transform, enhance, and specialize their artifacts through leveling, evolution, fusion, and visual upgrades. This system creates long-term goals beyond initial collection, rewards player investment, and maintains Jolt Time's commitment to no pay-to-win mechanics.

---

## 1. Artifact Upgrade System

The upgrade system allows artifacts to grow stronger through player investment. Each artifact can be enhanced across multiple dimensions, creating meaningful progression choices.

### Upgrade Dimensions

| Dimension | Description | Visual Change | Power Impact |
|-----------|-------------|---------------|-------------|
| **Level** | Experience-based progression | Subtle glow intensity | Linear power increase |
| **Evolution** | Rarity advancement | New visual effects | Multiplicative power boost |
| **Fusion** | Combining artifacts | Unique variant appearance | Specialized bonuses |
| **Visual** | Cosmetic enhancement | New frames, effects, animations | No gameplay impact |

### Upgrade Philosophy

**Meaningful Investment:**
- Upgrades require dedicated resources
- Each upgrade should feel significant
- Progress is visible and rewarding

**Fair Progression:**
- All upgrades achievable through gameplay
- No direct purchases with real money
- Time and effort determine success

**No Pay-to-Win:**
- Upgrades enhance but never dominate
- Skill and collection remain primary
- Competitive modes remain balanced

### Upgrade Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  🔨 ARTIFACT UPGRADE                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   [Artifact]    │  "Ankh of Eternity"                       │
│  │     Image       │  Ancient Egypt • Rare                      │
│  └─────────────────┘  Power: 24 | Luck: 1.5 | Knowledge: 1.3   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [LEVEL UP]     [EVOLVE]      [FUSE]       [VISUAL]           │
│                                                                 │
│  Current: Lv.5     Rare → Epic   Combine     New Frame         │
│  Next: Lv.6       [Requirements]  [Requirements] [Preview]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Artifact Levels

Each artifact has a level that increases through use and resource investment. Higher levels provide proportionally stronger stats.

### Level Progression

| Rarity | Base Level | Max Level | Level Cap Increase |
|--------|------------|-----------|-------------------|
| Common | 1 | 20 | +5 per evolution |
| Uncommon | 1 | 30 | +5 per evolution |
| Rare | 1 | 40 | +5 per evolution |
| Epic | 1 | 50 | +5 per evolution |
| Legendary | 1 | 60 | +5 per evolution |
| Mythic | 1 | 70 | +5 per evolution |

### Level Costs

Levels are gained through **Experience Points (XP)** accumulated over time:

| Level Range | XP Required | Time to Level (passive) |
|-------------|-------------|------------------------|
| 1 → 5 | 100 XP | ~1 day of regular play |
| 5 → 10 | 250 XP | ~3 days |
| 10 → 20 | 500 XP | ~1 week |
| 20 → 30 | 1,000 XP | ~2 weeks |
| 30 → 40 | 2,000 XP | ~3 weeks |
| 40 → 50 | 4,000 XP | ~1 month |
| 50 → 60 | 8,000 XP | ~6 weeks |
| 60 → 70 | 16,000 XP | ~2 months |

### XP Sources

- **Battles:** Artifacts in active use gain XP (1-5 XP per battle based on artifact rarity)
- **Daily Login:** Small XP bonus for artifacts in collection
- **Expeditions:** Return with bonus XP for equipped artifacts
- **Museum Display:** Displayed artifacts gain +10% XP bonus

### Level Display

```
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL PROGRESSION                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Ankh of Eternity                                               │
│  Lv. 12 ████████████░░░░░░░░░░  12/40                         │
│                                                                 │
│  XP to next level: 180 / 500                                    │
│  (+50% from daily bonus)                                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Base Stats (Lv.1):     Current Stats (Lv.12):                 │
│  Power: 20               Power: 24 (+20%)                       │
│  Luck: 1.5x             Luck: 1.8x (+20%)                     │
│  Knowledge: 1.3x         Knowledge: 1.56x (+20%)               │
│                                                                 │
│  [USE IN BATTLE]  [SEND ON EXPEDITION]  [VIEW HISTORY]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Level Benefits

| Level Milestone | Benefit |
|-----------------|---------|
| Lv. 10 | Visual upgrade (glow intensity +1) |
| Lv. 20 | Stat bonus (+5% all stats) |
| Lv. 30 | Visual upgrade (particle effect) |
| Lv. 40 | Stat bonus (+10% all stats) |
| Lv. 50 | Visual upgrade (aura effect) |
| Lv. 60+ | Continuous stat growth |

---

## 3. Artifact Evolution

Evolution transforms artifacts to higher rarity tiers, dramatically increasing their power and visual appeal.

### Evolution Path

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVOLUTION PROGRESSION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  COMMON ──────► UNCOMMON ──────► RARE ──────► EPIC ──────► LEGENDARY       │
│    │               │               │               │               │         │
│   Lv.20         Lv.30          Lv.40          Lv.50          Lv.60          │
│    │               │               │               │               │         │
│    ▼               ▼               ▼               ▼               ▼         │
│  +100%          +100%          +100%          +100%          +100%         │
│  Power          Power          Power          Power          Power          │
│                                                                              │
│                                          │                                   │
│                                          ▼                                   │
│                                    ┌─────────┐                              │
│                                    │ MYTHIC  │                              │
│                                    │ (Special)│                              │
│                                    └─────────┘                              │
│                                      Lv.70                                  │
│                                      Unique path                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Evolution Requirements

**Common → Uncommon:**
- 3 duplicate Common artifacts of same type
- 50 Chrono Coins
- 100 Time Shards
- 20 Common Fragments

**Uncommon → Rare:**
- 3 duplicate Uncommon artifacts of same type
- 150 Chrono Coins
- 300 Time Shards
- 50 Uncommon Fragments

**Rare → Epic:**
- 3 duplicate Rare artifacts of same type
- 500 Chrono Coins
- 1,000 Time Shards
- 150 Rare Fragments

**Epic → Legendary:**
- 3 duplicate Epic artifacts of same type
- 2,000 Chrono Coins
- 5,000 Time Shards
- 500 Epic Fragments

**Legendary → Mythic:**
- 5 duplicate Legendary artifacts of same type
- 10,000 Chrono Coins
- 25,000 Time Shards
- 2,000 Legendary Fragments
- 1 Mythic Essence (rare drop from expeditions)

### Evolution Process

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚗️ EVOLUTION CONFIRMATION                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Evolving: "Bronze Shield" (Common Lv.20)                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Materials Required:                                            │
│  • 3x Bronze Shield (Common) ✓                                 │
│  • 50 Chrono Coins ✓                                            │
│  • 100 Time Shards ✓                                            │
│  • 20 Common Fragments ✓                                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Result: "Iron Shield" (Uncommon Lv.1)                         │
│                                                                 │
│  Power: 20 → 35 (+75%)                                          │
│  Visual: Gray → Green glow                                      │
│  New: Subtle particle effect at Lv.10                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  WARNING: Evolution is permanent. Original artifacts consumed.  │
│                                                                 │
│  [EVOLVE]                              [CANCEL]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Evolution Rules

1. **Consumed Artifacts:** Original artifacts and materials are permanently consumed
2. **Level Reset:** Evolved artifact starts at level 1 of new rarity
3. **Duplicate Requirement:** Only same-artifact duplicates work (no substituting similar)
4. **Stat Inheritance:** Partial stat bonus from previous level carries over (+10% per previous level)
5. **Visual Inheritance:** New rarity visuals applied, level milestones retained

---

## 4. Artifact Fusion

Fusion combines two artifacts of the same type to create a specialized variant with unique bonuses.

### Fusion Concept

Unlike evolution (which increases rarity), fusion creates **Special Variants** with unique trait combinations. The original artifacts are consumed, but the result has enhanced capabilities.

### Fusion Requirements

**Base Fusion:**
- 2 artifacts of same type and rarity
- 200 Chrono Coins
- 500 Time Shards
- 50 matching fragments

**Advanced Fusion:**
- 2 artifacts of same type, any rarities
- 500 Chrono Coins
- 1,500 Time Shards
- 150 fragments (combined)
- Level requirement: 20+

### Fusion Types

**Stat Fusion:**
- Combines highest stats from both parents
- Result has potential for higher max stats
- Stat distribution randomized but boosted

**Trait Fusion:**
- Combines traits from both parents
- New trait combinations possible
- Up to 2 traits on fused artifact

**Set Fusion:**
- Combines partial set completion
- Fused artifact counts toward both original sets
- Useful for completing difficult sets

### Fusion Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚗️ ARTIFACT FUSION                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Select two artifacts to combine:                               │
│                                                                 │
│  ┌─────────────────┐  +  ┌─────────────────┐                    │
│  │  [Artifact A]   │     │  [Artifact B]   │                    │
│  │  Lv.15, Rare   │     │  Lv.22, Rare   │                    │
│  │  Power: 34     │     │  Power: 38     │                    │
│  │  Trait: Power  │     │  Trait: Speed  │                    │
│  └─────────────────┘     └─────────────────┘                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FUSION PREVIEW:                                                 │
│                                                                 │
│  "Enhanced Ankh" (Rare)                                          │
│  Base Power: 42 (highest base + 10%)                            │
│  Traits: Power + Speed (both inherited)                          │
│  Level: 15 (average, rounded down)                               │
│  Set Bonuses: Counts for "Egyptian Set A" and "Egyptian Set B"  │
│                                                                 │
│  [FUSE] (500 Coins, 1500 Shards)          [SELECT DIFFERENT]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fusion Balance

**What Fusion Provides:**
- Unique trait combinations not normally possible
- Higher stat potential through optimization
- Set completion flexibility

**What Fusion Does NOT Provide:**
- Power beyond normal max for rarity
- Advantages in competitive modes
- Easier path than careful evolution

### Fusion Restrictions

- Cannot fuse Mythic artifacts
- Cannot fuse artifacts from different types
- Maximum 3 fusions per artifact lifetime
- Fused artifacts cannot be fused again (to prevent infinite stacking)

---

## 5. Visual Evolution

As artifacts improve, they unlock increasingly impressive visual treatments. Visual evolution provides prestige and satisfaction without gameplay advantages.

### Visual Progression Stages

| Rarity | Level 1 | Level 10 | Level 20 | Level 30 | Level 40 |
|--------|---------|----------|----------|----------|----------|
| Common | Basic | Faint glow | Soft glow | — | — |
| Uncommon | Soft glow | Bright glow | Particles | — | — |
| Rare | Particles | Stream | Burst | Swirl | — |
| Epic | Swirl | Aura | Flames | — | — |
| Legendary | Flames | Corona | Radiance | Beam | Cascade |
| Mythic | Prismatic | Animated | 3D Effect | Hologram | Full Animation |

### Visual Unlocks

**Frame Progression:**
- Level 1: Simple border matching rarity
- Level 10: Enhanced border with glow
- Level 20: Animated border
- Level 30: Ornate frame with effects
- Level 40+: Legendary frame with particle emitter

**Effect Progression:**
- Level 1-9: Static glow
- Level 10-19: Gentle particles
- Level 20-29: Active animation
- Level 30-39: Full effects
- Level 40+: Unique legendary animation

**Background Progression:**
- Level 1: Solid rarity color
- Level 10: Gradient background
- Level 20: Animated gradient
- Level 30: Particle background
- Level 40: Full scene illustration

### Visual Preview System

```
┌─────────────────────────────────────────────────────────────────┐
│  ✨ VISUAL EVOLUTION PREVIEW                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Ankh of Eternity — Visual Stages                               │
│                                                                 │
│  Current: Lv.12          Next: Lv.20                            │
│  ┌───────────┐           ┌───────────┐                         │
│  │  [####]   │    →      │  [####]   │                         │
│  │  [####]   │           │  [####]   │                         │
│  │  [####]   │           │  [####]   │                         │
│  └───────────┘           └───────────┘                         │
│  Soft glow              Bright particles                        │
│                                                                 │
│  Unlock at Lv.20:                                                 │
│  • Bright particle stream                                        │
│  • Animated border shimmer                                       │
│  • Enhanced rarity badge                                         │
│                                                                 │
│  [USE IN BATTLE]                        [VIEW ALL STAGES]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Prestige Visuals

Special visual treatments available through achievements and milestones:

| Visual | Source | Description |
|--------|--------|-------------|
| Golden Frame | Complete all Common artifacts | Gold-trimmed border |
| Platinum Edge | 100 level-ups | Platinum glow |
| Diamond Dust | First Mythic artifact | Diamond particle effect |
| Chrono Aura | Reach Prestige 5 | Time-distortion effect |
| Prismatic Wave | Collection 100% | Rainbow shimmer |

---

## 6. Artifact Traits

Traits are passive bonuses that artifacts can have. They provide variety and specialization without creating pay-to-win advantages.

### Trait System

Each artifact can have up to 2 traits (one innate, one acquired through fusion).

### Innate Traits

Artifacts receive one innate trait based on their category:

| Category | Possible Traits |
|----------|-----------------|
| Weapons | Battle Spirit, Power Focus, Critical Strike |
| Documents | Ancient Wisdom, Scholar's Insight |
| Jewelry | Lucky Charm, Fortune's Favor |
| Ancient Tools | Explorer's Bonus, Discovery Sense |
| Relics | Sacred Power, Divine Blessing |
| Military Objects | Defensive Stance, Tactical Advantage |
| Royal Objects | Royal Authority, Command Presence |
| Scientific Artifacts | Innovation Spark, Technical Mastery |

### Trait Descriptions

**Ancient Wisdom:**
- Effect: +15% Knowledge XP gain
- Source: Documents category innate
- Visual: Book icon with glow

**Battle Spirit:**
- Effect: +10% Power in battles
- Source: Weapons category innate
- Visual: Sword with flame

**Explorer Bonus:**
- Effect: +10% expedition rewards
- Source: Ancient Tools innate
- Visual: Compass with sparkle

**Museum Value:**
- Effect: +15% Museum Points
- Source: Relics category innate
- Visual: Museum icon with star

**Lucky Charm:**
- Effect: +5% capsule luck
- Source: Jewelry innate
- Visual: Four-leaf clover

**Critical Strike:**
- Effect: +8% battle critical chance
- Source: Weapons fusion
- Visual: Lightning bolt

### Trait Balance Rules

1. **No Combat Dominance:** Traits provide small advantages only
2. **Variety Over Power:** Traits enable different playstyles, not better ones
3. **Same Cost Structure:** All traits require same fusion investment
4. **Visible and Fair:** All trait effects shown clearly, no hidden bonuses

### Trait Display

```
┌─────────────────────────────────────────────────────────────────┐
│  TRAIT DETAILS                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Ankh of Eternity                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Innate Trait: "Ancient Wisdom"                            ││
│  │ Effect: +15% Knowledge XP gain                             ││
│  │ Description: "This artifact carries the wisdom of ages." ││
│  │                                                             ││
│  │ Acquired Trait: "Battle Spirit" (from fusion)              ││
│  │ Effect: +10% Power in battles                              ││
│  │ Description: "Forged in the fires of conflict."           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Special Artifact Variants

Special variants are cosmetic or limited editions of artifacts. They provide collection prestige without gameplay advantages.

### Variant Types

**Golden Variant:**
- Appearance: Gold-trimmed version of standard artifact
- Source: Complete all artifacts of a specific rarity
- Effect: Purely cosmetic
- Unlocked: Permanent

**Event Edition:**
- Appearance: Themed appearance for specific events
- Source: Limited-time events only
- Effect: Same stats as base, unique visuals
- Duration: Collectible only during event, usable forever

**Anniversary Edition:**
- Appearance: Special commemorative design
- Source: Annual anniversary events
- Effect: Same stats as base, exclusive frame
- Rarity: Very limited

**Founder Edition:**
- Appearance: Premium design with unique badge
- Source: Original players (pre-launch)
- Effect: Same stats, exclusive "Founder" tag
- Rarity: One-time distribution only

### Special Variant Table

| Variant | Visual Treatment | Acquisition | Stats |
|---------|-----------------|-------------|-------|
| Golden | Gold frame, particles | Rarity mastery | Same as base |
| Event | Themed colors, effects | Event completion | Same as base |
| Anniversary | Special badge, frame | Anniversary event | Same as base |
| Founder | Unique badge, border | Pre-launch players | Same as base |
| Prismatic | Rainbow effects | Prestige 10+ | Same as base |
| Chrono | Time-distortion effect | Prestige 15+ | Same as base |

### Variant Showcase

```
┌─────────────────────────────────────────────────────────────────┐
│  🏆 SPECIAL VARIANTS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Your "Ankh of Eternity" variants:                              │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Standard│ │ Golden  │ │ Event   │ │Founder  │              │
│  │  ✓      │ │   ✓     │ │  ✓      │ │    —    │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  Displaying: [Standard ▼]                                        │
│                                                                 │
│  [CHANGE VARIANT]                        [COLLECT NEW]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Upgrade Statistics

Players can track their artifact progression through comprehensive statistics.

### Statistics Tracked

| Statistic | Description | Display |
|-----------|-------------|---------|
| Total Upgrades | Lifetime artifact upgrades | Number |
| Levels Gained | Total levels across all artifacts | Number |
| Highest Artifact Level | Maximum level achieved | Level |
| Highest Rarity | Best rarity obtained | Rarity |
| Total Evolutions | Number of successful evolutions | Number |
| Evolution Success Rate | Percentage of successful evolutions | Percentage |
| Total Fusions | Number of fusions performed | Number |
| Fused Artifacts | Current number of fused artifacts | Number |
| Traits Acquired | Unique traits gained | Number |
| Variants Collected | Special variants owned | Number |

### Statistics Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 ARTIFACT PROGRESSION STATISTICS                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Lifetime Progress:                                              │
│  • Total Upgrades: 1,247                                        │
│  • Levels Gained: 8,934                                         │
│  • Highest Artifact Level: 67                                   │
│                                                                 │
│  Evolution:                                                      │
│  • Total Evolutions: 89                                         │
│  • Success Rate: 100%                                           │
│  • Common→Rare: 45                                             │
│  • Rare→Epic: 31                                               │
│  • Epic→Legendary: 12                                           │
│  • Legendary→Mythic: 1                                          │
│                                                                 │
│  Fusion:                                                        │
│  • Total Fusions: 23                                            │
│  • Fused Artifacts: 18                                          │
│  • Trait Combinations: 7                                        │
│                                                                 │
│  Variants:                                                      │
│  • Golden: 12                                                   │
│  • Event Edition: 5                                             │
│  • Anniversary: 1                                               │
│  • Founder: 0                                                   │
│                                                                 │
│  [VIEW HISTORY]  [MILESTONES]  [SHARE]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Milestone Achievements

| Milestone | Reward |
|-----------|--------|
| First Evolution | Badge: "Evolutionary" |
| 10 Evolutions | Frame: Bronze Upgrade |
| 50 Evolutions | Frame: Silver Upgrade |
| 100 Evolutions | Frame: Gold Upgrade |
| First Fusion | Badge: "Alchemist" |
| 10 Fusions | Title: "Fusion Master" |
| First Mythic | Aura: Prismatic Glow |
| All Golden Variants | Badge: "Golden Collector" |

---

## 9. Resource Economy

Artifact upgrades consume resources. The economy is balanced to reward regular play while preventing excessive grinding.

### Resource Costs Summary

| Upgrade Type | Chrono Coins | Time Shards | Fragments | Other |
|-------------|--------------|-------------|-----------|-------|
| Level Up (10 levels) | 50 | 100 | — | — |
| Common→Uncommon | 50 | 100 | 20 Common | — |
| Uncommon→Rare | 150 | 300 | 50 Uncommon | — |
| Rare→Epic | 500 | 1,000 | 150 Rare | — |
| Epic→Legendary | 2,000 | 5,000 | 500 Epic | — |
| Legendary→Mythic | 10,000 | 25,000 | 2,000 Legendary | 1 Mythic Essence |
| Base Fusion | 200 | 500 | 50 | — |
| Advanced Fusion | 500 | 1,500 | 150 | — |

### Balance Principles

**Sustainable Progression:**
- Resources earned faster than spent
- Average player can evolve 1 artifact per week
- Dedicated players can evolve 2-3 per week

**No Pay-to-Win:**
- All resources earnable through gameplay
- No direct purchase of evolved artifacts
- Evolution materials not sold for real money

**Time vs. Money:**
- Time investment: 80% of progression
- Resource management: 15% of progression
- Luck/patience: 5% of progression

### Resource Generation Rates

| Source | Chrono Coins | Time Shards | Fragments |
|--------|-------------|-------------|-----------|
| Daily Quests | 100-200 | 50-100 | 5-15 |
| Weekly Quests | 500-1,000 | 300-500 | 30-50 |
| Battle Rewards | 20-100 | 10-50 | 1-10 |
| Expedition (4hr) | 100-200 | 50-150 | 5-20 |
| Capsules | 50-500 | 25-250 | 1-25 |
| Achievements | 200-2,000 | 100-1,000 | 10-100 |

### Cost Scaling

- Level costs scale 15% per level tier
- Evolution costs scale 20% per rarity tier
- Fusion costs fixed (no scaling)

### Daily Investment Recommendation

| Player Type | Daily Upgrades | Weekly Evolution |
|-------------|---------------|-----------------|
| Casual | 1-2 level-ups | 1 Common→Uncommon |
| Regular | 3-5 level-ups | 1 Uncommon→Rare (monthly) |
| Dedicated | 5-10 level-ups | 1 Rare→Epic (monthly) |
| Committed | 10+ level-ups | Multiple evolutions |

---

## 10. Collection Philosophy

The collection system is designed to encourage gathering while respecting player time and investment.

### Collection Goals

**Short-term:**
- Complete Common and Uncommon sets
- Reach Level 20 on favorite artifacts
- First evolution (Common→Uncommon)

**Medium-term:**
- Complete Rare sets
- Reach Level 40 on key artifacts
- First Epic artifact
- Understand fusion mechanics

**Long-term:**
- Complete Epic and Legendary sets
- Reach maximum evolution on key artifacts
- Collect special variants
- Achieve Mythic artifact

### Progression Pacing

| Phase | Focus | Time to Complete |
|-------|-------|-----------------|
| Weeks 1-2 | Common/Uncommon collection | 2 weeks |
| Weeks 3-6 | Rare artifacts, first evolutions | 4 weeks |
| Months 2-3 | Epic collection, fusion understanding | 6 weeks |
| Months 4-6 | Legendary artifacts, advanced fusion | 12 weeks |
| Months 6+ | Mythic pursuit, collection mastery | Ongoing |

### Anti-Frustration Measures

**Duplicate Protection:**
- Set completion guarantee at 9/10
- Pity system for high rarities
- Fragment conversion at cap

**Sensible Grinding:**
- Clear progression visible at all times
- Multiple reward sources prevent monotony
- Daily caps prevent excessive play requirements

**No Pay-to-Win:**
- No rushing with real money
- All content achievable through play
- Competitive modes not dominated by evolutions

### Collection Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📚 ARTIFACT COLLECTION PROGRESS                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Overall: 127/200 artifacts (63.5%)                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Common:     45/50  ████████████████████░░  90%           ││
│  │ Uncommon:   32/40  ██████████████░░░░░░░░  80%           ││
│  │ Rare:       28/35  █████████████░░░░░░░░░  80%           ││
│  │ Epic:       15/25  ██████████░░░░░░░░░░░░░  60%           ││
│  │ Legendary:   7/15  ██████░░░░░░░░░░░░░░░░  47%           ││
│  │ Mythic:      0/5   ░░░░░░░░░░░░░░░░░░░░░░   0%           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Next Milestone: 75% (unlock: Prismatic Frame)                  │
│                                                                 │
│  [VIEW SETS]  [PRIORITY WISHLIST]  [COLLECTION ANALYSIS]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Telegram Bot Notifications

Telegram notifications inform players of significant artifact progression events without becoming spam.

### Notification Types

**Evolution Success:**
```
⚗️ EVOLUTION SUCCESS!

"Ankh of Eternity" has evolved to Rare!

Power increased: 20 → 35 (+75%)
New visual unlocked: Particle stream

[VIEW ARTIFACT] → Jolt Time
```

**Legendary Upgrade:**
```
🌟 LEGENDARY UPGRADE!

"Pharaoh's Mask" has reached Legendary!

One of your most powerful artifacts yet!
Power: 45 | Luck: 2.5x | Knowledge: 2.4x

[VIEW ARTIFACT] → Jolt Time
```

**Rare Fusion Complete:**
```
⚗️ RARE FUSION COMPLETE!

You created: "Enhanced Shield"
Traits: Battle Spirit + Critical Strike
Power: 42 (new maximum potential!)

[VIEW ARTIFACT] → Jolt Time
```

**New Visual Unlocked:**
```
✨ NEW VISUAL STAGE!

"Roman Gladius" reached Lv.20!

Visual upgrade unlocked:
• Bright particle stream
• Animated border
• Enhanced rarity badge

[VIEW ARTIFACT] → Jolt Time
```

**Trait Acquired:**
```
🎯 NEW TRAIT!

"Scribe's Palette" gained trait: "Ancient Wisdom"
Effect: +15% Knowledge XP gain

Total traits: 2/2 (max)

[VIEW ARTIFACT] → Jolt Time
```

### Notification Frequency Rules

| Notification | Max Per Day | Trigger |
|---------------|-------------|---------|
| Evolution Success | 2 | Each evolution |
| Legendary/Mythic | 1 | Each legendary+ evolution |
| Rare Fusion | 1 | Each fusion |
| Visual Unlock | 2 | Level milestones |
| Trait Acquired | 1 | Each new trait |
| **Total Cap** | **4** | **Never exceeded** |

### User Controls

- Global artifact notifications toggle
- Separate controls for evolution, fusion, visual
- Quiet hours respected
- Frequency cap enforced server-side

### Anti-Spam Philosophy

- Notifications celebrate milestones, not every action
- Never fear-based or manipulative
- Clear opt-out available
- Maximum 4 artifact notifications per day

---

## 12. AdsGram Integration

AdsGram remains the primary revenue system. Optional ad rewards enhance artifact progression without becoming mandatory.

### Optional Ad Rewards for Artifacts

| Ad Reward | Effect | Daily Limit | Mandatory |
|-----------|--------|-------------|-----------|
| XP Boost | +25% artifact XP for 1 hour | 3 ads | No |
| Fragment Bonus | +20% fragments from next battle | 3 ads | No |
| Evolution Discount | -25% evolution costs (one time) | 1 ad | No |
| Fusion Discount | -25% fusion costs (one time) | 1 ad | No |
| Lucky Drop | +10% rare chance for one battle | 2 ads | No |
| Level Skip | +5 levels to selected artifact | 1 ad | No |

### AdsGram Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ WATCH & EARN                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Ready to evolve your artifact?                                  │
│  Watch a video for:                                              │
│                                                                 │
│  [Evolution Discount -25%]  [XP Boost +25%]  [+5 Levels]      │
│                                                                 │
│  Today: 1/5 ads watched                                         │
│                                                                 │
│  [WATCH VIDEO]                           [MAYBE LATER]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Balance Philosophy

- **Never Required:** Complete all evolutions without watching ads
- **Genuine Help:** Ads provide convenience, not power
- **Fair Value:** Rewards match ad viewing time
- **No Pressure:** Clear dismiss option, no countdown timers

---

## 13. Future Expansion Notes

These features are documented for future consideration. They are not currently planned or in development.

### Artifact Awakening

**Concept:** Unlock additional hidden potential in artifacts
- Dormant abilities activated through special materials
- Visual transformation on awakening
- New gameplay mechanics

**Status:** Future consideration
**Priority:** Low
**Challenges:** Balance, complexity, player education

### Artifact Mastery

**Concept:** Deep expertise system for specific artifact types
- Mastery levels beyond current max
- Unique bonuses at mastery milestones
- Special titles and cosmetics

**Status:** Future consideration
**Priority:** Medium
**Challenges:** Progression pacing, motivation maintenance

### Artifact Skill Trees

**Concept:** Point-based ability allocation for artifacts
- Choose between different enhancements
- Multiple viable builds per artifact
- Strategic depth

**Status:** Future consideration
**Priority:** Low
**Challenges:** Interface complexity, balance

### Artifact Trading

**Concept:** Player-to-player artifact exchange
- Trade duplicates for other artifacts
- Fair market value system
- Anti-abuse protections

**Status:** Future consideration
**Priority:** Low
**Challenges:** Economy protection, fraud prevention

### Artifact Rental

**Concept:** Lend artifacts to friends for battles
- Temporary stat sharing
- Trust-based system
- Return guarantees

**Status:** Future consideration
**Priority:** Low
**Challenges:** Trust infrastructure, feature creep

---

## 14. Connected Systems

### Artifact Evolution Integration

**Museum System:**
- Evolved artifacts display with evolution badge
- Museum stats reflect evolved power
- Evolution milestones contribute to museum achievements

**Expedition System:**
- Higher-level artifacts return with better expedition rewards
- Expedition fragments used for evolution
- Rare expedition discoveries include evolution materials

**Quest System:**
- Evolution-specific daily/weekly quests
- "Evolve 1 artifact" type objectives
- Fragment collection milestones

**Achievement System:**
- Evolution milestone achievements
- Collection evolution achievements
- Fusion mastery achievements

**Battle System:**
- Artifact level contributes to battle power
- Evolution tier affects competitive matchmaking
- Fusion traits can provide battle advantages

### Data Flow

```
Level System ←→ XP Accumulation
Evolution ←→ Duplicate Management
Evolution ←→ Fragment Economy
Fusion ←→ Trait System
Visual ←→ Prestige System
Museum ←→ Artifact Display
Quests ←→ Evolution Objectives
Battles ←→ Artifact Power
Expeditions ←→ Fragment Sources
```

---

## 15. Technical Implementation Notes

### Database Schema

| Table | Purpose |
|-------|---------|
| `artifact_levels` | Current level, XP, level-up history |
| `artifact_evolution` | Evolution history, materials consumed |
| `artifact_fusion` | Fusion history, traits inherited |
| `artifact_visual` | Current visual stage, unlocked stages |
| `artifact_traits` | Active traits, source artifact |
| `artifact_variants` | Special variants owned |

### Evolution Validation

```javascript
// Server-side evolution validation
async function validateEvolution(artifactId, materials) {
  const artifact = await getArtifact(artifactId);
  const duplicates = await getDuplicateArtifacts(artifactId);
  
  // Validate requirements
  if (duplicates.length < 3) {
    throw new Error('Insufficient duplicates for evolution');
  }
  
  if (artifact.level < getRequiredLevel(artifact.rarity)) {
    throw new Error('Artifact must reach required level first');
  }
  
  if (!hasRequiredResources(materials)) {
    throw new Error('Insufficient resources for evolution');
  }
  
  // Process evolution atomically
  await db.transaction(async (tx) => {
    await consumeMaterials(materials, tx);
    await consumeDuplicates(duplicates, tx);
    await createEvolvedArtifact(artifact, tx);
  });
}
```

### Level Calculation

```javascript
// Artifact stat calculation
function calculateArtifactStats(artifact) {
  const basePower = artifact.baseStats.power;
  const rarityMultiplier = getRarityMultiplier(artifact.rarity);
  const levelBonus = 1 + (artifact.level * 0.02); // 2% per level
  const traitBonus = getTraitBonuses(artifact.traits);
  
  return {
    power: Math.floor(basePower * rarityMultiplier * levelBonus * traitBonus.power),
    luck: artifact.baseStats.luck * rarityMultiplier * levelBonus * traitBonus.luck,
    knowledge: artifact.baseStats.knowledge * rarityMultiplier * levelBonus * traitBonus.knowledge
  };
}
```

---

## 16. Balance Summary

### Progression Timeline

| Goal | Time Investment | Resource Cost |
|------|----------------|---------------|
| Level 1→20 | ~1 week | 500 Coins, 1,000 Shards |
| Common→Uncommon | ~2 weeks | 50 Coins, 100 Shards, 20 Fragments |
| Level 1→40 | ~1 month | 2,000 Coins, 5,000 Shards |
| Uncommon→Rare | ~1 month | 150 Coins, 300 Shards, 50 Fragments |
| Rare→Epic | ~2 months | 500 Coins, 1,000 Shards, 150 Fragments |
| Epic→Legendary | ~3 months | 2,000 Coins, 5,000 Shards, 500 Fragments |
| Legendary→Mythic | ~6 months | 10,000 Coins, 25,000 Shards, 2,000 Fragments |

### Competitive Balance

- Artifact level provides 2% power per level
- Evolution provides 100% power increase per tier
- Maximum power difference: ~5x between max and baseline
- Competitive modes normalize for evolution tier

### Fair Play Guarantees

- No artifact can be purchased with real money
- All evolution materials earnable through gameplay
- Competitive matchmaking accounts for evolution tier
- Collection and skill remain primary success factors

---

*Every artifact tells a story. Every evolution writes a new chapter.*

---

*Document Version: 1.0*  
*Last Updated: 2025-01-23*
