/**
 * Telegram Dependency Injection Registration
 *
 * Registers all Telegram services with the DI container.
 */

import { Container, Lifetime } from '../core/di';
import { TelegramSDK } from './sdk/TelegramSDK';
import { TelegramContextProvider } from './providers/TelegramContextProvider';
import { TelegramEventBus } from './events/TelegramEventBus';
import { TelegramThemeProvider } from './services/TelegramThemeProvider';
import { MiniAppLifecycle } from './services/MiniAppLifecycle';
import { DeepLinkService } from './services/DeepLinkService';
import { TelegramNotificationFoundation } from './services/NotificationFoundation';
import { StarsFoundation } from './services/StarsFoundation';
import { TelegramValidator, createReplayTracker } from './validators/TelegramValidators';
import { TelegramBotLayer } from './bot/TelegramBotLayer';
import { TelegramWebhookHandler } from './webhooks/TelegramWebhookHandler';
import { TelegramMiniApp } from './miniapp/TelegramMiniApp';

/**
 * Telegram DI configuration keys.
 */
export const TELEGRAM_TOKENS = {
  TELEGRAM_SDK: Symbol.for('TelegramSDK'),
  TELEGRAM_CONTEXT: Symbol.for('TelegramContextProvider'),
  TELEGRAM_EVENT_BUS: Symbol.for('TelegramEventBus'),
  TELEGRAM_THEME_PROVIDER: Symbol.for('TelegramThemeProvider'),
  MINI_APP_LIFECYCLE: Symbol.for('MiniAppLifecycle'),
  DEEP_LINK_SERVICE: Symbol.for('DeepLinkService'),
  NOTIFICATION_FOUNDATION: Symbol.for('TelegramNotificationFoundation'),
  STARS_FOUNDATION: Symbol.for('StarsFoundation'),
  TELEGRAM_VALIDATOR: Symbol.for('TelegramValidator'),
  TELEGRAM_BOT_LAYER: Symbol.for('TelegramBotLayer'),
  TELEGRAM_WEBHOOK_HANDLER: Symbol.for('TelegramWebhookHandler'),
  TELEGRAM_MINI_APP: Symbol.for('TelegramMiniApp'),
  REPLAY_TRACKER: Symbol.for('ReplayTracker'),
} as const;

/**
 * Telegram DI configuration options.
 */
export interface TelegramDIConfig {
  botToken?: string;
  webhookSecret?: string;
  apiUrl?: string;
  defaultCurrency?: string;
  maxInitDataAge?: number;
  debug?: boolean;
}

/**
 * Register all Telegram dependencies with the container.
 */
export function registerTelegramDependencies(
  container: Container,
  config: TelegramDIConfig = {}
): void {
  const {
    botToken,
    webhookSecret,
    apiUrl,
    defaultCurrency = 'TON',
    maxInitDataAge = 86400,
    debug = false,
  } = config;

  // Event Bus (Singleton)
  container.registerFactory(
    (TelegramEventBus as unknown) as new (...args: never[]) => TelegramEventBus,
    () => TelegramEventBus.getInstance({ debug }),
    { lifetime: Lifetime.Singleton }
  );

  // SDK (Singleton)
  container.registerFactory(
    (TelegramSDK as unknown) as new (...args: never[]) => TelegramSDK,
    () => TelegramSDK.getInstance({ debug }),
    { lifetime: Lifetime.Singleton }
  );

  // Context Provider (Singleton)
  container.registerFactory(
    (TelegramContextProvider as unknown) as new (...args: never[]) => TelegramContextProvider,
    (c: unknown) => {
      const resolved = c as { resolve: (token: unknown) => TelegramSDK };
      return TelegramContextProvider.getInstance({
        sdk: resolved.resolve(TelegramSDK),
        enableDeviceDetection: true,
        enableRuntimeContext: true,
      });
    },
    { lifetime: Lifetime.Singleton }
  );

  // Theme Provider (Singleton)
  container.registerFactory(
    (TelegramThemeProvider as unknown) as new (...args: never[]) => TelegramThemeProvider,
    (c: unknown) => {
      const resolved = c as { resolve: (token: unknown) => unknown };
      return TelegramThemeProvider.getInstance({
        sdk: resolved.resolve(TelegramSDK) as TelegramSDK,
        eventBus: resolved.resolve(TelegramEventBus) as TelegramEventBus,
      });
    },
    { lifetime: Lifetime.Singleton }
  );

  // Mini App Lifecycle (Singleton)
  container.registerFactory(
    (MiniAppLifecycle as unknown) as new (...args: never[]) => MiniAppLifecycle,
    (c: unknown) => {
      const resolved = c as { resolve: (token: unknown) => unknown };
      return MiniAppLifecycle.getInstance({
        sdk: resolved.resolve(TelegramSDK) as TelegramSDK,
        eventBus: resolved.resolve(TelegramEventBus) as TelegramEventBus,
        autoExpand: true,
        autoTrackViewport: true,
        autoTrackTheme: true,
      });
    },
    { lifetime: Lifetime.Singleton }
  );

  // Deep Link Service (Singleton)
  container.registerFactory(
    (DeepLinkService as unknown) as new (...args: never[]) => DeepLinkService,
    () => DeepLinkService.getInstance({
      maxStartParamLength: 64,
    }),
    { lifetime: Lifetime.Singleton }
  );

  // Notification Foundation (Singleton)
  container.registerFactory(
    (TelegramNotificationFoundation as unknown) as new (...args: never[]) => TelegramNotificationFoundation,
    () => TelegramNotificationFoundation.getInstance({
      botToken,
      defaultParseMode: 'HTML',
    }),
    { lifetime: Lifetime.Singleton }
  );

  // Validator (Singleton) - requires bot token
  if (botToken) {
    container.registerFactory(
      (TelegramValidator as unknown) as new (...args: never[]) => TelegramValidator,
      () => new TelegramValidator({
        botToken,
        maxInitDataAge,
      }),
      { lifetime: Lifetime.Singleton }
    );

    // Bot Layer (Singleton) - requires bot token
    container.registerFactory(
      (TelegramBotLayer as unknown) as new (...args: never[]) => TelegramBotLayer,
      () => TelegramBotLayer.getInstance({
        botToken,
        apiUrl,
        webhookSecret,
      }),
      { lifetime: Lifetime.Singleton }
    );

    // Webhook Handler (Singleton) - requires bot token
    container.registerFactory(
      (TelegramWebhookHandler as unknown) as new (...args: never[]) => TelegramWebhookHandler,
      () => TelegramWebhookHandler.getInstance({
        botToken,
        secretToken: webhookSecret,
      }),
      { lifetime: Lifetime.Singleton }
    );
  }

  // Stars Foundation (Singleton) - requires bot token
  if (botToken) {
    container.registerFactory(
      (StarsFoundation as unknown) as new (...args: never[]) => StarsFoundation,
      () => StarsFoundation.getInstance({
        botToken,
        apiUrl,
        currency: defaultCurrency,
      }),
      { lifetime: Lifetime.Singleton }
    );
  }

  // Mini App (Singleton)
  container.registerFactory(
    (TelegramMiniApp as unknown) as new (...args: never[]) => TelegramMiniApp,
    (c: unknown) => {
      const resolved = c as { resolve: (token: unknown) => unknown };
      return TelegramMiniApp.getInstance({
        sdk: resolved.resolve(TelegramSDK) as TelegramSDK,
        contextProvider: resolved.resolve(TelegramContextProvider) as TelegramContextProvider,
        autoExpand: true,
        autoTrackTheme: true,
      });
    },
    { lifetime: Lifetime.Singleton }
  );

  // Replay Tracker (Scoped)
  container.registerFactory(
    createReplayTracker as (unknown) as new (...args: never[]) => ReturnType<typeof createReplayTracker>,
    () => createReplayTracker(1000),
    { lifetime: Lifetime.Scoped }
  );
}

