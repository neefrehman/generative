/* eslint-disable no-console */
// lesson 11: https://threejs-journey.xyz/lessons/11

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn } from "Renderers/Three";

// import color from "./textures/door/color.jpg";
// import alpha from "./textures/door/alpha.jpg";
// import height from "./textures/door/height.jpg";
// import normal from "./textures/door/normal.jpg";
// import ambientOcclusion from "./textures/door/ambientOcclusion.jpg";
// import metalness from "./textures/door/metalness.jpg";
// import roughness from "./textures/door/roughness.jpg";
// import checkerboard8x8 from "./textures/checkerboard-8x8.png";
// import checkerboard1024x1024 from "./textures/checkerboard-1024x1024.png";
import minecraft from "./textures/minecraft.png";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
    camera.position.z = 5;
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * TEXTURES - Native js
     */
    // const image = new Image();
    // const texture = new THREE.Texture(image);
    // image.src = color;
    // image.onload = () => {
    //     texture.needsUpdate = true;
    // };

    /**
     * TEXTURES - THREE.TextureLoader
     */
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => console.log("onStart");
    loadingManager.onLoad = () => console.log("onLoad");
    loadingManager.onProgress = () => console.log("onProgress");
    loadingManager.onError = () => console.log("onError");

    const textureLoader = new THREE.TextureLoader(loadingManager);
    // const colorTexture = textureLoader.load(
    //     color
    //     // () => console.log("load"),
    //     // () => console.log("progress"), // not really needed
    //     // () => console.log("error")
    // );
    // const alphaTexture = textureLoader.load(alpha);
    // const heightTexture = textureLoader.load(height);
    // const normalTexture = textureLoader.load(normal);
    // const ambientOcclusionTexture = textureLoader.load(ambientOcclusion);
    // const metalnessTexture = textureLoader.load(metalness);
    // const roughnessTexture = textureLoader.load(roughness);

    // const colorTexture = textureLoader.load(checkerboard1024x1024);
    // const colorTexture = textureLoader.load(checkerboard8x8);
    const colorTexture = textureLoader.load(minecraft);

    /**
     * TEXTURE TRANSFORMS
     */
    // colorTexture.repeat.x = 2;
    // colorTexture.repeat.y = 3;
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
    // colorTexture.wrapT = THREE.RepeatWrapping;
    // colorTexture.offset.x = 0.5;
    // colorTexture.offset.y = 0.5;
    // colorTexture.rotation = Math.PI * 0.25;
    // colorTexture.center.x = 0.5;
    // colorTexture.center.y = 0.5;

    /**
     * TEXTURE FILTERS
     */
    // colorTexture.minFilter = THREE.LinearFilter;
    // colorTexture.magFilter = THREE.LinearFilter;
    colorTexture.minFilter = THREE.NearestFilter; // sharper when shrunk - better perf
    colorTexture.magFilter = THREE.NearestFilter; // sharper when stretched - better perf
    colorTexture.generateMipmaps = false; // when using NearestFilter - better perf

    /**
     * Where to find textures?
     * @link https://poliigon.com
     * @link https://3dtextures.me
     * @link https://arroway-textures.ch
     * @link https://substance3d.com/products/substance-designer/
     */

    /**
     * Create mesh
     */
    // const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
        map: colorTexture,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    return () => {
        controls.update();
    };
};

const S311020 = () => <ThreeRenderer sketch={sketch} />;

export default S311020;
