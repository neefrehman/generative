const withLinaria = require("next-linaria");

/* eslint-disable */
module.exports = withLinaria({
    experimental: {
        eslint: true,
    },
    images: {
        disableStaticImages: true,
    },
    webpack(config, { dev, isServer }) {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                react: "preact/compat",
                "react-dom/test-utils": "preact/test-utils",
                "react-dom": "preact/compat",
            });
        }
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
                "raw-loader",
                {
                    loader: "glslify-loader",
                    options: {
                        // Transforms must also go into package.json, for when babel is handling inline glsl
                        transform: [
                            ["glslify-hex", { "option-1": true, "option-2": 42 }],
                        ],
                    },
                },
            ],
        });
        config.module.rules.push({
            test: /\.(obj|gltf|mtl)$/,
            exclude: /node_modules/,
            use: ["file-loader"],
        });
        config.module.rules.push({
            test: /\.(png|jpeg|jpg)$/,
            exclude: /node_modules/,
            use: {
                loader: "file-loader",
                options: {
                    name: path => {
                        const isBundledWithSketch = path.match(/([0-9]{6})/);
                        if (isBundledWithSketch) {
                            const [basePath, sketchId, subPath] =
                                path.split(/([0-9]{6})/);

                            const [_, relevantBasePath] =
                                basePath.split("sketches/");

                            const filename = subPath.split("/").slice(-1);
                            const [subPathWithoutFilename] = subPath.split(
                                `/${filename}`
                            );
                            return `sketches/${relevantBasePath}/${
                                sketchId + subPathWithoutFilename
                            }/[name].[ext]`;
                        } else {
                            return "[name].[ext]";
                        }
                    },
                    outputPath: `static/images`,
                },
            },
        });

        return config;
    },
});
