/**
 * Telegram Utilities
 *
 * Reusable helpers for Telegram integration:
 * - Telegram ID utilities
 * - Username helpers
 * - Launch parameter helpers
 * - Safe parsing
 * - Formatting
 */

/**
 * Telegram ID utilities.
 */

/**
 * Validate if a value is a valid Telegram user ID.
 */
export function isValidTelegramId(id: number | string | undefined | null): boolean {
  if (id === undefined || id === null) return false;
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return Number.isInteger(numId) && numId > 0 && numId < 2 ** 53;
}

/**
 * Parse a Telegram ID from various formats.
 */
export function parseTelegramId(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') {
    return isValidTelegramId(value) ? value : null;
  }
  const parsed = parseInt(value, 10);
  return isValidTelegramId(parsed) ? parsed : null;
}

/**
 * Safe stringify for Telegram IDs.
 */
export function stringifyTelegramId(id: number): string {
  return String(id);
}

/**
 * Extract numeric ID from Telegram update or message.
 */
export function extractChatId(update: Record<string, unknown>): number | null {
  const message = update.message as Record<string, unknown> | undefined;
  const chat = message?.chat as Record<string, unknown> | undefined;
  if (chat?.id) {
    return parseTelegramId(chat.id as number);
  }

  const callbackQuery = update.callback_query as Record<string, unknown> | undefined;
  const callbackChat = callbackQuery?.chat as Record<string, unknown> | undefined;
  if (callbackChat?.id) {
    return parseTelegramId(callbackChat.id as number);
  }

  return null;
}

/**
 * Username helpers.
 */

/**
 * Validate Telegram username format.
 */
export function isValidUsername(username: string | undefined | null): boolean {
  if (!username) return false;
  // Telegram usernames are 5-32 characters, start with letter, contain letters, numbers, underscores
  return /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(username);
}

/**
 * Sanitize username for display.
 */
export function sanitizeUsername(username: string | undefined | null): string {
  if (!username) return '';
  // Remove @ if present
  return username.replace(/^@/, '').trim();
}

/**
 * Format username for display with @ prefix.
 */
export function formatUsername(username: string | undefined | null): string {
  if (!username) return '';
  const sanitized = sanitizeUsername(username);
  return `@${sanitized}`;
}

/**
 * Extract username from text (e.g., "@username").
 */
export function extractUsername(text: string): string | null {
  const match = text.match(/@([a-zA-Z][a-zA-Z0-9_]{4,31})/);
  return match ? match[1] : null;
}

/**
 * Build display name from user parts.
 */
export function buildDisplayName(
  firstName: string,
  lastName?: string,
  username?: string
): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (username) {
    return sanitizeUsername(username);
  }
  return 'Unknown User';
}

/**
 * Build user mention HTML.
 */
export function buildUserMention(
  userId: number,
  name: string,
  escapeHtml = true
): string {
  const escapedName = escapeHtml ? escapeHtmlEntities(name) : name;
  return `<a href="tg://user?id=${userId}">${escapedName}</a>`;
}

/**
 * Escape HTML entities.
 */
export function escapeHtmlEntities(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Launch parameter helpers.
 */

/**
 * Parse start parameter safely.
 */
export function parseStartParam(param: string | undefined | null): {
  command?: string;
  args?: Record<string, string>;
} {
  if (!param) return {};

  // Split by space for command and args
  const parts = param.split(' ');
  const command = parts[0];

  // Parse key=value pairs
  const args: Record<string, string> = {};
  for (let i = 1; i < parts.length; i++) {
    const [key, value] = parts[i].split('=');
    if (key) {
      args[key] = value ?? 'true';
    }
  }

  return { command, args };
}

/**
 * Build start parameter from command and args.
 */
export function buildStartParam(command: string, args?: Record<string, string>): string {
  if (!args || Object.keys(args).length === 0) {
    return command;
  }
  const argsString = Object.entries(args)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');
  return `${command} ${argsString}`;
}

/**
 * Extract referral user ID from start parameter.
 */
export function extractReferralId(startParam: string | undefined | null): number | null {
  if (!startParam) return null;

  // Match ref= followed by digits
  const match = startParam.match(/ref=(\d+)/);
  return match ? parseTelegramId(match[1]) : null;
}

/**
 * Extract campaign info from start parameter.
 */
export function extractCampaignInfo(
  startParam: string | undefined | null
): { source?: string; medium?: string; campaign?: string } | null {
  if (!startParam) return null;

  const result: Record<string, string> = {};

  const sourceMatch = startParam.match(/utm_source=([^&\s]+)/);
  if (sourceMatch) result.source = decodeURIComponent(sourceMatch[1]);

  const mediumMatch = startParam.match(/utm_medium=([^&\s]+)/);
  if (mediumMatch) result.medium = decodeURIComponent(mediumMatch[1]);

  const campaignMatch = startParam.match(/utm_campaign=([^&\s]+)/);
  if (campaignMatch) result.campaign = decodeURIComponent(campaignMatch[1]);

  return Object.keys(result).length > 0 ? result as { source?: string; medium?: string; campaign?: string } : null;
}

/**
 * Safe parsing utilities.
 */

/**
 * Safe JSON parse with fallback.
 */
export function safeJsonParse<T>(
  text: string,
  fallback: T
): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safe date parsing for Telegram timestamps.
 */
export function safeParseDate(timestamp: number | string | undefined | null): Date | null {
  if (timestamp === undefined || timestamp === null) return null;
  const num = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(num)) return null;
  return new Date(num * 1000); // Telegram uses Unix seconds
}

/**
 * Safe number parsing.
 */
export function safeParseNumber(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Safe boolean parsing.
 */
export function safeParseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === 'true' || value === '1' || value.toLowerCase() === 'yes';
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

/**
 * Formatting utilities.
 */

/**
 * Format Unix timestamp to readable time.
 */
export function formatUnixTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString();
}

/**
 * Format Unix timestamp to readable date.
 */
export function formatUnixDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
}

/**
 * Format Unix timestamp to readable date and time.
 */
export function formatUnixDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

/**
 * Format relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: Date | number): string {
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date * 1000 : date.getTime();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Truncate text with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Generate a unique request ID.
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce a function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle a function.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Deep clone an object.
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
