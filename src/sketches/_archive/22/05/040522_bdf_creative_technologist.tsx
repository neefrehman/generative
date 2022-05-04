import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import {
    bezierCurveBetween,
    clearBackgroundWithColor,
    generateTextPath,
} from "Utils/libs/canvas2d";
import type { Vector } from "Utils/math";
import {
    getShortestViewportDimension,
    lerpVector,
    getDistance,
    mapToRange,
} from "Utils/math";
import { inRange, pick, simplex1D } from "Utils/random";

export class BDFNoisePoint {
    xOff: number;
    yOff: number;
    r: number;
    x: number;
    y: number;

    constructor() {
        this.xOff = inRange(200);
        this.yOff = inRange(400, 600);
        this.r = 2;
    }

    update(
        ctx: CanvasRenderingContext2D,
        {
            speed = 0.0038,
            mousePosition,
            mouseOffset = 20,
        }: { speed?: number; mousePosition?: Vector<2>; mouseOffset?: number } = {}
    ) {
        this.xOff += speed;
        this.yOff += speed;

        this.x = mousePosition
            ? mousePosition[0] + simplex1D(this.xOff * 4) * mouseOffset * 1.9
            : mapToRange(simplex1D(this.xOff), -1, 1, 0, ctx.canvas.width / 2);
        this.y = mousePosition
            ? mousePosition[1] + simplex1D(this.yOff * 4) * mouseOffset * 0.6
            : mapToRange(simplex1D(this.yOff), -1, 1, 0, ctx.canvas.height / 2);

        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.stroke();
    }

    getNearestPoints(pointArray: Vector<2>[], pointsToSave: number) {
        const sortedPointArray = pointArray.sort(
            (a, b) =>
                getDistance(a, [this.x, this.y]) - getDistance(b, [this.x, this.y])
        );
        const nearestPoints = sortedPointArray.slice(0, pointsToSave);
        return nearestPoints;
    }
}

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    const isCreative = true;

    const CREATIVE = "CREATIVE";
    const TECHNOLOGIST = "TECHNOLOGIST";
    const SCALE = getShortestViewportDimension({ cap: 900 }) / 4.4;

    const creativePos = [width / 2, height / 2 - 110] as Vector<2>;
    const creativeParams = [CREATIVE, width / 2, height / 2 - 110] as const;

    ctx.font = `${SCALE}px Fleuron`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const points = generateTextPath(ctx, ...creativeParams, {
        decimation: 40,
    });

    const BALL_COUNT = inRange(32, 40, { isInteger: true });
    let NEAREST_POINTS = 36;

    const balls: BDFNoisePoint[] = [...Array(BALL_COUNT)].map(
        () => new BDFNoisePoint()
    );

    const pallette = pallettes[3];
    const backgroundColor = isCreative ? pallette[1] : "#212121";

    let swarmCenter = creativePos;

    return ({ mouseIsIdle, mousePosition, mouseIsDown }) => {
        clearBackgroundWithColor(ctx, backgroundColor);

        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.fillText(TECHNOLOGIST, width / 2, height / 2 + 120);

        if (isCreative) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            ctx.strokeText(...creativeParams);

            if (mouseIsDown) {
                NEAREST_POINTS += NEAREST_POINTS < 64 ? 2 : 0;
            } else {
                NEAREST_POINTS -= NEAREST_POINTS > 36 ? 2 : 0;
            }

            swarmCenter = lerpVector(
                swarmCenter,
                !mouseIsIdle ? mousePosition : creativePos,
                0.33
            );

            balls.forEach(ball => {
                ball.update(ctx, {
                    speed: 0.003,
                    mousePosition: swarmCenter,
                    mouseOffset: 320,
                });

                const nearestPoints = ball.getNearestPoints(
                    points,
                    NEAREST_POINTS
                );
                nearestPoints.forEach(([x, y]) => {
                    const nX = x + Math.random() * 2;
                    const nY = y + Math.random() * 2;

                    ctx.beginPath();
                    ctx.arc(nX, nY, 1, 0, Math.PI * 2);
                    ctx.strokeStyle = pick(pallette);
                    ctx.lineWidth = 2;
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
        }
    };
};

const S181220 = () => (
    <Canvas2DRenderer
        sketch={sketch}
        settings={{ animationSettings: { fps: 14 } }}
    />
);

export default S181220;
