# Jolt Time — Security and Anti-Abuse System

## Overview

Jolt Time is committed to protecting honest players while maintaining a fair, enjoyable gaming environment. Security systems operate silently in the background, protecting players without disrupting normal gameplay. The philosophy is **security as a service to honest players** — visible protection when needed, invisible convenience otherwise.

**Core Philosophy:**
- Protect honest players from exploitation and unfair advantages
- Maintain economy integrity without punishing legitimate players
- Operate silently — security should not interrupt normal users
- Fair enforcement — avoid false positives, allow manual review
- Respect privacy while maintaining safety

---

## 1. Account Protection Rules

### 1.1 Telegram Identity System

Jolt Time uses Telegram as the primary identity provider, leveraging Telegram's robust authentication infrastructure.

```
ACCOUNT IDENTITY:
┌─────────────────────────────────────────────────────────────────┐
│  TELEGRAM AUTHENTICATION LAYER                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Primary Identifier: Telegram User ID                           │
│  Secondary: Telegram Username (when available)                   │
│  Tertiary: Telegram Chat ID (for bot interactions)               │
│                                                                 │
│  Authentication Flow:                                            │
│  1. User initiates via Telegram Mini App                        │
│  2. Telegram WebApp provides initData                          │
│  3. Backend validates initData hash                            │
│  4. Session token issued upon valid authentication              │
│  5. Token used for subsequent API requests                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Account Ownership

```
ACCOUNT OWNERSHIP PRINCIPLES:
┌─────────────────────────────────────────────────────────────────┐
│  OWNERSHIP RULES                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Account tied to Telegram User ID                            │
│  ✓ Single account per Telegram user                            │
│  ✓ Account cannot be transferred or sold                        │
│  ✓ All actions tied to authenticated user                       │
│  ✓ Clear ownership trails in all logs                         │
│                                                                 │
│  TELEGRAM-BASED SECURITY:                                       │
│  • Telegram handles password security                           │
│  • 2FA managed by Telegram (if enabled)                        │
│  • Session management via Telegram                             │
│  • Account recovery through Telegram                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Account Recovery Philosophy

```
RECOVERY PRINCIPLES:
┌─────────────────────────────────────────────────────────────────┐
│  RECOVERY PHILOSOPHY                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Standard Recovery:                                              │
│  • User contacts support via bot                                │
│  • Verify Telegram identity (user initiates from their account) │
│  • Restore account data from database                           │
│  • No alternative verification needed                            │
│                                                                 │
│  Fraudulent Claims:                                              │
│  • Cannot claim ownership of non-existent accounts              │
│  • Cannot claim ownership without Telegram verification          │
│  • Support tickets logged for all attempts                       │
│                                                                 │
│  Banned Accounts:                                               │
│  • Ban status preserved in database                             │
│  • Cannot "recover" to bypass ban                              │
│  • Appeals process available via support                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Session Management

```
SESSION MANAGEMENT:
┌─────────────────────────────────────────────────────────────────┐
│  SESSION SECURITY                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Session Token:                                                 │
│  • Generated upon successful Telegram auth                       │
│  • JWT-based with 7-day expiration                             │
│  • Tied to Telegram User ID                                    │
│  • Stored securely, httpOnly cookies                            │
│                                                                 │
│  Session Monitoring:                                             │
│  • Concurrent session limits (3 max)                           │
│  • Impossible travel detection (new location + old location)    │
│  • Suspicious session flagging                                  │
│                                                                 │
│  Session Termination:                                           │
│  • User logout clears active sessions                          │
│  • Password change invalidates sessions (via Telegram)         │
│  • Admin can force logout                                      │
│  • Automatic cleanup of expired sessions                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Anti-Bot Systems

### 2.1 Suspicious Activity Detection

```
BOT DETECTION FRAMEWORK:
┌─────────────────────────────────────────────────────────────────┐
│  DETECTION CATEGORIES                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. IMPOSSIBLE ACTIVITY SPEED                                   │
│     • Actions completed faster than humanly possible             │
│     • Same action repeated at uniform intervals                 │
│     • Perfect timing on every action                            │
│                                                                 │
│  2. AUTOMATED PATTERNS                                         │
│     • Identical action sequences repeated                        │
│     • No variation in play patterns                             │
│     • 24/7 continuous activity                                  │
│                                                                 │
│  3. ABNORMAL RESOURCE GENERATION                                │
│     • Currency earned exceeds theoretical maximum                │
│     • Rewards claimed without meeting requirements                │
│     • Time-gated content accessed prematurely                    │
│                                                                 │
│  4. EXPLOIT ATTEMPTS                                            │
│     • Modified client data submission                            │
│     • Invalid state transitions                                  │
│     • Out-of-sequence actions                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Detection Thresholds

```
BOT DETECTION THRESHOLDS:
┌─────────────────────────────────────────────────────────────────┐
│  ACTIVITY LIMITS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ACTIONS PER MINUTE:                                             │
│  • Normal: 1-5 actions/minute                                  │
│  • Suspicious: 6-15 actions/minute (flagged)                   │
│  • Likely Bot: 16-30 actions/minute (warning)                   │
│  • Confirmed Bot: 30+ actions/minute (action)                   │
│                                                                 │
│  SAME ACTION SEQUENCES:                                         │
│  • Normal: Varied action types                                  │
│  • Suspicious: 70% same action                                  │
│  • Confirmed: 90%+ same action repeated                         │
│                                                                 │
│  UNIQUE IPS/DEVICES:                                            │
│  • Normal: 1-2 IPs per week                                    │
│  • Suspicious: 3-5 IPs per day                                 │
│  • Confirmed: 10+ different IPs in 24 hours                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Anti-Bot Response Actions

