# Artifact Details Architecture

## Overview

The Artifact Details page provides comprehensive information about a single artifact. Players access this page by tapping an artifact card from the inventory or collection screens. The page combines historical education with gameplay information, presented in a premium dark UI style.

---

## 1. Information Displayed

### 1.1 Core Identifiers

| Field | Type | Display Format | Required |
|-------|------|----------------|----------|
| Name | string | Large title, max 40 characters | Yes |
| Historical Era | enum | Icon + era name | Yes |
| Country/Civilization | string | Text with flag icon | Yes |
| Rarity | enum | Colored badge + label | Yes |
| Type | enum | Icon + type name | Yes |
| Short Description | string | 1-2 sentences, max 100 chars | Yes |

### 1.2 Ownership Information

| Field | Type | Display Format | Required |
|-------|------|----------------|----------|
| Quantity Owned | integer | "Owned: X" with duplicate badge | Yes |
| Date Obtained | timestamp | "Acquired: [relative date]" | Yes |
| Acquisition Source | enum | "From: [source type]" | Yes |

**Source Types**:
- Mission Reward
- Capsule Open
- Event Reward
- Achievement Reward
- Daily Login
- Purchased
- Crafted (future)
- Gift/Transfer (future)

### 1.3 Display Layout

```
┌─────────────────────────────────────┐
│ [←]           DETAILS         [★]  │  ← Header with back + favorite
├─────────────────────────────────────┤
│                                     │
│         ┌─────────────┐             │
│         │             │             │
│         │   ARTIFACT  │             │  ← Large artifact image
│         │    IMAGE    │             │     with rarity glow border
│         │             │             │
│         └─────────────┘             │
│                                     │
│         [Rarity Badge]              │  ← Colored rarity indicator
│                                     │
│           ARTIFACT NAME             │  ← H1, max 40 chars
│         Ancient Mesopotamia          │  ← Era + country subtitle
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────┐  │
│  │  TYPE   │ │  ERA    │ │ RAR │  │  ← Quick info chips
│  │ Document│ │ Classical│ │ Epic │  │
│  └─────────┘ └─────────┘ └─────┘  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  "Short description of the         │  ← Description block
│   artifact, 1-2 sentences"         │     max 100 characters
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📜 HISTORICAL FACTS               │  ← Expandable section
│  ┌─────────────────────────────────┐│
│  │ • Real history fact             ││
│  │ • Historical importance         ││
│  │ • Interesting trivia             ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📊 STATS                           │  ← Power and level info
│  ┌─────────────────────────────────┐│
│  │ Power: 24      Level: 3/10     ││
│  │ Fragments: 45/100               ││
│  │ [████████░░] 45% to next level  ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📅 ACQUISITION INFO                │  ← Metadata section
│  ┌─────────────────────────────────┐│
│  │ Acquired: 3 days ago           ││
│  │ Source: Mission Reward          ││
│  │ Owned: x2                       ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [♡ Share]  [🏛 View in Museum]   │  ← Action buttons
│                                     │
│  [⬆️ Upgrade]  [⚗️ Fuse]  [💎]   │  ← Future action buttons
│        (Future compatibility)        │     initially disabled
│                                     │
└─────────────────────────────────────┘
```

---

## 2. Rarity Visualization

Each rarity tier has a distinct visual identity following the dark theme.

### 2.1 Common

**Color**: Gray (`#9CA3AF`)

**Visual Treatment**:
- Card border: 1px solid rgba(156, 163, 175, 0.2)
- No glow effects
- Static appearance
- Badge: Gray circle with "C" or subtle gray badge

**CSS**:
```css
.rarity-common {
  --rarity-color: #9CA3AF;
  --rarity-glow: none;
  border: 1px solid rgba(156, 163, 175, 0.2);
}
```

### 2.2 Rare

**Color**: Blue (`#3B82F6`)

**Visual Treatment**:
- Card border: 1px solid rgba(59, 130, 246, 0.3)
- Subtle shimmer animation on border
- Soft blue glow (10px spread)
- Badge: Blue shield icon

**CSS**:
```css
.rarity-rare {
  --rarity-color: #3B82F6;
  --rarity-glow: rgba(59, 130, 246, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
  animation: rareShimmer 3s ease-in-out infinite;
}

@keyframes rareShimmer {
  0%, 100% { border-color: rgba(59, 130, 246, 0.3); }
  50% { border-color: rgba(59, 130, 246, 0.5); }
}
```

### 2.3 Epic

**Color**: Purple (`#8B5CF6`)

