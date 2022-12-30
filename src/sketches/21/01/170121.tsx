import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { ControlsContainer, RefreshButton } from "components/SketchControls";

import { lerp, lerpVector } from "Utils/math";
import {
  createHex,
  createSign,
  inBeta,
  inGaussian,
  inRange,
  inSquare,
} from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => {
  const idleMousePosition = inSquare(width, height);

  const initialPlaybackSpeed = inRange(0.000065, 0.00015);
  let playbackSpeed = initialPlaybackSpeed;

  return {
    uniforms: {
      aspect: { value: aspect },
      time: { value: inRange(0, 500), type: "1f" },
      resolution: { value: [width, height], type: "2f" },
      mousePosition: { value: [0, height], type: "2f" },

      bgBrightness: { value: inBeta(1, 3) * 0.057, type: "1f" },
      colorStart: { value: hexToVec3(createHex()), type: "3f" },
      colorEnd: { value: hexToVec3(createHex()), type: "3f" },

      sinScalar1: { value: inRange(0, 30), type: "1f" },
      sinScalar2: { value: inRange(0, 5), type: "1f" },
      scalarSwap: { value: createSign(0.6), type: "1i" },
      noiseRotationSpeed: { value: inRange(0.66, 1), type: "1f" },
      sinNoiseScale: { value: inRange(5, 12), type: "1f" },
      simplexNoiseScale: { value: inRange(0.6, 0.67), type: "1f" },
      simplexIntensity: { value: inRange(0.5, 4.3), type: "1f" },
      grainIntensity: { value: inRange(0, 0.038), type: "1f" },

      baseShape: {
        value: inRange(0, 7, { isInteger: true }),
        type: "1i",
      },
      shapeDimension1: { value: inRange(0.4, 0.52), type: "1f" },
      shapeDimension2: { value: inRange(0.2, 0.35), type: "1f" },
      shapeDimension3: { value: inRange(0.32, 0.4), type: "1f" },
      shapePositionOffset: {
        value: [
          inGaussian(0, 0.09) * aspect,
          inGaussian(0, 0.09),
          (inBeta(1.8, 5) - 0.1) * 0.6,
        ],
        type: "3f",
      },
    },
    frag: glsl`
            precision highp float;

            #pragma glslify: noise = require("glsl-noise/simplex/4d");
            #pragma glslify: rotate = require("../../utils/shaders/rotate.glsl");
            #pragma glslify: filmGrain = require("../../utils/shaders/grain.glsl");

            #pragma glslify: sdEllipsoid = require("../../utils/shaders/sdShapes/3d/sdEllipsoid.glsl");
            #pragma glslify: sdSphere = require("../../utils/shaders/sdShapes/3d/sdSphere.glsl");
            #pragma glslify: sdCuboid = require("../../utils/shaders/sdShapes/3d/sdCuboid.glsl");
            #pragma glslify: sdOctahedron = require("../../utils/shaders/sdShapes/3d/sdOctahedron.glsl");
            #pragma glslify: sdTorus = require("../../utils/shaders/sdShapes/3d/sdTorus.glsl");
            #pragma glslify: sdCone = require("../../utils/shaders/sdShapes/3d/sdCone.glsl");
            #pragma glslify: sdCappedCone = require("../../utils/shaders/sdShapes/3d/sdCappedCone.glsl");
            #pragma glslify: sdPyramid = require("../../utils/shaders/sdShapes/3d/sdPyramid.glsl");

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

            uniform float sinScalar1;
            uniform float sinScalar2;
            uniform int scalarSwap;
            uniform float noiseRotationSpeed;
            uniform float sinNoiseScale;
            uniform float simplexNoiseScale;
            uniform float simplexIntensity;
            uniform float grainIntensity;

            uniform int baseShape;
            uniform float shapeDimension1;
            uniform float shapeDimension2;
            uniform float shapeDimension3;
            uniform vec3 shapePositionOffset;

            float sineNoise(vec3 pos) {
                float scalar1 = scalarSwap == 1 ? sinScalar1 : sinScalar2;
                float scalar2 = scalarSwap == 1 ? sinScalar2 : sinScalar1;

                return max(
                    sin(pos.x * scalar1) + sin(pos.y * scalar1) + (sin(pos.z * scalar1) * sinNoiseScale),
                    sin(pos.x * scalar2) + sin(pos.y * scalar2) + (sin(pos.z * scalar2) * sinNoiseScale) + (noise(vec4(pos * simplexNoiseScale, time * 10.0)) * simplexIntensity)
                );
            }

            float sdf(vec3 pos) {
                vec3 p1 = rotate(vec3(pos + shapePositionOffset), vec3(1.0, 1.0, 0.0), time * TAU);

                float shape = 0.0;

                if (baseShape == 0) {
                    shape = sdSphere(p1, shapeDimension1);
                } else if (baseShape == 1) {
                    shape = sdEllipsoid(p1, vec3(shapeDimension1, shapeDimension2, shapeDimension3));
                } else if (baseShape == 2) {
                    p1 = rotate(pos, vec3(0.0, 1.0, 0.1), time * TAU);
                    shape = sdOctahedron(p1, shapeDimension1);
                } else if (baseShape == 3) {
                    shape = sdTorus(p1, vec2(shapeDimension1, shapeDimension2));
                } else if (baseShape == 4) {
                    shape = sdCappedCone(p1, shapeDimension1, shapeDimension3, shapeDimension2);
                } else if (baseShape == 5) {
                    shape = sdPyramid(p1, shapeDimension1);
                } else if (baseShape == 6) {
                    p1 -= vec3(0.2, 0.2, 0.0);
                    shape = sdCone(p1, vec2(shapeDimension3, shapeDimension2), shapeDimension1);
                } else if (baseShape == 7) {
                    shape = sdCuboid(p1, vec3(shapeDimension1 * 0.88));
                }
                
                
                vec3 p2 = rotate(pos, vec3(mousePosition, 1.0), -time * TAU * noiseRotationSpeed);
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
            
                vec3 camPos = vec3(0.0, 0.0, 2.0);
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
    onFrame: ({ uniforms, mousePosition, mouseHasEntered, fps }) => {
      playbackSpeed = lerp(
        playbackSpeed,
        fps < 40
          ? initialPlaybackSpeed * Math.min(60 / fps, 2)
          : initialPlaybackSpeed,
        0.033
      );

      uniforms.time.value += playbackSpeed;

      uniforms.mousePosition.value = lerpVector(
        uniforms.mousePosition.value,
        mouseHasEntered ? mousePosition : idleMousePosition,
        0.002
      );
    },
  };
};

const S170121 = () => (
  <>
    <ShaderRenderer sketch={sketch} />
    <ControlsContainer>
      <RefreshButton>Re-generate scene</RefreshButton>
    </ControlsContainer>
  </>
);

export default S170121;

export { default as metaImage } from "./150121/meta-image.png";
