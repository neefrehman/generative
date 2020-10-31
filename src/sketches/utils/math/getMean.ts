import { getSum } from "./getSum";

/**
 * Gets the mean average from an array of numbers
 *
 * @param array - The array of numbers to be averaged
 * @returns The mean average of the array
 */
export const getMean = (array: number[]): number => getSum(array) / array.length;
