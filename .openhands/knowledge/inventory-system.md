# Jolt Time — Inventory and Collection System

## Overview

The Inventory and Collection System is Jolt Time's central player-facing management layer. It encompasses artifact storage and organization, collection tracking and progress, museum display mechanics, and a prestige system that rewards long-term dedication. The system is designed to scale from new players with a handful of artifacts to veterans with near-complete collections, maintaining performance and usability at every stage.

---

## Part I: Inventory System

The Inventory System manages all artifacts in the player's possession, providing organization, search, quick actions, and duplicate handling.

---

## 1. Inventory Structure

### 1.1 Core Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INVENTORY CORE FEATURES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ARTIFACT STORAGE                                                           │
│  • Primary artifact collection storage                                       │
│  • Organized grid/list view                                                  │
│  • Virtualized scrolling for 1000+ items                                     │
│  • Artifact card displays: image, name, rarity, level, equipped status      │
│                                                                              │
│  SORTING                                                                    │
│  • By rarity (Mythic → Common)                                             │
│  • By era (Ancient → Future)                                               │
│  • By power (highest → lowest)                                              │
│  • By level (highest → lowest)                                              │
│  • By newest (most recent first)                                             │
│  • By oldest (earliest first)                                               │
│                                                                              │
│  FILTERING                                                                  │
│  • Era filter (multi-select)                                                │
│  • Civilization filter (multi-select)                                       │
│  • Category filter (multi-select)                                             │
│  • Rarity filter (multi-select)                                             │
│  • Level range filter (slider)                                               │
│                                                                              │
│  SEARCH                                                                     │
│  • Real-time text search by artifact name                                    │
│  • Partial match support                                                      │
│  • Case-insensitive                                                          │
│                                                                              │
│  FAVORITES                                                                  │
│  • Star/unstar artifacts                                                     │
│  • Dedicated favorites view                                                   │
│  • Quick access via favorites tab                                            │
│                                                                              │
│  EQUIPPED ARTIFACTS                                                          │
│  • Equipped badge on equipped items                                          │
│  • Dedicated "Equipped" filter view                                          │
│  • Loadout slots indicator                                                   │
│                                                                              │
│  QUICK ACTIONS                                                               │
│  • View details (tap)                                                       │
│  • Favorite/unfavorite (star icon)                                           │
│  • Share artifact (share icon)                                               │
│  • View in museum (museum icon)                                              │
│  • Equip/unequip (equip icon)                                               │
│                                                                              │
│  DUPLICATE MANAGEMENT                                                        │
│  • Duplicate count badge on card                                             │
│  • Automatic fragment conversion                                              │
│  • Conversion notification                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Inventory Sections

The inventory contains distinct sections for different item types:

| Section | Description | Contents |
|---------|-------------|----------|
| **Artifacts** | Primary collection | All historical artifacts |
| **Museum** | Display-only showcase | Curated museum artifacts |
| **Consumables** | Single-use items | Energy refills, dust, boosters |
| **Event Items** | Limited-time items | Event currency, temporary artifacts |
| **Special Rewards** | One-time claims | Level-up rewards, achievement rewards |

---

## 2. Sorting Methods

Six sorting methods allow players to organize their inventory according to their preference.

### 2.1 Sorting Methods

| Sort Method | Description | Primary Field | Secondary Field |
|-------------|-------------|---------------|----------------|
| **By Rarity** | Highest rarity first | `rarity` (desc) | `name` |
| **By Era** | Chronological order | `era` (asc) | `rarity` |
| **By Power** | Strongest first | `power` (desc) | `level` |
| **By Level** | Most leveled first | `level` (desc) | `rarity` |
| **By Newest** | Recently acquired | `created_at` (desc) | — |
| **By Oldest** | First acquired | `created_at` (asc) | — |

### 2.2 Rarity Sort Order

```
MYTHIC (6) → LEGENDARY (5) → EPIC (4) → RARE (3) → UNCOMMON (2) → COMMON (1)
```

### 2.3 Era Sort Order

```
PREHISTORIC → ANCIENT EGYPT → ANCIENT GREECE → ROMAN EMPIRE → VIKINGS
→ MEDIEVAL EUROPE → RENAISSANCE → INDUSTRIAL AGE → WORLD WARS → MODERN ERA
```

### 2.4 Sort UI

