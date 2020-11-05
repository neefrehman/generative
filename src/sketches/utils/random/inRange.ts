/**
 * Chooses a random number between min (inclusive) and max (exclusive).
 * If only one argument is provided, the min is defaulted to 0, and that argument
 * is used as the max.
 *
 * @param min - The lower bound of the range
 * @param min - The upper bound of the range
 * @param options.isInteger - A boolean than will force the returned value to be an integer if `true`
 *
 * @returns a number between the ranges
 */
export const inRange = (
    min: number,
    max?: number,
    options?: { isInteger: boolean }
) => {
    const { isInteger = false } = options ?? {};
    const upperBound = max ?? min;
    const lowerBound = max ? min : 0;

    const generatedNumber = Math.random() * (upperBound - lowerBound) + min;

    return isInteger ? ~~generatedNumber : generatedNumber;
};
