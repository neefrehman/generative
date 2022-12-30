/**
 * Recursively removes items from an array to reduce it's size
 *
 * @param array The array to be decimated
 * @param fidelity The decimation ratio (defaults to 2)
 * @param passes The number of recursive decimations to perform (defaults to 1)
 *
 * @returns The decimated array
 */
export const decimateArray = <T>(array: T[], fidelity = 2, passes = 1): T[] => {
  const filteredArray = array.filter((_, index) => index % fidelity === 0);
  const needsRecursion = passes > 1;

  return needsRecursion
    ? decimateArray(filteredArray, passes - 1, fidelity)
    : filteredArray;
};
