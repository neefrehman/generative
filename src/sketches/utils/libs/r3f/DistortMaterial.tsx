import React, { useRef } from "react";
import { extend, useFrame } from "react-three-fiber";
import { shaderMaterial } from "drei/shaders/shaderMaterial";
import glsl from "glslify";

// Attempted implementation of: https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
// with r3f. Working ok.

const DistortMaterial = ({ speed }: { speed: number }) => {
    const DistortShaderMaterial = shaderMaterial(
        { time: 0 },
        glsl`
            #pragma glslify: pnoise = require(glsl-noise/periodic/3d);
            varying vec2 vUv;
            varying float noise;
            uniform float time;

            float turbulence( vec3 p ) {
                float w = 100.0;
                float t = -.5;

                for (float f = 1.0 ; f <= 10.0 ; f++ ){
                    float power = pow( 2.0, f );
                    t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
                }

                return t;
            }

            void main() {
                vUv = uv;

                noise = 10.0 *  -.10 * turbulence( .5 * normal + time );
                float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
                float displacement = - noise + b;

                vec3 newPosition = position + normal * displacement;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            }
        `,
        glsl`
            varying vec2 vUv;
            varying float noise;

            void main() {
                vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );
                gl_FragColor = vec4( color.rgb, 1.0 );
            }
        `
    );
    extend({ DistortShaderMaterial });

    const ref = useRef({ time: 0 });
    useFrame(({ frames }) => {
        ref.current.time += 0.00025 * frames * speed;
    });

    // @ts-expect-error: extended things DO exist!
    return <distortShaderMaterial ref={ref} />;
};

export default DistortMaterial;
