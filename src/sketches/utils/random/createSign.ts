/**
 * Generates a random sign (1 or -1). Defaults to 50% probability.
 *
 * @param probablity - the probability of returning `1`
 */
export const createSign = (probability = 0.5) =>
    Math.random() > probability ? 1 : -1;
