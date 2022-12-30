/**
 * Uses the pixel ratio of the current device to resize and rescale the canvas.
 */
export const fixDevicePixelRatio = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  if (typeof window === undefined) {
    return;
  }
  const dpr = window.devicePixelRatio;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.scale(dpr, dpr);
};
