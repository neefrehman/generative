import type { Vector } from ".";

/**
 * Gets the angle between two vector points on a 2D plane
 *
 * @param vector1 - The first vector
 * @param vector2 - The second vector
 * @param options.inDegrees - Defines if the angle will be determined in degrees or radians (defaults to radians)
 *
 * @returns The angle between the two points
 */
export const getAngle = (
  vector1: Vector<2>,
  vector2: Vector<2>,
  options?: { inDegrees: boolean }
): number => {
  const [x1, y1] = vector1;
  const [x2, y2] = vector2;

  return options?.inDegrees
    ? (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
    : Math.atan2(y2 - y1, x2 - x1);
};
