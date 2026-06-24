# Jolt Time — World Map and Era Navigation System

## Overview

The World Map is Jolt Time's central navigation hub, representing humanity's timeline as an explorable journey through history. It serves as one of the game's primary identity features, making players feel like genuine time travelers embarking on an educational adventure. Players gradually unlock new eras as they progress, creating a sense of discovery and forward momentum. The map transforms progression into exploration, transforming the abstract concept of "leveling up" into the tangible excitement of "traveling to new times."

---

## 1. World Map Philosophy

### Core Vision

The World Map is not merely a menu or selection screen — it is the embodiment of Jolt Time's identity as a time-traveling educational experience. When players view their map, they should feel the weight of millennia beneath them and the excitement of countless civilizations waiting to be discovered. The map tells the story of human progress, from the banks of the Nile to the stars of the space age.

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Journey Metaphor** | The map shows a timeline from past to future, with eras as destinations along a chronological path |
| **Progressive Revelation** | Locked eras appear mysterious and intriguing, beckoning players to continue their journey |
| **Historical Authenticity** | Each era is rendered with period-appropriate visuals, colors, and cultural elements |
| **Educational Context** | The map provides historical context for each era, teaching players about the times they're exploring |
| **Emotional Connection** | Completing eras feels like closing a chapter in humanity's story |

### Map Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  🌍 WORLD MAP — JOURNEY THROUGH TIME                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ← PAST                                            FUTURE →     │
│                                                                 │
│  ════════════════════════════════════════════════════════════  │
│  │                                                       │     │
│  │  [🏛️]══════[🏛️]══════[🏛️]══════[🏛️]══════[🏛️]═══►   │     │
│  │    ▲          ▲          ▲          ▲          ▲     │     │
│  │    │          │          │          │          │     │     │
│  │  EGYPT     GREECE      ROME      VIKING    MEDIEVAL  │     │
│  │  ● ● ●     ○ ○ ○      ○ ○ ○      ○ ○ ○      ○ ○ ○  │     │
│  │  ────      ────       ────       ────       ────    │     │
│  │  ✓ 80%    Lv 10      Lv 25      Lv 35      Lv 40   │     │
│  │                                                       │     │
│  │  [🏛️]══════[🏛️]══════[🏛️]══════[🔒]══════[🔒]═══►   │     │
│  │    ▲          ▲          ▲          ▲          ▲     │     │
│  │    │          │          │          │          │     │     │
│  │  RENAISSANCE  INDUSTRIAL MODERN   FUTURE   BEYOND   │     │
│  │   ○ ○ ○      ○ ○ ○      ○ ○ ○      ???      ???    │     │
│  │   ────       ────       ────       ────     ────  │     │
│  │   Lv 45      Lv 50      Lv 55      ???      ???   │     │
│  │                                                       │     │
│  ════════════════════════════════════════════════════════════  │
│                                                                 │
│  Current Era: Ancient Egypt (80% complete)                       │
│  Next Unlock: Ancient Greece at Level 10                        │
│  Total Progress: 12% of known timeline explored                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Timeline Representation

The map displays a horizontal timeline flowing left to right, representing humanity's chronological journey:

| Direction | Meaning | Visual Treatment |
|-----------|---------|-----------------|
| Left side | Distant past | Sepia tones, ancient aesthetics |
| Center | Recent history | Vibrant, detailed rendering |
| Right side | Present/future | Modern/futuristic styling |
| Far right | Unknown | Glowing, mysterious appearance |

---

## 2. Main Historical Eras

Jolt Time spans eight major historical eras, each with unique atmosphere, visual identity, and artifact themes. New eras can be added easily without disrupting the existing structure.

### Era Overview

| Era | Time Period | Unlocked | Artifacts | Primary Colors |
|-----|-------------|----------|-----------|----------------|
| Ancient Egypt | 3100-30 BCE | Level 1 | 10 | Gold, Lapis Blue, Sand |
| Ancient Greece | 800-31 BCE | Level 10 | 10 | Marble White, Olive, Bronze |
| Roman Empire | 27 BCE-476 CE | Level 25 | 10 | Crimson, Bronze, Gold |
| Viking Age | 793-1066 CE | Level 35 | 8 | Steel Silver, Deep Blue, Wood |
| Medieval Europe | 476-1453 CE | Level 40 | 10 | Gray Stone, Forest Green, Red |
| Renaissance | 1400-1700 CE | Level 45 | 8 | Gold, Purple, Burgundy |
| Industrial Revolution | 1760-1914 CE | Level 50 | 5 | Industrial Gray, Brass, Steel |
| Modern Era | 1914-1991 CE | Level 55 | 6 | Olive, Red, Blue |
| Future Era | N/A | Level 60 | 3 | Chrono Cyan, Temporal Purple |

