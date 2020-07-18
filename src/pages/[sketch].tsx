import fs from "fs";
import path from "path";

import React, { lazy, Suspense, useState, useEffect } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

import ErrorBoundary from "../components/ErrorBoundary";
import TextOverlay from "../components/TextOverlay";

export const StyledSketchPage = styled.div`
    margin: 0;

    canvas {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    footer a {
        position: fixed;
        font-family: helvetica neue, helvetica, arial, sans-serif;
        font-size: 0.95em;
        padding: 0.05em 0.2em;
        background-color: rgb(85, 85, 85, 0.7);
        --edgeMargin: 40px;
        bottom: var(--edgeMargin);

        :hover {
            background-color: #eee;
        }

        :first-child {
            left: var(--edgeMargin);
        }

        :nth-child(2) {
            right: var(--edgeMargin);
        }

        @media (max-width: 769px) {
            --edgeMargin: 33px;
        }
    }
`;

export interface SketchPageProps {
    sketchId: string;
    pathToSketch: string;
}

const SketchPage = ({ sketchId, pathToSketch }: SketchPageProps) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);

    const Sketch = lazy(() => import(`../${pathToSketch}`));

    return (
        <StyledSketchPage>
            <Head>
                <title>{sketchId} — Generative</title>
            </Head>

            {hasMounted && (
                <ErrorBoundary fallback={<TextOverlay text="Error" />}>
                    <Suspense fallback={<TextOverlay text="Loading" />}>
                        <Sketch />
                    </Suspense>
                </ErrorBoundary>
            )}

            <footer>
                <Link href="/">
                    <a>← Home</a>
                </Link>

                <a
                    href={`https://github.com/neefrehman/Generative/blob/master/src/${pathToSketch}.tsx`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {sketchId}
                </a>
            </footer>
        </StyledSketchPage>
    );
};

export const getSketchArray = (nodePath: typeof path, nodeFs: typeof fs) => {
    const sketchArray: string[] = [];

    const sketchDirectory = nodePath.resolve("src/sketches");
    const yearFolders = nodeFs
        .readdirSync(sketchDirectory)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearDirectory = nodePath.resolve(`src/sketches/${yearFolder}`);
        const monthFolders = nodeFs
            .readdirSync(yearDirectory)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthDirectory = nodePath.resolve(
                `src/sketches/${yearFolder}/${monthFolder}`
            );
            const sketches = nodeFs
                .readdirSync(monthDirectory)
                .filter(sketchId => RegExp(/[0-9]{6}(\.tsx)?/).test(sketchId))
                .map(sketchId => sketchId.substr(0, 6));

            sketches.forEach(sketchId => sketchArray.push(sketchId));
        });
    });

    return sketchArray;
};

export const getStaticPaths: GetStaticPaths = async () => {
    const sketchArray = getSketchArray(path, fs);
    const paths = sketchArray.map(sketch => ({ params: { sketch } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const sketchId = typeof params.sketch === "string" ? params.sketch : "";

    const year = sketchId.substr(4, 2);
    const month = sketchId.substr(2, 2);
    const pathToSketch = `sketches/${year}/${month}/${sketchId}`;

    // support folder-sketches for github link.
    // SketchArray in getStaticPaths as an object with a boolean `isSubfolder`
    // updating the url with an `/index.tsx` if true - Doesn't work.
    // Try pushing boolean to array in upper scope then reading here? - also doesn't work
    // -> Needs to happen in client as import() wont work otherwise

    // TODO: Check with node to see if path is file or folder?
    // const thisSketch = fs.statSync(
    //     path.resolve(`src/sketches/${year}/${month}/${sketchId}`)
    // );
    // const isFolderSketch = thisSketch.isDirectory();
    // ^Error: ENOENT: no such file or directory

    return {
        props: {
            sketchId,
            pathToSketch
        }
    };
};

export default SketchPage;
