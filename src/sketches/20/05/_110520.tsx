import React from "react";
import p5 from "p5";
import makeMatrix from "make-matrix";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let resolution: number;
    let grid: number[][][];

    let camXOff = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.stroke(181, 105, 25);
        p.strokeWeight(2);

        resolution = p.width * 0.05;
        const numColumns = Math.ceil(p.width / resolution);
        const numRows = Math.ceil(p.height / resolution);
        grid = makeMatrix([numColumns, numRows, numColumns]);
    };

    p.draw = () => {
        p.background(12, 32, 11);

        p.translate(-p.width / 2, -p.height / 2);
        p.camera(
            p.width / 2,
            p.height / 2,
            p.height / 2.0 / p.tan((p.PI * 30.0) / 180.0),
            0,
            0,
            0,
            0,
            1,
            0
        );

        grid.forEach((column, x) => {
            column.forEach((row, y) => {
                row.forEach((depth, z) => {
                    const curX = x * resolution;
                    const curY = y * resolution;
                    const curZ = z * resolution;

                    p.line(curX, curY, curZ, curX + resolution, curY, curZ);
                    p.line(curX, curY, curZ, curX, curY + resolution, curZ);
                    p.line(curX, curY, curZ, curX, curY, curZ + resolution);
                });
            });
        });
    };

    p.mouseMoved = () => {
        camXOff = p.map(p.mouseY, 0, p.height, -0.1, 0.1);
    };
};

const S040520 = () => <P5Wrapper sketch={sketch} />;

export default S040520;
