# Jolt Time — Rarity System

## Overview

The rarity system creates collection aspiration while ensuring players always feel progression. No unfair gacha mechanics—players know what they're working toward and can achieve goals through consistent gameplay.

**Core Principle**: Every pull should feel rewarding. Progression must be visible and achievable.

---

## Rarity Levels

### 1. Common (⭐)

**Color Palette:**
```
Primary:   #9CA3AF (Gray 400)
Secondary: #6B7280 (Gray 500)
Glow:      rgba(156, 163, 175, 0.3)
Background: rgba(156, 163, 175, 0.1)
```

**Visual Effects:**
- Simple solid outline
- No particle effects
- Subtle shadow
- Minimal animation (gentle float)

**Drop Rate Philosophy:**
- 50% of all drops
- Easy to collect
- Foundation of collection
- Guaranteed in every capsule

**Collection Experience:**
- First artifacts players collect
- Complete sets quickly
- Build sense of progress
- Learn game mechanics

**Example Artifacts:**
- Clay Tablet (Egypt)
- Amphora Vase (Greece)
- Roman Coin (Rome)
- Papyrus Scroll (Egypt)
- Discus (Greece)

**Power Level:** 8-15

---

### 2. Uncommon (⭐⭐)

**Color Palette:**
```
Primary:   #22C55E (Green 500)
Secondary: #16A34A (Green 600)
Glow:      rgba(34, 197, 94, 0.4)
Background: rgba(34, 197, 94, 0.1)
```

**Visual Effects:**
- Soft green glow
- Small particle sparkles on reveal
- Gentle pulsing aura
- Enhanced shadow depth

**Drop Rate Philosophy:**
- 25% of all drops
- Achievable within first week
- Notable but not rare
- Builds anticipation

**Collection Experience:**
- Start seeing uncommon regularly
- Collection percentage grows steadily
- Set completion becomes goal
- Satisfying progression

**Example Artifacts:**
- Ankh (Egypt)
- Cat Statue (Egypt)
- Bronze Shield (Greece)
- Spartan Helmet (Greece)
- Knight's Sword (Medieval)

**Power Level:** 14-20

---

### 3. Rare (⭐⭐⭐)

**Color Palette:**
```
Primary:   #3B82F6 (Blue 500)
Secondary: #2563EB (Blue 600)
Glow:      rgba(59, 130, 246, 0.4)
Background: rgba(59, 130, 246, 0.15)
Accent:    #60A5FA (Blue 400)
```

**Visual Effects:**
- Bright blue glow
- Animated particle stream
- Rarity banner animation
- Enhanced card border glow
- Occasional shimmer effect

**Drop Rate Philosophy:**
- 15% of all drops
- Takes effort to complete
- Milestone achievements
- Worth celebrating finds

**Collection Experience:**
- Each rare feels earned
- Partial set progress visible
- Clear goal-setting
- Social sharing encouraged

**Example Artifacts:**
- Pharaoh's Mask (Egypt)
- Obelisk Fragment (Egypt)
- Lyre Instrument (Greece)
- Thermopylae Arrowhead (Greece)
- Legion Shield (Rome)

**Power Level:** 20-28

---

### 4. Epic (⭐⭐⭐⭐)

**Color Palette:**
```
Primary:   #A855F7 (Purple 500)
Secondary: #9333EA (Purple 600)
Glow:      rgba(168, 85, 247, 0.5)
Background: rgba(168, 85, 247, 0.2)
Accent:    #C084FC (Purple 400)
Particle:  #E879F9 (Fuchsia 400)
```

**Visual Effects:**
- Deep purple aura
- Continuous particle emission
- Animated card reveal
- Swirling energy effect
- Custom rarity sound

**Drop Rate Philosophy:**
- 7% of all drops
- Significant milestone
- Collection showcase items
- Trade-worthy

**Collection Experience:**
- Exciting discovery moments
- Set completion feels major
- Social prestige
- Collection percentage highlight

**Example Artifacts:**
- Pharaoh's Death Mask (Egypt)
- Olive Wreath (Greece)
- Delphi Oracle Bowl (Greece)
- Triumphal Crown (Rome)
- Leonardo Sketch (Renaissance)

**Power Level:** 28-38

---

### 5. Legendary (⭐⭐⭐⭐⭐)

**Color Palette:**
```
Primary:   #F59E0B (Amber 500)
Secondary: #D97706 (Amber 600)
Glow:      rgba(245, 158, 11, 0.6)
Background: rgba(245, 158, 11, 0.25)
Accent:    #FBBF24 (Amber 400)
Particle:  #FCD34D (Amber 300)
Trail:     #FDE68A (Amber 200)
```

**Visual Effects:**
- Golden radiant glow
- Intense particle burst
- Full-screen reveal animation
- Flame-like energy wisps
- Premium sound design

**Drop Rate Philosophy:**
- 2.5% of all drops
- Truly special moments
- Collection crown jewels
- Worth sharing extensively

**Collection Experience:**
- Pure excitement
- Major achievement
- Profile showcase worthy
- Emotional response

