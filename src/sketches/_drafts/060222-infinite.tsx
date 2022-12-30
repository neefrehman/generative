// From Akella's raymarching tutorial: https://youtu.be/q2WcGi3Cr9w

import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange } from "Utils/random";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
  uniforms: {
    time: { value: inRange(10000), type: "1f" },
    resolution: { value: [width, height], type: "2f" },
    dO: { value: [0, 0], type: "2f" },
    seed: { value: inRange(10000), type: "1f" },
    scale: { value: 4, type: "1f" },
    aspect: { value: aspect, type: "1f" },
    portrait: { value: 0.1, type: "1f" },
    pixRatio: { value: window.devicePixelRatio, type: "1f" },
  },
  // TODO: just get one render?
  frag: glsl`
        precision highp float;

      #define TWO_PI 6.28318531
      #define PI 3.1416
      #define HASHSCALE3 vec3(.1031, .1030, .0973)
        uniform vec2 resolution;
        uniform float seed;
        uniform vec2 dO;
        uniform float time, pixRatio, scale, aspect, portrait;

        float v(vec2 v) {
          return v = 50. * fract(v * .31831 + vec2(.71, .113)), -1. + 2. * fract(v.r * v.g * (v.r + v.g));
        }
        float t(in vec2 d) {
          vec2 r = floor(d), t = fract(d), i = t * t * (3. - 2. * t);
          return mix(mix(v(r + vec2(0., 0.)), v(r + vec2(1., 0.)), i.r), mix(v(r + vec2(0., 1.)), v(r + vec2(1., 1.)), i.r), i.g);
        }
        vec3 f(vec3 v) {
          return mod((v * 34. + 1.) * v, 289.);
        }
        float d(vec2 v) {
          const vec4 s = vec4(.211325, .366025, -.57735, .0243902);
          vec2 r = floor(v + dot(v, s.gg)), d = v - r + dot(r, s.rr), t;
          t = d.r > d.g ? vec2(1., 0.) : vec2(0., 1.);
          vec4 i = d.rgrg + s.rrbb; i.rg -= t; r = mod(r, 289.);
          vec3 e = f(f(r.g + vec3(0., t.g, 1.)) + r.r + vec3(0., t.r, 1.)), g = max(.5 - vec3(dot(d, d), dot(i.rg, i.rg), dot(i.ba, i.ba)), 0.);
          g = g * g; g = g * g;
          vec3 m = 2. * fract(e * s.aaa) - 1., a = abs(m) - .5, p = floor(m + .5), b = m - p;
          g *= 1.79284 - .853735 * (b * b + a * a);
          vec3 n; n.r = b.r * d.r + a.r * d.g; n.gb = b.gb * i.rb + a.gb * i.ga;
          return 130. * dot(g, n);
        }
        vec2 d(vec2 v, float i) {
          if (portrait == 1.) return vec2(t(vec2(v.r, i)), t(vec2(v.g, i)));
          else return vec2(d(vec2(v.r, i)), d(vec2(v.g, i)));
        }
        vec2 f(vec2 v, vec2 d) {
          return vec2(v.r * d.r + v.g * d.g, v.g * d.r - v.r * d.g) / dot(d, d);
        }
        vec2 x(vec2 v) {
          vec3 r = fract(vec3(v.rgr) * HASHSCALE3);
          r += dot(r, r.gbr + 19.19);
          return fract((r.rr + r.gb) * r.bg);
        }
        highp float s(vec2 v) {
          highp float r = 12.9898, d = 78.233, i = 43758.5, t = dot(v.rg, vec2(r, d)), g = mod(t, 3.14);
          return fract(sin(g) * i);
        }
        vec3 d(in float v, in vec3 r, in vec3 g, in vec3 e, in vec3 d) {
          return r + g * cos(6.28318 * (e * v + d));
        }
        void main() {
          vec2 v = (gl_FragCoord.rg - .5 * resolution) / resolution.g, t = mix(vec2(1., aspect), vec2(aspect, 1.), portrait); v *= t; v /= pixRatio;
          vec2 r = vec2(dO.r, resolution.g - dO.g) / resolution.g + vec2(0., -1.); v -= r;
          vec2 g; v = (v + r) * scale - r; g = floor(v); v = fract(v); v /= t;
          float i = mix(.001, .005, portrait);
          vec2 e = d(g, time * i + seed) * .5 + .5, a = d(g, time * i + 9999. + seed) * .5 + .5, p = d(g, time * i + 6969. + seed) * .5 + .5, b = d(g, time * i + 4242. + seed) * .5 + .5, o = d(g + 999., time * i + 111. + seed) * .5 + .5, n = d(g + 6969., time * i + 555. + seed) * .5 + .5, m = d(g + 4242., time * i + 4242. + seed) * .5 + .5, x = d(g + 111., time * i + 6969. + seed) * .5 + .5, u; u = f(v - e, v - a) * f(v - p, v - b);
          u = mix(u, f(v - o, v - n) * f(v - m, v - x), d(vec2(time * .0025 + g.r * g.g * 69.42 + seed)));
          float H = atan(u.g, u.r) / TWO_PI;
          vec3 P = d(H - time * .005 + g.r * g.g * s(g) + seed, vec3(.5), vec3(.5), vec3(1.), vec3(s(g * 3.), .1 + s(g), .2 + s(g * 2.)));
          gl_FragColor = vec4(P, 1.);
        }
    `,
  onFrame: ({ uniforms, elapsedTime, mousePosition }) => {
    uniforms.time.value = elapsedTime / 12;
    uniforms.dO.value = lerpVector(uniforms.dO.value, mousePosition, 0.1);
  },
});

const S010121 = () => <ShaderRenderer sketch={sketch} />;

export default S010121;
