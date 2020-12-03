import path from "path";
import fs from "fs";

// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from "prettier";

import { getSketches } from "./getSketches";

/**
 * Generates a sitemap of all pages and published skethes. To be used in index.tsx's getStaticProps
 */
export const generateSitemap = async (
    pathInstance: typeof path,
    fsInstance: typeof fs
) => {
    const prettierConfig = await prettier.resolveConfig("./.prettierrc");

    const staticPagesPath = pathInstance.resolve("src/pages");
    const pages = fsInstance.readdirSync(staticPagesPath); // Get all pages from `/pages`.
    const staticPageArray = pages
        .filter(name => name[0] !== "_" && name[0] !== "[" && name !== "404.tsx") // Ignore Next specific files, dynamic route templates, 404. We don't want these indexed.
        .map(name => name.replace(".tsx", "").replace("index", "")); // Index becomes homepage

    const sketchArray = getSketches(pathInstance, fsInstance);

    const allRoutes = [...staticPageArray, ...sketchArray];
    const urlPaths = allRoutes.map(route => (route !== "" ? `/${route}` : route));

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urlPaths
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
