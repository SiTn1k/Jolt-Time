/**
 * Format Utilities
 *
 * Common formatting helper functions.
 */

/**
 * Format a number with thousand separators.
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a number as currency.
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a number as compact (1K, 1M, etc).
 */
export function formatCompact(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

/**
 * Format a percentage.
 */
export function formatPercent(
  value: number,
  decimals = 1,
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format a date in short format.
 */
export function formatDateShort(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Format a date in long format.
 */
export function formatDateLong(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Format time in short format.
 */
export function formatTimeShort(
  date: Date | string | number,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(d);
}

/**
 * Format a relative time string.
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const d = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(diffSec, 'second');
  if (diffMin < 60) return rtf.format(diffMin, 'minute');
  if (diffHour < 24) return rtf.format(diffHour, 'hour');
  if (diffDay < 30) return rtf.format(diffDay, 'day');
  if (diffDay < 365) return rtf.format(Math.floor(diffDay / 30), 'month');
  return rtf.format(Math.floor(diffDay / 365), 'year');
}

/**
 * Format duration in milliseconds to human readable.
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format duration for display (00:00:00).
 */
export function formatDurationClock(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format energy display.
 */
export function formatEnergy(current: number, max: number): string {
  return `${formatNumber(current)} / ${formatNumber(max)}`;
}

/**
 * Format XP display.
 */
export function formatXP(current: number, nextLevel: number): string {
  return `${formatCompact(current)} / ${formatCompact(nextLevel)}`;
}

/**
 * Truncate a string with ellipsis.
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix = '...'
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to title case.
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

/**
 * Convert a value to Date.
 */
export function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return new Date(value);
}

/**
 * Convert to ISO date string (YYYY-MM-DD).
 */
export function toISODateString(date: Date | string | number): string {
  const d = toDate(date);
  return d.toISOString().split('T')[0];
}

/**
 * Generate a UUID v4.
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
