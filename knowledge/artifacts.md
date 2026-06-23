# Artifact Collection System

## Overview

The artifact collection system is a core gameplay loop where players discover, collect, and catalog historical artifacts across various eras. Each artifact represents a piece of human history, offering both narrative value and gameplay benefits.

---

## 1. Artifact Structure

Every artifact in the collection is defined by the following properties:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `ART_001`) |
| `name` | string | Display name of the artifact |
| `description` | string | Historical context and backstory |
| `historicalEra` | enum | Era from which the artifact originates |
| `rarity` | enum | Rarity tier affecting availability and power |
| `image` | string | Asset path or URL to the artifact image |
| `power` | integer | Combat/utility value contributed to player |
| `level` | integer | Current upgrade level (1–10) |
| `fragmentsRequired` | integer | Fragments needed for next level |
| `ownership` | object | Ownership state and metadata |
| `createdAt` | timestamp | UTC timestamp of first acquisition |

### Ownership Object

```json
{
  "acquired": true,
  "acquiredAt": "2025-01-15T10:30:00Z",
  "count": 1,
  "isFavorite": false,
  "fragmentCount": 0
}
```

### Level Progression

- **Level 1–3**: Common upgrades, +2 power per level
- **Level 4–6**: Rare upgrades, +3 power per level  
- **Level 7–9**: Epic upgrades, +5 power per level
- **Level 10**: Maximum level, unlock cosmetic badge

Fragment requirements double every 3 levels:

| Current Level | Fragments to Next |
|---------------|-------------------|
| 1 | 10 |
| 2 | 10 |
| 3 | 20 |
| 4 | 20 |
| 5 | 20 |
| 6 | 40 |
| 7 | 40 |
| 8 | 40 |
| 9 | 80 |
| 10 | MAX |

---

## 2. Rarity System

Rarity determines an artifact's scarcity, visual presentation, and gameplay impact.

| Rarity | Color | Hex Code | Drop Probability | Fragment Yield | Power Multiplier |
|--------|-------|----------|------------------|----------------|------------------|
| Common | Gray | `#9CA3AF` | 50% | 1–2 | 1.0x |
| Rare | Blue | `#3B82F6` | 25% | 3–5 | 1.5x |
| Epic | Purple | `#8B5CF6` | 15% | 6–10 | 2.0x |
| Legendary | Orange | `#F97316` | 8% | 15–25 | 3.0x |
| Mythic | Gold | `#FBBF24` | 2% | 50–100 | 5.0x |

### Visual Effects by Rarity

**Common**
- Static card border
- No animation
- Basic shadow

**Rare**
- Subtle shimmer animation on card edge
- Faint glow effect
- Increased shadow depth

**Epic**
- Pulsing glow aura around artifact
- Particle sparkles on hover
- Card tilt effect on selection

**Legendary**
- Animated gradient border
- Floating artifact animation
- Screen flash on acquisition
- Unique sound effect

**Mythic**
- Rainbow shimmer border animation
- 3D rotation effect on artifact image
- Confetti burst on acquisition
- Exclusive "Mythic" badge overlay
- Ambient particle system

---

## 3. Era Categories

Artifacts are organized by the historical period of their origin.

| Era | Time Period | Description | Example Artifacts |
|-----|-------------|-------------|-------------------|
| Ancient World | Before 500 BCE | Early civilizations | Cuneiform tablets, Bronze weapons |
| Classical Era | 500 BCE – 500 CE | Greek and Roman periods | Marble statues, Legion eagles |
| Middle Ages | 500 – 1400 CE | Feudal Europe, early medieval | Chainmail, illuminated manuscripts |
| Renaissance | 1400 – 1700 CE | Art and scientific rebirth | Paintings, early compasses |
| Industrial Age | 1700 – 1900 CE | Machines and empire building | Steam engine parts, Victorian jewelry |
| Modern Era | 1900 – Present | Contemporary history | Typewriters, wartime medals |

### Era Distribution

- Each era contains approximately 15–20 unique artifacts
- Total collection: 100+ artifacts across all eras
- Era-specific quests unlock bonus artifacts

---

## 4. Artifact Types

Artifacts are classified by their functional category.

| Type | Description | Typical Power Range |
|------|-------------|---------------------|
| Weapon | Offensive equipment from history | 50–500 |
| Armor | Protective gear and shields | 40–400 |
| Document | Historical texts and records | 20–200 |
| Relic | Sacred or ceremonial objects | 30–300 |
| Scientific Item | Inventions and discoveries | 25–250 |
| Royal Artifact | Items of monarchy and nobility | 45–450 |
| Military Artifact | War memorabilia and insignia | 35–350 |
| Cultural Artifact | Art, music, and traditions | 20–200 |

### Type Bonuses

When a player collects 3+ artifacts of the same type:
- Weapon: +5% attack power
- Armor: +5% defense power
- Document: +5% knowledge points
- Relic: +3% spiritual power
- Scientific Item: +5% research speed
- Royal Artifact: +3% influence gain
- Military Artifact: +5% stamina
- Cultural Artifact: +3% charisma

---

## 5. Collection Rules

### Duplicate Artifacts

- Duplicate acquisitions are allowed
- Each duplicate adds +1 to `ownership.count`
- Duplicates contribute to collection percentage
- No duplicate penalty—players can display multiple copies

### Fragment System

- Duplicate artifacts convert to fragments on acquisition
- Fragment count based on rarity tier
- Fragments accumulate in dedicated inventory tab
- Artifacts can be leveled up using collected fragments

