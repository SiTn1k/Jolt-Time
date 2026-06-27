# User Domain Module

**Task #166 - User Domain Skeleton**  
**Project:** Jolt Time  
**Status:** Module Skeleton Created

---

## Purpose

The User Domain is the central module responsible for managing all user-related functionality in the Jolt Time Telegram Mini App. It serves as the single source of truth for user identity, profile data, preferences, and user-related business logic.

This domain follows Clean Architecture principles with clear separation between:
- **Domain Layer**: Entities, value objects, domain events, business invariants
- **Application Layer**: Services, DTOs, mappers, factories
- **Infrastructure Layer**: Repositories, external integrations

---

## Responsibilities

### Core Responsibilities

| Responsibility | Description |
|----------------|-------------|
| User Identity | Manage user identity across Telegram and internal systems |
| User Profile | Store and retrieve player profile data |
| User Preferences | Handle user settings and preferences |
| User State | Manage user session state and lifecycle |
| User Creation | Handle new user registration and initialization |
| User Updates | Process profile updates and data changes |

### Domain Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER DOMAIN                               │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Entities │  │  Types   │  │   DTOs   │  │  Events  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   VOs    │  │Interfaces│  │Services  │  │  Mappers │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  Factories│  │ Validators│  │Exceptions│                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Structure

```
src/domains/user/
├── entities/           # Domain entities (User, UserProfile)
│   └── index.ts
├── repositories/       # Repository interfaces
│   └── index.ts
├── services/           # Business logic services
│   └── index.ts
├── dto/               # Data Transfer Objects
│   └── index.ts
├── mappers/           # Entity <-> DTO mappers
│   └── index.ts
├── validators/        # Input validation
│   └── index.ts
├── events/            # Domain events
│   └── index.ts
├── types/             # Type definitions
│   └── index.ts
├── interfaces/        # Abstract interfaces
│   └── index.ts
├── value-objects/     # Immutable value objects
│   └── index.ts
├── factories/         # Entity factories
│   └── index.ts
├── exceptions/       # Domain exceptions
│   └── index.ts
├── tests/             # Unit tests
│   └── index.ts
└── index.ts           # Module barrel export
```

---

## Dependencies

### Internal Dependencies

| Module | Dependency Type | Purpose |
|--------|-----------------|---------|
| `src/authentication/` | Hard | User identity resolution, session management |
| `src/database/` | Hard | Persistence via repositories |
| `src/telegram/` | Hard | Telegram user data integration |
| `src/shared/` | Soft | Shared types and utilities |

### External Dependencies

| External | Purpose |
|----------|---------|
| Supabase | User data persistence |
| Telegram API | User profile data |

---

## Relationships

### With Authentication Module

```
┌──────────────────┐         ┌──────────────────────┐
│  Authentication  │────────▶│       User Domain    │
│     Module       │         │                      │
└──────────────────┘         └──────────────────────┘
         │                             ▲
         │                             │
         │        User Identity         │
         │◀─────────────────────────────┤
         │                             │
         │    Telegram ID Resolution    │
         └─────────────────────────────┘
```

The User Domain works closely with Authentication:
- **UserIdentityRepository** in authentication resolves internal user IDs from Telegram IDs
- User Domain provides user profile data after authentication
- Authentication events (login, logout) may trigger User Domain events

### With Player Profile

```
┌──────────────────┐         ┌──────────────────────┐
│   User Domain    │────────▶│   Player Profile     │
│                  │         │   (Future Module)   │
└──────────────────┘         └──────────────────────┘
         │
         │ User Profile Entity
         │ User Preferences
         │ Display Name, Avatar, Settings
         ▼
```

Player Profile extends the User entity with game-specific data:
- Game statistics
- Achievement progress
- Subscription status
- Game-specific preferences

### With Database

```
┌──────────────────┐         ┌──────────────────────┐
│   User Domain    │────────▶│      Database       │
│                  │         │      Module          │
└──────────────────┘         └──────────────────────┘
         │
         │ Repository Pattern
         │ UserRepository
         │ UserPreferencesRepository
         │
         ▼
┌──────────────────────────────────────────┐
│           Supabase Backend               │
│  • users table                           │
│  • user_preferences table                │
│  • user_profiles table (future)          │
└──────────────────────────────────────────┘
```

