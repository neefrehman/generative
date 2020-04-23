import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta
                        name="description"
                        content="A digital sketchbook by Neef Rehman"
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
