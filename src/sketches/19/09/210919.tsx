import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

import { moveToVector } from "LibUtils/p5";

const sketch = (p: p5) => {
    let shortestDimension: number;
    let maxR: number;

    let mouseLocation: p5.Vector;
    let target: p5.Vector;
    let resetMouseLocation: () => void;
    let mouseHasMoved = false;
    let lastMouseMovement = 0;

    const balls: Ball[] = [];
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
                p.map(p.noise(this.xOff), 0, 1, -p.width / 2, p.width / 2);
            this.y =
                mouseLocation.y +
                p.map(p.noise(this.yOff), 0, 1, -p.height / 2, p.height / 2);
            this.z =
                mouseLocation.z +
                p.map(
                    p.noise(this.zOff),
                    0,
                    1,
                    -shortestDimension / 2,
                    shortestDimension / 2
                );

            if (this.r < maxR) this.r += 1;
        }

        show() {
            p.push();
            p.translate(this.x, this.y, this.z);
            p.sphere(this.r);
            p.pop();
        }

        collides(sibling: { x: number; y: number; z: number; r: number }) {
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

        excited() {
            this.xOff += 0.005;
            this.yOff += 0.005;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        shortestDimension = Math.min(p.width, p.height);

        p.background(20);
        p.noStroke();

        maxR = p.width > 500 ? 60 : 36;

        for (let i = 0; i < 3; i++) {
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

        const dirY = (p.mouseY / p.height - 0.5) * 2;
        const dirX = (p.mouseX / p.width - 0.5) * 2;
        p.directionalLight(255, 255, 255, -dirX, -dirY, 0.1);
        p.pointLight(255, 255, 255, 0, 0, 500);
        p.ambientMaterial(255, 255, 255);

        if (p.frameCount % 360 === 0) {
            if (balls.length < p.width / 40) balls.push(new Ball());
        }

        balls.forEach(ball => {
            ball.update();
            ball.show();

            balls.forEach(sibling => {
                if (ball !== sibling && ball.collides(sibling)) {
                    ball.excited();
                    sibling.excited();
                }
            });
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

        mouseLocation = moveToVector(mouseLocation, target, p);
    };

    p.mouseMoved = () => {
        mouseHasMoved = true;
        lastMouseMovement = p.frameCount;
    };

    p.mousePressed = () => {
        if (balls.length < p.width / 40) balls.push(new Ball());
    };
};

const S210919 = () => <P5Renderer sketch={sketch} />;

export default S210919;
