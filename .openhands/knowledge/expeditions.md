# Jolt Time — Expedition System

## Overview

The Expedition System is Jolt Time's signature historical exploration feature, allowing players to send teams on time-traveling missions to various historical eras. Expeditions combine waiting-based gameplay with meaningful rewards, educational content, and risk/reward decisions. This system reinforces Jolt Time's identity as an educational entertainment experience while providing engaging progression mechanics.

---

## 1. Expedition System Fundamentals

### Core Concept

Players assemble expedition teams and dispatch them to different historical eras. Each expedition takes real time to complete, offering players a reason to return while providing educational glimpses into history. Expeditions are completely optional but offer unique rewards and experiences not available through other gameplay activities.

### Expedition Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXPEDITION FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. SELECT ERA ────► 2. CHOOSE DURATION ────► 3. ASSEMBLE TEAM             │
│         │                    │                        │                      │
│         ▼                    ▼                        ▼                      │
│  Ancient Egypt         15 min / 1 hr           Auto-select heroes          │
│  Ancient Greece        4 hrs / 8 hrs          Or manual selection          │
│  Roman Empire          12 hrs (Special)                                      │
│  Viking Age                                                              │
│  Medieval Europe                                                          │
│  Renaissance                                                              │
│                                                                              │
│         │                    │                        │                      │
│         ▼                    ▼                        ▼                      │
│  4. CONFIRM COST ───► 5. DISPATCH ──────────► 6. WAIT FOR RETURN         │
│         │                    │                        │                      │
│         ▼                    ▼                        ▼                      │
│  Energy or Keys       Expedition begins      Timer counts down             │
│  displayed            Returns automatically   Player notified              │
│                                                                              │
│         │                                                                 │
│         ▼                                                                 │
│  7. CLAIM REWARDS                                                         │
│         │                                                                 │
│         ▼                                                                 │
│  Time Shards, Chrono Coins, Artifact Fragments, Rare Discoveries           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Team Composition

**Auto-Deploy Mode:**
- System automatically selects appropriate heroes based on era
- No player decision required
- Good for casual players

**Manual Selection Mode:**
- Players choose 1-3 heroes for the expedition
- Different heroes may provide bonuses (success rate, reward quality, rare discovery chance)
- Heroes return with the expedition (unavailable for battles during expedition)

---

## 2. Historical Eras for Expeditions

Each expedition destination is a historically authentic era with unique atmosphere, challenges, and rewards.

### Era Availability Matrix

| Era | Unlock Level | Duration Options | Special Focus |
|-----|-------------|------------------|---------------|
| Ancient Egypt | 1 | All | Pyramids, Pharaohs, Afterlife |
| Ancient Greece | 10 | All | Philosophy, Olympics, Democracy |
| Roman Empire | 25 | All | Engineering, Military, Empire |
| Viking Age | 35 | 1hr+ | Exploration, Raids, Mythology |
| Medieval Europe | 40 | 4hr+ | Castles, Knights, Crusades |
| Renaissance | 45 | 8hr+ | Art, Science, Discovery |

### Era Descriptions

**Ancient Egypt (Level 1+)**
- *Theme:* "The Empire of Eternity — Where death was just the beginning"
- *Time Period:* 3100 BCE - 30 BCE
- *Expedition Focus:* Tomb exploration, temple discovery, Nile trading posts
- *Unique Rewards:* Hieroglyphic fragments, papyrus scrolls, scarab talismans

**Ancient Greece (Level 10+)**
- *Theme:* "The Age of Reason — Where philosophy met mythology"
- *Time Period:* 800 BCE - 31 BCE
- *Expedition Focus:* Oracle consultations, Olympic training, philosophical schools
- *Unique Rewards:* Lyre fragments, amphora shards, Olympic laurels

**Roman Empire (Level 25+)**
- *Theme:* "The Eternal Legion — Where engineering shaped empire"
- *Time Period:* 27 BCE - 476 CE
- *Expedition Focus:* Colosseum events, road building, Senate intrigue
- *Unique Rewards:* Legion insignias, marble fragments, gladiator artifacts

