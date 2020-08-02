import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const balls: Ball[] = [];
    class Ball {
        x: number;
        y: number;
        r: number;
        xoff: number;

        constructor(x: number, y: number, r: number) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.xoff = 0;
        }

        update() {
            this.xoff += 0.01;
            this.x += this.xoff;

            p.ellipse(this.x, this.y, this.r);
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        balls[0] = new Ball(p.width / 2, p.height / 2, 36);
    };

    p.draw = () => {
        p.background(20);

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }

        if (balls.length > 500) {
            balls.splice(0, 1);
        }
    };

    p.mousePressed = () => {
        balls.push(new Ball(p.mouseX, p.mouseY, 36));
    };

    p.mouseDragged = () => {
        balls.push(new Ball(p.mouseX, p.mouseY, 36));
    };
};

const S300519 = () => <P5Renderer sketch={sketch} />;

export default S300519;
