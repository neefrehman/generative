import glsl from "glslify";
import React from "react";

import { ShaderRenderer, ShaderSetupFn } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ width, height }) => ({
    uniforms: {
        time: { value: inRange(10000), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [0, 0], type: "2f" },
    },
    frag: glsl`
        precision highp float;   

        varying vec2 vUv;

        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mousePosition;

        void main () {
            vec3 color = vec3(0.0);

            // Cell positions
            vec2 point[5];
            point[0] = vec2(0.83, 0.75);
            point[1] = vec2(0.60, 0.07);
            point[2] = vec2(0.28, 0.64);
            point[3] = vec2(0.31, 0.26);
            point[4] = mousePosition / resolution;

            float m_dist = 1.0; // minimum distance

            for (int i = 0; i < 5; i++) {
                float dist = distance(vUv, point[i]);

                // Keep the closer distance
                m_dist = min(m_dist, dist);
            }

            // Draw the min distance (distance field)
            color += m_dist;

            // Show isolines
            // color -= step(0.7, abs(sin(50.0 * m_dist))) * 0.3;

            gl_FragColor = vec4(color, 1.0);
        }
    `,
    onFrame: ({ uniforms, mousePosition }) => {
        uniforms.time.value += 0.01;
        uniforms.mousePosition.value = lerpVector(
            uniforms.mousePosition.value,
            mousePosition,
            0.15
        );
    },
});

const S121120 = () => <ShaderRenderer sketch={sketch} />;

export default S121120;
