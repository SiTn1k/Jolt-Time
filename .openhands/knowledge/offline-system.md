# Jolt Time — Offline Support and Synchronization System

## Overview

Jolt Time is primarily an online experience. However, temporary internet interruptions should not create a frustrating user experience. The goal is to minimize frustration, recover gracefully, and prioritize data safety.

**Core Philosophy:** The application remains usable during short disconnections, protects player actions, and avoids data loss. When online, synchronization happens safely without duplicated rewards or data corruption.

---

## Offline Categories

### Temporary Offline Mode

Temporary offline mode handles brief network interruptions without disrupting the player experience:

- **Seamless Transition** — Detect disconnection within 2-3 seconds without user intervention
- **Visual Indicator** — Non-intrusive offline badge shows current connection state
- **Graceful Degradation** — Non-essential features disabled, core gameplay continues
- **Auto Recovery** — Automatically detect and recover when connection returns
- **Session Preservation** — Maintain all user state during brief disconnections
- **Background Processing** — Queue operations while offline, sync when reconnected

### Cached Data

Essential player data is cached locally for offline access:

- **Player Profile** — Username, avatar, settings, preferences
- **Museum Data** — Collection state, exhibition progress, unlock status
- **Settings** — All user preferences including accessibility options
- **Content Cache** — Previously loaded historical content, images, descriptions
- **Recent Actions** — Actions taken in current session for sync later
- **UI State** — Current screen, scroll position, expanded sections

### Synchronization System

When connection returns, the system synchronizes queued actions safely:

- **Queue Management** — FIFO processing of queued operations
- **Duplicate Prevention** — Server-side idempotency prevents duplicate rewards
- **Conflict Resolution** — Server state takes precedence with merge strategies
- **Atomic Operations** — Critical operations complete fully or not at all
- **Sync Validation** — Server validates all client-sent operations
- **Rollback Support** — Ability to rollback failed sync operations

### Connection Recovery

Connection recovery handles the transition back to online state:

- **Automatic Reconnection** — Transparent retry with exponential backoff
- **Retry Mechanisms** — Configurable retry count and intervals
- **Recovery Notifications** — Clear feedback when connection restored
- **Sync Progress** — Show sync status during recovery
- **Partial Sync** — Sync incrementally as data becomes available
- **Complete Validation** — Verify sync success before resuming full operations

---

## Offline Philosophy

The application remains usable during short disconnections, protects player actions, and avoids data loss.

### Remain Usable During Short Disconnections

- **Core Gameplay Continues** — View collections, browse content, review progress
- **Read-Only Mode** — View cached content without write operations
- **Non-Blocking UI** — Interface remains responsive without network calls
- **Session Timeout Extension** — Extend session during offline periods
- **Background Sync** — Queue operations without blocking user actions
- **Offline Landing** — Graceful display when offline detected

### Protect Player Actions

- **Action Queuing** — All player actions saved to local queue immediately
- **Local Validation** — Validate actions locally before queueing
- **Priority Queuing** — Urgent actions processed first on reconnect
- **Action Timestamps** — Precise timestamps for ordering queued actions
- **Action Deduplication** — Prevent duplicate action queueing
- **Crash Protection** — Queue persists across app restarts

### Avoid Data Loss

- **Persistent Queue** — Offline queue stored in persistent storage
- **IndexedDB Backup** — Fallback storage for critical queue data
- **Queue Integrity** — Verify queue contents before sync
- **Recovery Verification** — Confirm each queued action processed
- **Audit Trail** — Log all sync operations for debugging
- **Graceful Failure** — Never lose player actions even on repeated failure

---

## Cached Content Notes

Essential player information is cached locally for offline access.

### Player Profile

- **Profile Data** — Username, display name, avatar URL, creation date
- **Settings Sync** — All accessibility and preference settings
- **Subscription Status** — Premium status cached for offline feature gates
- **Last Sync Time** — Timestamp of last successful synchronization
- **Progression Summary** — Current level, XP, prestige points summary
- **Social Links** — Friend count, guild membership (read-only)

### Museum Data

- **Collection State** — Which artifacts collected, rarity, era
- **Exhibition Progress** — Current exhibition completion percentage
- **Unlock Status** — Which displays and wings are unlocked
- **Pending Display** — Items queued for display placement
- **Collection Statistics** — Total items, completion percentage
- **Historical Content** — Previously viewed historical descriptions

