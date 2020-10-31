import { UniformDict } from "./types";

/**
 * Takes a simple uniform structure of { key: value } and translates it
 * to a structure of { key: { value } } to help structure.
 */
export const createUniformSchema = (simpleUniforms: {
    [value: string]: any;
}): UniformDict => {
    const entries = Object.entries(simpleUniforms);

    const uniforms = entries.reduce((acc, [key, value]) => {
        const currentUniform: UniformDict = {};
        currentUniform[key] = { value };

        return { ...acc, ...currentUniform };
    }, {});

    return uniforms;
};
