/**
 * Returns the sign (positive or negative) of a value.
 * If n > 0 return 1, if n < 0 return -1, otherwise return 0.
 *
 * @param n - The value to get the sign of
 */
export const getSign = (n: number) => {
    if (n > 0) return 1;
    if (n < 0) return -1;
    return 0;
};
