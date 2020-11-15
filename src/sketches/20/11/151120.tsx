import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

import { getShortestViewportDimension } from "Utils/math";
import { inRange } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ cap: 900 });

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const PLANE_COUNT = Math.min(16, Math.floor(shortestDimension / 45));
    const PLANE_OFFSET = 0.04;

    const geometry = new THREE.PlaneBufferGeometry(1.1, 1.1);
    const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: inRange(100) } },
        side: THREE.DoubleSide,
        transparent: true,
        vertexShader: glsl`
            varying vec2 vUv;
            void main () {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
            }
        `,
        fragmentShader: glsl`
            #pragma glslify: noise = require("glsl-noise/simplex/3d");

            uniform float time;
            varying vec2 vUv;

            void main () {
                vec2 center = vUv - 0.5;
                float n = noise(vec3(center, time));
                gl_FragColor = vec4(vec3(n), 0.7 - n);
            }
        `,
    });

    const planes: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[] = [];
    const group = new THREE.Group();

    for (let i = 0; i < PLANE_COUNT; i++) {
        const materialInstance = material.clone();
        const meshInstance = new THREE.Mesh(geometry, materialInstance);

        meshInstance.position.z = i * PLANE_OFFSET;
        meshInstance.material.uniforms.time.value += i / 6;

        planes.push(meshInstance);
        group.add(meshInstance);
    }

    group.position.z = (-PLANE_COUNT / 2) * PLANE_OFFSET;
    scene.add(group);

    camera.position.z = 1.8;
    scene.background = new THREE.Color(0x000);

    return ({ renderer }) => {
        planes.forEach(plane => {
            plane.material.uniforms.time.value += 0.0018;
        });

        renderer.render(scene, camera);
    };
};

const S151120 = () => <ThreeRenderer sketch={sketch} />;

export default S151120;
