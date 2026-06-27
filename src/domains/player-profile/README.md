# Player Profile Domain

## Overview

The Player Profile domain represents a player's gameplay identity in Jolt Time. It is a core domain that encapsulates all player-related gameplay data, progression, and preferences.

## Key Distinction

**PlayerProfile IS NOT User**

| Aspect | User | PlayerProfile |
|--------|------|---------------|
| **Purpose** | Authentication identity | Gameplay identity |
| **Data** | Telegram info, login status | Level, XP, prestige, stats |
| **Creation** | On Telegram auth | On first gameplay |
| **Link** | - | References User via `userId` |

## Module Structure

```
player-profile/
├── entities/           # Domain entities (PlayerProfile)
├── repositories/       # Data access layer
├── dto/                # Data Transfer Objects
├── mappers/            # Entity-DTO mappers
├── validators/         # Input validation
├── events/             # Domain events
├── types/              # Type definitions
├── interfaces/         # Abstract interfaces
├── value-objects/      # Immutable value objects
├── di.ts               # Dependency injection
└── index.ts            # Module exports
```

## Core Components

### Entity: PlayerProfile

The main domain entity representing a player's game profile.

**Required Fields:**
- `profileId` - Unique identifier (UUID)
- `userId` - Associated user ID
- `nickname` - In-game display name
- `level` - Current player level (1-100)
- `experience` - Total accumulated XP
- `prestige` - Prestige level (0-100)
- `accountAge` - Days since creation
- `tutorialCompleted` - Onboarding status
- `profileVersion` - Schema version
- `createdAt` / `updatedAt` - Timestamps

### Value Objects

- `PlayerProfileId` - UUID-based identifier
- `PlayerNickname` - Validated display name (3-32 chars, alphanumeric + underscore)
- `PlayerLevel` - Level with min 1, max 100
- `PlayerExperience` - XP with progression calculations
- `PrestigeLevel` - Prestige with reset mechanics

### Types

- `PlayerStatistics` - Aggregated gameplay stats
- `PlayerPreferences` - User-configurable settings
- `PlayerProfileStatus` - ACTIVE, RESTRICTED, BANNED, DELETED
- `PlayerProfileMetadata` - Versioning and tracking info

### Events

- `PlayerProfileCreated` - Emitted on new profile creation
- `PlayerProfileUpdated` - Emitted on profile modifications
- `PlayerProfileReset` - Emitted on prestige reset

## Usage Example

```typescript
import {
  PlayerProfile,
  PlayerProfileId,
  PlayerNickname,
  PlayerLevel,
  PlayerExperience,
  PrestigeLevel,
} from './domains/player-profile';

// Create a new player profile
const profile = PlayerProfile.create({
  profileId: PlayerProfileId.generate(),
  userId: 'user-uuid-here',
  nickname: PlayerNickname.create('TimeTraveler42'),
});

// Add experience and check level up
const updatedProfile = profile.addExperience(1500);

// Check level progression
console.log(`Level: ${updatedProfile.level.value}`); // 2
console.log(`XP: ${updatedProfile.experience.value}`); // 1500
```

## Status

**Foundation: Complete (P-167.1)**
- Entity, DTOs, Types, Interfaces, Validators, Mapper, Events
- Repository skeleton (methods throw NotImplementedError)

**Pending: P-167.2**
- Repository implementation (database queries)
- Player Profile Service
- Profile initialization flow
- Progression logic
- Statistics management

## Dependencies

- Core Infrastructure (DI Container)
- Database Layer (Supabase types)
- User Domain (for userId reference)