import React from "react";
import palettes from "nice-color-palettes";

import { Canvas2DRenderer } from "Renderers/Canvas2D";
import type { Canvas2DRendererSettings, Canvas2DSetupFn } from "Renderers/Canvas2D";

import { lerp, getShortestViewportDimension } from "Utils/math";
import { inRange, shuffle, pick } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ withMargin: true });

const settings: Canvas2DRendererSettings = {
    dimensions: [shortestDimension, shortestDimension],
};

const sketch: Canvas2DSetupFn = () => {
    const nColors = inRange(1, 6, { isInteger: true });
    const palette = shuffle(pick(palettes)).slice(0, nColors);
    const background = "white";

    const { dimensions } = settings;
    const [width, height] = dimensions;

    const margin = width * 0.05;

    const createGrid = () => {
        const xCount = 6;
        const yCount = 6;
        const points = [];

        for (let x = 0; x < xCount; x++) {
            for (let y = 0; y < yCount; y++) {
                const u = x / (xCount - 1);
                const v = y / (yCount - 1);
                const px = lerp(margin, width - margin, u);
                const py = lerp(margin, height - margin, v);
                points.push([px, py]);
            }
        }
        return points;
    };

    let grid = createGrid();
    const shapes: { color: string; path: number[][]; y?: any }[] = [];

    while (grid.length > 2) {
        const pointsToRemove = shuffle(grid).slice(0, 2);
        if (pointsToRemove.length < 2) {
            break;
        }

        const color = pick(palette);

        grid = grid.filter(p => !pointsToRemove.includes(p));
        const [a, b] = pointsToRemove;

        shapes.push({
            color,
            path: [[a[0], height - margin], a, b, [b[0], height - margin]],
        });
    }

    shapes.sort((a, b) => a.y - b.y);

    return ({ ctx }) => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);

        shapes.forEach(({ path, color }) => {
            ctx.beginPath();
            path.forEach(([x, y]) => ctx.lineTo(x, y));
            ctx.closePath();

            ctx.lineWidth = 20;
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = color;
            ctx.fill();

            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.strokeStyle = background;
            ctx.globalAlpha = 1;
            ctx.stroke();
        });
    };
};

const S010720 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S010720;
