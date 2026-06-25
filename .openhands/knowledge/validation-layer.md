# Jolt Time — Validation Layer Architecture

## Overview

The Validation Layer is the centralized authority for validating all data entering and leaving the Jolt Time system. It ensures consistency across the entire application, prevents invalid operations, protects system integrity, and improves user experience by providing clear, actionable feedback.

**Architecture Status:** Design Specification Only
**Implementation:** Not Started

---

## 1. Validation Categories

The Validation Layer encompasses six primary categories, each operating at a distinct layer of the application architecture.

### 1.1 UI Validation

**Purpose:** Validate user interactions at the presentation layer before any backend operations occur.

**Scope:**
- Real-time input validation during user interaction
- Form-level validation before submission
- Screen-specific validation for settings and preferences
- Search interface validation for queries and filters

**Characteristics:**
- Immediate feedback to users
- Low computational overhead
- Optimized for mobile performance

### 1.2 Form Validation

**Purpose:** Validate structured data submissions from user-facing forms.

**Scope:**
- Registration and profile forms
- Settings configuration forms
- Feedback and support submission forms
- Campaign entry forms

**Characteristics:**
- Schema-based validation
- Field dependency handling
- Multi-step form state validation

### 1.3 Business Validation

**Purpose:** Enforce game-specific business rules that govern player actions and system operations.

**Scope:**
- Currency spending and transactions
- Reward claiming eligibility
- Inventory operations (add, remove, transfer)
- Progression requirements (level gates, unlock conditions)
- Marketplace listing and purchasing
- Battle pass tier progression

**Characteristics:**
- Rule-driven validation
- Context-aware (player state, game state, time)
- May require database queries for current state

### 1.4 API Validation

**Purpose:** Validate data exchanged between client and backend services.

**Scope:**
- Request payload validation (Mini App → Supabase)
- Response payload validation (Supabase → Mini App)
- External service data validation (AdsGram, Telegram API)
- Webhook payload validation

**Characteristics:**
- Schema enforcement
- Type safety
- Security-focused (SQL injection, XSS prevention)

### 1.5 Database Validation

**Purpose:** Ensure data integrity at the persistence layer.

**Scope:**
- Entity integrity (required fields, data types)
- Relationship integrity (foreign keys, referential constraints)
- Business constraints (unique indexes, conditional rules)
- Migration data validation

**Characteristics:**
- Declarative constraints
- Trigger-based validation
- Transaction boundary enforcement

### 1.6 Security Validation

**Purpose:** Protect the system from malicious actors and unauthorized actions.

**Scope:**
- Permission checks (resource access)
- Role checks (operation authorization)
- Fraud prevention (exploitation detection)
- Abuse prevention (rate limiting, spam detection)
- Session and authentication validation

**Characteristics:**
- Defense in depth
- Fail-safe defaults
- Audit logging for suspicious activity

---

## 2. Validation Philosophy

The Validation Layer operates on three core principles that guide all validation decisions.

### 2.1 Prevent Invalid Operations

Validation must stop invalid operations before they reach the data layer or affect game state.

- **Fail Fast:** Validate as early as possible in the request lifecycle
- **Fail Safe:** Invalid input should never result in undefined behavior
- **Fail Clearly:** Error messages must be actionable and user-friendly

### 2.2 Protect System Integrity

Validation ensures the game economy and player data remain consistent and trustworthy.

- **Economic Balance:** Currency operations never create or destroy value incorrectly
- **Data Consistency:** Player state always reflects valid game history
- **Referential Integrity:** Related entities maintain proper relationships
- **Auditability:** All validation failures are logged for debugging

### 2.3 Improve User Experience

Validation feedback guides players toward successful actions.

- **Immediate Feedback:** Real-time validation as users type or interact
- **Clear Guidance:** Error messages explain what is wrong and how to fix it
- **Graceful Degradation:** When possible, provide alternatives or workarounds
- **Progressive Disclosure:** Show advanced validation rules only when relevant

---

## 3. Validation Layer Structure

The validation code follows a predictable folder structure that mirrors the application architecture.

### 3.1 Directory Layout

