import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { sampleCanvasPixels } from "LibUtils/canvas2d";

import type { Vector } from "Utils/math";
import { lerp, getDistance, getShortestViewportDimension } from "Utils/math";
import { inRange, inSquare, pick } from "Utils/random";
import { simplex3D } from "Utils/random/noise/simplex";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
  const SCALE = getShortestViewportDimension({ cap: 600 });

  ctx.fillStyle = "rgb(76, 41, 41)";
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.lineWidth = 1;

  const pallette = pick(pallettes);

  const points = sampleCanvasPixels(
    ctx,
    () => {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, SCALE / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    },
    {
      decimation: 5,
    }
  ).map(position => ({
    position,
    color: pick(pallette),
  }));

  const randomTimeStart = inRange(10000);
  const repellors = [...Array(10)].map(() => inSquare(SCALE, SCALE));

  return ({ frameCount, mousePosition }) => {
    ctx.clearRect(0, 0, width, height);

    const timeStartX = (frameCount / 5 + randomTimeStart) / 200;
    const timeStartY = (frameCount / 5 + randomTimeStart) / 200 + 999;

    const repellorPositions = [
      mousePosition,
      ...repellors.map(
        ([x, y]): Vector<2> => [
          simplex3D(x, y, timeStartX) * width,
          simplex3D(x, y, timeStartY) * height,
        ]
      ),
    ];

    points.forEach(({ position: [x, y], color }) => {
      const closestRepellor = repellorPositions.reduce((prev, cur) =>
        getDistance([x, y], cur) < getDistance([x, y], prev) ? cur : prev
      );
      const closestRepellorDistance = getDistance([x, y], closestRepellor) / 100;

      const u = lerp(x, closestRepellor[0], closestRepellorDistance);
      const v = lerp(y, closestRepellor[1], closestRepellorDistance);

      ctx.fillStyle = color;

      ctx.save();
      ctx.beginPath();
      ctx.rect(u, v, 6, 6);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    });
  };
};

const S060222 = () => <Canvas2DRenderer sketch={sketch} />;

export default S060222;
