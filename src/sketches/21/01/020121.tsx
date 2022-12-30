// From Akella's raymarching tutorial: https://youtu.be/q2WcGi3Cr9w

import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { inRange, pick } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
  uniforms: {
    aspect: { value: aspect },
    time: { value: inRange(10000), type: "1f" },
    resolution: { value: [width, height], type: "2f" },
    mousePosition: { value: [width / 2, height / 2], type: "2f" },
    colorToMix: {
      value: hexToVec3(pick(["#b94efc", "#4eb9fc", "#714efc", "#f32d94"])),
      type: "3f",
    },
    mixAmount: { value: inRange(0.45, 0.75), type: "1f" },
    baseOffset: { value: inRange(3, 300), type: "1f" },
  },
  frag: glsl`
        precision highp float;

        #pragma glslify: rotate = require("../../utils/shaders/rotate.glsl");
        #pragma glslify: smin = require("../../utils/shaders/smin/poly.glsl");
        #pragma glslify: filmGrain = require("../../utils/shaders/grain.glsl");
        #pragma glslify: randomFloat = require("../../utils/shaders/randomFloat.glsl");

        #define PI 3.1415

        varying vec2 vUv;

        uniform float time;
        uniform float aspect;
        uniform vec2 resolution;
        uniform vec2 mousePosition;
        uniform vec3 colorToMix;
        uniform float mixAmount;
        uniform float baseOffset;

        float sdSphere(vec3 pos, float r) {
            return length(pos) - r;
        }

        float sdBox(vec3 pos, vec3 b) {
            vec3 q = abs(pos) - b;
            return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
        }

        float sdf(vec3 pos) {
            vec3 p1 = rotate(pos, vec3(1.0), time * 1.5);
            float box = smin(sdBox(p1, vec3(0.3 - sin(time * 3.0) * 0.04)), sdSphere(p1, 0.35 - sin(time * 3.0) * 0.04), 0.25 + sin(time * 4.0) * 0.05);
            float realSphere = sdSphere(p1, 0.45);
            float final = mix(box, realSphere, 0.0);

            for (float i = 0.0; i < 12.0; i++) {
                float randomOffset = randomFloat(vec2(i, 0.0)) * baseOffset;
                float progress = 1.0 - fract((time * 0.18 * i) + randomOffset);

                vec3 spherePos = vec3(
                    sin(randomOffset * 2.0 * PI),
                    cos(randomOffset * 2.0 * PI), 
                    0.0
                ) * 2.0 * progress;

                float goToCenter = sdSphere(pos - spherePos, 0.12);
                final = smin(final, goToCenter, 0.3);
            } 

            float mouseSphere = sdSphere(pos - vec3(vec2(mousePosition / resolution - 0.5) * 2.5, 0.0), 0.25 + sin(time * 3.0) * 0.01);
            return smin(final, mouseSphere, 0.4);
        }

        vec3 getNormal(vec3 pos) {
            const float eps = 0.0001;
            const vec2 h = vec2(eps, 0.0);
            return normalize(vec3(
                sdf(pos + h.xyy) - sdf(pos - h.xyy),
                sdf(pos + h.yxy) - sdf(pos - h.yxy),
                sdf(pos + h.yyx) - sdf(pos - h.yyx)
            ));
        }

        vec2 getMatcap(vec3 eye, vec3 normal) {
            vec3 reflected = reflect(eye, normal);
            float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
            return reflected.xy / m + 0.5;
        }

        void main () {
            float dist = length(vUv - vec2(0.5));
            vec3 bg = mix(vec3(0.2), vec3(0.0), dist);
            vec2 pos = vUv - 0.5;
            pos.x *= aspect;

            vec3 camPos = vec3(0.0, 0.0, 2.0);
            vec3 ray = normalize(vec3(pos, -1));

            vec3 currentRayPos = camPos;
            float t = 0.0;
            float tMax = 2.5;

            for (int i = 0; i < 128; ++i) {
                vec3 currentPos = camPos + (t * ray);
                float h = sdf(currentPos);
                if (h < 0.0001 || t > tMax) break;
                t += h;
            }

            vec3 color = bg;

            if (t < tMax) {
                vec3 currentPos = camPos + (t * ray);
                vec3 normal = getNormal(currentPos);
                float diff = dot(vec3(1.0), normal);

                vec2 matcapUv = getMatcap(ray, normal);
                color = mix(vec3(matcapUv, 0.0), colorToMix, mixAmount);

                float fresnel = pow(1.0 + dot(ray, normal), 5.0);

                color = mix(color, vec3(0.7), fresnel);
            }

            float grainAmount = filmGrain(vUv * time) * 0.055;
            gl_FragColor = vec4(color - grainAmount, 1.0);
        }
    `,
  onFrame: ({ uniforms, mousePosition, mouseIsIdle }) => {
    uniforms.time.value += 0.007;

    uniforms.mousePosition.value = lerpVector(
      uniforms.mousePosition.value,
      !mouseIsIdle ? mousePosition : [width / 2, height / 2],
      0.15
    );
  },
});

const S020121 = () => <ShaderRenderer sketch={sketch} />;

export default S020121;
