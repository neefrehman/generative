import React from "react";
import * as THREE from "three";
import glsl from "glslify";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ThreeRenderer, ThreeSetupFn } from "Renderers/Three";

import { isWebGL2Supported } from "helpers/isWebGL2Supported";
import { TextOverlay } from "components/TextOverlay";

import { perlin3D } from "Utils/random";

export const generateTexture = (
    size: number,
    data: Uint8Array,
    vector: THREE.Vector3,
    texture: THREE.DataTexture3D,
    time: number
) => {
    let i = 0;
    for (let z = 0; z < size; z++) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                vector.set(x, y, z).divideScalar(size).addScalar(time);

                const d = perlin3D(vector.x, vector.y, vector.z, {
                    frequency: 3,
                });

                data[(i += 1)] = d * 128 + 128;
            }
        }
    }

    texture.needsUpdate = true;
};

const sketch: ThreeSetupFn = ({ scene, width, height, canvas }) => {
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(1.2, -0.9, -1.5);
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    const size = 64;
    const data = new Uint8Array(size * size * size);
    const vector = new THREE.Vector3();

    const texture = new THREE.DataTexture3D(data, size, size, size);
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;

    const vertexShader = glsl`
        varying vec3 vOrigin;
        varying vec3 vDirection;
        uniform vec3 cameraPos;

        void main() {
            vOrigin = vec3(inverse(modelMatrix) * vec4(cameraPos, 1.0)).xyz;
            vDirection = position - vOrigin;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = glsl`
        precision highp sampler3D;

        #define epsilon .0001

        varying vec3 vOrigin;
        varying vec3 vDirection;

        uniform sampler3D map;
        uniform float threshold;
        uniform float steps;

        vec2 hitBox(vec3 orig, vec3 dir) {
            const vec3 box_min = vec3(-0.5);
            const vec3 box_max = vec3(0.5);
            vec3 inv_dir = 1.0 / dir;
            vec3 tmin_tmp = (box_min - orig) * inv_dir;
            vec3 tmax_tmp = (box_max - orig) * inv_dir;
            vec3 tmin = min(tmin_tmp, tmax_tmp);
            vec3 tmax = max(tmin_tmp, tmax_tmp);
            float t0 = max(tmin.x, max(tmin.y, tmin.z));
            float t1 = min(tmax.x, min(tmax.y, tmax.z));
            return vec2(t0, t1);
        }

        float sample1(vec3 p) {
            return texture(map, p).r;
        }

        vec3 normal(vec3 coord) {
            if (coord.x < epsilon) return vec3(1.0, 0.0, 0.0);
            if (coord.y < epsilon) return vec3(0.0, 1.0, 0.0);
            if (coord.z < epsilon) return vec3(0.0, 0.0, 1.0);
            if (coord.x > 1.0 - epsilon) return vec3(-1.0, 0.0, 0.0);
            if (coord.y > 1.0 - epsilon) return vec3(0.0, -1.0, 0.0);
            if (coord.z > 1.0 - epsilon) return vec3(0.0, 0.0, -1.0);

            float step = 0.01;
            float x = sample1(coord + vec3(-step, 0.0, 0.0)) - sample1(coord + vec3(step, 0.0, 0.0));
            float y = sample1(coord + vec3(0.0, -step, 0.0)) - sample1(coord + vec3(0.0, step, 0.0));
            float z = sample1(coord + vec3(0.0, 0.0, -step)) - sample1(coord + vec3(0.0, 0.0, step));

            return normalize(vec3(x, y, z));
        }

        void main() {
            vec3 rayDir = normalize(vDirection);
            vec2 bounds = hitBox(vOrigin, rayDir);

            if (bounds.x > bounds.y) discard;

            bounds.x = max(bounds.x, 0.0);

            vec3 p = vOrigin + bounds.x * rayDir;
            vec3 inc = 1.0 / abs(rayDir);
            float delta = min(inc.x, min(inc.y, inc.z));
            delta /= steps;

            vec4 color;
            for (float t = bounds.x; t < bounds.y; t += delta) {
                float d = sample1(p + 0.5);

                if (sin(d * 33.3) > threshold) {
                    color.rgb = normal(p + 0.5) * 0.25 + (p * 1.5 + 0.25);
                    color.a = 1.0;
                    break;
                }

                p += rayDir * delta;
            }

            gl_FragColor = vec4(color);
        }
    `;

    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture },
            cameraPos: { value: new THREE.Vector3() },
            threshold: { value: 0.5 },
            steps: { value: 200 },
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return ({ renderer, time }) => {
        material.uniforms.cameraPos.value.copy(camera.position);
        generateTexture(size, data, vector, texture, time / 20000);

        renderer.render(scene, camera);
    };
};

const S191120 = () =>
    isWebGL2Supported() ? (
        <ThreeRenderer sketch={sketch} />
    ) : (
        <TextOverlay text="Your browser doesn't support WebGL2" timeout={false} />
    );

export default S191120;
