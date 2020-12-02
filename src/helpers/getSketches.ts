import fs from "fs";
import path from "path";

/**
 * Gets all finished sketches, by recursively walking the `{year}/{month}/{day}` folders
 */
export const getSketchArray = (
    pathInstance: typeof path,
    fsInstance: typeof fs
): string[] => {
    const sketchArray: string[] = [];

    const sketchPath = pathInstance.resolve("src/sketches");
    const yearFolders = fsInstance
        .readdirSync(sketchPath)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearPath = pathInstance.resolve(`${sketchPath}/${yearFolder}`);
        const monthFolders = fsInstance
            .readdirSync(yearPath)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthPath = pathInstance.resolve(`${yearPath}/${monthFolder}`);
            const sketches = fsInstance
                .readdirSync(monthPath)
                .filter(fileName => RegExp(/^[0-9]{6}(\.tsx)$/).test(fileName))
                .map(fileName => fileName.replace(".tsx", ""));

            sketches.forEach(sketchId => sketchArray.push(sketchId));
        });
    });

    return sketchArray;
};

/**
 * Gets all draft sketches from the `_drafts` folder
 */
export const getDraftsArray = (
    pathInstance: typeof path,
    fsInstance: typeof fs
): string[] => {
    const draftsPath = pathInstance.resolve("src/sketches/_drafts");
    const draftsArray = fsInstance
        .readdirSync(draftsPath)
        .map(fileName => fileName.replace(".tsx", ""));

    return draftsArray.filter(name => name !== "_archive");
};

/**
 * Gets all archived drafts sketches from the `_drafts/_archive` folder
 */
export const getArchivedArray = (
    pathInstance: typeof path,
    fsInstance: typeof fs
): string[] => {
    const archivePath = pathInstance.resolve("src/sketches/_drafts/_archive");
    const archiveArray = fsInstance
        .readdirSync(archivePath)
        .map(fileName => fileName.replace(".tsx", ""));

    return archiveArray;
};
