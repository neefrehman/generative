// From Coding Train's Marching squares tutorial
// https://www.youtube.com/watch?v=0ZONMNUKTfU

import React from "react";

import type { Canvas2DRendererSettings, Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { lineBetween, rgbaToString } from "LibUtils/canvas2d";

import { Metaball } from "./220720";
import { getDimensions190720 } from "./190720";

const settings: Canvas2DRendererSettings = {
  dimensions: getDimensions190720(),
  isAnimated: true,
};

const sketch: Canvas2DSetupFn = ({ width, height }) => {
  const field: number[][] = [];
  const metaballs: Metaball[] = [];

  const resolution = 6;

  const cols = 1 + width / resolution;
  const rows = 1 + height / resolution;

  const getBase10State = (a: number, b: number, c: number, d: number) =>
    a * 8 + b * 4 + c * 2 + d * 1;

  for (let i = 0; i < cols; i++) {
    const k = [];
    for (let j = 0; j < rows; j++) {
      k.push(0);
    }
    field.push(k);
  }

  for (let i = 0; i < 14; i++) metaballs.push(new Metaball(width, height));

  return ({ ctx }) => {
    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let sum = 0;
        const x = i * resolution;
        const y = j * resolution;

        metaballs.forEach(ball => {
          sum +=
            (ball.r * ball.r) /
            ((x - ball.x) * (x - ball.x) + (y - ball.y) * (y - ball.y));
        });

        field[i][j] = sum;
      }
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        ctx.fillStyle = rgbaToString(field[i][j] * 100);
        ctx.strokeStyle = null;
        ctx.fillRect(i * resolution, j * resolution, resolution, resolution);
      }
    }

    metaballs.forEach(ball => ball.move());

    for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        const x = i * resolution;
        const y = j * resolution;

        const a = [x + resolution * 0.5, y];
        const b = [x + resolution, y + resolution * 0.5];
        const c = [x + resolution * 0.5, y + resolution];
        const d = [x, y + resolution * 0.5];

        const threshold = 1;
        const c1 = field[i][j] < threshold ? 0 : 1;
        const c2 = field[i + 1][j] < threshold ? 0 : 1;
        const c3 = field[i + 1][j + 1] < threshold ? 0 : 1;
        const c4 = field[i][j + 1] < threshold ? 0 : 1;

        const base10State = getBase10State(c1, c2, c3, c4);

        ctx.strokeStyle = rgbaToString(255);
        ctx.lineWidth = 1;

        switch (base10State) {
          case 1:
          case 14:
            lineBetween(ctx, c, d);
            break;
          case 2:
          case 13:
            lineBetween(ctx, b, c);
            break;
          case 3:
          case 12:
            lineBetween(ctx, b, d);
            break;
          case 4:
          case 11:
            lineBetween(ctx, a, b);
            break;
          case 5:
          case 10:
            lineBetween(ctx, a, d);
            lineBetween(ctx, b, c);
            break;
          case 6:
          case 9:
            lineBetween(ctx, a, c);
            break;
          case 7:
          case 8:
            lineBetween(ctx, a, d);
            break;
          default:
            null;
        }
      }
    }
  };
};

const S230720 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S230720;
