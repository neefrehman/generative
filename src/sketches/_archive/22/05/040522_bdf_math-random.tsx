import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { SketchBackground } from "components/SketchBackground";
import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { generateTextPath } from "LibUtils/canvas2d";

import { getShortestViewportDimension, lerp, lerpVector } from "Utils/math";
import { inBeta, inRange, pick } from "Utils/random";
import { simplex3D } from "Utils/random/noise/simplex";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const WORD = "Math.random()";
    const SCALE = getShortestViewportDimension({ cap: 600 }) / (WORD.length / 4);

    ctx.font = `${SCALE}px Fira Code`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(76, 41, 41)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const pallette = pick(pallettes);

    const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
        decimation: 6,
        outline: false,
    }).map(position => {
        const [x, y] = position;
        const yOff = inBeta(2, 2.4);

        return {
            position,
            color: pick(pallette),
            offsetAmount: {
                x: inRange(2) + (Math.sin(y / 40) - 0.5) * 1.2,
                y: yOff + (Math.sin(x + inRange(10) / 900) - 0.5) * 5.5 * yOff,
            },
        };
    });

    const randomTimeStart = inRange(10000);

    const mousePositionStart = [width / 2 + 38, height / 2 + 60];
    let previousMousePosition = mousePositionStart;
    let clickDepth = 1;

    return ({ frameCount, mousePosition, mouseIsIdle, mouseIsDown }) => {
        ctx.clearRect(0, 0, width, height);

        previousMousePosition = lerpVector(
            previousMousePosition,
            mouseIsIdle ? mousePositionStart : mousePosition,
            0.33
        );

        clickDepth = lerp(clickDepth, mouseIsDown ? 2 : 1, 0.33);

        const [mouseX, mouseY] = previousMousePosition;

        const pulse = Math.sin(frameCount / 10) * 5;

        const xOff = Math.max(Math.abs((width / 2 - mouseX + pulse) / 1.5), 4);
        const yOff = Math.max(Math.abs((height / 2 - mouseY + pulse) / 2.5), 4);

        const timeStartX = (frameCount + randomTimeStart) / 120;
        const timeStartY = (frameCount + randomTimeStart) / 120 + 999;

        points.forEach(({ position: [x, y], color, offsetAmount }) => {
            const u =
                simplex3D(x, y, timeStartX) * xOff * offsetAmount.x * clickDepth;
            const v =
                simplex3D(x, y, timeStartY) * yOff * offsetAmount.y * clickDepth;

            ctx.fillStyle = color;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + u, y + v, 1.5, 0, Math.PI * 2);
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