```
RESPONSE ACTIONS:
┌─────────────────────────────────────────────────────────────────┐
│  AUTOMATED RESPONSES                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Level 1 - Monitor:                                              │
│  • Flag account for review                                       │
│  • Increase logging verbosity                                    │
│  • No player disruption                                          │
│                                                                 │
│  Level 2 - Challenge:                                            │
│  • Require CAPTCHA for next action                               │
│  • Slow down response rate                                       │
│  • Temporary friction added                                      │
│                                                                 │
│  Level 3 - Restrict:                                             │
│  • Disable reward claims for 1 hour                             │
│  • Limit action frequency                                       │
│  • Notify player of restriction                                  │
│                                                                 │
│  Level 4 - Suspend:                                              │
│  • Temporary account suspension (1-7 days)                       │
│  • Manual review required                                       │
│  • All rewards frozen during review                              │
│                                                                 │
│  Level 5 - Ban:                                                   │
│  • Permanent account termination                                 │
│  • All associated accounts flagged                              │
│  • Clear evidence required                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Rate Limits

### 3.1 API Rate Limits

```
API RATE LIMITING:
┌─────────────────────────────────────────────────────────────────┐
│  REQUEST LIMITS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PER-USER LIMITS:                                               │
│  • Standard API: 100 requests/minute                            │
│  • Authenticated API: 200 requests/minute                       │
│  • Game Actions: 30 requests/minute                              │
│                                                                 │
│  PER-IP LIMITS:                                                 │
│  • Standard: 500 requests/minute                                │
│  • Burst allowance: 50 extra for 10 seconds                     │
│                                                                 │
│  RESPONSE FOR OVERLIMIT:                                        │
│  • HTTP 429 Too Many Requests                                   │
│  • Retry-After header with seconds                              │
│  • Exponential backoff recommended                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Reward Claim Rate Limits

```
REWARD CLAIM LIMITS:
┌─────────────────────────────────────────────────────────────────┐
│  DAILY CLAIM LIMITS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FREE DAILY PACK:                                               │
│  • 1 claim per 24 hours                                        │
│  • Anti-chain: Cannot claim immediately after creating account   │
│  • Cooldown enforced server-side                                │
│                                                                 │
│  ADSGRAM REWARDS:                                               │
│  • 5 rewarded ads per day                                       │
│  • 1 hour minimum between rewarded ads                         │
│  • Daily counter resets at UTC midnight                         │
│                                                                 │
│  DAILY QUESTS:                                                  │
│  • 3 quests per day (1 easy, 1 medium, 1 hard)                 │
│  • 1 free refresh per day                                      │
│  • Refresh cooldowns enforced                                  │
│                                                                 │
│  ENERGY REGENERATION:                                           │
│  • Capped at natural rate (1 per 5 minutes)                    │
│  • Server-authoritative time tracking                           │
│  • Client-time ignored                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Referral System Limits

```
REFERRAL RATE LIMITS:
┌─────────────────────────────────────────────────────────────────┐
│  REFERRAL PROTECTION                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PER-USER LIMITS:                                               │
│  • Maximum 100 referrals per referrer                          │
│  • Referral rewards capped at milestone limits                  │
│  • Anti-abuse: Same IP cannot refer self                        │
│                                                                 │
│  REFERRAL VALIDATION:                                           │
│  • New user must complete tutorial to credit referrer          │
│  • Minimum play time before reward granted                      │
│  • New account must survive 7 days to credit referrer          │
│                                                                 │
│  MILESTONE LIMITS:                                             │
│  • Rewards at 5, 10, 25, 50, 100 referrals                     │
│  • After 100: No additional rewards                             │
│  • Referral farming economically unviable                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Gift System Limits

