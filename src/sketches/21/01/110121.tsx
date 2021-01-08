// heavily inspired by ggsim's raymarching experiments https://github.com/gsimone/r3f-raymarching :)

import glsl from "glslify";
import React, { useCallback, useState } from "react";

import type { ShaderRendererSettings, ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerpVector } from "Utils/math";
import { createHex, createSign, inRange, inSquare } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

// sketch creation function used with react state to ensure pixelation value
// refreshes on component remount (for DX and reset button in client)
const createSketch = (PIXELATION: number) => {
    const sketch: ShaderSetupFn = ({ width, height, aspect }) => {
        const actualWidth = width * PIXELATION;
        const actualHeight = height * PIXELATION;

        let idleMousePosition = inSquare(actualWidth, actualHeight);

        const baseShape1Num = inRange(0, 5, { isInteger: true });
        const baseShape2Num = inRange(0, 5, {
            isInteger: true,
            not: baseShape1Num,
        });

        return {
            uniforms: {
                aspect: { value: aspect },
                time: { value: inRange(200, 600), type: "1f" },
                resolution: { value: [actualWidth, actualHeight], type: "2f" },
                mousePosition: { value: [0, actualHeight], type: "2f" },
                baseShape1: { value: baseShape1Num, type: "1i" },
                baseShape2: { value: baseShape2Num, type: "1i" },
                colorStart: { value: hexToVec3(createHex()), type: "3f" },
                colorEnd: { value: hexToVec3(createHex()), type: "3f" },
                noiseScale: { value: inRange(5, 12), type: "1f" },
                simplexIntensity: { value: inRange(0.5, 4.5), type: "1f" },
                invertedNoise: { value: createSign(0.6), type: "1i" },
            },
            frag: glsl`
                precision highp float;

                #pragma glslify: noise = require("glsl-noise/simplex/4d");
                #pragma glslify: smin = require("../../utils/shaders/smin/poly.glsl");
                #pragma glslify: rotate = require("../../utils/shaders/rotate.glsl");
                #pragma glslify: filmGrain = require("../../utils/shaders/grain.glsl");
                #pragma glslify: sdOctahedron = require("../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");

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
                uniform float simplexIntensity;
                uniform int invertedNoise;

                uniform int baseShape1;
                uniform int baseShape2;

                #pragma glslify: sdEllipsoid = require("../../utils/shaders/sdShapes/3d/sdEllipsoid.glsl");
                #pragma glslify: sdSphere = require("../../utils/shaders/sdShapes/3d/sdSphere.glsl");
                #pragma glslify: sdOctahedron = require("../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");
                #pragma glslify: sdTorus = require("../../utils/shaders/sdShapes/3d/sdTorus.glsl");
                #pragma glslify: sdCappedCone = require("../../utils/shaders/sdShapes/3d/sdCappedCone.glsl");
                #pragma glslify: sdPyramid = require("../../utils/shaders/sdShapes/3d/sdPyramid.glsl");

                float sineNoise(vec3 pos) {
                    return (invertedNoise == 1)
                        ? noise(vec4(pos * 0.25, time * 22.0)) * simplexIntensity + 0.55
                        : 1.0 - noise(vec4(pos * 0.25, time * 22.0)) * simplexIntensity;
                }

                float sdf(vec3 pos) {
                    vec3 pShape1 = rotate(pos, vec3(1.0, 1.0, 0.0), time * TAU);
                    vec3 pShape2 = rotate(pos, vec3(1.0, 1.0, 0.0), -time * 4.0 * TAU);

                    float shape1 = 0.0;
                    float shape2 = 0.0;

                    if (baseShape1 == 0) {
                        shape1 = sdSphere(pShape1, 0.45);
                    } else if (baseShape1 == 1) {
                        shape1 = sdEllipsoid(pShape1, vec3(0.45, 0.2, 0.32));
                    } else if (baseShape1 == 2) {
                        pShape1 = rotate(pos, vec3(0.0, 1.0, 0.0), time * TAU);
                        shape1 = sdOctahedron(pShape1, 0.45);
                    } else if (baseShape1 == 3) {
                        shape1 = sdTorus(pShape1, vec2(0.45, 0.2));
                    } else if (baseShape1 == 4) {
                        shape1 = sdCappedCone(pShape1, 0.45, 0.4, 0.25);
                    } else if (baseShape1 == 5) {
                        shape1 = sdPyramid(pShape1, 0.45);
                    }

                    if (baseShape2 == 0) {
                        shape2 = sdSphere(pShape2, 0.4);
                    } else if (baseShape2 == 1) {
                        shape2 = sdEllipsoid(pShape2, vec3(0.4, 0.2, 0.3));
                    } else if (baseShape2 == 2) {
                        shape2 = sdOctahedron(pShape2, 0.4);
                    } else if (baseShape2 == 3) {
                        shape2 = sdTorus(pShape2, vec2(0.4, 0.2));
                    } else if (baseShape2 == 4) {
                        shape2 = sdCappedCone(pShape2, 0.4, 0.4, 0.22);
                    } else if (baseShape2 == 5) {
                        shape2 = sdPyramid(pShape2, 0.4);
                    }

                    float mixedShaped = smin(shape1, shape2, 0.66);
                    
                    vec3 pNoise = rotate(pos, vec3(mousePosition, 1.0), -time * TAU);
                    float sineNoiseValue = (0.83 - sineNoise((pNoise + vec3(0.0, 0.2, 0.0)) * noiseScale)) / noiseScale;

                    return max(mixedShaped, sineNoiseValue);
                }

                vec3 getColor(vec3 pos) {
                    float amount = clamp((1.8 - length(pos)) / 2.3, 0.0, 1.0);
                    vec3 color = 0.588 + 0.708 * cos(TAU * (colorStart + amount * colorEnd));

                    return color * amount;
                }

                void main()	{
                    vec2 uv = vUv * vec2(aspect, 1.0) + vec2((1.0 - aspect) / 2.0, 0.0);
                
                    vec3 camPos = vec3(0.0, 0.0, 2.0);
                    vec2 pos = uv - vec2(0.5);
                    vec3 ray = normalize(vec3(pos, -1.0));

                    vec3 currentRayPos = camPos;
                    float curDist = 0.0;
                    float rayLength = 0.0;

                    vec3 finalColor = vec3(0.0);

                    for (int i = 0; i <= 256; i++) {
                        curDist = sdf(currentRayPos);
                        rayLength +=  0.536 * curDist;
                        currentRayPos = camPos + ray * rayLength;
                        
                        if (curDist < 0.001 || curDist > 2.2) {
                            break;
                        }

                        finalColor += (0.052 * getColor(currentRayPos));
                    }

                    vec3 color = finalColor;

                    if (curDist > 0.1) {
                        color = max(finalColor, 0.0);
                    }

                    float grainAmount = filmGrain(vUv * time) * 0.1;
                    gl_FragColor = vec4(color - grainAmount, 1.0);
                }
            `,
            onFrame: ({ uniforms, mousePosition, mouseIsIdle, frameCount }) => {
                uniforms.time.value += 0.0004;

                if (frameCount % 200 === 0) {
                    idleMousePosition = inSquare(actualWidth, actualHeight);
                }

                uniforms.mousePosition.value = lerpVector(
                    uniforms.mousePosition.value,
                    !mouseIsIdle ? mousePosition : idleMousePosition,
                    0.02
                );
            },
        };
    };

    return sketch;
};

const S110121 = () => {
    const [pixelation] = useState(() => inRange(1.8, 2.5));

    const settings: ShaderRendererSettings = {
        dimensions: [
            window.innerWidth / pixelation,
            window.innerHeight / pixelation,
        ],
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sketch = useCallback(createSketch(pixelation), [pixelation]);

    return (
        <>
            <ShaderRenderer
                sketch={sketch}
                settings={settings}
                style={{ width: "100%", height: "100vh" }}
            />
            <ControlsContainer>
                <RefreshButton>Re-generate scene</RefreshButton>
            </ControlsContainer>
        </>
    );
};

export default S110121;

export { default as metaImage } from "./070121/meta-image.png";
