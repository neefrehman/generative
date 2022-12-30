import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ aspect }) => ({
  uniforms: {
    aspect: { value: aspect },
    time: { value: inRange(100) },
  },
  frag: glsl`
        precision highp float;

        #pragma glslify: noise = require("glsl-noise/simplex/3d");

        uniform float time;
        uniform float aspect;
        varying vec2 vUv;

        void main() {
            vec2 center = vUv - 0.5;
            center.x *= aspect;

            float n = noise(vec3(center, time));

            gl_FragColor = vec4(vec3(n), 1.0);
        }
    `,
  onFrame: ({ uniforms }) => {
    uniforms.time.value += 0.01;
  },
});

const S011120 = () => <ShaderRenderer sketch={sketch} />;

export default S011120;
