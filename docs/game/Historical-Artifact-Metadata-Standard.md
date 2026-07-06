# ⚡ JOLT TIME
## The Official Historical Artifact Metadata Standard

**Document Classification:** Content Standard Foundation  
**Version:** 1.0  
**Status:** Official Reference  
**Date:** 2025  
**Task Reference:** P-206.2  

---

> *"Metadata is the memory of the digital age. Without structured knowledge, even the most valuable artifacts become orphans in our collections."*

---

# Table of Contents

1. [Metadata Philosophy](#1-metadata-philosophy)
2. [Core Metadata](#2-core-metadata)
3. [Historical Metadata](#3-historical-metadata)
4. [Museum Metadata](#4-museum-metadata)
5. [Physical Metadata](#5-physical-metadata)
6. [Historical Context](#6-historical-context)
7. [Educational Metadata](#7-educational-metadata)
8. [Classification Metadata](#8-classification-metadata)
9. [Research Metadata](#9-research-metadata)
10. [Localization Metadata](#10-localization-metadata)
11. [Media Metadata](#11-media-metadata)
12. [Future Metadata](#12-future-metadata)
13. [Quality Requirements](#13-quality-requirements)
14. [Validation Rules](#14-validation-rules)
15. [Future Scalability](#15-future-scalability)
16. [Things We NEVER Do](#16-things-we-never-do)
17. [Metadata Manifesto](#17-metadata-manifesto)

---

# 1. Metadata Philosophy

## Metadata Preserves Knowledge

Every artifact in Jolt Time carries with it a complete record of what we know about it. This record — metadata — is how we ensure that knowledge survives alongside the artifact itself.

**The Standard:**
Metadata is not an afterthought. It is the artifact's biography — every fact we know, every source we consulted, every connection we discovered.

## Metadata Enables Discovery

Well-structured metadata allows players to find exactly what they seek. It allows systems to connect artifacts intelligently. It allows the game to reveal hidden relationships that players would never find through random exploration.

**The Standard:**
Every metadata field exists to enable discovery. Fields are structured for searchability, filterability, and connection-finding.

## Metadata Ensures Consistency

When ten thousand artifacts follow the same metadata standard, they become a unified knowledge base. Players can trust that similar fields mean similar things. Systems can process artifacts automatically. New content can be added without breaking existing structures.

**The Standard:**
Consistency is not optional. Every artifact follows every rule. Every field uses every format. Every value matches every pattern.

---

# 2. Core Metadata

## Every Artifact MUST Contain

Core metadata provides the fundamental identification of each artifact.

## Artifact ID

**Purpose:** Unique system identifier for database operations.

**Format:** `[CIV]-[CAT]-[NUM]`
- `CIV` = 3-letter civilization code (e.g., ROM, EGY, GRE)
- `CAT` = 3-letter category code (e.g., MIL, ART, REL)
- `NUM` = 3-digit sequential number (e.g., 001, 002, 003)

**Examples:**
- `ROM-MIL-001` — Roman Military Artifact #1
- `EGY-REL-042` — Egyptian Religious Artifact #42
- `GRE-ART-015` — Greek Art Artifact #15

**Rules:**
- Never reused
- Never reassigned
- Never duplicated

## Official Name

**Purpose:** The formal, historically accurate name of the artifact.

**Format:** Title Case, historically accurate spelling

**Examples:**
- "Rosetta Stone"
- "Koloss Statue of Memnon"
- "Wall of the Priest Generic"
- "Canopic Jar of Duamutef"

**Rules:**
- Must match museum records
- Must match academic consensus
- Must be historically verified

## Original Name

**Purpose:** Name in original language, if different from English.

**Format:** Original script + transliteration

**Examples:**
- "𓅃𓇳" (Hieroglyphic) — "Rosetta Stone" transliteration
- "Αρμόδιος" (Greek) — "Harmodius"
- "Парфенон" (Russian) — "Parthenon"

**Rules:**
- Always include for non-Latin alphabets
- Include transliteration for all scripts
- Use scholarly transliteration standards

## Display Name

**Purpose:** Player-friendly name shown in game interfaces.

**Format:** Clear, concise, recognizable

**Examples:**
- "Rosetta Stone"
- "K切れ的中世日本刀" (Japanese display)
- "Roman Gladius"

**Rules:**
- Should be recognizable to general audiences
- Should be searchable by common terms
- May differ from Official Name for accessibility

## Internal Name

**Purpose:** Developer-friendly identifier for code references.

**Format:** PascalCase or snake_case, no spaces

**Examples:**
- `RosettaStone`
- `RomanGladius`
- `EgyptianCanopicJar`

**Rules:**
- Unique within system
- Should not change between versions
- Should not include special characters

---

# 3. Historical Metadata

## Temporal and Geographic Classification

Historical metadata situates each artifact in time and space.

## Civilization

**Purpose:** Primary civilization association.

**Format:** Standard civilization name from approved list

**Examples:**
- "Roman Empire"
- "Ancient Egypt"
- "Han Dynasty China"
- "Maya Civilization"

**Rules:**
- Must match approved civilization list
- Use standard naming conventions
- Include regional variants when applicable

## Historical Era

**Purpose:** Period within civilization timeline.

**Format:** Standard era name from timeline bible

**Examples:**
- "Imperial Roman Period"
- "New Kingdom Egypt"
- "Classical Greek Period"
- "Late Han Dynasty"

**Rules:**
- Must match approved era list
- Use civilization-relative naming
- Include date ranges in era definitions

## Date

**Purpose:** Specific date or date range when artifact was created.

**Format:** ISO 8601 with negative years for BCE

**Examples:**
- "300 BCE" → `-0300`
- "500 CE" → `0500`
- "500 BCE - 100 CE" → `-0500/-0100`
- "circa 500 BCE" → `~0500`

**Rules:**
- Use BCE/CE notation for display
- Use negative integers for BCE in storage
- Use "circa" prefix for approximate dates
- Use range notation for uncertain periods

## Approximate Date

**Purpose:** Statement of date uncertainty.

**Format:** Free text, scholarly conventions

**Examples:**
- "circa 500 BCE"
- "3rd century CE"
- "Ming Dynasty period"
- "Late Bronze Age"

**Rules:**
- Use scholarly uncertainty language
- Match academic consensus
- Never use to cover excessive uncertainty

## Country

**Purpose:** Modern country where artifact originated or was found.

**Format:** ISO 3166-1 alpha-2 code + name

**Examples:**
- "EGYPT"
- "GREECE"
- "CHINA"
- "ITALY"

**Rules:**
- Use modern nation-state for location reference
- Include discovery country even if origin differs
- Match ISO standards for system compatibility

## Region

**Purpose:** Historical region within country.

**Format:** Standard historical geography names

**Examples:**
- "Lower Egypt"
- "Attica"
- "Latium"
- "Mesopotamia"

**Rules:**
- Use historically accurate regional names
- Include for artifacts where region is significant
- Match archaeological convention

## City (if known)

**Purpose:** Specific city or site name.

**Format:** Historical name + modern name where applicable

**Examples:**
- "Thebes (modern Luxor)"
- "Athens"
- "Rome (Roma)"
- "Alexandria"

**Rules:**
- Include modern equivalent where known
- Use historical name for artifact context
- Include site names for unexcavated artifacts

## Discovery Site

**Purpose:** Location where artifact was discovered.

**Format:** Archaeological site name + coordinates (if known)

**Examples:**
- "Rosetta, Egypt (approximate coordinates: 31.2°N, 30.4°E)"
- "Tomb of Tutankhamun, Valley of the Kings"
- "Ephesus Archaeological Site"

**Rules:**
- Include for all excavated artifacts
- Use archaeological site names
- Include coordinates when available

---

# 4. Museum Metadata

## Institutional Placement

Museum metadata assigns each artifact to its place in the museum hierarchy.

## Museum

**Purpose:** Primary museum assignment.

**Format:** Standard museum name from approved list

**Examples:**
- "National Archaeological Museum of Athens"
- "British Museum"
- "Museum of Military History"
- "National Museum of Egyptian Antiquities"

**Rules:**
- Must match approved museum list
- Use full official name
- Include location in name where ambiguous

## Wing

**Purpose:** Museum wing assignment.

**Format:** Wing name as defined in museum architecture

**Examples:**
- "Wing of Ancient Civilizations"
- "Military History Wing"
- "Classical Antiquities Wing"

**Rules:**
- Must exist within assigned museum
- Use exact wing naming convention
- Include for all artifacts in multi-wing museums

## Hall

**Purpose:** Museum hall assignment.

**Format:** Hall name as defined in wing architecture

**Examples:**
- "Hall of Egyptian Antiquities"
- "Hall of Roman Legions"
- "Greek Art Hall"

**Rules:**
- Must exist within assigned wing
- Use exact hall naming convention
- Include for all artifacts in multi-hall wings

## Gallery

**Purpose:** Gallery or exhibition space assignment.

**Format:** Gallery name as defined in hall architecture

**Examples:**
- "Permanent Egyptian Gallery"
- "Special Rosetta Stone Exhibition"
- "Greek Sculpture Gallery"

**Rules:**
- May be optional for simple halls
- Include gallery type designation
- Link to collection for cross-reference

## Collection

**Purpose:** Primary collection membership.

**Format:** Standard collection name from approved list

**Examples:**
- "Egyptian Funerary Practices Collection"
- "Roman Military Equipment Collection"
- "Greek Philosophical Texts Collection"

**Rules:**
- Must match approved collection list
- Use full official collection name
- Include for all artifacts

## Artifact Set

**Purpose:** Position within collection structure.

**Format:** Set designation from creation framework

**Values:**
- `CORE` — Primary artifacts defining the collection
- `SUPPORTING` — Secondary artifacts providing context
- `BONUS` — Rare artifacts rewarding deep exploration

**Rules:**
- Required for all artifacts
- Must match creation framework designation
- Should not change after publication

---

# 5. Physical Metadata

## Material and Condition

Physical metadata describes the artifact's tangible properties.

## Material

**Purpose:** Primary materials used in artifact construction.

**Format:** Comma-separated list of materials

**Examples:**
- "Granite"
- "Fired clay, pigment"
- "Bronze, iron fittings"
- "Papyrus, ink"
- "Marble, bronze (inlay)"

**Rules:**
- Include all significant materials
- Use standard material names
- List in order of prominence
- Include alloy compositions where known

## Dimensions

**Purpose:** Physical measurements of the artifact.

**Format:** Metric (primary), Imperial (secondary)

**Examples:**
- "Height: 114 cm; Width: 68 cm; Depth: 42 cm"
- "Length: 65 cm (approx.)"
- "Diameter: 32 cm; Weight: 2.3 kg"

**Rules:**
- Use centimeters for large objects
- Use millimeters for small objects
- Include "approximately" for damaged objects
- Include scale bars for reconstructed objects

## Weight (if known)

**Purpose:** Mass of the artifact.

**Format:** Kilograms (primary)

**Examples:**
- "12.5 kg"
- "340 g (approx.)"
- "Unknown"

**Rules:**
- Include when measured
- Use "Unknown" when not recorded
- Never estimate

## Color

**Purpose:** Dominant colors of the artifact.

**Format:** Common color names, artistic terms acceptable

**Examples:**
- "Golden yellow"
- "Terracotta red-brown"
- "Lapis blue with gold inlay"
- "Marble white with patina"

**Rules:**
- Use recognizable color names
- Include for painted or decorated artifacts
- Note color changes from original (patina, aging)

## Condition

**Purpose:** Current state of preservation.

**Format:** Standardized condition vocabulary

**Values:**
- `INTACT` — Complete, undamaged
- `GOOD` — Minor damage, substantially complete
- `FAIR` — Significant damage, partially complete
- `POOR` — Heavy damage, fragmentary
- `DAMAGED` — Heavily damaged, less than 50% complete
- `DESTROYED` — No physical remnant, known only from records

**Rules:**
- Use standardized values only
- Match archaeological condition assessment
- Update when restoration changes condition

## Restoration Status

**Purpose:** Current restoration state.

**Format:** Boolean + description

**Values:**
- `NONE` — Original condition, no restoration
- `PARTIAL` — Some restoration present
- `COMPLETE` — Full restoration completed
- `RECONSTRUCTED` — Reconstructed from fragments
- `REPLICA` — This entry describes a replica

**Rules:**
- Distinguish restoration from repair
- Include description of restoration methods
- Note which parts are original vs restored

---

# 6. Historical Context

## Meaning and Significance

Historical context metadata captures what the artifact means and why it matters.

## Creator

**Purpose:** Person or workshop that created the artifact.

**Format:** Name (attribution level)

**Examples:**
- "Unknown Egyptian artisan (attributed)"
- "Praxiteles (attributed)"
- "Imperial Roman workshop"
- "Kofun-period Japanese craftsman"

**Rules:**
- Use "Unknown" when creator is unknown
- Include attribution confidence level
- Use scholarly conventions for anonymous artists

## Owner

**Purpose:** Significant owners throughout history.

**Format:** Owner name, period, context

**Examples:**
- "Egyptian pharaohs (New Kingdom period)"
- "Roman Imperial family"
- "British Museum (acquired 1802)"
- "Private collection (18th-19th century)"

**Rules:**
- Include major ownership changes
- Use acquisition/discovery dates for modern period
- Note gaps in provenance

## Purpose

**Purpose:** Original intended use of the artifact.

**Format:** Descriptive statement of function

**Examples:**
- "Royal funerary monument"
- "Military weapon for infantry use"
- "Religious worship artifact"
- "Trade and economic exchange"

**Rules:**
- Base on historical evidence
- Note disputed purposes
- Include religious/cultural function

## Usage

**Purpose:** How the artifact was actually used.

**Format:** Descriptive statement of practice

**Examples:**
- "Carried by infantry in close combat"
- "Placed in tombs for afterlife journey"
- "Used in religious ceremonies by priests"
- "Displayed in public spaces"

**Rules:**
- May differ from stated purpose
- Include evidence for usage
- Note changes over time

## Historical Event

**Purpose:** Major historical event associated with the artifact.

**Format:** Event name + date + significance

**Examples:**
- "Battle of Actium (31 BCE) — victory monument"
- "Construction of Pantheon (118-128 CE)"
- "French Revolution (1789-1799) — symbol of monarchy"
- "Apollo 11 mission (1969) — lunar sample return"

**Rules:**
- Include only verified associations
- Use scholarly event naming
- Note disputed associations

## Historical Importance

**Purpose:** Why this artifact matters to history.

**Format:** 2-3 paragraph scholarly assessment

**Content:**
- What this artifact reveals
- How it changed understanding
- Why it's significant to civilization

**Rules:**
- Based on academic consensus
- Accessible to general audiences
- Updated as scholarship evolves

---

# 7. Educational Metadata

## Learning Value

Educational metadata ensures every artifact teaches something true.

## Short Description

**Purpose:** Quick introduction for game interface.

**Format:** 1-2 sentences, 30-50 words

**Example:**
> "The Rosetta Stone is a granodiorite stele inscribed with three versions of a decree issued in Memphis, Egypt, in 196 BCE. It provided the key to deciphering Egyptian hieroglyphs."

**Rules:**
- Lead with significance
- Include key identifying facts
- Use accessible language

## Long Description

**Purpose:** Comprehensive historical account.

**Format:** 2-3 paragraphs, 150-300 words

**Content:**
- Detailed history and context
- Cultural and historical significance
- Modern understanding and legacy

**Rules:**
- Follow writing standards from creation framework
- Include scholarly perspectives
- Balance detail with accessibility

## Educational Summary

**Purpose:** One-paragraph learning outcome.

**Format:** Single paragraph, 50-75 words

**Example:**
> "Students will understand how the Rosetta Stone enabled the decipherment of Egyptian hieroglyphs by comparing the same text in three scripts: ancient Egyptian hieroglyphs, Demotic script, and ancient Greek."

**Rules:**
- Focus on learning outcome
- Use active learning language
- Connect to broader themes

## Interesting Facts

**Purpose:** Engaging details that spark curiosity.

**Format:** 3-5 bullet points

**Example:**
> - The decree carved on the stone was issued to celebrate the birthday of King Ptolemy V
> - The stone was part of a fortification built by the French in 1799
> - It weighs approximately 760 kilograms
> - Champollion used it to decipher hieroglyphs in 1822
> - It has been on display at the British Museum since 1802

**Rules:**
- Each fact must be verified
- Include surprising details
- Vary topic across facts

## Historical Questions

**Purpose:** Key questions the artifact helps answer.

**Format:** 5 questions with answers

**Example:**
> **Q: How do we know about ancient Egyptian religion?**
> A: The Rosetta Stone contains a decree about religious offerings, showing how temple worship was organized.
>
> **Q: Why was multilingual writing important?**
> A: The three scripts on the stone show how Egypt was part of a multilingual Mediterranean world.

**Rules:**
- Cover Who, What, When, Where, Why, How
- Answers must be in artifact description
- Connect to broader educational goals

---

# 8. Classification Metadata

## Taxonomic Assignment

Classification metadata organizes artifacts into discoverable categories.

## Category

**Purpose:** Primary artifact type classification.

**Format:** Standard category name

**Values:**
- `MILITARY` — Weapons, armor, fortifications
- `RELIGIOUS` — Sacred objects, worship items
- `ART` — Paintings, sculptures, decorative arts
- `ARCHITECTURAL` — Building elements, monuments
- `DOMESTIC` — Household items, daily use objects
- `TRADE` — Currency, commercial goods
- `SCIENTIFIC` — Instruments, technical devices
- `TEXT` — Written materials, documents
- `PERSONAL` — Jewelry, clothing, individual items
- `TRANSPORT` — Vehicles, navigation equipment
- `AGRICULTURAL` — Farming tools, irrigation
- `INDUSTRIAL` — Manufacturing equipment
- `OTHER` — Items not fitting other categories

**Rules:**
- Required field
- Use exact standardized values
- Include "OTHER" sparingly

## Subcategory

**Purpose:** Secondary artifact type classification.

**Format:** Standard subcategory name within category

**Examples (within MILITARY):**
- `WEAPON` — Offensive military items
- `ARMOR` — Protective equipment
- `FORTIFICATION` — Defensive structures
- `STANDARD` — Flags, banners, insignia
- `LOGISTICS` — Supply and support equipment

**Rules:**
- Optional but encouraged
- Use standardized subcategory values
- May be empty for novel artifact types

## Artifact Family

**Purpose:** Groups related artifacts from same tradition.

**Format:** Family name

**Examples:**
- "Roman Gladius Family"
- "Egyptian Canopic Jar Family"
- "Greek Amphora Family"
- "Bronze Age Axe Family"

**Rules:**
- Include for artifacts with clear family relations
- Use scholarly family naming
- May be empty for unique artifacts

## Artifact Type

**Purpose:** Specific artifact type within subcategory.

**Format:** Specific type name

**Examples:**
- "Gladius Hispaniensis"
- "Alabastron"
- "Cylinder Seal"
- "Stele"

**Rules:**
- Use scholarly type naming
- Include for well-documented types
- May be empty for unique artifacts

## Rarity Tier

**Purpose:** Gameplay rarity classification.

**Format:** Standard rarity value

**Values:**
- `COMMON` — Frequently found, easily acquired
- `UNCOMMON` — Less frequent, moderate acquisition difficulty
- `RARE` — Scarce, significant acquisition difficulty
- `EPIC` — Very scarce, high acquisition difficulty
- `LEGENDARY` — Extremely rare, very high acquisition difficulty
- `MYTHIC` — Unique or near-unique, legendary status

**Rules:**
- Based on real-world rarity
- Reflects museum significance
- Never changed for gameplay balancing

---

# 9. Research Metadata

## Source Documentation

Research metadata establishes the scholarly foundation for every artifact.

## Verification Status

**Purpose:** Current state of factual verification.

**Format:** Status value + date + verifier

**Values:**
- `UNVERIFIED` — Initial entry, not yet reviewed
- `PENDING` — Submitted for review
- `VERIFIED` — Reviewed and confirmed
- `DISPUTED` — Scholarly disagreement exists
- `OUTDATED` — New evidence contradicts entry

**Rules:**
- Update when verification status changes
- Include verification date
- Note who verified

## Primary Sources

**Purpose:** Direct historical sources for artifact information.

**Format:** Source citation in standard format

**Examples:**
- "British Museum CATALOGUE_1234"
- "Petrie, W.M.F. 1889. Ten Years' Digging in Egypt"
- "Pliny the Elder. Naturalis Historia. Book 34"

**Rules:**
- Include at least one for VERIFIED status
- Use standard academic citation format
- Include museum inventory numbers where available

## Secondary Sources

**Purpose:** Scholarly works interpreting the artifact.

**Format:** Source citation in standard format

**Examples:**
- "Ray, John. 2000. The Rosetta Stone and the Rebirth of Ancient Egypt"
- "Clayton, Peter. 1994. Chronology of Egyptian Pharaohs"
- "Trigger, et al. 1983. Ancient Egypt: A Social History"

**Rules:**
- Include 2-5 sources minimum
- Use peer-reviewed publications
- Prioritize recent scholarship

## Museum References

**Purpose:** Museum catalog entries and records.

**Format:** Museum name + catalog reference

**Examples:**
- "British Museum EA 24"
- "Louvre Museum N 1234"
- "Metropolitan Museum of Art 32.15"

**Rules:**
- Include for all museum-housed artifacts
- Use official catalog numbers
- Include museum location

## Academic References

**Purpose:** Major academic studies of this artifact.

**Format:** Citation in standard academic format

**Examples:**
- "Ray, John. "The Rosetta Stone: New Light on an Ancient Object." Journal of Egyptian History 12 (2000): 45-67."
- "Parkinson, Richard. 1999. The Rosetta Stone. British Museum Press."

**Rules:**
- Update as new research appears
- Use current academic consensus
- Include DOI where available

---

# 10. Localization Metadata

## Global Accessibility

Localization metadata ensures artifacts are accessible to global audiences.

## Original Language

**Purpose:** Primary language of artifact's original context.

**Format:** ISO 639-1 language code + name

**Examples:**
- "EGY (Ancient Egyptian)"
- "GRC (Ancient Greek)"
- "LAT (Latin)"
- "CHS (Chinese, historical)"

**Rules:**
- Include for all artifacts
- Use historical language designations
- Include dead language designations

## Supported Languages

**Purpose:** Languages available for this artifact's content.

**Format:** List of ISO 639-1 codes

**Examples:**
- "EN, ES, FR, DE, ZH, JA"
- "EN, AR, FR"
- "EN"

**Rules:**
- English (EN) always supported
- Add languages as localization completes
- Minimum: EN only

## Pronunciation

**Purpose:** Audio pronunciation guide.

**Format:** IPA notation + audio file reference

**Examples:**
- "/roʊˈziːtə stoʊn/"
- "/hiːrəˈɡlɪfɪks/"
- "/pəˈθeɪɡən/"

**Rules:**
- Include for non-English names
- Use IPA standard
- Include audio file where available

## Transliteration

**Purpose:** Written conversion of non-Latin scripts.

**Format:** Standard transliteration system name + output

**Examples:**
- "Egyptian Hieroglyphs (Gardiner): pr-ꜥꜣ"
- "Chinese (Pinyin): luó塞塔石"
- "Japanese (Hepburn): Rosetta Ishi"

**Rules:**
- Use scholarly transliteration systems
- Include for all non-Latin scripts
- Note which transliteration system used

---

# 11. Media Metadata

## Visual and Audio Assets

Media metadata manages the digital representations of artifacts.

## Reference Images

**Purpose:** Primary images of the artifact.

**Format:** Image reference with attribution

**Structure:**
```
{
  "type": "reference",
  "url": "https://cdn.jolttime.artifacts/rosetta_stone.jpg",
  "attribution": "British Museum",
  "license": "Public Domain",
  "resolution": "4000x3000",
  "is_primary": true
}
```

**Rules:**
- Include at least one primary image
- Use high-resolution for detail
- Include proper attribution

## Illustrations

**Purpose:** Interpretive illustrations and diagrams.

**Format:** Illustration reference with context

**Structure:**
```
{
  "type": "illustration",
  "url": "https://cdn.jolttime.artifacts/rosetta_diagram.jpg",
  "description": "Diagram showing three script sections",
  "artist": "Jolt Time Art Team",
  "license": "Jolt Time Proprietary"
}
```

**Rules:**
- Label as illustrations vs photographs
- Include context for interpretation
- Maintain illustration standards

## 3D Model (future)

**Purpose:** Three-dimensional digital representation.

**Format:** 3D model reference

**Structure:**
```
{
  "type": "model_3d",
  "url": "https://cdn.jolttime.artifacts/rosetta_stone.glb",
  "format": "GLB",
  "polycount": "25000",
  "has_texture": true,
  "is_draft": true
}
```

**Rules:**
- Mark draft models clearly
- Include polygon count
- Note texture availability

## Audio Guide (future)

**Purpose:** Audio narration about the artifact.

**Format:** Audio reference with transcript

**Structure:**
```
{
  "type": "audio",
  "url": "https://cdn.jolttime.artifacts/rosetta_audio.mp3",
  "duration": "2:30",
  "language": "EN",
  "transcript": "https://cdn.jolttime.artifacts/rosetta_transcript.txt",
  "narrator": "Dr. Sarah Chen"
}
```

**Rules:**
- Include transcript for accessibility
- Note language
- Use professional narration

---

# 12. Future Metadata

## Extensibility Fields

Future metadata enables content expansion without standard changes.

## Interactive Elements

**Purpose:** Available interactive features for this artifact.

**Format:** List of interaction types

**Values:**
- `ROTATE` — 360-degree rotation
- `ZOOM` — Detail magnification
- `HOTSPOT` — Clickable discovery points
- `ANIMATION` — Animated demonstration
- `AUDIO` — Sound effects
- `VIDEO` — Video content
- `AR` — Augmented reality view
- `COMPARE` — Side-by-side comparison

**Rules:**
- Extend list as features develop
- Mark experimental features clearly
- Include availability date

## Museum Events

**Purpose:** Special events associated with this artifact.

**Format:** Event reference

**Structure:**
```
{
  "event_id": "evt_2024_moon_landing_anniversary",
  "event_name": "Apollo 11 55th Anniversary",
  "start_date": "2024-07-20",
  "end_date": "2024-08-20",
  "artifact_featured": true
}
```

**Rules:**
- Link to event system
- Include duration
- Note featured status

## Seasonal Tags

**Purpose:** Seasonal availability designations.

**Format:** List of season identifiers

**Examples:**
- `SEASON_2024_SPRING`
- `SEASON_2024_SUMMER`
- `HOLIDAY_2024_WINTER`

**Rules:**
- Include for seasonal content
- Empty for permanent artifacts
- Update as seasons change

## Special Exhibitions

**Purpose:** Special exhibition assignments.

**Format:** Exhibition reference

**Structure:**
```
{
  "exhibition_id": "exh_rosetta_tour",
  "exhibition_name": "Rosetta Stone World Tour",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "is_current": true
}
```

**Rules:**
- Link to exhibition system
- Include current status
- Update as exhibitions change

---

# 13. Quality Requirements

## Standards for All Metadata

Every metadata field must meet these requirements.

## Historically Accurate

**Every field value must be verified against credible sources.**

- Primary sources preferred
- Academic consensus required for interpretation
- Uncertainty noted explicitly

## Consistent

**Field values must follow established patterns and formats.**

- Use standardized vocabulary
- Follow format specifications exactly
- Match approved lists and taxonomies

## Reusable

**Field values must be usable across contexts.**

- Avoid context-specific abbreviations
- Use universal identifiers
- Design for multiple use cases

## Human Readable

**Field values must be understandable to non-specialists.**

- Use clear language
- Avoid jargon without definition
- Include context where needed

## Machine Searchable

**Field values must support automated processing.**

- Use structured formats
- Include normalized identifiers
- Avoid free-form text where structured options exist

---

# 14. Validation Rules

## Data Integrity Standards

Metadata must never contain invalid or inaccurate data.

## ❌ Unknown Civilization

**Rule:** Every artifact must have a valid, verified civilization assignment.

**Invalid:** `"Unknown"`, `"TBD"`, `null`  
**Valid:** `"Roman Empire"`, `"Ancient Egypt"`

**Exception:** New discoveries may temporarily use `PREHISTORIC` or `UNDETERMINED` with academic consultation.

## ❌ Wrong Era

**Rule:** Every artifact must have a historically accurate era assignment.

**Invalid:** `"Modern Period"` for an ancient artifact  
**Valid:** `"New Kingdom"` for Egyptian artifact

**Validation:** Era must fall within civilization's defined timeline.

## ❌ Incorrect Location

**Rule:** Every artifact must have an accurate geographic location.

**Invalid:** `"China"` for Roman artifact  
**Valid:** `"Roman Empire (modern Italy, Greece, Turkey)"`

**Validation:** Region must fall within country's historical boundaries.

## ❌ Fake References

**Rule:** Every citation must be a real, verifiable publication.

**Invalid:** Fabricated sources, unverified websites  
**Valid:** Peer-reviewed publications, museum catalogs, archaeological reports

**Validation:** Source must be verifiable through academic channels.

## ❌ Missing Historical Context

**Rule:** Every artifact must have sufficient historical context.

**Invalid:** `"A Roman sword"`  
**Valid:** `"Gladius used by Roman legionary infantry during the Imperial period, circa 1st-3rd century CE. Primary weapon in close-combat formation fighting."`

**Validation:** Description must include purpose, usage, and significance.

---

# 15. Future Scalability

## Enterprise-Grade Expansion

The metadata standard supports indefinite growth.

## Scale Targets

| Dimension | Year 1 | Year 3 | Year 5 |
|-----------|--------|--------|--------|
| **Civilizations** | 20 | 50 | 100 |
| **Museums** | 10 | 50 | 100 |
| **Collections** | 100 | 500 | 1,000 |
| **Artifacts** | 500 | 3,000 | 10,000+ |
| **Languages** | 3 | 10 | 25 |
| **Media Assets** | 1,000 | 10,000 | 50,000+ |

## Scalability Architecture

### Backward Compatibility

New fields are added as optional, never breaking existing data.

- All existing artifacts remain valid
- New required fields have safe defaults
- Schema migrations are automatic

### Forward Compatibility

Existing systems handle new content without modification.

- Extensible enum values for categories
- Plugin architecture for future metadata types
- Version-stamped field definitions

### Performance Scaling

Database indexes and query optimization support millions of artifacts.

- Indexed search across all classification fields
- Faceted navigation for filtering
- Graph relationships for artifact connections

---

# 16. Things We NEVER Do

## Inviolable Metadata Standards

### ❌ Invent Metadata

We never create metadata values without source verification.

**Rule:** Every field value must be traceable to a real source.

### ❌ Use Unverifiable Dates

We never use dates that cannot be supported by evidence.

**Rule:** "circa" and range notation only when genuinely uncertain.

### ❌ Create Fictional Provenance

We never fabricate ownership history or discovery records.

**Rule:** Only include provenance that is documented.

### ❌ Duplicate Identifiers

We never reuse or duplicate artifact identifiers.

**Rule:** Each artifact has one unique identifier, never reassigned.

### ❌ Skip Validation

We never publish artifacts without completing all required fields.

**Rule:** Incomplete metadata blocks publication.

### ❌ Ignore Updates

When scholarship changes, we update metadata.

**Rule:** Historical accuracy is more important than version stability.

---

# 17. Metadata Manifesto

## Why Structured Historical Metadata Is Essential for Preserving Digital Cultural Heritage

---

**In the digital age, metadata is memory.**

When the Library of Alexandria burned, knowledge was lost not because the books disappeared — they had already been copied, referenced, woven into the fabric of scholarship. They were lost because no one remembered exactly what they contained. The loss was not of paper but of description. Not of books but of catalog.

This is the lesson of metadata. The artifact survives. But without description, without context, without the structured knowledge that tells future generations what it is and why it matters — the artifact is mute.

**Metadata is how we speak for the silent.**

Every artifact in Jolt Time is a survivor. It endured when countless others were destroyed. It carries the testimony of people who have been dead for millennia. But artifacts cannot speak for themselves. They cannot explain their significance. They cannot connect themselves to the web of human history.

Metadata speaks for them. Metadata says: this is a Roman gladius. This is what it was used for. This is how it connects to Roman military organization, to the fall of the Republic, to the rise of empire. This is why it matters.

**Metadata is how we build the web of understanding.**

Human history is not a list of objects. It is a web of connections. The gladius connects to the lorica. The lorica connects to the legion. The legion connects to the empire. The empire connects to the trade routes. The trade routes connect to the silk. The silk connects to China.

Without metadata, we have objects. With metadata, we have understanding. The structured data about each artifact is what allows us to trace these connections, to reveal these relationships, to show players that history is not a museum of isolated curiosities but a living web of human achievement and tragedy.

**Metadata is how we preserve for the future.**

We do not know what future generations will want to know about our artifacts. We do not know what questions they will ask. We do not know what connections they will want to trace.

But we can preserve the raw material. We can record everything we know, in structured form, with sources cited and uncertainty noted. We can create a database of human knowledge that future scholars can query, analyze, and build upon.

This is our responsibility. We are not just building a game. We are building a digital archive of human cultural heritage. Every metadata field is a promise to the future: we recorded what we knew. We preserved what we could.

**Metadata is how we ensure no voice is lost.**

The potter who shaped the clay had no way to tell us his name. The scribe who carved the inscription could not explain what it meant. The artist who painted the fresco has been dust for two thousand years.

But we can speak for them. We can say: this pot was made in this city, by these hands, for this purpose. We can explain: this inscription records this law, enacted for this reason, witnessed by these people. We can reveal: this fresco depicted this myth,表达了 this belief, survived this destruction.

This is the power of metadata. It is how we give voice to the voiceless. It is how we restore the lost to memory. It is how we ensure that even if every artifact were destroyed tomorrow, the knowledge of what they were and why they mattered would survive.

**This is our mission. This is our promise.**

We create metadata not because the system requires it. We create metadata because the future depends on it. Because the potter deserves to be remembered. Because the scribe deserves to be understood. Because every human being who ever shaped clay or carved stone or painted fresco deserves to have their achievement recorded for those who come after.

Metadata is memory.

And memory is all we have to give the future.

---

**Every field a fact preserved.**

**Every connection a relationship restored.**

**Every record a promise to the future.**

**Every artifact a voice reclaimed.**

---

# Document Control

| Field | Value |
|-------|-------|
| **Classification** | Content Standard Foundation |
| **Version** | 1.0 |
| **Status** | Official Reference |
| **Task** | P-206.2 |
| **Next Task** | P-207.1 — Ancient Egypt Artifact Pack |
| **Author** | Jolt Time Design Team |
| **Date** | 2025 |

---

*Building the future through the lens of the past.*

**Jolt Time** — Where history becomes an adventure.
