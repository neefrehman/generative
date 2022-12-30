/** A configuration object to set the frequency and amplitude of the noise */
export interface NoiseOptions {
  /** Multiplies all coordinates by this value */
  frequency?: number;
  /** Multiplies the output result by this value */
  amplitude?: number;
}
