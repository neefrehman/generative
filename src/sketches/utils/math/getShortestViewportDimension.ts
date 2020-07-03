/**
 * Returns the shortest screen dimension (width or height)
 *
 * @param options.withMargin - Creates a margin to reduce the size of the dimension. Used to give the canvas some room.
 */
export const getShortestViewportDimension = ({
    withMargin
}: {
    /** Reduces the size of the dimension, used to create a margin around it. If `true`, a default margin will be set */
    withMargin?: boolean | number;
}): number => {
    const shortestViewportDimension = Math.min(
        window.innerWidth,
        window.innerHeight
    );

    const autoMargin = shortestViewportDimension > 600 ? 100 : 40;
    const margin = typeof withMargin === "boolean" ? autoMargin : withMargin;
    const usedMargin = withMargin ? margin : 0;

    return shortestViewportDimension - usedMargin;
};