**Visual Treatment**:
- Card border: 1px solid rgba(168, 85, 247, 0.4)
- Pulsing purple aura (2s cycle)
- Particle sparkles on hover
- Badge: Purple diamond icon

**CSS**:
```css
.rarity-epic {
  --rarity-color: #8B5CF6;
  --rarity-glow: rgba(168, 85, 247, 0.4);
  border: 1px solid rgba(168, 85, 247, 0.4);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
  animation: epicPulse 2s ease-in-out infinite;
}

@keyframes epicPulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
  }
  50% { 
    box-shadow: 0 0 35px rgba(168, 85, 247, 0.5);
  }
}
```

### 2.4 Legendary

**Color**: Gold (`#F97316`)

**Visual Treatment**:
- Card border: 2px solid rgba(249, 115, 22, 0.5)
- Animated gradient border (slow rotation)
- Flame-like particle effects
- Strong golden glow (30px spread)
- Badge: Gold star icon

**CSS**:
```css
.rarity-legendary {
  --rarity-color: #F97316;
  --rarity-glow: rgba(249, 115, 22, 0.4);
  border: 2px solid rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.4);
  animation: legendaryGlow 1.5s ease-in-out infinite;
  background: linear-gradient(
    135deg, 
    rgba(249, 115, 22, 0.05), 
    transparent, 
    rgba(249, 115, 22, 0.05)
  );
}

@keyframes legendaryGlow {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(249, 115, 22, 0.4);
  }
  50% { 
    box-shadow: 0 0 50px rgba(249, 115, 22, 0.6);
  }
}
```

### 2.5 Mythic

**Color**: Rainbow prismatic (`#EC4899`, `#A855F7`, `#3B82F6`)

**Visual Treatment**:
- Border: 2px solid with animated rainbow gradient
- Prismatic glow effect (40px spread)
- 3D rotation animation on artifact image
- Unique particle system with rainbow colors
- Confetti burst on page open
- Badge: Rainbow diamond/star icon

**CSS**:
```css
.rarity-mythic {
  --rarity-color: #EC4899;
  border: 2px solid transparent;
  border-image: linear-gradient(
    45deg, 
    #EC4899, #A855F7, #3B82F6, #00D9FF, #00FFE5, #FFD700
  ) 1;
  box-shadow: 0 0 40px rgba(236, 72, 153, 0.4);
  animation: mythicRainbow 3s ease-in-out infinite;
}

@keyframes mythicRainbow {
  0% { 
    filter: hue-rotate(0deg);
    box-shadow: 0 0 40px rgba(236, 72, 153, 0.4);
  }
  33% { 
    filter: hue-rotate(120deg);
    box-shadow: 0 0 50px rgba(168, 85, 247, 0.5);
  }
  66% { 
    filter: hue-rotate(240deg);
    box-shadow: 0 0 45px rgba(59, 130, 246, 0.4);
  }
  100% { 
    filter: hue-rotate(360deg);
    box-shadow: 0 0 40px rgba(236, 72, 153, 0.4);
  }
}
```

### 2.6 Rarity Badge Component

```css
.rarity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rarity-badge.common {
  background: rgba(156, 163, 175, 0.2);
  color: #9CA3AF;
}

.rarity-badge.rare {
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

.rarity-badge.epic {
  background: rgba(168, 85, 247, 0.2);
  color: #8B5CF6;
}

.rarity-badge.legendary {
  background: rgba(249, 115, 22, 0.2);
  color: #F97316;
}

.rarity-badge.mythic {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2));
  color: #EC4899;
  animation: mythicBadgeShimmer 2s linear infinite;
}
```

---

## 3. Historical Education Block

Every artifact detail page includes an educational section with real historical information.

### 3.1 Content Structure

```yaml
education_block:
  section_title: "HISTORICAL FACTS"
  expandable: true
  default_expanded: false
  
  content_types:
    - type: "fact"
      icon: "📜"
      label: "Historical Fact"
      
    - type: "importance"
      icon: "⭐"
      label: "Why It Matters"
      
    - type: "trivia"
      icon: "💡"
      label: "Did You Know?"
```

### 3.2 Content Guidelines

**Real History Facts**:
- Must be historically accurate
- Based on verifiable sources
- 2-4 bullet points per artifact
- Include date/location when relevant

**Example**:
```
📜 Historical Fact
• The Nebra Sky Disk is a Bronze Age artifact dating to approximately 1600 BCE
• It was discovered in 1999 near Nebra, Germany
• The disk is considered one of the oldest known representations of the cosmos
```