### Settings

- **Accessibility Options** — Text size, theme, reduced motion
- **Notification Preferences** — Per-category notification settings
- **Display Options** — Card view preferences, sort orders
- **Language Selection** — Chosen language for offline content
- **Sound Settings** — Audio volume, notification sounds
- **Privacy Options** — Profile visibility, data sharing preferences

### Previously Loaded Content

- **Asset Cache** — Images, icons, sprites previously loaded
- **Historical Content** — Text content for viewed eras and artifacts
- **UI Components** — Cached component definitions
- **API Responses** — Cached responses for repeated queries
- **Bundle Cache** — Cached JavaScript bundle chunks
- **Font Cache** — Web fonts used in the application

---

## Synchronization Philosophy

When the connection returns, pending actions synchronize safely without duplicated rewards or conflicts.

### Pending Actions Synchronize Safely

- **Sequential Processing** — Queue processed in strict order
- **Server Validation** — Server validates each action independently
- **Incremental Sync** — Process actions one at a time with confirmation
- **Batch Processing** — Group independent actions for efficiency
- **Failure Isolation** — Single failure doesn't block entire queue
- **Retry Queue** — Failed actions automatically retried

### Duplicated Rewards Must Be Prevented

- **Idempotency Keys** — Unique key per action prevents duplicate processing
- **Server-Side Deduplication** — Server tracks processed action IDs
- **Reward Locks** — Server-side locks during reward processing
- **Consistency Checks** — Verify reward state before granting
- **Double-Submit Prevention** — Disable button during reward processing
- **Audit Logging** — Log all reward grants with action IDs

### Conflicts Handled Gracefully

- **Last-Write-Wins** — Default strategy for simple conflicts
- **Server Authority** — Server state is source of truth
- **Merge Strategy** — Combine non-conflicting changes
- **Conflict Notification** — Notify user of resolved conflicts
- **Manual Resolution** — Option for user to resolve major conflicts
- **Conflict Logging** — Record all conflicts for analysis

---

## Connection Recovery Notes

The system supports automatic reconnection, retry mechanisms, and recovery notifications.

### Automatic Reconnection

- **Network Detection** — Monitor navigator.onLine and network APIs
- **Heartbeat Checks** — Periodic lightweight ping to verify connection
- **Quick Retry** — Immediate retry on brief disconnection
- **Background Retry** — Continue retrying when app in background
- **Foreground Notification** — Alert user only after extended offline
- **Smart Backoff** — Increase retry interval gradually

### Retry Mechanisms

- **Exponential Backoff** — Double retry interval each attempt (1s, 2s, 4s, 8s...)
- **Jitter Addition** — Random jitter prevents thundering herd
- **Maximum Retries** — Cap retries to prevent infinite loops
- **Retry Budget** — Limit total retry time before giving up
- **Circuit Breaker** — Stop retrying after repeated failures
- **User-Triggered Retry** — Manual retry button after max attempts

### Recovery Notifications

- **Connection Restored** — Clear toast when back online
- **Sync Started** — Notification that sync is in progress
- **Sync Progress** — Progress indicator for large syncs
- **Sync Complete** — Confirmation when all data synchronized
- **Partial Sync** — Warning if some items failed to sync
- **Manual Action Required** — Clear instruction if user must do something

---

## Error Handling Philosophy

Players receive understandable messages, recovery instructions, and clear status indicators.

### Understandable Messages

- **Plain Language** — No technical jargon in error messages
- **Action-Oriented** — Focus on what user can do, not what went wrong
- **Consistent Tone** — Same friendly tone across all errors
- **Localized** — All messages in player's language
- **Concise** — Brief messages that don't overwhelm
- **Accurate** — Describe actual problem accurately

### Recovery Instructions

- **Clear Next Steps** — Exactly what user should do to recover
- **If Online** — "Please check your internet connection and try again"
- **If Offline** — "This feature requires internet. Your progress is saved."
- **If Error Persists** — "Contact support if this keeps happening"
- **Help Links** — Link to help documentation where relevant
- **Retry Action** — Prominent retry button when applicable

### Clear Status Indicators

- **Online/Offline Badge** — Always-visible connection status
- **Sync Status** — Icons showing pending/syncing/synced state
- **Error Indicators** — Clear visual error states
- **Progress Indicators** — For operations in progress
- **Queue Count** — Badge showing number of pending actions
- **Last Sync Time** — "Last synced 2 minutes ago"

