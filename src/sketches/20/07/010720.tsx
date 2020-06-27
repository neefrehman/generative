import React from "react";
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

import lerp from "SketchUtils/lerp";
import getShortestDimension from "SketchUtils/getShortestDimension";

import CanvasSketchWrapper, {
    CanvasSketchSketchFunction,
    TwoD,
    CanvasSketchSettings
} from "../../../components/renderers/CanvasSketchWrapper";

const shortestDimension = getShortestDimension(true) * 2;

const settings: CanvasSketchSettings = {
    dimensions: [shortestDimension, shortestDimension]
};

const sketch = ({ width, height }): CanvasSketchSketchFunction<TwoD> => {
    const nColors = random.rangeFloor(1, 6);
    const palette = random.shuffle(random.pick(palettes)).slice(0, nColors);
    const background = "white";

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
    const shapes = [];

    while (grid.length > 2) {
        const pointsToRemove = random.shuffle(grid).slice(0, 2);
        if (pointsToRemove.length < 2) {
            break;
        }

        const color = random.pick(palette);

        grid = grid.filter(p => !pointsToRemove.includes(p));
        const [a, b] = pointsToRemove;

        shapes.push({
            color,
            path: [[a[0], height - margin], a, b, [b[0], height - margin]]
        });
    }

    shapes.sort((a, b) => a.y - b.y);

    return ({ context }) => {
        context.globalAlpha = 1;
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);

        shapes.forEach(({ path, color }) => {
            context.beginPath();
            path.forEach(([x, y]) => context.lineTo(x, y));
            context.closePath();

            context.lineWidth = 20;
            context.globalAlpha = 0.85;
            context.fillStyle = color;
            context.fill();

            context.lineJoin = "round";
            context.lineCap = "round";
            context.strokeStyle = background;
            context.globalAlpha = 1;
            context.stroke();
        });
    };
};

const S010720 = () => (
    <CanvasSketchWrapper sketch={sketch} settings={settings} />
);

export default S010720;
