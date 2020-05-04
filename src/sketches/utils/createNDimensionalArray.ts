/**
 * Returns a multidimensional array, to your desired dimensions and values.
 *
 * Both numbers and number arrays are supported to create an array. If a number is passed as the dimensions parameter, the smallest array array with that number of dimensions is returned. If an array is passed, the returned multidimensional array will have those exact dimensions. For example, passing in [3, 2, 5] will result in an array that is 3x2x5 in size.
 *
 * All values across all depths of the array can be initialised to a specific value with the optional second parameter.
 *
 * @param dimensions - The desired dimensions of the array. A number or array of numbers.
 * @param initialValues - The value that each item across all depths of the array will initialise to, which can be anything. Defaults to null.
 * @returns A nested array of N dimensions, with each item initialised to the optional initialValues parameter.
 *
 */
const createNDimensionalArray = (
    dimensions: number | number[],
    initialValues: any = null
): any[] => {
    let currentDimensionWidth: number;
    let remainingDimensions: number | number[];
    let needsRecursion: boolean;

    if (typeof dimensions === "number") {
        currentDimensionWidth = dimensions;
        remainingDimensions = dimensions - 1;
        needsRecursion = remainingDimensions > 0;
    } else {
        currentDimensionWidth = dimensions[0];
        remainingDimensions = dimensions.slice(1);
        needsRecursion = remainingDimensions.length > 0;
    }

    const currentMatrix = Array(currentDimensionWidth).fill(initialValues);

    const finalMatrix = needsRecursion
        ? currentMatrix.map(() =>
              createNDimensionalArray(remainingDimensions, initialValues)
          )
        : currentMatrix;

    return finalMatrix;
};

export default createNDimensionalArray;
