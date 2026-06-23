/**
 * Localization System
 * 
 * Provides multi-language support for the Telegram Bot.
 * Currently supports:
 * - English (en)
 * - Ukrainian (uk)
 * 
 * Language is stored per-user in the database.
 * 
 * Usage:
 * 
 * ```typescript
 * import { t, setUserLanguage, getUserLanguage } from './Localization';
 * 
 * // Get translation for a user
 * const message = t(userId, 'welcome.message');
 * 
 * // Set user's language
 * await setUserLanguage(telegramId, 'uk');
 * ```
 */

export type Language = 'en' | 'uk';

// Default language
const DEFAULT_LANGUAGE: Language = 'en';

// Language display names
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  uk: 'Українська'
};

// Language flag emojis
export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  uk: '🇺🇦'
};

// =============================================================================
// TRANSLATION KEYS & MESSAGES
// =============================================================================

interface TranslationMessages {
  // General
  error: string;
  loading: string;
  success: string;
  cancelled: string;
  
  // Commands
  commands: {
    start: string;
    help: string;
    profile: string;
    settings: string;
    daily: string;
    events: string;
    unknown: string;
  };
  
  // Welcome
  welcome: {
    title: string;
    message: string;
    registered: string;
  };
  
  // Profile
  profile: {
    title: string;
    level: string;
    energy: string;
    expeditions: string;
    joined: string;
    notFound: string;
  };
  
  // Settings
  settings: {
    title: string;
    notifications: string;
    language: string;
    back: string;
    updated: string;
  };
  
  // Notifications
  notifications: {
    enabled: string;
    disabled: string;
    dailyReminders: string;
    events: string;
    researchComplete: string;
    energyRestored: string;
    buildingComplete: string;
    marketing: string;
  };
  
  // Daily
  daily: {
    title: string;
    claimed: string;
    notAvailable: string;
    streak: string;
    claimButton: string;
  };
  
  // Events
  events: {
    title: string;
    noEvents: string;
    upcoming: string;
    active: string;
    ended: string;
  };
  
  // Inactive reminders
  inactive: {
    title24h: string;
    message24h: string;
    title72h: string;
    message72h: string;
    title7d: string;
    message7d: string;
  };
  
  // Mini App linking
  miniApp: {
    linkTitle: string;
    linkMessage: string;
    linked: string;
    notLinked: string;
    openToLink: string;
  };
  
  // Errors
  errors: {
    generic: string;
    notStarted: string;
    invalidCallback: string;
    sendFailed: string;
  };
}

// English translations
const en: TranslationMessages = {
  error: '❌ An error occurred',
  loading: '⏳ Loading...',
  success: '✅ Success!',
  cancelled: '❌ Cancelled',
  
  commands: {
    start: 'Get started with Jolt Time',
    help: 'Learn how to use the bot',
    profile: 'View your game profile',
    settings: 'Manage your settings',
    daily: 'Claim your daily reward',
    events: 'View active events',
    unknown: 'Unknown command'
  },
  
  welcome: {
    title: '👋 Welcome to Jolt Time!',
    message: `Jolt Time is an exciting incremental game where you build your empire, complete expeditions, and research new technologies.

With this bot, you'll receive notifications about:
⚡ Energy restoration
🏆 Expedition completion
🔬 Research completion
🏗️ Building upgrades
🎉 Special events

Click the button below to open the game!`,
    registered: '✅ You\'re all set! Your profile has been created.'
  },
  
  profile: {
    title: '👤 Your Profile',
    level: 'Level',
    energy: 'Energy',
    expeditions: 'Expeditions',
    joined: 'Joined',
    notFound: 'Profile not found. Start the game first!'
  },
  
  settings: {
    title: '⚙️ Settings',
    notifications: 'Notifications',
    language: 'Language',
    back: 'Back',
    updated: '✅ Settings updated!'
  },
  
  notifications: {
    enabled: '🔔 Enabled',
    disabled: '🔕 Disabled',
    dailyReminders: 'Daily Reminders',
    events: 'Events',
    researchComplete: 'Research Complete',
    energyRestored: 'Energy Restored',
    buildingComplete: 'Building Complete',
    marketing: 'Marketing'
  },
  
  daily: {
    title: '🎁 Daily Reward',
    claimed: '✅ You\'ve already claimed your daily reward!',
    notAvailable: '⏰ Your daily reward is not yet available.',
    streak: '🔥 Current streak',
    claimButton: '🎁 Claim Now'
  },
  
  events: {
    title: '🎉 Events',
    noEvents: 'No active events at the moment.',
    upcoming: 'Upcoming Events',
    active: 'Active Events',
    ended: 'Ended Events'
  },
  
  inactive: {
    title24h: '👋 We Miss You!',
    message24h: 'It\'s been a day since you last played Jolt Time. Your rewards are waiting!',
    title72h: '🌟 Come Back!',
    message72h: 'It\'s been 3 days since your last adventure. You\'ve missed daily rewards!',
    title7d: '💫 Jolt Time Misses You!',
    message7d: 'It\'s been a week! Log back in to claim accumulated rewards.'
  },
  
  miniApp: {
    linkTitle: '🔗 Link Your Account',
    linkMessage: 'Open the Mini App to link your account and start playing!',
    linked: '✅ Account linked successfully!',
    notLinked: '⚠️ Account not linked',
    openToLink: 'Open the Mini App to link your account.'
  },
  
  errors: {
    generic: '❌ Something went wrong. Please try again.',
    notStarted: 'Please start the bot first with /start',
    invalidCallback: '❌ Invalid callback data',
    sendFailed: '❌ Failed to send message'
  }
};

