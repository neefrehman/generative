/**
 * A uniform value to interface with shaders
 */
export interface Uniform<T> {
    value: T;
}

/**
 * A dictionary of uniforms
 */
export interface UniformDict {
    [uniform: string]: Uniform<any>;
}
