import React from "react";
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

import CanvasWrapper2D from "Renderers/RawCanvasWrapper/2D";
import type {
    Canvas2DSettings,
    Canvas2DSetupFn
} from "Renderers/RawCanvasWrapper/2D";
import lerp from "SketchUtils/lerp";
import getShortestDimension from "SketchUtils/getShortestViewportDimension";
import shuffle from "SketchUtils/shuffle";

const shortestDimension = getShortestDimension({ withMargin: true });

const settings: Canvas2DSettings = {
    dimensions: [shortestDimension, shortestDimension]
};

const sketch: Canvas2DSetupFn = () => {
    const colorCount = random.rangeFloor(2, 6);
    const randomPalette = shuffle(random.pick(palettes).slice(0, colorCount));

    const createGrid = () => {
        interface Point {
            position: [number, number];
            radius: number;
            rotation: number;
            color: string;
        }

        const points: Point[] = [];
        const count = 24;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = x / (count - 1);
                const v = y / (count - 1);
                const radius = Math.abs(random.noise2D(u, v)) * 0.1;

                points.push({
                    position: [u, v],
                    radius,
                    rotation: random.noise2D(u, v),
                    color: random.pick(randomPalette)
                });
            }
        }
        return points;
    };

    const points = createGrid();
    const margin = shortestDimension > 1000 ? 60 : 20;

    return ({ ctx, width, height }) => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        points.forEach(data => {
            const { position, radius, rotation, color } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            ctx.save();
            ctx.fillStyle = color;
            ctx.font = `${radius * width}px "arial"`;
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillText("=", 0, 0);
            ctx.restore();
        });
    };
};

const S300620 = () => <CanvasWrapper2D sketch={sketch} settings={settings} />;

export default S300620;
