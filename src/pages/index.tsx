import path from "path";
import fs from "fs";

import React from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

import { getSketchArray, getDraftsArray } from "./[sketch]";

const StyledHomePage = styled.div`
    padding: 35px 50px;
    box-sizing: border-box;
    height: 100vh;

    header {
        margin-bottom: clamp(30px, 4vh, 35px);
        width: max-content;
        transform: scale(1.02, 1);
        transform-origin: left;

        h1 {
            white-space: nowrap;
            font-size: clamp(2.42em, 4vw, 3.4em);
            font-weight: 400;
            margin-right: 1em;

            a {
                font-family: inherit;
                text-decoration: underline;
                background-color: initial;

                :hover {
                    background-color: #eee;
                }
            }
        }
    }

    main {
        height: calc(100% - 60px);
    }

    @media (max-width: 769px) {
        padding: 25px 30px;
    }

    @media (max-width: 425px) {
        padding: 25px;
    }
`;

const StyledSketchList = styled.ul`
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 100%;
    width: max-content;

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
    width: 50px;
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
}

const Home = ({ sketchArray, draftsArray }: HomePageProps) => (
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

        <main>
            <StyledSketchList>
                {sketchArray.map(sketchId => (
                    <SketchLink key={sketchId} id={sketchId} />
                ))}

                {draftsArray.length > 0 && (
                    <>
                        <ColumnBreak aria-label="separator" />
                        <li>DRAFTS:</li>
                        {draftsArray.map(draftName => (
                            <SketchLink key={draftName} id={draftName} />
                        ))}
                    </>
                )}
            </StyledSketchList>
        </main>
    </StyledHomePage>
);

export const getStaticProps: GetStaticProps = async () => {
    const sketchArray = getSketchArray(path, fs).reverse();
    const draftsArray = getDraftsArray(path, fs);

    return { props: { sketchArray, draftsArray } };
};

export default Home;
