import React from "react";
import palettes from "nice-color-palettes";
import { makeMatrix } from "make-matrix";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { lerp, getAngle, getDistance, mapToRange } from "Utils/math";
import type { Vector } from "Utils/math";
import { shuffle, pick, inRange } from "Utils/random";
import { roundedRect } from "Utils/libs/canvas2d";

const sketch: Canvas2DSetupFn = ({ width, height }) => {
    const colorCount = inRange(2, 6, { isInteger: true });
    const randomPalette = shuffle(pick(palettes).slice(0, colorCount));
    const lineColor = pick(randomPalette);

    const SCALE = 56;
    const lines = makeMatrix(
        [Math.floor(width / SCALE) - 1, Math.floor(height / SCALE) - 1],
        ([x, y]) => [x * SCALE, y * SCALE] as Vector<2>
    ).flat(1);

    let lineWidth = 0;
    const lineHeight = 28;

    return ({ ctx, mousePosition, mouseHasEntered }) => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = lineColor;

        lineWidth = lerp(lineWidth, 5.4, 0.2);

        lines.forEach(([u, v]) => {
            const x = u + SCALE;
            const y = v + SCALE;

            const angleToMouse = mouseHasEntered
                ? getAngle(mousePosition, [x, y])
                : 0;

            const rotation = angleToMouse + Math.PI / 2;

            const distanceFromMouse = mouseHasEntered
                ? getDistance(mousePosition, [x, y])
                : width;

            const mappedLineLength = mapToRange(
                distanceFromMouse,
                width / 2,
                0,
                lineWidth,
                lineHeight,
                { clamp: true }
            );

            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            roundedRect(
                ctx,
                -lineWidth / 2,
                -mappedLineLength / 2,
                lineWidth,
                mappedLineLength,
                lineWidth / 2
            );
            ctx.restore();
        });
    };
};

const S100720 = () => <Canvas2DRenderer sketch={sketch} />;

export default S100720;
