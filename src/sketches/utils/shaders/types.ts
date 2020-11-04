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

export type UniformValue =
    | number
    | { x: number; y: number }
    | { x: number; y: number; z: number }
    | { x: number; y: number; Z: number; w: number }
    | Float32List
    | Int32List;

export interface SimpleUniforms {
    [uniform: string]: any;
}

/**
 * A uniform value to interface with shaders
 */
export interface Uniform {
    value: any;
    type?: UniformType;
}

/**
 * A dictionary of uniforms
 */
export interface UniformDict {
    [uniform: string]: Uniform;
}
