# Jolt Time — Currency System

## Overview

Jolt Time uses a carefully balanced 4-currency system designed to support long-term economy health while maintaining fair play. **AdsGram remains the primary revenue source** for the project.

## Currency Design Principles

1. **No Pay-to-Win** — Currencies cannot purchase power
2. **Clear Purpose** — Each currency has distinct use
3. **Earning vs Spending** — Balance between acquisition and expenditure
4. **Long-term Sustainability** — Currency sinks prevent inflation
5. **Fair Distribution** — Free players can acquire everything

---

## 1. Time Energy

**Type:** Common Resource (Primary)

### Description
Time Energy is the core resource that powers all gameplay. It represents the player's temporal capacity and regenerates naturally over time.

### Mechanics
```yaml
time_energy:
  max_capacity: 100
  regen_rate: "1 per 5 minutes"
  regen_time_hours: "8.3 hours to full"
  
  spending:
    mission_entry: 5-20 (based on mission)
    capsule_opening: 10 (common), 25 (rare)
    event_entry: 0 (free events), 50 (special)
    
  earning:
    mission_complete: 10-50 (based on mission)
    daily_login: 20
    achievement: 25-100
    friend_gift: 10
    daily_quest: 15
```

### Acquisition Sources
| Source | Amount | Frequency |
|--------|--------|-----------|
| Passive Regen | +1 | Every 5 minutes |
| Daily Login | +20 | Once per day |
| Mission Complete | +10-50 | Per mission |
| Daily Quest | +15 | 3 per day |
| Achievement | +25-100 | One-time |
| Friend Gift | +10 | Unlimited |
| Streak Bonus | +5-25 | Daily |

### Rules
- **Cannot be purchased** with real money
- **Cannot be transferred** between players
- **Cannot be converted** to other currencies
- **Never expires** — saved indefinitely

