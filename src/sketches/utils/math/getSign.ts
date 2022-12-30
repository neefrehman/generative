/**
 * Returns the sign (positive or negative) of a value relative to 0, or a custom pivot point.
 *
 * @param n - The value to get the sign of
 * @param pivotPoint - The pivot around which the sign is relative
 *
 * @example
 * getSign(12)  //  1
 * getSign(-4)  // -1
 * getSign(1200, 1000)  //  1
 * getSign(0.27, 0.3)   // -1
 */
export const getSign = (n: number, pivotPoint = 0) => {
  if (n > pivotPoint) return 1;
  if (n < pivotPoint) return -1;
  return 0;
};
