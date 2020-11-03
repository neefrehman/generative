/* eslint-disable no-nested-ternary */
import { GL, SimpleUniforms, UniformDict, UniformType } from "./types";

/**
 * Takes a simple uniform structure of { key: value } and translates it
 * to a structure of { key: { value } } to help structure.
 */
export const createUniformDict = (uniforms: SimpleUniforms): UniformDict => {
    const entries = Object.entries(uniforms);

    const uniformDict = entries.reduce((acc, [key, value]) => {
        const currentUniform: UniformDict = {};
        currentUniform[key] = { value };

        return { ...acc, ...currentUniform };
    }, {});

    return uniformDict;
};

/**
 * Utility to throw error on shader compilation failure
 */
export const compileShader = (
    shaderSource: string,
    shaderType: GL["VERTEX_SHADER"] | GL["FRAGMENT_SHADER"],
    gl: GL
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
    name: string,
    program: WebGLProgram,
    gl: GL
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
    name: string,
    program: WebGLProgram,
    gl: GL
): WebGLUniformLocation => {
    const uniformLocation = gl.getUniformLocation(program, name);

    // @ts-expect-error: this can happen!
    if (uniformLocation === -1) {
        throw new Error(`Can not find uniform ${name}`);
    }

    return uniformLocation;
};

export const setUniform = (
    location: WebGLUniformLocation,
    value: any,
    type: UniformType,
    gl: GL
) => {
    if (type === "1f") gl.uniform1f(location, value);
    if (type === "2f") gl.uniform2f(location, value.x, value.y);
    if (type === "3f") gl.uniform3f(location, value.x, value.y, value.z);
    if (type === "4f") gl.uniform4f(location, value.x, value.y, value.z, value.w);
    if (type === "1i") gl.uniform1i(location, value);
    if (type === "2i") gl.uniform2i(location, value.x, value.y);
    if (type === "3f") gl.uniform3f(location, value.x, value.y, value.z);
    if (type === "4f") gl.uniform4f(location, value.x, value.y, value.z, value.w);
    if (type === "1fv") gl.uniform1fv(location, value);
    if (type === "2fv") gl.uniform2fv(location, value);
    if (type === "3fv") gl.uniform3fv(location, value);
    if (type === "4fv") gl.uniform4fv(location, value);
    if (type === "1iv") gl.uniform1iv(location, value);
    if (type === "2iv") gl.uniform2iv(location, value);
    if (type === "3iv") gl.uniform3iv(location, value);
    if (type === "4iv") gl.uniform4iv(location, value);
};
