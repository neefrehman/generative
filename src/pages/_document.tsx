import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

const title = "Generative — a digital sketchbook by Neef Rehman";
const description =
    "A playground for experimenting with generative art, WebGL, and machine learning.";
const url = "https://generative.neef.co";
const imageUrl = "https://generative.neef.co/static/meta-image.png";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* General */}
                    <meta name="author" content="Neef Rehman" />
                    <link rel="icon" href="/static/favicon.ico" />
                    <meta name="title" content={title} />
                    <meta name="description" content={description} />

                    {/* OG */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={url} />
                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={imageUrl} />

                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content={url} />
                    <meta property="twitter:title" content={title} />
                    <meta property="twitter:description" content={description} />
                    <meta property="twitter:image" content={imageUrl} />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
