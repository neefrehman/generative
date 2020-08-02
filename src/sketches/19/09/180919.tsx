import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

import { moveToVector } from "LibUtils/p5";

const sketch = (p: p5) => {
    let mouseLocation: p5.Vector;
    let target: p5.Vector;
    let resetMouseLocation: () => void;

    let mouseHasMoved = false;
    let lastMouseMovement = 0;

    const balls: Ball[] = [];
    class Ball {
        xOff: number;
        yOff: number;
        r: number;
        x: number;
        y: number;

        constructor(r?: number) {
            this.xOff = p.random(200);
            this.yOff = p.random(400, 600);
            this.r = r || 1;
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;

            this.x =
                mouseLocation.x +
                p.map(p.noise(this.xOff), 0, 1, -p.width / 2, p.width / 2);
            this.y =
                mouseLocation.y +
                p.map(p.noise(this.yOff), 0, 1, -p.height / 2, p.height / 2);

            p.ellipse(this.x, this.y, this.r);
            if (this.r < 36) this.r += 1;
        }

        collides(sibling: Ball) {
            const d = p.dist(this.x, this.y, sibling.x, sibling.y);
            return d < this.r / 2 + sibling.r;
        }

        excited() {
            this.xOff += 0.005;
            this.yOff += 0.005;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        for (let i = 0; i < 3; i++) {
            balls.push(new Ball(36));
        }

        resetMouseLocation = () => {
            mouseLocation = p.createVector(p.width / 2, p.height / 2);
        };

        target = p.createVector(p.width / 2, p.height / 2);
        resetMouseLocation();
    };

    p.draw = () => {
        p.background(20);

        if (p.frameCount % 360 === 0) {
            if (balls.length < p.width / 40) balls.push(new Ball());
        }

        balls.forEach(ball => {
            ball.update();

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
                    ? p.createVector(p.width / 2, p.height / 2)
                    : p.createVector(p.mouseX, p.mouseY);
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

const S180919 = () => <P5Renderer sketch={sketch} />;

export default S180919;
