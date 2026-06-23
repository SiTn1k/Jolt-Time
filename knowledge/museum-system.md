# Museum System Architecture

## Overview

The Museum is the player's personal historical collection showcase, displaying all discovered artifacts in an elegant, browsable gallery. It serves as both a trophy room for collectors and an educational resource where players can explore artifacts they've collected. The Museum reinforces Jolt Time's core educational philosophy by presenting real historical artifacts with accurate information.

---

## 1. Purpose

The Museum serves multiple functions within Jolt Time:

### 1.1 Collection Showcase

- Display all collected artifacts in an organized gallery
- Celebrate player achievements and progress
- Provide visual representation of collection depth
- Create a sense of accomplishment and completion

### 1.2 Educational Resource

- Present historical facts about each artifact
- Encourage exploration of eras and civilizations
- Support "Historical Mode" for learning without combat
- Provide context for artifact significance

### 1.3 Progression Tracking

- Show completion percentages per era
- Track overall collection progress
- Unlock rewards at milestones
- Guide future collecting goals

### 1.4 Social Feature Foundation

- Enable sharing of collection achievements
- Support museum rankings (future)
- Allow comparison with friends (future)
- Create community around collection

---

## 2. Museum Sections

The Museum is organized into era-based sections, each representing a distinct historical period.

### 2.1 Era Sections

| Section | Time Period | Artifacts | Description |
|---------|-------------|-----------|-------------|
| Ancient Era | 3500 BCE - 500 BCE | 12-15 | Mesopotamia, Egypt, early civilizations |
| Classical Era | 500 BCE - 500 CE | 12-15 | Greece, Rome, Han China |
| Medieval Era | 500 CE - 1400 CE | 10-12 | European Middle Ages, early Americas |
| Renaissance Era | 1400 CE - 1700 CE | 10-12 | European art explosion, exploration |
| Industrial Era | 1700 CE - 1900 CE | 8-10 | Steam power, empire building |
| Modern Era | 1900 CE - 2000 CE | 8-10 | World wars, space age |
| Future Era | 2000 CE+ | 3-5 | Near-future artifacts, speculative |

### 2.2 Section Navigation

```
┌─────────────────────────────────────────┐
│  🏛️ MY MUSEUM                    [🔍]  │
├─────────────────────────────────────────┤
│                                         │
│  Progress: 42/82 artifacts (51%)        │
│  [████████████████░░░░░░░░░] 51%        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  SELECT ERA                             │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Ancient │ │Classical│ │Medieval │  │
│  │  3/12   │ │  5/15   │ │  8/12   │  │
│  │  25%    │ │  33%    │ │  67%    │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │Renaissance│ │Industrial│ │  Modern │  │
│  │  10/12  │ │  6/10   │ │  10/10  │  │
│  │  83%    │ │  60%    │ │  100%   │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  ┌─────────┐                           │
│  │  Future │                           │
│  │  0/5    │                           │
│  │  0%     │                           │
│  └─────────┘                           │
│                                         │
└─────────────────────────────────────────┘
```

### 2.3 Era Card Design

Each era card displays:
- Era icon/illustration
- Era name
- Collected/Total count
- Completion percentage
- Visual indicator (locked, in-progress, complete)

---

## 3. Artifact Placement

### 3.1 Automatic Organization

Artifacts automatically appear in their corresponding era section based on:
- Era classification (stored in artifact data)
- Civilization/country origin
- Historical time period

### 3.2 Placement Grid

