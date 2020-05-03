/**
 * Returns a multidimensional array, to your desired dimensions and values.
 *
 * Both numbers and arrays of number are supported to create an array. If a number is passed as the dimensions parameter, an array with exactly that many dimensions and the smallest possible lengths is returned. If an array is passed, the returned multidimensional array will have those exact dimensions. For example passing in [3, 2, 5] will result in an array that is 3x2x5 in size.
 *
 * All values across the array at all depths can also be initialised to a specific value with the optional second parameter.
 *
 * @param dimensions - The desired dimensions of the array. A number or array of numbers.
 * @param initialValues - The value that each item across all depths of the array will initialise to, which can be anything. Defaults to null.
 * @returns A nested array of N dimensions, with each item initialised to the optional initialValues parameter.
 *
 */
const createNDimensionalArray = (
    dimensions: number | number[],
    initialValues: any = null // TODO: callback for self-aware starting - https://github.com/arjunmehta/multidimensional#self-aware-values-with-callback
): any[] => {
    let matrix: any[];

    if (typeof dimensions === "number") {
        const initialArray = Array(dimensions).fill(initialValues);
        const needsRecursion = dimensions > 1;

        matrix = needsRecursion
            ? initialArray.map(() =>
                  createNDimensionalArray(dimensions - 1, initialValues)
              )
            : initialArray;
    } else {
        const currentDimensionWidth = dimensions[0];
        const remainingDimensions = dimensions.slice(1);
        const initialArray = Array(currentDimensionWidth).fill(initialValues);
        const needsRecursion = remainingDimensions.length > 1;

        matrix = needsRecursion
            ? initialArray.map(() =>
                  createNDimensionalArray(remainingDimensions, initialValues)
              )
            : initialArray.map(() => Array(dimensions[1]).fill(initialValues));
    }

    return matrix;
};

export default createNDimensionalArray;
