import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";
import createNDimensionalArray from "../../utils/createNDimesionalArray";

// Insiper by Tyler Hobbs' Flow Field Essay: https://tylerxhobbs.com/essays/2020/flow-fields

const sketch = (p: p5) => {
    let leftX: number;
    let rightX: number;
    let topY: number;
    let bottomY: number;
    let resolution: number;
    let numColumns: number;
    let numRows: number;
    let grid: unknown[][];
    let defaultAngle: number;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        leftX = p.width * -0.5;
        rightX = p.width * 1.5;
        topY = p.height * -0.5;
        bottomY = p.height * 1.5;
        resolution = p.width * 0.01;
        numColumns = Math.floor((rightX - leftX) / resolution);
        numRows = Math.floor((bottomY - topY) / resolution);
        grid = createNDimensionalArray(numColumns, numRows);
        defaultAngle = p.PI * 0.25;

        for (let column = 0; column < numColumns; column++) {
            for (let row = 0; row < numRows; row++) {
                grid[column][row] = defaultAngle;
            }
        }
    };

    // p.draw = () => {};
};

const S040520 = () => <P5Wrapper sketch={sketch} />;

export default S040520;
