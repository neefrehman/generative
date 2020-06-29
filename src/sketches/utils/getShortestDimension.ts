/**
 * Returns the shortest screen dimension (width or height)
 * @param withMargin - Creates a margin to reduce the size of the dimension. Used to give the canvas some room.
 */
const getShortestDimension = ({
    withMargin
}: {
    /** Adds a margin to the dimension, reducing it's size to give some room around it. If `true`, a default margin will be set */
    withMargin?: boolean | number;
}): number => {
    const shortestDimension = Math.min(window.innerWidth, window.innerHeight);
    const autoMargin = shortestDimension > 600 ? 100 : 40;
    const margin = typeof withMargin === "boolean" ? autoMargin : withMargin;
    const usedMargin = withMargin ? margin : 0;

    return shortestDimension - usedMargin;
};

export default getShortestDimension;