```
GIFT SYSTEM LIMITS:
┌─────────────────────────────────────────────────────────────────┐
│  GIFT PROTECTION                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  DAILY LIMITS:                                                  │
│  • 5 coin gifts per friend per day                              │
│  • 3 energy gifts per friend per day                           │
│  • 10 total gifts sent per day                                 │
│                                                                 │
│  GIFT RECEIVING:                                               │
│  • 50 gifts received per day                                   │
│  • Anti-abuse: Gift value capped                               │
│  • Cannot gift to new accounts (7-day wait)                    │
│                                                                 │
│  ECONOMIC LIMITS:                                               │
│  • Gift value: Max 100 Chrono Coins                            │
│  • Gift value: Max 10 Time Energy                             │
│  • Daily gift economy capped per player                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Anti-Spam Rules

### 4.1 Friend Request Protection

```
FRIEND REQUEST ANTI-SPAM:
┌─────────────────────────────────────────────────────────────────┐
│  LIMITS & PROTECTION                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SENDING LIMITS:                                                │
│  • 20 outgoing requests per day                                │
│  • 100 pending requests maximum                                 │
│  • Cannot send to users who blocked you                        │
│  • Cannot send to users who declined recently                   │
│                                                                 │
│  RECEIVING LIMITS:                                              │
│  • 50 incoming requests per day                                │
│  • Auto-decline threshold: 10 rejected requests from same user  │
│                                                                 │
│  ANTI-ABUSE:                                                    │
│  • Cannot friend users who don't play anymore                   │
│  • Block evasion detected and prevented                        │
│  • Mass-friend campaigns detected                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Guild Invitation Protection

```
GUILD INVITATION ANTI-SPAM:
┌─────────────────────────────────────────────────────────────────┐
│  LIMITS & PROTECTION                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  GUILD LEADER:                                                  │
│  • 30 invitations per day                                      │
│  • 50 pending invitations maximum                               │
│  • Cannot invite users in other guilds                         │
│  • Cannot invite users who declined recently                    │
│                                                                 │
│  RECIPIENT:                                                     │
│  • 20 guild invites per day                                    │
│  • Auto-mute invitations from same guild after 3 declines     │
│                                                                 │
│  ANTI-ABUSE:                                                    │
│  • Recruitment spam detected                                    │
│  • Fake guild promotion detected                                │
│  • Cross-guild spam rings detected                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Notification Anti-Spam

```
NOTIFICATION SPAM PROTECTION:
┌─────────────────────────────────────────────────────────────────┐
│  USER-FACING LIMITS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  MAXIMUM NOTIFICATIONS:                                         │
│  • 4 notifications per 24 hours (hard cap)                     │
│  • 1 notification per category per 12 hours                    │
│  • Quiet hours (10PM-8AM): Zero notifications                  │
│                                                                 │
│  NEVER SENT:                                                    │
│  • Repeated duplicate notifications                             │
│  • Notifications for inactive users (>30 days)                 │
│  • More than 2 notifications in sequence                        │
│                                                                 │
│  SYSTEM PROTECTION:                                              │
│  • Notification queue size limited                             │
│  • Priority queue prevents flooding                             │
│  • Global rate limiting prevents cascade                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Chat/Message Protection (Future Guild Chat)

```
CHAT ANTI-SPAM (GUILD CHAT):
┌─────────────────────────────────────────────────────────────────┐
│  FUTURE FEATURE PROTECTION                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  MESSAGE LIMITS:                                                │
│  • 10 messages per minute                                       │
│  • 500 messages per hour                                        │
│  • Flood detection: 5 identical messages                       │
│                                                                 │
│  CONTENT FILTERING:                                             │
│  • Profanity filter (optional per guild)                       │
│  • Link filter (prevent spam links)                             │
│  • Mention spam detection                                       │
│  • Command spam detection                                       │
│                                                                 │
│  MODERATION:                                                    │
│  • Auto-mute after 3 spam violations                            │
│  • Manual mute by guild officers                               │
│  • Report functionality for players                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Economy Protection

### 5.1 Duplicate Reward Prevention

```
DUPLICATE REWARD PROTECTION:
┌─────────────────────────────────────────────────────────────────┐
│  CLAIM TRACKING                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SERVER-SIDE STATE:                                             │
│  • All reward claims tracked in database                         │
│  • Claim cooldown enforced server-side                          │
│  • Idempotency keys prevent double-claims                       │
│                                                                 │
│  DAILY REWARDS:                                                 │
│  • Daily pack: Claimed timestamp tracked                        │
│  • Quest rewards: Completion flag tracked                       │
│  • Event rewards: Receipt flag tracked                          │
│                                                                 │
│  BATTLE PASS:                                                   │
│  • Tier claims: Server-authoritative                           │
│  • Level validation: Cannot claim above current level          │
│  • Duplicate claim: Rejected with error                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Exploit Abuse Detection

