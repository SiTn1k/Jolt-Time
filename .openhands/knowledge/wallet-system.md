# Jolt Time — Wallet System and Payment Infrastructure

## Overview

The Jolt Time wallet system provides optional payment infrastructure for players who want to support the project through purchases. All wallet and payment features are entirely optional — players who never connect a wallet or make purchases enjoy the complete core gameplay experience without any restrictions.

**Core Philosophy:** Wallet features never block gameplay. Traditional Web2 players and Web3 enthusiasts receive identical gameplay experiences. Payment infrastructure exists to serve players who want convenient ways to support the project.

---

## 1. Wallet Philosophy

The wallet philosophy establishes guiding principles for all payment-related features.

### Optional Engagement

Wallet features should:

- **Remain Completely Optional:** No gameplay feature requires wallet connection
- **Never Block Gameplay:** All core progression works without wallet or purchases
- **Support Both Web2 and Web3 Users:** Equal experience regardless of payment preferences
- **Respect Player Choices:** No pressure tactics for purchases

### Core Experience Parity

**Players without wallets experience the full game:**

- All artifacts available through gameplay
- All eras unlockable through progression
- All cosmetics achievable through achievements
- All competitive modes accessible to all players
- No gameplay content locked behind purchases

### Purchase Boundaries

**Purchases are strictly cosmetic and convenience:**

- Premium cosmetics (skins, frames, badges)
- Convenience items (inventory slots, energy refills)
- Battle Pass access
- Subscription benefits
- No power advantages from spending

### Player Respect Principles

- Transparent pricing with no hidden fees
- Clear value propositions for purchases
- Refund policy clearly communicated
- No aggressive monetization tactics
- No fear-of-missing-out pressure

---

## 2. Supported Payment Systems

Current and future payment infrastructure supports multiple payment methods.

### Telegram Stars (Current)

**Telegram's native virtual currency:**

- **Status:** Currently supported
- **Use Cases:** Premium cosmetics, subscriptions, event bundles
- **Integration:** Telegram Mini App payment API
- **Availability:** All Telegram users can purchase Stars

### TON Wallet (Future)

**TON blockchain wallet integration:**

- **Status:** Future support planned
- **Use Cases:** NFT minting, TON-based purchases, blockchain transactions
- **Integration:** Via TON Connect protocol
- **Availability:** Optional for Web3-enabled players

### TON Connect (Future)

**Telegram-compatible wallet connection standard:**

- **Status:** Future support planned
- **Use Cases:** Wallet linking, transaction signing, NFT operations
- **Integration:** TON Connect SDK
- **Availability:** Optional for players with TON wallets

### Additional Payment Providers (Future)

**Potential future payment integrations:**

- **Apple Pay:** iOS-native payment option
- **Google Pay:** Android-native payment option
- **Card Payments:** Traditional credit/debit via Stripe or similar
- **Regional Methods:** Local payment options for global reach

### Payment Architecture

**Architecture documentation only:**

```
┌─────────────────────────────────────────────────┐
│              Jolt Time Payment Flow              │
├─────────────────────────────────────────────────┤
│  Player selects purchase → Choose payment method │
│  → Process transaction → Grant in-game rewards   │
│  → Confirm via notification                     │
├─────────────────────────────────────────────────┤
│  Supported Methods:                              │
│  - Telegram Stars (current)                      │
│  - TON Wallet (future)                          │
│  - TON Connect (future)                        │
│  - Additional providers (future)                │
└─────────────────────────────────────────────────┘
```

---

## 3. Wallet Features

Core wallet management features for connected accounts.

### Connect Wallet

**Establish connection to TON wallet:**

- **TON Connect Flow:** Standard Telegram wallet connection via TON Connect
- **Wallet Verification:** Confirm wallet ownership before linking
- **Session Management:** Persistent connection with secure token refresh
- **Multi-Wallet Support:** Future option for multiple wallet connections

### Disconnect Wallet

**Terminate wallet connection:**

- **Immediate Disconnect:** Wallet unlinked from account
- **Asset Preservation:** NFTs and items remain in wallet, playable via game
- **No Data Deletion:** Transaction history preserved
- **Reconnection:** Easy reconnection if player wants to resume

### Wallet Status

**Real-time connection state:**

- **Connected State:** Shows linked wallet address (truncated)
- **Balance Display:** TON balance if applicable
- **Connection Quality:** Status indicator for connection health
- **Last Sync:** Timestamp of last wallet data refresh

### Transaction History

**Complete payment and transaction record:**

