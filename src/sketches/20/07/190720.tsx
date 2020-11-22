// From Coding Train's Marching squares tutorial
// https://www.youtube.com/watch?v=0ZONMNUKTfU

import React from "react";

import {
    Canvas2DRenderer,
    Canvas2DRendererSettings,
    Canvas2DSetupFn,
} from "Renderers/Canvas2D";

import { simplex3D } from "Utils/random";
import { getShortestViewportDimension } from "Utils/math";

export const getDimensions190720 = (): [number, number] => {
    const shortestDimension = getShortestViewportDimension({
        cap: 660,
        withMargin: true,
    });

    return shortestDimension > 425
        ? [shortestDimension, shortestDimension]
        : [window.innerWidth, window.innerHeight];
};

const settings: Canvas2DRendererSettings = {
    dimensions: getDimensions190720(),
    isAnimated: true,
};

const sketch: Canvas2DSetupFn = ({ width, height }) => {
    const field: number[][] = [];
    const resolution = 6;

    const cols = 1 + width / resolution;
    const rows = 1 + height / resolution;

    const increment = 0.1;
    let zoff = 0;

    for (let i = 0; i < cols; i++) {
        const k = [];
        for (let j = 0; j < rows; j++) {
            k.push(0);
        }
        field.push(k);
    }

    return ({ ctx }) => {
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, 0, width, height);
        let xoff = 0;

        for (let i = 0; i < cols; i++) {
            xoff += increment;
            let yoff = 0;

            for (let j = 0; j < rows; j++) {
                field[i][j] = simplex3D(xoff, yoff, zoff);
                yoff += increment;
            }
        }

        zoff += 0.03;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const rgbVal = field[i][j] * 310;
                ctx.fillStyle = `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`;
                ctx.strokeStyle = null;
                ctx.fillRect(
                    i * resolution,
                    j * resolution,
                    resolution,
                    resolution
                );
            }
        }
    };
};

const S190720 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S190720;
