/**
 * Recursively removes items frtom an array to reduce it's size
 *
 * @param array The array to be decimated
 * @param passes The number of recursive decimations to perform (defaults to 1)
 * @param fidelity The decimation ratio (defaults to 2)
 *
 * @returns The decimated array
 */
export const decimateArray = <T>(array: T[], passes = 1, fidelity = 2): T[] => {
    const filteredArray = array.filter((_, index) => index % fidelity === 0);
    const needRecursion = passes > 1;

    return needRecursion
        ? decimateArray(filteredArray, passes - 1, fidelity)
        : filteredArray;
};
