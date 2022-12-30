import React from "react";
import * as THREE from "three";
import gsap from "gsap";
import palettes from "nice-color-palettes";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn, ThreeRendererSettings } from "Renderers/Three";

import { pick } from "Utils/random";
import { getAspectRatio } from "Utils/math";

const CAM_PLANES = getAspectRatio() * 2.5;
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

  const palette = pick(palettes);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: pick(palette) });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });
  tl.to(cube.position, { duration: 1, delay: 0.2, x: 2 });
  tl.to(cube.position, { duration: 1, delay: 0.2, x: 0 });
  tl.to(cube.position, { duration: 1, delay: 0.2, x: -2 });
  tl.to(cube.position, { duration: 1, delay: 0.2, x: 0 });

  return () => null;
};

const S311020 = () => <ThreeRenderer sketch={sketch} settings={settings} />;

export default S311020;
