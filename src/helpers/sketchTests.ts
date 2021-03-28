import fs from "fs";

import { getArchived, getDrafts, getSketches } from "./getSketches";

/**
 * Returns true if a sketch is a folder, as opposed to a single file
 * @param sketchImportPath - The import path to the sketch
 */
export const isFolderSketch = (sketchImportPath: string): boolean =>
    fs.existsSync(`src/${sketchImportPath}`) &&
    !fs.existsSync(`src/${sketchImportPath}.tsx`);

/**
 * Returns true if a sketch can not be found at a location
 * @param sketchImportPath - The import path to the sketch
 */
export const sketchIsNotFound = (sketchImportPath: string): boolean =>
    !fs.existsSync(`src/${sketchImportPath}`) && // folder
    !fs.existsSync(`src/${sketchImportPath}.tsx`); // file

/**
 * Returns true if a sketch exists at all
 * @param sketchId - The sketchId
 */
export const sketchExists = (sketchId: string) => {
    const allSketchesArray = [...getSketches(), ...getDrafts(), ...getArchived()];
    return allSketchesArray.includes(sketchId);
};