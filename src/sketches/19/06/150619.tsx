import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    const noiseIncrement = 0.01;
    let tOff = 0;

    p.setup = () => {
        const canvasSize = window.innerWidth > 500 ? 360 : 220;
        p.createCanvas(canvasSize, canvasSize);

        p.background(20);
        p.pixelDensity(1);
    };

    p.draw = () => {
        p.loadPixels();

        let yOff = 0;

        for (let y = 0; y < p.width; y++) {
            let xOff = 0;

            for (let x = 0; x < p.height; x++) {
                const index = (x + y * p.width) * 4;
                const brightness = p.noise(xOff, yOff, tOff) * 255;
                p.pixels[index + 0] = brightness;
                p.pixels[index + 1] = brightness;
                p.pixels[index + 2] = brightness;
                p.pixels[index + 3] = 255;

                xOff += noiseIncrement;
            }
            yOff += noiseIncrement;
        }

        tOff += noiseIncrement * 0.75;

        p.updatePixels();
    };
};

const S150619 = () => <P5Wrapper sketch={sketch} autoResizeToWindow={false} />;

export default S150619;
