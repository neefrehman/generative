import path from "path";
import fs from "fs";

// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from "prettier";

import { getSketchArray } from "./getSketches";

/**
 * Gets all static pages. Ignores Next specific files and dynamic route templates (e.g. _app, [sketch])
 */
export const getStaticPages = (
    pathInstance: typeof path,
    fsInstance: typeof fs
): string[] => {
    const staticPagesPath = pathInstance.resolve("src/pages");
    const pages = fsInstance.readdirSync(staticPagesPath);
    const staticPageArray = pages
        .filter(name => name[0] !== "[" && name[0] !== "_" && name !== "404.tsx")
        .map(name => name.replace(".tsx", "").replace("index", ""));

    return staticPageArray;
};

/**
 * Generates a sitemap of all pages and published skethes. To be used in index.tsx's getStaticProps
 */
export const generateSitemap = async (
    pathInstance: typeof path,
    fsInstance: typeof fs
) => {
    const prettierConfig = await prettier.resolveConfig("./.prettierrc");

    const allRoutes = [
        ...getStaticPages(pathInstance, fsInstance),
        ...getSketchArray(pathInstance, fsInstance),
    ].map(route => (route !== "" ? `/${route}` : route));

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${allRoutes
                .map(
                    route =>
                        `
                        <url>
                            <loc>${`https://generative.neef.co${route}`}</loc>
                        </url>
                    `
                )
                .join("")}
        </urlset>
    `;

    const formattedSitemap = prettier.format(sitemap, {
        ...prettierConfig,
        parser: "html",
    });

    fsInstance.writeFileSync("public/sitemap.xml", formattedSitemap);
};
