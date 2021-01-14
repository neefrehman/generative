import { testHex } from "Utils/random/createHex";

/**
 * Converts a hex code to an rgba string, to be used by the canvas context.
 *
 * @param hex - the hex string to be converted
 * @param alpha - The alpha value — defaults to 1
 */
export const hexToRgbaString = (hex: string, alpha = 1) => {
    if (!testHex(hex)) throw new Error("Bad Hex");

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
