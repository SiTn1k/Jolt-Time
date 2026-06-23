# Inventory System Architecture

## Overview

The Jolt Time inventory system is the central hub where players manage all collected items. It provides organization, filtering, search, and quick actions for artifacts and other items. The inventory is designed to scale to thousands of items while maintaining responsive performance and intuitive navigation.

---

## 1. Main Inventory Sections

The inventory is organized into distinct sections, each serving a specific player need.

### 1.1 Artifacts

**Purpose**: Primary collection display for all historical artifacts.

**Behavior**:
- Default landing section when opening inventory
- Displays all acquired artifacts in a responsive grid
- Shows artifact image, name, rarity border, and level indicator
- Long artifacts scroll smoothly with lazy loading
- Supports virtualization for 1000+ items

**Item Card Display**:
- Artifact thumbnail (80x80px)
- Name (truncated with ellipsis if > 16 characters)
- Rarity color border (2px)
- Level stars (1-10 filled/empty)
- Favorite star indicator (if marked)
- Duplicate count badge (if count > 1)

### 1.2 Museum Collection

**Purpose**: Showcase progression and completed artifact sets.

**Behavior**:
- Grouped by era and set categories
- Shows completion percentage per group
- Locked artifacts shown as silhouettes
- Display-only section (no management actions)

**Sections**:
- Hall of Ages: Artifacts organized by era
- Set Collections: Incomplete/complete set tracking
- Rarity Collections: Progress toward rarity milestones
- Cosmetic Collection: Frames, badges, titles, auras

### 1.3 Consumables

**Purpose**: Manage single-use items that players consume.

**Items Include**:
- Time Energy refills (instant/full recharge)
- Chrono Dust bundles
- XP boosters (2x XP for 30 minutes)
- Lucky capsules (guaranteed rare+ artifact)
- Streak shields (protect daily streak)
- Collection accelerators (increased fragment yields)

**Stack Behavior**:
- Same items stack up to 99
- Stack count displayed on icon
- Tap to use, long-press for details

### 1.4 Event Items

**Purpose**: Store limited-time items from active events.

**Behavior**:
- Only visible during active events
- Automatically hidden when event ends
- Separate tab for each active event
- Event timer countdown on section header

**Item Types**:
- Event currency tokens
- Event-specific artifacts (temporary)
- Event achievements and badges
- Story fragments (narrative progression)

### 1.5 Boosters

**Purpose**: Manage duration-based power-ups.

**Active Boosters**:
- XP multipliers (2x, 3x, 5x)
- Energy efficiency (+25%, +50%)
- Fragment bonus (+100%, +200%)
- Lucky drops (increased rarity chance)

**Display**:
- Active boosters shown in header bar
- Timer countdown for each active booster
- Stack multiple of same booster type
- Tap booster in header to expand details

### 1.6 Special Rewards

**Purpose**: Store one-time claimable rewards.

**Categories**:
- Level-up rewards (claim from inbox)
- Achievement rewards (auto-claim or manual)
- Season track rewards (claim at season end)
- Login reward packages (unclaimed days)
- Referral bonuses (pending acceptance)

**Notification**:
- Badge indicator when unclaimed rewards exist
- Separate "Unclaimed" filter tab

---

## 2. Artifact Filters

Filters narrow down the visible artifact list without removing items from the collection.

### 2.1 Era Filter

**Options**:
- Ancient World (before 500 BCE)
- Classical Era (500 BCE – 500 CE)
- Middle Ages (500 – 1400 CE)
- Renaissance (1400 – 1700 CE)
- Industrial Age (1700 – 1900 CE)
- Modern Era (1900 – Present)

**Behavior**:
- Horizontal scrollable chips at top of filter panel
- Multi-select enabled (show artifacts from multiple eras)
- "All Eras" quick toggle to reset
- Count badge on each chip showing items in that era

### 2.2 Rarity Filter

