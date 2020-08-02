import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.colorMode(p.HSB);
    };

    p.draw = () => {
        p.background(0);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);

        const dirY = (p.mouseY / p.height - 0.5) * 2;
        const dirX = (p.mouseX / p.width - 0.5) * 2;
        p.directionalLight(255, 0, 100, -dirX, -dirY, 0.5);

        p.ambientMaterial(255, 0, 255);
        p.torus(100, 25, 48, 32);
        p.sphere(25, 48);
    };
};

const S040119 = () => <P5Renderer sketch={sketch} />;

export default S040119;