```
┌─────────────────────────────────────────┐
│  INVENTORY           [🔍 Search]       │
├─────────────────────────────────────────┤
│  [All] [Artifacts] [Museum] [More ▼]   │
├─────────────────────────────────────────┤
│                                         │
│  Sort: [By Rarity ▼]  Filter: [⚙️]    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Showing 67/82 artifacts           ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ ⭐⭐⭐│ │ ⭐⭐⭐│ │ ⭐⭐ │ │ ⭐⭐ │      │
│  │ Ankh │ │Scarab│ │Spear│ │Mask │      │
│  │ Lv.5 │ │ Lv.3 │ │ Lv.8│ │ Lv.2│      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. Filters

Filters narrow the visible inventory without removing items. All filters support multi-select unless noted.

### 3.1 Filter Types

| Filter | Type | Options | Behavior |
|--------|------|---------|----------|
| **Era** | Multi-select | 10 eras | Shows artifacts from selected eras |
| **Civilization** | Multi-select | 14 civilizations | Shows artifacts from selected civilizations |
| **Category** | Multi-select | 8 categories | Shows artifacts of selected types |
| **Rarity** | Multi-select | 6 rarities | Shows artifacts of selected rarities |
| **Level Range** | Slider | Level 1-100 | Shows artifacts within level range |

### 3.2 Filter Options Detail

**Era Filter Options:**
```
Prehistoric, Ancient Egypt, Ancient Greece, Roman Empire, Vikings,
Medieval Europe, Renaissance, Industrial Age, World Wars, Modern Era
```

**Civilization Filter Options:**
```
Egypt, Greece, Rome, Vikings, Japan, Aztecs, Ukraine, Mesopotamia,
Persia, China, Mongol Empire, Europe, Americas, General
```

**Category Filter Options:**
```
Weapons, Documents, Jewelry, Ancient Tools, Relics,
Military Objects, Royal Objects, Scientific Artifacts
```

**Rarity Filter Options:**
```
Common (Gray), Uncommon (Green), Rare (Blue),
Epic (Purple), Legendary (Gold), Mythic (Rainbow)
```

### 3.3 Level Range Filter

```
Level Range: [====|====] 1 — 100

Behavior:
├── Dual-handle slider
├── Tap to set exact values
├── Drag handles to adjust range
├── Shows count of items in range
└── "Any Level" quick option resets filter
```

### 3.4 Filter Persistence

```
Filter State:
├── Active filters saved per session
├── Restored on returning to inventory
├── "Clear All Filters" button
├── Individual filter removal
└── Active filter count badge
```

---

## 4. Search

### 4.1 Search Behavior

| Aspect | Specification |
|--------|---------------|
| **Input** | Single-line text, always visible at top |
| **Matching** | Case-insensitive, partial match |
| **Fields searched** | Artifact name (primary), description (secondary) |
| **Debounce** | 300ms before executing |
| **Results** | Real-time as user types |

### 4.2 Search UI

```
┌─────────────────────────────────────────┐
│  🔍 Search artifacts...          [✕]   │
├─────────────────────────────────────────┤
│  Results for "sphinx": 3 found         │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │Sphinx│ │Sphinx│ │Sphinx│              │
│  │Statue│ │Tile │ │Amulet│              │
│  └─────┘ └─────┘ └─────┘              │
└─────────────────────────────────────────┘
```

---

## 5. Favorites System

### 5.1 Favorites Features

| Feature | Specification |
|---------|---------------|
| **Mark/Unmark** | Double-tap card or tap star icon |
| **Visual indicator** | Filled gold star on card |
| **Dedicated view** | Favorites tab shows only starred items |
| **Limit** | Maximum 20 favorites |
| **Reorder** | Drag to reorder (display order only) |
| **Persistence** | Saved across sessions |

### 5.2 Favorites UI

```
┌─────────────────────────────────────────┐
│  ⭐ FAVORITES (5/20)                   │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ Ankh│ │Scarab│ │Gladi│              │
│  │  ⭐ │ │  ⭐ │ │  ⭐ │              │
│  │Egypt│ │Egypt │ │Rome │              │
│  └─────┘ └─────┘ └─────┘              │
│                                         │
│  Drag to reorder your favorites.         │
└─────────────────────────────────────────┘
```

---

## 6. Equipped Artifacts

### 6.1 Equipped Status

| Feature | Specification |
|---------|---------------|
| **Badge** | "EQUIPPED" label on card |
| **Filter** | Dedicated "Equipped" toggle |
| **Count** | Shows X/Y equipped slots |
| **Loadout** | Up to 5 artifacts equipped |

### 6.2 Equipped UI

```
┌─────────────────────────────────────────┐
│  EQUIPPED (3/5 slots)                 │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐             │
│  │ Ankh│ │Spear│ │Gladi│             │
│  │ [E] │ │ [E] │ │ [E] │             │
│  └─────┘ └─────┘ └─────┘             │
│                                         │
│  [E] = Equipped  Tap to unequip        │
└─────────────────────────────────────────┘
```

---

## 7. Quick Actions

### 7.1 Action List

| Action | Trigger | Result |
|--------|---------|--------|
| **View Details** | Single tap on card | Opens artifact detail modal |
| **Favorite/Unfavorite** | Double-tap OR star icon | Toggles favorite status |
| **Share** | Share icon in detail modal | Generates shareable card image |
| **View in Museum** | Museum icon in detail modal | Navigates to museum entry |
| **Equip/Unequip** | Equip icon in detail modal | Toggles equipped status |

### 7.2 Detail Modal Contents

```
┌─────────────────────────────────────────┐
│  ←            ARTIFACT DETAIL          │
├─────────────────────────────────────────┤
│                                         │
│         [ARTIFACT IMAGE]                │
│         ⭐⭐⭐ LEGENDARY                 │
│                                         │
│  Ankh of Eternity                       │
│  Ancient Egypt • Relics                 │
│                                         │
│  Level 15  │  Power 24  │  XP 1,250    │
│  ████████░░░░░░ 1250/2000              │
│                                         │
│  "Symbol of eternal life in             │
│   ancient Egypt."                       │
│                                         │
│  ─────────────────────────────────────  │
│  Historical Context:                    │
│  The ankh appeared in tomb paintings    │
│  alongside deities...                    │
│  ─────────────────────────────────────  │
│                                         │
│  [⭐ Favorite] [📤 Share] [🏛️ Museum] │
│                                         │
│  [    Equip    ]                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Duplicate Management

