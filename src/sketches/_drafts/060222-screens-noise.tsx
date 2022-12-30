// From Akella's raymarching tutorial: https://youtu.be/q2WcGi3Cr9w

import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ width, height }) => ({
  uniforms: {
    time: { value: inRange(10000), type: "1f" },
    resolution: { value: [width, height], type: "2f" },
    zoom: { value: inRange(4, 16, { isInteger: true }), type: "1f" },
    xSpeed: { value: 0.2, type: "1f" },
    ySpeed: { value: 0.5, type: "1f" },
  },
  frag: glsl`
        precision highp float;

        varying vec2 vUv;

        uniform vec2 resolution;
        uniform float time;
        uniform float zoom;
        uniform float xSpeed;
        uniform float ySpeed;
        const float PI = 3.141592654;
        
        float lowcostnoise(vec3 p) {
            return mix(
                sin(1. + p.x + float(1.4 * p.z) + p.y),
                sin(p.x + float(2.4 * p.y) + p.z) * cos(p.y + sin(3.5 * p.x) + p.z), 
                .5 + .5 * sin(4. * p.x + sin(p.y * .2) * 2. + p.z) * cos(3. * p.y + sin(p.y * .3 + p.x * .4) * 2.)
            );
        }
        
        void main() { 
            vec2 aspect = vec2(resolution.x / resolution.y, 1.);
            vec2 p0 = vUv.xy * aspect * zoom;
            vec2 p = mod(p0, 1.);
            float border = smoothstep(.0,.1,sin(p.x * PI) * sin(p.y * PI));
            vec2 k = floor(p0) * 2.;
            float n = lowcostnoise(vec3(p.xy, time + k.x * xSpeed + k.y * ySpeed));
            vec3 color = border * vec3(smoothstep(.4, .5,n),0.,smoothstep(0.,.1, n) * .5);
            gl_FragColor = vec4(color,1.);
        }
    `,
  onFrame: ({ uniforms }) => {
    uniforms.time.value += 0.01;
  },
});

const S010121 = () => <ShaderRenderer sketch={sketch} />;

export default S010121;
