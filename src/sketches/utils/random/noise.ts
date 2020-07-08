import SimplexNoise from "simplex-noise";

const noiseGenerator = new SimplexNoise();

// TODO: classical perlin noise config?

/** A configuration object to set the frequency and amplitude of the noise */
interface NoiseOptions {
    /** Multiplies all coordinates by this value */
    frequency?: number;
    /** Multiplies the output result by this value */
    amplitude?: number;
}

/**
 * Produces 1-dimensional simplex noise. This is equivalent to noise2D(x, 0).
 * @param x - The x offset of the noise value
 * @returns The generated value of the noise
 */
export const noise1D = (
    x: number,
    { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * noiseGenerator.noise2D(x * frequency, 0);

/**
 * Produces 2-dimensional simplex noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @returns The generated value of the noise
 */
export const noise2D = (
    x: number,
    y: number,
    { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);

/**
 * Produces 3-dimensional simplex noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @param z - The z offset of the noise value
 * @returns The generated value of the noise
 */
export const noise3D = (
    x: number,
    y: number,
    z: number,
    { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => {
    return (
        amplitude *
        noiseGenerator.noise3D(x * frequency, y * frequency, z * frequency)
    );
};

/**
 * Produces 4-dimensional simplex noise.
 * @param x - The x offset of the noise value
 * @param y - The y offset of the noise value
 * @param z - The z offset of the noise value
 * @param t - The t offset of the noise value
 * @returns The generated value of the noise
 */
export const noise4D = (
    x: number,
    y: number,
    z: number,
    w: number,
    { frequency = 1, amplitude = 1 }: NoiseOptions = {}
) => {
    return (
        amplitude *
        noiseGenerator.noise4D(
            x * frequency,
            y * frequency,
            z * frequency,
            w * frequency
        )
    );
};