- **Purchase History:** All Telegram Stars and future purchases
- **Rewards Received:** In-game rewards from purchases
- **Completed Payments:** Status and confirmation of all transactions
- **Export Options:** Download transaction records (future)

### Additional Features

- **Payment Preferences:** Default payment method selection
- **Receipt Storage:** Access to all purchase receipts
- **Subscription Management:** View and manage active subscriptions
- **Refund Requests:** Submit refund requests for eligible purchases

---

## 4. Payment Categories

Organized purchase options across multiple categories.

### Battle Pass Purchases

**Premium progression track access:**

- **Seasonal Battle Pass:** Full season premium rewards
- **Battle Pass Upgrades:** Mid-season upgrade options
- **Bundle Options:** Battle Pass + extra tiers packages
- **Gift Options:** Purchase Battle Pass for friends (future)

### Cosmetic Purchases

**Visual and decorative items:**

- **Profile Frames:** Decorative borders
- **Avatar Effects:** Profile picture animations
- **Title Badges:** Special achievement indicators
- **Chat Packages:** Expressive emoji and sticker packs
- **Seasonal Skins:** Limited-time cosmetic themes

### Subscriptions

**Recurring benefit packages:**

- **Jolt Time Plus:** Monthly subscription with convenience benefits
- **Subscriber Benefits:** Extra inventory, quests, exclusive cosmetics
- **Annual Option:** Discounted yearly subscription (future)
- **Family Plans:** Share subscription benefits (future)

### Event Bundles

**Limited-time value packages:**

- **Event Pass Bundles:** Event currency + cosmetics + bonus items
- **Starter Bundles:** New player value packages
- **Holiday Bundles:** Seasonal celebration packages
- **Anniversary Bundles:** Special commemoration packages

### Future NFT Transactions

**Blockchain-related purchases (future):**

- **NFT Minting Fees:** Gas costs for minting items to blockchain
- **NFT Purchases:** Buying NFTs via TON
- **Collection Packages:** Pre-made NFT collection sets
- **Creator Royalties:** Payments to content creators

---

## 5. Transaction History Philosophy

Complete visibility into player payment activities.

### Purchase History

Players should be able to review:

- **Item Purchased:** Name, category, and description
- **Purchase Price:** Amount paid in Stars or TON
- **Purchase Date:** Timestamp of transaction
- **Payment Method:** Telegram Stars, TON, etc.
- **Confirmation ID:** Transaction reference number

### Rewards Received

- **Reward Type:** What was granted (cosmetic, currency, subscription)
- **Reward Value:** Estimated value in Stars or TON
- **Redemption Status:** Claimed, pending, or expired
- **Related Purchase:** Link to original purchase

### Completed Payments

- **Payment Status:** Success, pending, failed, refunded
- **Invoice Details:** Itemized purchase breakdown
- **Fee Breakdown:** Any platform fees if applicable
- **Receipt Download:** Access to formal receipt (future)

### Transaction Management

- **Search and Filter:** Find specific transactions
- **Date Range:** Filter by time period
- **Category Filter:** Filter by purchase type
- **Export Functionality:** Download records for accounting (future)

---

## 6. Security Philosophy

Comprehensive security protects player accounts and payment information.

### Wallet Connection Security

- **Secure Linking:** OAuth-like flow with TON Connect
- **Session Tokens:** Encrypted, time-limited connection tokens
- **Revocation Control:** Players can terminate connections anytime
- **No Private Key Storage:** Jolt Time never stores wallet private keys

### Payment Integrity

- **Encrypted Transactions:** All payment data encrypted in transit
- **Verified Receipts:** Cryptographic verification of purchases
- **Fraud Detection:** Monitoring for suspicious purchase patterns
- **Two-Factor Consideration:** Future option for additional security

### Transaction Records Protection

- **Secure Storage:** Transaction history encrypted at rest
- **Access Control:** Only authenticated player can view their history
- **Audit Logging:** Complete logs for dispute resolution
- **Data Retention:** Appropriate retention policies followed

### Sensitive Information Handling

**Sensitive information should never be exposed:**

- Full wallet addresses never displayed publicly
- Payment card details handled by payment provider (never stored by Jolt Time)
- Transaction hashes displayed (truncated) with verification links
- Personal identification data protected per privacy policy

### Security Measures

- **HTTPS Only:** All payment traffic over secure connections
- **Payment Provider PCI Compliance:** Stripe/Telegram Stars compliant
- **Rate Limiting:** Prevent brute-force attacks on transactions
- **Anomaly Detection:** Flag unusual purchase patterns

