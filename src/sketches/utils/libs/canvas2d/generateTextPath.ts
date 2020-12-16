/* eslint-disable no-bitwise */
// adapted from: https://stackoverflow.com/a/30204783

import type { Vector } from "Utils/math";

import { sampleCanvasPixels } from "./sampleCanvasPixels";

/**
 * Creates an array of points that make up the path of text
 *
 * @param ctx - the canvas context
 * @param text - The text to create points from
 * @param x - the x position of the text
 * @param y - the y position of the text
 * @param options - options for the sampling
 *
 * @returns points - and array of point sampled from the drawn shape
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
    const points = sampleCanvasPixels(
        ctx,
        () => ctx.strokeText(text, x, y),
        options
    );

    return points;
};
