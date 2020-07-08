/**
 * Gets the mean average from an array of numbers
 *
 * @param array - The array of numbers to be averaged
 * @returns The mean average of the array
 */
export const getMean = (array: number[]): number =>
    array.reduce((acc, cur) => acc + cur, 0) / array.length;