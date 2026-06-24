# Jolt Time — Admin Panel and Moderation Systems

## Overview

The Jolt Time admin panel and moderation systems provide internal tools for team members to manage the game, support players, and maintain community health. These are internal systems — players must never have access to administrator functions.

**Core Philosophy:** Admin tools exist to serve players and maintain fair, positive community experiences. All administrative actions are logged, audited, and held to high ethical standards. Player privacy is respected while enabling necessary moderation.

---

## 1. Admin Roles

Hierarchical roles with clearly defined permissions ensure appropriate access levels.

### Super Admin

**Highest-level administrative access:**

| Permission | Access Level |
|------------|--------------|
| All Moderation | Full access |
| User Management | Full CRUD operations |
| Economy Tools | Full access including currency adjustment |
| Event Management | Create, modify, terminate events |
| System Configuration | All system settings |
| Admin Management | Add/remove admin accounts |
| Audit Logs | Full audit trail access |
| Data Export | Complete data export capability |

### Administrator

**Senior operational access:**

| Permission | Access Level |
|------------|--------------|
| All Moderation | Full access |
| User Management | View, warn, temporary restrictions |
| Economy Tools | View-only, flag suspicious activity |
| Event Management | Create and manage events |
| System Configuration | Limited settings only |
| Admin Management | None |
| Audit Logs | View own actions only |
| Data Export | Aggregated statistics only |

### Moderator

**Community management access:**

| Permission | Access Level |
|------------|--------------|
| Moderation | Warnings, temporary restrictions |
| User Management | View profiles, review reports |
| Economy Tools | None |
| Event Management | Limited event monitoring |
| System Configuration | None |
| Admin Management | None |
| Audit Logs | None |
| Data Export | None |

### Support Team

**Player assistance access:**

| Permission | Access Level |
|------------|--------------|
| Moderation | Limited to assigned tickets |
| User Management | View player profiles, limited edit |
| Economy Tools | None |
| Event Management | View announcements only |
| System Configuration | None |
| Admin Management | None |
| Audit Logs | None |
| Data Export | None |

### Role Boundaries

- **Separation of Duties:** Critical actions require multiple role approvals
- **Least Privilege:** Each role has minimum access needed
- **Audit Trail:** All role assignments logged
- **Periodic Review:** Role permissions reviewed quarterly

---

## 2. Player Management Tools

Comprehensive tools for reviewing and managing player accounts.

### View Player Profiles

**Read-only access to player information:**

- **Basic Info:** Username, Telegram ID, join date, account status
- **Game Progress:** Level, artifacts, collections, museum progress
- **Activity History:** Recent actions, login patterns
- **Social Connections:** Friends, guild membership, interactions
- **Purchase History:** Transaction records (for support cases)

### Review Reports

**Tools for processing player-submitted reports:**

- **Report Queue:** Chronological list of all pending reports
- **Report Details:** Full context of reported content/behavior
- **Evidence Review:** Attached screenshots, chat logs
- **Reporter Identity:** Who filed the report (confidential)
- **History Lookup:** Prior reports involving same player

### Investigate Suspicious Activity

**Tools for identifying harmful behavior:**

- **Activity Timeline:** Complete action history for account
- **Pattern Analysis:** Anomaly detection for unusual behavior
- **Cross-Reference:** Connected accounts, coordinated actions
- **Data Correlation:** Link multiple accounts to same user
- **Evidence Collection:** Exportable evidence for disputes

### Apply Sanctions

**Tools for enforcing community standards:**

- **Warning System:** Issue formal warnings with record
- **Restriction Tools:** Temporary feature limitations
- **Ban Management:** Temporary and permanent account restrictions
- **Appeal Processing:** Review and respond to appeals
- **Rollback Capabilities:** Reverse illegitimate gains

---

## 3. Moderation Actions

Escalating actions ensure fair treatment with appropriate consequences.

### Warnings

