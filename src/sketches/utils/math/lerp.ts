/**
 * Performs a linear interpolation between two numbers
 *
 * @param start First value
 * @param end Second value
 * @param alpha The amount of interpolation. A number between 0 and 1
 *
 * @returns The interpolated value
 */
export const lerp = (start: number, end: number, alpha: number): number =>
  start * (1 - alpha) + end * alpha;
