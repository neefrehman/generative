// Adapted from one of Jonny Thaw's amazing 'things' sketches, to figure
// out these super cool pseudo-3D plane translations: http://www.jthaw.me/things

import React from "react";

import { Canvas2DRenderer } from "Renderers/Canvas2D";
import type { Canvas2DRendererSettings, Canvas2DSetupFn } from "Renderers/Canvas2D";

import { SketchBackground } from "components/SketchBackground";

import { getShortestViewportDimension } from "Utils/math";
import { pick, perlin3D } from "Utils/random";

const shortestDimension = getShortestViewportDimension({
  withMargin: true,
  cap: 750,
});

const settings: Canvas2DRendererSettings = {
  dimensions: [shortestDimension, shortestDimension],
};

const sketch: Canvas2DSetupFn = ({ ctx, width, height }) => {
  const COLUMNS = 30;
  const ROWS = 30;
  const LAYER_COUNT = Math.floor(shortestDimension / 52);
  const LAYER_DEPTH = 32;

  const xSize = width / COLUMNS;
  const ySize = height / ROWS;

  const niceHues = [150, 301, 165, 67, 53, 108, 57];
  const hue = pick(niceHues);

  const drawPoint = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillRect(0, 0, xSize + 1, ySize + 1);
    ctx.restore();
  };

  const drawPlane = (z: number) => {
    for (let x = 0; x < COLUMNS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const pointNoise = perlin3D(x / 10, y / 10, z);

        if (pointNoise > 0) {
          drawPoint(x * xSize, y * ySize);
        }
      }
    }

    ctx.strokeRect(0, 0, width, height);
  };

  let zOffset = 0;

  return () => {
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    ctx.transform(0.5, -0.1, 0, 0.5, width / 2, width / 2);
    ctx.translate(
      -(width / 2 + (LAYER_COUNT * LAYER_DEPTH) / 2),
      -(height / 2 + (LAYER_COUNT * LAYER_DEPTH) / 2)
    );

    for (let i = 0; i < LAYER_COUNT; i++) {
      ctx.translate(LAYER_DEPTH, LAYER_DEPTH);
      ctx.fillStyle = `hsl(${hue}, ${(i / LAYER_COUNT) * 100}%, 40%)`;
      ctx.strokeStyle = `hsl(${hue}, 100%, 40%)`;
      drawPlane(i / LAYER_COUNT + zOffset);
    }

    zOffset += 0.008;

    ctx.restore();
  };
};

const S141120 = () => (
  <>
    <SketchBackground color="#dcdcdc" />
    <Canvas2DRenderer sketch={sketch} settings={settings} />
  </>
);

export default S141120;