**Options**:
- Common (gray)
- Uncommon (green)
- Rare (blue)
- Epic (purple)
- Legendary (orange)
- Mythic (gold)

**Behavior**:
- Toggle buttons, multi-select enabled
- Visual color indicator on each toggle
- Filters combine with other filter types (AND logic)
- Quick toggle: "Show only new" (not yet leveled)

### 2.3 Type Filter

**Options**:
- Weapon
- Armor
- Document
- Relic
- Scientific Item
- Royal Artifact
- Military Artifact
- Cultural Artifact

**Behavior**:
- Dropdown menu with checkboxes
- Single or multi-select
- Type icon shown next to label
- Combined with era and rarity filters

### 2.4 Obtained Source Filter

**Options**:
- Mission Reward
- Capsule Open
- Event Reward
- Achievement Reward
- Daily Login
- Purchased
- Crafted (future)

**Behavior**:
- Tracks provenance of each artifact
- Helps players who want specific farming methods
- Collapsible filter section

### 2.5 Favorites Filter

**Options**:
- All Items
- Favorites Only
- Non-Favorites

**Behavior**:
- Single toggle, not combined with other filters
- Quick access via star icon in toolbar

---

## 3. Sorting

Sorting determines the order of artifacts within the filtered view.

### 3.1 Newest First

**Behavior**:
- Default sort option
- Orders by `acquiredAt` timestamp descending
- Most recently acquired artifacts appear first
- New items show "NEW" badge for 24 hours

### 3.2 Oldest First

**Behavior**:
- Orders by `acquiredAt` timestamp ascending
- Useful for completionists tracking acquisition order
- Shows earliest collected items first

### 3.3 Highest Rarity

**Behavior**:
- Orders by rarity tier descending
- Mythic first, then Legendary, Epic, Rare, Uncommon, Common
- Within same rarity, secondary sort by name
- Useful for showcasing rare finds

### 3.4 Alphabetical

**Behavior**:
- Orders by artifact name A-Z
- Case-insensitive sorting
- Secondary sort by rarity within same starting letter
- Useful for finding specific artifacts by name

### 3.5 Most Used

**Behavior**:
- Orders by usage count descending
- Tracks how often player has deployed each artifact
- Highlights frequently used items
- Helps players remember favorite loadouts

### 3.6 Sort Persistence

**Rules**:
- Selected sort preference saved per session
- Persists across tab switches within same session
- Resets to "Newest First" on new session
- Sort indicator shown in toolbar

---

## 4. Favorites System

Favorites provide quick access to a player's most valued items.

### 4.1 Marking Items

**How to Mark**:
- Double-tap on artifact card
- Tap star icon on card hover
- Star icon in artifact detail modal
- Bulk action: select multiple, then "Mark Favorites"

**Visual Indicator**:
- Filled gold star icon on card
- Gold border on card (subtle, 1px)
- Favorites tab in navigation

### 4.2 Limits

**Current Limit**: 20 favorites maximum

**Rationale**:
- Encourages curation
- Keeps favorites list manageable
- Future consideration: limit increase via purchase

### 4.3 Favorites Tab

**Behavior**:
- Dedicated tab showing only favorited items
- Same grid layout and interactions as main view
- Empty state if no favorites set
- Drag to reorder (display order only)

---

## 5. Duplicate Handling

Duplicates are allowed and encouraged for progression.

### 5.1 Acquisition

**Behavior**:
- When obtaining an already-owned artifact, count increases
- No duplicate penalty or reduction
- Visual badge shows "x2", "x3", etc. on card

### 5.2 Conversion

**Automatic Process**:
- Duplicates convert to fragments automatically
- Fragment yield based on rarity tier
- Conversion notification shown on acquisition

**Fragment Yields**:
| Rarity | Fragments per Duplicate |
|--------|------------------------|
| Common | 1-2 |
| Uncommon | 3-5 |
| Rare | 6-10 |
| Epic | 15-25 |
| Legendary | 40-60 |
| Mythic | 100-150 |

