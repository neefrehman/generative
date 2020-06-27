import React from "react";

import lerp from "SketchUtils/lerp";
import getShortestDimension from "SketchUtils/getShortestDimension";

import CanvasSketchWrapper, {
    CanvasSketchSketchFunction,
    TwoD,
    CanvasSketchSettings
} from "../../../components/CanvasSketchWrapper";

const shortestDimension = getShortestDimension() * 2 - 100;

const settings: CanvasSketchSettings = {
    dimensions: [shortestDimension, shortestDimension]
};

const sketch = (): CanvasSketchSketchFunction<TwoD> => {
    const createGrid = () => {
        const points: [number, number][] = [];
        const count = 5;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = x / (count - 1);
                const v = y / (count - 1);
                points.push([u, v]);
            }
        }
        return points;
    };

    const points = createGrid().filter(() => Math.random() > 0.3);
    const margin = shortestDimension > 1000 ? 180 : 124;

    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        points.forEach(([u, v]) => {
            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            context.beginPath();
            context.arc(x, y, 48, 0, Math.PI * 2, false);
            context.strokeStyle = "black";
            context.lineWidth = 28;
            context.stroke();
        });
    };
};

const S270620 = () => (
    <CanvasSketchWrapper sketch={sketch} settings={settings} />
);

export default S270620;