### 8.1 Duplicate Handling

| Aspect | Behavior |
|--------|----------|
| **Acquisition** | When obtaining an owned artifact, count increases |
| **Badge** | Shows "x2", "x3", etc. on card |
| **Conversion** | Duplicates auto-convert to fragments |
| **Notification** | Conversion notification on acquire |

### 8.2 Fragment Yields

| Rarity | Fragments per Duplicate |
|--------|------------------------|
| Common | 1-2 |
| Uncommon | 3-5 |
| Rare | 6-10 |
| Epic | 15-25 |
| Legendary | 40-60 |
| Mythic | 100-150 |

### 8.3 Duplicate Display

```
┌─────────────┐
│ ┌─────┐    │
│ │Ankh │ x3 │  ← Duplicate badge
│ └─────┘    │
└─────────────┘

Tap badge to view duplicate history.
```

---

## 9. Inventory Capacity

### 9.1 Capacity Rules

| Parameter | Value |
|-----------|-------|
| **Initial Capacity** | 100 slots |
| **Maximum Capacity** | 1,000 slots |
| **Artifact Size** | 1 slot per artifact |
| **Expansion Units** | +50 slots per expansion |

### 9.2 Expansion Methods

| Method | Slots Gained | Availability |
|--------|--------------|--------------|
| **Gameplay Rewards** | +50 | Achieved through milestones |
| **Premium Subscription** | +100/month | Paid tier |
| **Achievement Unlocks** | +25, +50, +100 | Specific achievements |
| **One-Time Purchases** | +50, +100, +200 | In-game shop |

### 9.3 Capacity UI

```
┌─────────────────────────────────────────┐
│  INVENTORY CAPACITY                    │
├─────────────────────────────────────────┤
│  ████████████░░░░░░░░░░  67/100      │
│                                         │
│  Storage: 67/100 (67%)                 │
│  [Upgrade Storage]                      │
│                                         │
│  Upgrade Options:                      │
│  • +50 Slots — 200 Coins               │
│  • +100 Slots — 350 Coins              │
│  • Subscribe Premium — +100/month      │
└─────────────────────────────────────────┘
```

---

## Part II: Collection System

The Collection System tracks player progress toward completing all available artifacts, displaying completion across multiple dimensions.

---

## 10. Collection Overview

