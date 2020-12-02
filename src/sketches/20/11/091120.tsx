import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const geometry = new THREE.SphereGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0.0 } },
        vertexShader: glsl`
            varying vec2 vUv;
            void main () {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
            }
        `,
        fragmentShader: glsl`
            varying vec2 vUv;
            uniform float time;
            void main () {
                vec2 center = vec2(0.5);
                vec2 pos = mod(vUv * 5.0, 1.0);
                float dist = distance(pos, center);
                float mask = step(0.2 + sin(time * vUv.x * 0.5), dist);
                mask = 1.0 - mask;

                gl_FragColor = vec4(vec3(mask), 0.5);
            }
        `,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 2.3;

    return ({ renderer, elapsedTime }) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        material.uniforms.time.value = elapsedTime;

        renderer.render(scene, camera);
    };
};

const S091120 = () => <ThreeRenderer sketch={sketch} />;

export default S091120;
