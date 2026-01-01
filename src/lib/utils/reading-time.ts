/**
 * Calculate reading time for content
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  // Remove HTML tags if present
  const text = content.replace(/<[^>]*>/g, "");

  // Count words
  const words = text.trim().split(/\s+/).length;

  // Calculate reading time in minutes
  const readingTime = Math.ceil(words / wordsPerMinute);

  return Math.max(1, readingTime);
}

/**
 * Format reading time to display string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min read";
  }
  return `${minutes} min read`;
}

/**
 * Calculate and format reading time from content
 */
export function getReadingTime(content: string): string {
  const minutes = calculateReadingTime(content);
  return formatReadingTime(minutes);
}
