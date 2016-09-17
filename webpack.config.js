const webpack = require("webpack");
const path = require("path");

// Plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

function buildConfiguration() {
    const config = {};

    config.cache = true;
    config.debug = true;
    config.devtool = "eval-source-map";

    config.devServer = {
        contentBase: "./src/web",
        historyApiFallback: true,
        quiet: true,
        stats: "minimal"
    };

    config.entry = {
        "polyfills": "./src/polyfills.browser.ts",
        "vendor": "./src/vendor.browser.ts",
        "main": "./src/main.browser.ts"
    };

    config.output = {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].bundle.js",
        sourceMapFilename: "js/[name].map",
        chunkFilename: "js/[id].chunk.js"
    };

    config.resolve = {
        cache: true,
        root: [ path.join(__dirname, "src") ],
        extensions: [ "", ".ts", ".js", ".css", ".html" ],
        alias: {
            "app": "src/app"
        }
    };

    config.module = {
        loaders: [
            // Typescript
            {
                test: /\.ts$/,
                loaders: [ "awesome-typescript-loader", "angular2-template-loader" ]
            },

            // CSS
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "css?sourceMap!postcss"),
                exclude: path.resolve(__dirname, "src", "app")
            },

            // HTML
            {
                test: /\.html$/,
                loader: "raw-loader",
                exclude: path.resolve(__dirname, "src", "web")
            },

            // JSON
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    };

    config.node = {
        global: "window",
        crypto: "empty",
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    };

    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.CommonsChunkPlugin({
            name: [ "main", "vendor", "polyfills" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/web/index.html",
            chunksSortMode: "dependency"
        }),
        new ExtractTextPlugin("css/[name].[hash].css")
    ];

    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    return config;
}

module.exports = buildConfiguration();
