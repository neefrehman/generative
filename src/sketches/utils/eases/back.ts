/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */

export const backIn = (t: number): number => {
  const s = 1.70158;
  return t * t * ((s + 1) * t - s);
};

export const backOut = (t: number): number => {
  const s = 1.70158;
  return --t * t * ((s + 1) * t + s) + 1;
};

export const backInOut = (t: number): number => {
  const s = 1.70158 * 1.525;
  if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
};
