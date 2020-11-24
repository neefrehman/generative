import glsl from "glslify";
import React from "react";

import { ShaderRenderer, ShaderSetupFn } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange, pick } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

export const s251120NiceColors = ["#40d6ff", "#40ff43", "#f32d94", "#feed35"];

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
    uniforms: {
        aspect: { value: aspect },
        time: { value: inRange(10000), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [0, 0], type: "2f" },
        color: { value: hexToVec3(pick(s251120NiceColors)), type: "3f" },
    },
    frag: glsl`
        precision highp float;

        #pragma glslify: noise = require("glsl-noise/simplex/2d");

        varying vec2 vUv;

        uniform float time;
        uniform float aspect;
        uniform vec2 resolution;
        uniform vec2 mousePosition;
        uniform vec3 color;

        void main () {
            const int CELL_COUNT = 8;
            const float ZOOM_OUT = 1.5;

            vec2 center = vUv;
            center *= ZOOM_OUT;
            center.x *= aspect;

            vec3 cellColor = color;

            // Cell positions
            vec2 voronoiCells[CELL_COUNT];
            voronoiCells[0] = vec2(0.5 * aspect + noise(vec2(time / 1.2)), 0.5 + noise(vec2(time / 1.0))) * ZOOM_OUT;
            voronoiCells[1] = vec2(0.5 * aspect + noise(vec2(time / 1.7)), 0.5 + noise(vec2(time / 1.3))) * ZOOM_OUT;
            voronoiCells[2] = vec2(0.5 * aspect + noise(vec2(time / 2.1)), 0.5 + noise(vec2(time / 1.7))) * ZOOM_OUT;
            voronoiCells[3] = vec2(0.5 * aspect + noise(vec2(time / 1.0)), 0.5 + noise(vec2(time / 1.1))) * ZOOM_OUT;
            voronoiCells[4] = vec2(0.5 * aspect + noise(vec2(time / 0.8)), 0.5 + noise(vec2(time / 1.9))) * ZOOM_OUT;
            voronoiCells[5] = vec2(0.5 * aspect + noise(vec2(time / 1.0)), 0.5 + noise(vec2(time / 1.0))) * ZOOM_OUT;
            voronoiCells[6] = vec2(0.5 * aspect + noise(vec2(time / 0.7)), 0.5 + noise(vec2(time / 0.8))) * ZOOM_OUT;
            voronoiCells[7] = (mousePosition.xy / resolution.y) * ZOOM_OUT;

            float min_dist = 1.0;

            for (int i = 0; i < CELL_COUNT; i++) {
                float dist = distance(center, voronoiCells[i]);

                // Keep the closer distance
                min_dist = min(min_dist, dist);
            }

            cellColor -= min_dist;

            gl_FragColor = vec4(cellColor, 1.0);
        }
    `,
    onFrame: ({ uniforms, mousePosition }) => {
        uniforms.time.value += 0.001;
        uniforms.mousePosition.value = lerpVector(
            uniforms.mousePosition.value,
            mousePosition,
            0.15
        );
    },
});

const S251120 = () => <ShaderRenderer sketch={sketch} />;

export default S251120;