```
┌─────────────────────────────────────────┐
│  ←  ANCIENT ERA                    3/12│
│      Mesopotamia, Egypt                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────┐ ┌───────┐ ┌───────┐       │
│  │  Clay │ │ Cunei-│ │ Bronze│       │
│  │ Tablet│ │ form  │ │ Age   │       │
│  │  ★    │ │ Script│ │ Sword │       │
│  │       │ │  ★    │ │       │       │
│  └───────┘ └───────┘ └───────┘       │
│                                         │
│  ┌───────┐ ┌───────┐ ┌───────┐       │
│  │  Gold │ │ Stone │ │  🔒  │       │
│  │  Ring │ │ Head  │ │       │       │
│  │       │ │  (R)  │ │9 more │       │
│  │       │ │       │ │ locked│       │
│  └───────┘ └───────┘ └───────┘       │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 Card States

| State | Visual | Interaction |
|-------|--------|-------------|
| Owned | Full artifact image, rarity border | Tap to view details |
| Duplicate | Badge showing count "x2" | Tap to view details |
| Locked | Silhouette, lock icon | Tap shows "???" + unlock hint |
| New | "NEW" badge for 24h | Tap to view details |
| Favorite | Gold star overlay | Tap to view details |

---

## 4. Completion Progress

### 4.1 Progress Display

**Per Era**:
```
┌─────────────────────────────────────────┐
│  ANCIENT ERA                    3/12   │
│  [████░░░░░░░░░░░░░░░░░░] 25%         │
└─────────────────────────────────────────┘
```

**Overall**:
```
┌─────────────────────────────────────────┐
│  Total Collection              42/82   │
│  [█████████████████░░░░░░░] 51%       │
│                                         │
│  🏆 Milestone: Silver Collector         │
│     50% Complete - Keep exploring!       │
└─────────────────────────────────────────┘
```

### 4.2 Milestone Rewards

| Milestone | Requirement | Reward |
|-----------|-------------|--------|
| Bronze Collector | 25% | Exclusive frame |
| Silver Collector | 50% | Chrono Dust +200 |
| Gold Collector | 75% | Legendary chest |
| Platinum Collector | 90% | Epic chest |
| Master Historian | 100% | Mythic artifact |

### 4.3 Progress Persistence

- Progress syncs across devices
- Saves automatically on collection change
- Tracks fastest completion times (future)
- Records first-time discoveries

---

## 5. Rewards System

### 5.1 Era Completion Rewards

Completing an entire era (100%) unlocks:
- Era-specific badge
- Chrono Dust bonus (100-500)
- Exclusive cosmetic item
- Museum display upgrade

### 5.2 Set Collection Rewards

Completing artifact sets within an era:
- Set completion badge
- Themed profile frame
- Booster item (2x fragments)

### 5.3 Future Rewards (Planned)

| Reward Type | Description | Unlock |
|-------------|-------------|--------|
| Chrono Coins | Premium currency | Milestone achievements |
| Boosters | 2x XP, 2x Fragments | Collection goals |
| Profile Decorations | Museum-themed items | Era completion |
| Exclusive Backgrounds | Museum-themed backgrounds | 100% collection |
| Titles | "Master Curator", etc. | Achievement unlocks |
| NFT Badges | Blockchain-verified achievements | Future integration |

### 5.4 Reward Display

```
┌─────────────────────────────────────────┐
│  🎁 COLLECTION REWARDS                  │
├─────────────────────────────────────────┤
│                                         │
│  🏆 Bronze Collector         [CLAIMED]  │
│     25% Collection Complete             │
│                                         │
│  🏆 Silver Collector         [PENDING]  │
│     50% Collection - Need 8 more!       │
│     [████████████████░░░░░░] 48/82      │
│                                         │
│  ⬜ Gold Collector            [LOCKED]  │
│     75% Collection Required             │
│                                         │
│  ⬜ Platinum Collector      [LOCKED]    │
│     100% Collection Required            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Empty Museum State

### 6.1 New Player Experience

**Empty Museum (0 artifacts)**:
```
┌─────────────────────────────────────────┐
│  🏛️ MY MUSEUM                           │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────────────┐             │
│         │   🏺           │             │
│         │                 │             │
│         │  Your museum    │             │
│         │   awaits...     │             │
│         └─────────────────┘             │
│                                         │
│  Your personal collection will appear    │
│  here as you discover artifacts.        │
│                                         │
│  Start your journey in Mesopotamia      │
│  to find your first artifact!           │
│                                         │
│  [ 🚀 BEGIN YOUR ADVENTURE ]            │
│                                         │
└─────────────────────────────────────────┘
```

