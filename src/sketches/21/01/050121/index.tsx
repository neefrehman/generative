import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { SketchBackground } from "components/SketchBackground";
import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { generateTextPath } from "LibUtils/canvas2d";

import { getShortestViewportDimension, lerpVector } from "Utils/math";
import { createChance, inRange, pick } from "Utils/random";
import { simplex3D } from "Utils/random/noise/simplex";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const WORD = pick(["mini", "hello", "generative", "love", "dots"]);
    const SCALE = getShortestViewportDimension({ cap: 600 }) / (WORD.length / 2);

    ctx.font = createChance() ? `${SCALE}px Fleuron` : `${SCALE}px Arial`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(76, 41, 41)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const pallette = pick(pallettes);

    const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
        decimation: 7,
        outline: false,
    }).map(position => {
        const [x, y] = position;
        return {
            position,
            color: pick(pallette),
            offsetAmount: {
                x: inRange(2) + (Math.sin(y / 40) - 0.5) * 1.2,
                y: inRange(1) + (Math.sin(x + inRange(10) / 900) - 0.5) * 3,
            },
        };
    });

    const randomTimeStart = inRange(10000);

    const mousePositionStart = [width / 2 + 38, height / 2 + 60];
    let previousMousePosition = mousePositionStart;

    return ({ frameCount, mousePosition, mouseIsIdle }) => {
        ctx.clearRect(0, 0, width, height);

        previousMousePosition = lerpVector(
            previousMousePosition,
            mouseIsIdle ? mousePositionStart : mousePosition,
            0.4
        );

        const [mouseX, mouseY] = previousMousePosition;

        const pulse = Math.sin(frameCount / 10) * 5;

        const xOffset = Math.max(Math.abs((width / 2 - mouseX + pulse) / 1.5), 12);
        const yOffset = Math.max(
            Math.abs((height / 2 - mouseY + pulse) / 2.5),
            20
        );

        const timeStart = (frameCount + randomTimeStart) / 120;

        points.forEach(({ position: [x, y], color, offsetAmount }) => {
            const u = simplex3D(x, y, timeStart + 999) * xOffset * offsetAmount.x;
            const v = simplex3D(x, y, timeStart) * yOffset * offsetAmount.y;

            ctx.fillStyle = color;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + u, y + v, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        });
    };
};

const S050121 = () => (
    <>
        <Canvas2DRenderer
            sketch={sketch}
            settings={{ animationSettings: { fps: 14 } }}
        />

        <SketchBackground color="#bfbfbf" />

        <ControlsContainer>
            <RefreshButton>Change text</RefreshButton>
        </ControlsContainer>
    </>
);

export default S050121;

export { default as metaImage } from "./meta-image.png";
