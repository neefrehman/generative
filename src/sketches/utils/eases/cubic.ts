export const cubicIn = (t: number): number => t * t * t;

export const cubicOut = (t: number): number => {
  const f = t - 1.0;
  return f * f * f + 1.0;
};

export const cubicInOut = (t: number): number =>
  t < 0.5 ? 4.0 * t * t * t : 0.5 * (2.0 * t - 2.0 ** 3.0) + 1.0;
