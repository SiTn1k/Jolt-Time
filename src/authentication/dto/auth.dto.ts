/**
 * Authentication DTOs
 *
 * Data Transfer Objects for authentication operations.
 */

/**
 * DTO for Telegram initData validation request.
 */
export interface ValidateInitDataDto {
  initData: string;
  botToken?: string;
}

/**
 * DTO for authentication response.
 */
export interface AuthResponseDto {
  userId: string;
  internalUserId: string;
  sessionToken: string;
  expiresAt: string;
  isPremium: boolean;
  username: string | null;
  displayName: string;
}

/**
 * DTO for session information.
 */
export interface SessionDto {
  id: string;
  internalUserId: string;
  provider: string;
  status: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
  lastAccessedAt: string;
}

/**
 * DTO for user identity information.
 */
export interface UserIdentityDto {
  id: string;
  internalUserId: string;
  telegramId: number | null;
  provider: string;
  username: string | null;
  displayName: string;
  isPremium: boolean;
  createdAt: string;
  lastAuthenticatedAt: string;
}

/**
 * DTO for login history entry.
 */
export interface LoginHistoryDto {
  id: string;
  internalUserId: string;
  telegramId: number | null;
  provider: string;
  success: boolean;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
}

/**
 * DTO for security event.
 */
export interface SecurityEventDto {
  id: string;
  eventType: string;
  internalUserId: string | null;
  telegramId: number | null;
  ipAddress: string | null;
  details: Record<string, unknown>;
  severity: string;
  createdAt: string;
}

/**
 * DTO for authentication context (current user state).
 */
export interface AuthContextDto {
  isAuthenticated: boolean;
  isPremium: boolean;
  user: UserIdentityDto | null;
  session: SessionDto | null;
}

/**
 * DTO for session refresh request.
 */
export interface RefreshSessionDto {
  sessionToken: string;
}

/**
 * DTO for logout request.
 */
export interface LogoutDto {
  sessionToken?: string;
  allSessions?: boolean;
}

/**
 * DTO for creating a new session.
 */
export interface CreateSessionDto {
  internalUserId: string;
  provider: string;
  telegramId?: number;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * DTO for access check result.
 */
export interface AccessCheckDto {
  allowed: boolean;
  reason?: string;
  requiredPermissions?: string[];
}