/**
 * Converts an rgba (and optionally a) value to a string to be used in the canvas context.
 * If one argument is provided, it will be used for all rgb values.
 *
 * @param r - The red value
 * @param g - The green value
 * @param b - The blue value
 * @param a - The alpha value — defaults to 255
 */
export const rgbaToString = (r: number, g?: number, b?: number, a?: number) => {
  const red = r;
  const green = g ?? r;
  const blue = b ?? r;
  const alpha = a ?? 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