**First-tier response to minor violations:**

- **Formal Notice:** Documented warning with explanation
- **Policy Reference:** Which rule was violated
- **Expected Behavior:** What player should do differently
- **Duration:** Permanent record but can be cleared after 12 months
- **Appeal Option:** Player can appeal within 7 days

### Temporary Restrictions

**Second-tier response to repeated or moderate violations:**

| Restriction Type | Duration | Scope |
|------------------|----------|-------|
| Chat Restriction | 1-7 days | Cannot post in global chat |
| Feature Restriction | 1-30 days | Specific features disabled |
| Trading Restriction | 1-14 days | Cannot use marketplace |
| Battle Restriction | 1-7 days | Cannot participate in PvP |

### Temporary Bans

**Third-tier response to serious violations:**

| Ban Type | Duration | Scope |
|----------|----------|-------|
| 7-Day Ban | 7 days | Full account suspension |
| 30-Day Ban | 30 days | Full account suspension |
| Seasonal Ban | 90 days | Full account suspension |

### Permanent Bans

**Last resort for severe or repeated violations:**

- **Automated Review:** System flags for human review before permanent action
- **Multi-Approver:** Requires two Super Admin approvals
- **Evidence Required:** Comprehensive documentation
- **Appeal Window:** 30 days to appeal after initial action
- **Last Resort:** Used only when other actions ineffective

### Escalation Philosophy

**Progressive discipline ensures fairness:**

1. First offense: Warning or minimal restriction
2. Repeated offense: Escalating restrictions
3. Severe offense: Immediate temporary ban
4. Continued violations: Permanent ban consideration
5. Exceptional severity: Immediate permanent ban

---

## 4. Support Tools

Tools enabling support team to assist players effectively.

### Review Tickets

**Comprehensive ticket management:**

- **Ticket Queue:** All open support requests
- **Priority Triage:** Urgent issues surfaced first
- **Category Routing:** Specialized queues for issue types
- **SLA Tracking:** Response time monitoring
- **Escalation Path:** Route complex issues to specialists

### Investigate Issues

**Tools for diagnosing player problems:**

- **Account Diagnostic:** Full account status review
- **Transaction Lookup:** Payment and purchase investigation
- **Progress Verification:** Check game progress integrity
- **Item Recovery:** Investigate lost or missing items
- **Dispute Review:** Examine evidence from both sides

### Assist Players

**Tools for resolving player issues:**

- **Item Compensation:** Grant missing items (logged)
- **Currency Adjustment:** Correct economy errors (logged)
- **Account Recovery:** Assist with locked accounts
- **Refund Processing:** Handle legitimate refund requests
- **Feature Unlocks:** Restore accidentally lost access

---

## 5. Event Management Tools

Tools for creating and managing game events.

### Launch Events

**Create new events:**

- **Event Builder:** Define event parameters
- **Reward Configuration:** Set rewards and requirements
- **Duration Settings:** Start, end, and grace periods
- **Targeting:** Scope to specific player groups
- **Announcement Integration:** Auto-publish announcements

### Modify Event Settings

**Adjust running events:**

- **Duration Extension:** Add time to ongoing events
- **Reward Tweak:** Adjust reward values (within limits)
- **Scope Changes:** Modify participation requirements
- **Emergency Stop:** Terminate events if critical issue
- **Rollback:** Reverse event-related transactions

### Schedule Announcements

**Coordinate event communications:**

- **Announcement Queue:** Schedule future announcements
- **Countdown Posts:** Pre-scheduled countdown messages
- **Event Alerts:** Notification to participants
- **End Notices:** Reminder when event concludes
- **Results Posts:** Share event outcomes

### Event Monitoring

**Track event health:**

- **Participation Metrics:** Player engagement levels
- **Reward Distribution:** Ensure proper reward delivery
- **Bug Monitoring:** Track event-related issues
- **Performance Impact:** Monitor server load

