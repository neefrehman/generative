(() => {
    let shortestDimension;
    let maxR;

    let mouseLocation;
    let target;
    let distance;
    let resetMouseLocation;
    let mouseHasMoved = false;
    let lastMouseMovement = 0;

    let shading = 2;

    const balls = [];
    class Ball {
        constructor(r) {
            this.xOff = random(200);
            this.yOff = random(400, 600);
            this.zOff = random(800, 1000);
            this.r = r || 1;
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;
            this.zOff += 0.01;

            this.x =
                mouseLocation.x +
                map(noise(this.xOff), 0, 1, -width / 5, width / 5);
            this.y =
                mouseLocation.y +
                map(noise(this.yOff), 0, 1, -height / 5, height / 5);
            this.z =
                mouseLocation.z +
                map(
                    noise(this.zOff),
                    0,
                    1,
                    -shortestDimension / 5,
                    shortestDimension / 5
                );

            if (this.r < maxR) this.r++;
        }

        show() {
            push();
            translate(this.x, this.y, this.z);
            sphere(this.r);
            pop();
        }

        collides(sibling) {
            const d = dist(
                this.x,
                this.y,
                this.z,
                sibling.x,
                sibling.y,
                sibling.z
            );
            return d < this.r / 2 + sibling.r;
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        shortestDimension = Math.min(width, height);

        background(20);
        noStroke();

        maxR = width > 500 ? 60 : 36;

        for (let i = 0; i < 80; i++) {
            balls.push(new Ball(maxR));
        }

        resetMouseLocation = () => {
            mouseLocation = createVector(
                width / 2,
                height / 2,
                shortestDimension / 2
            );
        };

        target = createVector(width / 2, height / 2, shortestDimension / 2);
        resetMouseLocation();
    };

    draw = () => {
        camera(0, 0, shortestDimension * 2, tan(PI / 6), 0, 0, 0, 1, 0);
        background(20);
        translate(-width / 2, -height / 2);

        if (shading === 0) {
            ambientLight(255, 255, 255);
            ambientMaterial(255, 255, 255);
        } else if (shading === 1) {
            const dirY = (mouseY / height - 0.5) * 2;
            const dirX = (mouseX / width - 0.5) * 2;
            directionalLight(255, 255, 255, -dirX, -dirY, 0.1);
            pointLight(255, 255, 255, 0, 0, 500);
            ambientMaterial(255, 255, 255);
        } else if (shading === 2) {
            normalMaterial(255, 255, 255);
        }

        for (const ball of balls) {
            ball.update();
            ball.show();
        }

        if (mouseHasMoved) {
            target =
                lastMouseMovement < frameCount - 100
                    ? createVector(width / 2, height / 2, shortestDimension / 2)
                    : createVector(mouseX, mouseY, shortestDimension / 2);
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
        shading = shading < 2 ? shading + 1 : 0;
    };
})();
