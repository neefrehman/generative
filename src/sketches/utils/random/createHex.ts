/**
 * Tests that a hex code is valid
 * @param hex a hex code
 */
export const testHex = (hex: string): boolean =>
    /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);

/**
 * Produces a random hex code
 */
export const createHex = (): string => {
    let hex = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    hex = hex.length === 7 ? hex : `${hex}0`;

    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex) ? hex : createHex();
};
