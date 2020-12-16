/* eslint-disable no-bitwise */
// adapted from: https://stackoverflow.com/a/30204783

import { decimateArray } from "Utils/math";
import type { Vector } from "Utils/math";

/**
 * Creates an array of points from a drawn shape
 *
 * @param ctx - the canvas context
 * @param draw - A callback function to draw the points that will be sampled into the array
 * @param options - options for the sampling
 *
 * @returns points - and array of point sampled from the drawn shape
 */
export const sampleCanvasPixels = (
    ctx: CanvasRenderingContext2D,
    draw: () => void,
    options: {
        /** How large a gap to leave between sampling pixels */
        gap?: number;
        /** how big a reduction to make in the sampled point array */
        decimation?: number;
    } = {}
): Vector<2>[] => {
    const { gap = 1, decimation = 20 } = options;

    const points: Vector<2>[] = [];

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.fillStyle = "rgb(255, 255, 255)";
    draw();
    ctx.restore();

    // get a Uint32 representation of the bitmap:
    const data32 = new Uint32Array(
        ctx.getImageData(0, 0, width, height).data.buffer
    );

    // loop through each pixel. We will only store the ones with alpha = 255
    for (let i = 0; i < data32.length; i += gap) {
        // check alpha mask
        if (data32[i] & 0xff000000) {
            // add new point if a solid pixel
            points.push([
                (i % width) / window.devicePixelRatio,
                (i / width / window.devicePixelRatio) | 0,
            ]);
        }
    }

    ctx.clearRect(0, 0, width, height);

    if (decimation > 1) return decimateArray(points, decimation, 1);

    return points;
};
