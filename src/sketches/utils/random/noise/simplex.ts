import SimplexNoise from "simplex-noise";

import type { NoiseOptions } from "./types";

/** Instantiate the generator */
const noiseGenerator = new SimplexNoise();

/**
 * Produces 1-dimensional simplex noise. This is equivalent to noise2D(x, 0).
 * @param x - The x offset of the noise value
 * @returns The generated value of the noise
 */
export const simplex1D = (
  x: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * noiseGenerator.noise2D(x * frequency, 0);

/**
 * Produces 2-dimensional simplex noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @returns The generated value of the noise
 */
export const simplex2D = (
  x: number,
  y: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);

/**
 * Produces 3-dimensional simplex noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @param z - The z offset of the noise value
 * @returns The generated value of the noise
 */
export const simplex3D = (
  x: number,
  y: number,
  z: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * noiseGenerator.noise3D(x * frequency, y * frequency, z * frequency);

/**
 * Produces 4-dimensional simplex noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @param z - The z offset of the noise value
 * @param w - The t offset of the noise value
 * @returns The generated value of the noise
 */
export const simplex4D = (
  x: number,
  y: number,
  z: number,
  w: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) =>
  amplitude *
  noiseGenerator.noise4D(x * frequency, y * frequency, z * frequency, w * frequency);
