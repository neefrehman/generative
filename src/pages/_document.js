import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />

                    <meta
                        name="description"
                        content="Generative — A digital sketchbook by Neef Rehman"
                    />
                    <meta name="author" content="Neef Rehman" />
                    <link rel="icon" href="/static/favicon.ico" />
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
