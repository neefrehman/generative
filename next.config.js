/* eslint-disable */
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
    webpack(config) {
        config.module.rules.push({
            test: /\.(js|ts|tsx)$/,
            use: [
                {
                    loader: "linaria/loader",
                    options: {
                        sourceMap: process.env.NODE_ENV !== "production",
                    },
                },
            ],
        });
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
                "raw-loader",
                {
                    loader: "glslify-loader",
                    options: {
                        transform: [
                            // Transforms must also go into package.json for when babel is handling inline glsl strings
                            [
                                "glslify-hex",
                                { "option-1": true, "option-2": 42 },
                            ],
                        ],
                    },
                },
            ],
        });
        config.module.rules.push({
            test: /\.(obj|gltf|mtl)$/,
            exclude: /node_modules/,
            use: ["url-loader"],
        });

        return config;
    },
});