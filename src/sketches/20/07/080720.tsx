import React from "react";
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

import CanvasWrapper2D, {
    Canvas2DSettings,
    Canvas2DSetupFn
} from "Renderers/RawCanvasWrapper/2D";
import lerp from "SketchUtils/lerp";
import shuffle from "SketchUtils/shuffle";
import getAngle from "SketchUtils/getAngle";

const settings: Canvas2DSettings = {
    dimensions: [window.innerWidth, window.innerHeight],
    isAnimated: true
};

const sketch: Canvas2DSetupFn = () => {
    const colorCount = random.rangeFloor(2, 6);
    const randomPalette = shuffle(random.pick(palettes).slice(0, colorCount));
    const lineColor = random.pick(randomPalette);

    const createGrid = () => {
        const lines: [number, number][] = [];
        const randomStartX = 0.4 * Math.random() * window.innerWidth;
        const randomStartY = 0.4 * Math.random() * window.innerHeight;

        for (let x = randomStartX; x < window.innerWidth; x += 56) {
            for (let y = randomStartY; y < window.innerHeight; y += 56) {
                const u = x / (window.innerWidth - 1);
                const v = y / (window.innerHeight - 1);

                lines.push([u, v]);
            }
        }
        return lines;
    };

    const lines = createGrid();
    const lineWidth = 5;
    const lineHeight = 28;
    const margin = 52;

    let noiseZ = 0;
    const noiseZVel = 0.000007;

    let mouseHasEntered = false;

    return ({ ctx, width, height, mousePosition }) => {
        if (
            !mouseHasEntered &&
            mousePosition[0] !== width / 2 &&
            mousePosition[1] !== height / 2
        ) {
            mouseHasEntered = true;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = lineColor;

        lines.forEach(position => {
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            const angleToMouse = mouseHasEntered
                ? getAngle(mousePosition, [x, y])
                : 0;

            const rotation = angleToMouse + 0.66 * random.noise3D(u, v, noiseZ);

            noiseZ += noiseZVel;

            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillRect(
                -lineWidth / 2,
                -lineHeight / 2,
                lineWidth,
                lineHeight
            );
            ctx.restore();
        });
    };
};

const S070720 = () => <CanvasWrapper2D sketch={sketch} settings={settings} />;

export default S070720;
