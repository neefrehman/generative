import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import type { ThreeSetupFn } from "Renderers/Three";
import { ThreeRenderer } from "Renderers/Three";

import { getShortestViewportDimension } from "Utils/math";
import { inRange } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ cap: 900 });

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const PLANE_COUNT = Math.min(16, Math.floor(shortestDimension / 45));
    const PLANE_OFFSET = 0.05;

    const geometry = new THREE.PlaneBufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: inRange(100) }, alpha: { value: 1 } },
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
            #pragma glslify: noise = require("glsl-noise/simplex/2d");
            #define PI 3.1415;

            uniform float time;
            uniform float alpha;
            varying vec2 vUv;

            void main () {
                vec3 color = vec3(0.0);
                vec2 pos = vec2(vUv * 3.0);

                float DF = 0.0;

                float a = 0.0;
                vec2 vel = vec2(time * 0.1);
                DF += noise(pos + vel) * 0.25 + 0.25;

                a = noise(pos * vec2(cos(time * 0.15), sin(time * 0.1)) * 0.1) * PI;
                vel = vec2(cos(a), sin(a));
                DF += noise(pos + vel) * 0.25 + 0.25;

                color = vec3(1.0 - smoothstep(0.7, 0.72, fract(DF)));
                vec3 fragColor = 1.0 - mix(color, vec3(0.5), alpha);

                gl_FragColor = vec4(fragColor, step(0.7, fract(DF)));
            }
        `,
    });

    const planes: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[] = [];
    const group = new THREE.Group();

    for (let i = 0; i < PLANE_COUNT; i++) {
        const materialInstance = material.clone();
        const meshInstance = new THREE.Mesh(geometry, materialInstance);

        meshInstance.position.x = i * PLANE_OFFSET;
        meshInstance.position.y = i * PLANE_OFFSET;
        meshInstance.position.z = i * PLANE_OFFSET;
        meshInstance.material.uniforms.time.value += i / 3;
        meshInstance.material.uniforms.alpha.value += i / (PLANE_COUNT / 2);

        planes.push(meshInstance);
        group.add(meshInstance);
    }

    group.position.x = (PLANE_COUNT / 2) * PLANE_OFFSET;
    group.position.y = (PLANE_COUNT / 2) * PLANE_OFFSET;
    group.position.z = (-PLANE_COUNT / 2) * PLANE_OFFSET;

    group.rotation.x = Math.PI;
    group.rotation.y = Math.PI * 1.1;

    scene.add(group);

    camera.position.z = 2;
    scene.background = new THREE.Color(0xffffff);

    return ({ renderer }) => {
        planes.forEach(plane => {
            plane.material.uniforms.time.value += 0.02;
        });

        renderer.render(scene, camera);
    };
};

const S171120 = () => <ThreeRenderer sketch={sketch} />;

export default S171120;
