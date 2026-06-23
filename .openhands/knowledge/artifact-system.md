# Jolt Time — Artifact System

## Overview

The Artifact System is the core gameplay loop of Jolt Time. Players collect historical artifacts from different eras, level them up through use, and display their collection as a mark of temporal mastery. Artifacts are the primary driver of progression, collection, and long-term engagement.

This document defines the complete artifact specification: rarity tiers, data structure, categories, eras, progression mechanics, and representative examples.

---

## 1. Artifact Rarity

The rarity system defines how scarce, powerful, and visually impressive each artifact is. Every aspect—from drop probability to visual effects to stat multipliers—is tied to rarity.

### Rarity Overview

| Rarity | Color | Hex | Drop Probability | Visual Effects | Reward Multiplier | Sell Value Multiplier |
|--------|-------|-----|------------------|----------------|-------------------|----------------------|
| **Common** | Gray | `#9CA3AF` | 50.0% | None | 1.0x | 1x |
| **Uncommon** | Green | `#22C55E` | 25.0% | Soft glow | 1.5x | 2x |
| **Rare** | Blue | `#3B82F6` | 15.0% | Particle stream | 2.0x | 5x |
| **Epic** | Purple | `#A855F7` | 7.0% | Swirling aura | 3.0x | 15x |
| **Legendary** | Gold | `#F59E0B` | 2.5% | Flame wisps | 5.0x | 50x |
| **Mythic** | Rainbow | `#EC4899` → `#A855F7` → `#3B82F6` | 0.5% | Prismatic cascade | 10.0x | 200x |

### Rarity Details

#### Common

```
Color: Gray (#9CA3AF)
Background Tint: rgba(156, 163, 175, 0.1)
Border: 1px solid rgba(156, 163, 175, 0.2)

Visual Effects:
├── No glow effects
├── Simple card border
├── Minimal shadow (2px blur)
├── Idle animation: Gentle float (3s ease-in-out loop, 2px vertical)
├── Reveal animation: Fade in 0.5s + subtle scale from 0.95
└── Sound: Soft click on acquisition

Stat Multipliers:
├── Power: 1.0x base (8-15 range)
├── Luck: 1.0x base
├── Knowledge: 1.0x base
├── XP Gain: 1.0x
└── Sell Value: 1x base currency

Collection Notes:
├── Foundation of every collection
├── Complete sets quickly
├── Learn game mechanics
└── Guaranteed in every pull
```

#### Uncommon

```
Color: Green (#22C55E)
Background Tint: rgba(34, 197, 94, 0.1)
Border: 1px solid rgba(34, 197, 94, 0.3)
Glow: rgba(34, 197, 94, 0.15) blur 8px

Visual Effects:
├── Soft green glow around card
├── Subtle shimmer animation (4s loop)
├── Small sparkle burst on reveal (10-15 particles)
├── Gentle pulsing aura (3s cycle)
└── Sound: Pleasant chime on acquisition

Stat Multipliers:
├── Power: 1.25x base (14-20 range)
├── Luck: 1.25x base
├── Knowledge: 1.25x base
├── XP Gain: 1.5x
└── Sell Value: 2x base currency

Collection Notes:
├── Achievable within first week
├── Notable but not rare
├── Build anticipation for rarer finds
└── Set completion becomes a goal
```

#### Rare

```
Color: Blue (#3B82F6)
Background Tint: rgba(59, 130, 246, 0.15)
Border: 1px solid rgba(59, 130, 246, 0.4)
Glow: rgba(59, 130, 246, 0.2) blur 12px

Visual Effects:
├── Bright blue glow
├── Animated particle stream (continuous, 15-20 particles)
├── Card border shimmer effect (3s loop)
├── Enhanced card reveal with glow expansion
├── Rarity banner animation on acquisition
└── Sound: Achievement tone on acquisition

Stat Multipliers:
├── Power: 1.5x base (20-28 range)
├── Luck: 1.5x base
├── Knowledge: 1.5x base
├── XP Gain: 2.0x
└── Sell Value: 5x base currency

Collection Notes:
├── Takes effort to complete sets
├── Each rare feels earned
├── Milestone achievements unlocked
└── Social sharing encouraged
```

#### Epic

```
Color: Purple (#A855F7)
Background Tint: rgba(168, 85, 247, 0.2)
Border: 1px solid rgba(168, 85, 247, 0.5)
Glow: rgba(168, 85, 247, 0.3) blur 20px

Visual Effects:
├── Deep purple swirling aura
├── Continuous particle emission (30-40 particles)
├── Pulsing energy effect (2s cycle)
├── Animated card border
├── Full card reveal animation with screen flash
├── Persistent idle particles around card
└── Sound: Epic sting + reverb on acquisition

Stat Multipliers:
├── Power: 2.0x base (28-38 range)
├── Luck: 2.0x base
├── Knowledge: 2.0x base
├── XP Gain: 3.0x
└── Sell Value: 15x base currency

Collection Notes:
├── Significant milestone when acquired
├── Collection showcase items
├── Trade-worthy among players
└── Set completion feels major
```

#### Legendary

```
Color: Gold (#F59E0B)
Background Tint: rgba(245, 158, 11, 0.25)
Border: 2px solid rgba(245, 158, 11, 0.6)
Glow: rgba(245, 158, 11, 0.4) blur 30px

Visual Effects:
├── Golden radiant glow with flame wisps
├── Intense particle burst on reveal (80-100 particles)
├── Full-screen subtle golden flash on acquisition
├── Animated border with flame-like energy
├── Card has persistent ember particles
├── Premium sound design with reverb
├── Achievement notification popup
└── Sound: Legendary sting + reverb on acquisition

Stat Multipliers:
├── Power: 2.5x base (38-45 range)
├── Luck: 2.5x base
├── Knowledge: 2.5x base
├── XP Gain: 5.0x
└── Sell Value: 50x base currency

Collection Notes:
├── Truly special acquisition moment
├── Collection crown jewels
├── Worth sharing extensively
└── Long-term goal for most players
```

#### Mythic

