import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const balls: Ball[] = [];

    class Ball {
        x: number;
        y: number;
        r: number;
        distOffset: number;
        isHorizontal: boolean;
        sizeOffset: number;
        fill: number;
        stroke: number;
        vel: number;

        constructor(x: number, y: number) {
            this.x = x || p.width / 2;
            this.y = y || p.height / 2;
            this.r = 0;
            this.distOffset = 0;
            this.isHorizontal = Math.random() >= 0.5;

            this.sizeOffset = 200;

            this.fill = 255;
            this.stroke = 0;
        }

        update() {
            this.distOffset += 0.01;
            this.vel = p.map(p.noise(this.distOffset), 0, 1, -18, 18);
            if (this.isHorizontal) {
                this.x += this.vel;
            } else {
                this.y += this.vel;
            }

            this.sizeOffset += 0.01;
            this.vel = p.map(p.noise(this.sizeOffset), 0, 1, -6, 6);
            this.r += this.vel;

            p.stroke(this.stroke);
            p.fill(this.fill);

            p.ellipse(this.x, this.y, this.r);
        }

        hovered() {
            const d = p.dist(this.x, this.y, p.mouseX, p.mouseY);
            return d + 10 < this.r;
        }

        excited() {
            this.fill = 0;
            this.stroke = 255;
        }

        normal() {
            this.fill = 255;
            this.stroke = 0;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        balls[0] = new Ball(p.width / 2, p.height / 2);
    };

    p.draw = () => {
        p.background(20);

        if (p.frameCount % 15 === 0) {
            balls.push(new Ball(p.random(p.width), p.random(p.height)));
        }

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();

            if (balls[i].hovered()) {
                balls[i].excited();
            } else {
                balls[i].normal();
            }
        }

        if (balls.length > 600) {
            balls.splice(0, 1);
        }
    };

    p.mousePressed = () => {
        balls.push(new Ball(p.mouseX, p.mouseY));
    };
};

const S090619 = () => <P5Renderer sketch={sketch} />;

export default S090619;
