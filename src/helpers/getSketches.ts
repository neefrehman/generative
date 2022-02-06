import fs from "fs";
import path from "path";

/**
 * Gets sketches in a folder, by recursively walking it's `{year}/{month}/{day}` subfolders
 */
const walkDateFolders = (folderPath: string): string[] => {
    const sketchArray: string[] = [];

    const yearFolders = fs
        .readdirSync(folderPath)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearPath = path.resolve(`${folderPath}/${yearFolder}`);
        const monthFolders = fs
            .readdirSync(yearPath)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthPath = path.resolve(`${yearPath}/${monthFolder}`);
            const sketches = fs
                .readdirSync(monthPath)
                .map(fileName => fileName.replace(".tsx", ""));

            sketches.forEach(sketchId => sketchArray.push(sketchId));
        });
    });

    return sketchArray;
};

/**
 * Gets all published sketches
 */
export const getSketches = (): string[] => {
    const sketchArray = walkDateFolders("src/sketches").filter(fileName =>
        /^[0-9]{6}?$/.test(fileName)
    );

    return sketchArray;
};

/**
 * Filter out hidden files from an array of filenames
 */
const filterHiddenFiles = (stringArray: string[]): string[] =>
    stringArray.filter(item => !/(^|\/)\.[^/.]/g.test(item));

/**
 * Gets all archived sketches from the `_archive` folder
 */
export const getArchived = (): string[] => {
    const archiveArray = walkDateFolders("src/sketches/_archive");

    return filterHiddenFiles(archiveArray);
};

/**
 * Gets all draft sketches from the `_drafts` folder
 */
export const getDrafts = (): string[] => {
    const draftsPath = path.resolve("src/sketches/_drafts");
    const draftsArray = fs
        .readdirSync(draftsPath)
        .map(fileName => fileName.replace(".tsx", ""));

    return filterHiddenFiles(draftsArray.filter(name => name !== "_archive"));
};
