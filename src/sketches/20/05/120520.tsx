import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

import { createMatrix } from "Utils/math";

const sketch = (p: p5) => {
    let longestDimension: number;
    let res: number;
    let grid: number[][][];

    let numColumns: number;
    let numRows: number;

    let camZStart: number;
    let camZ: number;

    let camXOff = 0;
    let camYOff = 0;

    let camXoffTarget = 0;
    let camYoffTarget = 0;

    const forceOdd = (number: number) => (number % 2 !== 0 ? number : number - 1);

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.frameRate(24);
        p.stroke(181, 105, 25);
        p.strokeWeight(3.2);

        longestDimension = Math.max(p.width, p.height);
        res = longestDimension * 0.1;

        numColumns = forceOdd(Math.ceil(p.width / res));
        numRows = 2;

        // Add one extra column as we'll be removing horizontal lines from the last one
        grid = createMatrix([numColumns + 1, numRows, numColumns + 5], 0);

        camZStart = p.width > 800 ? (-res * numColumns) / 2 : 1 * res;
        camZ = camZStart;
    };

    p.draw = () => {
        p.background(21, 12, 53);
        camZ = camZ >= camZStart + res ? camZStart : camZ + 2;
        p.translate((-numColumns * res) / 2, -res / 2, camZ);
        p.rotateX(camXOff);
        p.rotateY(camYOff);

        grid.forEach((column, x) => {
            column.forEach((row, y) => {
                row.forEach((_, z) => {
                    const curX = x * res;
                    const curY = y * res;
                    const curZ = z * res;

                    const fogIntensity = p.map(z, 0, row.length, 20, 255);
                    p.stroke(220, 175, 225, fogIntensity);

                    p.line(curX, curY, curZ, curX, curY, curZ + res);
                    // Don't draw right-most horizontal lines going outward
                    if (x !== 9) {
                        p.line(curX, curY, curZ, curX + res, curY, curZ);
                    }
                });
            });
        });

        camXOff = p.lerp(camXOff, camXoffTarget, 0.25);
        camYOff = p.lerp(camYOff, camYoffTarget, 0.25);
    };

    p.mouseMoved = () => {
        const mappedMouseY = p.map(p.mouseY, 0, p.height, -0.02, 0.02);
        const mappedMouseX = p.map(p.mouseX, 0, p.width, -0.02, 0.02);
        camXoffTarget = mappedMouseY;
        camYoffTarget = mappedMouseX;
    };

    p.mouseDragged = () => {
        const mappedMouseY = p.map(p.mouseY, 0, p.height, -0.02, 0.02);
        const mappedMouseX = p.map(p.mouseX, 0, p.width, -0.02, 0.02);
        camXoffTarget = mappedMouseY;
        camYoffTarget = mappedMouseX;
    };
};

const S120520 = () => <P5Renderer sketch={sketch} />;

export default S120520;
