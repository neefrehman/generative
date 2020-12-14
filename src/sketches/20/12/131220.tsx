import React from "react";

import { Canvas2DRenderer } from "Renderers/Canvas2D";
import type {
    Canvas2DRendererSettings,
    Canvas2DSetupFn,
} from "Renderers/Canvas2D";

import { createMatrix, getShortestViewportDimension, lerp } from "Utils/math";
import { simplex3D } from "Utils/random";

const shortestDimension = getShortestViewportDimension({
    withMargin: true,
    cap: 1200,
});

const settings: Canvas2DRendererSettings = {
    dimensions: [shortestDimension, shortestDimension],
};

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const SCALE = shortestDimension < 600 ? 18 : 20;
    const WORD =
        "GENERATIVEGENERATIVEGENERATIVEGENERATIVEGENERATIVEGENERATIVEGENERATIVE";

    ctx.font = `${SCALE}px Fleuron`;

    const letterGrid = createMatrix(
        [Math.ceil(width / SCALE), Math.ceil(height / SCALE)],
        ([x, y]) => [x * SCALE, y * SCALE] as [number, number]
    ).flat(1);

    let zxOff = 0;
    let zyOff = 1000;

    return ({ mouseHasEntered, mousePosition: [mouseX, mouseY] }) => {
        ctx.clearRect(0, 0, width, height);

        const lerpedCos = (n: number) =>
            mouseHasEntered ? lerp(n, Math.cos(n), mouseY / height) : n;
        const lerpedSin = (n: number) =>
            mouseHasEntered ? lerp(n, Math.sin(n), mouseY / height) : n;

        const lerpedPI = lerp(1, Math.PI, mouseX / width);

        letterGrid.forEach(([x, y]) => {
            const u = x / 130;
            const v = y / 130;

            const LETTER = WORD[x / SCALE];

            const xOffset =
                simplex3D(lerpedCos(u), lerpedSin(v), zxOff) * 10 * lerpedPI;
            const yOffset =
                simplex3D(lerpedCos(u), lerpedSin(v), zyOff) * 10 * lerpedPI;

            ctx.fillStyle = "white";
            ctx.fillText(LETTER, x + xOffset, y + yOffset);
        });

        zxOff += 0.04;
        zyOff += 0.04;
    };
};

const S131220 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S131220;
