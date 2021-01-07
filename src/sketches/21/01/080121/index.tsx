// heavily inspired by ggsim's raymarching experiments https://github.com/gsimone/r3f-raymarching :)

import glsl from "glslify";
import React, { useCallback, useState } from "react";

import type { ShaderRendererSettings, ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerpVector } from "Utils/math";
import { createHex, inRange, inSquare } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const S030121 = () => {
    const [PIXELATION] = useState(() => inRange(2.5, 7.5));

    const settings: ShaderRendererSettings = {
        dimensions: [
            window.innerWidth / PIXELATION,
            window.innerHeight / PIXELATION,
        ],
    };

    const sketch: ShaderSetupFn = useCallback(
        ({ width, height, aspect }) => {
            const actualWidth = width * PIXELATION;
            const actualHeight = height * PIXELATION;

            let idleMousePosition = inSquare(actualWidth, actualHeight);

            return {
                uniforms: {
                    aspect: { value: aspect },
                    time: { value: inRange(200, 600), type: "1f" },
                    resolution: { value: [actualWidth, actualHeight], type: "2f" },
                    mousePosition: { value: [0, actualHeight], type: "2f" },
                    baseShape: {
                        value: inRange(0, 5, { isInteger: true }),
                        type: "1i",
                    },
                    colorStart: { value: hexToVec3(createHex()), type: "3f" },
                    colorEnd: { value: hexToVec3(createHex()), type: "3f" },
                },
                frag: glsl`
                precision highp float;

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

                uniform int baseShape;

                #pragma glslify: sdEllipsoid = require("../../../utils/shaders/sdShapes/3d/sdEllipsoid.glsl");
                #pragma glslify: sdSphere = require("../../../utils/shaders/sdShapes/3d/sdSphere.glsl");
                #pragma glslify: sdOctahedron = require("../../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");
                #pragma glslify: sdTorus = require("../../../utils/shaders/sdShapes/3d/sdTorus.glsl");
                #pragma glslify: sdCappedCone = require("../../../utils/shaders/sdShapes/3d/sdCappedCone.glsl");
                #pragma glslify: sdPyramid = require("../../../utils/shaders/sdShapes/3d/sdPyramid.glsl");

                float sineNoise(vec3 p) {
                    return 1.0 - (sin(p.x) + sin(p.y) + sin(p.z)) / 3.0; 
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
                    float noiseScale = 15.0;
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

                    for (int i = 0; i <= 364; i++) {
                        curDist = sdf(currentRayPos);
                        rayLength +=  0.536 * curDist;
                        currentRayPos = camPos + ray * rayLength;
                        
                        if (curDist < 0.001) {
                            break;
                        }

                        finalColor += (0.052 * getColor(currentRayPos));
                    }

                    vec3 color = finalColor;

                    if (curDist > 0.1) {
                        color = max(finalColor, 1.0);
                    }

                    float grainAmount = filmGrain(vUv * time) * 0.1;
                    gl_FragColor = vec4(color - grainAmount, 1.0);
                }
            `,
                onFrame: ({
                    uniforms,
                    mousePosition,
                    mouseIsIdle,
                    frameCount,
                }) => {
                    uniforms.time.value += 0.002;

                    if (frameCount % 180 === 0) {
                        idleMousePosition = inSquare(actualWidth, actualHeight);
                    }

                    uniforms.mousePosition.value = lerpVector(
                        uniforms.mousePosition.value,
                        !mouseIsIdle ? mousePosition : idleMousePosition,
                        0.05
                    );
                },
            };
        },
        [PIXELATION]
    );

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

export default S030121;

export { default as metaImage } from "./meta-image.png";
