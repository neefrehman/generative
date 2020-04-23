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

const sketchArray = [
    "071219",
    "021219",
    "251119",
    "241119",
    "181119",
    "171119",
    "301019",
    "291019",
    "281019",
    "271019",
    "261019",
    "201019",
    "181019",
    "171019",
    "161019",
    "151019",
    "141019",
    "131019",
    "220919",
    "210919",
    "180919",
    "070919",
    "060919",
    "050919",
    "040919",
    "030919",
    "020919",
    "010919",
    "100819",
    "040819",
    "030819",
    "020819",
    "310719",
    "300719",
    "290719",
    "170619",
    "160619",
    "150619",
    "140619",
    "130619",
    "120619",
    "110619",
    "090619",
    "080619",
    "020619",
    "310519",
    "300519",
    "160519",
    "150519",
    "140519",
    "140419",
    "130419",
    "120419",
    "110419",
    "090419",
    "080419",
    "070419",
    "060419",
    "310319",
    "300319",
    "280319",
    "270319",
    "260319",
    "270219",
    "260219",
    "250219",
    "240219",
    "230219",
    "100219",
    "090219",
    "030219",
    "020219",
    "300119",
    "290119",
    "280119",
    "270119",
    "260119",
    "050119",
    "040119",
    "010119"
];

const Home = () => {
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
                {sketchArray.map(sketchId => (
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

export default Home;
