// lesson 14

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
  camera.position.z = 5;
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // good perf
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00fffc, 0.3); // medium perf
  dirLight.position.set(-1, 2, 2);
  scene.add(dirLight);

  const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3); // good perf
  scene.add(hemisphereLight);

  const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2); // medium perf
  pointLight.position.set(2, 1, 2);
  scene.add(pointLight);

  // Only works with Standard/Physical material
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1); // bad perf
  rectAreaLight.position.set(-1.5, 0, 1.5);
  rectAreaLight.lookAt(new THREE.Vector3());
  scene.add(rectAreaLight);

  const spotLight = new THREE.SpotLight( // bad perf
    0x78ff00,
    0.3,
    10,
    Math.PI * 0.1,
    0.25, // sharpness
    1
  );
  spotLight.position.set(0, 2, 3);
  scene.add(spotLight, spotLight.target);
  spotLight.target.position.x = -0.75;

  /**
   * Helpers
   */
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    0.2
  );
  scene.add(hemisphereLightHelper);

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.2);
  scene.add(dirLightHelper);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
  scene.add(pointLightHelper);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
  scene.add(spotLightHelper);

  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.2);
  scene.add(rectAreaLightHelper);

  /**
   * Objects
   */
  // Material
  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.4;

  // Objects
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
  sphere.position.x = -1.5;

  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
  torus.position.x = 1.5;

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.65;

  scene.add(sphere, cube, torus, plane);

  return ({ elapsedTime }) => {
    const time = elapsedTime / 1000;
    sphere.rotation.y = 0.1 * time;
    cube.rotation.y = 0.1 * time;
    torus.rotation.y = 0.1 * time;

    sphere.rotation.x = 0.15 * time;
    cube.rotation.x = 0.15 * time;
    torus.rotation.x = 0.15 * time;

    controls.update();
    spotLightHelper.update(); // Needs to be updated on the NEXT frame after moving
  };
};

const A150221 = () => <ThreeRenderer sketch={sketch} />;

export default A150221;
