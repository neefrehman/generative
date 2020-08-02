import React from "react";
import * as THREE from "three";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, width, height }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    return ({ renderer }) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
};

const S020820 = () => <ThreeRenderer sketch={sketch} />;

export default S020820;
