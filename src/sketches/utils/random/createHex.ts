/**
 * Produces a random hex code
 */
export const createHex = (): string => {
    const hex = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return hex.length === 7 ? hex : `${hex}0`;
};
