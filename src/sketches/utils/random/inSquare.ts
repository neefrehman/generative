import type { Vector } from "../math";

/**
 * Chooses a random 2D point within a square.
 *
 * @param width - The width of the square
 * @param height - The height of the square
 * @returns A vector point within the square
 */
export const inSquare = (width = 1, height = 1): Vector<2> => [
    Math.random() * width,
    Math.random() * height,
];
