/**
 * Gets the distance between two vector points
 *
 * @param vector1 The first vector
 * @param vector2 The second vector
 *
 * @returns The scalar distance between the two points
 */
const getDistance = (
    vector1: [number, number],
    vector2: [number, number]
): number => {
    const [x1, y1] = vector1;
    const [x2, y2] = vector2;

    const a = x1 - x2;
    const b = y1 - y2;

    return Math.hypot(a, b);
};
export default getDistance;
