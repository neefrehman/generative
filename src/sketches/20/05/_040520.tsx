import React from "react";
import p5 from "p5";
import makeMatrix from "make-matrix";

import P5Wrapper from "../../../components/P5Wrapper";

// Inspired by Tyler Hobbs' Flow Field Essay: https://tylerxhobbs.com/essays/2020/flow-fields

const sketch = (p: p5) => {
    let leftX: number;
    let rightX: number;
    let topY: number;
    let bottomY: number;
    let resolution: number;
    let numColumns: number;
    let numRows: number;
    let grid: number[][];
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
        grid = makeMatrix([numColumns, numRows]);
        defaultAngle = p.PI * 0.25;
    };

    // p.draw = () => {
    //     // grid.forEach(_, x => {
    //     //     grid.forEach(_, y => {
    //     //         console.log(x, y);
    //         });
    //     });
    // };
};

const S040520 = () => <P5Wrapper sketch={sketch} />;

export default S040520;
