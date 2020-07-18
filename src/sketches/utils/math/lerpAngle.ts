import { lerp } from ".";

/**
 * Performs a linear interpolation between two angles
 *
 * @param start First value
 * @param end Second value
 * @param alpha The amount of interpolation. A number between 0 and 1
 * @param options An optional configuration object, used to determine if the angle
 * is in degrees or radians (defaults to radians)
 * @returns The interpolated value
 */
export const lerpAngle = (
    start: number,
    end: number,
    alpha: number,
    options?: { inDegrees: boolean }
): number => {
    let result: number;
    const angleDiff = end - start;

    const fullRotation = options?.inDegrees ? 360 : Math.PI * 2;
    const halfRotation = options?.inDegrees ? 180 : Math.PI;

    if (angleDiff < -halfRotation) {
        // lerp upwards past fullRotation
        const usedEnd = end + fullRotation;
        result = lerp(start, usedEnd, alpha);
        if (result >= fullRotation) result -= fullRotation;
    } else if (angleDiff > halfRotation) {
        // lerp downwards past 0
        const usedEnd = end - fullRotation;
        result = lerp(start, usedEnd, alpha);
        if (result < 0) result += fullRotation;
    } else {
        // straight lerp
        result = lerp(start, end, alpha);
    }

    return result;
};