### 5.3 Display

**Duplicate Count Badge**:
- Shown in top-right corner of artifact card
- "x1" not shown (default state)
- "x2", "x3", ... for multiples
- Tap badge to see duplicate history

---

## 6. Future Mechanic: Duplicate Usage

While duplicates currently convert to fragments, future systems are designed to support additional uses.

### 6.1 Upgrades

**Concept** (Phase 2):
- Duplicate artifacts can directly upgrade same artifact
- Faster than fragment conversion
- Requires 2-3 duplicates per level
- Alternative upgrade path alongside fragments

**Data Preparation**:
- Each artifact tracks `duplicateCount`
- Upgrade system reads this field
- No UI changes needed in Phase 1

### 6.2 Fusion

**Concept** (Phase 3):
- Combine 3-5 duplicates of same artifact
- Results in next rarity tier of same type
- Common + duplicates → Uncommon version
- Fusion materials from special events

**Data Preparation**:
- Fusion recipe system (future schema)
- Artifact fusion tier field added
- Fusion UI module (future)

### 6.3 Crafting

**Concept** (Phase 3):
- Use duplicates as crafting materials
- Specific recipes require artifact types
- Example: 5 Relics + 3 Documents → Historical Tome
- Crafted items may be exclusive cosmetics

**Data Preparation**:
- Crafting recipe system (future schema)
- Material consumption tracking
- Crafted item registry (new table)

---

## 7. Capacity

### 7.1 Launch Configuration

**Unlimited Inventory at Launch**

- No capacity cap on artifacts
- No capacity cap on consumables
- No capacity cap on event items
- All items stored in player inventory

### 7.2 Future Considerations

**Potential Limits** (Post-Launch):
- Inventory expansion packs (purchasable)
- Storage management UI for cleanup
- Auto-convert older duplicates option
- Cloud storage tier upgrades

**Architecture**:
- Capacity system designed as pluggable module
- Default: unlimited
- Can enable limits without rebuilding inventory structure

---

## 8. Empty States

Empty states provide guidance when sections have no items.

### 8.1 Artifacts Section

**Empty State**:
```
Title: "No Artifacts Yet"
Subtitle: "Complete missions and open capsules to discover historical artifacts"
Action Button: "Start Your Journey"
Icon: Ancient artifact silhouette
```

**No Results (Filtered)**:
```
Title: "No Matching Artifacts"
Subtitle: "Try adjusting your filters or search terms"
Action Button: "Clear Filters"
Icon: Magnifying glass with question mark
```

### 8.2 Favorites Tab

**Empty State**:
```
Title: "No Favorites"
Subtitle: "Tap the star on any artifact to add it here"
Action Button: "Browse Artifacts"
Icon: Star outline
```

### 8.3 Consumables Section

**Empty State**:
```
Title: "No Consumables"
Subtitle: "Collect items during missions and events"
Action Button: "View Missions"
Icon: Potion bottle outline
```

### 8.4 Event Items Section

**Empty State**:
```
Title: "No Active Events"
Subtitle: "Check back soon for limited-time events"
Action Button: "View Event Calendar"
Icon: Calendar with clock
```

### 8.5 Boosters Section

**Empty State**:
```
Title: "No Active Boosters"
Subtitle: "Use consumables or complete achievements for boosters"
Action Button: "View Achievements"
Icon: Lightning bolt outline
```

### 8.6 Search No Results

**Empty State**:
```
Title: "No Results"
Subtitle: "No artifacts match "{searchTerm}""
Action Button: "Clear Search"
Icon: Magnifying glass
```

---

## 9. Performance Requirements

The inventory must handle large collections efficiently.

### 9.1 Scalability Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Total items supported | 5,000+ | 10,000 |
| Initial load time | < 500ms | 1000ms |
| Filter response time | < 100ms | 200ms |
| Search response time | < 300ms | 500ms |
| Scroll FPS | 60 FPS | 30 FPS minimum |
| Memory usage | < 100MB | 200MB |

