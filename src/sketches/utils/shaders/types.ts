export interface SimpleUniforms {
    [uniform: string]: any;
}

export type UniformType =
    | "1f"
    | "2f"
    | "3f"
    | "4f"
    | "1i"
    | "2i"
    | "3i"
    | "4i"
    | "1fv"
    | "2fv"
    | "3fv"
    | "4fv"
    | "1iv"
    | "2iv"
    | "3iv"
    | "4iv";

/**
 * A uniform value to interface with shaders
 */
export interface Uniform<T> {
    value: T;
    type?: UniformType;
}

/**
 * A dictionary of uniforms
 */
export interface UniformDict {
    [uniform: string]: Uniform<any>;
}

export type GL = WebGLRenderingContext | WebGL2RenderingContext;
