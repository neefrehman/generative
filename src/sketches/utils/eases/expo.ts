/* eslint-disable no-nested-ternary */

export const expoIn = (t: number): number =>
  t === 0.0 ? t : 2.0 ** (10.0 * (t - 1.0));

export const expoOut = (t: number): number =>
  t === 1.0 ? t : 1.0 - 2.0 ** (-10.0 * t);

export const expoInOut = (t: number): number =>
  t === 0.0 || t === 1.0
    ? t
    : t < 0.5
    ? +0.5 * 2.0 ** (20.0 * t - 10.0)
    : -0.5 * 2.0 ** (10.0 - t * 20.0) + 1.0;