```
Color: Rainbow (cycling through #EC4899, #A855F7, #3B82F6, #22C55E, #F59E0B)
Background Tint: rgba(236, 72, 153, 0.3) with prismatic gradient
Border: 2px animated gradient border (rainbow cycle)
Glow: Multi-color prismatic glow blur 40px

Visual Effects:
├── Prismatic rainbow cascade effect
├── Multi-colored particle explosion (150+ particles)
├── Screen-wide reveal animation
├── Persistent animated aura (3 color cycles)
├── Card border animates through spectrum
├── Unique achievement popup with fanfare
├── Legendary sound + choir sting + long reverb
└── Sound: Mythic sting + choir + extended reverb

Stat Multipliers:
├── Power: 3.0x base (45-50 range)
├── Luck: 3.0x base
├── Knowledge: 3.0x base
├── XP Gain: 10.0x
└── Sell Value: 200x base currency

Collection Notes:
├── Ultra-rare milestone (0.5% drop rate)
├── Unforgettable acquisition moment
├── Community-worthy event
├── Maximum prestige in collection
└── Long-term aspirational goal
```

### Rarity CSS Variables

```css
/* Common */
--rarity-common-primary: #9CA3AF;
--rarity-common-glow: rgba(156, 163, 175, 0.3);

/* Uncommon */
--rarity-uncommon-primary: #22C55E;
--rarity-uncommon-glow: rgba(34, 197, 94, 0.4);

/* Rare */
--rarity-rare-primary: #3B82F6;
--rarity-rare-glow: rgba(59, 130, 246, 0.4);

/* Epic */
--rarity-epic-primary: #A855F7;
--rarity-epic-glow: rgba(168, 85, 247, 0.5);

/* Legendary */
--rarity-legendary-primary: #F59E0B;
--rarity-legendary-glow: rgba(245, 158, 11, 0.6);

/* Mythic */
--rarity-mythic-primary: #EC4899;
--rarity-mythic-secondary: #A855F7;
--rarity-mythic-tertiary: #3B82F6;
--rarity-mythic-glow: rgba(236, 72, 153, 0.7);
```

### Pity System

```
PITY PROTECTION:

Every 10 capsules:
└── Guarantee: At least 1 Rare or higher

Every 50 capsules:
└── Guarantee: At least 1 Epic or higher

Every 100 capsules:
└── Guarantee: At least 1 Legendary

Every 500 capsules:
└── Guarantee: At least 1 Mythic

Set Completion Protection:
└── When 9/10 artifacts from a set are owned:
    └── Next acquisition of that set's era guarantees remaining artifact
```

---

## 2. Artifact Structure

### Data Schema

```typescript
interface Artifact {
  // Core Identification
  id: string;                    // Unique identifier (e.g., "egypt_ankh_001")
  name: string;                  // Display name (e.g., "Ankh of Eternity")

  // Descriptive Fields
  description: string;           // Brief description (1-2 sentences)
  era: EraId;                    // Associated historical era
  civilization: CivilizationId;  // Associated civilization
  category: ArtifactCategory;    // Artifact type/category
  rarity: Rarity;                // Common | Uncommon | Rare | Epic | Legendary | Mythic

  // Base Stats
  power: number;                 // Base power value (8-50 based on rarity)
  luck: number;                  // Luck modifier (affects drop rates)
  knowledge: number;             // Educational value (affects XP gain)

  // Progression
  level: number;                 // Current level (1-100)
  experience: number;            // Current XP toward next level

  // Media
  image_url: string;             // Artifact image URL

  // State Flags
  is_discovered: boolean;        // Has player seen this artifact?
  is_equipped: boolean;          // Currently equipped in loadout?

  // Timestamps
  created_at: string;            // ISO 8601 timestamp of acquisition
}
```

### Type Definitions

```typescript
type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

type EraId =
  | 'prehistoric'
  | 'ancient_egypt'
  | 'ancient_greece'
  | 'roman_empire'
  | 'vikings'
  | 'medieval_europe'
  | 'renaissance'
  | 'industrial_age'
  | 'world_wars'
  | 'modern_era';

type CivilizationId =
  | 'egypt'
  | 'greece'
  | 'rome'
  | 'vikings'
  | 'japan'
  | 'aztecs'
  | 'ukraine'
  | 'mesopotamia'
  | 'persia'
  | 'china'
  | 'mongol'
  | 'europe'
  | 'americas'
  | 'general';

type ArtifactCategory =
  | 'weapons'
  | 'documents'
  | 'jewelry'
  | 'ancient_tools'
  | 'relics'
  | 'military_objects'
  | 'royal_objects'
  | 'scientific_artifacts';
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique artifact identifier | `"egypt_ankh_001"` |
| `name` | string | Human-readable name | `"Ankh of Eternity"` |
| `description` | string | Brief lore description | `"Symbol of eternal life in ancient Egypt"` |
| `era` | EraId | Historical era classification | `"ancient_egypt"` |
| `civilization` | CivilizationId | Civilization classification | `"egypt"` |
| `category` | ArtifactCategory | Artifact type | `"relics"` |
| `rarity` | Rarity | Rarity tier | `"rare"` |
| `power` | number | Base combat power (1-100) | `24` |
| `luck` | number | Luck modifier (affects drops) | `1.5` |
| `knowledge` | number | Educational value (affects XP) | `1.25` |
| `level` | number | Current level (1-100) | `15` |
| `experience` | number | XP progress to next level | `1250` |
| `image_url` | string | Image asset URL | `"/artifacts/ankh_eternity.png"` |
| `is_discovered` | boolean | Player has encountered this artifact | `true` |
| `is_equipped` | boolean | Currently in active loadout | `false` |
| `created_at` | string | Acquisition timestamp (ISO 8601) | `"2024-01-15T10:30:00Z"` |

---

## 3. Artifact Categories

Artifacts are classified into eight categories based on their nature and function.

### Category Overview

| Category | Description | Example Artifacts | Common Eras |
|----------|-------------|-------------------|-------------|
| **Weapons** | Military and combat items | Swords, spears, shields, arrows | All martial eras |
| **Documents** | Written records and scrolls | Scrolls, tablets, charters, letters | Ancient, Medieval |
| **Jewelry** | Personal adornments and ornaments | Rings, amulets, crowns, bracelets | Ancient, Royal |
| **Ancient Tools** | Historical implements and instruments | Sickles, compasses, quills, sundials | Ancient, Renaissance |
| **Relics** | Sacred or historically significant objects | Idols, relics, ceremonial items | Ancient, Medieval |
| **Military Objects** | War-related equipment and gear | Helmets, armor, banners, medals | Viking, Medieval, Wars |
| **Royal Objects** | Items of monarchy and governance | Scepters, thrones, seals, crowns | Ancient, Medieval |
| **Scientific Artifacts** | Instruments of discovery and invention | Telescopes, astrolabes, early computers | Renaissance, Industrial, Modern |

### Category Details

#### Weapons

```
Category ID: weapons
Icon: ⚔️
Description: Swords, spears, axes, shields, and other instruments of war

