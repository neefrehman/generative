/**
 * Chooses a random number between min (inclusive) and max (exclusive).
 * If only one argument is provided, the min is defaulted to 0, and that argument
 * is used as the max.
 *
 * @param min - The lower bound of the range
 * @param max - The upper bound of the range
 * @param options.isInteger - A boolean than will force the returned value to be an integer if `true`
 * @param options.not - A number to *not* use as the generated value. useful when generating multiple numbers
 *
 * @returns a number between the ranges
 */
export const inRange = (
    min: number,
    max?: number,
    options?: { isInteger?: boolean; not?: number }
): number => {
    const { isInteger = false, not = undefined } = options ?? {};
    const upperBound = max ?? min;
    const lowerBound = max ? min : 0;

    let generatedNumber = !isInteger
        ? Math.random() * (upperBound - lowerBound) + lowerBound
        : Math.floor(
              Math.random() * (Math.ceil(upperBound) - Math.floor(lowerBound) + 1)
          ) + Math.floor(lowerBound);

    if (not !== undefined && generatedNumber === not) {
        generatedNumber = inRange(min, max, options);
    }

    return generatedNumber;
};
