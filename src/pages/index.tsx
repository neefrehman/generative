import path from "path";
import fs from "fs";

import React, { useContext } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

import { IsDebugContext } from "context/IsDebug";
import {
    getSketchArray,
    getDraftsArray,
    getArchivedArray,
} from "helpers/getSketches";
import { generateSitemap } from "helpers/generateSitemap";

const StyledHomePage = styled.div`
    padding: clamp(26px, 5vw, 40px) clamp(26px, 4vw, 48px);
    box-sizing: border-box;
    height: 100vh;
    width: max-content;

    header {
        padding-bottom: clamp(30px, 4vh, 35px);
        transform: scale(1.02, 1);
        transform-origin: left;

        h1 {
            white-space: nowrap;
            padding-right: 1em;
        }
    }
`;

const StyledSketchList = styled.ul`
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: max-content;
    height: calc(100% - 70px);

    li {
        margin: 0 1em 1em 0; /* TODO: replace with gap: 1em on parent once safari support hits: https://caniuse.com/flexbox-gap */

        a:visited {
            color: #212121;
            background-color: #eee;

            :hover {
                background-color: #cacaca;
            }
        }
    }
`;

const ColumnBreak = styled.li`
    height: 100%;
    width: clamp(60px, 10vw, 100px);
`;

const SketchLink = ({ id }: { id: string }) => (
    <li>
        <Link href={`/${id}`}>
            <a>{id}</a>
        </Link>
    </li>
);

interface HomePageProps {
    sketchArray: string[];
    draftsArray: string[];
    archiveArray: string[];
}

const Home = ({ sketchArray, draftsArray, archiveArray }: HomePageProps) => {
    const isDebug = useContext(IsDebugContext);

    return (
        <StyledHomePage>
            <Head>
                <title>Generative — Neef Rehman</title>
            </Head>

            <header>
                <h1>
                    Generative—A digital sketchbook by{" "}
                    <a
                        href="https://neef.co"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Neef Rehman
                    </a>
                </h1>
            </header>

            <StyledSketchList>
                {sketchArray.map(sketchId => (
                    <SketchLink key={sketchId} id={sketchId} />
                ))}

                {isDebug && draftsArray.length > 0 && (
                    <>
                        <ColumnBreak aria-label="separator" />
                        <li>DRAFTS:</li>
                        {draftsArray.map(draftName => (
                            <SketchLink key={draftName} id={draftName} />
                        ))}
                    </>
                )}

                {isDebug && archiveArray.length > 0 && (
                    <>
                        <ColumnBreak aria-label="separator" />
                        <li>ARCHIVE:</li>
                        {archiveArray.map(archivedName => (
                            <SketchLink key={archivedName} id={archivedName} />
                        ))}
                    </>
                )}
            </StyledSketchList>
        </StyledHomePage>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const sketchArray = getSketchArray(path, fs).reverse();
    const draftsArray = getDraftsArray(path, fs);
    const archiveArray = getArchivedArray(path, fs);

    if (process.env.NODE_ENV === "production") {
        generateSitemap(path, fs);
    }

    return { props: { sketchArray, draftsArray, archiveArray } };
};

export default Home;