### Visual Display
- Cyan (#00D9FF) energy bar
- Pulsing glow when full
- Hourglass icon
- Regeneration timer when not full

---

## 2. Chrono Dust

**Type:** Upgrade Resource (Common)

### Description
Chrono Dust is a secondary currency used to upgrade artifacts and enhance collection power. It's the primary sink for long-term progression.

### Mechanics
```yaml
chrono_dust:
  purpose: "Artifact upgrades"
  
  upgrade_costs:
    common_artifacts:
      level_1_to_2: 50
      level_2_to_3: 100
      level_3_to_4: 200
      level_4_to_5: 400
      max_level: 5
      
    uncommon_artifacts:
      level_1_to_2: 100
      level_2_to_3: 250
      level_3_to_4: 500
      level_4_to_5: 1000
      max_level: 5
      
    rare_artifacts:
      level_1_to_2: 250
      level_2_to_3: 500
      level_3_to_4: 1000
      level_4_to_5: 2000
      max_level: 5
      
    legendary_artifacts:
      level_1_to_2: 500
      level_2_to_3: 1000
      level_3_to_4: 2500
      level_4_to_5: 5000
      max_level: 5

  bonus_uses:
    collection_level_boost: 1000
    era_unlock_boost: 500
    set_bonus_enhancement: 2000
```

### Acquisition Sources
| Source | Amount | Frequency |
|--------|--------|-----------|
| Mission Complete | 15-75 | Per mission |
| Daily Quest | 25 | 3 per day |
| Achievement | 100-500 | One-time |
| Daily Login | 15 | Daily |
| Capsule Open | 10-50 | Per capsule |
| Event Reward | 50-200 | Per event |
| Collection Milestone | 100-1000 | Rare |
| Decommission Artifact | 25% of invested | Anytime |

### Decommission System
- Players can "decommission" any artifact
- Returns 25% of invested Chrono Dust
- Useful for removing unwanted artifacts
- Encourages experimentation

### Rules
- **Cannot be purchased** with real money
- **Cannot be transferred** between players
- **Can be recouped** via decommission
- **Accumulates** — no weekly caps

### Visual Display
- Purple (#9D4EDD) crystal icon
- Swirling particle effect
- Shimmer animation on balance
- Gem icon in UI

---

## 3. Jolt Crystals

**Type:** Premium Resource (Rare)

### Description
Jolt Crystals are the premium currency, earned primarily through gameplay but also available for purchase. Used for exclusive cosmetics and convenience items.

### Mechanics
```yaml
jolt_crystals:
  purpose: "Premium cosmetics and convenience"
  
  prices:
    cosmetic_bundle: 100
    profile_frame: 150
    avatar_skin: 200
    particle_effect: 250
    season_premium: 1500
    
  earning:
    achievement_milestones: 5-50
    collection_completion: 25-100
    event_participation: 10-50
    special_login_bonus: 25
    weekly_challenge: 50
    
  purchase_prices:
    pack_50: $0.99
    pack_150: $2.99
    pack_500: $9.99
    pack_1500: $29.99
```

### Acquisition Sources (Free Players)
| Source | Amount | Frequency |
|--------|--------|-----------|
| Achievement Milestones | 5-50 | Rare |
| Collection Completion | 25-100 | Per set |
| Event Participation | 10-50 | Weekly |
| Weekly Challenge | 50 | Weekly |
| Special Login Bonus | 25 | Monthly |

### Important Rules
- **Can be earned** through gameplay
- **Can be purchased** (optional)
- **Cannot be converted** to real money
- **Never provides gameplay advantage**
- **All items optional** — game completable f2p

### What You CAN Buy
- Cosmetic skins
- Profile frames
- Avatar decorations
- Season premium track
- Collection showcases

### What You CANNOT Buy
- Time Energy
- Chrono Dust
- Artifacts
- Mission completions
- Level progress
- Any gameplay power

### Visual Display
- Gold (#FFD700) diamond icon
- Sparkling particle effect
- Premium glow on balance
- Diamond icon in UI

---

## 4. Historical Tokens

**Type:** Event Currency (Limited)

### Description
Historical Tokens are earned exclusively through event participation and used to purchase event-exclusive rewards. They reset each season.

### Mechanics
```yaml
historical_tokens:
  purpose: "Event rewards and exclusive items"
  
  earning:
    event_participation: 10-25
    event_completion: 50-100
    event_milestone: 25-75
    leaderboard_reward: 100-500
    
  spending:
    event_rewards:
      common_item: 50
      uncommon_item: 100
      rare_item: 200
      exclusive_item: 500
      
    event_upgrades:
      boost_item: 75
      extra_attempt: 100
      skip_challenge: 150
```

### Acquisition Sources
| Source | Amount | Frequency |
|--------|--------|-----------|
| Event Participation | 10-25 | Per event |
| Event Completion | 50-100 | Per event |
| Event Milestone | 25-75 | Rare |
| Leaderboard Position | 100-500 | End of event |

### Event Token Rotation
```yaml
seasonal_reset:
  frequency: "Every season (8 weeks)"
  carryover: "None"
  notification: "7 days before reset"
  
  exclusive_items:
    type: "Limited availability"
    example: "Event badges, seasonal cosmetics"
    availability: "Earned only during event"
```

### Rules
- **Cannot be purchased** with real money
- **Cannot be transferred** between players
- **Reset each season** — use or lose
- **Only for events** — exclusive rewards

### Visual Display
- Bronze/silver/gold coin icon (based on rarity)
- Era-specific designs
- Roman/Greek/Egyptian aesthetics
- Coin pile icon in UI

---

## Currency Balance Table

| Currency | Earned F2P | Can Purchase | Gameplay Impact |
|----------|-----------|-------------|----------------|
| Time Energy | ✅ Yes | ❌ No | Required to play |
| Chrono Dust | ✅ Yes | ❌ No | Upgrade artifacts |
| Jolt Crystals | ✅ Yes | ✅ Yes | Cosmetics only |
| Historical Tokens | ✅ Yes | ❌ No | Event rewards |

---

## Economy Sustainability

### Currency Sinks
```yaml
sinks:
  time_energy:
    mission_entry: Continuous
    capsule_opening: Regular
    
  chrono_dust:
    artifact_upgrades: Primary sink
    set_bonuses: Rare sink
    
  jolt_crystals:
    cosmetics: Primary sink
    season_pass: Major sink
    
  historical_tokens:
    event_rewards: Seasonal sink
```

### Inflation Prevention
- Time Energy: Natural cap + regen limits
- Chrono Dust: High upgrade costs scale
- Jolt Crystals: Cosmetic sink creates demand
- Historical Tokens: Seasonal reset prevents hoarding

### Free Player Experience
- Can earn all currencies through gameplay
- All core content accessible f2p
- Cosmetics are truly optional
- No gameplay power via purchases

---

## Monetization Integration

### Primary Revenue: AdsGram
- Rewarded video ads for Time Energy
- Interstitial ads between missions
- Event ads for bonus rewards

### Secondary Revenue: Jolt Crystals
- Optional crystal purchases
- Cosmetic-only shop
- Season pass

### Important
> **NEVER design gameplay that requires Jolt Crystal purchases. Jolt Crystals are purely for cosmetics and convenience. Time Energy and Chrono Dust are never purchasable.**

---

*Currency is the blood of the game. Keep it flowing, keep it fair.*
