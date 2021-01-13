/**
 * Produces a random Gaussian (Normal) distribution. There is no minimum or maximum
 * value that might return. There is just a lower probability the further from the mean.
 *
 * @param mean - The mean average in the distribution
 * @param standardDeviation - The standard deviation of returned values from the mean
 *
 * @returns A random number within the Gaussian distribution
 *
 * @link https://en.wikipedia.org/wiki/Normal_distribution
 */
export const inGaussian = (mean = 0, standardDeviation = 1) => {
    let v1 = 0;
    let v2 = 0;
    let s = 0;

    do {
        v1 = Math.random() * 2 - 1; // -1..1
        v2 = Math.random() * 2 - 1; // -1..1
        s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s === 0);

    const multiplier = Math.sqrt((-2 * Math.log(s)) / s);

    return mean + standardDeviation * (v1 * multiplier);
};
