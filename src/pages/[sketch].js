import React, { lazy, Suspense, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { styled } from "linaria/react";

import ErrorBoundary from "../components/ErrorBoundary";
import LargeIndicator from "../components/LargeIndicator";
import useVisitedSketchList from "../hooks/useVisitedSketchList";

const StyledSketchPage = styled.main`
    margin: 0;

    footer a {
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

        @media (max-width: 769px) {
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
    const { sketch: sketchId } = router.query;
    const isValidSketchId = RegExp(/^[0-9]{6}$/).test(sketchId);

    const { addToVisitedSketchList } = useVisitedSketchList();
    useEffect(() => {
        if (isValidSketchId) addToVisitedSketchList(sketchId);
    }, []);

    const year = sketchId?.substr(4, 2);
    const month = sketchId?.substr(2, 2);
    const pathToSketch = `sketches/${year}/${month}/${sketchId}`;

    const Sketch = lazy(() => import(`../${pathToSketch}`));

    return (
        <StyledSketchPage>
            <Head>
                <title>{sketchId} — Generative</title>
            </Head>

            {!isServer &&
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
                    <HomeLink>← Home</HomeLink>
                </Link>

                {isValidSketchId && (
                    <CodeLink
                        href={
                            `https://github.com/neefrehman/Generative/blob/master/${pathToSketch}.js` // TODO: change to directory
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {sketchId}
                    </CodeLink>
                )}
            </footer>
        </StyledSketchPage>
    );
};

export default SketchPage;