### Era Introduction Moments

Each era unlock is accompanied by a special introduction:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⭐ NEW ERA UNLOCKED ⭐                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│           🏛️ WELCOME TO ANCIENT GREECE ⭐                        │
│           "The Age of Reason"                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TheOracle of Delphi awaits your visit.                         │
│  Discover the birthplace of democracy, philosophy,               │
│  and the Olympic Games.                                         │
│                                                                 │
│  🏺 10 New Artifacts to Discover                                │
│  📜 3 Museum Exhibits to Uncover                               │
│  ⚔️ 20 Expeditions to Complete                                  │
│  🏆 5 Achievements to Earn                                     │
│                                                                 │
│  [EXPLORE NOW]  [VIEW ERA PREVIEW]  [CONTINUE JOURNEY]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Future Era Expansion

New eras can be added to the timeline without system changes:

| Addition Type | Method |
|--------------|--------|
| Insert between eras | Add to unlock sequence, adjust level requirements |
| Branch timelines | Fork system for alternate history content |
| Sub-eras | Add regional variants within existing eras |
| Event eras | Temporary eras for special historical events |

---

## 3. Era Structure

Each era contains comprehensive content across multiple systems, creating a complete historical experience.

### Era Content Matrix

| Content Type | Description | Examples |
|--------------|-------------|----------|
| **Expeditions** | Time-travel missions to era locations | Tomb raids, temple discoveries, market visits |
| **Artifact Collections** | Gatherable items from the era | Monument fragments, tools, treasures |
| **Museum Sets** | Displayable collections with educational text | Pharaoh's Regalia, Olympic Champion Set |
| **Story Chapters** | Narrative content set in the era | Historical dramatizations, character journeys |
| **Special Events** | Limited-time content themed to era | Pharaoh's Festival, Olympic Games |
| **Regional Nodes** | Specific locations within the era | Alexandria, Giza, Valley of the Kings |

### Era-Specific Systems

Each era includes:

