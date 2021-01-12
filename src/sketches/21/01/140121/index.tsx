import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerpVector } from "Utils/math";
import { createHex, inRange, inSquare, pick } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => {
    let idleMousePosition = inSquare(width, height);

    return {
        uniforms: {
            aspect: { value: aspect },
            time: { value: inRange(200, 600), type: "1f" },
            resolution: { value: [width, height], type: "2f" },
            mousePosition: { value: [0, height], type: "2f" },
            baseShape: {
                value: inRange(0, 5, { isInteger: true }),
                type: "1i",
            },
            colorStart: { value: hexToVec3(createHex()), type: "3f" },
            colorEnd: { value: hexToVec3(createHex()), type: "3f" },
            noiseScale: { value: inRange(5, 12), type: "1f" },
            simplexIntensity: { value: inRange(0.5, 4), type: "1f" },
            noiseStyle: { value: pick([0, 1, 2]), type: "1i" },
            grainIntensity: { value: inRange(0, 0.04), type: "1f" },
        },
        frag: glsl`
            precision highp float;

            #pragma glslify: noise = require("glsl-noise/simplex/4d");
            #pragma glslify: rotate = require("../../../utils/shaders/rotate.glsl");
            #pragma glslify: filmGrain = require("../../../utils/shaders/grain.glsl");

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
            uniform int noiseStyle;
            uniform float grainIntensity;

            uniform int baseShape;

            #pragma glslify: sdEllipsoid = require("../../../utils/shaders/sdShapes/3d/sdEllipsoid.glsl");
            #pragma glslify: sdSphere = require("../../../utils/shaders/sdShapes/3d/sdSphere.glsl");
            #pragma glslify: sdOctahedron = require("../../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");
            #pragma glslify: sdTorus = require("../../../utils/shaders/sdShapes/3d/sdTorus.glsl");
            #pragma glslify: sdCappedCone = require("../../../utils/shaders/sdShapes/3d/sdCappedCone.glsl");
            #pragma glslify: sdPyramid = require("../../../utils/shaders/sdShapes/3d/sdPyramid.glsl");

            float sineNoise(vec3 pos) {
                if (noiseStyle == 0) {
                    return min(
                        sin(pos.x) + sin(pos.y) + sin(pos.z) * 9.0,
                        noise(vec4(pos * 0.6, time * 7.0)) * simplexIntensity
                    );
                } else if (noiseStyle == 1) {
                    return
                        sin(pos.x) + sin(pos.y) + sin(pos.z) / (noiseScale / (noiseScale * 9.0)) +
                        noise(vec4(pos * 0.65, time * 25.0)) * simplexIntensity;
                } else {
                    return max(
                        sin(pos.x * 2.0) + sin(pos.y * 2.0) + (sin(pos.z * 2.0) * noiseScale),
                        sin(pos.x * 2.0) + sin(pos.y * 2.0) + (sin(pos.z * 2.0) * noiseScale) + noise(vec4(pos * 0.65, time * 20.0)) * simplexIntensity
                    );
                }
            }

            float sdf(vec3 pos) {
                vec3 p1 = rotate(pos, vec3(1.0, 1.0, 0.0), time * TAU);

                float shape = 0.0;

                if (baseShape == 0) {
                    shape = sdSphere(p1, 0.45);
                } else if (baseShape == 1) {
                    shape = sdEllipsoid(p1, vec3(0.45, 0.2, 0.32));
                } else if (baseShape == 2) {
                    p1 = rotate(pos, vec3(0.0, 1.0, 0.0), time * TAU);
                    shape = sdOctahedron(p1, 0.45);
                } else if (baseShape == 3) {
                    shape = sdTorus(p1, vec2(0.45, 0.2));
                } else if (baseShape == 4) {
                    shape = sdCappedCone(p1, 0.45, 0.4, 0.25);
                } else if (baseShape == 5) {
                    shape = sdPyramid(p1, 0.45);
                }
                
                vec3 p2 = rotate(pos, vec3(mousePosition, 1.0), -time * TAU);
                float sineNoiseValue = (0.83 - sineNoise((p2 + vec3(0.0, 0.2, 0.0)) * noiseScale)) / noiseScale;

                return max(shape, sineNoiseValue);
            }

            vec3 getColor(vec3 pos) {
                float amount = clamp((1.5 - length(pos)) / 2.3, 0.0, 1.0);
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

                    finalColor += (0.082 * getColor(currentRayPos));
                }

                vec3 color = finalColor;

                if (curDist > 0.1) {
                    color = max(finalColor, 0.0);
                }

                float grainAmount = filmGrain(vUv * time) * grainIntensity;
                gl_FragColor = vec4(color - grainAmount, 1.0);
            }
        `,
        onFrame: ({ uniforms, mousePosition, mouseIsIdle, frameCount }) => {
            uniforms.time.value += 0.0004;

            if (frameCount % 200 === 0) {
                idleMousePosition = inSquare(width, height);
            }

            uniforms.mousePosition.value = lerpVector(
                uniforms.mousePosition.value,
                !mouseIsIdle ? mousePosition : idleMousePosition,
                0.02
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

export { default as metaImage } from "./meta-image.png";
