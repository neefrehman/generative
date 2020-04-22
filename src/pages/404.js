import React from "react";
import Head from "next/head";
import Link from "next/link";

import PageWrapper from "../components/PageWrapper";

const FourOhFourPage = () => (
    <>
        <Head>
            <title>404 — Generative</title>
        </Head>

        <PageWrapper>
            <header>
                <h1> 404 </h1>
                <p> This page doesn&apos;t exist </p>
            </header>

            <Link href="/">
                <a>← Home</a>
            </Link>
        </PageWrapper>
    </>
);

export default FourOhFourPage;
