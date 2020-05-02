import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let w: number;
    let h: number;
    let cols: number;
    let rows: number;
    const scale = 20;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.background(20);
        p.frameRate(24);

        w = p.windowWidth;
        h = p.windowHeight;
        cols = w / scale;
        rows = h / scale;
    };

    p.draw = () => {
        p.background(20);
        p.stroke(255);
        p.strokeWeight(0.7);
        p.noFill(); // TODO: figure out why there is fill

        p.rotateX(p.PI / 3);
        p.translate(-p.width / 2, -p.height / 2);

        const zOff = 6;

        for (let y = 0; y < rows; y++) {
            p.beginShape(p.TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                p.vertex(x * scale, y * scale, p.random(-zOff, zOff));
            }
            p.endShape();
        }
    };
};

const S141019 = () => <P5Wrapper sketch={sketch} />;

export default S141019;
