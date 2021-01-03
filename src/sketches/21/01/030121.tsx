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
        time: { value: inRange(200, 600), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [width / 2, height / 2], type: "2f" },
        baseOffset: { value: Math.random(), type: "1f" },
        colorToMix: {
            value: hexToVec3(
                pick(["#76ffbd", "#b94efc", "#4eb9fc", "#714efc", "#f32d94"])
            ),
            type: "3f",
        },
    },
    frag: glsl`
        precision highp float;

        #pragma glslify: noise = require("glsl-noise/simplex/3d");
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
        uniform float baseOffset;

        float sdSphere(vec3 pos, float r) {
            return length(pos) - r;
        }

        float sdBox(vec3 pos, vec3 b) {
            vec3 q = abs(pos) - b;
            return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
        }

        float sdf(vec3 pos) {
            vec3 p1 = rotate(pos, vec3(1.0), time * 2.0);
            float box = sdBox(p1, vec3(0.27));
            float sphere = sdSphere(pos - vec3(vec2(mousePosition / resolution - 0.5) * 3.0, 0.0), 0.36);
            float final = mix(box, sphere, 0.0);

            for (float i = 0.0; i < 6.0; i++) {
                float randomOffset = randomFloat(vec2(i, 0.0)) - baseOffset;

                vec3 spherePos = vec3(
                    noise(vec3(vec2(time * randomOffset * 1.2), 0.0)),
                    noise(vec3(vec2(time * randomOffset * 1.0), 0.0)), 
                    0.0
                ) * 1.5;

                float newSphere = sdSphere(pos - spherePos, 0.15);
                final = smin(final, newSphere, 0.3);
            } 

            return smin(final, sphere, 0.25);
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

        void main () {
            vec2 pos = vUv - 0.5;
            pos.x *= aspect;

            vec3 camPos = vec3(0.0, 0.0, 2.0);
            vec3 ray = normalize(vec3(pos, -1));

            vec3 currentRayPos = camPos;
            float t = 0.0;
            float tMax = 2.0;

            for (int i = 0; i < 128; ++i) {
                vec3 currentPos = camPos + (t * ray);
                float h = sdf(currentPos);
                if (h < 0.0001 || t > tMax) break;
                t += h;
            }

            vec3 color = vec3(0.0);
            float grainAmount = filmGrain(vUv * time) * 0.1;

            if (t < tMax) {
                vec3 currentPos = camPos + (t * ray);
                vec3 normal = getNormal(currentPos * time * grainAmount * 0.5);
                float diff = dot(vec3(1.0), normal);

                float fresnel = pow(1.0 + dot(ray, normal), 5.0);
                color = vec3(fresnel);
                color = mix(color, colorToMix, 0.2);

                color = mix(color, vec3(0.5), fresnel);
            }

            gl_FragColor = vec4(color - grainAmount, 1.0);
        }
    `,
    onFrame: ({ uniforms, mousePosition, mouseIsIdle }) => {
        uniforms.time.value += 0.005;

        uniforms.mousePosition.value = lerpVector(
            uniforms.mousePosition.value,
            !mouseIsIdle ? mousePosition : [width / 2, height / 2],
            0.1
        );
    },
});

const S010121 = () => <ShaderRenderer sketch={sketch} />;

export default S010121;
