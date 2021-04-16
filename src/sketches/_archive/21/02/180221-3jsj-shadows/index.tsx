// lesson 15

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeRenderer } from "Renderers/Three";
import type { ThreeSetupFn } from "Renderers/Three";

// import bakedShadow from "./bakedShadow.jpg";
import simpleShadow from "./simpleShadow.jpg";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
    camera.position.z = 5;
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // good perf
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff9000, 0.4); // medium perf
    directionalLight.position.set(2, 1, 2);
    directionalLight.castShadow = true;
    // Larger pixel sampling - better definition
    directionalLight.shadow.mapSize.x = 1024;
    directionalLight.shadow.mapSize.y = 1024;
    // smaller camera - more precise
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 10;
    directionalLight.shadow.camera.left = -1;
    directionalLight.shadow.camera.right = 1;
    directionalLight.shadow.camera.bottom = -1;
    directionalLight.shadow.camera.top = 1;
    // blur
    directionalLight.shadow.radius = 10;
    scene.add(directionalLight);

    // Is Orthographic for directional light (Perspective for point/spot)
    // const directionalLightCameraHelper = new THREE.CameraHelper(
    //     directionalLight.shadow.camera
    // );
    // scene.add(directionalLightCameraHelper);

    const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
    spotLight.position.set(0, 2, 3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;
    scene.add(spotLight, spotLight.target);

    // const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    // scene.add(spotLightCameraHelper);

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-1, 1, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.set(1024, 1024);
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 5;
    scene.add(pointLight);

    // const pointLightCameraHelper = new THREE.CameraHelper(
    //     pointLight.shadow.camera
    // );
    // scene.add(pointLightCameraHelper);

    const textureLoader = new THREE.TextureLoader();
    // const bakedShadowTexture = textureLoader.load(bakedShadow);
    const simpleShadowTexture = textureLoader.load(simpleShadow);

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.4;

    // Objects
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        // new THREE.MeshBasicMaterial({ map: bakedShadowTexture })
        material
    );
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    scene.add(plane);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
    sphere.castShadow = true;

    const shadowPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1.4, 1.4),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            alphaMap: simpleShadowTexture,
            transparent: true,
        })
    );
    shadowPlane.rotateX(-Math.PI * 0.5);
    shadowPlane.position.y = plane.position.y + 0.01; // avoids z-fighting
    const sphereGroup = new THREE.Group();
    sphereGroup.add(sphere, shadowPlane);
    scene.add(sphereGroup);

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return ({ elapsedTime }) => {
        const time = elapsedTime / 1000;

        sphereGroup.position.x = Math.sin(time);
        sphereGroup.position.z = Math.cos(time);

        sphere.position.y = Math.abs(Math.cos(time * 3));
        shadowPlane.material.opacity = (1 - sphere.position.y) * 0.4;

        controls.update();
    };
};

const A150221 = () => <ThreeRenderer sketch={sketch} />;

export default A150221;