```
src/
├── validation/
│   ├── forms/              # Form-specific validators
│   │   ├── profile/
│   │   ├── settings/
│   │   └── feedback/
│   ├── business/           # Game business rule validators
│   │   ├── economy/
│   │   ├── inventory/
│   │   ├── progression/
│   │   ├── marketplace/
│   │   └── rewards/
│   ├── api/                # API request/response validators
│   │   ├── requests/
│   │   └── responses/
│   ├── security/          # Security-focused validators
│   │   ├── permissions/
│   │   ├── roles/
│   │   └── fraud/
│   ├── shared/             # Cross-cutting validators
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   ├── results.ts
│   │   └── decorators.ts
│   └── telegram/           # Telegram-specific validators
│       ├── user/
│       ├── deep-links/
│       ├── referrals/
│       └── sharing/
├── features/
│   └── {feature}/
│       └── validation/     # Feature-specific validation
└── services/
    └── {service}/
        └── validation/     # Service-specific validation
```

### 3.2 Shared Core

The `validation/shared/` directory contains foundational types and utilities used across all validation categories:

| File | Purpose |
|------|---------|
| `types.ts` | Core validation types, interfaces, and type guards |
| `rules.ts` | Reusable validation rule primitives |
| `results.ts` | Standardized validation result types |
| `decorators.ts` | Validation decorators for methods and classes |
| `validators.ts` | Composable validator builders |

### 3.3 Feature-Specific Validation

Each feature module may contain its own validation directory:

```
src/features/museum/validation/
├── artifact.validator.ts
├── collection.validator.ts
└── museum.validator.ts
```

This separation ensures validation logic remains co-located with the feature it serves while still following shared standards.

---

## 4. UI Validation Standards

UI Validation operates at the presentation layer to provide immediate feedback to users.

### 4.1 User Input Validation

| Input Type | Validation Rules |
|------------|-------------------|
| **Text** | Length bounds, character restrictions, profanity filter |
| **Username** | 3-30 characters, alphanumeric + underscore, unique check |
| **Bio** | 0-160 characters, no URLs unless permitted |
| **Email** | RFC 5322 format, deliverability check (async) |
| **URL** | Valid URL format, allowed domains for game content |
| **Number** | Min/max bounds, integer vs decimal, precision limits |

### 4.2 Form Field Validation

Form fields follow a consistent validation lifecycle:

1. **Initial State:** Field is empty, no validation shown
2. **On Blur:** Validate on field exit, show errors if invalid
3. **On Change (debounced):** Real-time validation for active fields
4. **On Submit:** Validate all fields, block submission until valid

### 4.3 Settings Screen Validation

Settings screens require special handling due to their persistent nature:

| Setting | Validation |
|---------|------------|
| **Display Name** | Same as username rules |
| **Notifications** | Permission check before enabling |
| **Language** | Valid locale code from supported list |
| **Theme** | Valid theme identifier |
| **Privacy** | Valid privacy level enum |

### 4.4 Search Interface Validation

Search inputs have unique constraints:

| Constraint | Rule |
|------------|------|
| **Minimum Query** | 2 characters before search executes |
| **Maximum Query** | 100 characters |
| **Rate Limiting** | Maximum 1 search per 500ms |
| **Special Characters** | Escape or reject SQL/JS injection patterns |

---

## 5. Business Validation Standards

Business validation enforces game-specific rules that govern player actions and system operations.

### 5.1 Currency Spending Validation

Currency operations must preserve economic integrity.

| Operation | Validation Rules |
|-----------|------------------|
| **Spend Currency** | Balance >= amount, sufficient funds, valid transaction type |
| **Earn Currency** | Valid source, not duplicate, within daily caps |
| **Transfer Currency** | Both parties valid, valid amount, not self-transfer |
| **Convert Currency** | Valid conversion rate, minimum amounts, cooldown elapsed |

**Example Rules:**
- `validateSpend(playerId, currencyType, amount)` → ensures balance >= amount
- `validateDailyCap(playerId, currencyType)` → ensures daily earning limit not exceeded
- `validateCurrencyType(currencyType)` → ensures currency exists in game config

### 5.2 Reward Claiming Validation

Reward claiming prevents exploitation while maintaining player satisfaction.

| Reward Type | Validation Rules |
|-------------|------------------|
| **Daily Reward** | Cooldown elapsed, not already claimed, streak valid |
| **Achievement Reward** | Achievement unlocked, not already claimed |
| **Quest Reward** | Quest completed, not already claimed, player level met |
| **Ad Reward** | Ad watched fully, cooldown elapsed, not duplicate view |
| **Event Reward** | Event active, participation requirements met |

