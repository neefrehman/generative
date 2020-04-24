import fs from "fs";
import path from "path";

import React from "react";
import Head from "next/head";
import { styled } from "linaria/react";

import PageWrapper from "../components/PageWrapper";
import SketchLink from "../components/SketchLink";
import useVisitedSketchList from "../hooks/useVisitedSketchList";

const SketchList = styled.main`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: calc(100vh - 150px);
    width: max-content;
    justify-content: flex-start;

    @media (max-width: 769px) {
        max-height: calc(100vh - 190px);
    }
`;

const Home = ({ sketchList }) => {
    const { visitedSketchList } = useVisitedSketchList();

    return (
        <PageWrapper>
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

            <SketchList>
                {sketchList.map(sketchId => (
                    <SketchLink
                        sketchId={sketchId}
                        visited={visitedSketchList.includes(sketchId)}
                        key={sketchId}
                    />
                ))}
            </SketchList>
        </PageWrapper>
    );
};

export async function getStaticProps() {
    const sketchList = [];

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
                .filter(
                    sketchFileName =>
                        sketchFileName.length === 6 ||
                        sketchFileName.length === 9
                );

            sketches.forEach(sketch => {
                const sketchId = sketch.substr(0, 6);
                const isValidSketchId = RegExp(/^[0-9]{6}$/).test(sketchId);

                if (isValidSketchId) sketchList.push(sketchId);
            });
        });
    });

    sketchList.reverse();

    return {
        props: { sketchList }
    };
}

export default Home;