---

## 7. Wallet Statistics

System-wide metrics for payment infrastructure monitoring.

### Connected Players

- **Total Connections:** Number of players with linked wallets
- **Active Connections:** Wallets used in last 30 days
- **Connection Growth:** Trend in new wallet connections
- **Platform Breakdown:** Distribution of wallet providers

### Transaction Counts

- **Daily/Weekly/Monthly:** Transaction volume over time
- **Transaction Value:** Total Stars/TON processed
- **Average Transaction:** Mean purchase amount
- **Peak Hours:** When purchases are most frequent

### Supported Payment Methods

- **Method Distribution:** Breakdown by payment type
- **Regional Preferences:** Popular methods by geography
- **Success Rates:** Transaction completion percentages
- **Failure Analysis:** Common failure reasons and resolution

### Performance Metrics

- **Payment Processing Time:** Average time to complete transactions
- **Success Rate:** Percentage of successful purchases
- **Refund Rate:** Percentage of refunded transactions
- **Customer Satisfaction:** Post-purchase feedback scores (future)

---

## 8. Telegram Stars Philosophy

Telegram Stars serve as the primary payment currency for in-app purchases.

### Stars Purchase Categories

Telegram Stars should support:

- **Premium Cosmetics:** Exclusive visual items unavailable elsewhere
- **Subscriptions:** Jolt Time Plus and similar recurring benefits
- **Convenience Items:** Inventory slots, energy refills, refresh tokens
- **Event Bundles:** Value packages during special events
- **Battle Pass:** Premium progression track access

### Stars Integration

- **Native Telegram:** Integrated via Telegram Mini App payment API
- **Instant Delivery:** Stars purchases delivered immediately
- **Receipt Storage:** Telegram maintains purchase receipts
- **Refund Support:** Via Telegram's refund system

### Stars Usage Principles

**Stars must never create pay-to-win advantages:**

- No gameplay power purchasable with Stars
- All combat advantages earned through skill
- All progression achievable without Stars
- Cosmetics and convenience only
- Fair playing field for all players

### Stars and AdsGram

**Distinct revenue streams:**

- **AdsGram:** Free player engagement rewards
- **Telegram Stars:** Player-initiated purchases
- **No Conversion:** Stars cannot be converted to AdsGram rewards
- **Separate Systems:** No interaction between reward currencies

---

## 9. TON Integration Philosophy

Future TON blockchain integration for Web3-enhanced payments.

### Future Support (Documented Only)

**TON Transfers:**
- Player-to-player TON transfers (future)
- Withdraw TON earnings from marketplace (future)
- Deposit TON to Jolt Time wallet (future)

**NFT Minting:**
- Gas fee payment in TON for blockchain minting
- Batch minting options for multiple items
- Priority minting for subscribers (future)

**Marketplace Transactions:**
- TON-denominated marketplace listings (future)
- Direct TON payments for marketplace purchases
- Cross-marketplace TON trading (future)

### Technical Approach

**Architecture documentation only:**

- TON Connect SDK for wallet integration
- TON payment processing via blockchain transactions
- NFT smart contract interactions
- Transaction verification via TON explorer

### Implementation Timeline

**TON integration is future work — no current timeline:**

- Phase 1: Wallet connection infrastructure
- Phase 2: Basic TON deposit/withdraw
- Phase 3: NFT minting integration
- Phase 4: TON marketplace transactions

---

## 10. Telegram Bot Notifications

Bot notifications keep players informed about payment activities.

### Successful Purchases

**Trigger:** A purchase completes successfully

- Item name and category
- Amount paid (Stars or TON)
- Confirmation number
- Link to transaction details

**Frequency:** Immediate upon purchase completion

### Subscription Renewals

**Trigger:** A recurring subscription renews

- Subscription name and tier
- Renewal amount and date
- Benefits included
- Link to manage subscription

**Frequency:** One notification 3 days before renewal, one on renewal day

### Payment Confirmations

**Trigger:** A payment is processed

- Payment type (purchase, refund, etc.)
- Amount and currency
- Status (success, pending, failed)
- Next steps if action required

**Frequency:** Immediate for important payments; batch for minor items

### Notification Guidelines

**Never become spam. Strict controls apply:**

- Maximum 3 payment notifications per day per player
- Fully customizable notification preferences
- Quiet hours respected for all notifications
- Batch summary option for frequent purchasers
- One-click unsubscribe from payment notifications
- Critical notifications (failed payments, refunds) always delivered

