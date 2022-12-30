import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import type { ThreeSetupFn } from "Renderers/Three";
import { ThreeRenderer } from "Renderers/Three";

const sketch: ThreeSetupFn = ({ scene, camera, canvas }) => {
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;

  const baseGeometry = new THREE.IcosahedronGeometry(1, 1);
  // @ts-ignore - deprecated in three
  const points = baseGeometry.vertices;

  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const material = new THREE.ShaderMaterial({
    defines: { POINT_COUNT: points.length },
    uniforms: {
      points: { value: points },
      time: { value: 0.0 },
      color: { value: new THREE.Color("#f32d94") },
    },
    vertexShader: glsl`
            varying vec2 vUv;
            varying vec3 vPosition;
            void main () {
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
            }
        `,
    fragmentShader: glsl`
            varying vec2 vUv;
            varying vec3 vPosition;

            uniform float time;
            uniform vec3 color;
            uniform vec3 points[POINT_COUNT];

            void main () {
                float dist = 10000.0;

                for (int i =0; i < POINT_COUNT; i++) {
                    vec3 p = points[i];
                    float d = distance(vPosition, p);
                    dist = min(d, dist);
                }

                float mask = step(0.2, dist);
                mask = 1.0 - mask;

                vec3 fragColor = mix(color, vec3(1.0), mask);

                gl_FragColor = vec4(vec3(fragColor), 1.0);
            }
        `,
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 2.3;

  return () => {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    material.uniforms.time.value += 0.02;
  };
};

const DThreeRendererTest = () => <ThreeRenderer sketch={sketch} />;

export default DThreeRendererTest;
