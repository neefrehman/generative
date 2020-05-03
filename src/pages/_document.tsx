import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* General */}
                    <meta name="author" content="Neef Rehman" />
                    <link rel="icon" href="/static/favicon.ico" />
                    <meta
                        name="title"
                        content="Generative — a digital sketchbook by Neef Rehman"
                    />
                    <meta
                        name="description"
                        content="A playground for experimenting with generative art, WebGL, and machine learning."
                    />

                    {/* OG */}
                    <meta property="og:type" content="website" />
                    <meta
                        property="og:url"
                        content="https://generative.neef.co"
                    />
                    <meta
                        property="og:title"
                        content="Generative — a digital sketchbook by Neef Rehman"
                    />
                    <meta
                        property="og:description"
                        content="A playground for experimenting with generative art, WebGL, and machine learning."
                    />
                    <meta
                        property="og:image"
                        content="https://generative.neef.co/static/meta-image.png"
                    />

                    {/* Twitter */}
                    <meta
                        property="twitter:card"
                        content="summary_large_image"
                    />
                    <meta
                        property="twitter:url"
                        content="https://generative.neef.co"
                    />
                    <meta
                        property="twitter:title"
                        content="Generative — a digital sketchbook by Neef Rehman"
                    />
                    <meta
                        property="twitter:description"
                        content="A playground for experimenting with generative art, WebGL, and machine learning."
                    />
                    <meta
                        property="twitter:image"
                        content="https://generative.neef.co/static/meta-image.png"
                    />
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