```
EXPLOIT DETECTION:
┌─────────────────────────────────────────────────────────────────┐
│  COMMON EXPLOIT PATTERNS                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  RESOURCE EXPLOITS:                                             │
│  • Clock manipulation for faster regeneration                   │
│  • Modified client for unlimited resources                      │
│  • Replay attacks for duplicate rewards                         │
│  • State manipulation for invalid rewards                       │
│                                                                 │
│  BATTLE EXPLOITS:                                               │
│  • Match manipulation for free wins                             │
│  • Disconnect exploits                                          │
│  • Rating farming through losses                                 │
│                                                                 │
│  DETECTION METHODS:                                             │
│  • Server-side validation of all actions                        │
│  • Timestamp analysis for anomalies                              │
│  • Resource flow monitoring                                     │
│  • Statistical anomaly detection                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Suspicious Transaction Detection

```
TRANSACTION MONITORING:
┌─────────────────────────────────────────────────────────────────┐
│  ANOMALY DETECTION                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CURRENCY FLOW:                                                 │
│  • Unusual sink ratios flagged                                  │
│  • Rapid accumulation without source                            │
│  • Trade value anomalies                                        │
│  • Cross-account transfers flagged                              │
│                                                                 │
│  PURCHASE PATTERNS:                                             │
│  • Rapid successive purchases                                   │
│  • Unusual purchase times                                       │
│  • Refund patterns flagged                                      │
│  • Geographic anomalies                                         │
│                                                                 │
│  AUTOMATED RESPONSES:                                           │
│  • Flag for manual review                                       │
│  • Temporary hold on suspicious transactions                    │
│  • Block transaction if confidence high                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Currency Inflation Prevention

```
ECONOMY HEALTH MONITORING:
┌─────────────────────────────────────────────────────────────────┐
│  INFLATION METRICS                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SUPPLY MONITORING:                                             │
│  • Total currency in circulation                                │
│  • Daily minting rate (legitimate sources)                      │
│  • Daily sink rate (legitimate uses)                            │
│  • Net inflation/deflation trend                                │
│                                                                 │
│  PER-PLAYER CAPS:                                               │
│  • Chrono Coins: 1,000,000 cap                                  │
│  • Chrono Dust: 500,000 cap                                     │
│  • Event Tokens: 2,000 cap (14-day expiration)                  │
│  • Premium Currency: Purchased amount only                      │
│                                                                 │
│  BALANCE ADJUSTMENTS:                                           │
│  • Sink rates adjusted if inflation detected                    │
│  • Reward rates adjusted if deflation detected                  │
│  • Seasonal economic reviews                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Fair Play Philosophy

### 6.1 Core Principles

```
FAIR PLAY PILLARS:
┌─────────────────────────────────────────────────────────────────┐
│  PROTECT HONEST PLAYERS                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Innocent until proven guilty                                 │
│  ✓ Manual review before severe penalties                        │
│  ✓ Clear communication about violations                         │
│  ✓ Appeal process for disputed decisions                        │
│  ✓ Protection from false accusations                           │
│  ✓ Privacy preserved during investigations                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PUNISH EXPLOITERS FAIRLY                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Proportional punishment to offense                           │
│  ✓ Clear evidence required for bans                            │
│  ✓ Escalation before permanent action                           │
│  ✓ Documented violation categories                              │
│  ✓ Consistent enforcement across players                        │
│  ✓ Accountability for automated systems                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AVOID FALSE POSITIVES                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Legitimate players never punished                           │
│  ✓ Edge cases considered                                       │
│  ✓ Human review before critical actions                        │
│  ✓ Whitelist for verified legitimate patterns                   │
│  ✓ Grace period for new behavior patterns                       │
│  ✓ False positive reporting system                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Investigation Process

```
INVESTIGATION WORKFLOW:
┌─────────────────────────────────────────────────────────────────┐
│  VIOLATION REVIEW PROCESS                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. DETECTION                                                   │
│     • Automated system flags anomaly                           │
│     • Pattern recognized in data                                │
│     │                                                            │
│  2. TRIAGE                                                      │
│     • Low confidence → Monitor only                            │
│     • Medium confidence → Add friction                          │
│     • High confidence → Flag for review                         │
│     │                                                            │
│  3. INVESTIGATION                                               │
│     • Review player history                                    │
│     • Analyze specific incident                                 │
│     • Check for false positive patterns                        │
│     │                                                            │
│  4. DECISION                                                    │
│     • Clear violation → Apply penalty                          │
│     • Uncertain → Continue monitoring                          │
│     • False positive → Clear flag                             │
│     │                                                            │
│  5. COMMUNICATION                                               │
│     • Notify player of action taken                            │
│     • Explain reason if applicable                             │
│     • Provide appeal path                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Violation Categories

### 7.1 Violation Levels

```
VIOLATION CATEGORIES:
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 1: WARNING                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • First minor infractions                                       │
│  • Unintentional exploitation                                   │
│  • Suspicious but unconfirmed activity                          │
│  ─────────────────────────────────────────────────────────────  │
│  Response: Formal warning, increased monitoring                 │
│  Duration: None (instant)                                       │
│  Appeal: Not required                                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LEVEL 2: TEMPORARY RESTRICTION                                 │
│  ─────────────────────────────────────────────────────────────  │
│  • Repeated minor violations                                    │
│  • Minor exploit abuse                                          │
│  • Bot-like behavior confirmed                                   │
│  • Spam violations                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Response: Feature restrictions, action cooldowns               │
│  Duration: 1-24 hours                                          │
│  Appeal: Available after restriction ends                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LEVEL 3: TEMPORARY SUSPENSION                                  │
│  ─────────────────────────────────────────────────────────────  │
│  • Significant exploit abuse                                    │
│  • Automated farming confirmed                                   │
│  • Serious spam campaigns                                       │
│  • Repeated Level 2 violations                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Response: Account access suspended                             │
│  Duration: 1-7 days                                            │
│  Appeal: Available during suspension                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LEVEL 4: PERMANENT BAN                                          │
│  ─────────────────────────────────────────────────────────────  │
│  • Severe exploit abuse                                         │
│  • Real-money trading                                          │
│  • Account sharing services                                     │
│  • Harmful botting                                              │
│  • Repeated Level 3 violations                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Response: Permanent account termination                        │
│  Duration: Permanent                                            │
│  Appeal: Single appeal review                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Escalation Rules

