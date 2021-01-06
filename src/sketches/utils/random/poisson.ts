/**
 * Produces a random Poisson distribution. [There is no minimum or maximum
 * value that might return. There is just a lower probability the further from the mean.]
 *
 * @param lambda - The expected rate of occurences
 *
 * @returns A random number within the Poisson distribution
 *
 * @link https://en.wikipedia.org/wiki/Poisson_distribution
 *
 * @remarks Currently only outputs integers values (sp not good for small number unless mapped).
 * need to find a better algorithm :)
 */
export const poisson = (lambda = 0) => {
    const L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
        k += 1;
        p *= Math.random();
    } while (p > L);

    return k - 1;
};
