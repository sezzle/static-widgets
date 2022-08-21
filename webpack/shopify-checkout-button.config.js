const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dotEnv = require('dotenv').config({
    path: path.join(__dirname, '.env'),
});

module.exports = {
    entry: {
        "sezzle-checkout-button-asset": ['@babel/polyfill', './src/sezzle-checkout-button/sezzle-checkout-button-asset.js'],
        "sezzle-checkout-button-asset-min": ['@babel/polyfill', './src/sezzle-checkout-button/sezzle-checkout-button-asset.js'],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'SezzleCheckoutButton',
        libraryExport: 'default',
        publicPath: '/build/',
    },
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false,
                                    targets: {
                                        ie: '11',
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotEnv.parsed),
        }),
    ],
    optimization: {
        minimize: true,
    },
    devServer: {
        static: './',
    },
};