**Viking Age (Level 35+)**
- *Theme:* "The North Sea Warriors — Where legends were forged"
- *Time Period:* 793 CE - 1066 CE
- *Expedition Focus:* Raid planning, longship voyages, sagas discovery
- *Unique Rewards:* Runic inscriptions, Norse artifacts, longship pieces

**Medieval Europe (Level 40+)**
- *Theme:* "The Age of Chivalry — Where crowns and crosses ruled"
- *Time Period:* 476 CE - 1400 CE
- *Expedition Focus:* Castle sieges, monastery libraries, tournament grounds
- *Unique Rewards:* Heraldic items, castle stones, manuscript fragments

**Renaissance (Level 45+)**
- *Theme:* "The Rebirth of Genius — Where art and science flourished"
- *Time Period:* 1400 CE - 1700 CE
- *Expedition Focus:* Artist workshops, inventor labs, explorer's dens
- *Unique Rewards:* Sketch fragments, instrument pieces, compass components

---

## 3. Expedition Energy and Keys

### Resource Requirements

Expeditions require either **Expedition Energy** or **Expedition Keys** to dispatch. This dual-resource system provides player choice and pacing flexibility.

| Resource | Type | Max Storage | Regeneration | Expedition Cost |
|----------|------|-------------|--------------|-----------------|
| Expedition Energy | Primary | 50 | +1 per 30 min | 15-40 energy |
| Expedition Keys | Premium | 3 | +1 per 8 hours | 1 key |

### Regeneration Rules

**Expedition Energy:**
- Regenerates automatically: 1 energy per 30 minutes
- Full regeneration from empty: 25 hours
- Maximum capacity: 50 energy
- Can be boosted via AdsGram (optional)

**Expedition Keys:**
- Regenerate automatically: 1 key per 8 hours
- Full regeneration from empty: 24 hours
- Maximum storage: 3 keys
- Cannot be purchased with real money
- More valuable than energy; better rewards

### Storage Limits

| Resource | Hard Cap | Overflow Behavior |
|----------|----------|------------------|
| Expedition Energy | 50 | No regeneration past cap |
| Expedition Keys | 3 | No regeneration past cap |

### Cooldown System

- After completing an expedition, no cooldown before starting another
- Players can have unlimited active expeditions (energy/key limited)
- 15-minute expeditions can be run in rapid succession
- 12-hour expeditions require strategic planning

### Resource Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🗺️ EXPEDITIONS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Resources:                                                      │
│  ⚡ Expedition Energy: 35/50  (next +1 in 12 min)              │
│  🗝️ Expedition Keys: 2/3  (next +1 in 4h 23m)                  │
│                                                                 │
│  [Use Energy]  [Use Key]  [Watch Ad: +10 Energy]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Expedition Duration Types

Expedition duration directly affects reward value and risk. Players choose based on their play schedule and risk tolerance.

### Duration Options

| Duration | Energy Cost | Key Required | Success Rate | Reward Multiplier | Typical Use |
|----------|-----------|-------------|-------------|-------------------|-------------|
| 15 minutes | 15 | No | 95% | 1.0x | Quick farming |
| 1 hour | 20 | No | 90% | 1.5x | Daily routine |
| 4 hours | 30 | No | 85% | 2.5x | Evening sessions |
| 8 hours | 35 | Yes | 80% | 4.0x | Overnight |
| 12 hours | 40 | Yes | 75% | 6.0x | Special expeditions |

### Reward Scaling Philosophy

- **Shorter expeditions (15 min, 1 hr):** Lower risk, lower reward, good for新手 learning the system
- **Medium expeditions (4 hrs):** Balanced risk/reward for regular players
- **Longer expeditions (8 hr, 12 hr):** Higher risk, significantly higher reward, strategic choice

### Duration-Specific Features

**15-Minute Expeditions:**
- Available from game start
- Perfect for testing an era
- Can run 4 per hour if energy permits
- Lower rare discovery chance

**1-Hour Expeditions:**
- Available from Level 5
- Standard "daily check-in" expedition
- Moderate rare discovery chance
- Good for maintaining engagement

**4-Hour Expeditions:**
- Available from Level 15
- "Evening" expedition for committed players
- Enhanced rare discovery chance
- Bonus museum knowledge fragments

