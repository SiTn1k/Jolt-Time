/**
 * User Language Type
 *
 * Strongly typed ISO 639-1 language codes supported by the application.
 */

/**
 * Supported language codes for user interface localization.
 */
export type UserLanguage =
  | 'en'
  | 'es'
  | 'ru'
  | 'zh'
  | 'pt'
  | 'de'
  | 'fr'
  | 'it'
  | 'ja'
  | 'ko'
  | 'ar'
  | 'hi';

/**
 * All supported languages as an array for iteration.
 */
export const SUPPORTED_LANGUAGES: readonly UserLanguage[] = [
  'en',
  'es',
  'ru',
  'zh',
  'pt',
  'de',
  'fr',
  'it',
  'ja',
  'ko',
  'ar',
  'hi',
] as const;

/**
 * Default language for new users.
 */
export const DEFAULT_USER_LANGUAGE: UserLanguage = 'en';

/**
 * Checks if a language code is supported.
 */
export function isSupportedLanguage(value: string): value is UserLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}
