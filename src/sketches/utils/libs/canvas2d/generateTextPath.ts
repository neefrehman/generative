/* eslint-disable no-bitwise */
// adapted from: https://stackoverflow.com/a/30204783

import { decimateArray } from "Utils/math";
import type { Vector } from "Utils/math";

/**
 * Creates an array of points that make up the path of text
 *
 * @param ctx - the canvas context
 * @param text - The text to create points from
 * @param x - the point the line will be drawn two
 * @param y - the point the line will be drawn two
 * @param options - the point the line will be drawn two
 */
export const generateTextPath = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
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
    ctx.strokeText(text, x, y);
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
