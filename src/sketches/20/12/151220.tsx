import React from "react";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { generateTextPath, lineBetween } from "Utils/libs/canvas2d";
import { getShortestViewportDimension } from "Utils/math";
import { inRange, pick } from "Utils/random";

import { S141220NoisePoint } from "./141220";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const WORD = pick(["HELLO", "LOVE", "BLUE", "HAPPY", "YAWN"]);
    const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.3);

    ctx.font = `${SCALE}px Fleuron`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
        decimation: inRange(40, 60, { isInteger: true }),
    });

    const BALL_COUNT = inRange(12, 20, { isInteger: true });
    const NEAREST_POINTS = inRange(35, 45, { isInteger: true });
    const balls: S141220NoisePoint[] = [...Array(BALL_COUNT)].map(
        () => new S141220NoisePoint()
    );

    return () => {
        ctx.clearRect(0, 0, width, height);

        balls.forEach(ball => {
            ball.update(ctx);

            const nearestPoints = ball.getNearestPoints(points, NEAREST_POINTS);
            nearestPoints.forEach(([x, y], i) => {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${
                    inRange(0.2, 1) - i * (1 / NEAREST_POINTS)
                })`;
                ctx.stroke();
                lineBetween(ctx, [ball.x, ball.y], [x, y]);
            });
        });
    };
};

const S151220 = () => <Canvas2DRenderer sketch={sketch} />;

export default S151220;