**Importance**:
- Explain significance to history
- Cultural impact description
- Influence on human development

**Example**:
```
⭐ Why It Matters
• Represents advanced Bronze Age astronomical knowledge
• Shows early human understanding of celestial events
• Evidence of sophisticated navigation and calendar systems
```

**Interesting Trivia**:
- Lesser-known facts
- Fascinating anecdotes
- Connection to modern world

**Example**:
```
💡 Did You Know?
• The Nebra Sky Disk was originally buried with other bronze items as part of a ritual
• It was found by treasure hunters using metal detectors, leading to its illegal excavation
• The disk was returned to a museum in 2002 after being stolen
```

### 3.3 Styling

```css
.education-block {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin: var(--space-4) 0;
}

.education-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.education-item:last-child {
  border-bottom: none;
}

.education-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.education-content {
  flex: 1;
}

.education-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.education-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}
```

---

## 4. Action Buttons

### 4.1 Primary Actions

**Add to Favorites / Remove from Favorites**

| State | Button Text | Icon | Style |
|-------|------------|------|-------|
| Not Favorite | "Add to Favorites" | ♡ (outline) | btn-secondary |
| Is Favorite | "Remove from Favorites" | ♥ (filled) | btn-favorite |

```css
.btn-favorite {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--premium);
  color: var(--premium);
}

.btn-favorite.active {
  background: rgba(255, 215, 0, 0.2);
}

.btn-favorite.active::before {
  content: '♥';
  color: var(--premium);
}
```

**Share Artifact**

| Property | Value |
|----------|-------|
| Button Text | "Share" |
| Icon | Share icon |
| Style | btn-secondary |

**Behavior**:
- Opens native share sheet
- Generates shareable artifact card image
- Includes artifact name, rarity, image
- Option to include player name

### 4.2 Secondary Actions

**View in Museum**

| Property | Value |
|----------|-------|
| Button Text | "View in Museum" |
| Icon | Museum building icon |
| Style | btn-ghost |
| Navigation | Opens museum view with artifact highlighted |

### 4.3 Future Action Buttons (Initially Disabled)

These buttons are visible but disabled at launch, supporting future features:

| Button | Icon | Disabled Reason | Future Purpose |
|--------|------|-----------------|----------------|
| Upgrade | ⬆️ | "Coming Soon" | Increase artifact level |
| Fuse | ⚗️ | "Coming Soon" | Combine for higher rarity |
| NFT | 💎 | "Coming Soon" | Convert to NFT (future) |
| Sell | 💰 | "Coming Soon" | List on marketplace |

```css
.btn-future {
  opacity: 0.5;
  cursor: not-allowed;
  position: relative;
}

.btn-future::after {
  content: '🔒';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 12px;
}
```

### 4.4 Button Layout

```css
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-4);
}

.action-buttons .btn {
  flex: 1;
  min-width: 140px;
}

.action-buttons.future {
  border-top: 1px dashed var(--text-muted);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
}

.action-buttons.future .btn {
  min-width: 80px;
  opacity: 0.5;
}
```

---

## 5. Future Compatibility

The artifact detail page is designed to support future features without redesign.

### 5.1 Feature Flag System

```javascript
const artifactFeatures = {
  upgrade: {
    enabled: false,
    unlockCondition: 'player_level >= 10',
    fallbackUI: 'disabled_button'
  },
  fusion: {
    enabled: false,
    unlockCondition: 'player_level >= 20',
    fallbackUI: 'disabled_button'
  },
  nftConversion: {
    enabled: false,
    unlockCondition: 'wallet_connected',
    fallbackUI: 'info_banner'
  },
  marketplace: {
    enabled: false,
    unlockCondition: 'nft_converted == true',
    fallbackUI: 'disabled_button'
  },
  evolution: {
    enabled: false,
    unlockCondition: 'player_level >= 30',
    fallbackUI: 'disabled_button'
  }
};
```

### 5.2 Upgrade System (Phase 2)

**UI Addition**:
- Upgrade button becomes active
- New "Upgrade Materials" section appears
- Shows required fragments + special materials
- Progress bar for upgrade readiness

**Data Extension**:
```json
{
  "upgradePath": {
    "currentLevel": 3,
    "maxLevel": 10,
    "materialsRequired": {
      "fragments": 100,
      "premiumMaterial": 5
    },
    "materialSource": "duplicate_artifacts"
  }
}
```

### 5.3 Fusion System (Phase 3)

