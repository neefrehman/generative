import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let currX = 0;
    let currY = 0;
    let prevX = 0;
    let prevY = 0;

    const easing = 0.08;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
    };

    p.draw = () => {
        currX += (p.mouseX - currX) * easing;
        currY += (p.mouseY - currY) * easing;
        const weight = p.dist(currX, currY, prevX, prevY);

        p.stroke(p.mouseIsPressed ? 0 : 255);
        p.strokeWeight(weight);
        p.line(currX, currY, prevX, prevY);

        prevY = currY;
        prevX = currX;
    };
};

const S030520 = () => <P5Wrapper sketch={sketch} />;

export default S030520;