```
ESCALATION MATRIX:
┌─────────────────────────────────────────────────────────────────┐
│  PREVIOUS VIOLATION → NEW VIOLATION → RESULT                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  None → Minor → Level 1 Warning                                │
│  None → Moderate → Level 2 Restriction                          │
│  None → Severe → Level 3 Suspension                            │
│                                                                 │
│  Level 1 → Same category → Level 2                             │
│  Level 2 → Same category → Level 3                             │
│  Level 3 → Any violation → Level 4 (permanent)                │
│                                                                 │
│  Different category: Reset to Level 1                          │
│  90 days clean: Reset to Level 0                               │
│  Evidence of intent: Skip one level                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Logging Philosophy

### 8.1 Logged Events

```
SECURITY EVENT LOGGING:
┌─────────────────────────────────────────────────────────────────┐
│  IMPORTANT ACTIONS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • Account creation                                             │
│  • Authentication events                                        │
│  • Permission changes                                           │
│  • Admin actions                                                │
│  • Payment processing                                           │
│  • Account recovery requests                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ECONOMY CHANGES                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Currency transactions (gains and losses)                    │
│  • Reward claims                                                │
│  • Purchase transactions                                        │
│  • Trade/gift transactions                                      │
│  • Refund requests                                              │
│  • Currency cap reached                                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SUSPICIOUS BEHAVIOR                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • Rate limit violations                                        │
│  • Bot detection flags                                          │
│  • Exploit attempts                                             │
│  • Invalid authentication                                       │
│  • Unusual patterns                                             │
│  • Permission denied events                                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  CRITICAL ERRORS                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • System failures                                             │
│  • Database errors                                              │
│  • Authentication failures                                      │
│  • Transaction failures                                         │
│  • Security violations                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Data Privacy in Logs

```
LOG PRIVACY PRINCIPLES:
┌─────────────────────────────────────────────────────────────────┐
│  SENSITIVE DATA HANDLING                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  NEVER LOG:                                                     │
│  • Telegram session tokens                                       │
│  • Passwords (even hashed)                                      │
│  • Full payment card numbers                                    │
│  • Telegram API keys exposed to client                          │
│  • Personal identifiable information beyond Telegram ID         │
│                                                                 │
│  ANONYMIZE WHERE POSSIBLE:                                      │
│  • IP addresses hashed or truncated                             │
│  • Device identifiers generalized                               │
│  • Session IDs logged, not user IDs in same log line            │
│                                                                 │
│  LOG RETENTION:                                                 │
│  • Security logs: 90 days                                       │
│  • Audit logs: 1 year                                          │
│  • Economy logs: 2 years                                        │
│  • Violation records: Duration of ban + 1 year                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Log Security

```
LOG PROTECTION:
┌─────────────────────────────────────────────────────────────────┐
│  STORAGE SECURITY                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ACCESS CONTROLS:                                                │
│  • Logs write-only for application                              │
│  • Read access requires elevated permissions                    │
│  • Separate log storage from application                       │
│                                                                 │
│  INTEGRITY:                                                     │
│  • Append-only storage                                          │
│  • Tamper-evident logging                                       │
│  • Regular backup verification                                  │
│                                                                 │
│  ANALYSIS:                                                      │
│  • Automated anomaly detection                                   │
│  • Manual review triggers                                       │
│  • Alerting on critical events                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Referral Protection

### 9.1 Fake Account Prevention

```
FAKE ACCOUNT DETECTION:
┌─────────────────────────────────────────────────────────────────┐
│  DETECTION METHODS                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  BEHAVIORAL:                                                    │
│  • No social connections (0 friends)                           │
│  • No meaningful activity (no quests, no collection)           │
│  • Template names (User123456)                                 │
│  • Created immediately before referral                          │
│                                                                 │
│  TECHNICAL:                                                     │
│  • Same IP as referrer                                         │
│  • Device fingerprint matches referrer                          │
│  • Telegram account age less than referral link age             │
│                                                                 │
│  VALIDATION:                                                    │
│  • Must complete tutorial (5+ minutes)                          │
│  • Must earn first reward (not just created)                   │
│  • Must survive 24 hours to credit referrer                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Self-Referral Prevention

```
SELF-REFERRAL PROTECTION:
┌─────────────────────────────────────────────────────────────────┐
│  PREVENTION METHODS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TECHNICAL BLOCKS:                                              │
│  • Same Telegram ID cannot refer self                           │
│  • Same IP during account creation blocked                      │
│  • Same device fingerprint blocked                              │
│  • Same billing address blocked (premium)                       │
│                                                                 │
│  LOGICAL BLOCKS:                                                │
│  • Referral reward disabled until new user is active            │
│  • New account must reach Level 3                              │
│  • Reward granted only after verification                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Referral Farming Detection

