/**
 * Formatting utilities for displaying flight data
 */

/**
 * Format duration from minutes to human-readable format
 * @example formatDuration(125) // "2h 5m"
 * @example formatDuration(60) // "1h"
 * @example formatDuration(45) // "45m"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format price with currency symbol
 * @example formatPrice(412.50, 'EUR') // "€412"
 * @example formatPrice(1234, 'USD') // "$1,234"
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO datetime to human-readable format
 * @example formatDate('2025-12-25T10:30:00Z') // "Dec 25, 10:30 AM"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format ISO datetime to time only
 * @example formatTime('2025-12-25T10:30:00Z') // "10:30 AM"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format ISO datetime to elegant full date with time (includes year)
 * @example formatDateTime('2025-12-25T10:30:00Z') // "Wed, Dec 25, 2025 • 10:30 AM"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const dayMonthYear = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

  return `${dayMonthYear} • ${time}`;
}

/**
 * Format stops count to readable text
 * @example formatStops(0) // "Direct"
 * @example formatStops(1) // "1 stop"
 * @example formatStops(2) // "2 stops"
 */
export function formatStops(count: number): string {
  if (count === 0) return 'Direct';
  if (count === 1) return '1 stop';
  return `${count} stops`;
}

/**
 * Format layover duration with warning colors
 * Returns class names for styling based on duration
 */
export function getLayoverColorClass(isShort: boolean, isLong: boolean): string {
  if (isShort) return 'text-danger-600';
  if (isLong) return 'text-warning-600';
  return 'text-gray-600';
}

/**
 * Format large numbers with commas
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Calculate savings percentage between two prices
 * @example calculateSavings(500, 400) // 20 (percent)
 */
export function calculateSavings(original: number, current: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Truncate text with ellipsis
 * @example truncate('Very long text here', 10) // "Very long..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}