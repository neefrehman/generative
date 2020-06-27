/* eslint-disable no-undef */
import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/renderers/P5Wrapper";

const sketch = (p: p5) => {
    let r = Math.floor(Math.random() * 255);
    // let g = Math.floor((Math.random() * 255));
    let b = Math.floor(Math.random() * 200) + 55;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.pixelDensity(1);
    };

    p.draw = () => {
        p.background(20);

        p.loadPixels();

        for (let y = 0; y < p.height; y++) {
            for (let x = 0; x < p.width; x++) {
                const index = (x + y * p.width) * 4;
                p.pixels[index + 0] = x;
                p.pixels[index + 1] = r;
                p.pixels[index + 2] = y;
                p.pixels[index + 3] = b;
            }
        }

        p.updatePixels();
    };

    p.mousePressed = () => {
        r = Math.floor(Math.random() * 255);
        // g = Math.floor((Math.random() * 255));
        b = Math.floor(Math.random() * 255);
    };
};

const S160519 = () => <P5Wrapper sketch={sketch} />;

export default S160519;
