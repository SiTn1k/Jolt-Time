# Jolt Time — Production Implementation Roadmap

**Document Version:** 2.0  
**Created:** 2026-06-26  
**Updated:** 2026-06-26 (After Core Infrastructure Implementation)  
**Status:** Updated with Current State Analysis  
**Based on:** Architecture Documents 001–160

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Implementation Status](#current-implementation-status)
3. [Pre-Existing Issues Found](#pre-existing-issues-found)
4. [Implementation Phases](#implementation-phases)
5. [Detailed Task List](#detailed-task-list)
6. [Dependencies](#dependencies)
7. [Technical Debt](#technical-debt)
8. [Next Steps](#next-steps)

---

## Executive Summary

Jolt Time is a Telegram Mini App + Bot game built on React, TypeScript, and Supabase.

**Current State After Core Infrastructure Implementation:**

- ✅ **Core Infrastructure Complete**: Config, Logging, DI, Error System, Types, Constants, Utilities
- ⚠️ **Pre-existing code has ~60 TypeScript errors** that must be fixed before build
- ⚠️ **Pre-existing code has lint warnings** (~20 console.log statements)
- ✅ **46 unit tests passing** for new core modules

**Priority:** Fix pre-existing type errors → Phase 1 Implementation → Progressive system builds

---

## Current Implementation Status

### ✅ Completed Systems (Production Ready)

| System | Module | Status | Quality | Notes |
|--------|--------|--------|--------|-------|
| Core Infrastructure | `src/core/` | ✅ Complete | High | Config, Logging, DI |
| Shared Constants | `src/shared/constants/` | ✅ Complete | High | Enums, App constants |
| Shared Types | `src/shared/types/` | ✅ Complete | High | Base, DTO, API, Error types |
| Shared Errors | `src/shared/errors/` | ✅ Complete | High | Application, Repository, API, Telegram, Validation, Business errors |
| Shared Utilities | `src/shared/utils/` | ✅ Complete | High | Assertion, Format, Validation, Common utilities |
| Unit Tests | `tests/` | ✅ Complete | High | 46 tests passing |

### 🚧 Partially Implemented Systems

| System | Progress | Issues |
|--------|----------|--------|
| Daily Rewards Service | ~90% | Missing types, API issues |
| Energy Service | ~85% | Type mismatches with definitions |
| Ads Integration | ~70% | Mock implementation |
| Telegram Bot | ~60% | Command handlers, type issues |

### ❌ Missing / Not Implemented

| System | Priority | Notes |
|--------|----------|-------|
| Expeditions | High | Core gameplay loop |
| Artifacts | High | Core collection mechanic |
| Museum | High | Display/management system |
| Quests | High | Daily/weekly/story quests |
| User Profile Integration | High | Profile data integration |

---

## Pre-Existing Issues Found

### TypeScript Errors (~60 errors blocking build)

| Issue Type | Count | Example |
|------------|-------|---------|
| Missing `express` types | 1 | `import { Request, Response } from 'express'` |
| Missing `DailyRewardHistory` | 1 | Type reference error |
| Missing `EnergyHistory` | 1 | Type reference error |
| Missing properties | 9 | `timeShardsReward`, `boosterType`, etc. |
| Duplicate exports | 1 | `BoosterType` exported twice |
| Type re-export issues | 30+ | Need `export type` syntax |

### Lint Warnings (~20 warnings)

| Issue Type | Count |
|------------|-------|
| console.log (not warn/error) | ~15 |
| Undefined variables | 4 |

---

## Implementation Phases

### Phase 1: Fix Foundation (Critical Path) - **MUST DO FIRST**

**Goal:** Fix pre-existing type errors to enable build

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Fix type export issues in `src/index.ts` | Low | None | **TODO** |
| Add missing `@types/express` | Low | None | **TODO** |
| Fix duplicate `BoosterType` export | Low | None | **TODO** |
| Add missing `DailyRewardHistory` type | Medium | 1.1 | **TODO** |
| Add missing `EnergyHistory` type | Medium | 1.1 | **TODO** |
| Add missing `timeShardsReward` to DailyReward | Medium | 1.4 | **TODO** |
| Add missing `boosterType`/`boosterAmount` | Medium | 1.4 | **TODO** |
| Fix `reply_markup` typo in BotService | Low | None | **TODO** |
| Fix `DEFAULT_LANGUAGE` export | Low | None | **TODO** |
| Verify build passes | - | All above | **TODO** |

### Phase 2: Service Layer Integration

**Goal:** Integrate new core infrastructure into existing services

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Create Repository base class | Medium | Phase 1 | **TODO** |
| Create Service base class | Medium | Phase 1 | **TODO** |
| Integrate ConfigProvider into services | Low | Phase 1 | **TODO** |
| Integrate Logger into services | Low | Phase 1 | **TODO** |
| Integrate DI Container into services | High | 2.1, 2.2 | **TODO** |
| Refactor repositories to use base class | Medium | 2.1 | **TODO** |
| Refactor services to use base class | Medium | 2.2 | **TODO** |

### Phase 3: Core Gameplay Foundation

**Goal:** Implement the core game loop mechanics

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Implement Currency System | Medium | DB migrations | **TODO** |
| Implement User Profile Service | Medium | supabase-types | **TODO** |
| Implement Player Level/XP System | Medium | Currency System | **TODO** |
| Implement Energy Costs Integration | Medium | EnergyService | **TODO** |
| Implement Expedition System | High | Energy, Currency | **TODO** |
| Implement Artifact System | High | Collections | **TODO** |
| Implement Quest System | Medium | Energy | **TODO** | |

### Phase 4: UI Screens

**Goal:** Implement all React UI screens

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Create shared UI components | Medium | None | TODO |
| Implement Home Screen | Medium | API services | TODO |
| Implement Expedition Screen | High | Expedition system | TODO |
| Implement Artifact Collection Screen | High | Artifact system | TODO |
| Implement Museum Screen | High | Artifacts | TODO |
| Implement Quest Screen | Medium | Quest system | TODO |
| Implement Story Mode Screen | High | Story system | TODO |
| Implement Profile Screen | Medium | User service | TODO |
| Implement Settings Screen | Low | Preferences | TODO |

### Phase 5: Social Features

**Goal:** Implement social and competitive systems

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Implement Friends System | Medium | User service | TODO |
| Implement Guild System | High | Friends | TODO |
| Implement Leaderboards | Medium | User service | TODO |
| Implement Referral System | Medium | User service | TODO |
| Implement PVP Arena | High | Energy, User | TODO |
| Implement Tournaments | High | PVP Arena | TODO |
| Implement Guild Battles | High | Guilds, PVP | TODO |

### Phase 6: Monetization & Premium

**Goal:** Implement monetization systems

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Integrate AdsGram Real SDK | Medium | Mock adapter | TODO |
| Implement Battle Pass | High | Quests | TODO |
| Implement Premium Subscription | Medium | Telegram Stars | TODO |
| Implement Shop System | Medium | Battle Pass | TODO |
| Implement Marketplace | High | User service | TODO |

### Phase 7: Advanced Systems

**Goal:** Implement advanced gameplay and AI features

| Task | Complexity | Dependencies | Status |
|------|------------|--------------|--------|
| Implement Boss Battles | High | Expeditions | TODO |
| Implement AI Quest Generator | High | Quest system | TODO |
| Implement AI Event Designer | High | Events | TODO |
| Implement AI Museum Guide | Medium | Museum | TODO |
| Implement AI Support Assistant | Medium | Support system | TODO |
| Implement Creator System | High | Marketplace | TODO |

---

## Dependencies

### Task Dependency Graph

```
Phase 1: Fix Foundation (Critical Path)
    │
    ▼
Phase 2: Service Layer Integration
    │
    ▼
Phase 3: Core Gameplay Foundation
    ├── User Profile Service
    ├── Currency System
    ├── Expedition System
    └── Quest System
    │
    ▼
Phase 4: UI Screens
    │
    ▼
Phase 5: Social Features
    │
    ▼
Phase 6: Monetization
    │
    ▼
Phase 7: Advanced Systems
```

### Critical Path

The critical path for MVP:

1. Phase 1: Fix Foundation (must complete first)
2. Phase 2: Service Layer Integration
3. Phase 3: Core Gameplay Foundation
4. Phase 4: UI Screens

---

## Technical Debt

### High Priority Debt

| Item | Description | Estimated Fix Time |
|------|-------------|-------------------|
| ~60 TypeScript errors | Cannot build | 4-6 hours |
| Missing `express` types | API routes broken | 30 minutes |
| Type export conflicts | Build failure | 2-3 hours |
| Pre-existing console.log | Debug code in production | 1-2 hours |

### Medium Priority Debt

| Item | Description | Estimated Fix Time |
|------|-------------|-------------------|
| No repository base class | Code duplication | 4-6 hours |
| No service base class | Code duplication | 4-6 hours |
| No integration tests | Testing gap | 8-10 hours |

### Low Priority Debt

| Item | Description | Estimated Fix Time |
|------|-------------|-------------------|
| Missing JSDoc | Documentation gaps | 4-6 hours |
| No error boundaries | React error handling | 2-3 hours |

---

## Next Steps

### Immediate Actions (Before Any Feature Development)

1. **Execute Phase 1 tasks** - Fix all type errors blocking build
   - Fix type exports in src/index.ts
   - Add @types/express
   - Fix duplicate BoosterType export
   - Add missing types

2. **Verify build passes** - Run `npm run build` successfully

3. **Proceed to Phase 2** - Service layer integration

### First Production Module

**Recommended first module to implement after Phase 1:** User Profile Service

**Rationale:**
- Foundation for all other systems
- Low complexity
- No external dependencies
- Enables progress on multiple other modules

---

## Verification Status

After Phase 1 completion, the following should pass:

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Type Check | `npm run typecheck` | Zero errors |
| Lint | `npm run lint` | Zero errors |
| Tests | `npm run test` | All pass |
| Build | `npm run build` | Success |

---

*This roadmap will be updated as implementation progresses.*
*Last Updated: 2026-06-26*
