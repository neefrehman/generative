module.exports = {
    webpack(config /* , options */) {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
                "raw-loader",
                {
                    loader: "glslify-loader",
                    options: {
                        transform: [
                            [
                                // Transfroms must also go into package.json for when babel is handling inline glsl
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
};