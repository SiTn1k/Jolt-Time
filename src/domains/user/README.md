# User Domain Module

**Task P-166.1 — User Domain Foundation**  
**Project:** Jolt Time  
**Status:** Foundation Complete

---

## Purpose

The User Domain is the central module responsible for managing all user-related functionality in the Jolt Time Telegram Mini App. It serves as the single source of truth for user identity, profile data, preferences, and user-related business logic.

This domain follows Clean Architecture principles with clear separation between:
- **Domain Layer**: Entities, value objects, domain events, business invariants
- **Application Layer**: Services, DTOs, mappers, factories
- **Infrastructure Layer**: Repositories, external integrations

---

## Implementation Status

### Completed Components

| Component | Status | Implementation |
|-----------|--------|----------------|
| **Entity** | ✅ Complete | `User` with factory methods |
| **Value Objects** | ✅ Complete | UserId, TelegramId, Username, LanguageCode, UserPhotoUrl |
| **Types** | ✅ Complete | UserStatus, UserRole, UserLanguage, UserMetadata, UserPermissions |
| **DTOs** | ✅ Complete | CreateUserDto, UpdateUserDto, UserResponseDto |
| **Interfaces** | ✅ Complete | IUser, IUserRepository |
| **Validators** | ✅ Complete | UserValidator, UsernameValidator, LanguageValidator |
| **Mapper** | ✅ Complete | UserMapper (entity-DTO conversion) |
| **Events** | ✅ Complete | UserCreated, UserUpdated, UserDeleted |
| **Repository Skeleton** | ✅ Complete | SupabaseUserRepository (NotImplementedError stubs) |
| **DI Registration** | ✅ Complete | registerUserDependencies, setupUserDomain |

### Pending Components (P-166.2+)

| Component | Task | Description |
|-----------|------|-------------|
| Database queries | P-166.2 | Supabase repository implementation |
| Business workflows | P-166.2 | User service with business logic |
| Registration flow | P-166.2 | User creation from Telegram data |
| Telegram sync | P-166.2 | Telegram user data synchronization |

---

## Module Structure

```
src/domains/user/
├── di.ts                 # Dependency injection setup
├── index.ts              # Module barrel export
├── README.md             # This file
│
├── entities/             # Domain entities
│   ├── index.ts
│   └── User.ts           # User aggregate root
│
├── repositories/         # Repository interfaces & implementations
│   ├── index.ts
│   ├── IUserRepository.ts
│   └── SupabaseUserRepository.ts  # Skeleton - DB queries not implemented
│
├── services/             # Business logic (pending P-166.2)
│   └── index.ts
│
├── dto/                  # Data Transfer Objects
│   ├── index.ts
│   ├── CreateUser.dto.ts
│   ├── UpdateUser.dto.ts
│   └── UserResponse.dto.ts
│
├── mappers/              # Entity-DTO mappers
│   ├── index.ts
│   └── UserMapper.ts
│
├── validators/           # Input validation
│   ├── index.ts
│   ├── UserValidator.ts
│   ├── UsernameValidator.ts
│   └── LanguageValidator.ts
│
├── events/               # Domain events
│   ├── index.ts
│   ├── UserCreated.event.ts
│   ├── UserUpdated.event.ts
│   └── UserDeleted.event.ts
│
├── types/                # Type definitions
│   ├── index.ts
│   ├── UserStatus.ts
│   ├── UserRole.ts
│   ├── UserLanguage.ts
│   ├── UserMetadata.ts
│   └── UserPermissions.ts
│
├── interfaces/           # Abstract interfaces
│   ├── index.ts
│   └── IUser.ts
│
├── value-objects/        # Immutable value objects
│   ├── index.ts
│   ├── UserId.ts
│   ├── TelegramId.ts
│   ├── Username.ts
│   ├── LanguageCode.ts
│   └── UserPhotoUrl.ts
│
├── factories/            # Entity factories (pending)
│   └── index.ts
│
├── exceptions/           # Domain exceptions (pending)
│   └── index.ts
│
└── tests/                # Unit tests (pending)
    └── index.ts
```

---

## Usage

### Basic Import

```typescript
import { User, IUser, UserStatus } from './domains/user';
```

### Using Validators

```typescript
import { UserValidator, UsernameValidator, LanguageValidator } from './domains/user';

const result = UserValidator.validateCreate(dto);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

### Using the Mapper

```typescript
import { UserMapper } from './domains/user';

const responseDto = UserMapper.toResponse(user);
const summaryDto = UserMapper.toSummary(user);
```

### Using Domain Events

```typescript
import { createUserCreatedEvent, createUserUpdatedEvent } from './domains/user';

const event = createUserCreatedEvent({
  userId,
  telegramId,
  username,
  firstName,
  registrationSource: 'telegram_mini_app',
});
```

### Dependency Injection

```typescript
import { registerUserDependencies, USER_TOKENS, setupUserDomain } from './domains/user';
import { getContainer } from '../core/di';

const container = getContainer();
registerUserDependencies(container);

// Or use quick setup
const { userRepository, userMapper, userValidator } = setupUserDomain();
```

---

## Architecture Compliance

### Clean Architecture Layers

| Layer | User Domain Implementation |
|-------|---------------------------|
| **Domain** | Entities, Value Objects, Domain Events, Business Invariants |
| **Application** | DTOs, Mappers, Validators, Services (P-166.2) |
| **Infrastructure** | Repository implementations (P-166.2) |

### Domain-Driven Design

| DDD Concept | Implementation |
|-------------|----------------|
| **Aggregates** | User is the aggregate root |
| **Value Objects** | UserId, TelegramId, Username, LanguageCode, UserPhotoUrl |
| **Domain Events** | UserCreated, UserUpdated, UserDeleted |
| **Repositories** | IUserRepository interface + SupabaseUserRepository skeleton |
| **Factories** | User.fromTelegram(), User.fromDatabase() |

### Repository Pattern

```
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                       │
│                  (Business Logic - P-166.2)             │
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
│         (SupabaseUserRepository - P-166.2)             │
└─────────────────────────────────────────────────────────┘
```

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
- [x] Custom exceptions for domain errors (structures defined, pending implementation)
- [x] Zero duplicated logic
- [x] Production-ready code (no shortcuts)

### Prohibited

- [x] Business logic in entities
- [x] Direct database calls from services
- [x] `console.log` in production code
- [x] `TODO` comments in final code
- [x] Magic numbers or strings (all constants properly named)

---

## Dependencies

### Internal Dependencies

| Module | Dependency Type | Purpose |
|--------|-----------------|---------|
| `src/core/di/` | Hard | Dependency injection container |
| `src/database/` | Hard | Supabase types and providers |
| `src/shared/` | Soft | Shared types and utilities |
| `src/authentication/` | Soft | User identity resolution |

### External Dependencies

| External | Purpose |
|----------|---------|
| Supabase | User data persistence (P-166.2) |
| Telegram API | User profile data |

---

## Next Task

**P-166.2 — User Domain Implementation**  
Complete implementation of:
- SupabaseUserRepository database queries
- UserService with business logic
- User registration flow
- Telegram user synchronization

---

*Building the future through the lens of the past.*