import glsl from "glslify";
import { Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { createUniformDict } from "Utils/shaders";

/**
 * Creates a fullscreen three plane which renders custom shaders.
 * Your camera must be set to the below fo rit to work:
 *
 * @param uniforms The unforms for your shaders
 * @param vert A vertex shader string
 * @param frag A fragment shader string
 * 
 * @example
 * const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
 * 
 * const quad = createShaderQuad({
        uniforms: { time: 0 },
        frag: glsl`
                uniform float time;
                varying vec2 vUv;

                void main() {
                    vec2 center = vUv - 0.5;
                    vec3 color = hsl2rgb(0.75 + center + time * 0.15, 0.5, 0.5);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
    });
 */
export const createShaderQuad = ({
    uniforms,
    vert,
    frag,
}: {
    uniforms?: {
        [value: string]: any;
    };
    vert?: string;
    frag?: string;
}): Mesh<PlaneGeometry, ShaderMaterial> => {
    const quad = new Mesh(
        new PlaneGeometry(2, 2),
        new ShaderMaterial({
            uniforms: uniforms[0]?.value ? uniforms : createUniformDict(uniforms),
            vertexShader:
                vert ??
                glsl`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position, 1.0);    
                    }
                `,
            fragmentShader:
                frag ??
                glsl`
                    varying vec2 vUv;
                    void main() {
                        gl_FragColor = vec4(1.0);
                    }
                `,
            depthWrite: false,
            depthTest: false,
        })
    );

    return quad;
};
