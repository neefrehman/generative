/**
 * Produce a random hex code
 */
export const createHex = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;
