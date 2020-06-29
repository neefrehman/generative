import React from "react";
import p5 from "p5";
import makeMatrix from "make-matrix";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    let longestDimension: number;
    let res: number;
    let grid: number[][][];

    let numColumns: number;
    let numRows: number;

    let camZStart;
    let camZ;

    let camXOff = 0;
    let camYOff = 0;

    const forceOdd = (number: number) => {
        return number % 2 !== 0 ? number : number - 1;
    };

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.stroke(181, 105, 25);
        p.strokeWeight(3);

        longestDimension = Math.max(p.width, p.height);
        res = longestDimension * 0.1;

        numColumns = forceOdd(Math.ceil(p.width / res));
        numRows = forceOdd(Math.ceil(p.height / res));

        grid = makeMatrix([numColumns, numRows, numColumns]);

        camZStart = p.width > 800 ? (-res * numColumns) / 2 : 2 * res;
        camZ = camZStart;
    };

    p.draw = () => {
        p.background(21, 12, 53);
        camZ = camZ >= camZStart + res ? camZStart : camZ + 2;
        p.translate((-numColumns * res) / 2, (-numRows * res) / 2, camZ);
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

const S130520 = () => <P5Wrapper sketch={sketch} />;

export default S130520;
