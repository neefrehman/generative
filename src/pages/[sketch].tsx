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
import { useRegenerate } from "context/RegenerationKey";

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
  pageTitle: string;
  metaImageUrl: string | null;
}

const SketchPage = ({
  sketchId,
  sketchImportPath,
  gitHubUrl,
  SEOTitle,
  pageTitle,
  metaImageUrl,
}: SketchPageProps) => {
  const hasMounted = useHasMounted();
  const { regenerationKey } = useRegenerate();

  const Sketch = lazy(
    () => import(/* webpackInclude: /sketches\/*./ */ `../${sketchImportPath}`)
  );

  return (
    <StyledSketchPage>
      <Head>
        <title>{pageTitle}</title>
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
            <Sketch key={regenerationKey} />
          </Suspense>
        </ErrorBoundary>
      )}

      <footer>
        <Link href="/">← Home</Link>

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
  const year = sketchId.substring(4, 6);
  const month = sketchId.substring(2, 4);
  let sketchImportPath = `sketches/${year}/${month}/${sketchId}`;

  if (!isPublished) {
    sketchImportPath = sketchIsFound(`sketches/_drafts/${sketchId}`)
      ? `sketches/_drafts/${sketchId}`
      : `sketches/_archive/${year}/${month}/${sketchId}`;
  }

  let gitHubUrl = `https://github.com/neefrehman/Generative/blob/master/src/${sketchImportPath}`;
  gitHubUrl += isFolderSketch(sketchImportPath) ? "/index.tsx" : ".tsx";

  const SEOTitle = `${sketchId} — Generative — a digital sketchbook by Neef Rehman`;
  const pageTitle = `${sketchId} — Generative`;

  const baseAssetUrl = "https://generative.neef.co/_next/";
  const metaImageUrl = await import(`../${sketchImportPath}`)
    .then(module => (module.metaImage ? baseAssetUrl + module.metaImage : null))
    .catch(() => null);

  return {
    props: {
      sketchId,
      sketchImportPath,
      gitHubUrl,
      SEOTitle,
      pageTitle,
      metaImageUrl,
    },
  };
};
