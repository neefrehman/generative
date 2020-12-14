import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    let graphic: p5.Graphics;

    p.setup = () => {
        p.createCanvas(1000, 1000);
        p.background("#000000");

        // create offscreen graphics buffer
        graphic = p.createGraphics(p.width, p.height);

        const LETTER = "a";

        // type setup offscreen in buffer
        graphic.textAlign(p.CENTER, p.CENTER);
        graphic.blendMode(p.SCREEN);
        graphic.textSize(1600);
        graphic.fill("rgba(255, 0, 0, 0.9)");
        graphic.text(LETTER, p.width / 2, p.height / 3);
        graphic.textSize(1550);
        graphic.fill("rgba(0, 255, 0, 0.9)");
        graphic.text(LETTER, p.width / 1.95, p.height / 2.95);
        graphic.textSize(1500);
        graphic.fill("rgba(0, 0, 255, 0.9)");
        graphic.text(LETTER, p.width / 2.05, p.height / 3.05);
    };

    const loopDuration = 3 * 60;

    p.draw = () => {
        const currentFrame = p.frameCount % loopDuration;
        const t = currentFrame / loopDuration;
        const u = p.map(t, 0, 1, 0, 2 * Math.PI);

        p.background("#000000");

        const tiles = 24;
        const tileSize = p.width / tiles;

        // loop over each tile
        for (let x = 0; x < tiles; x++) {
            for (let y = 0; y < tiles; y++) {
                const distortionX = Math.cos(u + x * 0.8) * 30;
                const distortionY = Math.sin(u + y * 0.8) * 30;

                // think of this as applying the grid to the source in the graphics buffer
                const sx = x * tileSize + distortionX;
                const sy = y * tileSize + distortionY;
                const sw = tileSize + distortionX;
                const sh = tileSize + distortionY;

                // and this as applying the grid to the destination on the canvas
                const dx = x * tileSize;
                const dy = y * tileSize;
                const dw = tileSize;
                const dh = tileSize;

                // grided image from buffer into main canvas
                p.image(graphic, dx, dy, dw, dh, sx, sy, sw, sh);
            }
        }
    };
};

const DRAFT_DRAFT = () => <P5Renderer sketch={sketch} />;

export default DRAFT_DRAFT;