### 6.2 Era Empty State

**Era Not Started**:
```
┌─────────────────────────────────────────┐
│  ←  FUTURE ERA                    0/5 │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────────────┐             │
│         │    🚀          │             │
│         │                 │             │
│         │  Undiscovered  │             │
│         └─────────────────┘             │
│                                         │
│  Complete Industrial Era to unlock       │
│  Future Era artifacts.                   │
│                                         │
│  [ 🔓 UNLOCKS AT INDUSTRIAL 100% ]      │
│                                         │
└─────────────────────────────────────────┘
```

### 6.3 Encouraging Messages

Rotating messages for motivation:
- "Every great collection starts with a single artifact."
- "The artifacts of tomorrow are waiting to be discovered."
- "History is full of wonders—your museum awaits."
- "Each artifact tells a story. What's yours?"
- "The timeline needs a curator. Will you answer the call?"

---

## 7. Historical Mode

### 7.1 Purpose

Historical Mode allows players to:
- Browse all artifacts without battling
- Read historical information freely
- Study artifacts before hunting them
- Enjoy educational content without game pressure

### 7.2 Access

- Toggle button in museum header
- Persists across sessions
- Available from level 1

### 7.3 Features in Historical Mode

| Feature | Normal Mode | Historical Mode |
|---------|------------|----------------|
| View collected artifacts | ✓ | ✓ |
| View locked artifacts | Silhouette only | Full info, no image |
| Read historical facts | ✓ | ✓ |
| Filter/sort artifacts | ✓ | ✓ |
| Search artifacts | ✓ | ✓ |
| Add to favorites | ✓ | ✓ |
| Deploy artifacts | ✓ | ✗ |
| Upgrade artifacts | ✓ | ✓ |
| Share artifacts | ✓ | ✓ |

### 7.4 Learning Features

**Quick Facts Panel**:
```
┌─────────────────────────────────────────┐
│  💡 QUICK FACTS                         │
│                                         │
│  • Created: 2600 BCE                    │
│  • Material: Limestone, Gold            │
│  • Size: 143m height                    │
│  • Location: Giza, Egypt                 │
│                                         │
│  [ 📚 READ FULL HISTORY ]               │
│  [ ❓ QUIZ YOURSELF ]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Educational Philosophy

### 8.1 Core Principles

1. **Accuracy First**
   - All facts verified by historians
   - Museum-quality information
   - Primary source citations

2. **Engagement Through Discovery**
   - Learning feels rewarding
   - Curiosity drives collection
   - Each artifact teaches something

3. **Progressive Complexity**
   - Early eras: Basic facts
   - Later eras: Nuanced context
   - Advanced: Multiple perspectives

### 8.2 Content Standards

**For Each Artifact**:
- Real historical origin
- Cultural significance
- Modern relevance
- Fun trivia fact
- Source citation

### 8.3 Educational Integration

```
┌─────────────────────────────────────────┐
│  📜 HISTORICAL CONTEXT                   │
│                                         │
│  The Nebra Sky Disk is a Bronze Age     │
│  artifact representing the night sky    │
│  from approximately 1600 BCE.           │
│                                         │
│  It was used as an astronomical clock   │
│  to determine the best times for       │
│  planting and harvesting crops.         │
│                                         │
│  This shows Bronze Age people had      │
│  sophisticated understanding of        │
│  celestial movements.                   │
│                                         │
│  📚 Sources:                            │
│     British Museum, Landesmuseum        │
│                                         │
└─────────────────────────────────────────┘
```

### 8.4 Quiz Integration

After viewing artifact details:
```
┌─────────────────────────────────────────┐
│  ❓ DID YOU LEARN?                      │
│                                         │
│  What was the Nebra Sky Disk used for?  │
│                                         │
│  ○ A) A weapon                         │
│  ○ B) An astronomical clock ✓            │
│  ○ C) A musical instrument              │
│  ○ D) A religious altar                 │
│                                         │
│  Correct! It helped Bronze Age farmers  │
│  track seasons for planting.             │
│                                         │
│  +10 XP for learning!                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. Search Support