---

## Offline Statistics

Track synchronization attempts, connection failures, and recovery success rates.

### Synchronization Attempts

- **Sync Count** — Total number of sync operations
- **Sync Success Rate** — Percentage of successful syncs
- **Sync Duration** — Average time to complete sync
- **Actions Synced** — Number of actions processed per sync
- **Sync Frequency** — How often syncs occur
- **Peak Sync Times** — When most syncs happen

### Connection Failures

- **Failure Count** — Total disconnection events
- **Failure Duration** — Average time offline per event
- **Failure Reasons** — Categorized by failure type
- **Network Type** — WiFi vs cellular breakdown
- **Recovery Rate** — Percentage that recovered automatically
- **User-Initiated Recovery** — User manually triggered retry

### Recovery Success Rates

- **Recovery Rate** — Percentage of offline events that recovered
- **Time to Recovery** — Average time to reconnect
- **Sync After Recovery** — Percentage that synced after recovery
- **Data Integrity** — Percentage of syncs without data loss
- **Conflict Rate** — Percentage of syncs with conflicts
- **User Satisfaction** — Correlation with user feedback

---

## Telegram Mini App Limitations

Certain systems require internet access. The application handles these limitations gracefully.

### Systems That Require Internet Access

- **Real-Time Gameplay** — Battle pass progression, live events
- **Ad Viewing** — AdsGram reward ads
- **Multiplayer Features** — Guild battles, PvP, cooperative modes
- **Social Actions** — Adding friends, sending gifts, trading
- **Marketplace** — Buying, selling, listing items
- **Live Leaderboards** — Real-time ranking updates
- **Push Notifications** — Telegram push delivery
- **Cloud Saves** — Backup and restore features
- **Account Linking** — New authentication flows

### Features Unavailable Offline

- **New Artifact Collection** — Cannot collect new artifacts
- **Quest Progression** — Cannot advance quests requiring server validation
- **In-App Purchases** — Cannot make purchases
- **Real-Time Events** — Cannot participate in live events
- **Guild Activities** — Cannot interact with guild features
- **Story Mode Progress** — Cannot advance story (may cache recent progress)

### Expected Behavior

- **Read Cached Content** — Can browse previously loaded content
- **View Collections** — Full access to owned artifacts and items
- **Review Progress** — Can see all progression data
- **Edit Settings** — Can change preferences (queued for sync)
- **Browse Museum** — Can navigate existing exhibitions
- **View Notifications** — Can see cached notification history
- **Offline Games** — Can play any fully offline mini-games

---

## AdsGram Offline Notes

AdsGram remains the primary revenue system. Reward ads require internet access. Failed reward requests retry safely and preserve reward integrity.

### Internet Requirement

- **Ad Loading** — Requires active connection to fetch and display ads
- **Reward Verification** — Server must verify reward eligibility
- **Analytics** — Ad views must be reported to ad network
- **Revenue Attribution** — Rewards must be tracked for payment

### Failed Reward Request Handling

- **Retry Safety** — Retry requests use idempotency keys
- **Duplicate Prevention** — Server tracks all reward claim attempts
- **Queue System** — Failed requests queued for retry when online
- **Maximum Retries** — Limit retries to prevent infinite loops
- **User Notification** — Clear message if reward delayed
- **Fallback Grant** — If ad fails completely, grant reward anyway

### Preserve Reward Integrity

- **Reward Locks** — Lock reward during processing
- **Atomic Grants** — Reward either fully granted or not at all
- **Verification First** — Verify ad eligibility before granting reward
- **Audit Trail** — Complete log of all reward operations
- **Consistency Checks** — Verify player state before and after
- **Recovery Priority** — Reward syncs prioritized over other operations

---

## Data Integrity Philosophy

Protect inventories, currencies, and progression data from corruption.

### Protect Inventories

- **Server Authority** — Server is source of truth for all items
- **Ownership Verification** — Verify ownership before any operation
- **Quantity Validation** — Server validates all quantity changes
- **Transaction Atomicity** — Item transactions complete fully or not at all
- **Rollback Support** — Reverse failed transactions completely
- **Audit Trail** — Complete log of all inventory changes

### Protect Currencies

