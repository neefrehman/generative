/* eslint-disable no-param-reassign, no-bitwise, no-nested-ternary */
import { inRange } from "../inRange";

import type { NoiseOptions } from "./types";

// Adapted from http://mrl.nyu.edu/~perlin/noise/ via THREE — with added random seeding

// prettier-ignore
const p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10,
    23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87,
    174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
    133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
    89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5,
    202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119,
    248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
    178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249,
    14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
    93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

for (let i = 0; i < 256; i++) p[i] = i;
for (let i = 0; i < 256; i++) {
  const r = inRange(0, 256, { isInteger: true });
  const temp = p[i];
  p[i] = p[r];
  p[r] = temp;
}
for (let i = 0; i < 256; i++) p[i + 256] = p[i];

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

const perlinNoise = (x: number, y: number, z: number) => {
  const floorX = Math.floor(x);
  const floorY = Math.floor(y);
  const floorZ = Math.floor(z);

  const X = floorX & 255;
  const Y = floorY & 255;
  const Z = floorZ & 255;

  x -= floorX;
  y -= floorY;
  z -= floorZ;

  const xMinus1 = x - 1;
  const yMinus1 = y - 1;
  const zMinus1 = z - 1;

  const u = fade(x);
  const v = fade(y);
  const w = fade(z);

  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;

  return lerp(
    w,
    lerp(
      v,
      lerp(u, grad(p[AA], x, y, z), grad(p[BA], xMinus1, y, z)),
      lerp(u, grad(p[AB], x, yMinus1, z), grad(p[BB], xMinus1, yMinus1, z))
    ),
    lerp(
      v,
      lerp(u, grad(p[AA + 1], x, y, zMinus1), grad(p[BA + 1], xMinus1, y, zMinus1)),
      lerp(
        u,
        grad(p[AB + 1], x, yMinus1, zMinus1),
        grad(p[BB + 1], xMinus1, yMinus1, zMinus1)
      )
    )
  );
};

/**
 * Produces 1-dimensional classical perlin noise. This is equivalent to perlin3D(x, 0, 0).
 * @param x - The x offset of the noise value
 * @returns The generated value of the noise
 */
export const perlin1D = (
  x: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * perlinNoise(x * frequency, 0, 0);

/**
 * Produces 2-dimensional classical perlin noise. This is equivalent to perlin3D(x, y, 0).
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @returns The generated value of the noise
 */
export const perlin2D = (
  x: number,
  y: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * perlinNoise(x * frequency, y * frequency, 0);

/**
 * Produces 3-dimensional classical perlin noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @param z - The z offset of the noise value
 * @returns The generated value of the noise
 */
export const perlin3D = (
  x: number,
  y: number,
  z: number,
  { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * perlinNoise(x * frequency, y * frequency, z * frequency);
