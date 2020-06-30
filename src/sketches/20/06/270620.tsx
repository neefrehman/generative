import React from "react";

import CanvasWrapper2D, {
    Canvas2DSettings,
    Canvas2DSetupFn
} from "Renderers/RawCanvasWrapper/2D";
import lerp from "SketchUtils/lerp";
import getShortestDimension from "SketchUtils/getShortestDimension";

const shortestDimension = getShortestDimension({ withMargin: true });

const settings: Canvas2DSettings = {
    dimensions: [shortestDimension, shortestDimension]
};

const sketch: Canvas2DSetupFn = () => {
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
    const margin = shortestDimension > 1000 ? 120 : 40;

    return ({ ctx, width, height }) => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        points.forEach(([u, v]) => {
            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            ctx.beginPath();
            ctx.arc(x, y, width / 20, 0, Math.PI * 2, false);
            ctx.strokeStyle = "black";
            ctx.lineWidth = width / 72;
            ctx.stroke();
        });
    };
};

const S270620 = () => <CanvasWrapper2D sketch={sketch} settings={settings} />;

export default S270620;