**8-Hour Expeditions:**
- Requires Expedition Key
- "Sleep" expedition
- High rare discovery chance
- Special historical document rewards

**12-Hour Expeditions:**
- Requires Expedition Key
- "Weekend" or "event" expedition
- Maximum rare discovery chance
- Only available for advanced eras
- Guaranteed rare discovery attempt

---

## 5. Expedition Rewards

### Reward Categories

Expeditions provide a curated mix of rewards designed to enhance collection, progression, and player satisfaction.

### Base Rewards by Era

| Era | Time Shards | Chrono Coins | Artifact Fragments | Museum Points |
|-----|------------|--------------|-------------------|--------------|
| Ancient Egypt | 10-30 | 50-100 | 2-5 | 10-25 |
| Ancient Greece | 15-40 | 75-150 | 3-6 | 15-30 |
| Roman Empire | 20-50 | 100-200 | 4-8 | 20-40 |
| Viking Age | 25-60 | 125-250 | 5-10 | 25-50 |
| Medieval Europe | 30-75 | 150-300 | 6-12 | 30-60 |
| Renaissance | 40-100 | 200-400 | 8-15 | 40-80 |

### Reward Types

**Time Shards:**
- Primary progression currency
- Used for artifact upgrades and enhancements
- Earned in quantities based on expedition duration and success

**Chrono Coins:**
- Workhorse currency for packs and everyday purchases
- Stable reward across all expedition types
- Higher quantities from longer expeditions

**Artifact Fragments:**
- Collection-building materials
- Specific to the expedition era
- Used to craft era-specific artifacts

**Museum Points:**
- Contribute to museum completion tracking
- Unlock museum displays and knowledge entries
- Educational reward reinforcing historical focus

### Cosmetic and Special Rewards

**Artifact Skins:**
- Visual variants for collected artifacts
- Earned from rare discoveries
- Purely cosmetic, no gameplay advantage

**Expedition Frames:**
- Profile frames based on completed expeditions
- "Egypt Explorer" frame for 10+ Egypt expeditions
- Stack for collection pride

**Era Titles:**
- Unlockable titles for expedition mastery
- "Tomb Raider" for Egypt
- "Olympic Champion" for Greece
- "Legion Veteran" for Rome

**Historical Documents:**
- Unlockable lore entries
- Provide deeper historical context
- Contribute to collection completion

### Event-Specific Rewards

During seasonal events, expeditions may offer:
- **Event Tokens:** Limited-time currency for event content
- **Event Cosmetics:** Themed profile items
- **Exclusive Fragments:** Event-specific artifact pieces

---

## 6. Rare Discoveries

Rare discoveries are special rewards that make expeditions exciting and memorable. They are rare enough to feel special but frequent enough to maintain engagement.

### Rare Discovery Categories

**Legendary Artifacts (1-2% chance)**
- Full legendary artifact (not fragments)
- Cannot be obtained through any other means
- Includes unique backstory and museum entry

**Hidden Stories (3-5% chance)**
- Unlockable historical narratives
- Written in engaging, educational style
- Reveal secrets of the era

**Historical Documents (5-8% chance)**
- Facsimiles of real historical documents
- Caesar's Gallic Wars passage
- Da Vinci notebook sketches
- Viking runestone inscriptions

**Secret Collections (8-12% chance)**
- Unlock new artifact collection sets
- Only discoverable through expeditions
- Completing sets provides bonus rewards

### Rare Discovery Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ✨ RARE DISCOVERY!                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Your Viking expedition returned with:                           │
│                                                                 │
│  📜 "The Saga of Ragnar"                                         │
│     A hidden story from the Viking Age                          │
│                                                                 │
│  "In the cold halls of Denmark, a warrior named                  │
│   Ragnar gathered his shield-maidens and sons..."               │
│                                                                 │
│  [Read Full Story]  [Add to Collection]  [Share]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Rare Discovery Balance

**Philosophy: Exciting but Not Required**

- Rare discoveries enhance the experience but are not necessary for progression
- No rare discovery is strictly better than artifacts from other sources
- Historical documents and stories provide prestige and educational value
- Collectionists will treasure rare discoveries; casual players will appreciate them

**Drop Rate Calculations:**

