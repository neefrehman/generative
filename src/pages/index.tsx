import path from "path";
import fs from "fs";

import React from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

import { getSketchArray, getDraftsArray } from "./[sketch]";

const StyledHomePage = styled.div`
    margin: 35px 50px;

    header {
        margin-bottom: 35px;
        width: max-content;
        transform: scale(1.02, 1);
        transform-origin: left;

        h1 {
            margin-block-end: 0.5em;
            white-space: nowrap;
            font-size: 3.4em;
            font-weight: 400;
            margin-right: 1em;

            a {
                text-decoration: underline;
                background-color: initial;

                :hover {
                    background-color: #eee;
                }
            }
        }
    }

    @media (max-width: 769px) {
        margin: 25px 30px;

        header {
            margin-bottom: 30px;

            h1 {
                font-size: 2.36em;
            }
        }
    }

    @media (max-width: 425px) {
        margin: 25px;
    }
`;

const StyledSketchList = styled.ul`
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: calc(100vh - 150px); /* -webkit-fill-available not working */
    width: max-content;

    li {
        font-family: helvetica neue, helvetica, arial, sans-serif;
        margin: 0 1em 1em 0;
        font-variant-numeric: tabular-nums;

        a:visited {
            color: #212121;
            background-color: #eee;

            :hover {
                background-color: #cacaca;
            }
        }
    }

    @media (max-width: 769px) {
        max-height: calc(100vh - 190px);
    }
`;

const ColumnBreak = styled.div`
    height: 100vh;
    margin-right: 3em;
`;

const SketchLink = ({ id }: { id: string }) => (
    <li>
        <Link href="/[sketch]" as={`/${id}`}>
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
                        <ColumnBreak />
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
