/**
 * Picks a random item from an array
 *
 * @param array - the array to be chosen from
 */
export const pick = <T>(array: T[]) =>
    array[Math.floor(Math.random() * array.length)];