// Ukrainian translations
const uk: TranslationMessages = {
  error: '❌ Сталася помилка',
  loading: '⏳ Завантаження...',
  success: '✅ Успішно!',
  cancelled: '❌ Скасовано',
  
  commands: {
    start: 'Почати роботу з Jolt Time',
    help: 'Дізнайтесь як користуватись ботом',
    profile: 'Переглянути профіль гри',
    settings: 'Керувати налаштуваннями',
    daily: 'Отримати щоденну нагороду',
    events: 'Переглянути активні події',
    unknown: 'Невідома команда'
  },
  
  welcome: {
    title: '👋 Ласкаво просимо до Jolt Time!',
    message: `Jolt Time - це захоплююча інкрементальна гра, де ви будуєте свою імперію, проходите експедиції та досліджуєте нові технології.

З цим ботом ви отримуватимете сповіщення про:
⚡ Відновлення енергії
🏆 Завершення експедицій
🔬 Завершення досліджень
🏗️ Покращення будівель
🎉 Спеціальні події

Натисніть кнопку нижче, щоб відкрити гру!`,
    registered: '✅ Готово! Ваш профіль створено.'
  },
  
  profile: {
    title: '👤 Ваш Профіль',
    level: 'Рівень',
    energy: 'Енергія',
    expeditions: 'Експедиції',
    joined: 'Приєднався',
    notFound: 'Профіль не знайдено. Спочатку запустіть гру!'
  },
  
  settings: {
    title: '⚙️ Налаштування',
    notifications: 'Сповіщення',
    language: 'Мова',
    back: 'Назад',
    updated: '✅ Налаштування оновлено!'
  },
  
  notifications: {
    enabled: '🔔 Увімкнено',
    disabled: '🔕 Вимкнено',
    dailyReminders: 'Щоденні нагадування',
    events: 'Події',
    researchComplete: 'Дослідження завершено',
    energyRestored: 'Енергія відновлена',
    buildingComplete: 'Будівля завершена',
    marketing: 'Маркетинг'
  },
  
  daily: {
    title: '🎁 Щоденна Нагорода',
    claimed: '✅ Ви вже отримали щоденну нагороду!',
    notAvailable: '⏰ Ваша щоденна нагорода ще недоступна.',
    streak: '🔥 Поточна серія',
    claimButton: '🎁 Отримати зараз'
  },
  
  events: {
    title: '🎉 Події',
    noEvents: 'Наразі немає активних подій.',
    upcoming: 'Майбутні події',
    active: 'Активні події',
    ended: 'Завершені події'
  },
  
  inactive: {
    title24h: '👋 Сумуємо за вами!',
    message24h: 'Минуло вже два дні з вашого останнього візиту до Jolt Time. Ваші нагороди чекають!',
    title72h: '🌟 Повертайтеся!',
    message72h: 'Минуло 3 дні з вашої останньої пригоди. Ви пропустили щоденні нагороди!',
    title7d: '💫 Jolt Time сумує за вами!',
    message7d: 'Минув тиждень! Повертайтеся, щоб отримати накопичені нагороди.'
  },
  
  miniApp: {
    linkTitle: '🔗 Прив\'язати Акаунт',
    linkMessage: 'Відкрийте Mini App, щоб прив\'язати акаунт та почати грати!',
    linked: '✅ Акаунт успішно прив\'язано!',
    notLinked: '⚠️ Акаунт не прив\'язано',
    openToLink: 'Відкрийте Mini App, щоб прив\'язати акаунт.'
  },
  
  errors: {
    generic: '❌ Щось пішло не так. Будь ласка, спробуйте ще раз.',
    notStarted: 'Будь ласка, спочатку запустіть бот командою /start',
    invalidCallback: '❌ Невірні дані зворотного виклику',
    sendFailed: '❌ Не вдалося надіслати повідомлення'
  }
};

