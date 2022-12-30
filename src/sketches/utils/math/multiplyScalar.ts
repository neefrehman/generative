/**
 * Multiplies a vector by a scalar value
 *
 * @param vector The vector to be multiplied
 * @param scalar The scalar to multiply the vector by
 *
 * @returns The vector with each point multiplied by the scalar value
 */
export const multiplyScalar = (vector: number[], scalar: number): number[] =>
  vector.map(point => point * scalar);
