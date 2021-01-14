import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerp, lerpVector } from "Utils/math";
import {
    createHex,
    inBeta,
    inGaussian,
    inRange,
    inSquare,
    pick,
} from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => {
    let idleMousePosition = inSquare(width, height);

    const initialPlaybackSpeed = inRange(0.00016, 0.0002);
    let playbackSpeed = initialPlaybackSpeed;

    return {
        uniforms: {
            aspect: { value: aspect },
            time: { value: inRange(100, 1000), type: "1f" },
            resolution: { value: [width, height], type: "2f" },
            mousePosition: { value: [0, height], type: "2f" },

            bgBrightness: { value: inBeta(1, 3) * 0.056, type: "1f" },
            colorStart: { value: hexToVec3(createHex()), type: "3f" },
            colorEnd: { value: hexToVec3(createHex()), type: "3f" },

            sinNoiseScale: { value: inRange(3.5, 9), type: "1f" },
            simplexNoiseScale: {
                value: 2 + inBeta(1, 3) * 50,
                type: "1f",
            },
            simplexIntensity: { value: inRange(0.5, 10), type: "1f" },
            noiseStyle: { value: pick([0, 1]), type: "1i" },
            grainIntensity: { value: inRange(0, 0.038), type: "1f" },

            baseShape: {
                value: inRange(0, 7, { isInteger: true }),
                type: "1i",
            },
            shapeDimension1: { value: inRange(0.4, 0.54), type: "1f" },
            shapeDimension2: { value: inRange(0.2, 0.36), type: "1f" },
            shapeDimension3: { value: inRange(0.32, 0.41), type: "1f" },
            shapePositionOffsetOffset: {
                value: [
                    inGaussian(0, 0.08) * aspect,
                    inGaussian(0, 0.08),
                    (inBeta(1.8, 5) - 0.1) * 0.4,
                ],
                type: "3f",
            },
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

            uniform float bgBrightness;
            uniform vec3 colorStart;
            uniform vec3 colorEnd;

            uniform int noiseStyle;
            uniform float sinNoiseScale;
            uniform float simplexNoiseScale;
            uniform float simplexIntensity;
            uniform float grainIntensity;

            uniform int baseShape;
            uniform float shapeDimension1;
            uniform float shapeDimension2;
            uniform float shapeDimension3;
            uniform vec3 shapePositionOffset;
            
            #pragma glslify: sdEllipsoid = require("../utils/shaders/sdShapes/3d/sdEllipsoid.glsl");
            #pragma glslify: sdSphere = require("../utils/shaders/sdShapes/3d/sdSphere.glsl");
            #pragma glslify: sdCuboid = require("../utils/shaders/sdShapes/3d/sdCuboid.glsl");
            #pragma glslify: sdOctahedron = require("../utils/shaders/sdShapes/3d/sdOctahedron.glsl");
            #pragma glslify: sdTorus = require("../utils/shaders/sdShapes/3d/sdTorus.glsl");
            #pragma glslify: sdCone = require("../utils/shaders/sdShapes/3d/sdCone.glsl");
            #pragma glslify: sdCappedCone = require("../utils/shaders/sdShapes/3d/sdCappedCone.glsl");
            #pragma glslify: sdPyramid = require("../utils/shaders/sdShapes/3d/sdPyramid.glsl");

            float sineNoise(vec3 pos) {
                if (noiseStyle == 0) {
                    return
                        sin(pos.x) + sin(pos.y) + sin(pos.z) / (sinNoiseScale / (sinNoiseScale * 7.0)) +
                        noise(vec4(pos * simplexNoiseScale, time * 14.0)) * simplexIntensity;
                } else {
                    return max(
                        sin(pos.x * 2.0) + sin(pos.y * 2.0) + (sin(pos.z * 2.0) * sinNoiseScale),
                        sin(pos.x * 2.0) + sin(pos.y * 2.0) + (sin(pos.z * 2.0) * sinNoiseScale) + (noise(vec4(pos * simplexNoiseScale, time * 8.0)) * simplexIntensity)
                    );
                }
            }

            float sdf(vec3 pos) {
                vec3 p1 = rotate(vec3(pos + shapePositionOffset), vec3(1.0, 1.0, 0.0), time * TAU);

                float shape = 0.0;

                if (baseShape == 0) {
                    shape = sdSphere(p1, shapeDimension1);
                } else if (baseShape == 1) {
                    shape = sdEllipsoid(p1, vec3(shapeDimension1, shapeDimension2, shapeDimension3));
                } else if (baseShape == 2) {
                    p1 = rotate(pos, vec3(0.0, 1.0, 0.0), time * TAU);
                    shape = sdOctahedron(p1, shapeDimension1);
                } else if (baseShape == 3) {
                    shape = sdTorus(p1, vec2(shapeDimension1, shapeDimension2));
                } else if (baseShape == 4) {
                    shape = sdCappedCone(p1, shapeDimension1, shapeDimension3, shapeDimension2);
                } else if (baseShape == 5) {
                    shape = sdPyramid(p1, shapeDimension1);
                } else if (baseShape == 6) {
                    shape = sdCone(p1, vec2(shapeDimension3, shapeDimension2), shapeDimension1);
                } else if (baseShape == 7) {
                    shape = sdCuboid(p1, vec3(shapeDimension3, shapeDimension2, shapeDimension1));
                }
                
                
                vec3 p2 = rotate(pos, vec3(mousePosition, 1.0), -time * TAU * 0.7);
                float sineNoiseValue = (0.83 - sineNoise((p2 + vec3(0.0, 0.2, 0.0)) * sinNoiseScale)) / sinNoiseScale;

                return max(shape, sineNoiseValue);
            }

            vec3 getColor(vec3 pos) {
                float amount = clamp((1.5 - length(pos)) / 2.3, 0.0, 1.0);
                vec3 color = 0.588 + 0.708 * cos(TAU * (colorStart + amount * colorEnd));

                return color * amount;
            }

            void main()	{
                vec2 uv = vUv * vec2(aspect, 1.0) + vec2((1.0 - aspect) / 2.0, 0.0);
            
                vec3 camPos = vec3(0.0, 0.0, 1.9);
                vec2 pos = uv - vec2(0.5);
                vec3 ray = normalize(vec3(pos, -1.0));

                vec3 currentRayPos = camPos;
                float curDist = 0.0;
                float rayLength = 0.0;

                vec3 finalColor = vec3(bgBrightness);

                for (int i = 0; i <= 256; i++) {
                    curDist = sdf(currentRayPos);
                    rayLength +=  0.536 * curDist;
                    currentRayPos = camPos + ray * rayLength;
                    
                    if (curDist < 0.001 || curDist > 2.2) {
                        break;
                    }

                    finalColor += (0.087 * getColor(currentRayPos));
                }

                vec3 color = finalColor;

                if (curDist > 0.1) {
                    color = max(finalColor, 0.0);
                }

                float grainAmount = filmGrain(vUv * time) * grainIntensity;
                gl_FragColor = vec4(color - grainAmount, 1.0);
            }
        `,
        onFrame: ({ uniforms, mousePosition, mouseIsIdle, frameCount, fps }) => {
            playbackSpeed = lerp(
                playbackSpeed,
                fps < 40
                    ? initialPlaybackSpeed * Math.min(60 / fps, 2)
                    : initialPlaybackSpeed,
                0.033
            );

            uniforms.time.value += playbackSpeed;

            if (frameCount % 200 === 0) {
                idleMousePosition = inSquare(width, height);
            }

            uniforms.mousePosition.value = lerpVector(
                uniforms.mousePosition.value,
                !mouseIsIdle ? mousePosition : idleMousePosition,
                0.0019
            );
        },
    };
};

const S140121 = () => (
    <>
        <ShaderRenderer sketch={sketch} />
        <ControlsContainer>
            <RefreshButton>Re-generate scene</RefreshButton>
        </ControlsContainer>
    </>
);

export default S140121;