---

## 6. Notification Tools

Tools for communicating with players through various channels.

### Send Announcements

**Broadcast messages to player base:**

- **Global Announcements:** All players notified
- **Segment Targeting:** Notify specific player groups
- **Content Editor:** Rich text announcement composer
- **Scheduling:** Pre-schedule announcements
- **Delivery Tracking:** Monitor announcement reach

### Schedule Messages

**Time-based message delivery:**

- **Recurring Messages:** Daily/weekly scheduled content
- **Event Countdowns:** Automatic countdown messages
- **Maintenance Notices:** Pre-scheduled downtime alerts
- **Reminder Systems:** Gentle reminders for activities

### Notify Specific Groups

**Targeted player communication:**

| Group Type | Use Case |
|------------|----------|
| New Players | Welcome series |
| Inactive Players | Comeback incentives |
| Subscribers | Premium announcements |
| Event Participants | Event-specific updates |
| Affected Players | Issue notifications |

### Notification Guidelines

**Notifications should remain respectful:**

- **Frequency Caps:** Maximum announcements per day/week
- **Content Standards:** No aggressive or manipulative language
- **Opt-Out Respect:** Honor player notification preferences
- **Timing:** Consider player timezone for global announcements
- **Value-First:** Announcements provide genuine value

---

## 7. Economy Monitoring Tools

Tools for maintaining economic health and detecting exploitation.

### Currency Generation Tracking

**Monitor currency flows:**

- **Generation Sources:** Track all currency creation
- **Per-Player Caps:** Flag players approaching limits
- **Daily/Weekly/Monthly:** Aggregate generation metrics
- **Source Breakdown:** By activity type, event, reward
- **Trend Analysis:** Identify unusual generation patterns

### Suspicious Transaction Detection

**Identify potential exploitation:**

- **Price Anomalies:** Unusual marketplace prices
- **Rapid Trading:** Excessive buy/sell patterns
- **Transfer Clusters:** Multiple transfers between accounts
- **Currency Surges:** Sudden unexplained increases
- **Cross-Account Links:** Coordinated activity detection

### Inflation Risk Monitoring

**Track economic health:**

- **Currency Supply:** Total currency in circulation
- **Sink Ratios:** Generation vs. consumption balance
- **Price Trends:** Historical item pricing
- **Market Activity:** Trading volume indicators
- **Economic Alerts:** Warning system for imbalances

### Economy Dashboard

**Comprehensive economic view:**

- **Real-Time Metrics:** Live economic indicators
- **Historical Charts:** Trend visualization
- **Alert Thresholds:** Automated warnings
- **Comparative Analysis:** Current vs. previous periods
- **Projection Models:** Future economic forecasts

---

## 8. Logs and Audit Trails

Comprehensive logging ensures accountability and enables investigation.

### Administrator Actions

**Log all admin operations:**

| Action Type | Logged Data |
|-------------|-------------|
| User Modifications | Target user, admin, timestamp, before/after state |
| Sanctions Applied | Target user, admin, sanction type, duration, reason |
| Item Grants | Target user, admin, item, quantity, reason |
| Economy Adjustments | Target user, admin, amount, currency, reason |
| Event Changes | Event ID, admin, change type, old/new values |

### Moderation History

**Maintain moderation records:**

- **Warnings Issued:** Complete warning history per player
- **Restriction Records:** All temporary restrictions
- **Ban Records:** Temporary and permanent bans
- **Appeal Outcomes:** Appeals and their resolutions
- **Evidence Preservation:** Attached evidence stored securely

### Security Events

**Log security-relevant events:**

- **Login Attempts:** Failed admin login attempts
- **Permission Escalations:** Unauthorized access attempts
- **Data Access:** Sensitive data queries
- **Bulk Exports:** Large data exports
- **Role Changes:** Admin role modifications

### Critical Action Logging

**Enhanced logging for sensitive operations:**