```
FARMING DETECTION:
┌─────────────────────────────────────────────────────────────────┐
│  FARMING PATTERNS                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  • Mass referrals from single user (>10/day)                   │
│  • Referral accounts with no activity                           │
│  • Referral accounts all with same characteristics              │
│  • Coordinated referral patterns across accounts                │
│  • Referral rewards exceeding normal value                      │
│                                                                 │
│  RESPONSE:                                                      │
│  • Flag account for review                                      │
│  • Withhold referral rewards pending verification               │
│  • Suspend account if farming confirmed                         │
│  • Ban accounts if coordinated farming detected                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. AdsGram Abuse Protection

### 10.1 Automated Ad Farming Detection

```
AD FARMING DETECTION:
┌─────────────────────────────────────────────────────────────────┐
│  SUSPICIOUS PATTERNS                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TIMING PATTERNS:                                               │
│  • Ads watched at exact same time daily                         │
│  • Perfect intervals between ad views                           │
│  • 24/7 ad watching capability                                  │
│  • No variation in watching times                                │
│                                                                 │
│  BEHAVIORAL PATTERNS:                                           │
│  • Watch ad immediately leave app                               │
│  • Never engage with game content                               │
│  • Always watch minimum required time                           │
│  • Never watch ads outside daily limit                          │
│                                                                 │
│  TECHNICAL PATTERNS:                                            │
│  • Same device generating multiple sessions                     │
│  • Emulator detection                                           │
│  • VPN/proxy usage                                              │
│  • Automated watching software indicators                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Exploit Attempt Prevention

```
AD EXPLOIT PREVENTION:
┌─────────────────────────────────────────────────────────────────┐
│  EXPLOIT TYPES                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  • Reward duplication via replay                                │
│  • Modified client claiming fake ad views                       │
│  • Session hijacking for rewards                               │
│  • Server state manipulation                                    │
│  • Reward generation without ad view                            │
│                                                                 │
│  PREVENTION:                                                    │
│  • AdsGram SDK handles reward validation                        │
│  • Server-side reward issuance only                            │
│  • Idempotency keys for ad rewards                             │
│  • Rate limiting on reward claims                               │
│  • Server-authoritative reward state                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.3 Fair Reward Distribution

```
FAIR ADSGRAM PRINCIPLES:
┌─────────────────────────────────────────────────────────────────┐
│  REWARD INTEGRITY                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Rewards only issued by server                                │
│  ✓ AdsGram SDK validation required                              │
│  ✓ Human verification for anomalies                             │
│  ✓ Fair distribution across legitimate players                  │
│  ✓ Anti-farming measures protect player value                   │
│                                                                 │
│  PLAYER PROTECTION:                                            │
│  • Legitimate players never penalized                          │
│  • Farming accounts permanently banned                         │
│  • Rewards cannot be devalued by abuse                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Telegram Bot Protection

### 11.1 Command Spam Prevention

```
BOT COMMAND PROTECTION:
┌─────────────────────────────────────────────────────────────────┐
│  RATE LIMITING                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PER-USER LIMITS:                                               │
│  • 10 commands per minute                                       │
│  • 60 commands per hour                                         │
│  • Burst allowance: 3 extra commands for 10 seconds            │
│                                                                 │
│  OVER LIMIT:                                                   │
│  • "Please wait before sending another command"                │
│  • Temporary mute (1 minute)                                   │
│  • Repeated violations: Longer mute                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Notification Abuse Prevention

```
NOTIFICATION ABUSE:
┌─────────────────────────────────────────────────────────────────┐
│  PREVENTION                                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  USER PROTECTION:                                               │
│  • Cannot request notifications to other users                  │
│  • Mass notification to self is rate-limited                    │
│  • Notification amplification attacks blocked                    │
│                                                                 │
│  SYSTEM PROTECTION:                                             │
│  • Global notification rate limiting                           │
│  • Queue size limits                                           │
│  • Priority queuing prevents flooding                          │
│  • Automatic DDoS protection                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 Message Flood Protection

