import glsl from "glslify";
import React from "react";

import { ShaderRenderer, ShaderSetupFn } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
    uniforms: {
        aspect: { value: aspect },
        time: { value: inRange(10000), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [0, 0], type: "2f" },
    },
    frag: glsl`
        precision highp float;

        #pragma glslify: noise = require("glsl-noise/simplex/2d");

        varying vec2 vUv;

        uniform float time;
        uniform float aspect;
        uniform vec2 resolution;
        uniform vec2 mousePosition;

        void main () {
            vec2 center = vUv;
            center.x *= aspect;
            
            vec3 color = vec3(0.0);

            // Cell positions
            vec2 voronoiCells[6];
            voronoiCells[0] = vec2(0.5 * aspect + noise(vec2(time / 1.2)), 0.5 + noise(vec2(time / 1.0)));
            voronoiCells[1] = vec2(0.5 * aspect + noise(vec2(time / 1.7)), 0.5 + noise(vec2(time / 1.3)));
            voronoiCells[2] = vec2(0.5 * aspect + noise(vec2(time / 2.1)), 0.5 + noise(vec2(time / 1.7)));
            voronoiCells[3] = vec2(0.5 * aspect + noise(vec2(time / 1.0)), 0.5 + noise(vec2(time / 1.1)));
            voronoiCells[4] = vec2(0.5 * aspect + noise(vec2(time / 0.8)), 0.5 + noise(vec2(time / 1.9)));
            voronoiCells[5] = mousePosition.xy / resolution.y;

            float min_dist = 1.0;

            for (int i = 0; i < 6; i++) {
                float dist = distance(center, voronoiCells[i]);

                // Keep the closer distance
                min_dist = min(min_dist, dist);
            }

            // Draw the min distance
            color += min_dist;

            // Show isolines
            // color -= step(0.7, abs(sin(50.0 * min_dist))) * 0.3;

            gl_FragColor = vec4(color, 1.0);
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

const S121120 = () => <ShaderRenderer sketch={sketch} />;

export default S121120;
