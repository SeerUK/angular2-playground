const webpack = require("webpack");
const path = require("path");

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");

function buildConfiguration() {
    const config = {};

    config.debug = true;
    config.devtool = "eval";

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
            { test: /\.ts$/, loaders: [ "awesome-typescript-loader", "angular2-template-loader" ] },
            { test: /\.css$/, loaders: [ "to-string-loader", "css-loader" ] },
            { test: /\.html$/, loader: "raw-loader", exclude: path.resolve(__dirname, "src", "web") }
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
        })
    ];

    return config;
}

module.exports = buildConfiguration();
