import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import type { ThreeSetupFn } from "Renderers/Three";
import { ThreeRenderer } from "Renderers/Three";

import { inRange } from "Utils/random";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: inRange(10000) },
            color: { value: new THREE.Color("#f32d94") },
        },
        vertexShader: glsl`
            varying vec2 vUv;
            void main () {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
            }
        `,
        fragmentShader: glsl`
            #pragma glslify: noise = require("glsl-noise/simplex/3d");
            varying vec2 vUv;
            uniform float time;
            uniform vec3 color;

            void main () {
                vec2 center = vec2(0.5);
                vec2 q = vec2(vUv.x, vUv.y * 0.5);
                vec2 pos = mod(q * 20.0, 1.0);
                float dist = distance(pos, center);
                // float mask = step(0.25 + sin(time + vUv.x * 2.0) * 0.2, dist);

                vec2 noiseInput = floor(q * 10.0);
                float offset = noise(vec3(noiseInput, time)) * 0.15;
                float mask = step(0.25 + offset, dist);
                mask = 1.0 - mask;

                vec3 fragColor = mix(color, vec3(1.0), mask);

                gl_FragColor = vec4(vec3(fragColor), 0.5);
            }
        `,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 2.3;

    return () => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
        material.uniforms.time.value += 0.02;
    };
};

const DThreeRendererTest = () => <ThreeRenderer sketch={sketch} />;

export default DThreeRendererTest;
