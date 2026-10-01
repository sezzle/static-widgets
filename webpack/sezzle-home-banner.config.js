const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        "sezzle-home-banner": [
            "./addons/sezzle-home-banner/sezzle-home-banner.js",
        ],
        "sezzle-home-banner.min": [
            "./addons/sezzle-home-banner/sezzle-home-banner.js",
        ],
    },
    output: {
        path: path.resolve(path.join(__dirname, ".."), "build/banner"),
        filename: "[name].js",
        libraryTarget: "var",
        library: "SezzleBanner",
        libraryExport: "default",
        publicPath: "/build/banner",
    },
    target: ["web", "es5"],
    module: {
        rules: [
            {
                test: /\.js?$/,
                // @sezzle/sezzle-modal ships ES2021; transpile it to the
                // banner's target like the banner's own code
                exclude: /node_modules\/(?!@sezzle\/sezzle-modal\/)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    modules: false,
                                    targets: {
                                        ie: "11",
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [new CleanWebpackPlugin()],
    optimization: {
        minimize: true,
    },
    devServer: {
        static: "./",
    },
};
