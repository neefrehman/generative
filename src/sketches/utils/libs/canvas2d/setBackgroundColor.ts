/**
 * Clears the canvas background with color.
 *
 * @param ctx - the canvas context
 * @param color - The color to be draewn
 */
export const clearBackgroundWithColor = (
  ctx: CanvasRenderingContext2D,
  color: string
): void => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = color;
  ctx.fill();
};
