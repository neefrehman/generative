// Sol LeWitt: instructions 273

import React from "react";
import { pick } from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

import RawCanvasWrapper, {
    RawCanvasSettings
} from "../../../components/renderers/RawCanvasWrapper";

const settings: RawCanvasSettings = {
    dimensions: [window.innerWidth - 30, window.innerHeight - 30],
    contextType: "2d"
};

const sketch = (ctx: CanvasRenderingContext2D) => {
    const { dimensions } = settings;
    const [width, height] = dimensions;

    const colors = pick(palettes);
    const grey = "rgba(255, 255, 255, 0.02)";

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

    ctx.lineWidth = 2;

    // random range
    const randomRange = (low: number, high: number) => {
        return Math.floor(Math.random() * (1 + high - low)) + low;
    };

    const gridSpacing = 50;
    const gridCols = width / gridSpacing;
    const gridRows = height / gridSpacing;

    const createGrid = () => {
        ctx.save();
        ctx.strokeStyle = grey;

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
    const pointsCount = 20;

    const createPoints = () => {
        for (let i = pointsCount - 1; i >= 0; i--) {
            const x = randomRange(0, gridCols) * gridSpacing;
            const y = randomRange(0, gridRows) * gridSpacing;
            points.push({ x, y });
        }
    };

    const createCornerLines = () => {
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

    const createMidpointLines = () => {
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

    const createCenterLines = () => {
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

    const createText = () => {
        points.forEach((point, i) => {
            const letter = String.fromCharCode(65 + i);
            ctx.fillStyle = pick(colors);
            ctx.font = `36px "arial"`;
            ctx.fillText(letter, point.x, point.y);
        });
    };

    const init = () => {
        createPoints();
        createGrid();
        createCornerLines();
        createMidpointLines();
        createCenterLines();
        createText();
    };

    init();
};

const S280620 = () => <RawCanvasWrapper sketch={sketch} settings={settings} />;

export default S280620;
