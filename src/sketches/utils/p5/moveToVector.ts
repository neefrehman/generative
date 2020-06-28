import p5 from "p5";

/**
 * Moves a point towards a vector, with speed inversely related to the distance between them
 * @param currentPosition - The current position of the point that needs moving
 * @param target - The vector target to move towards
 * @param p5Instance - The instance of p5 that the sketch is running
 */
const moveToVector = (
    currentPosition: p5.Vector,
    target: p5.Vector,
    p5Instance: p5
) => {
    const distance = target.dist(currentPosition);
    target.sub(currentPosition);
    target.normalize();
    const mappedDistance = p5Instance.map(distance, 100, 0, 5, 0.5);
    target.mult(mappedDistance);
    currentPosition.add(target);

    return currentPosition;
};

export default moveToVector;
