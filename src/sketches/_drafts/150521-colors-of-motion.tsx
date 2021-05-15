import glsl from "glslify";
import React from "react";
import palettes from "nice-color-palettes";

import type { ShaderSetupFn } from "Renderers/WebGL";
import { ShaderRenderer } from "Renderers/WebGL";

import { inRange, pick } from "Utils/random";
import { hexToVec3 } from "Utils/shaders";

const palette = pick(palettes);

const sketch: ShaderSetupFn = ({ width, height, aspect }) => ({
    uniforms: {
        aspect: { value: aspect, type: "1f" },
        time: { value: inRange(0, 999), type: "1f" },
        resolution: { value: [width, height], type: "2f" },
        mousePosition: { value: [width / 2, height / 2], type: "2f" },
        color1: { value: hexToVec3(palette[0]), type: "3f" },
        color2: { value: hexToVec3(palette[1]), type: "3f" },
    },
    frag: glsl`
            precision highp float;

            #pragma glslify: noise = require("glsl-noise/simplex/2d");

            varying vec2 vUv;

            uniform float time;
            uniform float aspect;
            uniform vec2 resolution;
            uniform vec2 mousePosition;
            uniform vec3 color1;
            uniform vec3 color2;

            void main()	{
                vec2 uv = vUv;
                uv *= vec2(aspect, 1.0) + vec2((1.0 - aspect) / 2.0, 0.0);

                //                                     ↓ off  ↓ offVel        ↓ freq       ↓ vel    ↓ *amp / +ampOff
                float brightness1 = noise(vec2((uv.x + 0.0 + (time * 0.10)) * 9.0, (time * 1.0)));
                float brightness2 = noise(vec2((uv.x - 0.5 + (time * 0.17)) * 1.0, (time * 0.9))) * 1.5;
                float brightness3 = noise(vec2((uv.x + 0.5 + (time * 0.12)) * 3.0, (time * 1.1))) * 0.2;
                float brightness4 = noise(vec2((uv.x + 1.0 + (time * 0.19)) * 4.0, (time * 1.2))) + 0.2;
                float brightness5 = noise(vec2((uv.x + 3.0 + (time * 0.31)) * 2.0, (time * 1.1))) * 0.1 + 0.1;
                float brightness = brightness1 + brightness2 + brightness3 + brightness4 + brightness5;
                
                // Need to find a way to use multiple colours
                vec3 colorToMix = mix(color1, color2, uv.x);

                vec3 color = mix(vec3(0.0), colorToMix, brightness);

                gl_FragColor = vec4(color, 1.0);
            }
        `,
    onFrame: ({ uniforms, ...props }) => {
        uniforms.time.value += props.deltaTime * 0.00015;
        uniforms.mousePosition.value = props.normalisedMousePosition;
    },
});

const Scene = () => <ShaderRenderer sketch={sketch} />;

export default Scene;