**UI Addition**:
- Fuse button activates
- "Fusion Gallery" tab appears
- Shows potential fusion results
- Drag-and-drop interface for fusion

**Data Extension**:
```json
{
  "fusionRecipe": {
    "enabled": true,
    "input": [
      { "artifactId": "current", "count": 3 }
    ],
    "output": {
      "rarity": "next_tier",
      "type": "same"
    },
    "successRate": 0.8,
    "materialsRequired": {
      "fusionDust": 50
    }
  }
}
```

### 5.4 NFT Conversion (Phase 3)

**UI Addition**:
- NFT button becomes active
- "Convert to NFT" modal
- Wallet connection prompt
- Blockchain confirmation flow

**Data Extension**:
```json
{
  "nftStatus": {
    "converted": false,
    "tokenId": null,
    "blockchain": "polygon",
    "conversionDate": null
  }
}
```

### 5.5 Marketplace Listing (Phase 4)

**UI Addition**:
- Sell button becomes active
- Price input field
- Duration selector
- Listing preview

**Data Extension**:
```json
{
  "marketplace": {
    "listed": false,
    "price": null,
    "currency": "MATIC",
    "listingDate": null,
    "expirationDate": null
  }
}
```

### 5.6 Artifact Evolution (Phase 4)

**UI Addition**:
- Evolution button appears
- Evolution preview modal
- Shows before/after comparison
- Special animation reveal

**Data Extension**:
```json
{
  "evolution": {
    "evolved": false,
    "evolutionStage": 1,
    "maxStages": 3,
    "nextEvolution": {
      "levelRequired": 10,
      "materials": ["eraCrystal", "temporalEssence"],
      "resultId": "artifact_evolved_v2"
    }
  }
}
```

---

## 6. Visual Style Requirements

Following the premium dark style from ui-style.md:

### 6.1 Background Colors

```css
.artifact-details {
  background: var(--bg-primary);      /* #0A0E17 */
  min-height: 100vh;
}

.detail-card {
  background: var(--bg-card);         /* #131B2E */
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 217, 255, 0.1);
}

.section {
  background: var(--bg-secondary);    /* #0F1525 */
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
```

### 6.2 Typography

```css
.artifact-name {
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);         /* #FFFFFF */
}

.artifact-subtitle {
  font-size: 16px;
  color: var(--text-secondary);       /* #B8C5D6 */
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);          /* #6B7A8F */
}

.body-text {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
}
```

### 6.3 Spacing System

```css
.detail-page {
  padding: var(--space-4);
  padding-bottom: calc(72px + var(--space-4) + env(safe-area-inset-bottom));
}

.section {
  margin-bottom: var(--space-4);
}

.section-gap {
  margin: var(--space-6) 0;
}
```

### 6.4 Glow Effects

```css
.rarity-glow {
  box-shadow: 0 0 20px var(--rarity-glow, var(--primary-glow));
}

.image-container {
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-xl);
}
```

---

## 7. Performance Requirements

### 7.1 Load Time Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Initial paint | < 200ms | 500ms |
| Interactive | < 500ms | 1000ms |
| Image load | < 300ms | 800ms |
| Full render | < 800ms | 1500ms |

### 7.2 Optimization Strategies

**Image Optimization**:
```javascript
// Use WebP with fallback
const imageUrl = artifact.image.replace('.png', '.webp');

// Lazy load with blur placeholder
<img 
  src={artifact.image}
  loading="lazy"
  placeholder={<BlurPlaceholder />}
  alt={artifact.name}
/>

// Responsive images
<img
  srcSet={`${img}-sm.webp 400w, ${img}-md.webp 800w`}
  sizes="(max-width: 428px) 100vw, 50vw"
/>
```

**Content Prioritization**:
1. Critical: Image, name, rarity (above fold)
2. Important: Stats, description (immediate scroll)
3. Secondary: Historical facts (lazy load)
4. Optional: Share, museum links (defer)

**Caching**:
```javascript
// Cache artifact details
localStorage.setItem(`artifact_${id}`, JSON.stringify(artifact));

// Use cache-first strategy
const cached = localStorage.getItem(`artifact_${id}`);
if (cached && !isStale(cached)) {
  return JSON.parse(cached);
}
```

### 7.3 Bundle Optimization

- Code split artifact details into separate chunk
- Load historical facts on demand
- Defer future action button logic
- Use dynamic imports for heavy animations

---

## 8. Empty Image Fallback

### 8.1 Fallback Hierarchy

