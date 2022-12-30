import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { ControlsContainer, RefreshButton } from "components/SketchControls";
import { S141220NoisePoint } from "sketches/20/12/141220";

import {
  bezierCurveBetween,
  clearBackgroundWithColor,
  generateTextPath,
} from "Utils/libs/canvas2d";
import type { Vector } from "Utils/math";
import { getShortestViewportDimension, lerpVector } from "Utils/math";
import { pick, simplex1D } from "Utils/random";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
  const WORD = "NO";
  const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.3);

  ctx.font = `${SCALE}px Fleuron`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.strokeStyle = "rgb(255, 255, 255)";

  const points = generateTextPath(ctx, WORD, width / 2, height / 2, {
    decimation: 40,
  });

  const BALL_COUNT = 42;
  let NEAREST_POINTS = 32;

  const balls: S141220NoisePoint[] = [...Array(BALL_COUNT)].map(
    () => new S141220NoisePoint()
  );

  const pallette = pallettes[61];
  const backgroundColor = pallette[3];

  let swarmCenter = [width / 2, height / 2] as Vector<2>;

  return ({ mouseIsIdle, mousePosition, mouseIsDown }) => {
    clearBackgroundWithColor(ctx, backgroundColor);

    if (mouseIsDown) {
      NEAREST_POINTS += NEAREST_POINTS < 64 ? 2 : 0;
    } else {
      NEAREST_POINTS -= NEAREST_POINTS > 36 ? 2 : 0;
    }

    swarmCenter = lerpVector(
      swarmCenter,
      !mouseIsIdle ? mousePosition : [width / 2, height / 2],
      0.33
    );

    balls.forEach(ball => {
      ball.update(ctx, {
        speed: 0.0036,
        mousePosition: swarmCenter,
        mouseOffset: 500,
      });

      const nearestPoints = ball.getNearestPoints(points, NEAREST_POINTS);
      nearestPoints.forEach(([x, y]) => {
        const nX = x + Math.random() * 2;
        const nY = y + Math.random() * 2;

        ctx.beginPath();
        ctx.arc(nX, nY, 1, 0, Math.PI * 2);
        ctx.strokeStyle = pick(pallette);
        ctx.lineWidth = 3;
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