### 9.2 Technical Implementation

**Virtualization**:
- Only render visible items plus buffer
- Recycle card components on scroll
- Maintain scroll position on filter change

**Lazy Loading**:
- Load artifact images on demand
- Placeholder skeleton during load
- Prefetch adjacent items

**Caching**:
- Cache filtered results for 5 minutes
- Cache sort orders for quick switching
- Local storage for recent filters

**Pagination**:
- Backend pagination for 100+ items
- Client-side virtual scroll within page
- Infinite scroll trigger at 80% scroll

### 9.3 Optimization Strategies

- Debounce filter/sort changes (150ms)
- Throttle scroll events (16ms)
- Batch DOM updates
- Use CSS transforms for animations
- Service worker for offline access

---

## 10. Search

Search enables quick artifact discovery by name.

### 10.1 Search Input

**Location**: Top of inventory screen, always visible

**Behavior**:
- Single-line text input
- Search icon on left
- Clear button on right (when text present)
- Placeholder text: "Search artifacts..."

### 10.2 Search Logic

**Search Fields**:
- Artifact name (primary)
- Description text (secondary)
- Era name (tertiary)
- Type name (tertiary)

**Matching**:
- Case-insensitive matching
- Partial match supported ("Sword" matches "Bronze Sword")
- Accent-insensitive ("Cafe" matches "Café")

### 10.3 Search Results

**Real-time Updates**:
- Results update as user types
- 300ms debounce before executing search
- Show loading indicator during search

**Results Display**:
- Same grid layout as main view
- "Showing X results for '{query}'" header
- Highlight matching text in results

### 10.4 Suggestions

**Dropdown Suggestions**:
- Max 5 suggestions shown
- Shows matching artifact names
- Tap suggestion to search instantly
- Keyboard navigation supported

---

## 11. Quick Actions

Quick actions provide fast access to common operations.

### 11.1 View Details

**Trigger**: Single tap on artifact card

**Result**: Opens artifact detail modal

**Modal Contents**:
- Large artifact image
- Name, era, type, rarity
- Level and power stats
- Historical description
- Fragment progress
- Level up button (if affordable)

### 11.2 Add to Favorites

**Trigger**: Double-tap OR star icon tap

**Result**: Toggles favorite status

**Feedback**:
- Star fills/unfills with scale animation
- Toast notification: "Added to favorites" / "Removed from favorites"
- Haptic feedback on mobile

### 11.3 Share

**Trigger**: Share icon in detail modal

**Result**: Generates shareable artifact card image

**Share Card Contains**:
- Artifact image
- Name and rarity
- Collection date
- Player name (optional toggle)
- Jolt Time branding

**Platforms**:
- Native share sheet (iOS/Android)
- Copy image to clipboard
- Direct social media buttons

### 11.4 Open Museum Page

**Trigger**: "View in Museum" button in detail modal

**Result**: Navigates to artifact in museum view

**Museum Context**:
- Shows artifact in its era display
- Shows set completion status
- Shows collection progress

---

## 12. Long-Term Scalability

The inventory architecture must support future systems without rebuilding.

### 12.1 Extensibility Principles

**Open/Closed Principle**:
- Add new item types without modifying core
- New tabs/modules plug into existing structure
- Configuration-driven sections

**Layered Architecture**:
```
┌─────────────────────────────────────┐
│         Presentation Layer           │
│   (UI Components, Cards, Modals)    │
├─────────────────────────────────────┤
│          Business Layer             │
│   (Filters, Sorters, Search)         │
├─────────────────────────────────────┤
│           Data Layer                 │
│   (Repositories, Caching)           │
├─────────────────────────────────────┤
│          Storage Layer               │
│   (Database, Local Storage)         │
└─────────────────────────────────────┘
```

### 12.2 Future Section Addition

**Adding New Sections**:
1. Define section schema in config
2. Add section component
3. Register in navigation
4. No changes to existing code

