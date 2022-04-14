import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { sampleCanvasPixels } from "LibUtils/canvas2d";

import type { Vector } from "Utils/math";
import { getDistance, getShortestViewportDimension, mapToRange } from "Utils/math";
import { createChance, inRange, inSquare, pick } from "Utils/random";
import { simplex3D } from "Utils/random/noise/simplex";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const SCALE = getShortestViewportDimension({ cap: 600 });

    ctx.fillStyle = "rgb(76, 41, 41)";
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 0.2;

    const pallette = pick(pallettes);
    const circleColor = pick(pallette);

    const points = sampleCanvasPixels(
        ctx,
        () => {
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, SCALE / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        },
        {
            decimation: 7,
        }
    ).map(position => ({
        position,
        color: createChance(0.5) ? pick(pallette) : circleColor,
    }));

    const randomTimeStart = inRange(10000);
    const repellors = [...Array(20)].map(() => inSquare(SCALE, SCALE));

    return ({ frameCount, mousePosition }) => {
        ctx.clearRect(0, 0, width, height);

        const timeStartX = (frameCount / 3 + randomTimeStart) / 300;
        const timeStartY = (frameCount / 3 + randomTimeStart) / 300 + 999;

        const repellorPositions = [
            mousePosition,
            ...repellors.map(
                ([x, y]): Vector<2> => [
                    simplex3D(x, y, timeStartX) * width,
                    simplex3D(x, y, timeStartY) * height,
                ]
            ),
        ];

        points.forEach(({ position: [x, y], color }) => {
            const distanceFromRepellors = repellorPositions.map(pos => {
                const dist = getDistance([x, y], pos);
                return mapToRange(dist, 0, 1000, 0, 2);
            });

            const minDist = Math.min(...distanceFromRepellors);

            const u = ((simplex3D(x, y, timeStartX) * 3) / minDist) * inRange(2);
            const v = ((simplex3D(x, y, timeStartY) * 3) / minDist) * inRange(2);

            ctx.fillStyle = color;

            ctx.save();
            ctx.beginPath();
            ctx.rect(x + u, y + v, 6, 6);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        });
    };
};

const S060222 = () => (
    <Canvas2DRenderer
        sketch={sketch}
        settings={{ animationSettings: { fps: 14 } }}
    />
);

export default S060222;
