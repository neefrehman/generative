import React from "react";
import p5 from "p5";
import makeMatrix from "make-matrix";

import P5Wrapper from "../../../components/renderers/P5Wrapper";

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

    const forceOdd = (number: number) => {
        return number % 2 !== 0 ? number : number - 1;
    };

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.frameRate(24);
        p.stroke(181, 105, 25);
        p.strokeWeight(3);

        longestDimension = Math.max(p.width, p.height);
        res = longestDimension * 0.1;

        numColumns = forceOdd(Math.ceil(p.width / res));
        numRows = 2;

        // Add one extra column as we'll be removing horizontal lines from the last one
        grid = makeMatrix([numColumns + 1, numRows, numColumns + 5]);

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
                row.forEach((depth, z) => {
                    const curX = x * res;
                    const curY = y * res;
                    const curZ = z * res;

                    const fogIntensity = p.map(z, 0, row.length, 20, 255);
                    p.stroke(220, 175, 225, fogIntensity);

                    p.line(curX, curY, curZ, curX, curY, curZ + res);
                    // Don't draw right-most horizontal lines going outward
                    if (x !== row.length) {
                        p.line(curX, curY, curZ, curX + res, curY, curZ);
                    }
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

const S120520 = () => <P5Wrapper sketch={sketch} />;

export default S120520;