- **Permanent Bans:** Require reason, evidence reference, approver
- **Data Exports:** Log requester, scope, destination
- **Economy Rollbacks:** Full transaction reversal documentation
- **Account Deletions:** Complete account state preserved
- **System Config Changes:** Before/after configuration snapshots

---

## 9. Report System

Player-facing system for reporting inappropriate behavior.

### Report Categories

**Players may report:**

| Category | Examples |
|----------|----------|
| Abuse | Harassment, hate speech, threats |
| Cheating | Exploits, automation, score manipulation |
| Inappropriate Names | Offensive usernames, impersonation |
| Suspicious Behavior | Bot-like activity, spam, farming |
| Content Issues | Inappropriate museum items, chat content |
| Technical Issues | Bugs, glitches (redirected to support) |

### Report Submission

**Easy player reporting:**

- **In-App Reporting:** Report button on player profiles and content
- **Chat Reporting:** Report specific messages
- **Evidence Attachment:** Screenshots and context
- **Category Selection:** Help route to appropriate reviewer
- **Anonymous Option:** Report without notification to reported player

### Report Processing

**Structured review workflow:**

1. **Automated Triage:** System prioritizes by severity
2. **Initial Review:** Moderator assesses report validity
3. **Evidence Review:** Examine attached evidence
4. **History Check:** Review reported player's history
5. **Action Decision:** Determine appropriate response
6. **Outcome Communication:** Notify reporter of resolution

---

## 10. Privacy Philosophy

Strict privacy principles protect player data while enabling moderation.

### Necessary Access Only

**Administrators should access only necessary information:**

- **Principle of Minimality:** Access minimum data required for task
- **Purpose Limitation:** Data used only for stated purpose
- **Need-to-Know Basis:** Information shared only with those who need it
- **Time-Limited Access:** Elevated access expires automatically

### Player Privacy Respect

**Respect player privacy in all actions:**

- **No Unnecessary Profiling:** Don't create profiles beyond needs
- **Data Minimization:** Collect only what's necessary
- **Retention Limits:** Don't keep data beyond requirement
- **Transparent Processes:** Players can request data about their data access

### Avoid Unnecessary Data Exposure

**Protect sensitive information:**

- **PII Protection:** Personal info not logged unnecessarily
- **Financial Privacy:** Payment details never visible
- **Location Privacy:** No geographic tracking data exposed
- **Communication Privacy:** Private messages not accessed

### Privacy by Design

- **Default Privacy:** Strongest privacy settings by default
- **Consent Requirements:** Explicit consent for data use beyond service
- **Data Portability:** Players can export their data
- **Right to Deletion:** Appropriate data removal capabilities

---

## 11. Telegram Bot Support

Administrative tools through Telegram bot interface.

### Announcements

**Bot-enabled announcements:**

- **Quick Announce:** Send immediate global announcements
- **Scheduled Posts:** Queue announcements for later
- **Targeted Broadcasts:** Send to specific player segments
- **Response Monitoring:** Track announcement engagement

### Maintenance Notifications

**Coordinate maintenance windows:**

- **Pre-Maintenance Alerts:** Notify players in advance
- **Start Notifications:** Announce maintenance beginning
- **End Countdown:** Signal imminent return
- **Completion Notice:** Announce service restoration

### Event Reminders

**Automated event communications:**

- **Event Start Alerts:** Notify when events begin
- **Milestone Reminders:** Alert at event milestones
- **Ending Warnings:** Notify when events conclude
- **Results Announcements:** Share event outcomes

### Admin Bot Access Controls

- **Role-Based Commands:** Bot commands filtered by admin role
- **Audit Logging:** All bot commands logged
- **Approval Workflows:** Sensitive actions require confirmation
- **Rate Limiting:** Prevent command spam

---

## 12. AdsGram Analytics

Admin tools provide analytics for revenue monitoring.

