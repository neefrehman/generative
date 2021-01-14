import glsl from "glslify";
import React from "react";

import type { ShaderRendererSettings, ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerpVector } from "Utils/math";
import { createHex, inRange, inSquare } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const PIXELATION = 1.4;

const settings: ShaderRendererSettings = {
    dimensions: [window.innerWidth / PIXELATION, window.innerHeight / PIXELATION],
};

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
            simplexIntensity: { value: inRange(0.5, 5), type: "1f" },
        },
        frag: glsl`
            precision highp float;

            #pragma glslify: noise = require("glsl-noise/simplex/4d");
            #pragma glslify: smin = require("../../../utils/shaders/smin/poly.glsl");
            #pragma glslify: rotate = require("../../../utils/shaders/rotate.glsl");
            #pragma glslify: filmGrain = require("../../../utils/shaders/grain.glsl");
            #pragma glslify: sdOctahedron = require("../../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");

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

            uniform int baseShape1;
            uniform int baseShape2;

            #pragma glslify: sdEllipsoid = require("../../../utils/shaders/sdShapes/3d/sdEllipsoid.glsl");
            #pragma glslify: sdSphere = require("../../../utils/shaders/sdShapes/3d/sdSphere.glsl");
            #pragma glslify: sdOctahedron = require("../../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");
            #pragma glslify: sdTorus = require("../../../utils/shaders/sdShapes/3d/sdTorus.glsl");
            #pragma glslify: sdCappedCone = require("../../../utils/shaders/sdShapes/3d/sdCappedCone.glsl");
            #pragma glslify: sdPyramid = require("../../../utils/shaders/sdShapes/3d/sdPyramid.glsl");

            float sineNoise(vec3 pos) {
                return max(
                    sin(pos.x * 2.0) + sin(pos.y * 2.0) + (sin(pos.z * 2.0) * noiseScale),
                    noise(vec4(vec3(pos.x * 0.65, sin(pos.y * 1.25), pos.z * 0.65), time * 18.0)) * simplexIntensity
                );
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
                
                vec3 p2 = rotate(pos, vec3(mousePosition, 1.0), -time * TAU);
                float sineNoiseValue = (0.83 - sineNoise((p2 + vec3(0.0, 0.2, 0.0)) * noiseScale)) / noiseScale;

                return max(mixedShaped, sineNoiseValue);
            }

            vec3 getColor(vec3 pos) {
                float amount = clamp((1.5 - length(pos)) / 2.3, 0.0, 1.0);
                vec3 color = 0.6 + 0.71 * cos(TAU * (colorStart + amount * colorEnd));

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

                    finalColor += (0.082 * getColor(currentRayPos));
                }

                vec3 color = finalColor;

                if (curDist > 0.1) {
                    color = max(finalColor, 0.0);
                }

                float grainAmount = filmGrain(vUv * time) * 0.015;
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

const S130121 = () => (
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

export default S130121;

export { default as metaImage } from "./meta-image.png";
