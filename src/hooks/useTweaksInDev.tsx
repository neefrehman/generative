import { useTweaks, SpecialInputTypes } from "use-tweaks";
import type { Schema } from "use-tweaks";

interface InitialValuesObject {
    [name: string]: any;
}

type Settings = Record<string, unknown>;

function getInitialValues(schema: Schema): InitialValuesObject {
    return Object.entries(schema).reduce((values, [key, inputDefinition]) => {
        let inputVal = null;

        if (typeof inputDefinition === "object") {
            const { value, min, type } = inputDefinition;

            // if directory, get values from all inputs
            if (type === SpecialInputTypes.DIRECTORY) {
                return { ...values, ...getInitialValues(inputDefinition.schema) };
            }
            if (!(type in SpecialInputTypes)) {
                inputVal = value || min;
            }
        } else {
            inputVal = inputDefinition;
        }

        return { ...values, [key]: inputVal };
    }, {});
}

export const useTweaksInDev = (
    nameOrSchema: string | Schema,
    schema?: Schema | Settings | undefined,
    settings?: Schema | undefined
) => {
    if (process.env.NODE_ENV !== "development")
        return getInitialValues(
            typeof nameOrSchema === "string" ? schema : nameOrSchema
        );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTweaks(nameOrSchema, schema, settings);
};
