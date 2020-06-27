import p5 from "p5";

/**
 * Moves a point towards a vector over time
 */
const moveToVector = (options?: {
    startingVector: p5.Vector;
    resetDelay: number;
}) => {
    let p: p5;

    const {
        startingVector = p.createVector(p.width / 2, p.height / 2),
        resetDelay = 100
    } = options;

    let mouseLocation: p5.Vector;
    let target: p5.Vector;
    let distance: number;
    let resetMouseLocation: () => void;

    let mouseHasMoved = false;
    let lastMouseMovement = 0;

    p.setup = () => {
        resetMouseLocation = () => {
            mouseLocation = startingVector;
        };

        target = startingVector;
        resetMouseLocation();
    };

    p.draw = () => {
        if (mouseHasMoved) {
            target =
                lastMouseMovement < p.frameCount - resetDelay
                    ? startingVector
                    : p.createVector(p.mouseX, p.mouseY);
        } else {
            resetMouseLocation();
        }

        distance = target.dist(mouseLocation);
        target.sub(mouseLocation);
        target.normalize();
        const mappedDistance = p.map(distance, 100, 0, 5, 0.5);
        target.mult(mappedDistance);
        mouseLocation.add(target);
    };

    p.mouseMoved = () => {
        mouseHasMoved = true;
        lastMouseMovement = p.frameCount;
    };
};

export default moveToVector;
