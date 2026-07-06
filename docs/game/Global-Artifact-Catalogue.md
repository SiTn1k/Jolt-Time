# ⚡ JOLT TIME
## The Global Artifact Catalogue Architecture

**Document Classification:** Content Architecture Foundation  
**Version:** 1.0  
**Status:** Official Reference  
**Date:** 2025  

---

> *"A hundred museums. A hundred civilizations. Ten thousand stories. One catalogue."*

---

# Table of Contents

1. [Catalogue Philosophy](#1-catalogue-philosophy)
2. [Hierarchy](#2-hierarchy)
3. [Primary Classification](#3-primary-classification)
4. [Civilisation Structure](#4-civilisation-structure)
5. [Historical Eras](#5-historical-eras)
6. [Museum Types](#6-museum-types)
7. [Collection Types](#7-collection-types)
8. [Artifact Families](#8-artifact-families)
9. [Naming Rules](#9-naming-rules)
10. [Unique Identifier Rules](#10-unique-identifier-rules)
11. [Expansion Rules](#11-expansion-rules)
12. [Educational Structure](#12-educational-structure)
13. [Future Scalability](#13-future-scalability)
14. [Content Pipeline](#14-content-pipeline)
15. [Things We NEVER Do](#15-things-we-never-do)
16. [The Catalogue Promise](#16-the-catalogue-promise)

---

# 1. Catalogue Philosophy

**The Global Artifact Catalogue is the single source of truth for all artifacts in Jolt Time.**

---

## 1.1 Scale Forever Design

The catalogue is designed to scale to unlimited artifacts without ever requiring restructuring.

**Principles of Eternal Scalability:**

- **Hierarchical Depth** — The hierarchy supports unlimited levels of granularity. New levels can be added at any point without breaking existing relationships.
- **Distributed Classification** — Artifacts have multiple valid paths through the hierarchy. A Roman gladius can be found through Weapons, through Roman Empire, through Military, or through Daily Life (for soldiers).
- **Lazy Evaluation** — The catalogue does not pre-compute all possible relationships. New connections emerge organically as artifacts are added.
- **Backward Compatibility** — Every addition preserves all existing structures. Nothing is ever deprecated, only extended.

---

## 1.2 Adding New Civilizations

New civilizations are added through a controlled extension process:

**Step 1: Civilization Definition**  
Define the civilization's era boundaries, geographical region, and cultural classification.

**Step 2: Era Assignment**  
Assign the civilization to one or more historical eras.

**Step 3: Museum Alignment**  
Identify which museum types would contain artifacts from this civilization.

**Step 4: Collection Population**  
Populate the civilization's collections with artifacts using the standard taxonomy.

**Step 5: Cross-Reference**  
Link artifacts to related civilizations for discovery connections.

**No civilization ever requires removing or restructuring existing content.**

---

## 1.3 Adding New Museums

New museums are added through museum type templates:

**Step 1: Type Classification**  
Assign the museum to a museum type from the master list.

**Step 2: Collection Assignment**  
Define which collection types this museum can contain.

**Step 3: Civilization Scope**  
Define which civilizations' artifacts this museum can display.

**Step 4: Era Requirements**  
Define minimum era coverage for museum completion.

**Step 5: Cross-Museum Links**  
Connect to related museums for thematic journeys.

**No museum ever requires modifying existing museum structures.**

---

## 1.4 The Catalogue as Living System

The catalogue is not a static list — it is a living system that grows intelligently:

- **Organic Growth** — Artifacts are added based on player discovery patterns and educational value.
- **Quality Gates** — Every artifact passes through research, verification, and review before inclusion.
- **Intelligent Linking** — New artifacts automatically connect to related artifacts, civilizations, and museums.
- **Continuous Verification** — Historical accuracy is continuously validated against emerging scholarship.

---

# 2. Hierarchy

**The complete organizational hierarchy from World to Variation.**

---

## 2.1 Hierarchy Overview

```
World
    ↓
Civilisation
    ↓
Era
    ↓
Museum
    ↓
Collection
    ↓
Artifact Group
    ↓
Artifact
    ↓
Variation
```

---

## 2.2 Level Definitions

### World

The totality of human history. The root of all organization.

- **Definition:** All documented human history across all civilizations and all time.
- **Purpose:** Provides the top-level container for the entire catalogue.
- **Count:** Always exactly 1.

### Civilisation

A distinct human society with shared culture, language, and historical identity.

- **Definition:** A civilization as defined by historians — a complex society with shared characteristics.
- **Purpose:** Primary artifact classification by cultural origin.
- **Examples:** Ancient Egypt, Roman Empire, Ming Dynasty, British Empire.

### Era

A defined period within a civilization's history or across multiple civilizations.

- **Definition:** A time-bounded period with distinct historical characteristics.
- **Purpose:** Temporal classification of artifacts within civilizations.
- **Examples:** Old Kingdom, Pax Romana, Renaissance, Industrial Revolution.

### Museum

An institution that displays artifacts from specific civilizations and eras.

- **Definition:** A thematic or specialized collection institution.
- **Purpose:** Player-facing organizational unit for artifact display.
- **Examples:** British Museum, Smithsonian Air and Space, Louvre.

### Collection

A curated group of artifacts within a museum, unified by theme or type.

- **Definition:** A thematic artifact grouping within a museum.
- **Purpose:** Curated subsets for player discovery and completion.
- **Examples:** Royal Collection, Greek Pottery, Medieval Weapons.

### Artifact Group

A category of related artifacts within a collection.

- **Definition:** A grouping of similar artifacts (e.g., "Roman Swords").
- **Purpose:** Organizational unit for taxonomy within collections.
- **Examples:** Gladius, Spatha, Pilum, Scutum.

### Artifact

A specific historical object with documented existence.

- **Definition:** A unique historical object with verified existence.
- **Purpose:** The fundamental collectible unit.
- **Examples:** Pompeii Gladius, Sutton Hoo Helmet, Tutankhamun's Dagger.

### Variation

A specific instance or version of an artifact.

- **Definition:** A particular specimen, location, or state of an artifact.
- **Purpose:** Distinguishes between multiple known examples.
- **Examples:** Bronze version, Silver version, Louvre specimen, British Museum specimen.

---

## 2.3 Hierarchy Navigation Rules

**Downward Navigation (Drill-Down):**
- World → Civilisation → Era → Museum → Collection → Artifact Group → Artifact → Variation
- Each level contains only items from the level above.

**Upward Navigation (Roll-Up):**
- Variation → Artifact → Artifact Group → Collection → Museum → Era → Civilisation → World
- Each level aggregates items from the level below.

**Cross-Level Navigation:**
- Artifacts can be accessed from multiple paths (e.g., Roman Gladius via Weapons OR via Roman Empire).
- Cross-level links create thematic discovery journeys.

---

# 3. Primary Classification

**How every artifact is classified across seven dimensions.**

---

## 3.1 Classification Dimensions

Every artifact is classified along seven independent dimensions:

| Dimension | Description | Examples |
|-----------|-------------|----------|
| **Civilisation** | Cultural origin | Ancient Egypt, Roman Empire, Ming Dynasty |
| **Historical Era** | Time period | Bronze Age, Classical Antiquity, Renaissance |
| **Museum** | Display institution | British Museum, Metropolitan Museum of Art |
| **Theme** | Curatorial theme | Power, Religion, Science, Daily Life |
| **Material** | Physical composition | Gold, Bronze, Clay, Papyrus, Iron |
| **Function** | Practical use | Weapon, Tool, Decorative, Ceremonial |
| **Importance** | Historical significance | World-Defining, Major, Notable, Minor |

---

## 3.2 Classification Rules

**Civilisation Classification:**
- Every artifact has exactly one primary civilisation.
- Artifacts may have secondary civilisation classifications (trade goods, influences).
- Disputed origin artifacts are marked with primary theory and alternatives.

**Era Classification:**
- Every artifact has one primary era.
- Cross-era artifacts (tradition pieces) have primary era of creation.
- Artifacts spanning multiple eras have era range.

**Museum Classification:**
- Every artifact can be displayed in multiple museum types.
- Museum assignments are based on thematic relevance.
- At least one museum assignment required for catalogued artifacts.

**Theme Classification:**
- Every artifact has one primary theme.
- Up to three secondary themes allowed.
- Themes are broad categories (not specific).

**Material Classification:**
- Every artifact has one primary material.
- Composite artifacts list all constituent materials.
- Material affects preservation, display, and value.

**Function Classification:**
- Every artifact has one primary function.
- Multi-function artifacts have primary function only.
- Function is based on original intended use.

**Importance Classification:**
- Importance is assigned by historical significance review.
- Importance affects rarity, display priority, and collection requirements.
- Importance is never changed after initial assignment.

---

# 4. Civilisation Structure

**The master list of all civilizations in the Jolt Time catalogue.**

---

## 4.1 Civilization Master List

### Ancient Civilizations (Pre-Classical)

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **Ancient Egypt** | North Africa | 3100 BCE – 30 BCE |
| **Mesopotamia** | Middle East | 3500 BCE – 539 BCE |
| **Indus Valley** | South Asia | 3300 BCE – 1300 BCE |
| **Ancient China** | East Asia | 2100 BCE – 221 BCE |
| **Minoan** | Greece | 2700 BCE – 1450 BCE |
| **Mycenaean** | Greece | 1600 BCE – 1100 BCE |

### Classical Civilizations

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **Ancient Greece** | Greece | 800 BCE – 31 BCE |
| **Persia** | Middle East | 550 BCE – 651 CE |
| **Roman Empire** | Mediterranean | 27 BCE – 476 CE |
| **Carthage** | North Africa | 814 BCE – 146 BCE |
| **Han Dynasty** | China | 206 BCE – 220 CE |
| **Kushan Empire** | Central Asia | 30 CE – 375 CE |

### Post-Classical Civilizations

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **Byzantine Empire** | Eastern Mediterranean | 330 CE – 1453 CE |
| **Gupta Empire** | India | 320 CE – 550 CE |
| **Sassanid Persia** | Middle East | 224 CE – 651 CE |
| **Kingdom of Ghana** | West Africa | 300 CE – 1200 CE |
| **Tang Dynasty** | China | 618 CE – 907 CE |
| **Viking Age** | Northern Europe | 793 CE – 1066 CE |

### Medieval Civilizations

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **Holy Roman Empire** | Central Europe | 962 CE – 1806 CE |
| **Kievan Rus** | Eastern Europe | 882 CE – 1478 CE |
| **Mongol Empire** | Asia | 1206 CE – 1368 CE |
| **Mali Empire** | West Africa | 1235 CE – 1600 CE |
| **Kingdom of France** | Western Europe | 843 CE – 1792 CE |
| **Kingdom of England** | British Isles | 927 CE – 1707 CE |

### Early Modern Civilizations

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **Renaissance Italy** | Italy | 1300 CE – 1600 CE |
| **Ottoman Empire** | Middle East/Eastern Europe | 1299 CE – 1922 CE |
| **Safavid Persia** | Middle East | 1501 CE – 1736 CE |
| **Mughal Empire** | South Asia | 1526 CE – 1857 CE |
| **Spanish Empire** | Americas/Europe | 1492 CE – 1898 CE |
| **Portuguese Empire** | Global | 1415 CE – 1999 CE |

### Imperial & Colonial Civilizations

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **British Empire** | Global | 1583 CE – 1997 CE |
| **Russian Empire** | Eurasia | 1721 CE – 1917 CE |
| **French Empire** | Global | 1804 CE – 1960 CE |
| **Qing Dynasty** | China | 1644 CE – 1912 CE |
| **Japanese Empire** | East Asia/Pacific | 1868 CE – 1947 CE |
| **Austro-Hungarian Empire** | Central Europe | 1867 CE – 1918 CE |

### Modern Civilizations

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **United States** | North America | 1776 CE – Present |
| **Soviet Union** | Eurasia | 1922 CE – 1991 CE |
| **Cold War Era** | Global | 1947 CE – 1991 CE |
| **Space Age** | Global | 1957 CE – Present |
| **Digital Age** | Global | 1970 CE – Present |
| **Information Age** | Global | 1990 CE – Present |

---

## 4.2 Future Expansion Civilizations

Planned civilizations for future catalogue expansion:

| Civilisation | Region | Era Range |
|--------------|--------|-----------|
| **Ancient Sumer** | Mesopotamia | 4500 BCE – 2004 BCE |
| **Aksumite Empire** | East Africa | 100 CE – 940 CE |
| **Kingdom of Zimbabwe** | Southern Africa | 1220 CE – 1500 CE |
| **Khmer Empire** | Southeast Asia | 802 CE – 1431 CE |
| **Kingdom of Benin** | West Africa | 1180 CE – 1897 CE |
| **Chola Dynasty** | South Asia | 300 CE – 1279 CE |

---

## 4.3 Civilization Addition Protocol

Adding a new civilization requires:

1. **Historical Verification** — Academic consensus on civilization's existence and significance.
2. **Era Boundary Definition** — Clear start and end dates with historical justification.
3. **Geographic Scope** — Defined geographical region of influence.
4. **Artifact Potential** — Minimum 50 verifiable artifacts available for cataloguing.
5. **Cultural Distinctiveness** — Clear cultural characteristics that differentiate from existing civilizations.

---

# 5. Historical Eras

**The master timeline of all historical periods in the Jolt Time catalogue.**

---

## 5.1 Era Master List

| Era | Time Range | Description |
|-----|------------|-------------|
| **Prehistory** | Before 3500 BCE | Pre-literate human history, including Paleolithic, Mesolithic, Neolithic |
| **Bronze Age** | 3500 BCE – 1200 BCE | Early metalworking, first cities, earliest writing systems |
| **Iron Age** | 1200 BCE – 600 BCE | Widespread ironworking, emergence of classical civilizations |
| **Classical Antiquity** | 600 BCE – 500 CE | Height of ancient civilizations: Greece, Rome, Han China |
| **Late Antiquity** | 250 CE – 800 CE | Transition from ancient to medieval world |
| **Early Middle Ages** | 500 CE – 1000 CE | Formation of medieval kingdoms, spread of major religions |
| **High Middle Ages** | 1000 CE – 1300 CE | Peak of medieval civilization, crusades, Mongol expansion |
| **Late Middle Ages** | 1300 CE – 1500 CE | Crisis and transformation, plague, Renaissance emergence |
| **Age of Discovery** | 1400 CE – 1700 CE | European exploration, global trade, colonization |
| **Early Modern Period** | 1500 CE – 1800 CE | Rise of nation-states, scientific revolution, enlightenment |
| **Industrial Revolution** | 1760 CE – 1840 CE | Mechanization, factory system, urbanization |
| **Age of Empire** | 1800 CE – 1914 CE | European colonial expansion, global dominance |
| **Modern Era** | 1914 CE – 1945 CE | World wars, depression, technological revolution |
| **Cold War** | 1947 CE – 1991 CE | Nuclear age, space race, ideological competition |
| **Information Age** | 1970 CE – Present | Digital revolution, global communication, internet |
| **Space Age** | 1957 CE – Present | Human spaceflight, planetary exploration, satellite technology |

---

## 5.2 Era Characteristics

Each era is defined by:

**Temporal Boundaries**  
- Start date (inclusive)
- End date (inclusive)
- Overlap zones with adjacent eras

**Technological Markers**  
- Primary materials and techniques
- Communication and record-keeping
- Transportation and trade

**Social Characteristics**  
- Political organization
- Religious and philosophical movements
- Art and cultural expressions

**Historical Significance**  
- Major events and turning points
- Influence on subsequent eras
- Cross-civilizational connections

---

## 5.3 Era Classification Rules

- Every artifact has one primary era.
- Cross-era artifacts are classified by creation date.
- Artifacts spanning multiple eras include era range in metadata.
- Era boundaries are flexible for border cases at curator discretion.

---

# 6. Museum Types

**The master list of all museum types in the Jolt Time catalogue.**

---

## 6.1 Museum Type Master List

| Museum Type | Description | Typical Collections |
|-------------|-------------|---------------------|
| **National Museum** | State-sponsored institution preserving national heritage | National treasures, royal collections, military history |
| **Military Museum** | Dedicated to warfare history and weapons | Weapons, armor, uniforms, battle memorabilia |
| **Natural History Museum** | Nature and scientific specimen collections | Dinosaur fossils, geological specimens, natural phenomena |
| **Science Museum** | Technology and scientific discovery | Scientific instruments, inventions, space exploration |
| **Art Museum** | Fine and decorative arts collections | Paintings, sculptures, ceramics, textiles |
| **Technology Museum** | Human invention and engineering | Machines, computers, transportation, industry |
| **Maritime Museum** | Naval and seafaring history | Ships, navigation instruments, maritime artifacts |
| **Royal Museum** | Monarchy and aristocratic collections | Crown jewels, royal portraits, court artifacts |
| **Archaeological Museum** | Excavated artifacts and ancient history | Pottery, tools, jewelry, architectural elements |
| **Religious Museum** | Sacred and ecclesiastical artifacts | Relics, manuscripts, liturgical objects, shrine elements |
| **Cultural Museum** | Ethnic and cultural heritage | Traditional artifacts, folk art, cultural documentation |
| **History Museum** | General historical collections | Cross-period artifacts, historical documents, everyday objects |
| **Design Museum** | Artifacts of design and craft | Furniture, products, graphic design, architecture |
| **Children's Museum** | Interactive learning through artifacts | Hands-on historical reproductions, educational exhibits |
| **Living History Museum** | Reconstructed historical environments | Period rooms, living demonstrations, historical reenactments |

---

## 6.2 Museum Type Characteristics

Each museum type is defined by:

**Collection Scope**  
- Which collection types are primary
- Which civilizations are represented
- Which eras are emphasized

**Display Philosophy**  
- How artifacts are contextualized
- Narrative approach to curation
- Educational integration level

**Player Experience**  
- Visual presentation style
- Interaction patterns
- Discovery journey type

---

## 6.3 Museum Type Addition Rules

Adding a new museum type requires:

1. **Distinctive Purpose** — Clear differentiation from existing museum types.
2. **Collection Viability** — Minimum 30 artifacts across 5+ civilizations.
3. **Player Value** — Unique player experience not replicable by existing types.
4. **Thematic Coherence** — Logical grouping of artifacts under this category.

---

# 7. Collection Types

**The master list of all collection types in the Jolt Time catalogue.**

---

## 7.1 Collection Type Master List

### Personal Artifacts

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Jewelry Collection** | Personal adornments and precious objects | Rings, necklaces, bracelets, crowns, tiaras |
| **Personal Items** | Everyday objects owned by individuals | Combs, mirrors, cosmetics, toiletries |
| **Clothing & Textiles** | Garments and fabric crafts | Toga, kimono, sari, kilt, robes, tapestries |
| **Coins & Currency** | Money and precious metal objects | Coins, ingots, paper money, trade goods |

### Weapons & Warfare

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Swords** | Bladed weapons and their variants | Gladius, katana, longsword, scimitar |
| **Spears & Polearms** | Long weapons for thrusting | Pilum, yari, lance, halberd, pike |
| **Bows & Projectiles** | Ranged weapons | Longbow, composite bow, crossbow, arrows |
| **Shields** | Defensive weapons | Scutum, round shield, kite shield |
| **Armor** | Protective equipment | Cuirass, chainmail, plate armor, helmets |
| **Military Equipment** | Army support items | Standards, drums, trumpets, siege equipment |

### Knowledge & Communication

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Books & Codices** | Written knowledge collections | Religious texts, encyclopedias, literary works |
| **Scrolls & Documents** | Rolled documents and papers | Legal scrolls, letters, proclamations |
| **Maps & Charts** | Geographical and celestial representations | World maps, star charts, navigation maps |
| **Manuscripts** | Handwritten texts | Illuminated manuscripts, scientific notes |
| **Printing** | Printing technology and printed works | Printing presses, early printed books |

### Art & Aesthetics

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Paintings** | Visual artworks on surfaces | Portraits, landscapes, religious images |
| **Sculptures** | Three-dimensional artworks | Statues, busts, reliefs, figurines |
| **Pottery & Ceramics** | Clay vessels and objects | Amphora, vase, bowl, plate, tile |
| **Glassware** | Glass objects and vessels | Roman glass, stained glass, crystal |
| **Mosaics** | Assembled decorative art | Floor mosaics, wall mosaics, tesserae |

### Architecture & Construction

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Architectural Elements** | Building components | Columns, capitals, archways, tiles |
| **Furniture** | Household and ceremonial furniture | Thrones, beds, chairs, tables, chests |
| **Monuments** | Commemorative structures | Obelisks, stelae, triumphal arches |
| **Tools** | Construction and craft tools | Hammers, saws, chisels, plumb bobs |

### Science & Technology

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Scientific Instruments** | Research and measurement tools | Astrolabes, telescopes, microscopes, compasses |
| **Astronomy Equipment** | Celestial observation tools | Orrery, planetarium models, sundials |
| **Medical Equipment** | Healing and medical tools | Surgical instruments, apothecary items, prosthetics |
| **Navigation Instruments** | Wayfinding and travel tools | Sextants, astrolabes, maps, magnetic compasses |
| **Timekeeping** | Clocks and calendar systems | Water clocks, hourglasses, sundials, mechanical clocks |

### Music & Performance

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Musical Instruments** | Sound-producing devices | Lyres, drums, flutes, harpsichords, organs |
| **Musical Scores** | Written compositions | Sheet music, notation systems |
| **Performance Artifacts** | Theater and performance items | Masks, costumes, props, stage designs |

### Religion & Spirituality

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Religious Icons** | Sacred representations | Icons, mandalas, religious paintings |
| **Relics & Shrines** | Sacred remains and containers | Reliquaries, shrine elements, sacred objects |
| **Liturgical Objects** | Religious ceremonial items | Chalices, censers, patens, vestments |
| **Temple Elements** | Architectural sacred components | Altars, lecterns, baptismal fonts |

### Government & Power

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Crown Jewels** | Royal regalia and symbols | Crowns, scepters, orbs, mantles |
| **Seals & Stamps** | Authority authentication | Royal seals, official stamps, signet rings |
| **Thrones & Seats** | Authority and status seating | Thrones, curule chairs, judgment seats |
| **Legal Objects** | Law and justice items | Scales, execution devices, courtroom artifacts |

### Trade & Economy

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Trade Goods** | Commercial exchange items | Silk, spices, precious metals, exotic goods |
| **Weights & Measures** | Commerce standardization | Scale weights, measuring vessels, ruler standards |
| **Banking Items** | Financial instruments | Ledgers, strongboxes, coin scales |

### Daily Life

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Household Items** | Domestic objects | Pottery, utensils, storage vessels, furniture |
| **Food & Drink** | Culinary artifacts | Cooking vessels, serving dishes, drinking vessels |
| **Transportation** | Vehicles and travel | Chariots, carts, palanquins, sledges |
| **Gaming & Toys** | Entertainment objects | Board games, dolls, balls, puzzles |
| **Tools & Equipment** | Work and craft tools | Blacksmith tools, carpenter tools, farming tools |

### Nature & Environment

| Collection Type | Description | Examples |
|----------------|-------------|----------|
| **Fossils** | Preserved ancient life | Dinosaur bones, plant fossils, amber specimens |
| **Minerals & Gems** | Natural precious materials | Cut gems, mineral specimens, crystals |
| **Biological Specimens** | Preserved organic materials | Taxidermy, preserved plants, natural history |

---

## 7.2 Collection Type Addition Rules

Adding a new collection type requires:

1. **Distinctive Identity** — Clear differentiation from existing collection types.
2. **Artifact Availability** — Minimum 20 verifiable artifacts across 3+ civilizations.
3. **Museum Alignment** — At least 2 museum types would include this collection.
4. **Thematic Coherence** — Logical grouping principle that curators understand.

---

# 8. Artifact Families

**The taxonomic system for organizing related artifacts.**

---

## 8.1 Family Hierarchy

```
Family (e.g., Weapon)
    ↓
Category (e.g., Sword)
    ↓
Type (e.g., Roman Sword)
    ↓
Variant (e.g., Gladius)
    ↓
Specific Artifact (e.g., Pompeii Gladius)
    ↓
Specimen (e.g., National Archaeological Museum, Naples specimen)
```

---

## 8.2 Family Definitions

### Family: Weapon

**Description:** Tools designed for combat and warfare.

| Level | Example |
|-------|---------|
| Category | Sword |
| Type | Roman Sword |
| Variant | Gladius |
| Specific Artifact | Pompeii Gladius |
| Specimen | National Archaeological Museum Specimen |

### Family: Armor

**Description:** Protective equipment for body defense.

| Level | Example |
|-------|---------|
| Category | Body Armor |
| Type | Plate Armor |
| Variant | Breastplate |
| Specific Artifact | MILANESE Breastplate, 1475 |
| Specimen | Metropolitan Museum Specimen |

### Family: Jewelry

**Description:** Personal adornments and precious objects.

| Level | Example |
|-------|---------|
| Category | Ring |
| Type | Signet Ring |
| Variant | Pharaoh's Ring |
| Specific Artifact | Tutankhamun's Scarab Ring |
| Specimen | Egyptian Museum, Cairo Specimen |

### Family: Coin

**Description:** Currency and precious metal objects.

| Level | Example |
|-------|---------|
| Category | Coin |
| Type | Denarius |
| Variant | Trajan's Denarius |
| Specific Artifact | Trajan Market Denarius, 112 CE |
| Specimen | British Museum Specimen |

### Family: Instrument

**Description:** Tools for scientific, musical, or practical purposes.

| Level | Example |
|-------|---------|
| Category | Scientific Instrument |
| Type | Astrolabe |
| Variant | Planispheric Astrolabe |
| Specific Artifact | al-Zarqali's Astrolabe, 1060 |
| Specimen | Science Museum, London Specimen |

---

## 8.3 Cross-Family Relationships

Artifacts can belong to multiple families through different lenses:

**Example: Roman Helmet**
- Primary Family: Armor → Body Armor → Helmet → Galea → Montefortino Helmet
- Secondary Classification: Military → Roman → Imperial Era
- Functional Classification: Weapon (defensive) → Shield equivalent

**Example: Samurai Sword**
- Primary Family: Weapon → Sword → Longsword → Katana
- Secondary Classification: Ceremonial → Symbol of Honor
- Cultural Classification: Japanese → Edo Period

---

# 9. Naming Rules

**How every artifact is named across five naming conventions.**

---

## 9.1 Naming Dimensions

| Name Type | Purpose | Example |
|-----------|---------|---------|
| **Historical Name** | Name used during the artifact's time | Gladius Hispaniensis |
| **Original Name** | Name in the creator's language | Spatha |
| **Translated Name** | English translation of original name | Long Sword |
| **Museum Display Name** | Name used in museum context | Roman Infantry Sword (Gladius) |
| **Internal Name** | System identifier for development | ROMAN_SWORD_GLADIUS_POMPEII |

---

## 9.2 Naming Rules

### Historical Name

- **Rule:** Use the name contemporary sources called this artifact.
- **Format:** Original language with transliteration where needed.
- **Examples:**
  - Gladius (Latin)
  - Katana (Japanese)
  - Exaktēs (Greek)

### Original Name

- **Rule:** Use the name in the artifact's original language.
- **Format:** Original script (with transliteration if non-Latin alphabet).
- **Examples:**
  - 刀 (Dāo) for Chinese sword
  - 剣 (Ken) for Japanese sword
  - Gladius for Roman sword

### Translated Name

- **Rule:** Provide clear English translation that conveys meaning.
- **Format:** English descriptive name.
- **Examples:**
  - "Ceremonial Dagger" for Persian Khanjar
  - "Water Clock" for Greek Klepsydra
  - "Hourglass" for Sand Clock

### Museum Display Name

- **Rule:** Use name that museum visitors understand and find interesting.
- **Format:** Accessible name with optional original term in parentheses.
- **Examples:**
  - "Roman Sword (Gladius)"
  - "Bronze Age Gold Diadem"
  - "Ming Dynasty Porcelain Vase"

### Internal Name

- **Rule:** Use system-readable identifier following naming convention.
- **Format:** `CIVILIZATION_TYPE_SPECIFIC_SPECIMEN`
- **Examples:**
  - `EGYPT_WEAPON_TUTANKHAMUN_DAGGER_CAIRO`
  - `GREECE_POTTERY_ATHENIAN_OLIVE_JAR_ATHENS`
  - `JAPAN_ARMOR_OE_YOROI_TOKUGAWA_NATIONAL`

---

## 9.3 Naming Conventions

**Character Restrictions:**
- Internal names: uppercase letters, numbers, underscores only
- Display names: full Unicode support
- Historical names: original script with transliteration

**Length Limits:**
- Historical Name: 100 characters maximum
- Original Name: 100 characters maximum
- Translated Name: 100 characters maximum
- Museum Display Name: 150 characters maximum
- Internal Name: 64 characters maximum

**Uniqueness:**
- Every Internal Name must be globally unique.
- Museum Display Names can repeat across museums (different artifacts).
- Historical Names can repeat across civilizations (generic terms).

---

# 10. Unique Identifier Rules

**Every artifact has a permanent, future-proof, human-readable identifier.**

---

## 10.1 Identifier Structure

```
JT-{FAMILY}-{CIVILIZATION}-{ERA}-{SEQUENCE}

Example: JT-WPN-EGY-BRnz-0042
```

---

## 10.2 Identifier Components

| Component | Description | Format |
|-----------|-------------|--------|
| **JT Prefix** | Jolt Time identifier marker | Always "JT" |
| **Family** | Artifact family code | 3-letter code |
| **Civilization** | Civilization code | 3-letter code |
| **Era** | Historical era code | 4-character code |
| **Sequence** | Unique sequential number | 4-digit number |

---

## 10.3 Code Tables

### Family Codes

| Family | Code |
|--------|------|
| Weapon | WPN |
| Armor | ARM |
| Jewelry | JWL |
| Coin | COIN |
| Book | BOOK |
| Scroll | SCRL |
| Painting | PNTG |
| Sculpture | SCUL |
| Architecture | ARCH |
| Instrument | INST |
| Music | MUSC |
| Religion | RELG |
| Military | MIL |
| Daily Life | DAILY |
| Transportation | TRANS |
| Science | SCI |
| Trade | TRADE |

### Civilization Codes

| Civilisation | Code |
|--------------|------|
| Ancient Egypt | EGY |
| Mesopotamia | MES |
| Ancient Greece | GRC |
| Roman Empire | ROM |
| Persia | PERS |
| China | CHN |
| Japan | JPN |
| India | IND |
| Byzantine Empire | BYZ |
| Viking Age | VIK |
| Holy Roman Empire | HRE |
| Mongol Empire | MON |
| Ottoman Empire | OTT |
| British Empire | BRI |
| Renaissance Italy | ITA |
| United States | USA |
| Soviet Union | SOV |
| And more... | And more... |

### Era Codes

| Era | Code |
|-----|------|
| Prehistory | PRE |
| Bronze Age | BRnz |
| Iron Age | IRON |
| Classical Antiquity | CLAS |
| Late Antiquity | LANT |
| Early Middle Ages | EMA |
| High Middle Ages | HMA |
| Late Middle Ages | LMA |
| Age of Discovery | DIS |
| Early Modern | EMOD |
| Industrial Revolution | IND |
| Age of Empire | EMP |
| Modern Era | MOD |
| Cold War | CLD |
| Information Age | INFO |
| Space Age | SPC |

---

## 10.4 Identifier Rules

**Permanence:**
- Once assigned, an identifier is never changed.
- Artifacts are never deleted, only deprecated.
- Deprecated artifacts retain their identifiers.

**Future-Proofing:**
- Identifier format预留 expansion space.
- New families, civilizations, and eras can be added without format changes.
- Sequence space supports 9,999 artifacts per combination.

**Human-Readability:**
- Identifier components are meaningful abbreviations.
- Code tables are documented and publicly available.
- Identifier conveys artifact's origin and type at a glance.

**Uniqueness:**
- Every identifier is globally unique.
- Duplicate prevention enforced at database level.
- Identifier never reused for different artifacts.

---

# 11. Expansion Rules

**How civilizations, museums, collections, and artifacts are added without restructuring.**

---

## 11.1 Expansion Principles

**Never Break Existing Structures:**
- All additions are additive only.
- Existing relationships remain intact.
- No required updates to existing artifacts.

**Independent Scalability:**
- Each dimension (civilization, era, museum, collection) scales independently.
- No hard limits or ceiling on any dimension.
- Performance maintained at all scales.

**Backward Compatibility:**
- New additions integrate seamlessly with existing content.
- Existing players experience no disruption.
- Legacy content remains fully accessible.

---

## 11.2 Adding Civilizations

**Process:**

1. **Proposal** — Submit civilization for addition with:
   - Historical verification documentation
   - Era and geographic boundaries
   - Estimated artifact count (minimum 50)
   - Cultural distinctiveness justification

2. **Approval** — Design review board evaluates:
   - Academic legitimacy
   - Content availability
   - Player interest potential
   - Differentiation from existing civilizations

3. **Implementation** — Add to catalogue:
   - Assign civilization code
   - Define era alignments
   - Map to museum types
   - Create collection templates

4. **Population** — Populate artifacts:
   - Research phase (6-12 artifacts)
   - Verification phase
   - Initial cataloguing (minimum 50 artifacts)
   - Ongoing expansion

**Rules:**
- Existing civilizations are never modified.
- Era assignments for existing artifacts are never changed.
- Museum alignments are never removed.

---

## 11.3 Adding Museums

**Process:**

1. **Type Definition** — Define museum type:
   - Collection scope
   - Civilization representation
   - Display philosophy
   - Player experience goals

2. **Template Creation** — Create museum template:
   - Collection type inclusions
   - Era coverage requirements
   - Civilization scope
   - Cross-museum relationships

3. **Instance Creation** — Create museum instance:
   - Unique museum name
   - Geographic location
   - Collection scope
   - Historical period

**Rules:**
- New museum types do not affect existing museums.
- Museum instances can be added indefinitely.
- Collection assignments are additive only.

---

## 11.4 Adding Collections

**Process:**

1. **Type Definition** — Define collection type:
   - Thematic scope
   - Artifact family alignment
   - Museum type inclusions
   - Cross-collection relationships

2. **Template Population** — Define collection template:
   - Required artifacts
   - Optional artifacts
   - Completion requirements
   - Narrative structure

3. **Instance Assignment** — Assign to museums:
   - Museum-specific collection instances
   - Custom narrative for museum
   - Unique display context

**Rules:**
- Collection types are never modified after creation.
- New collection instances can be added to any museum.
- Existing collections remain completable.

---

## 11.5 Adding Artifacts

**Process:**

1. **Research** — Document artifact:
   - Historical verification
   - Multiple specimen identification
   - Era and civilization classification
   - Material and function classification

2. **Cataloguing** — Create artifact record:
   - All naming variations
   - Unique identifier assignment
   - Classification assignments
   - Metadata compilation

3. **Narrative Development** — Write content:
   - Historical context
   - Significance explanation
   - Discovery story
   - Educational connections

4. **Review** — Quality verification:
   - Historical accuracy check
   - Content quality review
   - Classification verification
   - Naming consistency check

5. **Publication** — Add to catalogue:
   - Make discoverable in-game
   - Assign to relevant collections
   - Link to related artifacts
   - Update cross-references

**Rules:**
- Existing artifact records are never modified.
- New artifacts do not invalidate existing collections.
- Rarity assignments are permanent.

---

# 12. Educational Structure

**Every artifact belongs to four educational dimensions.**

---

## 12.1 Educational Dimensions

| Dimension | Description | Player Benefit |
|-----------|-------------|----------------|
| **History** | Temporal and contextual knowledge | Understanding of when and why |
| **Knowledge** | Technical and functional understanding | Comprehension of how things work |
| **Civilisation** | Cultural and societal insight | Appreciation of how people lived |
| **Narrative** | Human stories and connections | Emotional engagement with the past |

---

## 12.2 History Dimension

Every artifact teaches players about history:

**Temporal Context:**
- Exact or approximate date of creation
- Era classification and period characteristics
- Historical events coinciding with creation

**Causal Context:**
- Why this artifact was created
- What need it fulfilled
- What historical circumstances led to its existence

**Impact Context:**
- How this artifact influenced subsequent events
- Its role in historical turning points
- Its significance in the broader historical narrative

---

## 12.3 Knowledge Dimension

Every artifact teaches players about knowledge:

**Technical Knowledge:**
- Materials and their properties
- Manufacturing techniques and processes
- Scientific principles embodied in design

**Functional Knowledge:**
- How the artifact was used
- What purpose it served
- What capabilities it provided

**Transferable Knowledge:**
- Skills and techniques demonstrated
- Innovations represented
- Lessons applicable to understanding technology

---

## 12.4 Civilisation Dimension

Every artifact teaches players about civilisation:

**Cultural Values:**
- What the civilization valued
- Aesthetic preferences and standards
- Religious and spiritual beliefs reflected

**Social Structure:**
- Who used this artifact
- Class and status indicators
- Gender and role representations

**Geographic Context:**
- Where it was created and used
- Trade and cultural exchange evidence
- Environmental adaptation

---

## 12.5 Narrative Dimension

Every artifact teaches through human stories:

**Creator Story:**
- Who made this artifact
- Their background and training
- Their intentions and hopes

**User Story:**
- Who used this artifact
- Their experiences with it
- Their relationship to the object

**Discovery Story:**
- How this artifact was found
- Who discovered it and when
- What its discovery revealed

---

## 12.6 Educational Integration

**Cross-Dimensional Connections:**
- Every artifact links to other artifacts in each dimension.
- Players discover connections between history, knowledge, and culture.
- Narrative threads weave through artifact collections.

**Learning Pathway:**
- Artifacts are organized to support progressive learning.
- Basic concepts introduce advanced topics.
- Players build understanding incrementally.

---

# 13. Future Scalability

**The catalogue supports 100 museums, 100 civilizations, and 10,000+ artifacts without redesign.**

---

## 13.1 Scalability Targets

| Dimension | Current | Target | Scaling Approach |
|-----------|---------|--------|------------------|
| **Artifacts** | 165+ | 10,000+ | Incremental cataloguing with quality gates |
| **Civilizations** | 24 | 100+ | Planned expansion pipeline |
| **Museums** | 0 | 100+ | Template-based instantiation |
| **Collections** | 15+ | 200+ | Collection type expansion |
| **Eras** | 16 | 20+ | Era refinement and subdivision |

---

## 13.2 Technical Scalability

**Hierarchical Depth:**
- Current: 9 levels (World to Variation)
- Maximum: Unlimited (extensible at any point)
- Performance: O(log n) lookup at all levels

**Classification Matrix:**
- Current: 7 classification dimensions
- Cross-references: Unlimited (many-to-many relationships)
- Performance: Indexed queries with sub-millisecond response

**Naming System:**
- Identifier format: 64-character maximum
- Current average: 20-30 characters
- Reserved space: 40+ characters for expansion

---

## 13.3 Content Scalability

**Civilization Expansion:**
- New civilizations add artifacts without affecting existing content.
- Cross-civilization links create discovery networks.
- Regional groupings enable geographic exploration.

**Era Expansion:**
- New eras can be inserted without reorganizing existing eras.
- Overlap zones enable cross-era artifacts.
- Temporal navigation supports forward/backward browsing.

**Museum Expansion:**
- New museums instantiate from existing templates.
- Cross-museum collections enable thematic journeys.
- Player museums scale independently of system museums.

---

## 13.4 Performance at Scale

**Lookup Performance:**
- Direct identifier lookup: < 1ms
- Hierarchical navigation: < 10ms
- Cross-reference queries: < 50ms

**Browser Performance:**
- Collection display: < 100ms for 1000 artifacts
- Filter and search: < 200ms for 10,000 artifacts
- Recommendation engine: < 100ms

**Storage Efficiency:**
- Artifact record: ~5KB average
- 10,000 artifacts: ~50MB storage
- With indexes and metadata: ~200MB total

---

## 13.5 Growth Projections

**Near-Term (Year 1):**
- 500 artifacts across 30 civilizations
- 20 museums implemented
- 50 collection types active
- 12 historical eras represented

**Medium-Term (Year 2):**
- 2,000 artifacts across 50 civilizations
- 50 museums implemented
- 100 collection types active
- 16 historical eras represented

**Long-Term (Year 3+):**
- 5,000 artifacts across 75 civilizations
- 80 museums implemented
- 150 collection types active
- 18 historical eras represented

**Ultimate Scale (Year 5+):**
- 10,000+ artifacts across 100+ civilizations
- 100 museums implemented
- 200+ collection types active
- 20+ historical eras represented

---

# 14. Content Pipeline

**The high-level process for adding artifacts to the catalogue.**

---

## 14.1 Pipeline Overview

```
Research
    ↓
Verification
    ↓
Writing
    ↓
Review
    ↓
Museum Assignment
    ↓
Publication
```

---

## 14.2 Stage Definitions

### Stage 1: Research

**Objective:** Gather comprehensive information about the artifact.

**Activities:**
- Historical source identification
- Academic literature review
- Museum collection documentation
- Photograph and image collection
- Measurement and specification gathering

**Output:** Research dossier with verified facts.

**Duration:** 2-8 hours per artifact depending on complexity.

---

### Stage 2: Verification

**Objective:** Ensure all information is historically accurate.

**Activities:**
- Cross-reference multiple sources
- Expert consultation where needed
- Dating verification
- Provenance confirmation
- Classification validation

**Output:** Verified research dossier.

**Duration:** 1-4 hours per artifact.

**Gate:** Must pass verification checklist before proceeding.

---

### Stage 3: Writing

**Objective:** Create compelling, educational content for players.

**Activities:**
- Historical context narrative
- Significance explanation
- Discovery story composition
- Educational connections documentation
- Naming standardization

**Output:** Complete artifact content package.

**Duration:** 2-6 hours per artifact.

**Quality Standard:** AAA content suitable for museum display.

---

### Stage 4: Review

**Objective:** Ensure content meets quality standards.

**Activities:**
- Historical accuracy review
- Content quality review
- Age-appropriateness check
- Educational value assessment
- Naming consistency verification

**Output:** Approved content package.

**Duration:** 1-3 hours per artifact.

**Gate:** Must pass review checklist with no critical issues.

---

### Stage 5: Museum Assignment

**Objective:** Assign artifact to appropriate museums and collections.

**Activities:**
- Museum type alignment
- Collection assignment
- Cross-reference linking
- Narrative placement
- Display context selection

**Output:** Artifact ready for publication.

**Duration:** 0.5-2 hours per artifact.

---

### Stage 6: Publication

**Objective:** Make artifact available in the game.

**Activities:**
- Database entry creation
- Identifier assignment
- Image asset linking
- Collection membership activation
- Quality assurance verification

**Output:** Live artifact in catalogue.

**Duration:** 0.5-1 hours per artifact.

---

## 14.3 Pipeline Metrics

| Stage | Target Duration | Quality Gate | Pass Rate Target |
|-------|-----------------|--------------|------------------|
| Research | 2-8 hours | Dossier completeness | 95% |
| Verification | 1-4 hours | Accuracy checklist | 90% |
| Writing | 2-6 hours | Quality rubric | 85% |
| Review | 1-3 hours | Approval checklist | 90% |
| Museum Assignment | 0.5-2 hours | Placement validation | 100% |
| Publication | 0.5-1 hours | Technical QA | 99% |

---

## 14.4 Quality Standards

**Research Standards:**
- Minimum 3 independent sources for historical facts.
- Academic sources preferred over popular sources.
- Primary sources preferred over secondary sources.
- Recent scholarship preferred over outdated sources.

**Writing Standards:**
- Educational value in every artifact narrative.
- Age-appropriate content (12+ target audience).
- No graphic violence or disturbing content.
- Balance of facts and engaging storytelling.

**Verification Standards:**
- Zero tolerance for historical inaccuracies.
- Disputed facts must be marked as such.
- All dates must have supporting evidence.
- All attributions must be documented.

---

# 15. Things We NEVER Do

**Absolute rules that are never crossed.**

---

## 15.1 No Duplicate Artifacts

**We never create duplicate artifacts.**

If an artifact with specific characteristics exists, only one record is created. We do not create "variant" artifacts to extend collection time or create artificial scarcity.

**Exception:** Specific specimens from different museums are valid variations, not duplicates.

---

## 15.2 No Fake Civilizations

**We never create civilizations that did not exist.**

Every civilization in the catalogue has academic recognition. We do not create fictional civilizations, composite cultures, or "inspired by" civilizations.

**Exception:** Carefully annotated speculative civilizations for clearly labeled alternate history content (future expansion).

---

## 15.3 No Random Grouping

**We never group artifacts randomly.**

Every collection, museum, and classification has deliberate purpose. Artifacts are grouped by meaningful criteria: shared civilization, shared era, shared function, shared theme.

**Exception:** "Miscellaneous" collections for genuinely peripheral artifacts, kept to minimum.

---

## 15.4 No Poor Taxonomy

**We never use inadequate classification systems.**

Every artifact family, category, and type is carefully defined. Classification hierarchies are logical, consistent, and mutually exclusive where possible.

**Exception:** Cross-classification for artifacts with multiple valid categorizations (explicitly allowed and documented).

---

## 15.5 No Meaningless Collections

**We never create collections without purpose.**

Every collection teaches something. Every collection has narrative coherence. Every collection is completable and rewarding.

**Exception:** "Gateway" collections designed to introduce new players (clearly labeled as introductory).

---

## 15.6 No Historical Fabrication

**We never invent historical facts.**

All artifact narratives are based on documented history. We do not invent dramatic stories, fictional discoverers, or fictional significance.

**Exception:** Clearly labeled speculative content (e.g., "Historians theorize...").

---

## 15.7 No Anachronisms

**We never place artifacts in incorrect time periods.**

Every artifact is accurately dated to the best historical knowledge. We do not place medieval artifacts in ancient contexts or vice versa.

**Exception:** Cross-era artifacts are explicitly labeled with full date range.

---

## 15.8 No Cultural Appropriation

**We never misrepresent or inappropriately present sacred or culturally significant artifacts.**

Artifacts with religious, spiritual, or cultural significance are presented with appropriate respect and context.

**Exception:** Educational presentation with expert consultation and community input.

---

# 16. The Catalogue Promise

**A one-page manifesto for the Global Artifact Catalogue.**

---

## The Catalogue Promise

**This is our covenant with every player who explores the catalogue in Jolt Time.**

---

### We Promise Completeness

The catalogue grows every day. New civilizations join the timeline. New museums open their doors. New artifacts emerge from the dust of ages. But what exists today remains true tomorrow. Your collection never becomes obsolete. Your discoveries never lose their meaning. Your progress never disappears.

---

### We Promise Truth

Every artifact in the catalogue is real. Every civilization documented is recognized. Every era defined is historically grounded. We do not invent. We do not fabricate. We do not compromise on accuracy for quantity. When you explore the catalogue, you explore human history as it actually happened.

---

### We Promise Accessibility

The catalogue is not locked behind paywalls. The catalogue is not gated by spending. The catalogue is not diluted by duplicates or fakes. Every player can complete every collection. Every player can visit every museum. Every player can discover every artifact. This is our promise to you.

---

### We Promise Education

Every artifact teaches. Every collection connects. Every museum illuminates. The catalogue is not just a game — it is a journey through human achievement. When you collect artifacts in Jolt Time, you learn history. When you complete collections, you understand civilizations. When you visit museums, you discover wonder.

---

### We Promise Quality

We would rather release one hundred perfect artifacts than ten thousand mediocre ones. Every artifact meets our standards. Every narrative tells a story worth hearing. Every classification makes sense. We cut no corners. We accept no shortcuts. We settle for nothing less than the best.

---

### We Promise Community

The catalogue belongs to everyone. Your discoveries contribute to our collective knowledge. Your museum inspires other players. Your expertise helps beginners. Your passion enriches our community. We build this together.

---

### We Promise the Future

The catalogue will grow. New civilizations will be added. New eras will be explored. New museums will open. New artifacts will be discovered. But every promise we make today, we keep tomorrow. Your museum is your legacy. Your collection is your contribution. Your journey is our shared story.

---

### This Is Our Promise

**The catalogue is the sum of human achievement.**

**Every artifact is a window into who we were.**

**Every civilization is a chapter in our story.**

**Every era is a stepping stone in our journey.**

**Every museum is a monument to human curiosity.**

**Every collection is a bridge across time.**

---

**We do not build a game about fictional worlds.**

**We build a game about real history.**

**Because real history is more interesting.**

**Because real people deserve to be remembered.**

**Because the truth matters.**

---

**This is Jolt Time.**

**Where the catalogue is the world.**

**Where every artifact is a landmark.**

**Where every civilization is a destination.**

**Where every player is an explorer.**

**Where every journey is education.**

**Where every discovery is wonder.**

---

**This is our promise to you.**

**This is the Catalogue Promise.**

---

# Document Information

| Field | Value |
|-------|-------|
| **Document Name** | Global Artifact Catalogue Architecture |
| **Classification** | Content Architecture Foundation |
| **Status** | Official Reference |
| **Version** | 1.0 |
| **Date** | 2025-01-15 |
| **Author** | Jolt Time Design Team |
| **Purpose** | Single source of truth for artifact catalogue organization |

---

# Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-15 | Initial Global Artifact Catalogue Architecture |

---

# Related Documents

| Document | Purpose |
|----------|---------|
| Vision Bible | Game vision, fantasy, identity, philosophy |
| Game Design Bible | Game pillars, loops, progression, philosophy |
| Artifact System Bible | Artifact philosophy, categories, rarity, narratives |
| Technical Bible | Architecture, data, API, tech stack |
| Civilization Bible | Individual civilization deep-dives |
| Museum Bible | Museum design and implementation |

---

> *"A hundred museums. A hundred civilizations. Ten thousand stories. One catalogue."*

---

**Jolt Time — Where History Becomes an Adventure.**

---

*This document is the foundation of all artifact catalogue decisions in Jolt Time. All content creation, classification, and organizational work involving the artifact catalogue must align with these principles.*

**© Jolt Time — All Rights Reserved**
