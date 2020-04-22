import React, { lazy, Suspense } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { styled } from "linaria/react";

import ErrorBoundary from "../components/ErrorBoundary";
import LargeTextOverlay from "../components/LargeTextOverlay";

const StyledSketchPage = styled.main`
    margin: 0;

    a {
        position: fixed;
        font-family: helvetica neue, helvetica, arial, sans-serif;
        font-size: 0.95em;
        padding: 0 0.2em;
        line-height: 1.3;
        --edgeMargin: 40px;
        bottom: var(--edgeMargin);
        cursor: pointer;

        ::selection {
            color: #ffffff;
        }
    }

    @media (max-width: 769px) {
        a {
            --edgeMargin: 33px;
        }
    }

    canvas {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;

const HomeLink = styled.a`
    left: var(--edgeMargin);
`;

const CodeLink = styled.a`
    right: var(--edgeMargin);
`;

const isServer = typeof window === "undefined";

const SketchPage = () => {
    const router = useRouter();
    const { sketch } = router.query;
    const sketchId = sketch?.toString();
    const year = sketchId?.substr(4, 2);
    const month = sketchId?.substr(2, 2);
    const Sketch = lazy(() =>
        import(`../sketches/${year}/${month}/${sketchId}`)
    );

    return (
        <>
            <Head>
                <title>{sketchId} — Generative — Neef Rehman</title>
            </Head>

            <StyledSketchPage>
                {!isServer ? (
                    <ErrorBoundary>
                        <Suspense
                            fallback={
                                <LargeTextOverlay>loading</LargeTextOverlay>
                            }
                        >
                            <Sketch />
                        </Suspense>
                    </ErrorBoundary>
                ) : (
                    <p>loading</p>
                )}

                <Link href="/">
                    <HomeLink>← Home</HomeLink>
                </Link>

                <CodeLink
                    href={`/sketches/${year}/${month}/${sketchId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {sketchId}
                </CodeLink>
            </StyledSketchPage>
        </>
    );
};

export default SketchPage;
