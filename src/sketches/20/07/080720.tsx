import React from "react";
import palettes from "nice-color-palettes";

import type { Canvas2DSetupFn } from "Renderers/Canvas2D";
import { Canvas2DRenderer } from "Renderers/Canvas2D";

import { lerp, getAngle } from "Utils/math";
import type { Vector } from "Utils/math";
import { shuffle, pick, inRange, noise3D } from "Utils/random";

const sketch: Canvas2DSetupFn = ({ width, height }) => {
    const colorCount = inRange(2, 6, { isInteger: true });
    const randomPalette = shuffle(pick(palettes).slice(0, colorCount));
    const lineColor = pick(randomPalette);

    const createGrid = () => {
        const lines: Vector<2>[] = [];

        const randomHalfX = Math.random() > 0.5;
        const randomHalfY = Math.random() > 0.5;
        const randStartX = Math.random() * width;
        const randStartY = Math.random() * height;

        const fillGrid = (x: number, y: number) => {
            const u = x / (width - 1);
            const v = y / (height - 1);
            lines.push([u, v]);
        };

        // Randomly choose quadrants to start from if on large screens
        if (width > 700) {
            if (randomHalfX) {
                for (let x = randStartX * 0.5; x < width; x += 56) {
                    if (randomHalfY) {
                        for (let y = randStartY * 0.5; y < height; y += 56) {
                            fillGrid(x, y);
                        }
                    } else {
                        for (let y = randStartY * 1.5; y > 0; y -= 56) {
                            fillGrid(x, y);
                        }
                    }
                }
            } else {
                for (let x = randStartX * 1.5; x > 0; x -= 56) {
                    if (randomHalfY) {
                        for (let y = randStartY * 0.5; y < height; y += 56) {
                            fillGrid(x, y);
                        }
                    } else {
                        for (let y = randStartY * 1.5; y > 0; y -= 56) {
                            fillGrid(x, y);
                        }
                    }
                }
            }
        } else {
            for (let x = 0; x < width; x += 56) {
                for (let y = 0; y < height; y += 56) {
                    fillGrid(x, y);
                }
            }
        }
        return lines;
    };

    const lines = createGrid();
    const lineWidth = 5;
    const lineHeight = 28;
    const margin = 52;

    let noiseZ = 0;
    const noiseZVel = 0.000007;

    return ({ ctx, mousePosition, mouseHasEntered }) => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = lineColor;

        lines.forEach(position => {
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            const angleToMouse = mouseHasEntered
                ? getAngle(mousePosition, [x, y])
                : 0;

            const rotation = angleToMouse + 0.75 * noise3D(u, v, noiseZ);

            noiseZ += noiseZVel;

            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillRect(-lineWidth / 2, -lineHeight / 2, lineWidth, lineHeight);
            ctx.restore();
        });
    };
};

const S080720 = () => <Canvas2DRenderer sketch={sketch} />;

export default S080720;
