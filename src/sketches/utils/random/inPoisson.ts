/**
 * Produces a random integer from Poisson distribution.
 *
 * @param lambda - The expected rate of occurences
 * @returns A random number within the Poisson distribution
 *
 * @link https://en.wikipedia.org/wiki/Poisson_distribution
 */
export const inPoisson = (lambda = 0) => {
    const L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
        k += 1;
        p *= Math.random();
    } while (p > L);

    return k - 1;
};
