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

        #define PI 3.1415926538
        #define TWO_PI 6.28318530718        

        uniform float time;
        uniform vec2 resolution;

        mat2 rotation2d(float angle) {
          float s = sin(angle);
          float c = cos(angle);

	        return mat2(
		        c, -s,
		        s,  c
	        );
        }        

        vec2 rotate(vec2 v, float angle) {
          return rotation2d(angle) * v;
        }               

        vec3 cospalette(float t) {
          vec3 brightness = vec3(1.0, 0.8, 1.0);
          vec3 contrast = vec3(1.0, 0.9, 0.8);
          vec3 oscillation = vec3(1.0, 1.0, 1.0);
          vec3 phase = vec3(1);

          return brightness + contrast * cos(6.28318 * (oscillation * t + phase));
        }     

        float random(vec2 st) { 
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }        

        float map(float value, float inMin, float inMax, float outMin, float outMax) {
          return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }        

        #define NUM_OCTAVES 5

        float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

        float noise(vec3 p){
          vec3 a = floor(p);
          vec3 d = p - a;
          d = d * d * (3.0 - 2.0 * d);

          vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
          vec4 k1 = perm(b.xyxy);
          vec4 k2 = perm(k1.xyxy + b.zzww);

          vec4 c = k2 + a.zzzz;
          vec4 k3 = perm(c);
          vec4 k4 = perm(c + 1.0);

          vec4 o1 = fract(k3 * (1.0 / 41.0));
          vec4 o2 = fract(k4 * (1.0 / 41.0));

          vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
          vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

          return o4.y * d.y + o4.x * (1.0 - d.y);
        }

        float fbm(vec3 x) {
          float v = 0.0;
          float a = 0.5;
          vec3 shift = vec3(100);
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }          

        void main() {
          float t = time * 0.5;
          vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y * 1.5;

          vec2 uv2 = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y * 1.5;          

          uv = fract(uv * 6.75) - 0.5;
          vec2 id = floor(uv2 * 6.75);
          float rid = random(id);
          rid = map(rid, 0.0, 1.0, -TWO_PI, TWO_PI);          

          uv += vec2(
            cos(t + length(uv2) * 15.0 + rid),
            sin(t + length(uv2) * 15.0 + rid)
          ) * 0.25;

          float angle = sin(length(uv) * 1.);
          uv = rotate(uv, angle * 10.0 - t * 2.0 + rid);
          vec2 puv = vec2(length(uv), atan(uv.x, uv.y));

          float fb = fbm(vec3(uv, puv.x));
          float x = map(sin(puv.x * 2.0 + fb + t), -1.0, 1.0, 0.0, 1.0);
          x = sin(puv.x * 1.0 + fb * 3.5 + t + PI * 1.49 + rid) * 0.5;
          vec3 color = cospalette(x);        

          gl_FragColor = vec4(color, 1);
      }
    `,
  onFrame: ({ uniforms }) => {
    uniforms.time.value += 0.01;
  },
});

const S010121 = () => <ShaderRenderer sketch={sketch} />;

export default S010121;
