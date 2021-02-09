import React from "react";
import * as THREE from "three";
import palettes from "nice-color-palettes";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn, ThreeRendererSettings } from "Renderers/Three";

import { inGaussian, pick } from "Utils/random";
import { expoInOut } from "Utils/eases";

const CAM_PLANES = (window.innerHeight / window.innerHeight) * 2.5;
const settings: ThreeRendererSettings = {
    camera: new THREE.OrthographicCamera(
        -CAM_PLANES,
        CAM_PLANES,
        CAM_PLANES,
        -CAM_PLANES
    ),
};

const sketch: ThreeSetupFn = ({ scene, camera }) => {
    camera.position.z = 5;

    const CUBOID_COUNT = 40;
    const palette = pick(palettes);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < CUBOID_COUNT; i++) {
        const material = new THREE.MeshStandardMaterial({ color: pick(palette) });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.set(inGaussian(0, 1), inGaussian(0, 1), inGaussian(0, 1));
        cube.scale.set(inGaussian(0, 1), inGaussian(0, 1), inGaussian(0, 1));
        cube.scale.multiplyScalar(0.4);

        scene.add(cube);
    }

    const light = new THREE.DirectionalLight("white", 1);
    light.position.set(0, 4, 0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);

    return ({ elapsedTime }) => {
        const t = Math.sin(elapsedTime * 0.00055 * Math.PI);
        scene.rotation.x = expoInOut(t);
        scene.rotation.y = expoInOut(t);
    };
};

const S311020 = () => <ThreeRenderer sketch={sketch} settings={settings} />;

export default S311020;
