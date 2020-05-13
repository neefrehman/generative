import React from "react";
import p5 from "p5/lib/p5.min";
import makeMatrix from "make-matrix";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let longestDimension: number;
    let res: number;
    let grid: number[][][];

    let camZStart;
    let camZ;

    let camXOff = 0;
    let camYOff = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.stroke(181, 105, 25);
        p.strokeWeight(3);

        longestDimension = Math.max(p.width, p.height);
        res = longestDimension * 0.1;
        const numColumns = Math.ceil(p.width / res);
        const numRows = Math.ceil(p.height / res);
        grid = makeMatrix([numColumns, numRows, numColumns]);

        camZStart = p.width > 800 ? (-res * numColumns) / 2 : 2 * res;
        camZ = camZStart;
    };

    p.draw = () => {
        p.background(12, 32, 11);
        camZ = camZ >= camZStart + res ? camZStart : camZ + 1;
        p.translate(-p.width / 2 + res / 2, -p.height / 2 + res / 4, camZ);
        p.rotateX(camXOff);
        p.rotateY(camYOff);

        grid.forEach((column, x) => {
            column.forEach((row, y) => {
                row.forEach((depth, z) => {
                    const curX = x * res;
                    const curY = y * res;
                    const curZ = z * res;

                    const fogIntensity =
                        z < 10 ? p.map(z, 0, row.length, 20, 255) : 255;
                    p.stroke(181, 105, 25, fogIntensity);

                    p.line(curX, curY, curZ, curX + res, curY, curZ);
                    p.line(curX, curY, curZ, curX, curY + res, curZ);
                    p.line(curX, curY, curZ, curX, curY, curZ + res);
                });
            });
        });
    };

    p.mouseMoved = () => {
        const mappedMouseY = p.map(p.mouseY, 0, p.height, -0.02, 0.02);
        const mappedMouseX = p.map(p.mouseX, 0, p.width, -0.02, 0.02);
        camXOff = p.lerp(camXOff, mappedMouseY, 0.5);
        camYOff = p.lerp(camYOff, mappedMouseX, 0.5);
    };

    p.mouseDragged = () => {
        const mappedMouseY = p.map(p.mouseY, 0, p.height, -0.02, 0.02);
        const mappedMouseX = p.map(p.mouseX, 0, p.width, -0.02, 0.02);
        camXOff = p.lerp(camXOff, mappedMouseY, 0.5);
        camYOff = p.lerp(camYOff, mappedMouseX, 0.5);
    };
};

const S040520 = () => <P5Wrapper sketch={sketch} />;

export default S040520;
