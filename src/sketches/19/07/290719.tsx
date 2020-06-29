import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    let randomOffSetOption: number;
    let gridSize: number;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.frameRate(10);
        p.noFill();

        randomOffSetOption = p.random(-50, 50);
        gridSize = p.width > 450 ? 100 : 80;
    };

    p.draw = () => {
        p.background(20);

        let x2 = 0;
        let y2 = 0;
        let x3 = 0;
        let y3 = 0;
        let x4 = 0;
        let y4 = 0;

        for (let x = 0; x < p.width; x += gridSize) {
            for (let y = 0; y < p.height; y += gridSize) {
                const offsetOptions = [randomOffSetOption];

                p.stroke(p.random(70, 255));

                x += p.random(1, -1);
                y += p.random(1, -1);

                x2 += p.random(offsetOptions);
                y2 += p.random(offsetOptions);
                x3 -= p.random(offsetOptions);
                y3 += p.random(offsetOptions);
                x4 += p.random(offsetOptions);
                y4 += p.random(offsetOptions);

                p.beginShape();
                p.vertex(x, y);
                p.bezierVertex(x2, y2, x3, y3, x4, y4);
                p.endShape();
            }
        }
    };
};

const S290719 = () => <P5Wrapper sketch={sketch} />;

export default S290719;
