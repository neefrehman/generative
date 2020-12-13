import { clamp } from "./clamp";
/**
 * Re-maps a number from one range to another.
 *
 * @param value - the incoming value to be converted
 * @param inputMin - lower bound of the value's current range
 * @param inputMax - upper bound of the value's current range
 * @param outputMin - lower bound of the value's target range
 * @param outputMax - upper bound of the value's target range
 * @param options - A configuration object to set `clamp` which constrains the value to the newly mapped range
 *
 * @return the re-mapped number
 *
 * @example
 * // Converts normalized -1..1 coordinate to screen coordinate
 * const x = -1;
 * const pixel = mapToRange(x, -1, 1, 0, width, true);
 */
export const mapToRange = (
    value: number,
    inputMin: number,
    inputMax: number,
    outputMin: number,
    outputMax: number,
    options?: { clamp?: boolean }
) => {
    if (Math.abs(inputMin - inputMax) < Number.EPSILON) return outputMin;

    let outputValue =
        ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
        outputMin;

    if (options?.clamp) outputValue = clamp(outputMin, outputValue, outputMax);

    return outputValue;
};
