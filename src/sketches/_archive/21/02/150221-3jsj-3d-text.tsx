// lesson 14

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import helvetikerRegular from "three/examples/fonts/helvetiker_regular.typeface.json";
import { Font, TextGeometry } from "three-stdlib";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn } from "Renderers/Three";

import matcap from "./140221-3jsj-materials/textures/matcaps/7.png";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
  camera.position.z = 5;
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // To convert fonts to JSON: http://gero3.github.io/facetype.js/

  /** if using urls */
  // const fontLoader = new THREE.FontLoader();
  // fontLoader.load("font_path.json", font => {
  //     console.log("loaded");
  // });

  // scene.add(new THREE.AxesHelper());

  const BEVEL_THICKNESS = 0.03;
  const BEVEL_SIZE = 0.02;
  const textGeometry = new TextGeometry("hello it's neef :—)", {
    font: new Font(helvetikerRegular as any),
    size: 0.6,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: BEVEL_THICKNESS,
    bevelSize: BEVEL_SIZE,
    bevelOffset: 0,
  });
  textGeometry.center();
  /** manual centering below */
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //     (-textGeometry.boundingBox.max.x - BEVEL_SIZE) * 0.5,
  //     (-textGeometry.boundingBox.max.y - BEVEL_SIZE) * 0.5,
  //     (-textGeometry.boundingBox.max.z - BEVEL_THICKNESS) * 0.5
  // );

  const textureLoader = new THREE.TextureLoader();
  const matcapTexture = textureLoader.load(matcap);
  // const textMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  for (let i = 0; i < 200; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const donutScale = Math.max(0.33, Math.random());
    donut.scale.set(donutScale, donutScale, donutScale);
    scene.add(donut);
  }

  return () => {
    controls.update();
  };
};

const A150221 = () => <ThreeRenderer sketch={sketch} />;

export default A150221;
