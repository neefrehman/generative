/* eslint-disable no-nested-ternary */

export const bounceOut = (t: number): number => {
  const a = 4.0 / 11.0;
  const b = 8.0 / 11.0;
  const c = 9.0 / 10.0;

  const ca = 4356.0 / 361.0;
  const cb = 35442.0 / 1805.0;
  const cc = 16061.0 / 1805.0;

  const t2 = t * t;

  return t < a
    ? 7.5625 * t2
    : t < b
    ? 9.075 * t2 - 9.9 * t + 3.4
    : t < c
    ? ca * t2 - cb * t + cc
    : 10.8 * t * t - 20.52 * t + 10.72;
};

export const bounceIn = (t: number): number => 1.0 - bounceOut(1.0 - t);

export const bounceInOut = (t: number): number =>
  t < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
