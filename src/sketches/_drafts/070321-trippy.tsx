import glsl from "glslify";
import React from "react";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { lerpVector } from "Utils/math";
import { createHex, inRange } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
    uniforms: {
        aspect: { value: aspect, type: "1f" },
        time: { value: inRange(0, 999), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: {
            value: [width / 2, height / 2],
            type: "2f",
        },
    },
    frag: glsl`
            precision highp float;

            varying vec2 vUv; // pixel co-ordinates — recieved by the renderer via the vertex shader

            // Our defined uniforms
            uniform float time;
            uniform float aspect;
            uniform vec2 resolution;
            uniform vec2 mousePosition;

            vec3 getColorFromDistanceToMouse(vec2 p) {
                float distanceToMouse = length(p - mousePosition);
                // Try fiddling with some of the values found below
                vec3 colourFrom = vec3(0.0, 0.2, 0.0);
                vec3 colourTo = vec3(0.1, 1.0, 0.5);
                // colourFrom *= time;
                // colourTo *= time;     
                float intensity = clamp((1.0 - distanceToMouse) / 2.0, 0.0, 1.0);
                                              
                vec3 color = 0.3 + 0.8 * cos(40.0 * (colourFrom + intensity * colourTo));
                return color * intensity;
            }

            void main()	{
                vec2 uv = vUv; // get our pixel co-ordinates
                uv *= vec2(aspect, 1.0) + vec2((1.0 - aspect) / 2.0, 0.0); // normalise coordinates based on aspect ratio

                
                vec3 color = 0.5 + 0.5 * sin(time + uv.xyx + vec3(0.0, 2.0, 4.0)); // 0.5 + [-0.5..+0.5] => [0..1]

                color += getColorFromDistanceToMouse(uv);

                // here we finally set the colour output for the current pixel
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    onFrame: ({ uniforms, ...props }) => {
        uniforms.time.value = props.elapsedTime;
        uniforms.mousePosition.value = lerpVector(
            uniforms.mousePosition.value,
            props.normalisedMousePosition,
            0.1
        );
    },
});

const Scene = () => <ShaderRenderer sketch={sketch} />;

export default Scene;