// All translations
const translations: Record<Language, TranslationMessages> = { en, uk };

// =============================================================================
// TRANSLATION FUNCTIONS
// =============================================================================

/**
 * Get a translation for a specific language.
 * 
 * @param language - Language code ('en' | 'uk')
 * @param key - Dot-notation key (e.g., 'welcome.message')
 * @param params - Optional parameters for interpolation
 * @returns Translated string
 */
export function getTranslation(language: Language, key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: unknown = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English
      value = translations[DEFAULT_LANGUAGE];
      for (const fk of keys) {
        if (value && typeof value === 'object' && fk in value) {
          value = (value as Record<string, unknown>)[fk];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Interpolate parameters
  if (params) {
    let result = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    }
    return result;
  }

  return value;
}

/**
 * Get a translation for a user (from memory/cache).
 * 
 * Note: In a real implementation, this would look up the user's language
 * from the database or a cache.
 * 
 * @param userId - User identifier
 * @param key - Translation key
 * @param params - Optional parameters
 * @returns Translated string
 */
export function t(userId: string, key: string, params?: Record<string, string | number>): string {
  // For now, default to English
  // In production, this would fetch from database
  const language = DEFAULT_LANGUAGE;
  return getTranslation(language, key, params);
}

/**
 * Translation function that accepts language directly.
 * 
 * @param language - Language code
 * @param key - Translation key
 * @param params - Optional parameters
 * @returns Translated string
 */
export function tl(language: Language, key: string, params?: Record<string, string | number>): string {
  return getTranslation(language, key, params);
}

// =============================================================================
// LANGUAGE MANAGEMENT
// =============================================================================

// In-memory cache of user languages (in production, use Redis or DB)
const userLanguageCache = new Map<string, Language>();

/**
 * Get a user's language preference.
 * 
 * @param telegramId - User's Telegram ID
 * @returns Language or default
 */
export async function getUserLanguage(telegramId: number): Promise<Language> {
  // Check cache first
  if (userLanguageCache.has(String(telegramId))) {
    return userLanguageCache.get(String(telegramId))!;
  }

  // In production, fetch from database
  // For now, return default
  return DEFAULT_LANGUAGE;
}

/**
 * Set a user's language preference.
 * 
 * @param telegramId - User's Telegram ID
 * @param language - Language to set
 */
export async function setUserLanguage(telegramId: number, language: Language): Promise<void> {
  // Update cache
  userLanguageCache.set(String(telegramId), language);

  // In production, also persist to database
  // This would be done via Supabase
}

/**
 * Get all available languages.
 */
export function getAvailableLanguages(): { code: Language; name: string; flag: string }[] {
  return Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({
    code: code as Language,
    name,
    flag: LANGUAGE_FLAGS[code as Language]
  }));
}

/**
 * Check if a language code is valid.
 */
export function isValidLanguage(code: string): code is Language {
  return code === 'en' || code === 'uk';
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  t,
  tl,
  getTranslation,
  getUserLanguage,
  setUserLanguage,
  getAvailableLanguages,
  isValidLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  translations
};
