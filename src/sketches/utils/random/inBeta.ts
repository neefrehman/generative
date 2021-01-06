// from https://stackoverflow.com/questions/9590225/is-there-a-library-to-generate-random-numbers-according-to-a-beta-distribution-f/24144830
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * Produces a random number from a beta distribution
 *
 * @param A - Shape parameter Alpha
 * @param B - Shape parameter Beta
 *
 * @returns A random number within the Beta distribution
 *
 * @link https://en.wikipedia.org/wiki/Beta_distribution
 */
export const inBeta = (A = 0.5, B = 0.5) => {
    const baseGamma = _inBeta(A, 1);
    return baseGamma / (baseGamma + _inBeta(B, 1));
};

/* eslint-disable no-constant-condition */
/* eslint-disable no-continue */
/* eslint-disable-next-line no-underscore-dangle */
function _inBeta(alpha: number, beta: number) {
    const SG_MAGICCONST = 1 + Math.log(4.5);
    const LOG4 = Math.log(4.0);

    let x: number;
    let v: number;

    if (alpha > 1) {
        const ainv = Math.sqrt(2.0 * alpha - 1.0);
        const bbb = alpha - LOG4;
        const ccc = alpha + ainv;

        while (true) {
            const u1 = Math.random();

            if (!(u1 > 1e-7 && u1 < 0.9999999)) {
                continue;
            }

            const u2 = 1.0 - Math.random();
            v = Math.log(u1 / (1.0 - u1)) / ainv;
            x = alpha * Math.exp(v);

            const z = u1 * u1 * u2;
            const r = bbb + ccc * v - x;

            if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= Math.log(z)) {
                return x * beta;
            }
        }
    } else if (alpha === 1.0) {
        let u = Math.random();

        while (u <= 1e-7) {
            u = Math.random();
        }

        return -Math.log(u) * beta;
    } else {
        while (true) {
            const u3 = Math.random();
            const b = (Math.E + alpha) / Math.E;
            const p = b * u3;

            if (p <= 1.0) {
                x = p ** 1.0 / alpha;
            } else {
                x = -Math.log((b - p) / alpha);
            }

            const u4 = Math.random();

            if (p > 1.0) {
                if (u4 <= x ** alpha - 1.0) {
                    break;
                }
            } else if (u4 <= Math.exp(-x)) {
                break;
            }
        }

        return x * beta;
    }
}
