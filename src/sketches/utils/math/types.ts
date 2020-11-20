/**
 * A vector point of to up to any dimension.
 * Adding the generic `D` will set the number of dimensions
 *
 * @example
 * const vector2D: Vector<2> = [1, 3]
 * const vector4D: Vector<4> = [1, 1, 3, 9]
 * const vectorAnyD: Vector = [1, 3, 9, 0,..., 4]
 */
export interface Vector<D extends number = any> extends Array<number> {
    0?: number;
    length: D;
}
// Follow: https://github.com/microsoft/TypeScript/issues/26223

/**
 * A multidimensional array. Provides type-safety up to 5 dimensions.
 * Above 5 dimensions, it's reccomended to annotate variables for more safety.
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
    : unknown[][][][][][]; // TODO: Full type safety?