```
┌─────────────────────────────────────────────────────────────────┐
│  ANCIENT EGYPT — CONTENT STRUCTURE                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  EXPEDITIONS                                                     │
│  • Pyramid of Djoser — 15 min, artifacts: Stone blocks          │
│  • Valley of the Kings — 1 hour, artifacts: Tomb treasures      │
│  • Temple of Karnak — 4 hours, artifacts: Sacred relics        │
│  • Nile Trading Post — 8 hours, artifacts: Trade goods         │
│  • Alexandria Library — 12 hours, artifacts: Scrolls          │
│                                                                 │
│  ARTIFACT COLLECTIONS                                           │
│  • Royal Burial Set (5 items) — Death Mask, Canopic Jars...   │
│  • Divine Symbols Set (5 items) — Ankh, Scarab, Eye of Horus..│
│  • Monument Builders Set (4 items) — Pyramid Stone, Obelisk... │
│  • Scribe's Tools Set (3 items) — Papyrus, Quill, Ink          │
│                                                                 │
│  MUSEUM EXHIBITS                                                │
│  • "Building the Pyramids" — Construction techniques           │
│  • "Journey to the Afterlife" — Burial practices               │
│  • "Life on the Nile" — Daily Egyptian life                    │
│                                                                 │
│  STORY CHAPTERS                                                 │
│  • Chapter 1: "The First Pharaoh"                              │
│  • Chapter 2: "The Pyramid Builder"                            │
│  • Chapter 3: "The Last Queen"                                 │
│                                                                 │
│  SPECIAL EVENTS                                                 │
│  • Pharaoh's Festival — Double artifact drops                   │
│  • Nile Flood Season — Seasonal bonus rewards                  │
│  • Festival of the Dead — Halloween Egypt theme                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cross-Era Connections

Some content bridges multiple eras:

| Connection Type | Description | Example |
|----------------|-------------|---------|
| Trade Routes | Artifacts that traveled between civilizations | Silk Road items in multiple eras |
| Cultural Exchange | Greek influence on Roman artifacts | Roman copy of Greek sculpture |
| Temporal Anomalies | Strange artifacts from timeline disruptions | Future items appearing in past |

---

## 4. Era Progression Rules

Era progression follows a clear, rewarding path that players can understand and anticipate.

### Unlock Requirements

| Era | Player Level | Total Artifacts | Collection Progress |
|-----|--------------|-----------------|---------------------|
| Ancient Egypt | 1 | — | Complete Tutorial |
| Ancient Greece | 10 | 10 | Egypt Collection 30% |
| Roman Empire | 25 | 10 | Greece Collection 30% |
| Viking Age | 35 | 8 | Rome Collection 30% |
| Medieval Europe | 40 | 8 | Viking Collection 30% |
| Renaissance | 45 | 5 | Medieval Collection 30% |
| Industrial Revolution | 50 | 5 | Renaissance Collection 30% |
| Modern Era | 55 | 3 | Industrial Collection 50% |
| Future Era | 60 | 3 | Modern Collection 50% |

### Progression Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Clear Milestones** | Players always know what they need to unlock the next era |
| **Gradual Revelation** | Each era feels like opening a new chapter |
| **Reward Exploration** | Engaging with current era content unlocks the next |
| **Multiple Paths** | Collection progress OR level can drive progression |
| **No Dead Ends** | If stuck, alternative progression paths are available |

### Recommended Player Levels

| Era | Casual Player | Regular Player | Dedicated Player |
|-----|--------------|----------------|------------------|
| Ancient Egypt | Week 1 | Day 1-3 | Day 1 |
| Ancient Greece | Week 3 | Week 1 | Days 3-5 |
| Roman Empire | Month 2 | Week 4 | Week 2 |
| Viking Age | Month 4 | Month 2 | Month 1 |
| Medieval Europe | Month 6 | Month 3 | Month 2 |
| Renaissance | Month 8 | Month 4 | Month 3 |
| Industrial Revolution | Month 10 | Month 6 | Month 4 |
| Modern Era | Month 12 | Month 8 | Month 6 |

### Backward Compatibility

New eras can be added without breaking existing progression:

- New unlock level requirements can be inserted
- Existing players keep their current progress
- New eras always go at the end of the timeline
- Sub-eras can branch without affecting main progression

---

## 5. Region Nodes

Each era contains specific region nodes — historical locations players can explore within that era.

### Ancient Egypt Regions

| Region | Description | Activities | Unlock |
|--------|-------------|------------|--------|
| **Giza Plateau** | Home of the Great Pyramids | Pyramid expeditions, monument exploration | Default |
| **Alexandria** | Center of learning and trade | Library expeditions, market visits | Level 5 |
| **Valley of the Kings** | Royal burial ground | Tomb raids, secret passage discovery | Level 8 |
| **Thebes** | Religious capital | Temple expeditions, sacred artifact collection | Level 12 |
| **Nile Delta** | Fertile river region | Trading post visits, daily life artifacts | Level 15 |

### Roman Empire Regions

| Region | Description | Activities | Unlock |
|--------|-------------|------------|--------|
| **Rome** | The Eternal City | Colosseum battles, Senate intrigue | Default |
| **Pompeii** | City frozen in time | Volcanic ash exploration, preservation study | Level 28 |
| **Britannia** | Northern frontier | Fort expeditions, Celtic artifact collection | Level 32 |
| **Alexandria** | Eastern province | Trade route expeditions, cultural exchange | Level 36 |
| **Constantinople** | Eastern capital | Imperial court expeditions, Byzantine treasures | Level 40 |

### Ancient Greece Regions

| Region | Description | Activities | Unlock |
|--------|-------------|------------|--------|
| **Athens** | Birthplace of democracy | Philosophical expeditions, agora visits | Default |
| **Olympia** | Site of the Olympic Games | Athletic competitions, laurel wreath rewards | Level 12 |
| **Delphi** | Oracle sanctuary | Prophecy expeditions, sacred object collection | Level 14 |
| **Sparta** | Military city-state | Training ground expeditions, hoplite equipment | Level 16 |
| **Delos** | Sacred island | Temple expeditions, mythological artifacts | Level 18 |

### Region Node Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ ANCIENT EGYPT — GIZA PLATEAU                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  "Where eternity was carved in stone."                          │
│                                                                 │
│  ════════════════════════════════════════════════════════════  │
│  AVAILABLE EXPEDITIONS                                           │
│  ════════════════════════════════════════════════════════════  │
│                                                                 │
│  🏔️ Great Pyramid Expedition                                    │
│     Duration: 1 hour | Energy: 30 | Difficulty: Easy           │
│     Rewards: Pyramid Stone, Limestone Fragment                  │
│     [██████████░░░░] 80% Discovery                             │
│                                                                 │
│  🏔️ Sphinx Guardian Expedition                                 │
│     Duration: 4 hours | Energy: 50 | Difficulty: Medium        │
│     Rewards: Granite Block, Ceremonial Artifacts                │
│     [██████░░░░░░░░] 45% Discovery                           │
│     🔓 Unlocks at Level 3                                       │
│                                                                 │
│  🏔️ Tomb of Khufu Expedition                                   │
│     Duration: 8 hours | Energy: 80 | Difficulty: Hard         │
│     Rewards: Death Mask Fragment, Treasure Chest               │
│     [██░░░░░░░░░░░░] 15% Discovery                            │
│     🔒 Unlocks at Level 10                                     │
│                                                                 │
│  ════════════════════════════════════════════════════════════  │
│  COLLECTIBLE ARTIFACTS (3/10 found)                            │
│  ════════════════════════════════════════════════════════════  │
│                                                                 │
│  ✓ Pyramid Stone (Common) — Found                               │
│  ✓ Limestone Fragment (Common) — Found                          │
│  ✓ Granite Block (Uncommon) — Found                            │
│  ○ Obsidian Scarab (Rare) — Not found                          │
│  ○ Pharaoh's Seal (Epic) — Not found                          │
│                                                                 │
│  [EXPEDITION MAP]  [COLLECTIBLES]  [REGION INFO]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Region Unlock Mechanics

| Unlock Method | Description |
|--------------|-------------|
| **Level-based** | Reach specific player level |
| **Collection-based** | Complete X artifacts in current era |
| **Mission-based** | Complete specific story missions |
| **Expedition-based** | Complete X expeditions in region |
| **Time-based** | Wait for region to become available |

---

## 6. Era Completion System

Players can achieve different levels of completion within each era, with mastery rewards remaining mostly cosmetic.

### Completion Tiers

| Tier | Requirements | Reward Category | % of Players |
|------|-------------|-----------------|--------------|
| **Partial** | 30% collection | Participation Badge | 60% |
| **Standard** | 60% collection | Region Frame | 35% |
| **Full** | 100% collection | Era Aura | 15% |
| **Mastery** | 100% + all expeditions | Master Title + Badge | 5% |

### Completion Rewards

| Era | Partial Reward | Standard Reward | Full Reward | Mastery Reward |
|-----|---------------|-----------------|-------------|----------------|
| Ancient Egypt | Sand Walker Badge | Egypt Frame | Nile Aura | "Guardian of the Nile" Title |
| Ancient Greece | Agora Badge | Greece Frame | Olive Aura | "Hellenic Scholar" Title |
| Roman Empire | Legion Badge | Rome Frame | Imperial Aura | "Roman Commander" Title |
| Viking Age | Voyage Badge | Viking Frame | Nordic Aura | "North Sea Legend" Title |
| Medieval | Castle Badge | Medieval Frame | Castle Aura | "Medieval Knight" Title |
| Renaissance | Gallery Badge | Renaissance Frame | Artisan Aura | "Renaissance Master" Title |
| Industrial | Factory Badge | Industrial Frame | Steam Aura | "Industrial Pioneer" Title |
| Modern | Space Badge | Modern Frame | Lunar Aura | "Modern Visionary" Title |

### Era Completion Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ ANCIENT EGYPT — COMPLETION STATUS                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  COLLECTION PROGRESS                                             │
│  ─────────────────────────────────────────────────────────────  │
│  ████████████████████░░░░░░░░░░  18/30 artifacts (60%)         │
│                                                                 │
│  ════════════════════════════════════════════════════════════  │
│  COMPLETION TIERS                                                │
│  ════════════════════════════════════════════════════════════  │
│                                                                 │
│  ✓ PARTIAL (30%) — "Sand Walker" Badge — ACHIEVED              │
│  ✓ STANDARD (60%) — Egypt Frame — ACHIEVED                     │
│  → FULL (100%) — Nile Aura — 18 more artifacts                 │
│  ○ MASTERY — "Guardian of the Nile" Title — All + expeditions  │
│                                                                 │
│  ════════════════════════════════════════════════════════════  │
│  REMAINING ARTIFACTS                                            │
│  ════════════════════════════════════════════════════════════  │
│                                                                 │
│  🏺 Pharaoh's Death Mask (Epic) — Sphinx Guardian Expedition   │
│  🏺 Sacred Scarab (Rare) — Tomb of Khufu Expedition           │
│  🏺 Royal Cartouche (Rare) — Valley of the Kings Expedition   │
│  ... 8 more artifacts                                           │
│                                                                 │
│  EXPEDITION PROGRESS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  5/20 Expeditions Completed (25%)                              │
│                                                                 │
│  [VIEW ALL EXPEDITIONS]  [START NEW EXPEDITION]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mastery System Details

Mastery requires exceeding standard completion:

| Requirement | Description |
|-------------|-------------|
| 100% Collection | Find all artifacts in the era |
| All Region Nodes | Unlock and visit every region |
| All Expeditions | Complete at least one of each expedition type |
| All Story Chapters | Complete all narrative content |
| Mastery Challenge | Complete a special era-end challenge |

### Cosmetic Nature of Rewards

All era completion rewards are cosmetic:
- Badges for profile display
- Frames for profile decoration
- Auras for visual effects
- Titles for player recognition
- No gameplay advantages such as energy boosts, damage increases, or resource multipliers

---

## 7. Era Statistics

Comprehensive tracking of player exploration across all eras.

### Player Era Statistics

| Stat | Description | Display |
|------|-------------|---------|
| Eras Unlocked | Number of eras accessible | Profile stats |
| Eras Completed | Eras at 100% collection | Profile stats |
| Eras Mastered | Eras with all achievements | Profile badge |
| Total Artifacts | All artifacts collected | Profile stats |
| Favorite Era | Most-played era | Profile highlight |
| Total Regions | Regions visited | Progress tracker |
| Exploration Progress | Overall % of game explored | Main screen |

### Exploration Progress Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 EXPLORATION STATISTICS                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  OVERALL PROGRESS                                               │
│  ████████░░░░░░░░░░░░░░░░░░░░  12% of timeline explored       │
│                                                                 │
│  ERA BREAKDOWN                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Ancient Egypt     ████████████████░░░  80% (Mastered ✓)       │
│  Ancient Greece    ██████████░░░░░░░░░  45%                     │
│  Roman Empire      ███░░░░░░░░░░░░░░░░  15%                     │
│  Viking Age         ░░░░░░░░░░░░░░░░░░░   0% (Locked)          │
│  Medieval Europe   ░░░░░░░░░░░░░░░░░░░   0% (Locked)          │
│  Renaissance       ░░░░░░░░░░░░░░░░░░░   0% (Locked)          │
│  Industrial        ░░░░░░░░░░░░░░░░░░░   0% (Locked)          │
│  Modern Era        ░░░░░░░░░░░░░░░░░░░   0% (Locked)          │
│                                                                 │
│  COLLECTION TOTALS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  Artifacts Collected: 43 / 90 total (48%)                      │
│  Museum Entries: 12 / 30 total (40%)                          │
│  Expeditions Completed: 28 / 100 total (28%)                  │
│  Regions Visited: 4 / 20 total (20%)                          │
│                                                                 │
│  ACHIEVEMENTS                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Era-Specific Achievements: 5 / 40 earned                      │
│  Collection Completions: 2 / 8 era sets                        │
│  Mastery Titles: 1 / 8 earned                                  │
│                                                                 │
│  FAVORITE ERA: Ancient Egypt (60+ hours played)               │
│                                                                 │
│  [VIEW DETAILED STATS]  [ERA LEADERBOARDS]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Era Leaderboards

| Leaderboard Type | Metric | Rewards |
|-----------------|--------|--------|
| Era Completion | % of era completed | Top 100 displayed |
| Artifact Collection | Artifacts found per era | Weekly rewards |
| Expedition Master | Total expeditions completed | Monthly rewards |
| Region Explorer | Regions visited | Badge for milestones |

### Global Era Statistics

| Metric | Description |
|--------|-------------|
| Most Explored Era | Era with highest average player progress |
| Hardest Era | Lowest completion rate |
| Fastest Progression | Quickest time to first era mastery |
| Community Exploration | Total hours spent per era globally |

---

## 8. Educational Philosophy

Every era serves an educational purpose, teaching players about history while encouraging curiosity and presenting civilizations respectfully.

### Educational Goals

| Goal | Implementation |
|------|---------------|
| **Teach History** | Museum entries, expedition briefings, artifact descriptions provide factual historical information |
| **Encourage Curiosity** | Era introductions spark interest; "Learn More" links to external resources |
| **Respectful Presentation** | All civilizations depicted with dignity; no stereotypes or caricatures |
| **Context Over Condensation** | Complexity acknowledged; historical nuances explained |
| **Multiple Perspectives** | Where appropriate, different viewpoints within eras are acknowledged |

### Era Educational Elements

```
┌─────────────────────────────────────────────────────────────────┐
│  📜 MUSEUM ENTRY: THE GREAT PYRAMID OF GIZA                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  "A Wonder of the Ancient World"                                │
│                                                                 │
│  HISTORICAL CONTEXT                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Built during the reign of Pharaoh Khufu around 2560 BCE,      │
│  the Great Pyramid remained the tallest man-made structure      │
│  for over 3,800 years. It was constructed using an estimated   │
│  2.3 million limestone blocks, each weighing 2.5 to 15 tons.    │
│                                                                 │
│  CONSTRUCTION METHODS                                           │
│  The exact methods remain debated, but evidence suggests a     │
│  combination of ramp systems, copper tools, and organized      │
│  labor. Recent discoveries indicate worker villages nearby      │
│  housed the tens of thousands of workers involved.             │
│                                                                 │
│  CULTURAL SIGNIFICANCE                                          │
│  The pyramids served as tombs for pharaohs, designed to        │
│  protect the ruler's body and possessions for the afterlife.  │
│  This reflects ancient Egyptian beliefs about death and         │
│  the journey to the eternal realm.                             │
│                                                                 │
│  MODERN SCHOLARSHIP                                             │
│  Recent thermal scanning has revealed unknown internal          │
│  chambers. The precision of the pyramid's construction—         │
│  aligned to true north within 3/60th of a degree—continues     │
│  to inspire wonder and study.                                   │
│                                                                 │
│  LEARN MORE →                                                   │
│                                                                 │
│  [- COLLECT FRAGMENT -]                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Content Guidelines

