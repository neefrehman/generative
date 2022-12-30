/**
 * Returns the shortest screen dimension (width or height)
 *
 * @param options
 */
export const getShortestViewportDimension = ({
  withMargin,
  cap,
}: {
  /** Reduces the size of the dimension, used to create a margin around it. If `true`, a default margin will be set */
  withMargin?: boolean | number;
  /** Gives a ceiling to the dimension. Useful to not create massive canvases on large screens */
  cap?: number;
} = {}): number => {
  const shortestViewportDimension = Math.min(window.innerWidth, window.innerHeight);

  const cappedDimension = cap
    ? Math.min(shortestViewportDimension, cap)
    : shortestViewportDimension;

  const defaultMargin = cappedDimension > 600 ? 80 : 40;
  const margin = typeof withMargin === "boolean" ? defaultMargin : withMargin;
  const usedMargin = withMargin ? margin : 0;

  return cappedDimension - usedMargin;
};