| Discovery Type | Base Chance | 8hr+ Bonus | Key Expedition Bonus |
|---------------|-------------|-------------|---------------------|
| Legendary Artifact | 1% | +0.5% | +0.5% |
| Hidden Story | 3% | +2% | +1% |
| Historical Document | 5% | +3% | +2% |
| Secret Collection | 8% | +4% | +3% |

---

## 7. Risk System

The risk system adds decision-making depth to expeditions. Players can choose riskier expeditions for higher rewards or play conservatively.

### Risk Mechanics

**Standard Expedition:**
- Guaranteed rewards (base tier)
- No failure risk
- Available to all players

**Risky Expedition:**
- +50% reward potential
- 10-25% failure risk (lose the expedition, keep fragments)
- Available for 4hr+ expeditions

**Perilous Expedition:**
- +100% reward potential
- 25-40% failure risk
- Only available for 8hr+ expeditions
- Requires confirmation dialog

### Risk Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🗺️ EXPEDITION TO: Ancient Egypt                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Duration: 4 hours                                               │
│  Cost: 30 Expedition Energy                                      │
│                                                                 │
│  Risk Level:                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │  STANDARD   │  │    RISKY    │  │  PERILOUS   │               │
│  │    ✓        │  │    ⚠️       │  │    💀       │               │
│  │  100%       │  │  150%       │  │  200%       │               │
│  │  rewards    │  │  rewards    │  │  rewards    │               │
│  │  No risk   │  │  15% fail   │  │  30% fail   │               │
│  │             │  │             │  │             │               │
│  │ [SELECT]    │  │ [SELECT]    │  │ [SELECT]    │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Failure Consequences

**On Expedition Failure:**
- Energy/Key is NOT consumed (refunded)
- No rewards received
- Hero team returns safely
- Success rate calculated at start; no mid-expedition changes
- Failure is pre-determined, not random during wait

**Failure Rate Display:**
- Clearly shown before starting
- Based on expedition type, era, and player level
- No surprise failures

### Balance Philosophy

**Fair Risk/Reward:**
- Risk and reward are directly proportional
- Casual players can succeed with standard expeditions
- Dedicated players can maximize rewards with risky expeditions
- Failure doesn't punish harshly; retry is always available

**No Excessive Risk:**
- Maximum failure chance is 40%
- Rewards never exceed 3x standard expedition
- No permanent consequences for failure
- No content locked behind risky expeditions

---

## 8. Expedition Levels

Expeditions are gated by player progression to ensure appropriate challenge and reward scaling.

### Level Requirements

| Expedition Era | Min Level | Recommended Power | Unlock Condition |
|---------------|-----------|------------------|------------------|
| Ancient Egypt | 1 | 100 | Tutorial completion |
| Ancient Greece | 10 | 500 | Complete 30% Egypt collection |
| Roman Empire | 25 | 1500 | Complete 30% Greece collection |
| Viking Age | 35 | 3000 | Complete 30% Rome collection |
| Medieval Europe | 40 | 4500 | Complete 30% Viking collection |
| Renaissance | 45 | 6000 | Complete 30% Medieval collection |

### Reward Scaling by Player Level

| Player Level | Base Rewards | Era Bonus | Rare Discovery Rate |
|-------------|-------------|-----------|---------------------|
| 1-10 | 100% | +0% | 5% |
| 11-20 | 110% | +10% | 6% |
| 21-30 | 125% | +15% | 7% |
| 31-40 | 140% | +20% | 8% |
| 41-50 | 160% | +25% | 10% |
| 51+ | 180% | +30% | 12% |

### New Era Unlocks

New eras unlock through gameplay progression:
- Complete collection milestones in current eras
- Reach specific player levels
- Achieve expedition experience milestones

**Era Unlock Events:**
- Completing Ancient Egypt collection at 100% unlocks Ancient Greece
- Each era completion provides clear path to next
- No era is permanently locked; all are achievable through gameplay

---

## 9. Expedition Statistics

Players can track their expedition history and achievements through dedicated statistics.

### Statistics Tracked