- **Balance Validation** — Verify sufficient balance before spending
- **Atomic Transactions** — Currency changes are atomic
- **Negative Prevention** — Balances cannot go negative
- **Concurrent Update Safety** — Handle simultaneous spend attempts
- **Daily Limits** — Cap on currency changes per time period
- **Recovery Safety** — Restore balance if transaction fails mid-process

### Protect Progression Data

- **XP Validation** — Server validates all XP gains
- **Level Verification** — Verify level-up conditions server-side
- **Achievement Validation** — Server verifies achievement criteria
- **Progress Checkpoints** — Regular saves of progression state
- **Recovery Integrity** — Restore to consistent state after failure
- **Anti-Exploit** — Server-side validation prevents all exploits

---

## Future Expansion Notes

These features are documented for future implementation.

### Offline Collections

- **Offline Artifact Viewing** — Enhanced catalog browsing offline
- **Collection Management** — Organize collections without connection
- **Wishlist Editing** — Manage wishlists offline
- **Search History** — Cached search results for offline browsing
- **Recommendation Cache** — Personalized recommendations cached
- **Collection Statistics** — Full stats calculated locally

### Advanced Local Storage

- **IndexedDB Migration** — Move from localStorage to IndexedDB
- **Structured Data** — Store complex objects efficiently
- **Query Capability** — Query local data like a database
- **Storage Limits** — Handle browser storage quotas gracefully
- **Data Compression** — Compress cached data for more storage
- **Storage Management** — UI to manage and clear cache

### Background Synchronization

- **Service Worker Sync** — Sync when app not active
- **Background API** — Use Background Sync API where supported
- **Periodic Sync** — Periodic sync even without user action
- **Push Sync** — Server-initiated sync via push notifications
- **Sync Prioritization** — Prioritize critical data in background sync
- **Conflict Resolution UI** — Resolve conflicts when convenient

### Partial Offline Gameplay

- **Single-Player Mode** — Fully offline single-player experience
- **Offline Quests** — Complete quests without server
- **Practice Mode** — Practice gameplay offline
- **Offline Achievements** — Local achievement tracking
- **Demo Content** — Playable demo content offline
- **Catch-Up Mode** — Offline progress syncs when online

---

## Long-Term Philosophy

Jolt Time minimizes frustration, recovers gracefully, and prioritizes data safety.

### Minimize Frustration

- **Seamless Offline** — Offline transition invisible to user
- **No Punishment** — Offline never blocks progress unfairly
- **Clear Expectations** — User knows what works offline
- **Persistent State** — Never lose user work or progress
- **Quick Recovery** — Fast reconnect and sync when possible
- **Patient Design** — Never require immediate action

### Recover Gracefully

- **Automatic Recovery** — Handle most issues without user help
- **Transparent Process** — User sees sync progress when relevant
- **Forgiving Design** — Allow undo and correction
- **Incremental Progress** — Partial sync better than no sync
- **Fallback Paths** — Multiple ways to recover from failure
- **Learning System** — Improve based on failure patterns

### Prioritize Data Safety

- **Zero Data Loss** — Never lose player actions or progress
- **Verified Integrity** — Verify all data before trusting
- **Consistent State** — Always maintain consistent application state
- **Backup Recovery** — Ability to restore from backup
- **Audit Trail** — Complete history of all data changes
- **Security First** — Protect player data from corruption or theft

---

## Implementation Guidelines

### Development Phase

- **Offline-First Thinking** — Design all features assuming potential offline
- **Queue Everything** — All write operations must be queueable
- **Local Validation** — Validate as much as possible client-side
- **Idempotency Planning** — Every action needs idempotency key
- **Offline Testing** — Regular testing with airplane mode
- **Network Condition Simulation** — Test with slow/unreliable networks

### Testing Phase

- **Offline Scenarios** — Test every flow with offline simulation
- **Sync Testing** — Test sync with queued actions after reconnect
- **Conflict Testing** — Simulate conflicts from multiple devices
- **Crash Recovery** — Test app restart during offline state
- **Large Queue** — Test with hundreds of queued actions
- **Network Flapping** — Rapid connect/disconnect cycles

### Deployment Phase

- **Monitoring** — Track offline events and sync success rates
- **Alerting** — Alert on increased failure rates
- **Rollback Plan** — Ability to rollback if sync breaks
- **User Communication** — Document offline limitations for users
- **Support Documentation** — Help docs for offline issues
- **Continuous Improvement** — Iterate based on real-world offline patterns

---

*Last Updated: 2026-06-24*
