export { perlin1D, perlin2D, perlin3D } from "./perlin";

export { simplex1D, simplex2D, simplex3D, simplex4D } from "./simplex";

/** A configuration object to set the frequency and amplitude of the noise */
export interface NoiseOptions {
    /** Multiplies all coordinates by this value */
    frequency?: number;
    /** Multiplies the output result by this value */
    amplitude?: number;
}