**Example Rules:**
- `validateDailyRewardClaim(playerId, rewardId)` → ensures reward available
- `validateAdRewardEligibility(playerId)` → ensures ad cooldown passed
- `validateRewardNotClaimed(playerId, rewardId)` → prevents duplicate claims

### 5.3 Inventory Operations Validation

Inventory operations maintain item integrity.

| Operation | Validation Rules |
|-----------|------------------|
| **Add Item** | Valid item type, inventory not full, stack limits respected |
| **Remove Item** | Item exists, quantity valid, no negative balance |
| **Move Item** | Source/destination valid, quantity valid |
| **Equip Item** | Item equippable, slot available, level requirement met |
| **Trade Item** | Both parties valid, both own items, trade window active |

**Example Rules:**
- `validateInventoryAdd(playerId, itemId, quantity)` → ensures space available
- `validateItemEquip(playerId, itemId, slotId)` → ensures equip requirements met
- `validateTradeIntegrity(playerId, counterpartyId, items)` → ensures valid trade state

### 5.4 Progression Requirements Validation

Progression validation ensures players meet requirements before advancing.

| Progression Type | Validation Rules |
|------------------|------------------|
| **Level Up** | Experience sufficient, level cap not reached |
| **Era Unlock** | Previous era complete, level requirement met |
| **Feature Unlock** | Required features unlocked, prerequisites met |
| **Battle Pass Tier** | Points sufficient, tier exists, season active |

**Example Rules:**
- `validateLevelUp(playerId)` → ensures XP >= required for next level
- `validateEraUnlock(playerId, eraId)` → ensures previous era complete
- `validateFeatureUnlock(playerId, featureId)` → ensures prerequisites met

### 5.5 Marketplace Actions Validation

Marketplace validation prevents fraud and maintains economic balance.

| Action | Validation Rules |
|--------|------------------|
| **List Item** | Item owned, listing fee paid, price within bounds |
| **Purchase Item** | Seller exists, item still listed, sufficient funds |
| **Cancel Listing** | Seller is player, listing exists, cancellation fee paid |
| **Accept Offer** | Offer exists, offer not expired, both parties valid |

**Example Rules:**
- `validateListingCreation(playerId, itemId, price)` → ensures valid listing
- `validatePurchase(playerId, listingId)` → ensures purchase valid
- `validatePriceBounds(itemType, price)` → ensures price within min/max

---

## 6. API Validation Standards

API validation ensures data integrity in all client-server communication.

### 6.1 Request Payload Validation

All incoming requests must pass validation before processing.

| Validation Aspect | Rule |
|-------------------|------|
| **Schema Validation** | All required fields present, correct types |
| **Value Validation** | Field values within acceptable ranges |
| **Authorization** | Valid session, correct permissions |
| **Rate Limiting** | Request within rate limits |
| **Tampering Detection** | Payload signature valid |

**Example Request Validator:**
```
validateApiRequest(payload, schema) → ValidationResult
```

### 6.2 Response Payload Validation

Responses from external services must be validated before use.

| Validation Aspect | Rule |
|-------------------|------|
| **Schema Validation** | Response matches expected structure |
| **Type Safety** | Field types match TypeScript definitions |
| **Data Sanitization** | No injection payloads present |
| **Completeness** | All required fields present |

**Example Response Validator:**
```
validateApiResponse<T>(response, schema) → ValidationResult<T>
```

### 6.3 External Service Data Validation

Data from external services requires special handling.

| Service | Validation Rules |
|---------|------------------|
| **AdsGram** | Valid callback signature, timestamp within window, reward amount valid |
| **Telegram API** | Valid initData, hash verified, user data valid |
| **Supabase** | Valid JWT, user exists, permissions correct |

---

## 7. Database Validation Standards

Database validation ensures data integrity at the persistence layer.

### 7.1 Entity Integrity

Each entity must maintain internal consistency.

| Rule | Implementation |
|------|---------------|
| **Required Fields** | NOT NULL constraints |
| **Unique Fields** | UNIQUE constraints |
| **Valid Types** | Proper column types |
| **Value Ranges** | CHECK constraints |

### 7.2 Relationship Integrity

Relationships between entities must remain valid.