/**
 * Quick setup function for Telegram.
 * Creates and configures all Telegram components.
 */
export function setupTelegram(config: TelegramDIConfig = {}): {
  sdk: TelegramSDK;
  context: TelegramContextProvider;
  eventBus: TelegramEventBus;
  themeProvider: TelegramThemeProvider;
  lifecycle: MiniAppLifecycle;
  deepLink: DeepLinkService;
  notification: TelegramNotificationFoundation;
  validator?: TelegramValidator;
  botLayer?: TelegramBotLayer;
  webhookHandler?: TelegramWebhookHandler;
  stars?: StarsFoundation;
  miniApp: TelegramMiniApp;
} {
  const eventBus = TelegramEventBus.getInstance({ debug: config.debug });
  const sdk = TelegramSDK.getInstance({ debug: config.debug });
  const context = TelegramContextProvider.getInstance({ sdk });
  const themeProvider = TelegramThemeProvider.getInstance({ sdk, eventBus });
  const lifecycle = MiniAppLifecycle.getInstance({ sdk, eventBus });
  const deepLink = DeepLinkService.getInstance();
  const notification = TelegramNotificationFoundation.getInstance({ botToken: config.botToken });
  
  const validator = config.botToken
    ? new TelegramValidator({ botToken: config.botToken, maxInitDataAge: config.maxInitDataAge })
    : undefined;

  const botLayer = config.botToken
    ? TelegramBotLayer.getInstance({ botToken: config.botToken, webhookSecret: config.webhookSecret })
    : undefined;

  const webhookHandler = config.botToken
    ? TelegramWebhookHandler.getInstance({ botToken: config.botToken, secretToken: config.webhookSecret })
    : undefined;

  const stars = config.botToken
    ? StarsFoundation.getInstance({ botToken: config.botToken, currency: config.defaultCurrency })
    : undefined;

  const miniApp = TelegramMiniApp.getInstance({ sdk, contextProvider: context });

  return {
    sdk,
    context,
    eventBus,
    themeProvider,
    lifecycle,
    deepLink,
    notification,
    validator,
    botLayer,
    webhookHandler,
    stars,
    miniApp,
  };
}

/**
 * Reset all Telegram singletons.
 * Useful for testing.
 */
export function resetTelegramSingletons(): void {
  TelegramContextProvider.resetInstance();
  TelegramEventBus.resetInstance();
  TelegramThemeProvider.resetInstance();
  MiniAppLifecycle.resetInstance();
  DeepLinkService.resetInstance();
  TelegramNotificationFoundation.resetInstance();
  TelegramBotLayer.resetInstance();
  TelegramWebhookHandler.resetInstance();
  StarsFoundation.resetInstance();
  TelegramMiniApp.resetInstance();
}