### 10.1 What Players See

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COLLECTION TRACKING                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TOTAL COLLECTION COMPLETION                                                │
│  ├── Total artifacts discovered: 67/82 (82%)                                │
│  ├── Missing artifacts: 15                                                   │
│  └── Visual progress bar with percentage                                    │
│                                                                              │
│  ERA COMPLETION                                                              │
│  ├── Ancient Egypt: 10/12 (83%)                                             │
│  ├── Ancient Greece: 8/10 (80%)                                             │
│  ├── Roman Empire: 7/10 (70%)                                               │
│  ├── Vikings: 5/8 (63%)                                                     │
│  ├── Medieval Europe: 12/12 (100%) ✓                                        │
│  ├── Renaissance: 8/8 (100%) ✓                                              │
│  ├── Industrial Age: 5/6 (83%)                                              │
│  ├── World Wars: 6/6 (100%) ✓                                               │
│  └── Modern Era: 6/10 (60%)                                                 │
│                                                                              │
│  RARITY COMPLETION                                                           │
│  ├── Common: 30/30 (100%) ✓                                                │
│  ├── Uncommon: 25/25 (100%) ✓                                                │
│  ├── Rare: 18/20 (90%)                                                      │
│  ├── Epic: 8/10 (80%)                                                       │
│  ├── Legendary: 2/5 (40%)                                                   │
│  └── Mythic: 0/1 (0%)                                                       │
│                                                                              │
│  CATEGORY COMPLETION                                                         │
│  ├── Weapons: 8/10 (80%)                                                     │
│  ├── Documents: 12/15 (80%)                                                 │
│  ├── Jewelry: 7/8 (88%)                                                      │
│  ├── Ancient Tools: 6/6 (100%) ✓                                             │
│  ├── Relics: 10/12 (83%)                                                    │
│  ├── Military Objects: 9/10 (90%)                                            │
│  ├── Royal Objects: 8/8 (100%) ✓                                             │
│  └── Scientific Artifacts: 7/8 (88%)                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Collection Dimensions

| Dimension | Description | Granularity |
|-----------|-------------|-------------|
| **Total** | Overall completion | Percentage |
| **Era** | Per historical era | Percentage + count |
| **Rarity** | Per rarity tier | Percentage + count |
| **Category** | Per artifact category | Percentage + count |
| **Set** | Per artifact set | Count + bonus preview |

---

## 11. Collection Progress Display

### 11.1 Main Collection View

```
┌─────────────────────────────────────────┐
│  🏛️ MY COLLECTION                      │
├─────────────────────────────────────────┤
│                                         │
│  Overall: 67/82 Artifacts (82%)         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░ 82%   │
│                                         │
│  [Eras] [Rarities] [Categories] [Sets]  │
│                                         │
│  ERA PROGRESS                           │
│  ┌─────────────────────────────────────┐│
│  │ Ancient Egypt         10/12   83%  ││
│  │ ████████████████████░░░░ 83%     ││
│  │                                      ││
│  │ Ancient Greece        8/10    80%  ││
│  │ ███████████████████░░░░░ 80%     ││
│  │                                      ││
│  │ Medieval Europe       12/12   100%  ││
│  │ ████████████████████ 100% ✓      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ "Complete Medieval Europe to         ││
│  │  unlock Golden Frame!"              ││
│  │                                      ││
│  │ Reward Preview:                     ││
│  │ 🏅 Medieval Master Badge            ││
│  │ 🖼️ Golden Era Frame                 ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### 11.2 Missing Artifacts View

```
┌─────────────────────────────────────────┐
│  MISSING ARTIFACTS (15)                 │
├─────────────────────────────────────────┤
│                                         │
│  Filters: [Era ▼] [Rarity ▼]          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ⭐⭐⭐ LEGENDARY — 3 missing         ││
│  │ • Pharaoh's Death Mask (Egypt)    ││
│  │ • Caesar's Crown (Rome)            ││
│  │ • Viking King's Helm (Vikings)     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ⭐⭐⭐⭐ EPIC — 2 missing            ││
│  │ • Roman Senate Document (Rome)     ││
│  │ • Viking Longship (Vikings)        ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## 12. Collection Rewards

### 12.1 Milestone Rewards

Completing collection milestones rewards players with meaningful bonuses:

