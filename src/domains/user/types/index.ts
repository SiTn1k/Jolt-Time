/**
 * User Domain Types
 *
 * Type definitions for the user domain.
 */

export { UserStatus } from './UserStatus';
export { UserRole } from './UserRole';
export type { UserLanguage } from './UserLanguage';
export { SUPPORTED_LANGUAGES, DEFAULT_USER_LANGUAGE, isSupportedLanguage } from './UserLanguage';
export type { UserPermissions, UserPermission } from './UserPermissions';
export { DEFAULT_PERMISSIONS } from './UserPermissions';
export type { UserMetadata, RegistrationSource } from './UserMetadata';
export { createDefaultUserMetadata } from './UserMetadata';
