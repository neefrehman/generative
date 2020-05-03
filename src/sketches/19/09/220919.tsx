import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let shortestDimension: number;
    let maxR: number;

    let mouseLocation: p5.Vector;
    let target: p5.Vector;
    let distance: number;
    let resetMouseLocation: () => void;
    let mouseHasMoved = false;
    let lastMouseMovement = 0;

    let shading = 2;

    const balls = [];
    class Ball {
        xOff: number;
        yOff: number;
        zOff: number;
        r: number;
        x: number;
        y: number;
        z: number;

        constructor(r?: number) {
            this.xOff = p.random(200);
            this.yOff = p.random(400, 600);
            this.zOff = p.random(800, 1000);
            this.r = r || 1;
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;
            this.zOff += 0.01;

            this.x =
                mouseLocation.x +
                p.map(p.noise(this.xOff), 0, 1, -p.width / 5, p.width / 5);
            this.y =
                mouseLocation.y +
                p.map(p.noise(this.yOff), 0, 1, -p.height / 5, p.height / 5);
            this.z =
                mouseLocation.z +
                p.map(
                    p.noise(this.zOff),
                    0,
                    1,
                    -shortestDimension / 5,
                    shortestDimension / 5
                );

            if (this.r < maxR) this.r += 1;
        }

        show() {
            p.push();
            p.translate(this.x, this.y, this.z);
            p.sphere(this.r);
            p.pop();
        }

        collides(sibling: Ball) {
            const d = p.dist(
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

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        shortestDimension = Math.min(p.width, p.height);

        p.background(20);
        p.noStroke();

        maxR = p.width > 500 ? 60 : 36;

        for (let i = 0; i < 80; i++) {
            balls.push(new Ball(maxR));
        }

        resetMouseLocation = () => {
            mouseLocation = p.createVector(
                p.width / 2,
                p.height / 2,
                shortestDimension / 2
            );
        };

        target = p.createVector(
            p.width / 2,
            p.height / 2,
            shortestDimension / 2
        );
        resetMouseLocation();
    };

    p.draw = () => {
        p.camera(0, 0, shortestDimension * 2, p.tan(p.PI / 6), 0, 0, 0, 1, 0);
        p.background(20);
        p.translate(-p.width / 2, -p.height / 2);

        if (shading === 0) {
            p.ambientLight(255, 255, 255);
            p.ambientMaterial(255, 255, 255);
        } else if (shading === 1) {
            const dirY = (p.mouseY / p.height - 0.5) * 2;
            const dirX = (p.mouseX / p.width - 0.5) * 2;
            p.directionalLight(255, 255, 255, -dirX, -dirY, 0.1);
            p.pointLight(255, 255, 255, 0, 0, 500);
            p.ambientMaterial(255, 255, 255);
        } else if (shading === 2) {
            p.normalMaterial();
        }

        balls.forEach(ball => {
            ball.update();
            ball.show();
        });

        if (mouseHasMoved) {
            target =
                lastMouseMovement < p.frameCount - 100
                    ? p.createVector(
                          p.width / 2,
                          p.height / 2,
                          shortestDimension / 2
                      )
                    : p.createVector(p.mouseX, p.mouseY, shortestDimension / 2);
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

    p.mousePressed = () => {
        shading = shading < 2 ? shading + 1 : 0;
    };
};

const S220919 = () => <P5Wrapper sketch={sketch} />;

export default S220919;