| Milestone | Requirement | Reward | Type |
|-----------|-------------|--------|------|
| **25% Collection** | 20/82 artifacts | 200 Chrono Dust, Bronze Badge | Cosmetic + Currency |
| **50% Collection** | 41/82 artifacts | 500 Chrono Dust, Silver Frame, Bronze Collector Title | Cosmetic + Currency |
| **75% Collection** | 62/82 artifacts | 1,000 Chrono Dust, Gold Frame, "Collector" Title | Cosmetic + Currency |
| **100% Collection** | 82/82 artifacts | 5,000 Chrono Dust, Chrono Aura, "Master of Time" Title, Mythic Artifact | Ultimate |

### 12.2 Era Completion Rewards

| Era | Requirement | Badge | Frame | Title | Dust |
|-----|-------------|-------|-------|-------|------|
| Ancient Egypt | 12/12 | ✓ | — | "Egyptologist" | 100 |
| Ancient Greece | 10/10 | ✓ | — | "Hellenist" | 100 |
| Roman Empire | 10/10 | ✓ | ✓ | "Roman Scholar" | 150 |
| Vikings | 8/8 | ✓ | ✓ | "Northman" | 150 |
| Medieval Europe | 12/12 | ✓ | ✓ | "Medieval Scholar" | 200 |
| Renaissance | 8/8 | ✓ | ✓ | "Renaissance Man" | 200 |
| Industrial Age | 6/6 | ✓ | ✓ | "Industrial Pioneer" | 250 |
| World Wars | 6/6 | ✓ | ✓ | "Modern Historian" | 250 |
| Modern Era | 10/10 | ✓ | ✓ | "Contemporary Expert" | 300 |

### 12.3 Rarity Completion Rewards

| Rarity | Requirement | Reward |
|---------|-------------|--------|
| All Common | 30/30 | 100 Dust, "Common Collector" Badge |
| All Uncommon | 25/25 | 200 Dust, "Uncommon Hunter" Badge |
| All Rare | 20/20 | 500 Dust, "Rare Seeker" Badge, Blue Frame |
| All Epic | 10/10 | 1,000 Dust, "Epic Chaser" Badge, Purple Frame |
| All Legendary | 5/5 | 2,500 Dust, "Legendary Finder" Badge, Gold Frame, "Legendary" Title |
| All Mythic | 1/1 | 10,000 Dust, "Mythic Collector" Badge, Prismatic Aura, "Mythic" Title |

### 12.4 Category Completion Rewards

| Category | Requirement | Reward |
|----------|-------------|--------|
| All Weapons | 10/10 | 150 Dust, Weapon-themed frame |
| All Documents | 15/15 | 150 Dust, Document-themed frame |
| All Jewelry | 8/8 | 150 Dust, Jewelry-themed frame |
| All Ancient Tools | 6/6 | 100 Dust, Tool-themed frame |
| All Relics | 12/12 | 200 Dust, Relic-themed frame |
| All Military Objects | 10/10 | 150 Dust, Military-themed frame |
| All Royal Objects | 8/8 | 200 Dust, Royal-themed frame |
| All Scientific Artifacts | 8/8 | 200 Dust, Science-themed frame |

---

## Part III: Museum System

The Museum System designates special artifacts as permanent museum pieces, providing prestige and cosmetic rewards.

---

## 13. Museum Artifacts

### 13.1 Museum Artifact Definition

Museum artifacts are a special designation applied to selected artifacts. They differ from regular inventory artifacts in several key ways:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MUSEUM ARTIFACT RULES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CANNOT BE SOLD                                                             │
│  • Museum artifacts are permanently retained                                  │
│  • No selling option exists for museum pieces                                │
│  • Protects rare/valuable artifacts from accidental loss                    │
│                                                                              │
│  BECOME PERMANENT                                                            │
│  • Once designated as museum, cannot be converted to fragments              │
│  • First artifact of each rarity auto-promoted to museum                     │
│  • Player can manually promote additional artifacts                           │
│                                                                              │
│  INCREASE PRESTIGE SCORE                                                     │
│  • Each museum artifact contributes to prestige calculation                  │
│  • Rarity-weighted contribution                                              │
│  • Displayed on player profile                                               │
│                                                                              │
│  UNLOCK COSMETIC REWARDS                                                     │
│  • Museum completeness triggers exclusive cosmetics                          │
│  • Era-specific museum frames                                                │
│  • Prestige-based profile customizations                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Museum Designation

| Method | Description |
|--------|-------------|
| **Auto-promotion** | First artifact of each rarity is automatically museum |
| **Manual promotion** | Player promotes additional artifacts (within limit) |
| **Limit** | Maximum museum artifacts = 20 + (era_completions × 5) |

