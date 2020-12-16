import React from "react";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { bezierCurveBetween, sampleCanvasPixels } from "Utils/libs/canvas2d";
import { getShortestViewportDimension, lerpVector } from "Utils/math";
import { inRange, simplex1D } from "Utils/random";

import { S141220NoisePoint } from "../141220";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const SCALE = getShortestViewportDimension({ cap: 900, withMargin: true });

    const points = sampleCanvasPixels(
        ctx,
        () => {
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, inRange(SCALE / 2), 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        },
        {
            decimation: inRange(40, 50, { isInteger: true }),
        }
    );

    const BALL_COUNT = inRange(18, 22, { isInteger: true });
    const NEAREST_POINTS = inRange(35, 45, { isInteger: true });
    const CIRCLE_NOISE = inRange(40);
    const BEZIER_NOISE = inRange(3, 10);
    const BEZIER_POINT_1 = inRange(0, 1);
    const BEZIER_POINT_2 = inRange(0.0, 1);

    const balls: S141220NoisePoint[] = [...Array(BALL_COUNT)].map(
        () => new S141220NoisePoint()
    );

    return () => {
        ctx.clearRect(0, 0, width, height);

        balls.forEach(ball => {
            ball.update(ctx, 0.0058);

            const nearestPoints = ball.getNearestPoints(points, NEAREST_POINTS);
            nearestPoints.forEach(([x, y], i) => {
                const nX = x + Math.random() * CIRCLE_NOISE;
                const nY = y + Math.random() * CIRCLE_NOISE;

                ctx.beginPath();
                ctx.arc(nX, nY, 1, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${
                    inRange(0.2, 1) - i * (1 / NEAREST_POINTS)
                })`;
                ctx.stroke();
                ctx.closePath();

                const cp1 = lerpVector(
                    [
                        ball.x + simplex1D(ball.x) * BEZIER_NOISE,
                        ball.y + simplex1D(ball.x) * BEZIER_NOISE,
                    ],
                    [x + simplex1D(x) * 50, y + simplex1D(y) * 50],
                    BEZIER_POINT_1
                );
                const cp2 = lerpVector(
                    [
                        ball.x + simplex1D(ball.x) * BEZIER_NOISE,
                        ball.y + simplex1D(ball.x) * BEZIER_NOISE,
                    ],
                    [x + simplex1D(x) * 50, y + simplex1D(y) * 50],
                    BEZIER_POINT_2
                );
                bezierCurveBetween(ctx, [ball.x, ball.y], cp1, cp2, [nX, nY]);
            });
        });
    };
};

const S171220 = () => (
    <>
        <Canvas2DRenderer
            sketch={sketch}
            settings={{ animationSettings: { fps: 14 } }}
        />
        <ControlsContainer>
            <RefreshButton>Re-generate circle</RefreshButton>
        </ControlsContainer>
    </>
);

export default S171220;
