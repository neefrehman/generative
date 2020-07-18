/**
 * Draws a rectangle with rounded edges
 *
 * @param ctx - the canvas context
 * @param x - The top left x coordinate of the rectangle
 * @param y - The top left y coordinate of the rectangle
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param radius - The corner radius. Can also be an object to specify different radii for each corner
 * @param options.fill - Whether to fill the rectangle.
 * @param options.stroke - Whether to stroke the rectangle.
 */
export const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | IndividualCornerRadii = 0,
    options: { fill?: boolean; stroke?: boolean } = {
        fill: true,
        stroke: false
    }
) => {
    const { fill, stroke } = options;

    const radii =
        typeof radius === "number"
            ? { tl: radius, tr: radius, br: radius, bl: radius }
            : radius;

    ctx.beginPath();
    ctx.moveTo(x + radii.tl, y);
    ctx.lineTo(x + width - radii.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radii.tr);
    ctx.lineTo(x + width, y + height - radii.br);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radii.br,
        y + height
    );
    ctx.lineTo(x + radii.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radii.bl);
    ctx.lineTo(x, y + radii.tl);
    ctx.quadraticCurveTo(x, y, x + radii.tl, y);
    ctx.closePath();

    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
};

interface IndividualCornerRadii {
    tl?: number;
    tr?: number;
    br?: number;
    bl?: number;
}
