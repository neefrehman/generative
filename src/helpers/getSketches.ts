import fs from "fs";
import path from "path";

/**
 * Gets all finished sketches, by recursively walking the `{year}/{month}/{day}` folders
 */
export const getSketches = (): string[] => {
    const sketchArray: string[] = [];

    const sketchPath = path.resolve("src/sketches");
    const yearFolders = fs
        .readdirSync(sketchPath)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearPath = path.resolve(`${sketchPath}/${yearFolder}`);
        const monthFolders = fs
            .readdirSync(yearPath)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthPath = path.resolve(`${yearPath}/${monthFolder}`);
            const sketches = fs
                .readdirSync(monthPath)
                .filter(fileName => RegExp(/^[0-9]{6}(\.tsx)?$/).test(fileName))
                .map(fileName => fileName.replace(".tsx", ""));

            sketches.forEach(sketchId => sketchArray.push(sketchId));
        });
    });

    return sketchArray;
};

/**
 * Gets all draft sketches from the `_drafts` folder
 */
export const getDrafts = (): string[] => {
    const draftsPath = path.resolve("src/sketches/_drafts");
    const draftsArray = fs
        .readdirSync(draftsPath)
        .map(fileName => fileName.replace(".tsx", ""));

    return draftsArray.filter(name => name !== "_archive");
};

/**
 * Gets all archived drafts sketches from the `_drafts/_archive` folder
 */
export const getArchived = (): string[] => {
    const archivePath = path.resolve("src/sketches/_drafts/_archive");
    const archiveArray = fs
        .readdirSync(archivePath)
        .map(fileName => fileName.replace(".tsx", ""));

    return archiveArray;
};
