import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

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
        p.frameRate(20);

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
                    p.random(-10, 10);
                y2 =
                    p.map(p.noise(yOff + 500), 0, 1, 0, p.width) +
                    p.random(-10, 10);
                x3 =
                    p.map(p.noise(xOff + 80), 0, 1, 0, p.width) +
                    p.random(-10, 10);
                y3 =
                    p.map(p.noise(yOff + 300), 0, 1, 0, p.width) +
                    p.random(-10, 10);
                x4 =
                    p.map(p.noise(xOff + 800), 0, 1, 0, p.width) +
                    p.random(-10, 10);
                y4 =
                    p.map(p.noise(yOff + 999), 0, 1, 0, p.width) +
                    p.random(-10, 10);

                p.beginShape();
                p.vertex(x, y);
                p.bezierVertex(x2, y2, x3, y3, x4, y4);
                p.endShape();
            }
        }

        xOff += 0.01;
        yOff += 0.01;
    };
};

const S030819 = () => <P5Renderer sketch={sketch} />;

export default S030819;
