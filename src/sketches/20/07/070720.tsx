import React from "react";
import palettes from "nice-color-palettes";

import { Canvas2DRenderer } from "Renderers/Canvas2D";
import type {
    Canvas2DRendererSettings,
    Canvas2DSetupFn
} from "Renderers/Canvas2D";

import { lerp, getShortestViewportDimension } from "Utils/math";
import { shuffle, pick, inRange, noise3D } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ withMargin: true });

const settings: Canvas2DRendererSettings = {
    dimensions: [shortestDimension, shortestDimension],
    isAnimated: true
};

const sketch: Canvas2DSetupFn = () => {
    const colorCount = inRange(2, 6, { isInteger: true });
    const randomPalette = shuffle(pick(palettes).slice(0, colorCount));

    const createGrid = () => {
        const points: {
            position: [number, number];
            color: string;
        }[] = [];
        const count = 24;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = x / (count - 1);
                const v = y / (count - 1);

                points.push({
                    position: [u, v],
                    color: pick(randomPalette)
                });
            }
        }
        return points;
    };

    const points = createGrid();
    const margin = shortestDimension > 1000 ? 112 : 36;

    let noiseZ = 0;
    const noiseZVel = 0.000005;

    return ({ ctx, width, height }) => {
        ctx.clearRect(0, 0, width, height);

        points.forEach(data => {
            const { position, color } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);
            const r = Math.abs(0.12 * noise3D(u, v, noiseZ));

            noiseZ += noiseZVel;

            ctx.beginPath();
            ctx.arc(x, y, r * width, 0, Math.PI * 2, false);

            ctx.fillStyle = color;
            ctx.fill();
        });
    };
};

const S070720 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S070720;
