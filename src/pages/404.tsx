import React from "react";
import Head from "next/head";
import Link from "next/link";

import TextOverlay from "../components/TextOverlay";

import { StyledSketchPage } from "./[sketch]";

const FourOhFourPage = () => (
    <StyledSketchPage>
        <Head>
            <title>404 — Generative</title>
        </Head>

        <TextOverlay text="Page not found" />

        <footer>
            <Link href="/">
                <a>← Home</a>
            </Link>
        </footer>
    </StyledSketchPage>
);

export default FourOhFourPage;
