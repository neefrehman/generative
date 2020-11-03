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

            uniform float time;
            uniform float aspect;
            varying vec2 vUv;

            void main() {
                vec2 center = vUv - 0.5;
                center.x *= aspect;

                float n = noise(vec3(center, time));

                gl_FragColor = vec4(vec3(n), 1.0);
            }
        `,
    });

    scene.add(quad);

    return ({ renderer }) => {
        renderer.render(scene, camera);

        quad.material.uniforms.time.value += 0.015;
    };
};

const S011120 = () => <ThreeRenderer sketch={sketch} />;

export default S011120;
