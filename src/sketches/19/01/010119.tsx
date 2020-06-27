import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/renderers/P5Wrapper";

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(30);
        p.noStroke();
        p.noFill();
    };

    p.draw = () => {
        p.ellipse(p.mouseX, p.mouseY, Math.random() * 90, Math.random() * 90);
        p.fill(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        );

        if (p.mouseX === p.pmouseX && p.mouseY === p.pmouseY) {
            p.fill(255, 0);
        }
        if (p.windowWidth < 550) {
            p.ellipse(
                p.mouseX,
                p.mouseY,
                Math.random() * 70,
                Math.random() * 70
            );
            p.frameRate(20);
        }
    };
};

const S010119 = () => <P5Wrapper sketch={sketch} />;

export default S010119;