### Fragment Conversion Table

| Rarity | Duplicates Yield | Conversion Rate |
|--------|------------------|-----------------|
| Common | 1–2 fragments | 100% → fragments |
| Rare | 3–5 fragments | 100% → fragments |
| Epic | 6–10 fragments | 100% → fragments |
| Legendary | 15–25 fragments | 100% → fragments |
| Mythic | 50–100 fragments | 100% → fragments |

### Future Evolution

- Artifacts may gain "evolved forms" in future phases
- Evolution requires:
  - Max level (10)
  - Special evolution materials
  - Era-specific catalyst
- Evolved artifacts gain new artwork and increased power

### Collection Percentage

- Displayed as "X / Y Artifacts Collected"
- Calculated as unique artifact IDs acquired / total artifacts
- Percentage milestones unlock rewards:
  - 25%: Bronze Collector badge
  - 50%: Silver Collector badge
  - 75%: Gold Collector badge
  - 100%: Platinum Collector badge + exclusive artifact

---

## 6. Inventory UI Behavior

### Tab Structure

**All Tab**
- Default view on inventory open
- Shows entire collection in grid layout
- Cards display: image, name, rarity border, level star

**Favorites Tab**
- Shows only artifacts marked as favorite
- Quick-access for player's prized items
- Maximum 20 favorites

**By Era Tab**
- Horizontal scrollable era selector
- Filtered grid for selected era
- Era progress bar shown at top
- Long-press on era card to preview all era artifacts

**By Rarity Tab**
- Filter buttons for each rarity tier
- Can combine multiple rarity filters
- Sort by power or name within filter

### Sorting Rules

| Sort Option | Order | Default |
|-------------|-------|---------|
| Recently Added | Newest first | Yes |
| Power (High–Low) | Descending | No |
| Power (Low–High) | Ascending | No |
| Name (A–Z) | Alphabetical | No |
| Name (Z–A) | Reverse alphabetical | No |
| Level (High–Low) | Descending | No |
| Rarity | Mythic → Common | No |

### Filtering Rules

- **Rarity Filter**: Toggle visibility per rarity tier
- **Era Filter**: Select one or multiple eras
- **Type Filter**: Select artifact type categories
- **Level Filter**: Minimum level slider (1–10)
- **Favorites Only**: Toggle to show favorites only
- Filters persist within session, reset on tab change

### Search System

- **Input**: Text field with search icon
- **Behavior**: Real-time filtering as user types
- **Search Fields**: Name, description, era, type
- **Debounce**: 300ms delay before search executes
- **Empty State**: "No artifacts match your search" with clear button
- **Suggestions**: Dropdown with matching artifact names (max 5)

### Card Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| View Details | Tap | Opens artifact detail modal |
| Toggle Favorite | Double-tap or star icon | Marks/unmarks as favorite |
| Quick Level Up | Long-press + swipe up | Opens level-up confirmation |
| Share | Share icon | Generates shareable image |

---

## 7. Artifact Detail Modal

When a player taps an artifact card, the following modal appears:

### Header Section
- Large artifact image (centered)
- Rarity badge overlay (top-right corner)
- Favorite star button (top-left corner)

### Info Section
- **Name**: Bold, large text
- **Era**: Icon + era name
- **Type**: Icon + type name
- **Rarity**: Colored text matching rarity
- **Level**: Star icons (filled/empty based on level)
- **Power**: Numeric value with multiplier note

### Description Section
- Historical description text
- "Did You Know?" expandable fact

### Stats Section
- Base power value
- Current power (with level bonus)
- Fragments to next level
- Total fragments collected for this artifact

### Actions Section
- **Level Up**: Button (disabled if insufficient fragments)
- **Share**: Generate shareable card
- **Close**: X button or swipe down

---

## 8. Acquisition Flow

1. Player completes activity/quest
2. Roll for artifact drop (based on rarity probabilities)
3. If drop occurs, roll for specific artifact within rarity
4. Check for duplicate or new acquisition
5. Display acquisition animation based on rarity
6. Update collection percentage
7. Add to inventory with animation

### Acquisition Animations

| Rarity | Animation Duration | Effects |
|--------|-------------------|---------|
| Common | 1.5s | Fade in, basic sound |
| Rare | 2.0s | Shimmer, sparkle sound |
| Epic | 2.5s | Glow pulse, chime |
| Legendary | 3.0s | Border animation, fanfare |
| Mythic | 4.0s | Rainbow burst, epic music, screen effect |

---

## 9. Milestone Rewards

Collection milestones provide progression incentives:

| Milestone | Requirement | Reward |
|-----------|-------------|--------|
| First Find | Collect 1 artifact | 50 fragments |
| Bronze Collector | 25% collection | Exclusive frame + 200 fragments |
| Silver Collector | 50% collection | Era spotlight feature + 500 fragments |
| Gold Collector | 75% collection | Legendary chest + 1000 fragments |
| Master Historian | 90% collection | Epic chest + 2000 fragments |
| Platinum Collector | 100% collection | Mythic artifact + 5000 fragments |

---

## 10. Future Considerations

### Phase 2 Features (Planned)
- Artifact trading between players
- Artifact lending for cooperative play
- Limited-time seasonal artifacts
- Artifact set bonuses (3/5/8 collected)

### Phase 3 Features (Considered)
- Artifact evolution system
- Museum display customization
- Historical timeline placement mini-game
- Artifact certification system

---

*Document Version: 1.0*  
*Last Updated: 2025-01-15*