```css
/* 1. CSS Placeholder */
.artifact-image {
  background: linear-gradient(
    135deg,
    var(--bg-card),
    var(--bg-elevated)
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 2. Generic Icon */
.artifact-image::before {
  content: '🏺';
  font-size: 64px;
  opacity: 0.5;
}

/* 3. Error State */
.artifact-image.error {
  background: var(--bg-secondary);
  border: 2px dashed var(--text-muted);
}

.artifact-image.error::before {
  content: '🖼️';
}
```

### 8.2 JavaScript Fallback Logic

```javascript
function handleImageError(imgElement, artifact) {
  // Try fallback URL
  if (imgElement.src !== artifact.fallbackImage) {
    imgElement.src = artifact.fallbackImage;
    return;
  }
  
  // Use placeholder
  imgElement.style.display = 'none';
  const placeholder = document.createElement('div');
  placeholder.className = 'artifact-placeholder';
  placeholder.innerHTML = `
    <span class="placeholder-icon">${getPlaceholderIcon(artifact.type)}</span>
    <span class="placeholder-text">Image unavailable</span>
  `;
  imgElement.parentElement.appendChild(placeholder);
}

function getPlaceholderIcon(type) {
  const icons = {
    weapon: '⚔️',
    armor: '🛡️',
    document: '📜',
    relic: '🏺',
    scientific: '🔬',
    royal: '👑',
    military: '🎖️',
    cultural: '🎭'
  };
  return icons[type] || '🏺';
}
```

### 8.3 Placeholder Styling

```css
.artifact-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-8);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 2px dashed rgba(107, 122, 143, 0.3);
}

.placeholder-icon {
  font-size: 64px;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 12px;
  color: var(--text-muted);
}
```

---

## 9. Localization Support

### 9.1 Translation Keys

All user-facing text uses translation keys:

```json
{
  "artifact_details": {
    "title": "artifact_details.title",
    "owned": "artifact_details.owned",
    "acquired": "artifact_details.acquired",
    "source": "artifact_details.source",
    "actions": {
      "add_favorite": "artifact_details.actions.add_favorite",
      "remove_favorite": "artifact_details.actions.remove_favorite",
      "share": "artifact_details.actions.share",
      "view_museum": "artifact_details.actions.view_museum",
      "upgrade": "artifact_details.actions.upgrade",
      "fuse": "artifact_details.actions.fuse"
    },
    "sections": {
      "description": "artifact_details.sections.description",
      "history": "artifact_details.sections.history",
      "stats": "artifact_details.sections.stats",
      "acquisition": "artifact_details.sections.acquisition"
    },
    "education": {
      "fact": "artifact_details.education.fact",
      "importance": "artifact_details.education.importance",
      "trivia": "artifact_details.education.trivia"
    }
  }
}
```

### 9.2 Implementation

```javascript
// Translation function
function t(key, params = {}) {
  const translation = getTranslation(key, currentLocale);
  return interpolate(translation, params);
}

// Usage in components
<span>{t('artifact_details.owned', { count: artifact.count })}</span>
<h1>{t('artifact_details.title')}</h1>
```

### 9.3 RTL Support

```css
/* Base direction */
.artifact-details {
  direction: ltr;
}

/* RTL override */
[dir="rtl"] .artifact-details {
  direction: rtl;
}

/* Flip icons where appropriate */
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}
```

### 9.4 Locale-Specific Content

```javascript
// Historical facts vary by locale
const artifactData = {
  "clay_tablet": {
    "facts": {
      "en": [
        "Dating to approximately 2000 BCE",
        "Written in Sumerian cuneiform script"
      ],
      "ar": [
        "تاريخها إلى حوالي 2000 قبل الميلاد",
        "كتبت بالخط المسماري السومري"
      ],
      "zh": [
        "可追溯到公元前2000年左右",
        "用苏美尔楔形文字书写"
      ]
    }
  }
};
```

---

## 10. Accessibility

### 10.1 Mobile Screen Optimization

**Responsive Layout**:
```css
/* Mobile-first - 320px minimum */
.artifact-details {
  padding: var(--space-4);
}

/* Tablet - 768px+ */
@media (min-width: 768px) {
  .artifact-details {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .artifact-image {
    max-width: 400px;
  }
}

/* Desktop - 1024px+ */
@media (min-width: 1024px) {
  .artifact-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
}
```

**Touch-Friendly Targets**:
```css
/* Minimum 44x44px touch targets */
.btn,
.action-button,
.favorite-toggle {
  min-width: 44px;
  min-height: 44px;
  padding: var(--space-3) var(--space-4);
}

/* Adequate spacing between targets */
.action-buttons .btn {
  margin-bottom: var(--space-2);
}
```

