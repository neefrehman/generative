/**
 * Gets the sum of an array of numbers
 *
 * @param array - The array of numbers to be summed
 * @returns The sum of the array
 */
export const getSum = (array: number[]): number =>
  array.reduce((acc, cur) => acc + cur, 0);
