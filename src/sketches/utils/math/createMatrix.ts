import type { Vector } from "./types";

/**
 * Returns a matrix (multi-dimensional array) with your desired dimensions and
 * values.
 *
 * If a number is passed as the `dimensions` parameter, the smallest array with
 * that number of dimensions is returned. If an array of numbers is passed, the returned
 * matrix will be of those exact dimensions.
 *
 * @param dimensions `D`: The desired dimensions of the matrix. A number or array of numbers.
 * @param initialValues The value that each point in the matrix initialises to. Can also take a
 *  callback function which returns a value to fill the matrix dynamically. Defaults to `null`.
 *
 * @example
 * const twoDArray = createMatrix(2); // A 2D array
 *
 * const threeXThreeXTwoArray = createMatrix([3, 3, 2]); // An array of size 3x3x2
 *
 * const twoDNumberArray = createMatrix([3, 5], 0); // A 3x5 array, each point set to 0
 *
 * const threeDStringArray = createMatrix([2, 6, 5], "hi"); // A 2x6x5 array, each point set to "hi"
 *
 * const twoDRandomNumberArray = makeMatrix([1, 4], () => Math.random()); // A 1x4 array initialised with random numbers
 */
export const createMatrix = <D extends number, T>(
    dimensions: D | Vector<D>,
    initialValues: ValueOrFunction<T> = null
): Matrix<D, T> => {
    let currentDimensionLength: number;
    let remainingDimensions: number | number[];
    let needsRecursion: boolean;

    if (typeof dimensions === "number") {
        currentDimensionLength = dimensions;
        remainingDimensions = dimensions - 1;
        needsRecursion = remainingDimensions > 0;
    } else {
        currentDimensionLength = dimensions[0];
        remainingDimensions = dimensions.slice(1);
        needsRecursion = remainingDimensions.length > 0;
    }

    if (!Number.isInteger(currentDimensionLength)) {
        throw new TypeError(`Dimensions must be integers`);
    }

    const currentMatrix = [...Array(currentDimensionLength)];

    const finalMatrix = needsRecursion
        ? currentMatrix.map(() => createMatrix(remainingDimensions, initialValues))
        : currentMatrix.map(() => {
              return typeof initialValues === "function"
                  ? initialValues()
                  : initialValues;
          });

    return finalMatrix as Matrix<D, T>;
};

//
//
// -----
// TYPES
//
//

/**
 * Provides type safety for values as well as functions that return values
 * for `createMatrix`'s `initialValues` parameter.
 * https://github.com/microsoft/TypeScript/issues/37663
 */
type ValueOrFunction<T> = T extends boolean
    ? boolean | (() => boolean) // To solve boolean expansion: https://github.com/microsoft/TypeScript/issues/30029
    : T extends any // from: https://github.com/microsoft/TypeScript/issues/37663
    ? T | (() => T)
    : never;

/**
 * A multidimensional array returned by `createMatrix`. Provides type-safety up
 * to 5 dimensions. Above 5 dimensions, it's reccomended you annotate your
 * variables for more safety.
 */
export type Matrix<D extends number, T> = D extends 1
    ? T[]
    : D extends 2
    ? T[][]
    : D extends 3
    ? T[][][]
    : D extends 4
    ? T[][][][]
    : D extends 5
    ? T[][][][][]
    : any[][][][][][]; // TODO: Full type safety?