### 9.1 Search Bar

Location: Top of museum screen, always visible

**Appearance**:
```
┌─────────────────────────────────────────┐
│  🔍 Search artifacts by name...         │
└─────────────────────────────────────────┘
```

### 9.2 Search Behavior

| Feature | Description |
|---------|-------------|
| Real-time | Results update as you type |
| Debounce | 300ms delay before search |
| Case-insensitive | "pyramid" matches "Pyramid" |
| Partial match | "scar" matches "Scarab" |
| Scope | Artifact names, descriptions |

### 9.3 Search Results

```
┌─────────────────────────────────────────┐
│  🔍 Results for "pyramid"               │
│                                         │
│  Found 3 artifacts:                     │
│                                         │
│  ┌───────┐ ┌───────┐ ┌───────┐        │
│  │Pyramid│ │Step   │ │Pyramid│        │
│  │of Giza│ │Pyramid│ │Text   │        │
│  │Egypt  │ │Sakkara│ │Egypt  │        │
│  │ (R)   │ │ (E)   │ │ (U)   │        │
│  └───────┘ └───────┘ └───────┘        │
│                                         │
│  [View in Museum →]                     │
│                                         │
└─────────────────────────────────────────┘
```

### 9.4 No Results State

```
┌─────────────────────────────────────────┐
│  🔍 No results for "unicorn"            │
│                                         │
│  Try searching for:                     │
│  • "pyramid", "tomb", " pharaoh"       │
│  • "greek", "roman", "medieval"        │
│  • Artifact names like "Scarab"         │
│                                         │
│  [Clear Search]                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 10. Future Support

### 10.1 Achievement System

**Planned Features**:
- Collection achievements (e.g., "Egyptologist")
- Milestone badges (e.g., "First 50 artifacts")
- Rare find achievements (e.g., "Mythic Master")
- Completion achievements (e.g., "Full Set")

**Achievement Display**:
```
┌─────────────────────────────────────────┐
│  🏆 ACHIEVEMENTS                        │
├─────────────────────────────────────────┤
│                                         │
│  [★★★] Egyptologist                     │
│       Collect all Egyptian artifacts     │
│       Progress: 8/10                    │
│                                         │
│  [★★☆] Bronze Collector                │
│       Collect 25% of all artifacts ✓   │
│                                         │
│  [☆☆☆] Mythic Master                   │
│       Collect a Mythic artifact         │
│       Not yet achieved                  │
│                                         │
└─────────────────────────────────────────┘
```

### 10.2 Museum Rankings

**Planned Features**:
- Global leaderboards (total collection %)
- Era-specific rankings
- Weekly/monthly progress rankings
- Friend comparison

**Ranking Display**:
```
┌─────────────────────────────────────────┐
│  🏅 MUSEUM RANKINGS                    │
├─────────────────────────────────────────┤
│                                         │
│  GLOBAL                                 │
│  1. Player12345 ............ 82%       │
│  2. Collector_Pro ......... 78%        │
│  3. You ................... 51%        │
│  4. HistoryBuff ............ 48%        │
│  5. TimeTraveler99 ........ 45%        │
│                                         │
│  Your Rank: #3 of 1,234                │
│  [Compare with Friends →]               │
│                                         │
└─────────────────────────────────────────┘
```

### 10.3 Seasonal Collections

**Planned Features**:
- Limited-time seasonal artifacts
- Seasonal museum themes
- Holiday-themed artifacts
- Event-exclusive displays

**Seasonal Display**:
```
┌─────────────────────────────────────────┐
│  🎄 HOLIDAY SEASON                      │
│     Dec 1-31                           │
├─────────────────────────────────────────┤
│                                         │
│  Limited artifacts from this event:     │
│  ┌───────┐ ┌───────┐ ┌───────┐        │
│  │Golden │ │Snow   │ │Winter │        │
│  │Star   │ │Globe  │ │Crown  │        │
│  │ 🔒   │ │ 🔒   │ │ 🔒   │        │
│  └───────┘ └───────┘ └───────┘        │
│                                         │
│  Collect all to unlock Frost Frame!      │
│                                         │
└─────────────────────────────────────────┘
```

### 10.4 NFT Collections

**Planned Integration**:
- Blockchain verification of rare artifacts
- Tradeable NFT badges
- Verified ownership display
- External marketplace connection

**NFT Display**:
```
┌─────────────────────────────────────────┐
│  💎 NFT COLLECTION                       │
├─────────────────────────────────────────┤
│                                         │
│  Connected Wallet: 0x1234...abcd        │
│                                         │
│  Verified NFTs: 3                       │
│  ┌───────┐ ┌───────┐ ┌───────┐        │
│  │Nebula │ │Spartan│ │Pharaoh│        │
│  │Sky D. │ │Shield │ │Mask   │        │
│  │ ✓     │ │ ✓     │ │ ✓     │        │
│  └───────┘ └───────┘ └───────┘        │
│                                         │
│  [ View on OpenSea → ]                  │
│                                         │
└─────────────────────────────────────────┘
```

### 10.5 Social Sharing

**Planned Features**:
- Share museum snapshots
- Generate shareable images
- Social media integration
- Friend gifting

**Share Card**:
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │
│  │  JOLT TIME MUSEUM               │    │
│  │                                 │    │
│  │  Collection: 51% (42/82)        │    │
│  │  Favorite Era: Ancient (25%)    │    │
│  │                                 │    │
│  │  🏆 Silver Collector            │    │
│  │                                 │    │
│  │  Play Jolt Time!                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [ 📤 Share to Twitter ]                │
│  [ 📘 Share to Facebook ]               │
│  [ 📋 Copy Link ]                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 11. Visual Style

Following the premium dark style from ui-style.md.

### 11.1 Color Application

```css
.museum {
  background: var(--bg-primary);        /* #0A0E17 */
  min-height: 100vh;
}

