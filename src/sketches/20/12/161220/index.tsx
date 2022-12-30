import React from "react";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { bezierCurveBetween, generateTextPath } from "Utils/libs/canvas2d";
import { getShortestViewportDimension, lerpVector } from "Utils/math";
import { inRange, pick, simplex1D } from "Utils/random";

import { S141220NoisePoint } from "../141220";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
  const WORD = pick(["HELLO", "LOVE", "SLOW", "CURVED"]);
  const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.3);

  ctx.font = `${SCALE}px Fleuron`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.strokeStyle = "rgb(255, 255, 255)";

  const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
    decimation: inRange(40, 60, { isInteger: true }),
  });

  const BALL_COUNT = inRange(14, 20, { isInteger: true });
  const NEAREST_POINTS = inRange(36, 48, { isInteger: true });

  const balls: S141220NoisePoint[] = [...Array(BALL_COUNT)].map(
    () => new S141220NoisePoint()
  );

  return () => {
    ctx.clearRect(0, 0, width, height);

    balls.forEach(ball => {
      ball.update(ctx, { speed: 0.0058 });

      const nearestPoints = ball.getNearestPoints(points, NEAREST_POINTS);
      nearestPoints.forEach(([x, y], i) => {
        const nX = x + Math.random() * 3;
        const nY = y + Math.random() * 3;

        ctx.beginPath();
        ctx.arc(nX, nY, 1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${
          inRange(0.2, 1) - i * (1 / NEAREST_POINTS)
        })`;
        ctx.stroke();
        ctx.closePath();

        const cp1 = lerpVector(
          [ball.x + simplex1D(ball.x) * 5, ball.y + simplex1D(ball.x) * 5],
          [x + simplex1D(x) * 50, y + simplex1D(y) * 50],
          0.33
        );
        const cp2 = lerpVector(
          [ball.x + simplex1D(ball.x) * 5, ball.y + simplex1D(ball.x) * 5],
          [x + simplex1D(x) * 50, y + simplex1D(y) * 50],
          0.66
        );
        bezierCurveBetween(ctx, [ball.x, ball.y], cp1, cp2, [nX, nY]);
      });
    });
  };
};

const S161220 = () => (
  <Canvas2DRenderer sketch={sketch} settings={{ animationSettings: { fps: 14 } }} />
);

export default S161220;

export { default as metaImage } from "./meta-image.png";
