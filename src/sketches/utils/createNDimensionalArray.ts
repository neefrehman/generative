/**
 * The returned  matrix (multidimensional array), typed recusively to ensure each
 * point matches the type of `createNDimensionalArray`'s initialValues parameter.
 */
type Matrix<T> = T[] | Matrix<T>[];

/**
 * Returns a matrix (multidimensional array) with your desired dimensions and values.
 *
 * Both numbers and number arrays are supported to create the matrix. If a number is
 * passed as the `dimensions` parameter, the smallest array with that number of
 * dimensions is returned. If an array is passed, the returned matrix will have
 * those exact dimensions. For example, passing in `[3, 2, 5]` will result in a
 * three-dimensional array that is 3x2x5 in size.
 *
 * All points within the matrix can be initialised to a specific value with the
 * optional `initialValues` parameter.
 *
 * @param dimensions - The desired dimensions of the matrix. A number or array of numbers.
 * @param initialValues - The value that each point in the matrix will initialise to. Defaults to `null`.
 * @returns A matrix of `N` dimensions, with each point initialised to the `initialValues` parameter.
 */
const createNDimensionalArray = <T>(
    dimensions: number | number[],
    initialValues: T = null
): Matrix<T> => {
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