### 10.2 Screen Reader Support

**Semantic HTML**:
```html
<article class="artifact-details" role="article" aria-labelledby="artifact-name">
  <header>
    <h1 id="artifact-name">{artifact.name}</h1>
    <p class="subtitle">{artifact.era} • {artifact.country}</p>
  </header>
  
  <figure>
    <img 
      src={artifact.image} 
      alt={getImageAlt(artifact)}
      loading="lazy"
    />
    <figcaption>
      <span class="rarity-badge" aria-label={`Rarity: ${artifact.rarity}`}>
        {artifact.rarity}
      </span>
    </figcaption>
  </figure>
  
  <section aria-labelledby="stats-title">
    <h2 id="stats-title">Stats</h2>
    <dl>
      <dt>Power</dt>
      <dd>{artifact.power}</dd>
      <dt>Level</dt>
      <dd>{artifact.level}</dd>
    </dl>
  </section>
</article>
```

**ARIA Labels**:
```html
<button 
  aria-label="Add to favorites"
  aria-pressed={artifact.isFavorite}
>
  <Icon name="star" aria-hidden="true" />
</button>

<div 
  role="progressbar" 
  aria-valuenow={45} 
  aria-valuemin={0} 
  aria-valuemax={100}
  aria-label="Fragment progress to next level"
>
```

### 10.3 Color Contrast

All text meets WCAG 2.1 AA requirements:

```css
/* Primary text on background - 15.8:1 ✓ */
.artifact-name {
  color: #FFFFFF;
  background: #0A0E17;
}

/* Secondary text on background - 7.2:1 ✓ */
.body-text {
  color: #B8C5D6;
}

/* Muted text on card - 3.2:1 ✓ */
.section-title {
  color: #6B7A8F;
}
```

### 10.4 Keyboard Navigation

```javascript
// Tab order for artifact details
const tabOrder = [
  'back-button',
  'favorite-toggle',
  'share_button',
  'museum_button',
  'upgrade_button', // Future
  'fuse_button',    // Future
  'nft_button'      // Future
];

// Arrow key navigation within related artifacts
function handleArrowNavigation(event, currentId, artifactIds) {
  const currentIndex = artifactIds.indexOf(currentId);
  
  switch(event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      navigateTo(artifactIds[currentIndex + 1] || artifactIds[0]);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      navigateTo(artifactIds[currentIndex - 1] || artifactIds[artifactIds.length - 1]);
      break;
  }
}
```

### 10.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations */
  .rarity-rare,
  .rarity-epic,
  .rarity-legendary,
  .rarity-mythic {
    animation: none;
  }
  
  /* Instant transitions */
  .btn,
  .card {
    transition: none;
  }
  
  /* Static glow */
  .rarity-glow {
    animation: none;
    box-shadow: 0 0 10px var(--rarity-glow);
  }
}
```

---

## 11. Data Schema

### 11.1 Artifact Details Response

```json
{
  "artifact": {
    "id": "string",
    "name": "string",
    "description": "string",
    "era": "enum",
    "country": "string",
    "rarity": "enum",
    "type": "enum",
    "image": "string",
    "fallbackImage": "string",
    "power": "number",
    "level": "number",
    "maxLevel": "number",
    "fragmentsOwned": "number",
    "fragmentsToNextLevel": "number"
  },
  "ownership": {
    "acquired": true,
    "acquiredAt": "timestamp",
    "count": "number",
    "isFavorite": "boolean",
    "source": "enum",
    "lastUsedAt": "timestamp | null"
  },
  "education": {
    "facts": ["string"],
    "importance": ["string"],
    "trivia": ["string"]
  },
  "future": {
    "upgrade": {
      "enabled": false,
      "materialsRequired": null
    },
    "fusion": {
      "enabled": false,
      "recipe": null
    },
    "nft": {
      "enabled": false,
      "status": null
    },
    "evolution": {
      "enabled": false,
      "stage": 0
    }
  },
  "metadata": {
    "localizedNames": {},
    "localizedDescriptions": {},
    "localizedFacts": {}
  }
}
```

---

## 12. Related Documents

- [Artifacts](./artifacts.md) - Main artifact collection system
- [Inventory System](./inventory-system.md) - Inventory management
- [Museum](./museum.md) - Museum display and progression
- [UI Style Guide](../.openhands/knowledge/ui-style.md) - Visual design system

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
