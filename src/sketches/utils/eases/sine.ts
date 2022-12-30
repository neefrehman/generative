export const sineIn = (t: number): number => {
  const v = Math.cos(t * Math.PI * 0.5);
  if (Math.abs(v) < 1e-14) return 1;
  return 1 - v;
};

export const sineOut = (t: number): number => Math.sin((t * Math.PI) / 2);

export const sineInOut = (t: number): number => -0.5 * (Math.cos(Math.PI * t) - 1);
