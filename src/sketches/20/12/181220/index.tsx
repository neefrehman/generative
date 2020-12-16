import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import {
    bezierCurveBetween,
    clearBackgroundWithColor,
    generateTextPath,
} from "Utils/libs/canvas2d";
import { getShortestViewportDimension, lerpVector } from "Utils/math";
import { inRange, pick, simplex1D } from "Utils/random";

import { S141220NoisePoint } from "../141220";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    // prettier-ignore
    const WORD = pick(["HI", "?", "COLOUR", "YES", ":—)", "8", "5", "4", "1", "NO", "!", "MAYBE"]);
    const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.3);

    ctx.font = `${SCALE}px Fleuron`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
        decimation: inRange(40, 60, { isInteger: true }),
    });

    const BALL_COUNT = inRange(16, 24, { isInteger: true });
    const NEAREST_POINTS = inRange(36, 50, { isInteger: true });

    const balls: S141220NoisePoint[] = [...Array(BALL_COUNT)].map(
        () => new S141220NoisePoint()
    );

    const pallette = pick(pallettes);
    const backgroundColor = pick(pallette);

    return () => {
        clearBackgroundWithColor(ctx, backgroundColor);

        balls.forEach(ball => {
            ball.update(ctx, 0.0058);

            const nearestPoints = ball.getNearestPoints(points, NEAREST_POINTS);
            nearestPoints.forEach(([x, y]) => {
                const nX = x + Math.random() * 2;
                const nY = y + Math.random() * 2;

                ctx.beginPath();
                ctx.arc(nX, nY, 0.5, 0, Math.PI * 2);
                ctx.strokeStyle = pick(pallette);
                ctx.stroke();
                ctx.closePath();

                const cp1 = lerpVector(
                    [
                        ball.x + simplex1D(ball.x) * 5,
                        ball.y + simplex1D(ball.x) * 5,
                    ],
                    [x + simplex1D(x) * 50, y + simplex1D(y) * 50],
                    0.33
                );
                const cp2 = lerpVector(
                    [
                        ball.x + simplex1D(ball.x) * 5,
                        ball.y + simplex1D(ball.x) * 5,
                    ],
                    [x + simplex1D(x) * 50, y + simplex1D(y) * 50],
                    0.66
                );
                bezierCurveBetween(ctx, [ball.x, ball.y], cp1, cp2, [nX, nY]);
            });
        });
    };
};

const S181220 = () => (
    <>
        <Canvas2DRenderer
            sketch={sketch}
            settings={{ animationSettings: { fps: 14 } }}
        />
        <ControlsContainer>
            <RefreshButton>Change text</RefreshButton>
        </ControlsContainer>
    </>
);

export default S181220;

export { default as metaImage } from "./meta-image.png";
