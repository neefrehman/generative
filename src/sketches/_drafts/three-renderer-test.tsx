import React from "react";
import * as THREE from "three";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, camera, width, height }) => {
    camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.current.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    return () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    };
};

const DThreeRendererTest = () => <ThreeRenderer sketch={sketch} />;

export default DThreeRendererTest;