| Guideline | Application |
|-----------|-------------|
| **Historical Accuracy** | All facts verified; sources cited in museum entries |
| **Cultural Sensitivity** | Consult cultural advisors for respectful representation |
| **Age Appropriateness** | Content suitable for all ages; complex topics introduced carefully |
| **Positive Framing** | Focus on achievements and innovations; acknowledge hardships without dwelling |
| **Encourage Learning** | "Learn More" links, suggested reading, educational partnerships |

### Civilizations Treated With Respect

| Era | Respectful Approach |
|-----|---------------------|
| Ancient Egypt | Not "mysterious" or "exotic" — acknowledged as sophisticated civilization |
| Ancient Greece | Not just warriors — philosophers, artists, democratic innovations highlighted |
| Roman Empire | Not just conquerors — engineering, law, culture contributions emphasized |
| Viking Age | Not just raiders — traders, explorers, skilled craftspeople shown |
| Medieval Europe | Not just castles — agricultural innovations, universities, trade networks |
| Renaissance | Not just artists — scientific method, exploration, humanism celebrated |
| Industrial Era | Not just machines — social reform, labor movements, progress costs acknowledged |
| Modern Era | Balanced view of progress and challenges; multiple perspectives included |

---

## 9. Telegram Bot Notifications

Strategic notifications for era exploration without becoming spam.

