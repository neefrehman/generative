import fs from "fs";
import path from "path";

/** Gets all finished sketches, by recursively walking the `{year}/{month}/{day}` folders
 *
 * @param nodePath An instance of nodes `path` library
 * @param nodeFs An instance of nodes `fs` library
 */
export const getSketchArray = (
    nodePath: typeof path,
    nodeFs: typeof fs
): string[] => {
    const sketchArray: string[] = [];

    const sketchPath = nodePath.resolve("src/sketches");
    const yearFolders = nodeFs
        .readdirSync(sketchPath)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearPath = nodePath.resolve(`${sketchPath}/${yearFolder}`);
        const monthFolders = nodeFs
            .readdirSync(yearPath)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthPath = nodePath.resolve(`${yearPath}/${monthFolder}`);
            const sketches = nodeFs
                .readdirSync(monthPath)
                .filter(fileName => RegExp(/^[0-9]{6}(\.tsx)$/).test(fileName))
                .map(fileName => fileName.replace(".tsx", ""));

            sketches.forEach(sketchId => sketchArray.push(sketchId));
        });
    });

    return sketchArray;
};

/** Gets all draft sketches from the `_drafts` folder
 *
 * @param nodePath An instance of nodes `path` library
 * @param nodeFs An instance of nodes `fs` library
 */
export const getDraftsArray = (
    nodePath: typeof path,
    nodeFs: typeof fs
): string[] => {
    const draftsPath = nodePath.resolve("src/sketches/_drafts");
    const draftsArray = nodeFs
        .readdirSync(draftsPath)
        .map(fileName => fileName.replace(".tsx", ""));

    return draftsArray.filter(name => name !== "_archive");
};

/** Gets all archived drafts sketches from the `_drafts/_archive` folder
 *
 * @param nodePath An instance of nodes `path` library
 * @param nodeFs An instance of nodes `fs` library
 */
export const getArchivedArray = (
    nodePath: typeof path,
    nodeFs: typeof fs
): string[] => {
    const archivePath = nodePath.resolve("src/sketches/_drafts/_archive");
    const archiveArray = nodeFs
        .readdirSync(archivePath)
        .map(fileName => fileName.replace(".tsx", ""));

    return archiveArray;
};
