import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = () => ({
  uniforms: {
    time: { value: inRange(10000), type: "1f" },
  },
  frag: glsl`
        precision highp float;

        #pragma glslify: noise = require("glsl-noise/simplex/2d");
        
        #define PI 3.1415;

        uniform float time;

        varying vec2 vUv;

        void main () {
            vec3 color = vec3(0.0);
            vec2 pos = vec2(vUv * 3.0);

            float DF = 0.0;

            float a = 0.0;
            vec2 vel = vec2(time * 0.1);
            DF += noise(pos + vel) * 0.25 + 0.25;

            a = noise(pos * vec2(cos(time), sin(time)) * 0.1) * PI;
            vel = vec2(cos(a), sin(a));
            DF += noise(pos + vel) * 0.25 + 0.25;

            color = vec3(smoothstep(0.7, 0.75, fract(DF)));

            gl_FragColor = vec4(1.0 - color, 1.0);
        }
    `,
  onFrame: ({ uniforms }) => {
    uniforms.time.value += 0.008;
  },
});

const S111120 = () => <ShaderRenderer sketch={sketch} />;

export default S111120;