| Statistic | Description | Display |
|-----------|-------------|---------|
| Total Expeditions | Lifetime expedition count | Number |
| Completed | Successfully finished expeditions | Number + percentage |
| Success Rate | Percentage of successful expeditions | Percentage |
| Current Streak | Consecutive successful expeditions | Number |
| Best Streak | Longest success streak | Number |
| Favorite Era | Most-visited era | Era name |
| Rare Discoveries | Total rare discoveries | Number + list |
| Legendary Finds | Legendary artifact discoveries | Number |
| Hours Invested | Total time in expeditions | Hours |
| Favorite Duration | Most-used expedition duration | Duration |

### Statistics Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 EXPEDITION STATISTICS                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Lifetime: 247 expeditions                                      │
│  Success Rate: 89.5%  (221 completed, 26 failed)                │
│  Current Streak: 12 🏆  |  Best: 34                             │
│                                                                 │
│  Favorite Era: Ancient Egypt (89 expeditions)                   │
│  Favorite Duration: 4 hours (112 expeditions)                   │
│                                                                 │
│  Rare Discoveries: 31                                           │
│  • Legendary Artifacts: 2                                        │
│  • Hidden Stories: 8                                             │
│  • Historical Documents: 12                                       │
│  • Secret Collections: 9                                         │
│                                                                 │
│  Time Invested: 892 hours                                       │
│                                                                 │
│  [View History]  [Achievements]  [Share Stats]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Expedition History

Players can view detailed history of past expeditions:
- Date and time
- Destination era
- Duration type
- Risk level
- Rewards received
- Rare discoveries (if any)

---

## 10. Historical Education Philosophy

Each expedition is designed to teach players about history while they play. Educational content is integrated naturally, never feeling like a lecture.

### Educational Integration

**Pre-Expedition Briefing:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ EXPEDITION BRIEFING: Ancient Egypt                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Destination: Thebes, 1323 BCE                                  │
│                                                                 │
│  "In this era, Pharaoh Ramesses IX ruled over a kingdom         │
│   preparing for eternity. The Valley of the Kings holds         │
│   secrets that will reshape our understanding of death..."     │
│                                                                 │
│  Historical Focus:                                              │
│  • Egyptian burial practices                                    │
│  • The role of scribes in ancient Egypt                         │
│  • Construction techniques of the pyramids                      │
│                                                                 │
│  [Continue to Expedition]                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Post-Expedition Learning:**
```
┌─────────────────────────────────────────────────────────────────┐
│  📚 EXPEDITION COMPLETE: Ancient Egypt                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  You discovered an authentic scribe’s palette!                  │
│                                                                 │
│  HISTORICAL NOTE:                                               │
│  Scribes were the educated elite of ancient Egypt. They         │
│  used palettes like this to grind pigments for writing.        │
│  Only 1% of Egyptians could read and write — making             │
│  scribes essential to running the empire.                       │
│                                                                 │
│  [Read More About Egyptian Scribes]                             │
│  [View in Museum]                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Educational Content Types

**Historical Context:**
- Era-specific background information
- Real historical events and figures
- Cultural practices and beliefs

**Artifact Knowledge:**
- How artifacts were used historically
- Significance in their time period
- Archaeological discovery stories

**Hidden Stories:**
- Fictional but historically-inspired narratives
- Day-in-the-life perspectives
- What-if scenarios based on real events

### Museum Integration

- Every rare discovery adds to museum knowledge
- Museum entries expand with expedition discoveries
- Completing expedition sets unlocks museum wings
- Educational content remains accessible in museum

### Respectful Representation

**Cultural Sensitivity:**
- All eras portrayed with historical accuracy
- No stereotypes or caricatures
- Indigenous perspectives included where appropriate
- Consultation with cultural experts for sensitive content

---

## 11. Telegram Bot Notifications

Telegram notifications for expeditions provide timely, valuable updates without becoming spam.

### Notification Types

**Expedition Completion:**
```
🗺️ Your expedition has returned!

Ancient Egypt • 4 hours • Risk: Standard

Rewards:
• 45 Time Shards
• 120 Chrono Coins
• 3 Artifact Fragments

[Claim Rewards] → Jolt Time
```

**Rare Discovery Found:**
```
✨ RARE DISCOVERY!

Your Viking expedition uncovered:
"Thorstein's Saga" — A hidden story

"In the winter of 793 CE, the raid on Lindisfarne
changed everything..."

