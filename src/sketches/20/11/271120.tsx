import glsl from "glslify";
import React from "react";

import { ShaderRenderer, ShaderSetupFn } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange, pick } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

import { s251120NiceColors } from "./251120";

const sketch: ShaderSetupFn = ({ width, height }) => ({
    uniforms: {
        time: { value: inRange(10000), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [width / 2, height / 2], type: "2f" },
        color: { value: hexToVec3(pick(s251120NiceColors)), type: "3f" },
    },
    frag: glsl`
        precision highp float;

        #pragma glslify: noise = require("glsl-noise/simplex/2d");
        #pragma glslify: filmGrain = require("../../utils/shaders/filmGrain.frag");

        varying vec2 vUv;

        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mousePosition;
        uniform vec3 color;

        void main () {
            const int CELL_COUNT = 5;
            const float ZOOM_OUT = 1.1;

            vec2 center = vUv - 0.5;
            center *= ZOOM_OUT;

            float xStart = resolution.x > resolution.y ? 0.5 : center.x;
            float yStart = resolution.x > resolution.y ? center.y : 0.5;

            vec3 cellColor = color;

            vec2 voronoiCells[CELL_COUNT];
            voronoiCells[0] = vec2(xStart + noise(vec2(time / 1.2)), yStart + noise(vec2(time / 1.0)));
            voronoiCells[1] = vec2(xStart + noise(vec2(time / 1.7)), yStart + noise(vec2(time / 1.3)));
            voronoiCells[2] = vec2(xStart + noise(vec2(time / 2.1)), yStart + noise(vec2(time / 1.7)));
            voronoiCells[3] = vec2(xStart + noise(vec2(time / 1.0)), yStart + noise(vec2(time / 1.1)));
            voronoiCells[CELL_COUNT - 1] = mousePosition / resolution;

            float min_dist = 1.0;

            for (int i = 0; i < CELL_COUNT; i++) {
                float dist = distance(vUv, voronoiCells[i]);
                min_dist = min(min_dist, dist);
            }

            float grainAmount = filmGrain(vUv * time) * 0.1;
            cellColor -= min_dist * 2.0 - grainAmount;

            gl_FragColor = vec4(cellColor - noise(vUv + (time * 1.5)) * 0.8, 1.0);
        }
    `,
    onFrame: ({ uniforms, mousePosition, mouseHasEntered }) => {
        uniforms.time.value += 0.004;
        uniforms.mousePosition.value = mouseHasEntered
            ? lerpVector(uniforms.mousePosition.value, mousePosition, 0.2)
            : uniforms.mousePosition.value;
    },
});

const S271120 = () => <ShaderRenderer sketch={sketch} />;

export default S271120;