Characteristics:
├── Primarily combat-themed
├── Often linked to specific warriors or battles
├── Strong visual identity
└── Frequently appear in Viking, Medieval, Roman eras

Example Artifacts:
├── Bronze Age Sword (Ancient Egypt)
├── Hoplite Spear (Ancient Greece)
├── Gladius (Roman Empire)
├── Viking Axe (Vikings)
├── Knight's Longsword (Medieval Europe)
└── Samurai Katana (Medieval Japan)
```

#### Documents

```
Category ID: documents
Icon: 📜
Description: Written records, scrolls, tablets, and paper artifacts

Characteristics:
├── Educational value often high
├── Include historical facts and lore
├── Variety of formats (papyrus, vellum, paper)
└── Common in Ancient, Medieval, Renaissance eras

Example Artifacts:
├── Clay Tablet (Mesopotamia)
├── Papyrus Scroll (Ancient Egypt)
├── Athenian Law Fragment (Ancient Greece)
├── Monastic Manuscript (Medieval Europe)
├── Leonardo's Notebooks (Renaissance)
└── Declaration of Independence (Modern Era)
```

#### Jewelry

```
Category ID: jewelry
Icon: 💍
Description: Personal adornments, ornaments, and decorative items

Characteristics:
├── Often linked to wealth and status
├── Strong visual appeal
├── Common in burial contexts (Egypt, Greece)
├── Range from simple to ornate

Example Artifacts:
├── Scarab Amulet (Ancient Egypt)
├── Greek Gold Ring (Ancient Greece)
├── Roman Signet Ring (Roman Empire)
├── Viking Arm Ring (Vikings)
├── Medieval Brooch (Medieval Europe)
└── Art Deco Necklace (Modern Era)
```

#### Ancient Tools

```
Category ID: ancient_tools
Icon: 🔧
Description: Historical implements, instruments, and working tools

Characteristics:
├── Show technological advancement
├── Include agricultural, craft, and navigational tools
├── Strong educational component
└── Span all eras with appropriate technology

Example Artifacts:
├── Bronze Sickle (Ancient Egypt)
├── Greek Odometer (Ancient Greece)
├── Roman Surveyor's Groma (Roman Empire)
├── Viking Rope (Vikings)
├── Renaissance Compass (Renaissance)
└── Early Printing Press (Renaissance)
```

#### Relics

```
Category ID: relics
Icon: 🗿
Description: Sacred, religious, or spiritually significant objects

Characteristics:
├── Often from religious contexts
├── Strong cultural significance
├── May be associated with specific myths or beliefs
└── Common in Ancient and Medieval eras

Example Artifacts:
├── Ankh (Ancient Egypt)
├── Delphi Oracle Bowl (Ancient Greece)
├── Saint's Finger Bone (Medieval Europe)
├── Buddhist Scroll (Medieval Asia)
├── Shroud Fragment (Renaissance)
└── Reliquary Cross (Medieval Europe)
```

#### Military Objects

```
Category ID: military_objects
Icon: 🛡️
Description: Equipment, gear, and objects used in warfare

Characteristics:
├── Wide variety (armor, helmets, banners, medals)
├── Often tied to specific battles or campaigns
├── Strong visual impact
└── Common in Viking, Medieval, World Wars eras

Example Artifacts:
├── Hoplite Shield (Ancient Greece)
├── Praetorian Guard Helmet (Roman Empire)
├── Viking Shield (Vikings)
├── Knight's Armor Piece (Medieval Europe)
├── WWI Dog Tags (World Wars)
└── WWII Medal of Honor (World Wars)
```

#### Royal Objects

```
Category ID: royal_objects
Icon: 👑
Description: Items of monarchy, governance, and royal ceremony

Characteristics:
├── Associated with rulers and authority
├── Often highly ornate and valuable
├── Strong power symbolism
└── Common in Ancient, Medieval, Renaissance eras

Example Artifacts:
├── Pharaoh's Scepter (Ancient Egypt)
├── Greek Wreath of Authority (Ancient Greece)
├── Imperial Roman Seal (Roman Empire)
├── Crown of Charlemagne (Medieval Europe)
├── Medici Signet Ring (Renaissance)
└── Victorian Sovereign Scepter (Industrial Age)
```

#### Scientific Artifacts

```
Category ID: scientific_artifacts
Icon: 🔬
Description: Instruments of science, exploration, and discovery

Characteristics:
├── Show intellectual and technological progress
├── Often tied to specific scientists or discoveries
├── Strong educational value
└── Common in Renaissance, Industrial, Modern eras

