import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import type { ThreeSetupFn } from "Renderers/Three";
import { ThreeRenderer } from "Renderers/Three";

import { inRange } from "Utils/random";

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
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
            #pragma glslify: noise = require("glsl-noise/simplex/2d");
            #define PI 3.1415;
            varying vec2 vUv;
            uniform float time;
            uniform vec3 color;

            void main () {
                vec3 color = vec3(0.0);
                vec2 pos = vec2(vUv * 3.0);

                float DF = 0.0;

                float a = 0.0;
                vec2 vel = vec2(time * 0.1);
                DF += noise(pos + vel) * 0.25 + 0.5;

                a = noise(pos * vec2(cos(time * 0.15), sin(time * 0.1)) * 0.1) * PI;
                vel = vec2(cos(a), sin(a));
                DF += noise(pos + vel) * 0.25 + 0.25;

                color = vec3(smoothstep(0.7, 0.75, fract(DF)));

                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 2.3;

    return ({ renderer }) => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
        material.uniforms.time.value += 0.02;

        renderer.render(scene, camera);
    };
};

const DThreeRendererTest = () => <ThreeRenderer sketch={sketch} />;

export default DThreeRendererTest;
