/**
 * Produce a random boolean based on a given probability
 *
 * @param probability - the probability of returning true - a number between 0 and 1
 */
export const createChance = (probability = 0.5) => Math.random() < probability;
