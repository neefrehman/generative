import glsl from "glslify";
import React from "react";

import { ShaderRenderer } from "Renderers/WebGL";
import type { ShaderSetupFn } from "Renderers/WebGL";

const sketch: ShaderSetupFn = () => ({
  uniforms: {
    time: { value: 0, type: "1f" },
  },
  frag: glsl`
        precision highp float;
        varying vec2 vUv;
        uniform float time;
        void main () {
            vec2 center = vec2(0.5);
            vec2 pos = mod(vUv * 8.0, 1.0);
            float dist = distance(pos, center);
            float mask = step(0.25 + sin(time * vUv.x) * 0.25, dist);
            mask = 1.0 - mask;

            gl_FragColor = vec4(vec3(mask), 0.5);
        }
    `,
  onFrame: ({ uniforms }) => {
    uniforms.time.value += 1;
  },
});

const S081120 = () => <ShaderRenderer sketch={sketch} />;

export default S081120;
