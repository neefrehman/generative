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
import { simplex2D } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ withMargin: true });

const settings: Canvas2DRendererSettings = {
    dimensions: [shortestDimension, shortestDimension],
};

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const SCALE = 22;
    const LETTER = "W";

    ctx.font = `${SCALE}px Fleuron`;

    const letterGrid = createMatrix(
        [Math.ceil(width / SCALE), Math.ceil(height / SCALE)],
        ([x, y]) => [x * SCALE, y * SCALE] as [number, number]
    ).flat(1);

    return ({ frameCount, mouseHasEntered, mousePosition }) => {
        ctx.clearRect(0, 0, width, height);

        const ABBERATION_X = mouseHasEntered
            ? mapToRange(mousePosition[0], 0, width, -0.12, 0.12)
            : 0.08;

        const ABBERATION_Y = mouseHasEntered
            ? mapToRange(mousePosition[1], 0, height, -0.12, 0.12)
            : 0.08;

        letterGrid.forEach(([x, y]) => {
            const xOffset = simplex2D(x, frameCount / 40) * 10;
            const yOffset = simplex2D(y, frameCount / 40) * 10;

            const redxOffset = simplex2D(x, frameCount / 40 - ABBERATION_X) * 10;
            const redyOffset = simplex2D(y, frameCount / 40 - ABBERATION_Y) * 10;

            const bluexOffset = simplex2D(x, frameCount / 40 + ABBERATION_X) * 10;
            const blueyOffset = simplex2D(y, frameCount / 40 + ABBERATION_Y) * 10;

            ctx.fillStyle = "red";
            ctx.fillText(LETTER, x + redxOffset, y + redyOffset);
            ctx.fillStyle = "blue";
            ctx.fillText(LETTER, x + bluexOffset, y + blueyOffset);
            ctx.fillStyle = "white";
            ctx.fillText(LETTER, x + xOffset, y + yOffset);
        });
    };
};

const S131220 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S131220;
