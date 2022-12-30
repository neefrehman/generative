/**
 * Produces a linearly-spaced array of N numbers in an array, interpolating from 0 toward 1.
 * By default, 1 is exclusive, but you can pass options. includeEnd as true to interpolate to and
 * include 1 as the final element. Options. offset offsetc the value of each point.
 *
 * @param n - The number of points in the array
 * @param options - An optional configuration object to set `includesEnd` and `offset`
 * @param options.includeEnd - Set as true to interpolate to and include 1 as the final element.
 * @param options.offset - Offsets the index of the array by this number
 *
 * @return A linearly-spaced array of N numbers
 *
 * @example
 * console.log(linspace(4));
 * // [ 0, 0.25, 0.5, 0.75 ]
 * console.log(linspace(5, { includeEnd: true }));
 * // [ 0, 0.25, 0.5, 0.75, 1 ]
 */
export const linspace = (
  n: number,
  options?: { includeEnd?: boolean; offset?: number }
) => {
  const { includeEnd = false, offset = 0 } = options ?? {};

  return Array.from({ length: n }, (_, i) =>
    includeEnd ? (i + offset) / (n - 1) : (i + offset) / n
  );
};
