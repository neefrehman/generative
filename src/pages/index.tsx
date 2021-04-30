import React, { useContext } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

import { IsDebugContext } from "context/IsDebug";
import { getSketches, getDrafts, getArchived } from "helpers/getSketches";
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
    flex-flow: column wrap;
    gap: 1em;
    width: max-content;
    height: calc(100% - 70px);

    li a:visited {
        color: var(--offBlack);
        background-color: var(--offWhite);

        :hover {
            background-color: var(--offWhiteHover);
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

                {isDebug && (
                    <>
                        <ColumnBreak aria-label="separator" />
                        <li>DRAFTS:</li>
                        {draftsArray.map(draftName => (
                            <SketchLink key={draftName} id={draftName} />
                        ))}

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

export default Home;

export const getStaticProps: GetStaticProps = async () => {
    const sketchArray = getSketches().reverse();
    const draftsArray = getDrafts().reverse();
    const archiveArray = getArchived().reverse();

    if (process.env.NODE_ENV === "production") {
        generateSitemap();
    }

    return { props: { sketchArray, draftsArray, archiveArray } };
};
