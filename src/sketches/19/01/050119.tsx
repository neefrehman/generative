import React from "react";
import p5 from "p5";

import { P5Wrapper } from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.frameRate(10);
    };

    p.draw = () => {
        const x1 = Math.random() * 200;
        const y1 = Math.random() * 200;
        const x2 = Math.random() * 200;
        const y2 = Math.random() * 200;
        const x3 = Math.random() * 200;
        const y3 = Math.random() * 200;
        const x4 = Math.random() * 200;
        const y4 = Math.random() * 200;

        const filled = () => {
            p.noStroke();
            p.fill(Math.random() * 255, 200);
        };

        const outlined = () => {
            p.stroke(Math.random() * 255, 200);
            p.noFill();
        };

        const drawHorizontally = () => {
            for (let i = 0; i <= p.width + 400; i += 200) {
                p.translate(200, 0);
                p.quad(x1, y1, x2, y2, x3, y3, x4, y4);
            }
        };

        p.translate(-p.width / 2 - 200, -p.height / 2);
        filled();
        drawHorizontally();

        for (let i2 = 0; i2 <= p.height; i2 += 200) {
            p.translate(-p.width - 600, 200);
            outlined();
            drawHorizontally();

            p.translate(-p.width - 600, 200);
            filled();
            drawHorizontally();
        }
    };
};

const S050119 = () => <P5Wrapper sketch={sketch} />;

export default S050119;