**Example Artifacts:**
- Pompeii Bread (Rome)
- Praetorian Eagle (Rome)
- Leonardo Sketch (Renaissance)
- Apollo 11 Patch (Modern)
- First Computer Chip (Modern)

**Power Level:** 38-45

---

### 6. Mythic (⭐⭐⭐⭐⭐⭐)

**Color Palette:**
```
Primary:   #EC4899 (Pink 500)
Secondary: #DB2777 (Pink 600)
Glow:      rgba(236, 72, 153, 0.7)
Background: rgba(236, 72, 153, 0.3)
Accent:    #F472B6 (Pink 400)
Particle:  #F9A8D4 (Pink 200)
Rainbow:   Prismatic shimmer
```

**Visual Effects:**
- Prismatic rainbow glow
- Multi-colored particle cascade
- Screen-wide reveal
- Legendary sound + unique sting
- Persistent animated aura
- Rare encounter trigger

**Drop Rate Philosophy:**
- 0.5% of all drops
- Ultra-rare milestone
- Collection pinnacle
- Maximum prestige

**Collection Experience:**
- Unforgettable moment
- Community-worthy event
- Long-term goal
- Exclusive ownership

**Example Artifacts:**
- Chrono Fragment (Future Era)
- Unique era-defining items
- Special event rewards
- Achievement unlocks

**Power Level:** 45-50

---

## Visual Comparison Table

| Rarity | Color | Glow Intensity | Particles | Animation | Drop Rate |
|--------|-------|----------------|-----------|-----------|-----------|
| Common | Gray | None | None | Gentle float | 50% |
| Uncommon | Green | Soft | Sparkles | Subtle pulse | 25% |
| Rare | Blue | Moderate | Stream | Rarity banner | 15% |
| Epic | Purple | Strong | Emission | Swirling | 7% |
| Legendary | Gold | Intense | Burst | Flame wisps | 2.5% |
| Mythic | Rainbow | Maximum | Cascade | Prismatic | 0.5% |

---

## Card Design by Rarity

### Common Card
```css
.card-common {
  background: var(--bg-card);
  border: 1px solid rgba(156, 163, 175, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.card-common:hover {
  border-color: rgba(156, 163, 175, 0.4);
}
```

### Uncommon Card
```css
.card-uncommon {
  background: linear-gradient(
    135deg,
    var(--bg-card) 0%,
    rgba(34, 197, 94, 0.05) 100%
  );
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.1);
}
```

### Rare Card
```css
.card-rare {
  background: linear-gradient(
    135deg,
    var(--bg-card) 0%,
    rgba(59, 130, 246, 0.1) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: 
    0 0 15px rgba(59, 130, 246, 0.15),
    inset 0 0 20px rgba(59, 130, 246, 0.05);
  animation: rareShimmer 3s ease-in-out infinite;
}

@keyframes rareShimmer {
  0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.15); }
  50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.25); }
}
```

### Epic Card
```css
.card-epic {
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.1) 0%,
    var(--bg-card) 50%,
    rgba(168, 85, 247, 0.1) 100%
  );
  border: 1px solid rgba(168, 85, 247, 0.5);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: 
    0 0 20px rgba(168, 85, 247, 0.2),
    inset 0 0 30px rgba(168, 85, 247, 0.1);
  animation: epicPulse 2s ease-in-out infinite;
}

@keyframes epicPulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
    border-color: rgba(168, 85, 247, 0.5);
  }
  50% { 
    box-shadow: 0 0 35px rgba(168, 85, 247, 0.35);
    border-color: rgba(168, 85, 247, 0.7);
  }
}
```

### Legendary Card
```css
.card-legendary {
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.15) 0%,
    var(--bg-card) 30%,
    rgba(245, 158, 11, 0.15) 70%,
    var(--bg-card) 100%
  );
  border: 2px solid rgba(245, 158, 11, 0.6);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.3),
    0 0 60px rgba(245, 158, 11, 0.15),
    inset 0 0 40px rgba(245, 158, 11, 0.1);
  animation: legendaryGlow 1.5s ease-in-out infinite;
}

@keyframes legendaryGlow {
  0%, 100% { 
    box-shadow: 
      0 0 30px rgba(245, 158, 11, 0.3),
      0 0 60px rgba(245, 158, 11, 0.15);
  }
  50% { 
    box-shadow: 
      0 0 45px rgba(245, 158, 11, 0.45),
      0 0 80px rgba(245, 158, 11, 0.25);
  }
}
```

### Mythic Card
```css
.card-mythic {
  background: linear-gradient(
    45deg,
    rgba(236, 72, 153, 0.2) 0%,
    rgba(168, 85, 247, 0.2) 25%,
    rgba(59, 130, 246, 0.2) 50%,
    rgba(34, 197, 94, 0.2) 75%,
    rgba(236, 72, 153, 0.2) 100%
  );
  background-size: 400% 400%;
  border: 2px solid;
  border-image: linear-gradient(
    45deg,
    #EC4899, #A855F7, #3B82F6, #22C55E, #F59E0B, #EC4899
  ) 1;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: 
    0 0 40px rgba(236, 72, 153, 0.4),
    0 0 80px rgba(168, 85, 247, 0.2),
    inset 0 0 50px rgba(236, 72, 153, 0.15);
  animation: mythicRainbow 3s ease-in-out infinite, mythicPulse 1s ease-in-out infinite;
}

@keyframes mythicRainbow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes mythicPulse {
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.02);
    filter: brightness(1.1);
  }
}
```

