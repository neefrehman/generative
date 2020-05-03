import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let w: number;
    let h: number;
    let cols: number;
    let rows: number;
    const scale = 20;

    const terrain = [];

    let xOff = 0;
    let yOff = 0;
    const maxZOff = 60;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.background(20);
        p.frameRate(24);

        w = p.windowWidth;
        h = p.windowHeight;
        cols = w / scale;
        rows = h / scale;

        for (let y = 0; y < rows; y++) terrain[y] = [];
    };

    p.draw = () => {
        p.background(20);
        p.stroke(255);
        p.strokeWeight(0.7);
        p.noFill();

        p.rotateX(p.PI / 3);
        p.translate(-p.width / 2, -p.height / 2);

        for (let y = 0; y < rows - 1; y++) {
            p.beginShape(p.TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                terrain[y][x] = p.map(
                    p.noise(xOff, yOff),
                    0,
                    1,
                    -maxZOff,
                    maxZOff
                );
                p.vertex(x * scale, y * scale, terrain[y][x]);
                xOff += 0.01;
            }
            yOff += 0.01;
            p.endShape();
        }
    };
};

const S151019 = () => <P5Wrapper sketch={sketch} />;

export default S151019;
