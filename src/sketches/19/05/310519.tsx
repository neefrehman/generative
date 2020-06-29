import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const balls = [];
    class Ball {
        x: number;
        y: number;
        r: number;
        xoff: number;
        vel: number;

        constructor(x: number, y: number, r: number) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.xoff = 0;
        }

        update() {
            this.xoff += 0.01;
            this.vel = p.map(p.noise(this.xoff), 0, 1, -18, 18);
            this.x += this.vel;

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

const S310519 = () => <P5Wrapper sketch={sketch} />;

export default S310519;
