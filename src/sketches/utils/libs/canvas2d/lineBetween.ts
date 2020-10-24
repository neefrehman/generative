import { Vector } from "Utils/math";

/**
 * Draws a line between 2 points
 *
 * @param ctx - the canvas context
 * @param a - the point the line will be drawn from
 * @param b - the point the line will be drawn two
 */
export const lineBetween = (ctx: CanvasRenderingContext2D, a: Vector, b: Vector) => {
    const [ax, ay] = a;
    const [bx, by] = b;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
};
