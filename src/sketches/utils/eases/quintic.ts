/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-cond-assign */

export const quinticIn = (t: number): number => t * t * t * t * t;

export const quinticOut = (t: number): number => --t * t * t * t * t + 1;

export const quinticInOut = (t: number): number => {
  if ((t *= 2) < 1) return 0.5 * t * t * t * t * t;
  return 0.5 * ((t -= 2) * t * t * t * t + 2);
};
