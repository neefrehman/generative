/**
 * Generates a random sign (1 or -1). Defaults to 50% probability.
 *  */
export const createSign = (probability = 0.5) =>
    Math.random() > probability ? 1 : -1;