```
MESSAGE FLOOD PROTECTION:
┌─────────────────────────────────────────────────────────────────┐
│  FLOOD DETECTION                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PATTERN:                                                       │
│  • More than 5 identical messages in 10 seconds                │
│  • More than 20 messages per minute from single user          │
│  • Message flooding detected                                    │
│                                                                 │
│  RESPONSE:                                                      │
│  • Auto-delete flood messages                                  │
│  • Temporary mute (5 minutes first offense)                    │
│  • Escalating mutes for repeated flooding                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Privacy Philosophy

### 12.1 Data Minimization

```
MINIMAL DATA COLLECTION:
┌─────────────────────────────────────────────────────────────────┐
│  COLLECT ONLY NECESSARY                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TELEGRAM DATA (Required):                                      │
│  • Telegram User ID (account identifier)                        │
│  • Telegram Username (optional, for display)                     │
│  • Telegram First/Last Name (optional)                         │
│                                                                 │
│  GAME DATA (Required):                                          │
│  • Game progress and state                                      │
│  • In-game currency balances                                    │
│  • Collection/inventory data                                    │
│  • Achievement and milestone data                               │
│                                                                 │
│  TECHNICAL DATA (Minimal):                                      │
│  • IP address (for security, not persistent)                    │
│  • Device type (for optimization)                               │
│  • Session timestamps                                           │
│                                                                 │
│  NEVER COLLECT:                                                 │
│  • Phone numbers                                                │
│  • Email addresses                                              │
│  • Location data                                                │
│  • Contacts                                                     │
│  • Messages outside game context                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Player Privacy Rights

```
PLAYER PRIVACY RIGHTS:
┌─────────────────────────────────────────────────────────────────┐
│  TRANSPARENCY & CONTROL                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  RIGHT TO KNOW:                                                 │
│  • Clear privacy policy                                         │
│  • Data collection disclosure                                    │
│  • Third-party sharing disclosure                               │
│                                                                 │
│  RIGHT TO ACCESS:                                               │
│  • View all stored data via /profile                           │
│  • Request full data export (future)                           │
│  • Clear explanation of data usage                              │
│                                                                 │
│  RIGHT TO DELETE:                                               │
│  • Account deletion via support                                │
│  • Data removed within 30 days                                  │
│  • Legal hold exceptions explained                             │
│                                                                 │
│  RIGHT TO RECTIFY:                                              │
│  • Correct inaccurate data                                     │
│  • Update outdated information                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.3 Third-Party Data Sharing

```
THIRD-PARTY SHARING:
┌─────────────────────────────────────────────────────────────────┐
│  SHARING PRINCIPLES                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  NEVER SHARE:                                                   │
│  • User data with advertisers                                  │
│  • Personal information with partners                           │
│  • Data with analytics third parties                            │
│  • Telegram ID with unrelated services                          │
│                                                                 │
│  LIMITED SHARING:                                               │
│  • Anonymized game stats with community features               │
│  • Aggregated metrics for leaderboards                        │
│  • Required legal disclosures                                   │
│                                                                 │
│  TELEGRAM INTEGRATION:                                          │
│  • Telegram auth uses standard Telegram flow                    │
│  • Ads served via AdsGram (their data policy)                   │
│  • No additional data to Telegram beyond auth                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Future Security Features

### 13.1 Anomaly Detection System

```
FUTURE: ADVANCED ANOMALY DETECTION

Description:
Machine learning system that identifies unusual patterns
in player behavior to detect novel exploit types.

Potential Features:
• Baseline behavior profiling per player
• Clustering analysis for coordinated abuse
• Real-time anomaly scoring
• Adaptive threshold adjustment
• Reduced false positive rates

Technical Requirements:
• Feature engineering for game-specific patterns
• Training data from confirmed violations
• Model retraining pipeline
• Explainable alerts for reviewers
• Integration with existing systems

Timeline: Phase 2+ (requires baseline data)
Status: Planned, not implemented
```

### 13.2 Machine Learning Anti-Cheat

```
FUTURE: ML-POWERED ANTI-CHEAT

Description:
Advanced detection system using machine learning to
identify cheating and exploitation patterns.

Potential Features:
•Bot detection without signature matching
•Exploit prediction before widespread use
•Coordinated attack group identification
•Adaptive response to new cheat methods
•Continuous model improvement

Capabilities:
• Pattern recognition across millions of events
• Detect novel exploit variations
• Identify account farms automatically
• Real-time risk scoring
• Reduced manual investigation needs

Implementation Notes:
• Requires significant training data
• Needs dedicated ML infrastructure
• Should augment, not replace, rule-based systems
• Must maintain interpretability for appeals

Timeline: Phase 3+
Status: Research/planning only
```

### 13.3 Reputation System

```
FUTURE: PLAYER REPUTATION SYSTEM

Description:
Trust and reputation score that affects gameplay
and interaction permissions.

Potential Features:
• Trust score based on account age, activity, violations
• Higher trust = faster support, fewer restrictions
• Lower trust = additional verification, limited features
• Community-driven trust through positive interactions

Trust Tiers:
• New Player: Limited features, higher scrutiny
• Established: Normal features
• Trusted: Faster support, beta access
• Verified: Identity verification for special features

Implementation Notes:
• Must avoid punishing new legitimate players
• Should reward positive behavior, not just punish negative
• Privacy-preserving (reputation not visible to others)
• Appeal process for incorrect scores

Timeline: Phase 2+
Status: Design consideration only
```

