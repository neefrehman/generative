/* eslint-disable no-bitwise */

/**
 * A linear interpolator for hexadecimal colors
 *
 * @param start First value
 * @param end Second value
 * @param alpha The amount of interpolation. A number between 0 and 1
 */
export const lerpColor = (start: string, end: string, alpha: number): string => {
  const ah = +start.replace("#", "0x");
  const ar = ah >> 16;
  const ag = (ah >> 8) & 0xff;
  const ab = ah & 0xff;
  const bh = +end.replace("#", "0x");
  const br = bh >> 16;
  const bg = (bh >> 8) & 0xff;
  const bb = bh & 0xff;
  const rr = ar + alpha * (br - ar);
  const rg = ag + alpha * (bg - ag);
  const rb = ab + alpha * (bb - ab);

  return `#${(((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)}`;
};