| Rule | Implementation |
|------|---------------|
| **Foreign Keys** | REFERENCES with ON DELETE/UPDATE actions |
| **Cascade Deletes** | Proper cleanup when parent deleted |
| **Orphan Prevention** | No orphaned references |

### 7.3 Business Constraints

Game-specific rules enforced at the database level.

| Constraint | Implementation |
|------------|---------------|
| **Positive Currency** | CHECK balance >= 0 |
| **Unique Claim** | UNIQUE INDEX on (player_id, reward_id) |
| **Daily Limits** | Trigger or materialized view |
| **Historical Immutability** | No UPDATE on history tables |

---

## 8. Security Validation Standards

Security validation protects the system from malicious actors.

### 8.1 Permission Checks

Resource access validation ensures players can only access authorized resources.

| Check | Validation |
|-------|------------|
| **Resource Owner** | Player owns or has access to resource |
| **Resource Existence** | Resource exists and is accessible |
| **Access Level** | Player permission level >= required level |

**Example Rules:**
- `validateResourceAccess(playerId, resourceId)` → ensures access permitted
- `validateOwnership(playerId, resourceId)` → ensures player owns resource

### 8.2 Role Checks

Operation authorization validates player can perform action.

| Role | Permissions |
|------|-------------|
| **Player** | Basic gameplay actions |
| **Premium Player** | Premium features, exclusive content |
| **Moderator** | Chat moderation, user lookup |
| **Admin** | System configuration, user management |

**Example Rules:**
- `validateRole(playerId, requiredRole)` → ensures sufficient role
- `validatePremiumFeature(playerId)` → ensures premium subscription

### 8.3 Fraud Prevention

Detection of exploitation attempts and cheat usage.

| Detection | Rule |
|-----------|------|
| **Speed Cheating** | Action rate within human limits |
| **Macro Detection** | Repeated patterns indicate automation |
| **Impossible Actions** | Actions completed too quickly |
| **Duplicate Claims** | Same reward claimed from multiple sources |

**Example Rules:**
- `validateActionRate(playerId, actionType)` → ensures human-speed actions
- `validateNoDuplicateClaim(playerId, claimId)` → prevents double-claiming

### 8.4 Abuse Prevention

Protection against resource exhaustion and spam.

| Prevention | Rule |
|------------|------|
| **Rate Limiting** | Actions per time window limited |
| **Spam Detection** | Repeated same action flagged |
| **Resource Exhaustion** | Server resources not overused |

---

## 9. Telegram Validation Standards

Telegram platform integration requires specialized validation.

### 9.1 Telegram User Data Validation

User data from Telegram must be verified for authenticity.

| Validation | Rule |
|------------|------|
| **Init Data Validation** | Hash signature verified against bot token |
| **User Existence** | User ID is valid Telegram user |
| **User Active** | User account is not deactivated |
| **Timestamp Validation** | Init data not older than 24 hours |

**Example Rules:**
- `validateTelegramInitData(initData)` → verifies Telegram authentication
- `validateTelegramUser(telegramUser)` → ensures user data valid

### 9.2 Deep Link Validation

Deep links enable direct navigation to specific content.

| Validation | Rule |
|------------|------|
| **Link Format** | Valid deep link structure |
| **Link Active** | Target content still exists |
| **Link Not Expired** | Expiration timestamp valid |
| **Link Not Used** | One-time links not reused |

**Example Rules:**
- `validateDeepLink(link)` → ensures deep link valid
- `validateDeepLinkTarget(targetId, targetType)` → ensures target exists

### 9.3 Referral Validation

Referral system validation prevents referral fraud.

| Validation | Rule |
|------------|------|
| **Referrer Valid** | Referrer user exists and active |
| **Referral Not Self** | Cannot refer yourself |
| **Referral Not Duplicate** | User not already referred |
| **Referral Limit** | Referrer under daily referral cap |

**Example Rules:**
- `validateReferral(referrerId, referralId)` → ensures valid referral
- `validateReferralNotDuplicate(referralId)` → ensures not already referred

### 9.4 Sharing Operations Validation

Sharing validation ensures proper attribution and reward.

| Validation | Rule |
|------------|------|
| **Share Target Valid** | Share target is valid entity |
| **Share Not Duplicate** | Same share not counted twice |
| **Share Attribution** | Share properly attributed to player |
| **Share Cooldown** | Share reward not on cooldown |

---

## 10. AdsGram Validation Standards

