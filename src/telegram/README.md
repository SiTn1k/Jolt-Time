/**
 * Telegram Core Module
 *
 * Production Telegram Core Infrastructure for Jolt Time.
 *
 * This module is the ONLY gateway between Jolt Time and the Telegram ecosystem.
 * No feature in the application should communicate directly with Telegram APIs.
 * Everything must pass through this Telegram Core.
 *
 * ## Architecture
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    Application Layer                         │
 * │  (Gameplay, Features, UI Components)                        │
 * └─────────────────────────┬───────────────────────────────────┘
 *                           │
 *                           ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                  Telegram Core Module                        │
 * │  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐    │
 * │  │   Providers │ │   Services   │ │   SDK/Bot Layer    │    │
 * │  ├─────────────┤ ├──────────────┤ ├────────────────────┤    │
 * │  │ Context     │ │ MiniApp      │ │ TelegramSDK        │    │
 * │  │ Theme       │ │ Lifecycle    │ │ BotLayer           │    │
 * │  │             │ │ DeepLink     │ │ WebhookHandler     │    │
 * │  │             │ │ Platform     │ │                    │    │
 * │  │             │ │ Notification │ │                    │    │
 * │  │             │ │ Stars        │ │                    │    │
 * │  │             │ │ Utilities    │ │                    │    │
 * │  └─────────────┘ └──────────────┘ └────────────────────┘    │
 * └─────────────────────────┬───────────────────────────────────┘
 *                           │
 *                           ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                 Telegram Platform APIs                      │
 * │  Telegram.WebApp  │  Bot API  │  Payments API              │
 * └─────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Directory Structure
 *
 * ```
 * telegram/
 * ├── providers/        # Context providers
 * ├── services/         # Core services
 * ├── sdk/              # Telegram SDK wrapper
 * ├── bot/              # Bot API layer
 * ├── miniapp/          # Mini App utilities
 * ├── webhooks/         # Webhook handlers
 * ├── dto/              # Data transfer objects
 * ├── types/            # Type definitions
 * ├── validators/        # Security validators
 * ├── events/           # Event bus
 * ├── di.ts             # Dependency injection
 * └── README.md         # This file
 * ```
 *
 * ## Key Components
 *
 * ### SDK Layer (sdk/)
 * - **TelegramSDK**: Production wrapper around Telegram.WebApp
 *   - Initialization and version detection
 *   - Capability detection
 *   - Safe API access
 *
 * ### Providers (providers/)
 * - **TelegramContextProvider**: Current user, chat, platform, device info
 *
 * ### Services (services/)
 * - **MiniAppLifecycle**: Lifecycle management (ready, expand, close)
 * - **TelegramThemeProvider**: Theme colors and change detection
 * - **DeepLinkService**: Deep link parsing and building
 * - **PlatformDetector**: Platform and device detection
 * - **NotificationFoundation**: Notification abstractions
 * - **StarsFoundation**: Telegram Stars payment infrastructure
 * - **TelegramUtilities**: Reusable helper functions
 *
 * ### Bot Layer (bot/)
 * - **TelegramBotLayer**: Bot API abstraction for messages, commands, callbacks
 *
 * ### Validators (validators/)
 * - **TelegramValidators**: Security validation for init data, signatures
 *
 * ### Events (events/)
 * - **TelegramEventBus**: Central event bus for all Telegram events
 *
 * ## Usage
 *
 * ```typescript
 * import { setupTelegram } from './telegram/di';
 *
 * // Initialize all Telegram components
 * const telegram = setupTelegram({
 *   botToken: process.env.TELEGRAM_BOT_TOKEN,
 *   debug: false,
 * });
 *
 * // Initialize the Mini App
 * await telegram.lifecycle.initialize();
 *
 * // Access components
 * const user = telegram.context.getUser();
 * const theme = telegram.themeProvider.getTheme();
 * ```
 *
 * ## Security
 *
 * All Telegram data validation happens through the validators:
 * - Telegram init data validation
 * - Webhook signature verification
 * - Replay attack protection
 * - Launch parameter validation
 *
 * ## Notes
 *
 * - This module contains ONLY infrastructure code
 * - No gameplay logic
 * - No business logic
 * - No feature-specific code
 */

export * from './types';
export * from './sdk';
export * from './providers';
export * from './services';
export * from './validators';
export * from './bot';
export * from './miniapp';
export * from './webhooks';
export * from './events';
export * from './dto';
export * from './di';