### Notification Types

| Notification | Trigger | Timing | Message |
|--------------|---------|--------|---------|
| Era Unlocked | New era becomes available | Once | "🏛️ Ancient Greece is now unlocked! Journey to the Age of Reason." |
| Region Available | New region opens | Once | "🗺️ New region in Egypt: Valley of the Kings awaits exploration." |
| Era Completed | 100% collection reached | Once | "⭐ Congratulations! You've mastered Ancient Egypt!" |
| Region Discovered | All expeditions in region complete | Once | "🗺️ Giza Plateau fully explored! You know this land well." |
| Milestone Progress | 25/50/75% of era complete | Per milestone | "📊 Egypt at 50%! You're halfway through this era." |
| Weekly Exploration | Summary of week's progress | Weekly (optional) | "📅 This week: Explored 3 new regions, collected 12 artifacts." |

### Notification Frequency Rules

| Notification Type | Maximum Frequency |
|-------------------|------------------|
| Era Unlocked | 1 per era |
| Region Available | 1 per region |
| Era Completed | 1 per era |
| Region Discovered | 1 per region |
| Milestone Progress | 3 per era |
| Weekly Summary | 1 per week (optional) |

### Total Exploration Notification Cap

All notifications respect the **4 notifications per day** hard cap, with exploration notifications sharing priority with other game systems.

