/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

export const quadraticIn = (t: number): number => t * t;

export const quadraticOut = (t: number): number => -t * (t - 2.0);

export const quadraticInOut = (t: number): number => {
  t /= 0.5;
  if (t < 1) return 0.5 * t * t;
  t--;
  return -0.5 * (t * (t - 2) - 1);
};
