import React from "react";
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

import CanvasWrapper2D, {
    Canvas2DSettings,
    Canvas2DSetupFn
} from "Renderers/RawCanvasWrapper/2D";
import lerp from "SketchUtils/lerp";
import getShortestDimension from "SketchUtils/getShortestDimension";
import shuffle from "SketchUtils/shuffle";

const shortestDimension = getShortestDimension({ withMargin: true });

const settings: Canvas2DSettings = {
    dimensions: [shortestDimension, shortestDimension],
    animated: true
};

const sketch: Canvas2DSetupFn = () => {
    const colorCount = random.rangeFloor(2, 6);
    const randomPalette = shuffle(random.pick(palettes).slice(0, colorCount));

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
                    color: random.pick(randomPalette)
                });
            }
        }
        return points;
    };

    const points = createGrid();
    const margin = shortestDimension > 1000 ? 112 : 36;

    let noiseZ = 0;
    const noiseZVel = 0.000004;

    return ({ ctx, width, height }) => {
        ctx.clearRect(0, 0, width, height);

        points.forEach(data => {
            const { position, color } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);
            const r = Math.abs(0.12 * random.noise3D(u, v, noiseZ));

            noiseZ += noiseZVel;

            ctx.beginPath();
            ctx.arc(x, y, r * width, 0, Math.PI * 2, false);

            ctx.fillStyle = color;
            ctx.fill();
        });
    };
};

const S070720 = () => <CanvasWrapper2D sketch={sketch} settings={settings} />;

export default S070720;
