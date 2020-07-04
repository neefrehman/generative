import path from "path";
import fs from "fs";

import React from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

const HomePageWrapper = styled.div`
    margin: 35px 50px;

    @media (max-width: 769px) {
        margin: 25px 30px;
    }

    @media (max-width: 425px) {
        margin: 25px;
    }
`;

const SketchList = styled.ul`
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: calc(100vh - 150px); // -webkit-fill-available not working
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

export interface SketchArrayProps {
    sketchArray: string[];
}

const Home = ({ sketchArray }: SketchArrayProps) => (
    <HomePageWrapper>
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
            <SketchList>
                {sketchArray.map(sketchId => (
                    <li key={sketchId}>
                        <Link href="/[sketch]" as={`/${sketchId}`}>
                            <a>{sketchId}</a>
                        </Link>
                    </li>
                ))}
            </SketchList>
        </main>
    </HomePageWrapper>
);

export const getStaticProps: GetStaticProps = async () => {
    // can't abstract this to ./utils to share with [sketch].tsx as I get the following error:
    // `Module not found: Can't resolve 'fs' in '/Users/neef/Desktop/generative/src/utils'`
    // Also can't export getSketchArray as a named export from this file:
    // `Module not found: Can't resolve 'fs' in '/Users/neef/Desktop/generative/src/pages'`
    const sketchArray: string[] = [];

    const sketchDirectory = path.join(process.cwd(), "src/sketches");
    const yearFolders = fs
        .readdirSync(sketchDirectory)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearDirectory = path.join(
            process.cwd(),
            `src/sketches/${yearFolder}`
        );
        const monthFolders = fs
            .readdirSync(yearDirectory)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthDirectory = path.join(
                process.cwd(),
                `src/sketches/${yearFolder}/${monthFolder}`
            );

            const sketches = fs
                .readdirSync(monthDirectory)
                .filter(sketchFileName => sketchFileName.length === 10);

            sketches.forEach(sketch => {
                const sketchId = sketch.substr(0, 6);
                const isValidSketchId = RegExp(/^[0-9]{6}$/).test(sketchId);

                if (isValidSketchId) sketchArray.push(sketchId);
            });
        });
    });

    return { props: { sketchArray: sketchArray.reverse() } };
};

export default Home;
