import glsl from "glslify";
import { Mesh, PlaneGeometry, ShaderMaterial } from "three";

import { createUniformSchema } from "Utils/shaders";

/**
 * Creates a fullscreen three plane which renders custom shaders.
 * Your camera must be set to the below fo rit to work:
 *
 * `const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);`
 *
 * @param vert A vertex shader string
 * @param frag A fragment shader string
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
            uniforms: uniforms[1]?.value
                ? uniforms
                : createUniformSchema(uniforms),
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