[Read Story] [Share] → Jolt Time
```

**Era Unlocked:**
```
🏛️ NEW ERA UNLOCKED!

You've unlocked: Viking Age

New expeditions now available:
• 1 hour: 20 energy
• 4 hours: 30 energy
• 8 hours: Key required

[Start Exploring] → Jolt Time
```

**Key Regenerated:**
```
🗝️ Expedition Key Ready!

Your 2nd key has regenerated.
Use keys for the best expedition rewards:
• Guaranteed rare discovery attempt
• +25% Time Shards
• +20% Chrono Coins

[Start Key Expedition] → Jolt Time
```

**Special Event Expedition:**
```
⚡ SPECIAL EVENT: Renaissance Festival!

For 48 hours only:
• Double rewards on all Renaissance expeditions
• Free upgrade to Risky expeditions
• Bonus Historical Documents

[Claim Event Bonus] → Jolt Time
```

### Notification Frequency Rules

| Notification | Max Per Day | Trigger |
|---------------|-------------|---------|
| Expedition Complete | 4 | Each completion |
| Rare Discovery | 2 | Each discovery |
| Era Unlock | 1 | New unlock |
| Key Ready | 3 | Each regeneration |
| Event Bonus | 2 | Event start/end |
| **Total Cap** | **4** | **Never exceeded** |

### User Controls

- Global expedition notifications toggle
- Separate controls for completion, discoveries, unlocks
- Quiet hours respected
- Frequency cap enforced server-side

### Anti-Spam Philosophy

- Notifications provide genuine value
- Never fear-based or manipulative
- Clear opt-out available
- Never more than 4 expedition notifications per day

---

## 12. AdsGram Integration

AdsGram remains the primary revenue system. Optional ad rewards enhance the expedition experience without becoming mandatory.

### Optional Ad Rewards for Expeditions

| Ad Reward | Effect | Daily Limit | Mandatory |
|-----------|--------|-------------|-----------|
| Energy Boost | +15 Expedition Energy | 3 ads | No |
| Key Boost | +1 Expedition Key | 1 ad | No |
| Speed Up | -50% next expedition time | 1 ad | No |
| Success Boost | +10% success rate | 1 ad | No |
| Rare Discovery Boost | +5% rare chance | 1 ad | No |
| Reward Bonus | +25% rewards | 2 ads | No |

### AdsGram Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ WATCH & EARN                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Your expedition to Rome departs in 4 hours.                   │
│  Watch a video to:                                              │
│                                                                 │
│  [Speed Up 50%]  [Boost Rewards +25%]  [+15 Energy]           │
│                                                                 │
│  Today: 2/5 ads watched                                         │
│                                                                 │
│  [WATCH VIDEO]                           [MAYBE LATER]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Balance Philosophy

- **Never Required:** Complete all expeditions without watching ads
- **Genuine Help:** Ads provide convenience, not power
- **Fair Value:** Rewards match ad viewing time
- **No Pressure:** Clear dismiss option, no countdown timers

---

## 13. Future Expansion Notes

These features are documented for future consideration. They are not currently planned or in development.

### Cooperative Expeditions

**Concept:** Players team up for shared expeditions
- 2-4 players coordinate
- Combined rewards distributed
- Team bonuses for rare discoveries
- Communication required

**Status:** Future consideration
**Priority:** Medium
**Challenges:** Matching, coordination, reward distribution

### Guild Expeditions

**Concept:** Guild-wide expedition events
- All guild members contribute
- Collective rewards unlock at milestones
- Guild-specific era unlocks
- Cooperative achievement tracking

**Status:** Future consideration
**Priority:** Medium
**Challenges:** Guild coordination, free-rider prevention

### World Events

**Concept:** Server-wide expedition events
- All players contribute to global goal
- World boss expeditions (historical threats)
- Community rewards for collective progress
- Time-limited special events

**Status:** Future consideration
**Priority:** Low
**Challenges:** Event balancing, server coordination

### Special Boss Expeditions

**Concept:** Legendary historical figures as expedition targets
- "Defeat" Genghis Khan's army
- "Stop" the eruption of Vesuvius
- "Witness" construction of Great Pyramid
- Epic rewards, unique challenges

**Status:** Future consideration
**Priority:** Low
**Challenges:** Historical sensitivity, gameplay integration

### Expedition Leaderboards

**Concept:** Competitive expedition rankings
- Most expeditions completed
- Fastest rare discoveries
- Era mastery rankings
- Weekly/monthly seasons

**Status:** Future consideration
**Priority:** Low
**Challenges:** Fairness, encouragement over competition

---

## 14. Connected Systems

### Expedition Integration

**Museum System:**
- Rare discoveries unlock museum entries
- Expedition artifacts displayed in era wings
- Museum knowledge enhanced by expedition history

**Artifact System:**
- Expedition fragments used for artifact crafting
- Expedition-exclusive artifact skins
- Collection progression through expeditions

**Quest System:**
- Expedition-specific daily/weekly quests
- "Complete 3 expeditions" type objectives
- Era-specific expedition achievements

**Achievement System:**
- Expedition milestone achievements
- Rare discovery count achievements
- Era completion achievements

**PvP Arena:**
- Expedition team heroes unavailable for battles
- Expedition success rate affects ranking title
- "Expedition Commander" achievement track

### Data Flow

```
Expeditions ←→ Energy System (energy consumption)
Expeditions ←→ Key System (key consumption)
Expeditions ←→ Artifact System (fragments, skins)
Expeditions ←→ Museum System (discoveries, knowledge)
Expeditions ←→ Quest System (objectives, rewards)
Expeditions ←→ Achievement System (milestones)
Expeditions ←→ Leaderboards (ranking, competition)
```

---

## 15. Technical Implementation Notes

### Database Schema

| Table | Purpose |
|-------|---------|
| `player_expeditions` | Active expedition records |
| `expedition_history` | Completed expedition records |
| `expedition_stats` | Aggregated player statistics |
| `rare_discoveries` | Unlocked rare discovery records |

### Expedition State Machine

```
IDLE → DISPATCHING → ACTIVE → COMPLETING → CLAIMED
                ↓
              FAILED (if risky expedition failed)
