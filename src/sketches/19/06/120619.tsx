import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const balls: Ball[] = [];
    class Ball {
        xOff: number;
        yOff: number;
        x: number;
        y: number;

        constructor() {
            this.xOff = p.random(200);
            this.yOff = p.random(400, 600);
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;

            this.x = p.map(p.noise(this.xOff), 0, 1, 0, p.width);
            this.y = p.map(p.noise(this.yOff), 0, 1, 0, p.height);

            p.ellipse(this.x, this.y, 36);
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        balls.push(new Ball());
    };

    p.draw = () => {
        p.background(20);

        if (p.frameCount % 400 === 0) {
            balls.push(new Ball());
        }

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }
    };

    p.mousePressed = () => {
        balls.push(new Ball());
    };
};

const S120619 = () => <P5Renderer sketch={sketch} />;

export default S120619;
