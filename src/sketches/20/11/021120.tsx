import React from "react";
import * as THREE from "three";
import glsl from "glslify";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

import { createShaderQuad } from "LibUtils/three";

import { inRange } from "Utils/random";

const sketch: ThreeSetupFn = ({ scene, aspect }) => {
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const quad = createShaderQuad({
        uniforms: { aspect, time: inRange(100) },
        frag: glsl`       
                precision highp float;

                #pragma glslify: noise = require("glsl-noise/simplex/3d");
                #pragma glslify: hsl2rgb = require("glsl-hsl2rgb");

                uniform float time;
                uniform float aspect;
                varying vec2 vUv;

                void main() {
                    vec2 center = vUv - 0.5;
                    center.x *= aspect;
                    float dist = length(center);

                    float n = noise(vec3(center * 1.8, time));

                    vec3 color = dist > 0.37
                        ? vec3(0.0, 0.0, 0.0)
                        : hsl2rgb(0.75 + n * 0.15, 0.5, 0.5);

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
    });

    scene.add(quad);

    return ({ renderer }) => {
        renderer.render(scene, camera);

        quad.material.uniforms.time.value += 0.013;
    };
};

const S021120 = () => <ThreeRenderer sketch={sketch} />;

export default S021120;
