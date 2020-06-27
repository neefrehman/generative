/**
 * Returns the shortest screen dimension (width or height)
 * @param withMargin - If true, a margin will be created to reduce the size, to give the canvas some room
 */
const getShortestDimension = (withMargin?: boolean): number => {
    const shortestDimension = Math.min(window.innerWidth, window.innerHeight);
    const calculatedMargin = shortestDimension > 600 ? 50 : 25;
    const usedMargin = withMargin ? calculatedMargin : 0;

    return shortestDimension - usedMargin;
};

export default getShortestDimension;
