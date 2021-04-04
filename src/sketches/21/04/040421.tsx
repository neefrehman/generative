import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerpVector } from "Utils/math";
import { createHex, inRange, inSquare } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => {
    const idleMousePosition = inSquare(width, height);

    return {
        uniforms: {
            aspect: { value: aspect },
            time: { value: inRange(200, 600), type: "1f" },
            resolution: { value: [width, height], type: "2f" },
            mousePosition: { value: [0, height], type: "2f" },
            colorStart: { value: hexToVec3(createHex()), type: "3f" },
            colorEnd: { value: hexToVec3(createHex()), type: "3f" },
            noiseScale: { value: inRange(3, 9), type: "1f" },
        },
        frag: glsl`
                precision highp float;

                #pragma glslify: sdCuboid = require("../../utils/shaders/sdShapes/3d/sdCuboid.glsl");
                #pragma glslify: noise = require("glsl-noise/simplex/4d");
                #pragma glslify: rotate = require("../../utils/shaders/rotate.glsl");
                #pragma glslify: filmGrain = require("../../utils/shaders/grain.glsl");

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

                float sineNoise(vec3 pos) {
                    const int CELL_COUNT = 3;
                    vec3 voronoiCells[CELL_COUNT];
                    float min_dist = 1.0;

                    for (int i = 0; i < CELL_COUNT; i++) {
                        voronoiCells[i] = vec3(
                            pos.x * float(i),
                            pos.y * float(i),
                            sin(pos.z * float(i))
                        );

                        float dist = distance(pos, voronoiCells[i]);
                        min_dist = min(min_dist, dist);
                    }

                    return 1.6 - min_dist;
                }

                float sdf(vec3 pos) {
                    vec3 pShape = rotate(pos, vec3(1.0, 1.0, 0.0), time * TAU);
                    float shape = sdCuboid(pShape, vec3(0.4));
                    
                    vec3 pNoise = rotate(pos, vec3(mousePosition, 1.0), -time * TAU);
                    float sineNoiseValue = (0.83 - sineNoise((pNoise + vec3(0.0, 0.2, 0.0)) * noiseScale)) / noiseScale;

                    return max(shape, sineNoiseValue);
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

                    vec3 finalColor = vec3(0.01);

                    for (int i = 0; i <= 256; i++) {
                        curDist = sdf(currentRayPos);
                        rayLength +=  0.536 * curDist;
                        currentRayPos = camPos + ray * rayLength;
                        
                        if (curDist < 0.001 || curDist > 2.2) {
                            break;
                        }

                        finalColor += (0.1 * getColor(currentRayPos));
                    }

                    vec3 color = finalColor;

                    if (curDist > 0.1) {
                        color = min(finalColor, 0.8);
                    }

                    float grainAmount = filmGrain(vUv * time) * 0.03;
                    gl_FragColor = vec4(color - grainAmount, 1.0);
                }
            `,
        onFrame: ({ uniforms, mousePosition, mouseIsIdle }) => {
            uniforms.time.value += 0.00018;

            uniforms.mousePosition.value = lerpVector(
                uniforms.mousePosition.value,
                !mouseIsIdle ? mousePosition : idleMousePosition,
                0.007
            );
        },
    };
};

const S040421 = () => (
    <>
        <ShaderRenderer sketch={sketch} />
        <ControlsContainer>
            <RefreshButton>Re-generate scene</RefreshButton>
        </ControlsContainer>
    </>
);

export default S040421;
