import { lerp } from "./lerp";
import type { Vector } from "./types";

/**
 * Performs a linear interpolation between two vectors. For getting values between a min and max vector
 *
 * @param startVector The first vector to interpolate from
 * @param endVector The Second vector to interpolate to
 * @param alpha The amount of interpolation. A number between 0 and 1
 * @returns The interpolated vector
 *
 * @example
 * // Choose a random point within a 3D range
 * const start = [0, 0, 0];
 * const end = [25, 50, 25];
 * const point = lerpArray(start, end, Math.random());
 */
export const lerpVector = <D extends number>(
    startVector: Vector<D>,
    endVector: Vector<D>,
    alpha: number
): Vector<D> => {
    if (startVector.length !== endVector.length)
        throw new TypeError("start & end vectors should have the same length");

    const lerpedVector: Vector = startVector
        .slice()
        .map((_, i) => lerp(startVector[i], endVector[i], alpha));

    return lerpedVector;
};