### 13.3 Museum Capacity

```
MUSEUM CAPACITY:
Base: 20 artifacts
Per Era Completed: +5 artifacts

Example:
├── Base: 20
├── 5 Eras Complete: +25
├── Total Capacity: 45 museum artifacts
└── Player owns 82 artifacts → Can designate 45 as museum
```

---

## 14. Museum Display

### 14.1 Museum Sections

| Section | Description |
|---------|-------------|
| **Hall of Ages** | Artifacts organized by era |
| **Rarity Gallery** | Artifacts sorted by rarity tier |
| **Category Hall** | Artifacts grouped by type |
| **Favorite Artifacts** | Player's starred museum pieces |
| **Recently Added** | Latest museum acquisitions |

### 14.2 Museum View

```
┌─────────────────────────────────────────┐
│  🏛️ MUSEUM                    45/45   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🏆 Museum Score: 12,450            ││
│  │ Prestige Level: 8                   ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Hall of Ages] [Gallery] [Categories] │
│                                         │
│  HALL OF AGES — Ancient Egypt           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━ 10/12        │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │Ankh │ │Scarab│ │Mask │ │Statue│     │
│  │ ⭐  │ │ ⭐  │ │ 🔒  │ │ 🔒  │     │
│  └─────┘ └─────┘ └─────┘ └─────┘     │
│                                         │
│  ⭐ = Museum Artifact  🔒 = Not Owned   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Part IV: Prestige System

The Prestige System rewards long-term dedication and collection mastery.

---

## 15. Prestige Overview

### 15.1 Prestige Calculation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRESTIGE SCORE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PRESTIGE SOURCES:                                                          │
│  ├── Museum Collections: +100 per era complete                               │
│  ├── Completed Eras: +50 per era fully collected                             │
│  ├── Mythic Artifacts: +500 per mythic owned                                │
│  ├── Legendary Artifacts: +100 per legendary owned                           │
│  ├── Epic Artifacts: +25 per epic owned                                     │
│  ├── Full Rarity Sets: +200 per completed rarity set                        │
│  ├── Collection Milestones: +50 at 25%, +100 at 50%, +250 at 75%, +1000 at  │
│  │                            100%                                           │
│  └── Achievements: +10-500 per achievement (varies)                         │
│                                                                              │
│  PRESTIGE FORMULA:                                                          │
│  Prestige = (MuseumScore × 1.0) + (EraBonus × 2.0) +                       │
│             (ArtifactScore × 0.5) + (AchievementScore × 0.3)               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 15.2 Prestige Levels

| Level | Score Required | Title | Reward |
|-------|----------------|-------|--------|
| 1 | 0 | Novice Collector | — |
| 2 | 1,000 | Apprentice Collector | Bronze Border |
| 3 | 2,500 | Journeyman Collector | +10 Inventory Slots |
| 4 | 5,000 | Expert Collector | Silver Border |
| 5 | 10,000 | Master Collector | +25 Inventory Slots |
| 6 | 20,000 | Grand Collector | Gold Border |
| 7 | 35,000 | Legendary Collector | +50 Inventory Slots |
| 8 | 50,000 | Temporal Historian | Platinum Border |
| 9 | 75,000 | Scholar of Ages | +100 Inventory Slots |
| 10 | 100,000 | Master of Time | Prismatic Border, Chrono Aura |

### 15.3 Prestige Benefits

```
PRESTIGE BENEFITS:

Level 2 — Bronze Border
└── Profile frame with bronze accent

Level 3 — +10 Inventory Slots
└── Permanent inventory expansion

Level 4 — Silver Border
└── Profile frame with silver accent

Level 5 — +25 Inventory Slots
└── Permanent inventory expansion

Level 6 — Gold Border
└── Profile frame with gold accent

Level 7 — +50 Inventory Slots
└── Permanent inventory expansion

Level 8 — Platinum Border
└── Profile frame with platinum accent

Level 9 — +100 Inventory Slots
└── Permanent inventory expansion