### Exploration Notification Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ NEW ERA UNLOCKED: ANCIENT GREECE                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  "The Age of Reason — Where philosophy met mythology."          │
│                                                                 │
│  The Oracle of Delphi awaits your visit.                        │
│  Discover the birthplace of democracy, philosophy,              │
│  and the Olympic Games.                                         │
│                                                                 │
│  Requirements Met:                                              │
│  ✓ Player Level 10                                              │
│  ✓ 10 Egyptian artifacts collected                              │
│  ✓ Egypt collection 30%+ complete                               │
│                                                                 │
│  What's New:                                                    │
│  • 10 Greek artifacts to discover                              │
│  • 5 regions to explore                                        │
│  • 20 expeditions available                                    │
│  • 3 museum exhibits to uncover                                │
│                                                                 │
│  [EXPLORE NOW]  [VIEW ERA PREVIEW]  [MAYBE LATER]             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  /settings to manage notifications                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. AdsGram Integration

AdsGram provides optional engagement opportunities during exploration activities.

### Exploration AdsGram Rewards

| Activity | Bonus Available | Daily Limit | Purpose |
|----------|----------------|-------------|---------|
| Expedition Energy | +30 energy | 3 per day | Extra expedition attempts |
| Discovery Boost | +20% rare artifact chance | 1 per day | Better rewards |
| Expedition Speed | -10 minutes on any expedition | 1 per day | Faster completion |
| Region Reveal | Reveal 1 locked region | 1 per day | Catch-up help |

