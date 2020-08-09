import React from "react";

import { Canvas2DRenderer } from "Renderers/Canvas2D";
import type {
    Canvas2DRendererSettings,
    Canvas2DSetupFn,
} from "Renderers/Canvas2D";

import {
    lerp,
    getShortestViewportDimension,
    getDistance,
    mapRange,
    Vector,
} from "Utils/math";
import { noise2D, noise3D } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ withMargin: true });

const settings: Canvas2DRendererSettings = {
    dimensions: [shortestDimension, shortestDimension],
    isAnimated: true,
};

const sketch: Canvas2DSetupFn = () => {
    const createGrid = () => {
        const points: {
            position: Vector<2>;
            radius: number;
        }[] = [];
        const count = 24;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = x / (count - 1);
                const v = y / (count - 1);
                const radius = Math.abs(noise2D(u, v)) * 0.05;

                points.push({
                    position: [u, v],
                    radius,
                });
            }
        }
        return points;
    };

    const points = createGrid();
    const margin = shortestDimension > 1000 ? 112 : 36;

    let noiseZ = 0;
    const noiseZVel = 0.000007;

    return ({ ctx, width, height, mousePosition }) => {
        ctx.clearRect(0, 0, width, height);

        points.forEach(data => {
            const { position, radius } = data;
            const [u, v] = position;

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            const distanceFromMouse = getDistance([x, y], mousePosition);
            const mappedDistance = mapRange(
                distanceFromMouse,
                0,
                1000,
                0,
                0.005,
                {
                    clamp: true,
                }
            );

            const r =
                radius +
                Math.abs(0.02 * noise3D(u, v, noiseZ)) +
                mappedDistance;

            noiseZ += noiseZVel;

            ctx.beginPath();
            ctx.arc(x, y, r * width, 0, Math.PI * 2, false);

            ctx.fillStyle = "white";
            ctx.fill();
        });
    };
};

const S030720 = () => <Canvas2DRenderer sketch={sketch} settings={settings} />;

export default S030720;
