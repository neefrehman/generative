import fs from "fs";
import path from "path";

import React, { lazy, Suspense, useState, useEffect } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import styled from "@emotion/styled";

import { ErrorBoundary } from "components/ErrorBoundary";
import { TextOverlay } from "components/TextOverlay";
import { getArchived, getDrafts, getSketches } from "helpers/getSketches";

export const StyledSketchPage = styled.div`
    canvas {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        :focus {
            outline: none;
        }
    }

    footer a {
        position: fixed;
        font-size: 0.95rem;
        padding: 0.05em 0.2em;
        background-color: rgb(85, 85, 85, 0.7);
        bottom: var(--edgeButtonMargin);

        :hover {
            background-color: #eee;
        }

        :first-child {
            left: var(--edgeButtonMargin);
        }

        :nth-child(2) {
            right: var(--edgeButtonMargin);
        }
    }
`;

interface SketchPageProps {
    sketchId: string;
    pathToSketch: string;
    gitHubUrl: string;
}

const SketchPage = ({ sketchId, pathToSketch, gitHubUrl }: SketchPageProps) => {
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

                <a href={gitHubUrl} target="_blank" rel="noopener noreferrer">
                    {sketchId}
                </a>
            </footer>
        </StyledSketchPage>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const sketchArray = getSketches(path, fs);
    const draftsArray = getDrafts(path, fs);
    const archiveArray = getArchived(path, fs);
    const allSketchesArray = [...sketchArray, ...draftsArray, ...archiveArray];

    const paths = allSketchesArray.map(sketch => ({ params: { sketch } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const sketchId = typeof params.sketch === "string" ? params.sketch : "";
    const isPublished = RegExp(/^[0-9]{6}$/).test(sketchId);
    let pathToSketch: string;

    if (isPublished) {
        const year = sketchId.substr(4, 2);
        const month = sketchId.substr(2, 2);
        pathToSketch = `sketches/${year}/${month}/${sketchId}`;
    } else {
        pathToSketch = `sketches/_drafts/${sketchId}`;
        const isArchived =
            !fs.existsSync(`src/${pathToSketch}`) && // folder
            !fs.existsSync(`src/${pathToSketch}.tsx`); // file
        if (isArchived) pathToSketch = `sketches/_drafts/_archive/${sketchId}`;
    }

    let gitHubPath = `src/${pathToSketch}`;
    gitHubPath += fs.existsSync(`${gitHubPath}.tsx`) ? ".tsx" : "/index.tsx";
    const gitHubUrl = `https://github.com/neefrehman/Generative/blob/master/${gitHubPath}`;

    return {
        props: {
            sketchId,
            pathToSketch,
            gitHubUrl,
        },
    };
};

export default SketchPage;
