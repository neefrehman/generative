import type { Vector } from "Utils/math";

/**
 * Draws a bezier curve between 2 points
 *
 * @param ctx - the canvas context
 * @param a - the point the line will be drawn from
 * @param cp1 - curve point 1
 * @param cp2 - curve point 2
 * @param b - the point the line will be drawn two
 */
export const bezierCurveBetween = (
    ctx: CanvasRenderingContext2D,
    a: Vector,
    cp1: Vector,
    cp2: Vector,
    b: Vector
) => {
    const [ax, ay] = a;
    const [bx, by] = b;
    const [cp1x, cp1y] = cp1;
    const [cp2x, cp2y] = cp2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, bx, by);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
};
