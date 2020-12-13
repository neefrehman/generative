import React from "react";

import {
    Canvas2DRenderer,
    Canvas2DRendererSettings,
    Canvas2DSetupFn,
} from "Renderers/Canvas2D";

import {
    createMatrix,
    getShortestViewportDimension,
    mapToRange,
} from "Utils/math";
import { simplex3D } from "Utils/random";

const shortestDimension = getShortestViewportDimension({
    withMargin: true,
    cap: 1200,
});

const settings: Canvas2DRendererSettings = {
    dimensions: [shortestDimension, shortestDimension],
};

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const SCALE = 20;
    const WORD =
        "GENERATIVEGENERATIVEGENERATIVEGENERATIVEGENERATIVEGENERATIVEGENERATIVE";

    ctx.font = `${SCALE}px Fleuron`;

    const letterGrid = createMatrix(
        [Math.ceil(width / SCALE), Math.ceil(height / SCALE)],
        ([x, y]) => [x * SCALE, y * SCALE] as [number, number]
    ).flat(1);

    let zxOff = 0;
    let zyOff = 1000;

    return ({ mouseHasEntered, mousePosition }) => {
        ctx.clearRect(0, 0, width, height);

        const noiseVel = mouseHasEntered
            ? mapToRange(mousePosition[0], 0, width, 0.002, 0.1)
            : 0.05;

        letterGrid.forEach(([x, y]) => {
            const u = x / 130;
            const v = y / 130;

            const LETTER = WORD[x / SCALE];

            const xOffset = simplex3D(u, v, zxOff) * 10;
            const yOffset = simplex3D(u, v, zyOff) * 10;

            ctx.fillStyle = "white";
            ctx.fillText(LETTER, x + xOffset, y + yOffset);
        });

        zxOff += noiseVel;
        zyOff += noiseVel;
    };
};

const S141220 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S141220;
