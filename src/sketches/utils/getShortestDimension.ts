/**
 * Returns the shortest screen dimension (width or height)
 */
const getShortestDimension = (): number =>
    Math.min(window.innerWidth, window.innerHeight);

export default getShortestDimension;