### Exploration Boost Philosophy

- **Never Required:** Complete all exploration without watching ads
- **Genuine Convenience:** Ads make exploration easier, not possible
- **Player Choice:** Clear dismiss option, no pressure
- **Fair Limits:** Daily caps prevent excessive advantage
- **Transparency:** Clear display of what ads provide

### Exploration Ad Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ EXPEDITION BOOST AVAILABLE                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Watch a short video to earn:                                   │
│  • +30 Expedition Energy                                        │
│  • +20% Rare Artifact Chance                                    │
│                                                                 │
│  Today: 0/1 boost earned                                        │
│                                                                 │
│  [WATCH VIDEO]                          [MAYBE LATER]            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Ads are optional and never required for exploration.           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Future Expansion Notes

Future features are documented for planning but are NOT part of current implementation.

### Interactive World Map

**Concept:** A fully interactive map where players can pan, zoom, and tap on locations for information.

**Status:** Future feature

**Requirements:**
- Advanced map rendering system
- Touch gesture controls
- Location detail popups
- Performance optimization for mobile

**Potential Features:**
- Animated terrain
- Weather effects per era
- Day/night cycles
- Season changes

### Animated Era Transitions

**Concept:** Cinematic transitions when moving between eras.

**Status:** Future feature

**Requirements:**
- Animation pipeline
- Era-specific transition styles
- Performance management
- Skippable options

**Potential Features:**
- Time tunnel effect
- Historical montage
- Artifact showcase
- Educational snippets

### Hidden Regions

**Concept:** Secret locations within eras that require special conditions to discover.

**Status:** Future feature

**Requirements:**
- Discovery system
- Clue mechanism
- Hidden content database
- Reward balancing

**Potential Features:**
- Map anomalies to investigate
- Puzzle-based discoveries
- Cross-era secrets
- Mythical locations

### Mythical Timelines

**Concept:** Alternate history or mythical content branches.

**Status:** Future consideration

**Requirements:**
- Branching narrative system
- Alternate reality content
- Clear labeling of fiction vs history
- Additional development resources

**Potential Content:**
- "What if" historical scenarios
- Mythological exploration
- Fictional timeline branches
- Crossover events

### Community Exploration Events

**Concept:** Global community goals for exploration milestones.

**Status:** Future feature

**Requirements:**
- Global tracking infrastructure
- Community goal system
- Collective reward distribution
- Event orchestration

**Potential Features:**
- "All players explore X regions"
- Group expedition challenges
- Community discovery milestones
- Shared exploration achievements

---

*Every era is a window into human history. The World Map transforms progression into a journey through time.*
