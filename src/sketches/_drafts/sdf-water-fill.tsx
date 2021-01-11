import glsl from "glslify";
import React from "react";

import type { ShaderRendererSettings, ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { inRange } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";
import { lerp, mapToRange, lerpVector, getMean } from "Utils/math";

const pixelation = 1.4;

const settings: ShaderRendererSettings = {
    dimensions: [window.innerWidth / pixelation, window.innerHeight / pixelation],
};

const sketch: ShaderSetupFn = ({ width, height, aspect }) => {
    const actualWidth = width * pixelation;
    const actualHeight = height * pixelation;

    let prevMouseXs: number[] = new Array(50).fill(actualWidth / 2);

    return {
        uniforms: {
            aspect: { value: aspect },
            time: { value: inRange(200, 600), type: "1f" },
            resolution: { value: [actualWidth, actualHeight], type: "2f" },
            mousePosition: {
                value: [actualWidth / 2, actualHeight / 2],
                type: "2f",
            },
            baseShape: {
                value: inRange(0, 2, { isInteger: true }),
                type: "1i",
            },
            colorStart: { value: hexToVec3("#ffffff"), type: "3f" },
            colorEnd: { value: hexToVec3("#0088ff"), type: "3f" },
            noiseScale: { value: inRange(5, 8), type: "1f" },
            mouseXDifferential: { value: 1, type: "1f" },
        },
        frag: glsl`
            precision highp float;

            #pragma glslify: noise = require("glsl-noise/simplex/4d");
            #pragma glslify: rotate = require("../utils/shaders/rotate.glsl");
            #pragma glslify: filmGrain = require("../utils/shaders/grain.glsl");

            #define PI 3.1415
            #define TAU 2.0 * PI

            varying vec2 vUv;

            uniform float time;
            uniform float aspect;
            uniform vec2 resolution;
            uniform vec2 mousePosition;
            uniform vec3 colorStart;
            uniform vec3 colorEnd;
            uniform float noiseScale;
            uniform float mouseXDifferential;

            uniform int baseShape;

            #pragma glslify: sdSphere = require("../utils/shaders/sdShapes/3d/sdSphere.glsl");
            #pragma glslify: sdCuboid = require("../utils/shaders/sdShapes/3d/sdCuboid.glsl");
            #pragma glslify: sdCappedCone = require("../utils/shaders/sdShapes/3d/sdCappedCone.glsl");

            float sineNoise(vec3 pos) {
                return 
                    pos.y - 0.5 +
                    noise(vec4(vec3(pos.x * 0.6, sin(pos.y * 4.0), pos.z * 0.13), time * 22.0)) / 2.5;
            }

            float sdf(vec3 pos) {
                vec3 p1 = rotate(pos, vec3(0.0, 1.0, 0.0), time);

                float shape = 0.0;

                if (baseShape == 0) {
                    shape = sdSphere(p1, 0.5);
                } else if (baseShape == 1) {
                    shape = sdCappedCone(p1, 0.45, 0.5, 0.4);
                } else if (baseShape == 2) {
                    shape = sdCuboid(p1, vec3(0.4));
                }
                
                float wobble = (sin(time * 100.0) * 0.066) * mouseXDifferential;
                vec3 p2 = rotate(pos, vec3(0.0, 1.0, wobble), (-time - mousePosition.x / (resolution.x * 5.0) * TAU));
                float sineNoiseValue = (0.83 - sineNoise((p2 + vec3(0.0, 0.2, 0.0)) * noiseScale)) / noiseScale * 3.0;

                return max(shape, sineNoiseValue);
            }

            vec3 getColor(vec3 pos) {
                float amount = clamp((1.5 - length(pos)) / 2.3, 0.0, 1.0);
                vec3 color = 0.588 + 0.708 * cos(TAU * (colorStart + amount * colorEnd));

                return color * amount;
            }

            void main()	{
                vec2 uv = vUv * vec2(aspect, 1.0) + vec2((1.0 - aspect) / 2.0, 0.0);
            
                vec3 camPos = vec3(0.0, -0.25, 2.0);
                vec2 pos = uv - vec2(0.5);
                vec3 ray = normalize(vec3(pos, -1.0));

                vec3 currentRayPos = camPos;
                float curDist = 0.0;
                float rayLength = 0.0;

                vec3 finalColor = vec3(0.8);

                for (int i = 0; i <= 24; i++) {
                    curDist = sdf(currentRayPos);
                    rayLength +=  0.536 * curDist;
                    currentRayPos = camPos + ray * rayLength;

                    if (curDist < 0.001) {
                        finalColor = mix(vec3(1.0), colorEnd, 0.9);
                    }
                    
                    if (curDist < 0.001 || curDist > 2.0) {
                        break;
                    }

                    finalColor -= (0.082 * getColor(currentRayPos));
                }

                vec3 color = finalColor;

                if (curDist > 0.1) {
                    color = max(finalColor, 0.0);
                }

                float grainAmount = filmGrain(vUv * time) * 0.05;
                gl_FragColor = vec4(color - grainAmount, 1.0);
            }
        `,
        onFrame: ({ uniforms, mousePosition, mouseHasEntered }) => {
            uniforms.time.value += 0.0004;

            const currentMouseX = mouseHasEntered
                ? mousePosition[0]
                : prevMouseXs[48];

            prevMouseXs.shift();
            prevMouseXs = [...prevMouseXs, currentMouseX];

            const mouseXDifferential = Math.abs(
                getMean(prevMouseXs) - currentMouseX
            );
            const mappedMouseXDifferential = mapToRange(
                mouseXDifferential,
                0,
                width,
                0.35,
                2.2,
                { clamp: true }
            );

            uniforms.mouseXDifferential.value = lerp(
                uniforms.mouseXDifferential.value,
                mappedMouseXDifferential,
                0.01
            );

            uniforms.mousePosition.value = lerpVector(
                uniforms.mousePosition.value,
                mouseHasEntered ? mousePosition : uniforms.mousePosition.value,
                0.15
            );
        },
    };
};

const S120121 = () => (
    <ShaderRenderer
        sketch={sketch}
        settings={settings}
        style={{ width: "100%", height: "100vh" }}
    />
);

export default S120121;
