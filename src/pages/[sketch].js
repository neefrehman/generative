import React, { lazy, Suspense } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { styled } from "linaria/react";

import ErrorBoundary from "../components/ErrorBoundary";
import LargeIndicator from "../components/LargeIndicator";

const StyledSketchPage = styled.div`
    margin: 0;

    canvas {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    footer a {
        position: fixed;
        font-family: helvetica neue, helvetica, arial, sans-serif;
        font-size: 0.95em;
        padding: 0.05em 0.2em;
        background-color: rgb(85, 85, 85, 0.7);
        --edgeMargin: 40px;
        bottom: var(--edgeMargin);

        :hover {
            background-color: #eee;
        }

        :first-child {
            left: var(--edgeMargin);
        }

        :nth-child(2) {
            right: var(--edgeMargin);
        }

        @media (max-width: 769px) {
            --edgeMargin: 33px;
        }
    }
`;

const isClient = typeof window !== "undefined";

const SketchPage = () => {
    const router = useRouter();
    const { sketch: sketchId } = router.query;
    const isValidSketchId = RegExp(/^[0-9]{6}$/).test(sketchId);

    const year = sketchId?.substr(4, 2);
    const month = sketchId?.substr(2, 2);
    const pathToSketch = `sketches/${year}/${month}/${sketchId}`;

    const Sketch = lazy(() => import(`../${pathToSketch}`));

    return (
        <StyledSketchPage>
            <Head>
                <title>{sketchId} — Generative</title>
            </Head>

            {isClient &&
                (isValidSketchId ? (
                    <ErrorBoundary>
                        <Suspense
                            fallback={<LargeIndicator>Loading</LargeIndicator>}
                        >
                            <Sketch />
                        </Suspense>
                    </ErrorBoundary>
                ) : (
                    <LargeIndicator>Page not found</LargeIndicator>
                ))}

            <footer>
                <Link href="/">
                    <a>← Home</a>
                </Link>

                {isValidSketchId && (
                    <a
                        href={`https://github.com/neefrehman/Generative/blob/master/${pathToSketch}.js`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {sketchId}
                    </a>
                )}
            </footer>
        </StyledSketchPage>
    );
};

export default SketchPage;
