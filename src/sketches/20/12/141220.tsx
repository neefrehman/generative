import React from "react";

import { Canvas2DRenderer } from "Renderers/Canvas2D";
import type { Canvas2DSetupFn } from "Renderers/Canvas2D";

import { generateTextPath, lineBetween } from "Utils/libs/canvas2d";
import { getDistance, getShortestViewportDimension, mapToRange } from "Utils/math";
import { inRange, simplex1D } from "Utils/random";
import type { Vector } from "Utils/math";

export class S151220NoisePoint {
    xOff: number;
    yOff: number;
    r: number;
    x: number;
    y: number;

    constructor(r?: number) {
        this.xOff = inRange(200);
        this.yOff = inRange(400, 600);
        this.r = r || 2;
    }

    update(ctx: CanvasRenderingContext2D) {
        this.xOff += 0.0038;
        this.yOff += 0.0038;

        this.x = mapToRange(simplex1D(this.xOff), -1, 1, 0, ctx.canvas.width / 2);
        this.y = mapToRange(simplex1D(this.yOff), -1, 1, 0, ctx.canvas.height / 2);

        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.stroke();
    }

    getNearestPoints(pointArray: Vector<2>[], pointsToSave: number) {
        const sortedPointArray = pointArray.sort(
            (a, b) =>
                getDistance(a, [this.x, this.y]) - getDistance(b, [this.x, this.y])
        );
        const NearestPoints = sortedPointArray.slice(0, pointsToSave);
        return NearestPoints;
    }
}

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const SCALE = getShortestViewportDimension({ cap: 900 });
    const WORD = "GENERATIVE";
    const LETTER = WORD[inRange(0, WORD.length, { isInteger: true })];

    ctx.font = `${SCALE}px Fleuron`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const points = generateTextPath(ctx, LETTER, width / 2, height / 2, {
        decimation: inRange(35, 50, { isInteger: true }),
    });

    const BALL_COUNT = inRange(9, 14, { isInteger: true });
    const NEAREST_POINTS = inRange(35, 45, { isInteger: true });
    const balls: S151220NoisePoint[] = [...Array(BALL_COUNT)].map(
        () => new S151220NoisePoint()
    );

    return () => {
        ctx.clearRect(0, 0, width, height);

        // ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
        // ctx.strokeText(LETTER, width / 2, height / 2);

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

const S141220 = () => <Canvas2DRenderer sketch={sketch} />;

export default S141220;
