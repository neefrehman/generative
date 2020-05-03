import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let xOff = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.stroke(255, 18);
        p.noFill();
    };

    p.draw = () => {
        const x1 = 2 * p.width * p.noise(xOff + 10) - p.width / 2;
        const y1 = 2 * p.height * p.noise(xOff + 50) - p.height / 2;
        const x2 = 2 * p.width * p.noise(xOff + 20) - p.width / 2;
        const y2 = 2 * p.height * p.noise(xOff + 60) - p.height / 2;
        const x3 = 2 * p.width * p.noise(xOff + 30) - p.width / 2;
        const y3 = 2 * p.height * p.noise(xOff + 70) - p.height / 2;
        const x4 = 2 * p.width * p.noise(xOff + 40) - p.width / 2;
        const y4 = 2 * p.height * p.noise(xOff + 80) - p.height / 2;

        p.bezier(x1, y1, x2, y2, x3, y3, x4, y4);

        xOff += 0.002;

        if (p.frameCount % 2000 === 0) p.background(20);
    };
};

const S071219 = () => <P5Wrapper sketch={sketch} />;

export default S071219;
