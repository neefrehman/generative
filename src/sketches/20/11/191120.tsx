import React from "react";
import * as THREE from "three";
import glsl from "glslify";
import palettes from "nice-color-palettes";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

import { inRange, pick } from "Utils/random";

const sketch: ThreeSetupFn = ({ scene }) => {
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const PLANE_COUNT = 5; // max 10
    const PLANE_OFFSET = 0.02;

    const palette = pick(palettes);

    const geometry = new THREE.PlaneBufferGeometry(1.1, 1.1);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: inRange(100) },
            layerNumber: { value: 1 },
            u_color: { value: undefined },
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
            uniform float layerNumber;
            uniform vec3 u_color;

            void main () {
                vec2 pos = vec2(vUv * 2.0);

                float DF = 0.0;

                float a = 0.0;
                vec2 vel = vec2(time * 0.1);
                DF += noise(pos + vel) * 0.35 + 0.25;

                a = noise(pos * vec2(cos(time * 0.15), sin(time * 0.1)) * 0.1) * PI;
                vel = vec2(cos(a), sin(a));
                DF += noise(pos + vel) * 0.35 + 0.35;

                float blurriness = 0.005 * layerNumber;
                float alpha = 1.0 - smoothstep(0.7, 0.7 + blurriness, fract(DF));

                gl_FragColor = vec4(u_color, alpha);
            }
        `,
    });

    const planes: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[] = [];
    const group = new THREE.Group();

    for (let i = 0; i < PLANE_COUNT; i++) {
        const materialInstance = material.clone();
        const meshInstance = new THREE.Mesh(geometry, materialInstance);

        meshInstance.position.z = -i * PLANE_OFFSET;

        meshInstance.material.uniforms.time.value += i / 2.3;
        meshInstance.material.uniforms.layerNumber.value += i / PLANE_COUNT;
        meshInstance.material.uniforms.u_color.value = new THREE.Color(
            palette[i <= 5 ? i : i - 5]
        );

        planes.push(meshInstance);
        group.add(meshInstance);
    }

    group.position.z = (-PLANE_COUNT / 2) * PLANE_OFFSET;

    scene.add(group);

    scene.background = new THREE.Color(0x000);

    return ({ renderer }) => {
        planes.forEach(plane => {
            plane.material.uniforms.time.value -= 0.018;
        });

        renderer.render(scene, camera);
    };
};

const S191120 = () => <ThreeRenderer sketch={sketch} />;

export default S191120;