AdsGram integration is critical for project monetization. Strict validation protects revenue integrity.

### 10.1 Reward Validation

Ad rewards must be validated to prevent exploitation.

| Validation | Rule |
|------------|------|
| **Reward Amount** | Amount matches ad configuration |
| **Reward Type** | Reward type is valid |
| **Reward Eligible** | Player eligible for this reward |
| **Reward Not Duplicated** | Same ad view not double-counted |

**Example Rules:**
- `validateAdRewardAmount(viewId, expectedAmount)` → ensures amount correct
- `validateAdRewardType(viewId, rewardType)` → ensures type valid

### 10.2 Callback Validation

AdsGram server callbacks must be cryptographically verified.

| Validation | Rule |
|------------|------|
| **Signature Valid** | HMAC signature matches |
| **Timestamp Valid** | Callback not replayed (within 5 minutes) |
| **View ID Unique** | View ID not previously processed |
| **User ID Valid** | User ID matches registered player |

**Example Rules:**
- `validateAdsGramCallback(payload, secret)` → verifies signature
- `validateCallbackTimestamp(timestamp)` → ensures not replayed
- `validateViewIdUnique(viewId)` → prevents double-crediting

### 10.3 Duplicate Reward Prevention

Multiple safeguards prevent duplicate reward crediting.

| Prevention | Implementation |
|------------|-----------------|
| **Database Constraint** | UNIQUE INDEX on (user_id, view_id) |
| **Idempotency Key** | Callback processing is idempotent |
| **Processing Lock** | Distributed lock during processing |
| **Audit Logging** | All reward attempts logged |

### 10.4 Monetization Integrity

Revenue validation ensures accurate monetization reporting.

| Check | Rule |
|-------|------|
| **Valid Ad View** | View completed, not skipped |
| **Valid Impression** | Ad actually rendered |
| **Valid Click** | Click through recorded correctly |
| **Revenue Allocation** | Revenue attributed correctly |

---

## 11. Validation Result Standards

All validation operations return standardized results that indicate the outcome and provide actionable information.

### 11.1 Result Types

| Result | Code | Description | Behavior |
|--------|------|-------------|----------|
| **Success** | `VALID` | All validation passed | Proceed with operation |
| **Warning** | `WARNING` | Validation passed with concerns | Proceed with caution, log warning |
| **Failure** | `INVALID` | Validation failed | Block operation, show error |
| **Recovery** | `RECOVERABLE` | Validation failed but fixable | Block operation, suggest recovery |

### 11.2 Result Structure

```typescript
interface ValidationResult<T = unknown> {
  valid: boolean;
  code: ValidationCode;
  message?: LocalizedMessage;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  recovery?: RecoverySuggestion;
  data?: T;
}

interface ValidationError {
  field?: string;
  code: string;
  message: LocalizedMessage;
  value?: unknown;
}

interface ValidationWarning {
  field?: string;
  code: string;
  message: LocalizedMessage;
}

interface RecoverySuggestion {
  action: RecoveryAction;
  message: LocalizedMessage;
  data?: unknown;
}

type RecoveryAction =
  | 'RETRY'
  | 'CONTACT_SUPPORT'
  | 'UPDATE_APP'
  | 'WAIT_AND_RETRY'
  | 'CHECK_INTERNET'
  | 'CLEAR_CACHE';
```

### 11.3 Result Handling

| Result | UI Behavior | Logging |
|--------|-------------|---------|
| **Success** | Normal flow | Debug level |
| **Warning** | Show warning toast | Info level |
| **Failure** | Show error message, block action | Warning level |
| **Recovery** | Show error with recovery action | Warning level |

---

## 12. Naming Standards

Validation naming follows consistent patterns for discoverability and maintenance.

### 12.1 Validator Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| `validate{Subject}` | `validateCurrencySpend` | Single-purpose validators |
| `validate{Subject}{Aspect}` | `validateUserProfile` | Subject + aspect |
| `validate{Subject}Batch` | `validateInventoryBatch` | Batch operations |
| `is{State}` | `isPlayerEligible` | Boolean state checks |
| `can{Action}` | `canClaimReward` | Permission checks |

### 12.2 Rule Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| `{field}Required` | `emailRequired` | Field must be present |
| `{field}Valid` | `amountValid` | Field value valid |
| `{field}InRange` | `priceInRange` | Value within bounds |
| `{field}Unique` | `usernameUnique` | Value is unique |
| `{field}NotExpired` | `tokenNotExpired` | Time-based validity |

