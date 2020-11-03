import glsl from "glslify";
import React from "react";

import { ShaderRenderer, ShaderSetupFn } from "Renderers/Shader";

import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ aspect }) => ({
    uniforms: {
        aspect: { value: aspect, type: "1f" },
        time: { value: inRange(100), type: "1f" },
    },
    frag: glsl`
        precision highp float;
        #pragma glslify: noise = require("glsl-noise/simplex/3d");
        #pragma glslify: hsl2rgb = require("glsl-hsl2rgb");

        uniform float time;
        uniform float aspect;
        varying vec2 vUv;

        void main() {
            vec2 center = vUv - 0.5;
            center.y *= aspect;
            float dist = length(center);
            // float alpha = smoothstep(0.255, 0.25, dist);

            float n = noise(vec3(center * 1.8, time));
            vec3 color = dist > 0.37
                ? vec3(1.0)
                : hsl2rgb(0.75 + n * 0.15, 0.5, 0.5);

            gl_FragColor = vec4(color, 1.0);
        }

        // void main() {
        //     vec2 center = vUv - 0.5;
        //     center.x *= aspect;

        //     float n = noise(vec3(center, time));

        //     gl_FragColor = vec4(vec3(n), 1.0);
        // }
    `,
    onFrame: ({ uniforms }) => {
        uniforms.time.value += 0.01;
    },
});

const DThreeRendererTest = () => <ShaderRenderer sketch={sketch} />;

export default DThreeRendererTest;