The User Domain uses repositories to access database:
- All data access through repository interfaces
- No direct Supabase calls in domain code
- Mappers convert between DB records and entities

### With Telegram

```
┌──────────────────┐         ┌──────────────────────┐
│   User Domain    │◀────────│      Telegram        │
│                  │         │       Core           │
└──────────────────┘         └──────────────────────┘
         │
         │ Telegram User Data
         │ • telegram_id
         │ • username
         │ • first_name
         │ • last_name
         │ • language_code
         │
         ▼
┌──────────────────────────────────────────┐
│        Telegram Mini App / Bot           │
│  • initData parsing                      │
│  • User identification                   │
│  • Privacy settings                       │
└──────────────────────────────────────────┘
```

Telegram provides user identity data:
- initData from Mini App contains user info
- Bot commands receive Telegram user context
- User domain normalizes this data into internal format

---

## Architecture Compliance

### Clean Architecture Layers

| Layer | User Domain Implementation |
|-------|---------------------------|
| **Entities** | `entities/` - User, UserProfile value objects |
| **Use Cases** | `services/` - Business logic |
| **Interface Adapters** | `dto/`, `mappers/`, `repositories/` |
| **Frameworks** | `repositories/` implementations use database module |

### Domain-Driven Design

| DDD Concept | Implementation |
|-------------|----------------|
| **Aggregates** | User is the aggregate root |
| **Value Objects** | `value-objects/` folder |
| **Domain Events** | `events/` folder |
| **Repositories** | `repositories/` - interface only |
| **Factories** | `factories/` - entity creation |

### Repository Pattern

```
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                       │
│                  (Business Logic)                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Repository Interface                  │
│                   (IUserRepository)                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Repository Implementation                │
│               (Database Module)                         │
└─────────────────────────────────────────────────────────┘
```

All data access follows the repository pattern:
- Domain code depends on repository interfaces
- Concrete implementations in `database/` module
- No data access code in services or entities

---

## Implementation Notes

### This is a Skeleton

This module contains only the folder structure and index files. The following components will be implemented in subsequent tasks:

| Task | Component |
|------|-----------|
| P-166.002 | User Entity |
| P-166.003 | User Repository |
| P-166.004 | User Service |
| P-166.005 | User DTOs |
| P-166.006 | User Mappers |
| P-166.007 | User Validators |
| P-166.008 | User Events |
| P-166.009 | User Types & Interfaces |
| P-166.010 | User Value Objects |
| P-166.011 | User Factories |
| P-166.012 | User Exceptions |

### Naming Conventions

- **Entities**: `UserEntity`, `UserProfileEntity` (PascalCase, Entity suffix)
- **DTOs**: `CreateUserDto`, `UpdateUserDto`, `UserResponseDto` (PascalCase, Dto suffix)
- **Repositories**: `IUserRepository`, `UserRepository` (PascalCase, Repository suffix)
- **Services**: `UserService` (PascalCase, Service suffix)
- **Events**: `UserCreatedEvent`, `UserUpdatedEvent` (PascalCase, Event suffix)
- **Exceptions**: `UserNotFoundException`, `InvalidUserDataException` (PascalCase, Exception suffix)

### Import Order

1. External packages (alphabetical)
2. Internal modules (alphabetical)
3. Relative imports (alphabetical)

---

## Quality Standards

### Requirements

- [x] TypeScript strict mode compliant
- [x] No `any` types in domain code
- [x] All public APIs documented with JSDoc
- [x] Repository interfaces in domain, implementations in infrastructure
- [x] Domain events for state changes
- [x] Immutable value objects where applicable
- [x] Comprehensive validation at domain boundaries
- [x] Custom exceptions for domain errors

### Prohibited

- [ ] Business logic in entities
- [ ] Direct database calls from services
- [ ] `console.log` in production code
- [ ] `TODO` comments in final code
- [ ] Magic numbers or strings

---

## Next Task

**P-166.002 — User Entity**  
Implementation of the User entity with core user data and invariants.

---

*Building the future through the lens of the past.*