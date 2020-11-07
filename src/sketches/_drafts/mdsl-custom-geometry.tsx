import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const geometry = new THREE.Geometry();

    geometry.vertices = [
        new THREE.Vector3(-0.5, 0.5, 0),
        new THREE.Vector3(0.5, -0.5, 0),
        new THREE.Vector3(-0.5, -0.5, 0),
        new THREE.Vector3(0.5, 0.5, 0),
    ];

    geometry.faces = [new THREE.Face3(0, 1, 2), new THREE.Face3(3, 1, 0)];

    geometry.computeFaceNormals();

    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 1;
    scene.add(cube);

    camera.position.z = 5;

    scene.add(new THREE.GridHelper(10, 10));

    return ({ renderer }) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };
};

const DThreeRendererTest = () => <ThreeRenderer sketch={sketch} />;

export default DThreeRendererTest;
