/* eslint-disable no-nested-ternary */
import { SimpleUniforms, UniformDict } from "./types";

/**
 * Takes a simple uniform structure of { key: value } and translates it
 * to a structure of { key: { value } } to help structure.
 */
export const createUniformDict = (uniforms: SimpleUniforms): UniformDict => {
    const entries = Object.entries(uniforms);

    const uniformDict = entries.reduce((acc, [key, value]) => {
        const currentUniform: UniformDict = {};
        currentUniform[key] = { value };

        return { ...acc, ...currentUniform };
    }, {});

    return uniformDict;
};
