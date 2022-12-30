import { mapToRange } from "Utils/math/mapToRange";
import { testHex } from "Utils/random/createHex";

/**
 * Converts a hex code to a `vec3`, to be passed to a shader uniform
 *
 * @param hex - the hex string to be converted
 */
export const hexToVec3 = (hex: string) => {
  if (!testHex(hex)) throw new Error("Bad Hex");

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const normalisedColor = [r, g, b].map(color =>
    mapToRange(color, 0, 255, 0, 1, { clamp: true })
  );

  return normalisedColor;
};