**Example: "Crafting Materials" Section**:
- New item type: "CraftingMaterial"
- New section with same infrastructure
- Filters for material category
- Integration with crafting system (future)

### 12.3 Data Model Extensions

**Item Type Registry**:
- Central registry of item types
- Each type defines its own schema
- Schema validation on load
- Type-specific handlers for actions

**Extensible Fields**:
- Base item fields (common to all)
- Type-specific fields (in JSON column)
- Custom fields support via EAV pattern

### 12.4 Action Extensions

**New Actions**:
- Register action handlers by item type
- Actions defined in configuration
- No hardcoded action logic
- Example actions: Trade, Equip, Upgrade, Fuse

### 12.5 Performance Scaling

**Horizontal Scaling**:
- Shard inventory by item type
- Parallel load for multiple sections
- Progressive loading by priority

**Vertical Scaling**:
- Increase virtualization efficiency
- Optimize image loading
- Enhanced caching strategies

---

## 13. Data Schema

### 13.1 Inventory Item

```json
{
  "id": "string",
  "playerId": "string",
  "itemType": "artifact | consumable | event | booster | reward",
  "itemId": "string",
  "count": "number",
  "isFavorite": "boolean",
  "acquiredAt": "timestamp",
  "lastUsedAt": "timestamp | null",
  "metadata": {
    "source": "mission | capsule | event | achievement | purchase",
    "level": "number",
    "duplicateCount": "number",
    "customFields": {}
  }
}
```

### 13.2 Artifact Extended

```json
{
  "inventoryItem": "<Inventory Item>",
  "artifact": {
    "id": "string",
    "name": "string",
    "era": "string",
    "rarity": "string",
    "type": "string",
    "power": "number"
  }
}
```

### 13.3 Filter Configuration

```json
{
  "filters": [
    {
      "id": "era",
      "label": "Era",
      "type": "multi-select",
      "options": []
    },
    {
      "id": "rarity",
      "label": "Rarity",
      "type": "multi-select",
      "options": []
    },
    {
      "id": "type",
      "label": "Type",
      "type": "multi-select",
      "options": []
    },
    {
      "id": "source",
      "label": "Source",
      "type": "multi-select",
      "options": []
    }
  ],
  "sorters": [
    { "id": "newest", "label": "Newest First", "default": true },
    { "id": "oldest", "label": "Oldest First" },
    { "id": "rarity", "label": "Highest Rarity" },
    { "id": "alpha", "label": "Alphabetical" },
    { "id": "used", "label": "Most Used" }
  ]
}
```

---

## 14. API Endpoints

### 14.1 Get Inventory

```
GET /api/players/{playerId}/inventory

Query Parameters:
- section: artifact | consumable | event | booster | reward
- page: number (default: 1)
- limit: number (default: 50)
- sort: newest | oldest | rarity | alpha | used
- filters: JSON encoded filter object

Response: InventoryResponse
```

### 14.2 Update Favorite

```
PUT /api/players/{playerId}/inventory/{itemId}/favorite

Body: { "isFavorite": boolean }

Response: InventoryItem
```

### 14.3 Search Inventory

```
GET /api/players/{playerId}/inventory/search

Query Parameters:
- q: search query string
- section: artifact (default)
- limit: number (default: 20)

Response: SearchResults
```

### 14.4 Use Consumable

```
POST /api/players/{playerId}/inventory/{itemId}/use

Body: { "count": number }

Response: { "success": boolean, "newCount": number }
```

---

## 15. Related Documents

- [Artifacts](./artifacts.md) - Artifact collection system details
- [Museum](./museum.md) - Museum display and progression
- [Energy System](./energy-system.md) - Energy-related consumables
- [Quests](./quests.md) - Quest rewards and item acquisition
- [Daily Rewards](./daily-rewards.md) - Login rewards system
- [Social System](./social-system.md) - Trading and sharing features

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
