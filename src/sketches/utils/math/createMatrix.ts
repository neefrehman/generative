/* eslint-disable @typescript-eslint/no-use-before-define, no-underscore-dangle, no-nested-ternary */
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
 * const twoDNumberArray = createMatrix([3, 5], 0); // A 3x5 array initialised to 0
 *
 * const twoDRandomNumberArray = createMatrix([1, 4], () => Math.random()); // A 1x4 array initialised with random numbers
 *
 * const twoDVectorArray = createMatrix([3, 3], vector => vector.join()); // A 3x3 array initialised with each point's co-ordinate as a string
 */
export const createMatrix = <D extends number, T>(
    dimensions: D | Vector<D>,
    initialValues: ValueOrFunction<D, T> = null
): Matrix<D, T> => {
    const dimensionCount =
        typeof dimensions === "number" ? dimensions : dimensions.length;
    const intialPosition = Array(dimensionCount).fill(0) as Vector<D>;

    return _createMatrix(dimensions, initialValues, intialPosition);
};

/**
 * Recursively creates a matrix, and keeps track of the current vactor.
 */
function _createMatrix<D extends number, T>(
    dimensions: D | Vector<D>,
    initialValues: ValueOrFunction<D, T> = null,
    currentPosition: Vector<D>
): Matrix<D, T> {
    let currentDimensionLength: number;
    let remainingDimensions: number | Vector;
    let remainingDimensionCount: number;

    if (typeof dimensions === "number") {
        currentDimensionLength = dimensions;
        remainingDimensions = dimensions - 1;
        remainingDimensionCount = remainingDimensions;
    } else {
        currentDimensionLength = dimensions[0] ?? 0;
        remainingDimensions = dimensions.slice(1);
        remainingDimensionCount = remainingDimensions.length;
    }

    if (!Number.isInteger(currentDimensionLength)) {
        throw new TypeError(`Dimensions must be integers`);
    }

    const currentDimension = currentPosition.length - 1 - remainingDimensionCount;
    const needsRecursion = remainingDimensionCount > 0;

    const finalMatrix = [...Array(currentDimensionLength)].map((_, i) => {
        currentPosition[currentDimension] = i;
        // @ts-ignore — `Type instantiation is excessively deep...` - investigate https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        return needsRecursion
            ? _createMatrix(
                  remainingDimensions as D | Vector<D>,
                  initialValues,
                  currentPosition
              )
            : initialValues instanceof Function
            ? initialValues(currentPosition.slice() as Vector<D>)
            : initialValues;
    });

    return finalMatrix as Matrix<D, T>;
}

export default createMatrix;

export type { Matrix };

/**
 * A typed multidimensional array returned by `makeMatrix`
 * @remarks literals will be widened to their primitive types
 */
type Matrix<
    D extends number = 1,
    T = unknown,
    RecursionCount extends unknown[] = []
> = D extends RecursionCount["length"]
    ? WidenLiterals<T>
    : Matrix<D, T[], PlusOne<RecursionCount>>;

/**
 * Provides type safety for values as well as functions that return values
 * for `createMatrix`'s `initialValues` parameter.
 */
type ValueOrFunction<D extends number, T = unknown> =
    | T
    | ((vector: Vector<D>) => T)
    | null;

/**
 * Expands literal types to their primitive
 */
type WidenLiterals<T> = T extends boolean
    ? boolean
    : T extends string
    ? string
    : T extends number
    ? number
    : T;

/**
 * Adds one to the length of an array
 */
type PlusOne<Array extends unknown[] = []> = [unknown, ...Array];
