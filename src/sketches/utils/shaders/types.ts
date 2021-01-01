import type { Vector } from "Utils/math/types";

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
    | "4iv"
    | "s2d";

export type UniformValue = number | Vector | Float32List | Int32List;

/**
 * A simplified uniform containing only a key and value
 */
export interface SimpleUniforms {
    [uniform: string]: any; // UniformValue // TODO: type guards for accessing these with safety in sketches
}

/**
 * A uniform value to interface with shaders
 */
export interface Uniform {
    value: any; // UniformValue // TODO: type guards for accessing these with safety in sketches
    type?: UniformType;
}

/**
 * A dictionary of uniforms
 */
export interface UniformDict {
    [uniform: string]: Uniform;
}