```

### Reward Calculation

```javascript
// Server-side reward calculation
function calculateRewards(expedition, player) {
  const baseRewards = expedition.era.baseRewards;
  const durationMultiplier = expedition.duration.multiplier;
  const riskMultiplier = expedition.risk === 'risky' ? 1.5 : 
                         expedition.risk === 'perilous' ? 2.0 : 1.0;
  const levelBonus = player.getLevelBonus();
  
  const finalMultiplier = durationMultiplier * riskMultiplier * levelBonus;
  
  return {
    timeShards: Math.floor(baseRewards.timeShards * finalMultiplier),
    chronoCoins: Math.floor(baseRewards.chronoCoins * finalMultiplier),
    fragments: Math.floor(baseRewards.fragments * finalMultiplier),
    museumPoints: Math.floor(baseRewards.museumPoints * finalMultiplier)
  };
}
```

---

## 16. Balance Summary

### Resource Economics

| Expedition | Cost | Time | Base Rewards | Rewards/Hour |
|------------|------|------|--------------|--------------|
| 15 min | 15 energy | 0.25 hr | 25 shards | 100 |
| 1 hr | 20 energy | 1 hr | 40 shards | 40 |
| 4 hr | 30 energy | 4 hr | 100 shards | 25 |
| 8 hr | 1 key | 8 hr | 160 shards | 20 |
| 12 hr | 1 key | 12 hr | 240 shards | 20 |

### Risk/Reward Balance

| Risk Level | Reward Multiplier | Failure Chance | Expected Value |
|-------------|-------------------|----------------|----------------|
| Standard | 1.0x | 0% | 1.0x |
| Risky | 1.5x | 15% | 1.275x |
| Perilous | 2.0x | 30% | 1.4x |

### Progression Pacing

- Players can complete 4-6 expeditions per day
- Each era takes 2-3 weeks of regular play to fully explore
- Rare discoveries average 1 per 10-15 expeditions
- Legendary artifacts average 1 per 100 expeditions

---

*Every expedition is a journey through time. Every discovery is a lesson in history.*

---

*Document Version: 1.0*  
*Last Updated: 2025-01-23*