Level 10 — Prismatic Border + Chrono Aura
└── Rainbow border + animated temporal aura
```

---

## 16. Prestige Sources Detail

### 16.1 Museum Collections

| Source | Points |
|--------|--------|
| Each era with 50%+ collected | +25 |
| Each era with 100% collected | +100 |
| Museum capacity reached | +50 |

### 16.2 Completed Eras

| Era | Completion Bonus |
|-----|------------------|
| Ancient Egypt | +50 |
| Ancient Greece | +50 |
| Roman Empire | +50 |
| Vikings | +50 |
| Medieval Europe | +50 |
| Renaissance | +50 |
| Industrial Age | +50 |
| World Wars | +50 |
| Modern Era | +50 |
| **All 9 Eras** | +500 (cumulative bonus) |

### 16.3 Mythic Artifacts

| Source | Points |
|--------|--------|
| Each Mythic artifact owned | +500 |
| All Mythic artifacts collected | +2,000 (bonus) |

### 16.4 Achievement Points

```
ACHIEVEMENT PRESTIGE CONTRIBUTION:

Collection Achievements: +10-100 per achievement
Battle Achievements: +5-50 per achievement
Social Achievements: +5-50 per achievement
Special Achievements: +100-500 per achievement
```

---

## 17. Collection and Prestige UI

### 17.1 Profile Integration

```
┌─────────────────────────────────────────┐
│  👤 PlayerName                         │
│  Level 42 — Temporal Scholar            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🏆 PRESTIGE LEVEL 5                ││
│  │ ████████████████░░░░░░░ 20,450    ││
│  │ Next: 25,000 (Master Collector)    ││
│  └─────────────────────────────────────┘│
│                                         │
│  Collection: 67/82 (82%)               │
│  Museum: 25/45 artifacts                │
│  Sets Complete: 18/24                   │
│  Mythic Found: 0/1                      │
│                                         │
│  [View Collection] [View Museum]        │
│                                         │
└─────────────────────────────────────────┘
```

---

## Part V: Summary

---

## 18. System Summary

### 18.1 Inventory Summary

| Feature | Specification |
|---------|---------------|
| **Sorting** | 6 methods: Rarity, Era, Power, Level, Newest, Oldest |
| **Filters** | Era, Civilization, Category, Rarity, Level Range |
| **Search** | Real-time, partial match, case-insensitive |
| **Favorites** | 20 max, star/unstar, dedicated view |
| **Equipped** | 5 slots max, equipped badge, filter view |
| **Quick Actions** | View, Favorite, Share, Museum, Equip |
| **Duplicates** | Auto-convert to fragments |
| **Capacity** | 100 base, 1000 max, expandable |

### 18.2 Collection Summary

| Dimension | Tracking |
|-----------|----------|
| **Total** | Percentage + count |
| **Era** | 9 eras tracked |
| **Rarity** | 6 rarity tiers tracked |
| **Category** | 8 categories tracked |
| **Set** | Multiple sets per era |

### 18.3 Rewards Summary

| Milestone | Reward |
|-----------|--------|
| 25% Collection | 200 Dust, Bronze Badge |
| 50% Collection | 500 Dust, Silver Frame, Bronze Collector Title |
| 75% Collection | 1,000 Dust, Gold Frame, "Collector" Title |
| 100% Collection | 5,000 Dust, Chrono Aura, "Master of Time" Title, Mythic Artifact |
| Era Complete | Badge + Frame + Title + Dust (varies) |
| Rarity Complete | Badge + Frame + Title + Dust (varies) |

### 18.4 Museum Summary

| Rule | Value |
|------|-------|
| **Cannot Sell** | Museum artifacts are permanently retained |
| **Become Permanent** | Cannot convert to fragments |
| **Increase Prestige** | Each museum artifact contributes to prestige |
| **Unlock Cosmetics** | Era-specific frames and badges |
| **Capacity** | 20 base + 5 per era completed |

### 18.5 Prestige Summary

| Source | Points |
|--------|--------|
| Museum Collections | +25-100 per era |
| Completed Eras | +50 per era |
| Mythic Artifacts | +500 per mythic |
| Legendary Artifacts | +100 per legendary |
| Epic Artifacts | +25 per epic |
| Achievements | +5-500 per achievement |

---

## 19. Related Systems

| System | Integration |
|--------|-------------|
| **Artifact System** | Source of all inventory items |
| **Rewards System** | Collection milestones trigger rewards |
| **Achievement System** | Contributes to prestige |
| **Social System** | Profile shows collection and prestige |
| **Shop System** | Inventory expansion available for purchase |

---

*Every artifact stored, every collection completed, every museum piece displayed—each step in the journey builds toward mastery of time.*