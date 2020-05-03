import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let cols: number;
    let rows: number;
    let scale = 25;

    let xDir = 1;
    let yDir = 1;
    let xMult = 1;
    let yMult = 1;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        const w = p.windowWidth;
        const h = p.windowHeight;
        cols = w / scale;
        rows = h / scale;
    };

    p.draw = () => {
        p.background(20);
        p.stroke(255);
        p.noFill();

        for (let y = 0; y < rows; y++) {
            p.beginShape(p.TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                p.vertex(x * xMult * scale, y * scale);
                p.vertex(x * yMult * scale, y + 1 * scale);
            }
            p.endShape();
        }

        scale += 0.015;
        yMult += yDir * 0.05;
        xMult += xDir * 0.02;

        if (p.frameCount % 100 === 0) {
            xDir *= -1;
        }

        if (p.frameCount % 170 === 0) {
            yDir *= -1;
        }
    };
};

const S201019 = () => <P5Wrapper sketch={sketch} />;

export default S201019;
