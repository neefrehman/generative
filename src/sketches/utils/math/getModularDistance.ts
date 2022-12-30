/**
 * Computes modular distance between 2 values (the distance in a circular space)
 *
 * @param value The first value
 * @param mod The second value
 *
 * @returns The scalar distance between the two points
 */
export const getModularDistance = (value: number, mod: number): number =>
  Math.min(value % mod, Math.abs(mod - (value % mod)));
