import type { Vector } from ".";

/**
 * Gets the distance between two vector points (in up to 4D co-ordinates)
 *
 * @param vector1 The first vector (up to 4D)
 * @param vector2 The second vector (up to 4D)
 *
 * @returns The scalar distance between the two points
 */
export const getDistance = <D extends UpTo4>(
  vector1: Vector<D>,
  vector2: Vector<D>
): number => {
  const [x1, y1 = 0, z1 = 0, t1 = 0] = vector1;
  const [x2, y2 = 0, z2 = 0, t2 = 0] = vector2;

  const dx = x1 - x2;
  const dy = y1 - y2;
  const dz = z1 - z2;
  const dt = t1 - t2;

  return Math.hypot(dx, dy, dz, dt);
};

type UpTo4 = 1 | 2 | 3 | 4;
