// lesson 9

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
  camera.position.z = 5;
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // const geometry = new THREE.BoxBufferGeometry(2, 2, 2, 3, 3, 3);
  const geometry = new THREE.BufferGeometry();

  /* Make a triangle: */
  // prettier-ignore
  // const positionsArray = new Float32Array([
  //     0, 0, 0,
  //     0, 1, 0,
  //     1, 0, 0
  // ]);
  // normalised to three, because the array is full of 3d vectors (uv would be 2)
  // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

  /* Make a geometry with random values */
  const TRIANGLE_COUNT = 100;
  const positionsArray = new Float32Array(TRIANGLE_COUNT * 3 * 3);
  positionsArray.forEach((_, i) => {
    positionsArray[i] = (Math.random() - 0.5) * 3;
  });
  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

  geometry.setAttribute("position", positionsAttribute); // "position" is shader attribute

  // const material = new THREE.MeshBasicMaterial();
  const material = new THREE.MeshBasicMaterial({ wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  return () => {
    // keep OrbitControls damping even after the user stops pressing the mouse
    controls.update();
  };
};

const S311020 = () => <ThreeRenderer sketch={sketch} />;

export default S311020;