---

## 11. AdsGram Integration

Wallet systems and purchases are secondary to AdsGram as the primary revenue system.

### Revenue System Hierarchy

1. **AdsGram (Primary):** Main revenue source for project sustainability
2. **Telegram Stars Purchases (Secondary):** Optional player-initiated purchases
3. **Subscription Revenue (Tertiary):** Recurring premium subscriptions
4. **TON Integration (Future):** Web3 payment services
5. **NFT Systems (Future):** Blockchain transaction fees

### Payment and AdsGram Separation

- **No Ads in Payments:** Payment flows are ad-free
- **No Ad Rewards from Purchases:** Buying Stars doesn't affect AdsGram rewards
- **Independent Systems:** Payment has no impact on ad engagement
- **No Replacement:** Payments never replace AdsGram as core revenue

### Critical Business Model

**AdsGram revenue must remain one of the core business models:**

- Development funded primarily by AdsGram
- Player purchases enhance but don't sustain project
- No aggressive monetization to compensate for reduced ads
- Fair player experience prioritized over purchase pressure

---

## 12. Fair Monetization Philosophy

Jolt Time maintains ethical monetization practices that respect players.

### Fairness Principles

Jolt Time should:

- **Avoid Pay-to-Win:** No gameplay power purchasable with real money
- **Respect Players:** No manipulative monetization tactics
- **Support Optional Purchases:** All purchases enhance but never gate gameplay
- **Provide Value:** Clear value proposition for every purchase

### Anti-Manipulation Rules

- **No Fear-of-Missing-Out:** No artificial urgency or limited-time pressure
- **No Gacha Mechanics:** No gambling-like random purchases
- **No Social Pressure:** Friends can't pressure through game mechanics
- **No Fake Discounts:** Original prices are genuine, not inflated

### Purchase Transparency

- **Clear Pricing:** No hidden fees or complex pricing structures
- **Value Display:** Show what's included in each purchase
- **No Dark Patterns:** Easy to cancel, no trick confirmations
- **Honest Descriptions:** Items look like their images

### Player Protection

- **Spend Limits:** Optional player-set spending caps (future)
- **Refund Policy:** Fair refund process for legitimate issues
- **Age Appropriate:** Age-gating for certain purchase categories
- **Support Access:** Easy access to purchase support

---

## 13. Future Expansion Notes

Future payment and wallet enhancements are documented as aspirational features.

### Multiple Wallets (Future)

**Support for multiple blockchain wallets:**

- Connect multiple TON wallets to single account
- Primary wallet designation for transactions
- Wallet-specific transaction filtering
- Cross-wallet NFT management

### Cross-Platform Payments (Future)

**Payment continuity across platforms:**

- Purchase once, access on all platforms
- Unified purchase history across devices
- Account-bound purchases via Supabase
- Platform-specific payment options where required

### Creator Payments (Future)

**Compensate community content creators:**

- Creator-branded cosmetic items
- Revenue share with approved creators
- Creator commission tracking
- Direct creator support options

### Player-to-Player Blockchain Transfers (Future)

**Direct player transactions via blockchain:**

- NFT lending system
- Direct TON transfers between players
- Escrow services for high-value items
- Guild treasury management

### Additional Future Features

- **Gift System:** Purchase gifts for friends
- **Wishlist Sharing:** Share purchase wishlists
- **Group Purchases:** Pool resources for shared items
- **Subscription Gifting:** Give subscriptions to others
- **Battle Pass Sharing:** Share Battle Pass benefits in guilds

---

## Technical Notes

### Supabase Backend

Payment infrastructure uses Supabase for:

- **Transaction Records:** Complete purchase history storage
- **Entitlement Management:** Track purchased items and subscriptions
- **Wallet Linking:** Store wallet connections securely
- **Audit Logging:** Comprehensive transaction logs

### Telegram Integration

- **Telegram Stars API:** Native Stars payment processing
- **TON Connect:** Wallet connection protocol
- **Telegram Passport:** Identity verification if needed
- **Bot Notifications:** Payment update notifications

### Security Architecture

- **PCI Compliance:** Payment card data handled by providers
- **Encryption:** All sensitive data encrypted
- **Tokenization:** Secure payment tokens, not card details
- **Fraud Detection:** ML-based anomaly detection

### Performance Targets

- Purchase completion: < 3 seconds
- Wallet connection: < 5 seconds
- Transaction history load: < 2 seconds
- Notification delivery: < 1 second

---

*Last Updated: 2026-06-24*
