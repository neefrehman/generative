/**
 * Generates a random sign (1 or -1). Defaults to 50% probability.
 *  */
export const createSign = () => (Math.random() > 0.5 ? 1 : -1);
