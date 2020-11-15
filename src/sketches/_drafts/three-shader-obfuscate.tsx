import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

import { inRange } from "Utils/random";

const sketch: ThreeSetupFn = ({ scene, width, height }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const sphereGeometry = new THREE.SphereGeometry();
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: "#f32d94",
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(2, 2, 2);
    scene.add(ambientLight, pointLight);

    const planeGeometry = new THREE.PlaneBufferGeometry(1.5, 1.5);
    const planeMaterial = new THREE.ShaderMaterial({
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
                gl_FragColor = vec4(vec3(0.0), n);
            }
        `,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    sphere.position.z = -1;
    camera.position.z = 2.3;

    return ({ renderer }) => {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        plane.material.uniforms.time.value += 0.01;

        renderer.render(scene, camera);
    };
};

const S201120 = () => <ThreeRenderer sketch={sketch} />;

export default S201120;