Example Artifacts:
├── Astrolabe (Medieval/Renaissance)
├── Early Microscope (Renaissance)
├── Steam Engine Model (Industrial Age)
├── First Telephone (Industrial Age)
├── Apollo Space Patch (Modern Era)
└── First Computer Chip (Modern Era)
```

---

## 4. Historical Eras

Every artifact belongs to a historical era. Eras define when and where an artifact originates, and determine its availability and progression context.

### Era List

| Era ID | Display Name | Time Period | Civilization Focus | Artifact Count |
|--------|--------------|-------------|-------------------|----------------|
| `prehistoric` | Prehistoric | Before 3500 BCE | General | 5 |
| `ancient_egypt` | Ancient Egypt | 3500-30 BCE | Egypt | 12 |
| `ancient_greece` | Ancient Greece | 800-31 BCE | Greece | 10 |
| `roman_empire` | Roman Empire | 27 BCE-476 CE | Rome | 10 |
| `vikings` | Vikings | 793-1066 CE | Vikings | 8 |
| `medieval_europe` | Medieval Europe | 476-1453 CE | Europe | 10 |
| `renaissance` | Renaissance | 1400-1700 CE | Europe, Italy | 8 |
| `industrial_age` | Industrial Age | 1760-1914 CE | Europe, America | 6 |
| `world_wars` | World Wars | 1914-1945 CE | Global | 6 |
| `modern_era` | Modern Era | 1945-2000 CE | Global | 5 |

### Era Details

#### Prehistoric

```
Era ID: prehistoric
Display: Prehistoric
Time Period: Before 3500 BCE
Color Theme: Earth tones (#8B7355, #A0522D, #696969)

Civilizations: General early human
Artifact Count: 5
Rarity Distribution: Common 60%, Uncommon 30%, Rare 10%

Sample Artifacts:
├── Hand Axe — Common, Power 10
├── Cave Painting Fragment — Uncommon, Power 14
├── Bone Needle — Common, Power 8
├── Ceremonial Mask — Rare, Power 22
└── Mammoth Tusk — Uncommon, Power 16
```

#### Ancient Egypt

```
Era ID: ancient_egypt
Display: Ancient Egypt
Time Period: 3500-30 BCE
Color Theme: Gold and lapis (#D4A574, #26619C, #1A1A1A)

Civilizations: Egypt
Artifact Count: 12
Rarity Distribution: Common 45%, Uncommon 28%, Rare 18%, Epic 7%, Legendary 2%

Sample Artifacts:
├── Clay Tablet — Common, Power 12
├── Papyrus Scroll — Common, Power 10
├── Ankh — Uncommon, Power 16
├── Cat Statue — Uncommon, Power 18
├── Pharaoh's Seal — Rare, Power 24
├── Scarab Amulet — Rare, Power 26
├── Obelisk Fragment — Epic, Power 34
└── Pharaoh's Death Mask — Legendary, Power 44
```

#### Ancient Greece

```
Era ID: ancient_greece
Display: Ancient Greece
Time Period: 800-31 BCE
Color Theme: Marble and olive (#F5F5F5, #808000, #CD7F32)

Civilizations: Greece
Artifact Count: 10
Rarity Distribution: Common 40%, Uncommon 28%, Rare 20%, Epic 9%, Legendary 3%

Sample Artifacts:
├── Amphora Vase — Common, Power 11
├── Greek Coin — Common, Power 12
├── Hoplite Spear — Uncommon, Power 18
├── Greek Helmet — Uncommon, Power 20
├── Olympic Wreath — Rare, Power 26
├── Delphi Oracle Bowl — Epic, Power 36
└── Alexander's Signet Ring — Legendary, Power 42
```

#### Roman Empire

```
Era ID: roman_empire
Display: Roman Empire
Time Period: 27 BCE-476 CE
Color Theme: Red and bronze (#8B0000, #CD7F32, #FFD700)

Civilizations: Rome
Artifact Count: 10
Rarity Distribution: Common 40%, Uncommon 27%, Rare 20%, Epic 10%, Legendary 3%

Sample Artifacts:
├── Roman Gladius — Uncommon, Power 19
├── Legion Shield — Uncommon, Power 17
├── Roman Senate Document — Common, Power 13
├── Praetorian Guard Helmet — Rare, Power 27
├── Pompeii Bread — Epic, Power 35
├── Imperial Eagle Standard — Epic, Power 38
└── Caesar's Laurel Wreath — Legendary, Power 43
```

#### Vikings

```
Era ID: vikings
Display: Vikings
Time Period: 793-1066 CE
Color Theme: Iron and frost (#434343, #4A6572, #8B4513)

Civilizations: Vikings (Norse)
Artifact Count: 8
Rarity Distribution: Common 38%, Uncommon 28%, Rare 22%, Epic 9%, Legendary 3%

Sample Artifacts:
├── Viking Axe — Uncommon, Power 19
├── Runic Stone Fragment — Common, Power 14
├── Viking Shield — Uncommon, Power 18
├── Norse Thor's Hammer — Rare, Power 28
├── Viking Longship Model — Epic, Power 36
└── Odin Rune Staff — Legendary, Power 42
```

#### Medieval Europe

```
Era ID: medieval_europe
Display: Medieval Europe
Time Period: 476-1453 CE
Color Theme: Stone and forest (#556B2F, #8B0000, #696969)

Civilizations: Europe (Kingdoms, Church)
Artifact Count: 10
Rarity Distribution: Common 38%, Uncommon 27%, Rare 22%, Epic 10%, Legendary 3%

Sample Artifacts:
├── Knight's Sword — Uncommon, Power 20
├── Castle Key — Common, Power 13
├── illuminated Manuscript Page — Uncommon, Power 17
├── Chain Mail Fragment — Rare, Power 26
├── Saint's Reliquary — Epic, Power 36
├── Excalibur Replica — Legendary, Power 44
└── Magna Carta Fragment — Epic, Power 38
```

#### Renaissance

```
Era ID: renaissance
Display: Renaissance
Time Period: 1400-1700 CE
Color Theme: Gold and crimson (#FFD700, #8B0000, #1E3A5F)

Civilizations: Italy, Europe
Artifact Count: 8
Rarity Distribution: Common 35%, Uncommon 25%, Rare 25%, Epic 12%, Legendary 3%

Sample Artifacts:
├── Compass — Common, Power 15
├── Printing Press Sample — Uncommon, Power 18
├── Leonardo's Sketch — Rare, Power 28
├── Galileo's Telescope — Epic, Power 38
├── Michelangelo's Drawing — Epic, Power 36
└── Da Vinci's Codex — Legendary, Power 45
```

#### Industrial Age

```
Era ID: industrial_age
Display: Industrial Age
Time Period: 1760-1914 CE
Color Theme: Steel and brass (#71797E, #B5A642, #2F4F4F)

Civilizations: Europe, America
Artifact Count: 6
Rarity Distribution: Common 35%, Uncommon 25%, Rare 25%, Epic 12%, Legendary 3%

Sample Artifacts:
├── Steam Engine Piston — Rare, Power 28
├── Telegraph Key — Uncommon, Power 19
├── Early Locomotive Model — Epic, Power 36
├── Inventions Patent — Rare, Power 26
└── First Telephone — Epic, Power 38
```

#### World Wars

```
Era ID: world_wars
Display: World Wars
Time Period: 1914-1945 CE
Color Theme: Olive and iron (#556B2F, #434343, #8B0000)

Civilizations: Global
Artifact Count: 6
Rarity Distribution: Common 30%, Uncommon 25%, Rare 28%, Epic 14%, Legendary 3%

Sample Artifacts:
├── WWI Trench Art — Common, Power 15
├── Dog Tags — Uncommon, Power 18
├── M1 Helmet — Rare, Power 26
├── WWII Medal of Honor — Epic, Power 38
└── Enigma Machine Fragment — Legendary, Power 44
```

#### Modern Era

```
Era ID: modern_era
Display: Modern Era
Time Period: 1945-2000 CE
Color Theme: Silver and blue (#C0C0C0, #00008B, #FF69B4)

Civilizations: Global
Artifact Count: 5
Rarity Distribution: Common 25%, Uncommon 25%, Rare 28%, Epic 17%, Legendary 5%

Sample Artifacts:
├── First Computer Chip — Legendary, Power 46
├── Apollo Mission Patch — Epic, Power 38
├── Berlin Wall Fragment — Epic, Power 36
├── Woodstock Pass — Uncommon, Power 20
└── Civil Rights Button — Rare, Power 28
```

---

## 5. Progression Rules

Artifacts gain experience and level up over time, increasing their stats and visual appeal.

### Experience System

```
EXPERIENCE GAIN:

Sources of XP:
├── Artifact used in battle: +10-100 XP (based on rarity)
├── Artifact capsule opened: +5-50 XP (based on rarity)
├── Collection milestone reached: +100-1000 XP
├── Set completion bonus: +200-2000 XP
└── Discovery of new artifact: +25-500 XP

XP Formula:
XP_to_next_level = 100 * (current_level ^ 1.5)

Level Progression Table:
├── Level 1→2: 100 XP
├── Level 10→11: 316 XP
├── Level 25→26: 1,250 XP
├── Level 50→51: 3,536 XP
├── Level 75→76: 6,495 XP
├── Level 99→100: 9,950 XP
└── Level 1→100 Total: ~200,000 XP
```

### Level Cap

```
LEVEL CAP: 100

Characteristics:
├── Maximum level is 100 for all artifacts
├── Level 100 artifacts display "MAX" badge
├── Max level artifacts cannot gain more XP
├── Visual evolution completes at level 50 and 100
└── No prestige/reset mechanic (all progress kept)
```

### Stat Scaling by Level

```
LEVEL STAT MULTIPLIERS:

Base stats increase by level. Formula:
stat_at_level = base_stat * (1 + (level - 1) * 0.02)

Example (base power = 20):
├── Level 1: 20.0
├── Level 25: 29.6
├── Level 50: 39.6
├── Level 75: 49.6
└── Level 100: 59.8

Stat Breakdown:
├── Power: Combat effectiveness
├── Luck: Drop rate bonus for that artifact's era
└── Knowledge: XP gain bonus for collecting

Level thresholds for visual changes:
├── Level 25: First visual enhancement
├── Level 50: Second visual enhancement (Mythic evolution starts)
├── Level 75: Third visual enhancement
└── Level 100: Final form (Mythic artifacts reach ultimate evolution)
```

### Mythic Artifact Visual Evolution

Mythic artifacts undergo three visual transformations as they level up, reflecting their growing power and significance.

```
MYTHIC EVOLUTION STAGES:

Stage 1 — Awakening (Level 1-24):
├── Prismatic base glow (subtle)
├── Rainbow particle sparkles (occasional)
├── Base artifact appearance
└── "Mythic" badge visible

Stage 2 — Manifestation (Level 25-49):
├── Intensified prismatic aura
├── Continuous particle emission (multi-color)
├── Card border animates through spectrum
├── Slight glow expansion
└── "Mythic II" badge appears

Stage 3 — Ascension (Level 50-74):
├── Full prismatic cascade effect
├── Particle explosion on any interaction
├── Animated background effects
├── Card has persistent ember and sparkle trails
├── "Mythic III" badge appears
└── Level 50 evolution ceremony animation

Stage 4 — Transcendence (Level 75-99):
├── Ultimate prismatic effects
├── Screen-wide subtle rainbow shimmer
├── Legendary-tier sound effects on all interactions
├── Unique card frame with animated borders
├── "Mythic IV" badge appears
└── Full evolved visual identity

Stage 5 — Apotheosis (Level 100):
├── Complete visual transformation
├── Animated deity-like aura
├── Particle systems at maximum density
├── Unique acquisition animation
├── "Mythic MAX" badge with special effects
├── Profile showcase highlight
└── "Mythic Ultimate" title awarded to player
```

### Level-Up Animation

```
LEVEL UP ANIMATION SEQUENCE:

Duration: 1.5 seconds
Trigger: When artifact reaches new level

Animation Steps:
1. (0.0s) Card glows brightly (rarity color)
2. (0.2s) Level number pulses and increments
3. (0.4s) Particle burst from card center
4. (0.6s) Stats panel updates with green highlight
5. (0.8s) Subtle whoosh sound effect
6. (1.0s) "+1 Level" floats up from card
7. (1.2s) If evolution stage reached, special effect plays
8. (1.5s) Returns to idle state

Evolution Stage Transitions:
├── Additional 1.0s animation duration
├── Screen flash in rarity color
├── "Evolution Unlocked!" notification
├── Preview of new visual form
└── Social sharing prompt (optional)
```

---

## 6. Artifact Examples

Twenty-plus artifacts spanning all eras, categories, and rarities.

### Prehistoric Era

#### 1. Hand Axe

```
ID: prehistoric_hand_axe
Name: Hand Axe
Era: Prehistoric
Civilization: General
Category: weapons
Rarity: common

Base Stats:
├── Power: 10
├── Luck: 1.0
└── Knowledge: 1.0

Description: "Stone tool shaped by early humans over 1 million years."
Image URL: /artifacts/prehistoric_hand_axe.png

Discovery: Tutorial completion
Set: "First Tools" (3/3)
```

#### 2. Cave Painting Fragment

```
ID: prehistoric_cave_painting
Name: Cave Painting Fragment
Era: Prehistoric
Civilization: General
Category: documents
Rarity: uncommon

Base Stats:
├── Power: 14
├── Luck: 1.2
└── Knowledge: 1.3

Description: "A fragment of ancient art depicting the world 20,000 years ago."
Image URL: /artifacts/prehistoric_cave_painting.png

Discovery: Level 3+
Set: "First Artists" (2/3)
```

#### 3. Ceremonial Mask

```
ID: prehistoric_ceremonial_mask
Name: Ceremonial Mask
Era: Prehistoric
Civilization: General
Category: relics
Rarity: rare

Base Stats:
├── Power: 22
├── Luck: 1.5
└── Knowledge: 1.5

Description: "Mask worn during ancient rituals to connect with spirits."
Image URL: /artifacts/prehistoric_ceremonial_mask.png

Discovery: Level 5+
Set: "Spirit World" (1/2)
```

---

### Ancient Egypt

#### 4. Clay Tablet

```
ID: egypt_clay_tablet
Name: Clay Tablet
Era: ancient_egypt
Civilization: egypt
Category: documents
Rarity: common

Base Stats:
├── Power: 12
├── Luck: 1.0
└── Knowledge: 1.2

Description: "Early writing surface，记录尼罗河的洪水记录。"
Image URL: /artifacts/egypt_clay_tablet.png

Discovery: Tutorial completion
Set: "Scribes of Egypt" (2/4)
```

#### 5. Papyrus Scroll

```
ID: egypt_papyrus_scroll
Name: Papyrus Scroll
Era: ancient_egypt
Civilization: egypt
Category: documents
Rarity: common

Base Stats:
├── Power: 10
├── Luck: 1.0
└── Knowledge: 1.3

Description: "Ancient paper made from Nile reed fibers."
Image URL: /artifacts/egypt_papyrus_scroll.png

Discovery: Tutorial completion
Set: "Scribes of Egypt" (1/4)
```

#### 6. Ankh

```
ID: egypt_ankh
Name: Ankh of Eternity
Era: ancient_egypt
Civilization: egypt
Category: relics
Rarity: uncommon

Base Stats:
├── Power: 16
├── Luck: 1.25
└── Knowledge: 1.25

Description: "Key of life—symbol of eternal existence in ancient Egypt."
Image URL: /artifacts/egypt_ankh.png

Discovery: Level 2+
Set: "Divine Symbols" (2/5)
```

#### 7. Cat Statue

```
ID: egypt_cat_statue
Name: Cat Statue of Bastet
Era: ancient_egypt
Civilization: egypt
Category: jewelry
Rarity: uncommon

Base Stats:
├── Power: 18
├── Luck: 1.3
└── Knowledge: 1.2

Description: "Statue honoring Bastet, goddess of home and fertility."
Image URL: /artifacts/egypt_cat_statue.png

Discovery: Level 3+
Set: "Sacred Animals" (2/4)
```

#### 8. Scarab Amulet

```
ID: egypt_scarab
Name: Scarab Amulet
Era: ancient_egypt
Civilization: egypt
Category: jewelry
Rarity: rare

Base Stats:
├── Power: 26
├── Luck: 1.5
└── Knowledge: 1.5

Description: "Symbol of rebirth, worn by living and placed with the dead."
Image URL: /artifacts/egypt_scarab.png

Discovery: Level 5+
Set: "Divine Symbols" (3/5)
```

#### 9. Pharaoh's Death Mask

```
ID: egypt_death_mask
Name: Pharaoh's Death Mask
Era: ancient_egypt
Civilization: egypt
Category: royal_objects
Rarity: legendary

Base Stats:
├── Power: 44
├── Luck: 2.5
└── Knowledge: 2.5

Description: "Golden mask placed over the face of pharaohs in burial."
Image URL: /artifacts/egypt_death_mask.png

Discovery: Level 15+, Very rare drop
Set: "Royal Burial" (1/3)
```

---

### Ancient Greece

#### 10. Amphora Vase

```
ID: greece_amphora
Name: Athenian Amphora
Era: ancient_greece
Civilization: greece
Category: ancient_tools
Rarity: common

Base Stats:
├── Power: 11
├── Luck: 1.0
└── Knowledge: 1.2

Description: "Two-handled vessel used for wine and olive oil storage."
Image URL: /artifacts/greece_amphora.png

Discovery: Tutorial completion
Set: "Athenian Pottery" (1/4)
```

#### 11. Hoplite Spear

```
ID: greece_hoplite_spear
Name: Hoplite Spear
Era: ancient_greece
Civilization: greece
Category: weapons
Rarity: uncommon

Base Stats:
├── Power: 19
├── Luck: 1.25
└── Knowledge: 1.1

Description: "Ash wood shaft with bronze tip, weapon of citizen-soldiers."
Image URL: /artifacts/greece_hoplite_spear.png

Discovery: Level 10+
Set: "Hoplite Arsenal" (2/4)
```

#### 12. Olympic Wreath

```
ID: greece_olympic_wreath
Name: Olympic Olive Wreath
Era: ancient_greece
Civilization: greece
Category: royal_objects
Rarity: rare

Base Stats:
├── Power: 26
├── Luck: 1.5
└── Knowledge: 1.6

Description: "Wreath of wild olive awarded to Olympic victors."
Image URL: /artifacts/greece_olympic_wreath.png

Discovery: Level 12+
Set: "Olympic Glory" (2/4)
```

#### 13. Delphi Oracle Bowl

```
ID: greece_delphi_bowl
Name: Delphi Oracle Bowl
Era: ancient_greece
Civilization: greece
Category: relics
Rarity: epic

Base Stats:
├── Power: 36
├── Luck: 2.0
└── Knowledge: 2.2

Description: "Bronze bowl used by the Pythia to channel prophecies."
Image URL: /artifacts/greece_delphi_bowl.png

Discovery: Level 18+, Rare drop
Set: "Oracle Secrets" (1/3)
```

---

### Roman Empire

#### 14. Roman Gladius

```
ID: rome_gladius
Name: Roman Gladius
Era: roman_empire
Civilization: rome
Category: weapons
Rarity: uncommon

Base Stats:
├── Power: 19
├── Luck: 1.25
└── Knowledge: 1.2

Description: "Short sword that conquered the Mediterranean world."
Image URL: /artifacts/rome_gladius.png

Discovery: Level 25+
Set: "Legion Arsenal" (2/5)
```

#### 15. Praetorian Guard Helmet

```
ID: rome_praetorian_helmet
Name: Praetorian Guard Helmet
Era: roman_empire
Civilization: rome
Category: military_objects
Rarity: rare

Base Stats:
├── Power: 27
├── Luck: 1.5
└── Knowledge: 1.4

Description: "Distinctive helmet of Rome's elite imperial guard."
Image URL: /artifacts/rome_praetorian_helmet.png

Discovery: Level 28+
Set: "Imperial Guard" (1/4)
```

#### 16. Pompeii Bread

```
ID: rome_pompeii_bread
Name: Pompeii Bread
Era: roman_empire
Civilization: rome
Category: ancient_tools
Rarity: epic

Base Stats:
├── Power: 35
├── Luck: 2.0
└── Knowledge: 2.5

Description: "Bread preserved in volcanic ash from the 79 CE eruption."
Image URL: /artifacts/rome_pompeii_bread.png

Discovery: Level 30+, Rare drop
Set: "Frozen in Time" (1/3)
```

#### 17. Caesar's Laurel Wreath

```
ID: rome_caesar_wreath
Name: Caesar's Laurel Wreath
Era: roman_empire
Civilization: rome
Category: royal_objects
Rarity: legendary

Base Stats:
├── Power: 43
├── Luck: 2.5
└── Knowledge: 2.6

Description: "Golden wreath worn by Julius Caesar, symbol of victory."
Image URL: /artifacts/rome_caesar_wreath.png

Discovery: Level 35+, Very rare drop
Set: "Dictators of Rome" (1/3)
```

---

### Vikings

#### 18. Viking Axe

```
ID: viking_axe
Name: Viking Battle Axe
Era: vikings
Civilization: vikings
Category: weapons
Rarity: uncommon

Base Stats:
├── Power: 19
├── Luck: 1.25
└── Knowledge: 1.1

Description: "Bearded axe used by Norse warriors in raid and battle."
Image URL: /artifacts/viking_axe.png

Discovery: Level 30+
Set: "Raider's Arsenal" (2/4)
```

#### 19. Norse Thor's Hammer

```
ID: viking_thors_hammer
Name: Mjölnir Pendant
Era: vikings
Civilization: vikings
Category: relics
Rarity: rare

Base Stats:
├── Power: 28
├── Luck: 1.6
└── Knowledge: 1.7

Description: "Amulet depicting Thor's hammer, symbol of protection."
Image URL: /artifacts/viking_thors_hammer.png

Discovery: Level 32+
Set: "Norse Pantheon" (1/4)
```

#### 20. Viking Longship Figurehead

```
ID: viking_longship
Name: Dragon Longship Model
Era: vikings
Civilization: vikings
Category: military_objects
Rarity: epic

Base Stats:
├── Power: 36
├── Luck: 2.0
└── Knowledge: 2.1

Description: "Miniature of the dragon-prowed ships that terrorized Europe."
Image URL: /artifacts/viking_longship.png

Discovery: Level 38+, Rare drop
Set: "Age of Exploration" (1/3)
```

---

### Medieval Europe

#### 21. Knight's Longsword

```
ID: medieval_knight_sword
Name: Knight's Longsword
Era: medieval_europe
Civilization: europe
Category: weapons
Rarity: uncommon

Base Stats:
├── Power: 20
├── Luck: 1.25
└── Knowledge: 1.15

Description: "Double-edged sword of the medieval mounted warrior."
Image URL: /artifacts/medieval_knight_sword.png

Discovery: Level 30+
Set: "Chivalric Code" (2/4)
```

#### 22. Illuminated Manuscript

```
ID: medieval_manuscript
Name: Illuminated Manuscript Page
Era: medieval_europe
Civilization: europe
Category: documents
Rarity: uncommon

Base Stats:
├── Power: 17
├── Luck: 1.2
└── Knowledge: 1.5

Description: "Gilded page from a monk's prayer book, circa 1200 CE."
Image URL: /artifacts/medieval_manuscript.png

Discovery: Level 31+
Set: "Monastic Knowledge" (1/4)
```

#### 23. Chain Mail Fragment

```
ID: medieval_chainmail
Name: Chain Mail Fragment
Era: medieval_europe
Civilization: europe
Category: military_objects
Rarity: rare

Base Stats:
├── Power: 26
├── Luck: 1.5
└── Knowledge: 1.2

Description: "Interlocking iron rings that protected medieval soldiers."
Image URL: /artifacts/medieval_chainmail.png

Discovery: Level 33+
Set: "Fortress Defenders" (2/4)
```

#### 24. Excalibur Replica

```
ID: medieval_excalibur
Name: Excalibur Replica
Era: medieval_europe
Civilization: europe
Category: weapons
Rarity: legendary

Base Stats:
├── Power: 44
├── Luck: 2.5
└── Knowledge: 2.4

Description: "Sword of kings, said to be pulled from stone by Arthur."
Image URL: /artifacts/medieval_excalibur.png

Discovery: Level 40+, Very rare drop
Set: "Legends of Camelot" (1/3)
```

---

### Renaissance

#### 25. Renaissance Compass

```
ID: renaissance_compass
Name: Renaissance Compass
Era: renaissance
Civilization: europe
Category: ancient_tools
Rarity: common

Base Stats:
├── Power: 15
├── Luck: 1.1
└── Knowledge: 1.4

Description: "Navigation instrument of the great Age of Discovery explorers."
Image URL: /artifacts/renaissance_compass.png

Discovery: Level 35+
Set: "Explorer's Tools" (1/4)
```

#### 26. Galileo's Telescope

```
ID: renaissance_telescope
Name: Galileo's Telescope
Era: renaissance
Civilization: europe
Category: scientific_artifacts
Rarity: epic

Base Stats:
├── Power: 38
├── Luck: 2.0
└── Knowledge: 2.6

Description: "One of the first telescopes, revealing the moons of Jupiter."
Image URL: /artifacts/renaissance_telescope.png

Discovery: Level 40+, Rare drop
Set: "Scientific Revolution" (1/4)
```

#### 27. Da Vinci's Codex

```
ID: renaissance_davinci_codex
Name: Da Vinci's Codex
Era: renaissance
Civilization: europe
Category: documents
Rarity: legendary

Base Stats:
├── Power: 45
├── Luck: 2.5
└── Knowledge: 3.0

Description: "Pages from Leonardo's notebooks showing genius across disciplines."
Image URL: /artifacts/renaissance_davinci_codex.png

Discovery: Level 45+, Very rare drop
Set: "Masters of Renaissance" (1/3)
```

---

### Industrial Age

#### 28. Steam Engine Piston

```
ID: industrial_steam_piston
Name: Steam Engine Piston
Era: industrial_age
Civilization: europe
Category: scientific_artifacts
Rarity: rare

Base Stats:
├── Power: 28
├── Luck: 1.5
└── Knowledge: 1.8

Description: "Component of the engine that powered the Industrial Revolution."
Image URL: /artifacts/industrial_steam_piston.png

Discovery: Level 40+
Set: "Steam Power" (1/3)
```

#### 29. Early Telephone

```
ID: industrial_telephone
Name: Bell's Telephone
Era: industrial_age
Civilization: americas
Category: scientific_artifacts
Rarity: epic

Base Stats:
├── Power: 38
├── Luck: 2.0
└── Knowledge: 2.2

Description: "Alexander Graham Bell's first telephone, 1876."
Image URL: /artifacts/industrial_telephone.png

Discovery: Level 42+, Rare drop
Set: "Communication Revolution" (1/4)
```

---

### World Wars

#### 30. WWI Dog Tags

```
ID: wars_dog_tags
Name: WWI Dog Tags
Era: world_wars
Civilization: general
Category: military_objects
Rarity: uncommon

Base Stats:
├── Power: 18
├── Luck: 1.2
└── Knowledge: 1.4

Description: "Identification tags worn by soldiers in the Great War."
Image URL: /artifacts/wars_dog_tags.png

Discovery: Level 45+
Set: "The Great War" (1/4)
```

#### 31. M1 Steel Helmet

```
ID: wars_m1_helmet
Name: M1 Steel Helmet
Era: world_wars
Civilization: americas
Category: military_objects
Rarity: rare

Base Stats:
├── Power: 26
├── Luck: 1.5
└── Knowledge: 1.3

Description: "The 'steel pot' that protected millions in World War II."
Image URL: /artifacts/wars_m1_helmet.png

Discovery: Level 46+
Set: "World War Memories" (1/5)
```

#### 32. Enigma Machine Fragment

```
ID: wars_enigma
Name: Enigma Machine Fragment
Era: world_wars
Civilization: europe
Category: scientific_artifacts
Rarity: legendary

Base Stats:
├── Power: 44
├── Luck: 2.5
└── Knowledge: 2.8

Description: "Piece of the cipher machine that shaped the war's outcome."
Image URL: /artifacts/wars_enigma.png

Discovery: Level 48+, Very rare drop
Set: "Codebreakers" (1/2)
```

---

### Modern Era

#### 33. First Computer Chip

```
ID: modern_intel_4004
Name: Intel 4004 Microprocessor
Era: modern_era
Civilization: americas
Category: scientific_artifacts
Rarity: legendary

Base Stats:
├── Power: 46
├── Luck: 2.5
└── Knowledge: 3.0

Description: "The first commercially available microprocessor, 1971."
Image URL: /artifacts/modern_intel_4004.png

Discovery: Level 48+, Very rare drop
Set: "Digital Revolution" (1/4)
```

#### 34. Apollo Mission Patch

```
ID: modern_apollo_patch
Name: Apollo 11 Mission Patch
Era: modern_era
Civilization: americas
Category: scientific_artifacts
Rarity: epic

Base Stats:
├── Power: 38
├── Luck: 2.0
└── Knowledge: 2.5

Description: "Patch worn by the first humans to walk on the moon."
Image URL: /artifacts/modern_apollo_patch.png

Discovery: Level 47+
Set: "Space Race" (1/5)
```

#### 35. Civil Rights Button

```
ID: modern_civil_rights
Name: Freedom Summer Button
Era: modern_era
Civilization: americas
Category: documents
Rarity: rare

Base Stats:
├── Power: 28
├── Luck: 1.6
└── Knowledge: 1.9

Description: "Worn badge from the fight for voting rights, 1964."
Image URL: /artifacts/modern_civil_rights.png

Discovery: Level 47+
Set: "Civil Rights Legacy" (1/4)
```

---

## 7. Summary Tables

### Rarity Quick Reference

| Rarity | Hex | Drop % | Power Range | Visual | Reward Mult | Sell Mult |
|--------|-----|--------|-------------|--------|-------------|-----------|
| Common | `#9CA3AF` | 50.0% | 8-15 | None | 1.0x | 1x |
| Uncommon | `#22C55E` | 25.0% | 14-20 | Soft glow | 1.5x | 2x |
| Rare | `#3B82F6` | 15.0% | 20-28 | Particles | 2.0x | 5x |
| Epic | `#A855F7` | 7.0% | 28-38 | Swirl | 3.0x | 15x |
| Legendary | `#F59E0B` | 2.5% | 38-45 | Flames | 5.0x | 50x |
| Mythic | Rainbow | 0.5% | 45-50 | Prismatic | 10.0x | 200x |

### Category Quick Reference

| Category | Icon | Description | Primary Eras |
|----------|------|-------------|--------------|
| Weapons | ⚔️ | Combat items | Viking, Medieval, Roman |
| Documents | 📜 | Written records | Ancient, Medieval |
| Jewelry | 💍 | Adornments | Ancient, Royal |
| Ancient Tools | 🔧 | Implements | All eras |
| Relics | 🗿 | Sacred items | Ancient, Medieval |
| Military Objects | 🛡️ | War gear | Viking, Wars |
| Royal Objects | 👑 | Monarchy items | Ancient, Medieval |
| Scientific Artifacts | 🔬 | Science/invention | Renaissance, Modern |

### Era Quick Reference

| Era ID | Display | Period | Artifacts |
|--------|---------|--------|-----------|
| prehistoric | Prehistoric | Before 3500 BCE | 5 |
| ancient_egypt | Ancient Egypt | 3500-30 BCE | 12 |
| ancient_greece | Ancient Greece | 800-31 BCE | 10 |
| roman_empire | Roman Empire | 27 BCE-476 CE | 10 |
| vikings | Vikings | 793-1066 CE | 8 |
| medieval_europe | Medieval Europe | 476-1453 CE | 10 |
| renaissance | Renaissance | 1400-1700 CE | 8 |
| industrial_age | Industrial Age | 1760-1914 CE | 6 |
| world_wars | World Wars | 1914-1945 CE | 6 |
| modern_era | Modern Era | 1945-2000 CE | 5 |

---

*Every artifact is a window into history. Every collection is a journey through time.*