---

## Reveal Animations

### Common Reveal
```
Duration: 0.5s
Effect: Fade in + gentle scale
Particles: None
Sound: Soft click
Emotion: Satisfaction
```

### Uncommon Reveal
```
Duration: 0.8s
Effect: Fade in + sparkle burst
Particles: 10-15 green sparkles
Sound: Chime
Emotion: Pleasant surprise
```

### Rare Reveal
```
Duration: 1.2s
Effect: Card flip + glow expansion
Particles: 20-30 blue particles rising
Sound: Achievement tone
Emotion: Excited
```

### Epic Reveal
```
Duration: 1.5s
Effect: Full animation sequence + screen flash
Particles: 40-50 purple particles + energy wisps
Sound: Epic sting
Emotion: Thrilling
```

### Legendary Reveal
```
Duration: 2.0s
Effect: Screen takeover + golden explosion
Particles: 80-100 gold particles + flame trails
Sound: Legendary sting + reverb
Emotion: Unforgettable
```

### Mythic Reveal
```
Duration: 2.5s
Effect: Full cinematic + rainbow cascade
Particles: 150+ multicolor particles + prismatic trails
Sound: Mythic sting + choir + reverb
Emotion: Once in a lifetime
```

---

## Collection UI by Rarity

### Rarity Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-common {
  background: rgba(156, 163, 175, 0.2);
  color: #9CA3AF;
}

.badge-uncommon {
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
}

.badge-rare {
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

.badge-epic {
  background: rgba(168, 85, 247, 0.2);
  color: #A855F7;
}

.badge-legendary {
  background: rgba(245, 158, 11, 0.2);
  color: #F59E0B;
  animation: legendaryBadgePulse 2s ease-in-out infinite;
}

.badge-mythic {
  background: linear-gradient(45deg, #EC4899, #A855F7, #3B82F6, #22C55E, #F59E0B);
  background-size: 400% 400%;
  color: white;
  animation: mythicBadgeRainbow 3s ease-in-out infinite;
}
```

### Collection Grid
```css
.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.collection-item {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Rarity border indicators */
.collection-item.common { border: 2px solid rgba(156, 163, 175, 0.3); }
.collection-item.uncommon { border: 2px solid rgba(34, 197, 94, 0.4); }
.collection-item.rare { border: 2px solid rgba(59, 130, 246, 0.5); }
.collection-item.epic { border: 2px solid rgba(168, 85, 247, 0.6); }
.collection-item.legendary { border: 2px solid rgba(245, 158, 11, 0.7); }
.collection-item.mythic { 
  border: 2px solid transparent;
  border-image: linear-gradient(45deg, #EC4899, #A855F7, #3B82F6) 1;
}
```

---

## Fairness Principles

### No Predatory Mechanics
- ❌ No loot boxes with hidden odds
- ❌ No gambling mechanics
- ❌ No fake rare appearances
- ❌ No FOMO-inducing limited pulls
- ❌ No manipulative scarcity

### Guaranteed Progression
- ✅ Every capsule contains at least Common
- ✅ Collection percentage always increases
- ✅ Set completion is achievable
- ✅ No duplicate protection needed (common enough)
- ✅ Pity system for Rare+ (every 10 capsules guarantees Rare)

### Transparency
- Drop rates displayed in UI
- Collection progress always visible
- Set completion percentages shown
- Expected vs actual clearly communicated

---

## Pity System

### Capsule Pity
```
Every 10 capsules guarantees:
- At least 1 Rare or higher
- Cumulative: 15% → 20% → 25% → ...

Every 50 capsules guarantees:
- At least 1 Epic or higher

Every 100 capsules guarantees:
- At least 1 Legendary
```

### Daily Capsules
```
Daily Free Capsule: Common guaranteed
Watch Ad Capsule: Common or Uncommon
Quest Completion Capsule: Common to Rare
Event Capsule: Rare to Epic
```

---

## Collection Value

| Rarity | Full Set Bonus | Time to Complete | Display Value |
|--------|---------------|-----------------|---------------|
| Common | +5% Energy | 1-2 weeks | Entry |
| Uncommon | +10% Energy | 2-4 weeks | Notable |
| Rare | +15% Energy + Frame | 1-2 months | Impressive |
| Epic | +20% Energy + Badge | 2-4 months | Prestigious |
| Legendary | +25% Energy + Title | 4-8 months | Elite |
| Mythic | Special Aura | 8+ months | Legendary |

---

## Premium Cosmetics

Each rarity unlocks cosmetic options:
- **Common**: Basic card frame
- **Uncommon**: Gradient card frame
- **Rare**: Animated card frame
- **Epic**: Particle card frame
- **Legendary**: Premium animated frame + glow
- **Mythic**: Ultimate rainbow frame + aura

---

*Every rarity tells a story of achievement. Every collection is a journey of discovery.*
