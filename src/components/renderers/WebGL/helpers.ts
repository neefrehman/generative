import { UniformType, UniformValue, UniformVec } from "Utils/shaders/types";

export type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

/**
 * Utility to throw error on shader compilation failure
 */
export const compileShader = (
    shaderSource: string,
    shaderType: GLContext["VERTEX_SHADER"] | GLContext["FRAGMENT_SHADER"],
    gl: GLContext
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
    gl: GLContext
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
    gl: GLContext
): WebGLUniformLocation => {
    const uniformLocation = gl.getUniformLocation(program, name);

    // @ts-expect-error: this can happen!
    if (uniformLocation === -1) {
        throw new Error(`Can not find uniform ${name}`);
    }

    return uniformLocation;
};

/**
 * Utility to create an attribute to be consumed by the shaders
 */
export const createAttribute = (
    name: string,
    data: Float32Array,
    program: WebGLProgram,
    gl: GLContext
): { buffer: WebGLBuffer; handle: number } => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const handle = getAttributeLocation(name, program, gl);
    gl.vertexAttribPointer(handle, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(handle);

    return { buffer, handle };
};

/**
 * Utility to get the type of a uniform from it's value
 */
const getUniformTypeFromValue = (value: UniformValue): UniformType => {
    let type: UniformType;

    const isInt = (num: number) => num.toString().indexOf(".") === -1;
    const isFloat = (num: number) => num.toString().indexOf(".") !== -1;

    // TODO: type guards?
    const isVec = (vec: UniformValue) => typeof vec === "object";
    const isVec2 = (vec: UniformVec) => vec.x && vec.y && !vec.z && !vec.w;
    const isVec3 = (vec: UniformVec) => vec.x && vec.y && vec.z && !vec.w;
    const isVec4 = (vec: UniformVec) => vec.x && vec.y && vec.z && vec.w;

    const areInts = (vec: UniformVec) => Object.values(vec).every(v => isInt(v));
    const areFloats = (vec: UniformVec) =>
        Object.values(vec).every(v => isFloat(v));

    if (typeof value === "number") {
        if (isFloat(value)) type = "1f";
        else if (isInt(value)) type = "1i";
    } else if (isVec(value)) {
        if (isVec2(value)) {
            if (areFloats(value)) type = "2f";
            else if (areInts) type = "2i";
        }
        if (isVec3(value)) {
            if (areFloats(value)) type = "3f";
            else if (areInts) type = "3i";
        }
        if (isVec4(value)) {
            if (areFloats(value)) type = "4f";
            else if (areInts) type = "4i";
        }
    } /* TODO: if/vf? else if (value instanceof Float32Array) {

    } else if (value instanceof Int32Array) {

    // } */

    return type;
};;

/**
 * Utility to set already created uniforms
 */
export const setUniform = (
    location: WebGLUniformLocation,
    value: any,
    type = getUniformTypeFromValue(value),
    gl: GLContext
) => {
    if (type === "1f") gl.uniform1f(location, value);
    if (type === "2f") gl.uniform2f(location, value.x, value.y);
    if (type === "3f") gl.uniform3f(location, value.x, value.y, value.z);
    if (type === "4f") gl.uniform4f(location, value.x, value.y, value.z, value.w);
    if (type === "1i") gl.uniform1i(location, value);
    if (type === "2i") gl.uniform2i(location, value.x, value.y);
    if (type === "3f") gl.uniform3f(location, value.x, value.y, value.z);
    if (type === "4f") gl.uniform4f(location, value.x, value.y, value.z, value.w);
    // if (type === "1fv") gl.uniform1fv(location, value);
    // if (type === "2fv") gl.uniform2fv(location, value);
    // if (type === "3fv") gl.uniform3fv(location, value);
    // if (type === "4fv") gl.uniform4fv(location, value);
    // if (type === "1iv") gl.uniform1iv(location, value);
    // if (type === "2iv") gl.uniform2iv(location, value);
    // if (type === "3iv") gl.uniform3iv(location, value);
    // if (type === "4iv") gl.uniform4iv(location, value);
};
