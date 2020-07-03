import React from "react";
import p5 from "p5";

import { P5Wrapper } from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    let x2: number;
    let y2: number;
    let x3: number;
    let y3: number;
    let x4: number;
    let y4: number;
    let gridSize: number;
    let xOff = 0;
    let yOff = 200;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.frameRate(10);

        p.noFill();
        p.strokeWeight(2);

        x2 = p.width / 2;
        y2 = p.height / 2;
        x3 = p.width / 2;
        y3 = p.height / 2;
        x4 = p.width / 2;
        y4 = p.height / 2;

        gridSize = p.width > 450 ? 200 : 120;
    };

    p.draw = () => {
        p.background(20);

        for (let x = 0; x < p.width; x += gridSize) {
            for (let y = 0; y < p.height; y += gridSize) {
                p.stroke(p.random(70, 255));

                x += p.random(1, -1);
                y += p.random(1, -1);

                x2 =
                    p.map(p.noise(xOff + 0), 0, 1, 0, p.width) +
                    p.random(-5, 5);
                y2 =
                    p.map(p.noise(yOff + 500), 0, 1, 0, p.width) +
                    p.random(-5, 5);
                x3 =
                    p.map(p.noise(xOff + 0), 0, 1, 0, p.width) +
                    p.random(-5, 5);
                y3 =
                    p.map(p.noise(yOff + 0), 0, 1, 0, p.width) +
                    p.random(-5, 5);
                x4 =
                    p.map(p.noise(xOff + 0), 0, 1, 0, p.width) +
                    p.random(-5, 5);
                y4 =
                    p.map(p.noise(yOff + 0), 0, 1, 0, p.width) +
                    p.random(-5, 5);

                p.beginShape();
                p.vertex(x, y);
                p.bezierVertex(x2, y2, x3, y3, x4, y4);
                p.endShape();
            }
        }

        xOff += 0.02;
        yOff += 0.02;
    };
};

const S020819 = () => <P5Wrapper sketch={sketch} />;

export default S020819;