### 13.4 Advanced Fraud Detection

```
FUTURE: FINANCIAL FRAUD PREVENTION

Description:
Enhanced system for detecting payment fraud,
refund abuse, and monetization exploits.

Potential Features:
• Payment velocity monitoring
• Geographic anomaly detection
• Device risk scoring
• Refund pattern analysis
• Chargeback prediction

Integration:
• Payment processor fraud tools
• Device fingerprinting
• Behavioral analytics
• Cross-account correlation

Timeline: Phase 2+ (when premium launches)
Status: Standard payment integration initially
```

---

## 14. Security Response Procedures

### 14.1 Incident Response

```
SECURITY INCIDENT HANDLING:
┌─────────────────────────────────────────────────────────────────┐
│  INCIDENT CATEGORIES                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  P1 - Critical:                                                │
│  • Active exploitation in progress                             │
│  • Data breach                                                  │
│  • Service down                                                 │
│  • Response: Immediate, 24/7                                   │
│                                                                 │
│  P2 - High:                                                     │
│  • Confirmed exploit abuse                                      │
│  • Large-scale botting                                         │
│  • Response: Within 4 hours                                    │
│                                                                 │
│  P3 - Medium:                                                  │
│  • Suspected abuse                                             │
│  • Anomaly detected                                            │
│  • Response: Within 24 hours                                   │
│                                                                 │
│  P4 - Low:                                                      │
│  • False positive investigation                                 │
│  • Minor policy violation                                      │
│  • Response: Within 72 hours                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 Emergency Procedures

```
EMERGENCY CONTROLS:
┌─────────────────────────────────────────────────────────────────┐
│  CONTAINMENT                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ACCOUNT ISOLATION:                                             │
│  • Suspected exploiters can be frozen instantly                 │
│  • No game impact on other players                             │
│  • Evidence preserved                                           │
│                                                                 │
│  ECONOMY PROTECTION:                                            │
│  • Economy-wide freezes available if needed                     │
│  • Suspicious transactions can be reverted                     │
│  • Reward systems can be disabled immediately                   │
│                                                                 │
│  ROLLBACK CAPABILITY:                                           │
│  • Point-in-time recovery for affected accounts                │
│  • Economy state restoration                                    │
│  • Battle outcome reversal                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. Security Architecture

### 15.1 System Components

```
SECURITY LAYERS:
┌─────────────────────────────────────────────────────────────────┐
│  TELEGRAM BOT API                                               │
│  ├── Telegram-provided authentication                          │
│  ├── WebApp initData validation                                │
│  └── Rate limiting at entry point                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  APPLICATION LAYER                                              │
│  ├── Session management                                         │
│  ├── Authorization checks                                       │
│  ├── Input validation                                           │
│  └── Business logic enforcement                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  DATA LAYER                                                     │
│  ├── Row Level Security (Supabase)                              │
│  ├── Transaction integrity                                      │
│  └── Audit logging                                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  MONITORING LAYER                                               │
│  ├── Anomaly detection                                         │
│  ├── Alert systems                                              │
│  └── Automated responses                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 Key Security Controls

```
SECURITY CHECKLIST:
┌─────────────────────────────────────────────────────────────────┐
│  AUTHENTICATION                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Telegram initData validation on every request               │
│  ✓ JWT tokens with short expiration                            │
│  ✓ Token refresh rotation                                      │
│  ✓ Concurrent session limits                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  AUTHORIZATION                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Server-side permission validation                           │
│  ✓ Resource ownership verification                              │
│  ✓ Admin action authorization                                  │
│  ✓ Feature flag security                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  INPUT VALIDATION                                               │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Type validation                                              │
│  ✓ Range validation                                             │
│  ✓ Sanitization                                                 │
│  ✓ SQL injection prevention                                     │
│  ✓ XSS prevention                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  OUTPUT ENCODING                                                │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ HTML encoding for displayed data                             │
│  ✓ JSON encoding for API responses                             │
│  ✓ Safe redirect handling                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Compliance

### 16.1 Regulatory Compliance

```
COMPLIANCE FRAMEWORK:
┌─────────────────────────────────────────────────────────────────┐
│  APPLICABLE STANDARDS                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  GDPR (European Union):                                         │
│  • Lawful basis for processing                                 │
│  • Data subject rights implementation                          │
│  • Data protection impact assessments                          │
│  • Breach notification procedures                              │
│                                                                 │
│  Telegram Platform Rules:                                       │
│  • Mini App guidelines compliance                               │
│  • Bot API usage compliance                                     │
│  • User data handling requirements                              │
│                                                                 │
│  Payment Regulations:                                           │
│  • Payment card industry compliance (if storing cards)         │
│  • Telegram Stars integration (Telegram handles)                │
│  • TON/crypto compliance (future)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Security should protect honest players, not burden them. Invisible security creates visible trust.*
