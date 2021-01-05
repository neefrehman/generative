import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { generateTextPath } from "LibUtils/canvas2d";

import { getShortestViewportDimension } from "Utils/math";
import { pick } from "Utils/random";
import { simplex3D } from "Utils/random/noise/simplex";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const WORD = pick(["mini"]);
    const SCALE = getShortestViewportDimension({ cap: 500 }) / (WORD.length / 2);

    ctx.font = `${SCALE}px Fleuron`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(76, 41, 41)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
        decimation: 5,
        outline: false,
    });

    const pallette = pick(pallettes);

    return ({ frameCount }) => {
        ctx.clearRect(0, 0, width, height);

        points.forEach(([x, y]) => {
            const u = simplex3D(x, y, frameCount) * 10;
            const v = simplex3D(x, y, frameCount) * 10;
            const color = pick(pallette);

            ctx.save();

            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.arc(x + u, y + v, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        });
    };
};

const S060121 = () => (
    <Canvas2DRenderer
        sketch={sketch}
        settings={{ animationSettings: { fps: 14 } }}
    />
);

export default S060121;
