import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const circles: Circle[] = [];
    const transparentCircles = true;
    const alpha = transparentCircles === true ? 0 : 255;

    class Circle {
        x: number;
        y: number;
        r: number;
        sizeOffset: number;
        vel: number;

        constructor() {
            this.x = p.width / 2;
            this.y = p.height / 2;
            this.r = 0;

            this.sizeOffset = 0;
        }

        update() {
            this.sizeOffset += 0.05;
            this.vel = p.map(p.noise(this.sizeOffset), 0, 1, -8, 10);
            this.r += this.vel;

            p.ellipse(this.x, this.y, this.r);
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.stroke(255);
        p.strokeWeight(2);
        p.fill(20, alpha);

        circles.push(new Circle());
    };

    p.draw = () => {
        p.background(20);

        if (p.frameCount % 40 === 0) {
            circles.push(new Circle());
        }

        for (let i = 0; i < circles.length; i++) {
            circles[i].update();
        }

        if (circles.length > 80) {
            circles.splice(0, 1);
        }
    };

    p.mousePressed = () => {
        circles.push(new Circle());
    };
};

const S110619 = () => <P5Renderer sketch={sketch} />;

export default S110619;
