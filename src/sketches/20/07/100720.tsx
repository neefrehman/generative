import React from "react";
import palettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { lerp, getAngle, getDistance, mapRange } from "Utils/math";
import type { Vector } from "Utils/math";
import { shuffle, pick, inRange } from "Utils/random";
import { roundedRect } from "Utils/libs/canvas2d";

const sketch: Canvas2DSetupFn = ({ width, height }) => {
    const colorCount = inRange(2, 6, { isInteger: true });
    const randomPalette = shuffle(pick(palettes).slice(0, colorCount));
    const lineColor = pick(randomPalette);

    const createGrid = () => {
        const lines: Vector<2>[] = [];

        for (let x = 0; x < width; x += 56) {
            for (let y = 0; y < height; y += 56) {
                const u = x / (width - 1);
                const v = y / (height - 1);
                lines.push([u, v]);
            }
        }
        return lines;
    };

    const lines = createGrid();
    const lineWidth = 5;
    const lineHeight = 28;
    const margin = 52;

    return ({ ctx, mousePosition, mouseHasEntered }) => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = lineColor;

        lines.forEach(position => {
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            const angleToMouse = mouseHasEntered
                ? getAngle(mousePosition, [x, y])
                : 0;

            const rotation = angleToMouse + Math.PI / 2;

            const distanceFromMouse = mouseHasEntered
                ? getDistance(mousePosition, [x, y])
                : width;

            const mappedLineLength = mapRange(
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
