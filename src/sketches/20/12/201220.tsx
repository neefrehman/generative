import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import {
    ControlsContainer,
    RefreshButton,
    SketchTip,
} from "components/SketchControls";

import {
    bezierCurveBetween,
    clearBackgroundWithColor,
    generateTextPath,
} from "Utils/libs/canvas2d";
import type { Vector } from "Utils/math";
import { getShortestViewportDimension, lerpVector } from "Utils/math";
import { inRange, pick, simplex1D } from "Utils/random";

import { S141220NoisePoint } from "./141220";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
    // prettier-ignore
    const WORD = pick([
        "HI", "?", "COLOUR", "YES", ":—)", "MOVE", "@",
        "8", "5", "4", "1", "NO", "!", "MAYBE", "HOLD",
    ]);
    const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.3);

    ctx.font = `${SCALE}px Fleuron`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
        decimation: inRange(40, 60, { isInteger: true }),
    });

    const BALL_COUNT = inRange(16, 22, { isInteger: true });
    let NEAREST_POINTS = 36;

    const balls: S141220NoisePoint[] = [...Array(BALL_COUNT)].map(
        () => new S141220NoisePoint()
    );

    const pallette = pick(pallettes);
    const backgroundColor = pick(pallette);

    let swarmCenter = [width / 2, height / 2] as Vector<2>;

    return ({ mouseIsIdle, mousePosition, mouseIsDown }) => {
        clearBackgroundWithColor(ctx, backgroundColor);

        if (mouseIsDown) NEAREST_POINTS += NEAREST_POINTS < 64 ? 2 : 0;
        else NEAREST_POINTS = 36;

        swarmCenter = lerpVector(
            swarmCenter,
            !mouseIsIdle ? mousePosition : [width / 2, height / 2],
            0.33
        );

        balls.forEach(ball => {
            ball.update(ctx, {
                speed: 0.0058,
                mousePosition: swarmCenter,
                mouseOffset: 160,
            });

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
            <SketchTip>Move and click</SketchTip>
        </ControlsContainer>
    </>
);

export default S181220;

export { default as metaImage } from "./181220/meta-image.png";
