/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
/* eslint-disable no-plusplus */

export const circIn = (t: number): number => 1.0 - Math.sqrt(1.0 - t * t);

export const circOut = (t: number): number => Math.sqrt(1 - --t * t);

export const circInOut = (t: number): number => {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);

  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
};
