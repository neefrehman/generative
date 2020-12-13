/**
 * Clamps a dynamic input between minumum and maximum values
 *
 * @param minimum - lower bound of the clamp
 * @param value - the incoming value to be clamped
 * @param maximum - upper bound of the clamp
 *
 * @return the clamped number
 */
export const clamp = (minimum: number, value: number, maximum: number): number =>
    Math.min(Math.max(value, minimum), maximum);
