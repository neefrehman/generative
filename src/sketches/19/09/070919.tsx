import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let angle = 0;
    let circleHeight = 200;
    let circleWidth = 150;
    let direction = 1;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
    };

    p.draw = () => {
        p.background(20);

        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rotate(angle);
        p.fill(200, 0, 100);
        p.ellipse(0, 0, circleHeight, circleWidth);
        p.pop();

        circleHeight -= 1 * direction;
        circleWidth += 1 * direction;
        if (p.frameCount % 50 === 0) direction *= -1;

        angle += 0.1;
    };
};

const S070919 = () => <P5Wrapper sketch={sketch} />;

export default S070919;