### AdsGram Activity Tracking

**Monitor primary revenue source:**

- **Ad View Counts:** Daily/weekly/monthly ad impressions
- **Engagement Rates:** Player interaction with ads
- **Revenue Estimates:** Projected earnings from AdsGram
- **Trend Analysis:** Compare periods for growth tracking

### Reward Usage Monitoring

**Track reward distribution:**

- **Reward Redemption:** How often ads are watched for rewards
- **Reward Types:** Distribution of reward types chosen
- **Engagement Impact:** Effect on player retention
- **Efficiency Metrics:** Revenue per reward dollar

### Revenue Monitoring

**Comprehensive revenue overview:**

- **Revenue Streams:** Breakdown by source (AdsGram, purchases, subscriptions)
- **Projections:** Forecast future revenue
- **Anomaly Detection:** Flag unusual revenue patterns
- **Comparison Reports:** Period-over-period analysis

### Dashboard Features

- **Real-Time View:** Live revenue dashboard
- **Historical Data:** Past performance analysis
- **Segment Breakdown:** Revenue by player segment
- **Alert System:** Notifications for significant changes

---

## 13. Future Expansion Notes

Future admin system enhancements are documented as aspirational features.

### Advanced Dashboards (Future)

**Enhanced analytical capabilities:**

- **Custom Widgets:** Configurable dashboard components
- **Predictive Analytics:** AI-driven forecasts
- **Comparative Tools:** Side-by-side metric comparison
- **Automated Insights:** System-generated observations
- **Mobile Support:** Tablet/mobile admin interfaces

### AI Moderation (Future)

**Automated content moderation:**

- **Content Classification:** AI categorization of reports
- **Pattern Recognition:** Detect emerging harmful behavior
- **Auto-Response:** Handle simple cases automatically
- **Prioritization:** AI-powered triage of reports
- **Accuracy Tracking:** Monitor AI moderation quality

### Automated Fraud Detection (Future)

**Enhanced fraud prevention:**

- **Behavioral Analysis:** ML models for anomaly detection
- **Predictive Blocking:** Preemptively block likely fraud
- **Network Analysis:** Graph-based fraud ring detection
- **Real-Time Alerts:** Immediate notification of fraud
- **Auto-Remediation:** Automatic response to detected fraud

### Support Ticket Center (Future)

**Enhanced support infrastructure:**

- **Knowledge Base:** Self-service help articles
- **Ticket Templates:** Standardized issue categories
- **Escalation Rules:** Automated routing to specialists
- **Satisfaction Tracking:** Post-resolution surveys
- **Performance Metrics:** Support team analytics

### Additional Future Features

- **Multi-Language Support:** Interface in multiple languages
- **API Access:** Programmatic admin system access
- **Webhook Notifications:** External system integration
- **Scheduled Reports:** Automated report generation
- **Bulk Operations:** Mass action capabilities

---

## Technical Notes

### Supabase Backend

Admin system uses Supabase for:

- **Admin Accounts:** Separate admin authentication
- **Audit Logs:** Immutable audit trail storage
- **Permission Management:** Role-based access control
- **Report Queue:** Structured report management

### Authentication

- **Separate Admin Auth:** Admin accounts separate from player accounts
- **MFA Required:** Multi-factor authentication for all admin access
- **Session Management:** Automatic session timeout
- **IP Restrictions:** Optional IP allowlisting

### Security Measures

- **Encrypted Traffic:** HTTPS only for admin panel
- **Input Validation:** Sanitize all admin inputs
- **Rate Limiting:** Prevent brute-force attacks
- **Access Logging:** All admin actions logged
- **Anomaly Detection:** Monitor for unusual admin behavior

### Performance Targets

- Admin panel load: < 2 seconds
- Report processing: < 1 minute for initial triage
- Dashboard refresh: < 5 seconds
- Bulk operations: Background processing

---

*Last Updated: 2026-06-24*
