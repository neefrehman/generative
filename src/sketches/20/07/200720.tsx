// From Coding Train's Marching squares tutorial
// https://www.youtube.com/watch?v=0ZONMNUKTfU

import React from "react";

import {
    CanvasWrapper2D,
    Canvas2DSettings,
    Canvas2DSetupFn
} from "Renderers/Canvas2D";

import { lineBetween, rgbaToString } from "LibUtils/canvas2d";

import { noise3D } from "Utils/random";
import { lerp } from "Utils/math";

import { getDimensions190720 } from "./190720";

const settings: Canvas2DSettings = {
    dimensions: getDimensions190720(),
    isAnimated: true
};

const sketch: Canvas2DSetupFn = ({ width, height }) => {
    const field: number[][] = [];
    const resolution = 4;

    const cols = 1 + width / resolution;
    const rows = 1 + height / resolution;

    const increment = 0.1;
    let zoff = 0;

    const getBase10State = (a: number, b: number, c: number, d: number) =>
        a * 8 + b * 4 + c * 2 + d * 1;

    for (let i = 0; i < cols; i++) {
        const k = [];
        for (let j = 0; j < rows; j++) {
            k.push(0);
        }
        field.push(k);
    }

    return ({ ctx }) => {
        ctx.fillStyle = "rgb(20,20,20)";
        ctx.fillRect(0, 0, width, height);
        let xoff = 0;

        for (let i = 0; i < cols; i++) {
            xoff += increment;
            let yoff = 0;

            for (let j = 0; j < rows; j++) {
                field[i][j] = noise3D(xoff, yoff, zoff);
                yoff += increment;
            }
        }

        zoff += 0.01;

        for (let i = 0; i < cols - 1; i++) {
            for (let j = 0; j < rows - 1; j++) {
                const x = i * resolution;
                const y = j * resolution;

                const base10State = getBase10State(
                    Math.ceil(field[i][j]),
                    Math.ceil(field[i + 1][j]),
                    Math.ceil(field[i + 1][j + 1]),
                    Math.ceil(field[i][j + 1])
                );

                const aVal = field[i][j] + 1;
                const bVal = field[i + 1][j] + 1;
                const cVal = field[i + 1][j + 1] + 1;
                const dVal = field[i][j + 1] + 1;

                let lepAmount = (1 - aVal) / (bVal - aVal);
                const a = [lerp(x, x + resolution, lepAmount), y];

                lepAmount = (1 - bVal) / (cVal - bVal);
                const b = [x + resolution, lerp(y, y + resolution, lepAmount)];

                lepAmount = (1 - dVal) / (cVal - dVal);
                const c = [lerp(x, x + resolution, lepAmount), y + resolution];

                lepAmount = (1 - aVal) / (dVal - aVal);
                const d = [x, lerp(y, y + resolution, lepAmount)];

                ctx.strokeStyle = rgbaToString(255, 80, 20);
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

const S200720 = () => <CanvasWrapper2D sketch={sketch} settings={settings} />;

export default S200720;
