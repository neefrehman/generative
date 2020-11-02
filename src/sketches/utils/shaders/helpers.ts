import { UniformDict } from "./types";

/**
 * Takes a simple uniform structure of { key: value } and translates it
 * to a structure of { key: { value } } to help structure.
 */
export const createUniformDict = (simpleUniforms: {
    [value: string]: any;
}): UniformDict => {
    const entries = Object.entries(simpleUniforms);

    const uniforms = entries.reduce((acc, [key, value]) => {
        const currentUniform: UniformDict = {};
        currentUniform[key] = { value };

        return { ...acc, ...currentUniform };
    }, {});

    return uniforms;
};

/**
 * Utility to throw error on shader compilation failure
 */
export const compileShader = (
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    shaderSource: string,
    shaderType: typeof gl.VERTEX_SHADER | typeof gl.FRAGMENT_SHADER
): WebGLShader => {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
            `Shader compile failed with: ${gl.getShaderInfoLog(shader)})`
        );
    }

    return shader;
};

/**
 * Utility to throw error if it fails to find the attribute
 */
export const getAttributeLocation = (
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    program: WebGLProgram,
    name: string
): number => {
    const attributeLocation = gl.getAttribLocation(program, name);

    if (attributeLocation === -1) {
        throw new Error(`Can not find attribute ${name}`);
    }

    return attributeLocation;
};

/**
 * Utility to throw error if it fails to find the uniform
 */
export const getUniformLocation = (
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    program: WebGLProgram,
    name: string
): WebGLUniformLocation => {
    const uniformLocation = gl.getUniformLocation(program, name);

    // @ts-expect-error: this can happen!
    if (uniformLocation === -1) {
        throw new Error(`Can not find uniform ${name}`);
    }

    return uniformLocation;
};
