// lesson 7 https://threejs-journey.xyz/lessons/7

import React from "react";
import * as THREE from "three";
import palettes from "nice-color-palettes";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn } from "Renderers/Three";

import { pick } from "Utils/random";

const sketch: ThreeSetupFn = ({ scene, camera }) => {
    camera.position.z = 5;

    const palette = pick(palettes);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: pick(palette) });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    return ({ normalisedMousePosition: [mouseX, mouseY] }) => {
        // camera.position.x = 5 * (mouseX - 0.5);
        // camera.position.y = 5 * -(mouseY - 0.5);
        camera.position.x = Math.sin(mouseX * Math.PI * 2) * 3;
        camera.position.z = Math.cos(mouseX * Math.PI * 2) * 3;
        // camera.position.y = Math.cos(mouseY * Math.PI * 2) * 3;
        camera.position.y = (mouseY - 0.5) * 6;
        camera.lookAt(cube.position);
    };
};

const S311020 = () => <ThreeRenderer sketch={sketch} />;

export default S311020;
