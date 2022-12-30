import React from "react";
import pallettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { sampleCanvasPixels } from "LibUtils/canvas2d";

import { getShortestViewportDimension, lerp, lerpVector } from "Utils/math";
import { inRange, pick } from "Utils/random";
import { simplex3D } from "Utils/random/noise/simplex";

const sketch: Canvas2DSetupFn = ({ width, height, ctx }) => {
  const SCALE = getShortestViewportDimension({ cap: 600 });

  ctx.fillStyle = "rgb(76, 41, 41)";
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.lineWidth = 10;

  const pallette = pick(pallettes);

  const points = sampleCanvasPixels(
    ctx,
    () => {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, inRange(20, SCALE / 2), 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    },
    {
      decimation: 5,
    }
  ).map(position => {
    const [x, y] = position;
    return {
      position,
      color: pick(pallette),
      offsetAmount: {
        x: inRange(1, 4) + (Math.sin(y / inRange(20, 40)) - 0.5) * inRange(10),
        y:
          inRange(1, 4) +
          (Math.sin(x + inRange(10) / inRange(20, 900)) - 0.5) * inRange(10),
      },
    };
  });

  const randomTimeStart = inRange(10000);
  const pulseFrequency = inRange(4, 20);
  const pulseAmplitude = inRange(4, 20);

  const mousePositionStart = [width / 2 + inRange(99), height / 2 + inRange(99)];
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

    const pulse = Math.sin(frameCount / pulseFrequency) * pulseAmplitude;

    const xOff = Math.max(Math.abs((width / 2 - mouseX + pulse) / 1.5), 4);
    const yOff = Math.max(Math.abs((height / 2 - mouseY + pulse) / 2.5), 4);

    const timeStartX = (frameCount + randomTimeStart) / 120;
    const timeStartY = (frameCount + randomTimeStart) / 120 + 999;

    points.forEach(({ position: [x, y], color, offsetAmount }) => {
      const u = simplex3D(x, y, timeStartX) * xOff * offsetAmount.x * clickDepth;
      const v = simplex3D(x, y, timeStartY) * yOff * offsetAmount.y * clickDepth;

      ctx.fillStyle = color;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + u, y + v, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    });
  };
};

const S060121 = () => (
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

export default S060121;

export { default as metaImage } from "./050121/meta-image.png";
