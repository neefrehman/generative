import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

import { getShortestViewportDimension } from "Utils/math";
import { createSign, inRange } from "Utils/random";

const shortestDimension = getShortestViewportDimension({ cap: 900 });

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const PLANE_COUNT = Math.min(16, Math.floor(shortestDimension / 45));
    const PLANE_OFFSET = 0.035;

    const geometry = new THREE.PlaneBufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: inRange(100) },
            alpha: { value: 1 },
            u_color: { value: new THREE.Color("#f32d94") },
        },
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

            varying vec2 vUv;
            uniform float time;
            uniform float alpha;
            uniform vec3 u_color;

            void main () {
                vec3 color = vec3(0.0);
                vec2 pos = vec2(vUv * 2.0);

                float DF = 0.0;

                float a = 0.0;
                vec2 vel = vec2(time * 0.1);
                DF -= noise(pos + vel) * 0.25 + 0.25;

                a = noise(pos * vec2(cos(time * 0.15), sin(time * 0.1)) * 0.1) * PI;
                vel = vec2(cos(a), sin(a));
                DF += noise(pos + vel) * 0.25 + 0.25;

                vec3 fragColor = mix(u_color, vec3(1.0), alpha);

                gl_FragColor = vec4(vec3(1.02 - fragColor / alpha), 1.0 - step(0.7, fract(DF)));
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
        meshInstance.material.uniforms.time.value += i / 2;
        meshInstance.material.uniforms.alpha.value += i / PLANE_COUNT;

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
    scene.background = new THREE.Color(0x000);

    const direction = createSign();

    return ({ renderer }) => {
        planes.forEach(plane => {
            plane.material.uniforms.time.value += 0.025 * direction;
        });

        renderer.render(scene, camera);
    };
};

const S181120 = () => <ThreeRenderer sketch={sketch} />;

export default S181120;