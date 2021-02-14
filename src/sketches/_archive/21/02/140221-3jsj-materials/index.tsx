/* eslint-disable no-console */
// lesson 11: https://threejs-journey.xyz/lessons/12

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
// import matcap from "./textures/matcaps/7.png";
// import gradient from "./textures/gradients/5.jpg";
import cubenx from "./textures/environmentMaps/3/nx.jpg";
import cubeny from "./textures/environmentMaps/3/ny.jpg";
import cubenz from "./textures/environmentMaps/3/nz.jpg";
import cubepx from "./textures/environmentMaps/3/px.jpg";
import cubepy from "./textures/environmentMaps/3/py.jpg";
import cubepz from "./textures/environmentMaps/3/pz.jpg";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
    camera.position.z = 5;
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const textureLoader = new THREE.TextureLoader();
    // const doorColorTexture = textureLoader.load(color);
    // const doorAlphaTexture = textureLoader.load(alpha);
    // const doorHeightTexture = textureLoader.load(height);
    // const doorNormalTexture = textureLoader.load(normal);
    // const doorAOTexture = textureLoader.load(ambientOcclusion);
    // const doorMetalnessTexture = textureLoader.load(metalness);
    // const doorRoughnessTexture = textureLoader.load(roughness);

    /** Find matcaps at: https://github.com/nidorx/matcaps */
    // const matcapTexture = textureLoader.load(matcap);
    // const gradientTexture = textureLoader.load(gradient);
    // gradientTexture.minFilter = THREE.NearestFilter;
    // gradientTexture.magFilter = THREE.NearestFilter;
    // gradientTexture.generateMipmaps = false;

    /** HDRIs at: https://hdrihaven.com/ */
    /** Convert HDRI to cubemap: https://matheowis.github.io/HDRI-to-CubeMap/ */
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMapTexture = cubeTextureLoader.load([
        cubenx,
        cubeny,
        cubenz,
        cubepx,
        cubepy,
        cubepz,
    ]);

    /**
     * No lights
     */
    // const material = new THREE.MeshBasicMaterial({
    //     map: doorColorTexture,
    //     alphaMap: doorAlphaTexture,
    //     transparent: true,
    //     side: THREE.DoubleSide,
    // });
    // const material = new THREE.MeshNormalMaterial({ flatShading: true });
    // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
    // const material = new THREE.MeshDepthMaterial();

    /**
     * With lights
     */
    // const material = new THREE.MeshLambertMaterial();
    // const material = new THREE.MeshPhongMaterial({
    //     shininess: 1000,
    //     specular: 0x1188ff,
    // });
    // const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });
    // const material = new THREE.MeshStandardMaterial({
    //     side: THREE.DoubleSide,
    //     // roughness: 0.2,
    //     // metalness: 0.7,
    //     map: doorColorTexture,
    //     aoMap: doorAOTexture,
    //     aoMapIntensity: 2,
    //     displacementMap: doorHeightTexture,
    //     displacementScale: 0.07,
    //     metalnessMap: doorMetalnessTexture,
    //     roughnessMap: doorRoughnessTexture,
    //     normalMap: doorNormalTexture,
    //     normalScale: new THREE.Vector2(2, 2),
    //     alphaMap: doorAlphaTexture,
    //     transparent: true,
    // });
    const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        roughness: 0.1,
        metalness: 0.7,
        envMap: environmentMapTexture,
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 3, 4);
    scene.add(ambientLight, pointLight);

    const sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1, 64, 64),
        material
    );
    sphere.geometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );
    sphere.position.x = -3;

    const plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2, 2, 100, 100),
        material
    );
    plane.geometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );

    const torus = new THREE.Mesh(
        new THREE.TorusBufferGeometry(0.7, 0.3, 64, 128),
        material
    );
    torus.geometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    );
    torus.position.x = 3;

    scene.add(sphere, plane, torus);

    return ({ elapsedTime }) => {
        controls.update();

        sphere.rotation.y = 0.0003 * elapsedTime;
        plane.rotation.y = 0.0003 * elapsedTime;
        torus.rotation.y = 0.0003 * elapsedTime;

        sphere.rotation.x = 0.0003 * elapsedTime;
        plane.rotation.x = 0.0003 * elapsedTime;
        torus.rotation.x = 0.0003 * elapsedTime;
    };
};

const S311020 = () => <ThreeRenderer sketch={sketch} />;

export default S311020;
