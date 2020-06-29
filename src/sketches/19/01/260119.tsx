import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(10);
    };

    p.draw = () => {
        p.stroke(255);

        if (p.windowWidth > p.windowHeight) {
            p.line(p.mouseX, 0, p.mouseX, p.windowHeight);
        } else if (p.windowHeight > p.windowWidth) {
            p.frameRate(30);
            p.line(0, p.mouseY, p.windowHeight, p.mouseY);
        }
    };
};

const S260119 = () => <P5Wrapper sketch={sketch} />;

export default S260119;
