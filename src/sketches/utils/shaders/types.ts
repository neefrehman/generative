import type { Vector } from "Utils/math/types";

export type UniformDimensions = "1" | "2" | "3" | "4";
export type UniformValueType = "f" | "i" | "fv" | "iv";
export type UniformType = `${UniformDimensions}${UniformValueType}`;

export type UniformValue = number | Vector | Float32List | Int32List;

/**
 * A uniform value to interface with shaders
 */
export interface Uniform<T extends UniformType> {
  value: any; // UniformValue // TODO: type guards for accessing these with safety in sketches
  type?: T;
}

/**
 * A dictionary of uniforms
 */
export interface UniformDict {
  [uniformName: string]: Uniform<UniformType>;
}
