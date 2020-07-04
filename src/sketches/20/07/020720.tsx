// Sol LeWitt: instructions 273
import React from "react";
import palettes from "nice-color-palettes";

import { CanvasWrapper2D } from "Renderers/Canvas2D";
import type { Canvas2DSettings, Canvas2DSetupFn } from "Renderers/Canvas2D";

import { NoiseOverlay } from "Utils/NoiseOverlay";
import { pick, inRange } from "Utils/random";

const settings: Canvas2DSettings = {
    dimensions: [window.innerWidth, window.innerHeight]
};

const sketch: Canvas2DSetupFn = () => {
    const { dimensions } = settings;
    const [width, height] = dimensions;
    const colors = pick(palettes);

    const midpoints = [
        {
            x: width / 2,
            y: 0
        },
        {
            x: width,
            y: height / 2
        },
        {
            x: width / 2,
            y: height
        },
        {
            x: 0,
            y: height / 2
        }
    ];

    const corners = [
        {
            x: 0,
            y: 0
        },
        {
            x: width,
            y: 0
        },
        {
            x: width,
            y: height
        },
        {
            x: 0,
            y: height
        }
    ];

    const center = {
        x: width / 2,
        y: height / 2
    };

    const gridSpacing = 50;
    const gridCols = width / gridSpacing;
    const gridRows = height / gridSpacing;

    const createGrid = ctx => {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";

        for (let x = 0; x < gridCols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * gridSpacing, 0);
            ctx.lineTo(x * gridSpacing, height);
            ctx.closePath();
            ctx.stroke();
        }

        for (let y = 0; y < gridRows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * gridSpacing);
            ctx.lineTo(width, y * gridSpacing);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
    };

    const points = [];
    const pointsCount = 18;

    const createPoints = () => {
        for (let i = pointsCount - 1; i >= 0; i--) {
            const x = inRange(0, gridCols, { isInteger: true }) * gridSpacing;
            const y = inRange(0, gridRows, { isInteger: true }) * gridSpacing;
            points.push({ x, y });
        }
    };

    const createCornerLines = ctx => {
        ctx.save();
        ctx.strokeStyle = colors[1];
        corners.forEach(corner => {
            points.forEach(point => {
                ctx.beginPath();
                ctx.moveTo(corner.x, corner.y);
                ctx.lineTo(point.x, point.y);
                ctx.closePath();
                ctx.stroke();
            });
        });
        ctx.restore();
    };

    const createMidpointLines = ctx => {
        ctx.save();
        ctx.strokeStyle = colors[2];
        midpoints.forEach(midpoint => {
            points.forEach(point => {
                ctx.beginPath();
                ctx.moveTo(midpoint.x, midpoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.closePath();
                ctx.stroke();
            });
        });
        ctx.restore();
    };

    const createCenterLines = ctx => {
        ctx.save();
        ctx.strokeStyle = colors[3];
        points.forEach(point => {
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(point.x, point.y);
            ctx.closePath();
            ctx.stroke();
        });
        ctx.restore();
    };

    const createText = ctx => {
        points.forEach((point, i) => {
            const letter = String.fromCharCode(65 + i);
            ctx.fillStyle = pick(colors);
            ctx.font = `36px "arial"`;
            ctx.fillText(letter, point.x, point.y);
        });
    };

    return ({ ctx }) => {
        ctx.lineWidth = 2;

        createPoints();
        createGrid(ctx);
        createCornerLines(ctx);
        createMidpointLines(ctx);
        createCenterLines(ctx);
        createText(ctx);
    };
};

const S020720 = () => (
    <>
        <CanvasWrapper2D sketch={sketch} settings={settings} />
        <NoiseOverlay opacity={0.1} />
    </>
);

export default S020720;