.museum-header {
  background: var(--bg-secondary);       /* #0F1525 */
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
}

.era-card {
  background: var(--bg-card);          /* #131B2E */
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 217, 255, 0.1);
  transition: all var(--duration-normal) ease;
}

.era-card:hover {
  border-color: rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.1);
}

.era-card.complete {
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
}

.artifact-card {
  background: var(--bg-elevated);       /* #1A2540 */
  border-radius: var(--radius-md);
  padding: var(--space-3);
}
```

### 11.2 Typography

```css
.museum-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.era-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.progress-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.percentage {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
}
```

### 11.3 Spacing

```css
.museum {
  padding: var(--space-4);
  padding-bottom: calc(72px + var(--space-4) + env(safe-area-inset-bottom));
}

.era-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.artifact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-4);
}

@media (max-width: 428px) {
  .era-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .artifact-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 11.4 Glow Effects

```css
.complete-badge {
  box-shadow: 0 0 20px var(--premium-glow);
}

.new-badge {
  animation: glowPulse 2s ease-in-out infinite;
  box-shadow: 0 0 15px var(--primary-glow);
}

.locked-artifact {
  filter: grayscale(1);
  opacity: 0.5;
}
```

---

## 12. Performance Requirements

### 12.1 Scalability Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Total artifacts | 5,000+ | 10,000 |
| Era sections | 7 | 15 |
| Grid render | 60 FPS | 30 FPS |
| Initial load | < 500ms | 1000ms |
| Search response | < 300ms | 500ms |
| Memory usage | < 100MB | 200MB |

### 12.2 Optimization Strategies

**Virtualization**:
```javascript
// Only render visible artifacts
const visibleArtifacts = useVirtualizer({
  count: filteredArtifacts.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 100,
  overscan: 5,
});
```

**Lazy Loading**:
```javascript
// Load artifact images on demand
<img 
  src={artifact.image}
  loading="lazy"
  placeholder={<Skeleton />}
  onLoad={() => markLoaded(artifact.id)}
/>
```

**Caching**:
```javascript
// Cache museum state
localStorage.setItem('museum_state', JSON.stringify({
  lastViewedEra: 'ancient',
  sortPreference: 'rarity',
  filters: currentFilters,
}));
```

### 12.3 Pagination

**Era Sections**:
- All eras visible in grid
- Tap era to expand artifact list
- Back navigation to return to overview

**Artifact Grid**:
- Virtual scroll for 100+ artifacts
- Load more on scroll
- Smooth scrolling at 60 FPS

---

## 13. Navigation Flow

### 13.1 Entry Points

| Source | Destination | Context |
|--------|-------------|---------|
| Home | Museum Overview | Show progress |
| Collection Tab | Museum Overview | Show progress |
| Artifact Card | Artifact Details | View specific |
| Profile | Museum Overview | View stats |

### 13.2 Museum Navigation

```
MUSEUM OVERVIEW
    │
    ├── [Tap Era Card]
    │       │
    │       └── ERA DETAIL
    │           │
    │           ├── [Tap Artifact]
    │           │       │
    │           │       └── ARTIFACT DETAILS
    │           │               │
    │           │               └── [Back] → ERA DETAIL
    │           │
    │           └── [Back] → MUSEUM OVERVIEW
    │
    ├── [Search]
    │       │
    │       └── SEARCH RESULTS
    │               │
    │               └── [Tap Result]
    │                       │
    │                       └── ARTIFACT DETAILS
    │
    └── [Achievements]
            │
            └── ACHIEVEMENTS PANEL
```

### 13.3 Deep Linking

**URL Scheme**:
```
jolttime://museum
jolttime://museum/era/{eraId}
jolttime://museum/artifact/{artifactId}
```

---

## 14. Data Schema

### 14.1 Museum State

```json
{
  "playerId": "string",
  "museum": {
    "totalArtifacts": 82,
    "collectedCount": 42,
    "completionPercentage": 51,
    "lastUpdated": "timestamp"
  },
  "eraProgress": [
    {
      "eraId": "ancient",
      "name": "Ancient Era",
      "totalArtifacts": 12,
      "collectedCount": 3,
      "completionPercentage": 25,
      "isUnlocked": true,
      "isComplete": false
    }
  ],
  "favorites": ["artifactId1", "artifactId2"],
  "recentlyViewed": ["artifactId1", "artifactId2"],
  "achievements": [
    {
      "achievementId": "bronze_collector",
      "name": "Bronze Collector",
      "description": "Collect 25% of artifacts",
      "unlocked": true,
      "unlockedAt": "timestamp"
    }
  ]
}
```

### 14.2 Era Definition

```json
{
  "eraId": "string",
  "name": "string",
  "timePeriod": "string",
  "description": "string",
  "icon": "string",
  "color": "string",
  "order": "number",
  "unlockRequirement": {
    "type": "previous_era_complete",
    "eraId": "string"
  },
  "artifacts": ["artifactId1", "artifactId2"],
  "sets": [
    {
      "setId": "string",
      "name": "string",
      "artifactIds": ["artifactId1", "artifactId2"],
      "reward": {}
    }
  ]
}
```

---

## 15. Related Documents

- [Artifacts](./artifacts.md) - Artifact collection system
- [Inventory System](./inventory-system.md) - Inventory management
- [Artifact Details](./artifact-details.md) - Artifact detail page
- [UI Style Guide](../.openhands/knowledge/ui-style.md) - Visual design system

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
