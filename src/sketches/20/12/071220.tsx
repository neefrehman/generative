import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
    uniforms: {
        aspect: { value: aspect },
        time: { value: inRange(10000), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [width / 2, height / 2], type: "2f" },
    },
    frag: glsl`
        precision highp float;

        #pragma glslify: worley2x2x2 = require("glsl-worley/worley3D.glsl");

        varying vec2 vUv;

        uniform float time;
        uniform float aspect;
        uniform vec2 resolution;
        uniform vec2 mousePosition;

        void main () {
            vec2 pos = vUv;
            pos *= 15.0;
            pos.x *= aspect;

            float mouseXDec = mousePosition.x / resolution.x;
            float jitter = mouseXDec * 2.0;

            float mouseYDec = mousePosition.y / resolution.y;
            float blurriness = (mouseYDec / 4.0) + 0.01;

            vec2 F = worley2x2x2(vec3(pos, time), jitter, false);
            float n = smoothstep(0.4, 0.4 + blurriness, F.x);
            gl_FragColor = vec4(n, n, n, 0.1);
        }
    `,
    onFrame: ({ uniforms, mousePosition, mouseHasEntered }) => {
        uniforms.time.value += 0.02;

        uniforms.mousePosition.value = mouseHasEntered
            ? lerpVector(uniforms.mousePosition.value, mousePosition, 0.2)
            : uniforms.mousePosition.value;
    },
});

const S271120 = () => <ShaderRenderer sketch={sketch} />;

export default S271120;
