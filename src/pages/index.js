import React from "react";
import Head from "next/head";
import { styled } from "linaria/react";

import PageWrapper from "../components/PageWrapper";
import SketchLink from "../components/SketchLink";

const SketchList = styled.section`
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

const Home = () => (
    <>
        <Head>
            <title>Generative — Neef Rehman</title>
        </Head>

        <PageWrapper>
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
                <SketchLink sketchId="071219" />
                <SketchLink sketchId="021219" />

                <SketchLink sketchId="251119" />
                <SketchLink sketchId="241119" />
                <SketchLink sketchId="181119" />

                <SketchLink sketchId="171119" />

                <SketchLink sketchId="301019" />
                <SketchLink sketchId="291019" />
                <SketchLink sketchId="281019" />
                <SketchLink sketchId="271019" />
                <SketchLink sketchId="261019" />

                <SketchLink sketchId="201019" />

                <SketchLink sketchId="181019" />
                <SketchLink sketchId="171019" />
                <SketchLink sketchId="161019" />
                <SketchLink sketchId="151019" />
                <SketchLink sketchId="141019" />

                <SketchLink sketchId="131019" />

                <SketchLink sketchId="220919" />
                <SketchLink sketchId="210919" />
                <SketchLink sketchId="180919" />

                <SketchLink sketchId="070919" />

                <SketchLink sketchId="060919" />
                <SketchLink sketchId="050919" />
                <SketchLink sketchId="040919" />

                <SketchLink sketchId="030919" />
                <SketchLink sketchId="020919" />
                <SketchLink sketchId="010919" />

                <SketchLink sketchId="100819" />
                <SketchLink sketchId="040819" />
                <SketchLink sketchId="030819" />
                <SketchLink sketchId="020819" />
                <SketchLink sketchId="310719" />
                <SketchLink sketchId="300719" />
                <SketchLink sketchId="290719" />

                <SketchLink sketchId="170619" />
                <SketchLink sketchId="160619" />

                <SketchLink sketchId="150619" />

                <SketchLink sketchId="140619" />
                <SketchLink sketchId="130619" />
                <SketchLink sketchId="120619" />

                <SketchLink sketchId="110619" />

                <SketchLink sketchId="090619" />
                <SketchLink sketchId="080619" />
                <SketchLink sketchId="020619" />
                <SketchLink sketchId="310519" />
                <SketchLink sketchId="300519" />

                <SketchLink sketchId="160519" />

                <SketchLink sketchId="150519" />
                <SketchLink sketchId="140519" />

                <SketchLink sketchId="140419" />
                <SketchLink sketchId="130419" />
                <SketchLink sketchId="120419" />

                <SketchLink sketchId="110419" />
                <SketchLink sketchId="090419" />
                <SketchLink sketchId="080419" />
                <SketchLink sketchId="070419" />
                <SketchLink sketchId="060419" />

                <SketchLink sketchId="310319" />
                <SketchLink sketchId="300319" />
                <SketchLink sketchId="280319" />
                <SketchLink sketchId="270319" />
                <SketchLink sketchId="260319" />

                <SketchLink sketchId="270219" />
                <SketchLink sketchId="260219" />
                <SketchLink sketchId="250219" />

                <SketchLink sketchId="240219" />
                <SketchLink sketchId="230219" />
                <SketchLink sketchId="100219" />
                <SketchLink sketchId="090219" />
                <SketchLink sketchId="030219" />
                <SketchLink sketchId="020219" />

                <SketchLink sketchId="300119" />
                <SketchLink sketchId="290119" />
                <SketchLink sketchId="280119" />
                <SketchLink sketchId="270119" />

                <SketchLink sketchId="260119" />
                <SketchLink sketchId="050119" />
                <SketchLink sketchId="040119" />
                <SketchLink sketchId="010119" />
            </SketchList>
        </PageWrapper>
    </>
);

export default Home;