### 12.3 Error Code Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| `{CATEGORY}_{RULE}` | `CURRENCY_INSUFFICIENT_BALANCE` | Specific error |
| `{CATEGORY}_{FIELD}_{RULE}` | `USER_EMAIL_INVALID_FORMAT` | Field-specific error |
| `VALIDATION_{TYPE}_FAILED` | `VALIDATION_REQUIRED_FIELD_MISSING` | Generic error |

---

## 13. Testing Philosophy

Validation rules must be independently testable to ensure reliability.

### 13.1 Unit Test Requirements

Each validation rule must have corresponding unit tests:

| Test Type | Coverage |
|-----------|----------|
| **Happy Path** | Valid input passes validation |
| **Boundary Cases** | Input at min/max limits |
| **Invalid Input** | Invalid input rejected correctly |
| **Edge Cases** | Empty, null, undefined handled |
| **Performance** | Validation completes within time limit |

### 13.2 Test Naming Convention

```
{ValidatorName}_{Scenario}_{ExpectedResult}

Examples:
- validateCurrencySpend_SufficientBalance_ReturnsValid
- validateCurrencySpend_InsufficientBalance_ReturnsInvalid
- validateCurrencySpend_NegativeAmount_ReturnsInvalid
- validateCurrencySpend_MaxAmount_ReturnsValid
```

### 13.3 Automated Verification

| Verification Type | Tool/Approach |
|-------------------|---------------|
| **Static Analysis** | TypeScript strict mode, ESLint rules |
| **Property-Based Testing** | Generate random valid/invalid inputs |
| **Mutation Testing** | Verify tests catch introduced bugs |
| **Integration Testing** | End-to-end validation flows |

---

## 14. Future Expansion Notes

The Validation Layer is designed to accommodate future validation systems as the project evolves.

### 14.1 AI Validation

AI-generated content validation for future AI features:

- Content appropriateness detection
- Generated text quality assessment
- AI persona response validation
- User-generated content moderation

**Status:** Future consideration, architecture must support

### 14.2 Creator Validation

Creator ecosystem validation for user-generated content:

- Creator application validation
- Content submission approval workflow
- Revenue share calculation validation
- Creator tier requirements

**Status:** Future consideration per creator-system.md

### 14.3 NFT Validation

Web3/NFT integration validation:

- Wallet address validation
- Token ownership verification
- NFT metadata schema validation
- Transfer transaction validation

**Status:** Future consideration for Web3 expansion

### 14.4 Web3 Validation

Blockchain integration validation:

- Transaction signature verification
- Smart contract call validation
- Gas limit and price validation
- Cross-chain bridge validation

**Status:** Future consideration for TON integration expansion

### 14.5 Esports Validation

Competitive gaming validation:

- Tournament eligibility validation
- Match result verification
- Anti-cheat validation
- Ranking calculation validation

**Status:** Future consideration per tournaments.md

---

## 15. Long-Term Philosophy

The Validation Layer embodies principles that ensure long-term project success.

### 15.1 Reliability

Validation provides a consistent, predictable system:

- Every input is validated before processing
- Validation rules never have undefined behavior
- Errors are always meaningful and actionable

### 15.2 Bug Reduction

Centralized validation catches bugs early:

- Business logic errors caught at the boundary
- Data integrity errors prevented at the database layer
- Security vulnerabilities identified before production

### 15.3 Data Integrity Protection

The game economy and player data remain trustworthy:

- Currency operations never create or destroy value incorrectly
- Player progress is always valid and recoverable
- Game state is always consistent

### 15.4 Scalability Support

Validation architecture supports growth:

- New validation categories can be added without refactoring
- Existing validators can be composed into complex rules
- Validation can be distributed across services as needed

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `.openhands/knowledge/error-handling.md` | Error handling patterns |
| `.openhands/knowledge/api-architecture.md` | API design standards |
| `.openhands/knowledge/api-client-layer.md` | API client patterns |
| `.openhands/knowledge/folder-architecture.md` | Folder structure |
| `.openhands/knowledge/security.md` | Security standards |
| `.openhands/knowledge/adsgram.md` | AdsGram integration |

---

*Last Updated: 2026-06-25*
