(() => {
    let mouseLocation;
    let target;
    let distance;
    let resetMouseLocation;

    let mouseHasMoved = false;
    let lastMouseMovement = 0;

    const balls = [];
    class Ball {
        constructor(r) {
            this.xOff = random(200);
            this.yOff = random(400, 600);
            this.r = r || 1;
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;

            this.x =
                mouseLocation.x +
                map(noise(this.xOff), 0, 1, -width / 2, width / 2);
            this.y =
                mouseLocation.y +
                map(noise(this.yOff), 0, 1, -height / 2, height / 2);

            ellipse(this.x, this.y, this.r);
            if (this.r < 36) this.r++;
        }

        collides(sibling) {
            const d = dist(this.x, this.y, sibling.x, sibling.y);
            return d < this.r / 2 + sibling.r;
        }

        excited() {
            this.xOff += 0.005;
            this.yOff += 0.005;
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        for (let i = 0; i < 3; i++) {
            balls.push(new Ball(36));
        }

        resetMouseLocation = () =>
            (mouseLocation = createVector(width / 2, height / 2));

        target = createVector(width / 2, height / 2);
        resetMouseLocation();
    };

    draw = () => {
        background(20);

        if (frameCount % 360 == 0) {
            if (balls.length < width / 40) balls.push(new Ball());
        }

        for (const ball of balls) {
            ball.update();

            for (const sibling of balls) {
                if (ball != sibling && ball.collides(sibling)) {
                    ball.excited();
                    sibling.excited();
                }
            }
        }

        if (mouseHasMoved) {
            target =
                lastMouseMovement < frameCount - 100
                    ? createVector(width / 2, height / 2)
                    : createVector(mouseX, mouseY);
        } else {
            resetMouseLocation();
        }

        distance = target.dist(mouseLocation);
        target.sub(mouseLocation);
        target.normalize();
        const mappedDistance = map(distance, 100, 0, 5, 0.5);
        target.mult(mappedDistance);
        mouseLocation.add(target);
    };

    mouseMoved = () => {
        mouseHasMoved = true;
        lastMouseMovement = frameCount;
    };

    mousePressed = () => {
        if (balls.length < width / 40) balls.push(new Ball());
    };
})();
