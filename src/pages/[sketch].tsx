import React, { lazy, Suspense } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { styled } from "linaria/react";

import { ErrorBoundary } from "components/ErrorBoundary";
import { TextOverlay } from "components/TextOverlay";
import { useHasMounted } from "hooks/useHasMounted";
import { getArchived, getDrafts, getSketches } from "helpers/getSketches";
import { isFolderSketch, sketchIsFound } from "helpers/sketchTests";

export const StyledSketchPage = styled.div`
    canvas {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        :focus {
            outline: none;
        }
    }

    footer a {
        position: fixed;
        font-size: 0.95rem;
        padding: 0.05em 0.2em;
        background-color: rgb(85, 85, 85, 0.7);
        bottom: var(--edgeButtonMargin);

        :hover {
            background-color: var(--offWhite);
        }

        :first-child {
            left: var(--edgeButtonMargin);
        }

        :nth-child(2) {
            right: var(--edgeButtonMargin);
        }
    }
`;

interface SketchPageProps {
    sketchId: string;
    sketchImportPath: string;
    gitHubUrl: string;
    SEOTitle: string;
    metaImageUrl: string;
}

const SketchPage = ({
    sketchId,
    sketchImportPath,
    gitHubUrl,
    SEOTitle,
    metaImageUrl,
}: SketchPageProps) => {
    const hasMounted = useHasMounted();

    const Sketch = lazy(
        () => import(/* webpackInclude: /sketches\/*./ */ `../${sketchImportPath}`)
    );

    return (
        <StyledSketchPage>
            <Head>
                <title>{sketchId} — Generative</title>
                <meta property="og:title" content={SEOTitle} />
                <meta property="twitter:title" content={SEOTitle} />
                {!!metaImageUrl && (
                    <>
                        <meta property="og:image" content={metaImageUrl} />
                        <meta property="twitter:image" content={metaImageUrl} />
                    </>
                )}
            </Head>

            {hasMounted && (
                <ErrorBoundary fallback={<TextOverlay text="Error" />}>
                    <Suspense fallback={<TextOverlay text="Loading" />}>
                        <Sketch />
                    </Suspense>
                </ErrorBoundary>
            )}

            <footer>
                <Link href="/">
                    <a>← Home</a>
                </Link>

                <a href={gitHubUrl} target="_blank" rel="noopener noreferrer">
                    {sketchId}
                </a>
            </footer>
        </StyledSketchPage>
    );
};

export default SketchPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const allSketchesArray = [...getSketches(), ...getDrafts(), ...getArchived()];
    const paths = allSketchesArray.map(sketch => ({ params: { sketch } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<SketchPageProps> = async ({
    params: { sketch: sketchId },
}) => {
    if (typeof sketchId !== "string") {
        return { notFound: true };
    }

    const isPublished = /^[0-9]{6}$/.test(sketchId);
    const year = sketchId.substr(4, 2);
    const month = sketchId.substr(2, 2);
    let sketchImportPath = `sketches/${year}/${month}/${sketchId}`;

    if (!isPublished) {
        sketchImportPath = sketchIsFound(`sketches/_drafts/${sketchId}`)
            ? `sketches/_drafts/${sketchId}`
            : `sketches/_archive/${year}/${month}/${sketchId}`;
    }

    let gitHubUrl = `https://github.com/neefrehman/Generative/blob/master/src/${sketchImportPath}`;
    gitHubUrl += isFolderSketch(sketchImportPath) ? "/index.tsx" : ".tsx";

    const SEOTitle = `${sketchId} — Generative — a digital sketchbook by Neef Rehman`;
    const baseUrl = "https://generative.neef.co/_next/";
    const metaImageUrl = await import(`../${sketchImportPath}`)
        .then(module => (module.metaImage ? baseUrl + module.metaImage : null))
        .catch(() => null);

    return {
        props: {
            sketchId,
            sketchImportPath,
            gitHubUrl,
            SEOTitle,
            metaImageUrl,
        },
    };
};
