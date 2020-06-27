import React from "react";
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

import lerp from "SketchUtils/lerp";
import getShortestDimension from "SketchUtils/getShortestDimension";
import shuffle from "SketchUtils/shuffle";

import CanvasSketchWrapper, {
    CanvasSketchSketchFunction,
    TwoD,
    CanvasSketchSettings
} from "../../../components/renderers/CanvasSketchWrapper";

const shortestDimension = getShortestDimension(true) * 2;

const settings: CanvasSketchSettings = {
    dimensions: [shortestDimension, shortestDimension]
};

const sketch = (): CanvasSketchSketchFunction<TwoD> => {
    const colorCount = random.rangeFloor(2, 6);
    const randomPalette = shuffle(random.pick(palettes).slice(0, colorCount));

    const createGrid = () => {
        const points: {
            position: [number, number];
            radius: number;
            color: string;
        }[] = [];
        const count = 24;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = x / (count - 1);
                const v = y / (count - 1);
                const radius = Math.abs(random.noise2D(u, v)) * 0.05;

                points.push({
                    position: [u, v],
                    radius,
                    color: random.pick(randomPalette)
                });
            }
        }
        return points;
    };

    const points = createGrid();
    const margin = shortestDimension > 1000 ? 136 : 112;

    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        points.forEach(data => {
            const { position, radius, color } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            context.beginPath();
            context.arc(x, y, radius * width, 0, Math.PI * 2, false);

            context.fillStyle = color;
            context.fill();
        });
    };
};

const S280620 = () => (
    <CanvasSketchWrapper sketch={sketch} settings={settings} />
);

export default S280620;
