/**
 * Gets the mean average from an array of numbers
 *
 * @param {number[]} array The array of numbers to be averaged
 * @returns {number} The mean average of the array
 */
const getMean = (array: number[]): number =>
    array.reduce((acc, cur) => acc + cur, 0) / array.length;

export default getMean;
