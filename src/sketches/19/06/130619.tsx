import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/renderers/P5Wrapper";

const sketch = (p: p5) => {
    const balls = [];
    class Ball {
        xOff: number;
        yOff: number;
        r: number;
        x: number;
        y: number;

        constructor() {
            this.xOff = p.random(200);
            this.yOff = p.random(400, 600);
            this.r = 36;
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;

            this.x = p.map(p.noise(this.xOff), 0, 1, 0, p.width);
            this.y = p.map(p.noise(this.yOff), 0, 1, 0, p.height);

            p.ellipse(this.x, this.y, this.r);
        }

        collides(sibling: { x: number; y: number; r: number }) {
            const d = p.dist(this.x, this.y, sibling.x, sibling.y);
            return d < this.r / 2 + sibling.r;
        }

        excited() {
            this.xOff += 0.01;
            this.yOff += 0.01;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        for (let i = 0; i < 3; i++) {
            balls.push(new Ball());
        }
    };

    p.draw = () => {
        p.background(20);

        if (p.frameCount % 400 === 0) {
            balls.push(new Ball());
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
    };

    p.mousePressed = () => {
        balls.push(new Ball());
    };
};

const S130619 = () => <P5Wrapper sketch={sketch} />;

export default S130619;
