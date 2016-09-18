const webpack = require("webpack");
const path = require("path");

// Plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const extractCss = new ExtractTextPlugin("css/[name].css?[hash]");

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
        filename: "js/[name].bundle.js?[hash]",
        sourceMapFilename: "js/[name].map?[hash]",
        chunkFilename: "js/[id].chunk.js?[hash]"
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
                loaders: [ "awesome-typescript", "angular2-template" ]
            },

            // CSS
            {
                test: /\.css$/,
                loader: "stringify!css!postcss",
                include: path.resolve(__dirname, "src", "app")
            },
            {
                test: /\.css$/,
                loader: extractCss.extract("css?sourceMap!postcss", { publicPath: "../" }),
                exclude: path.resolve(__dirname, "src", "app")
            },

            // Fonts
            {
                test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file?context=src/web/&name=[path][name].[ext]?[hash]",
                include: path.resolve(__dirname, "src", "web", "font")
            },

            // HTML
            {
                test: /\.html$/,
                loader: "html",
                exclude: path.resolve(__dirname, "src", "web")
            },

            // Images
            {
                test: /\.(gif|ico|jpe?g|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url?limit=8192&context=src/web/&name=[path][name].[ext]?[hash]",
                include: path.resolve(__dirname, "src", "web", "img")
            },

            // JSON
            {
                test: /\.json$/,
                loader: "json"
            },

            // SCSS
            {
                test: /\.scss$/,
                loader: "stringify!css!postcss!sass",
                include: path.resolve(__dirname, "src", "app")
            },
            {
                test: /\.scss$/,
                loader: extractCss.extract("css?sourceMap!postcss!sass", { publicPath: "../" }),
                exclude: path.resolve(__dirname, "src", "app")
            },
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
        extractCss
    ];

    config.postcss = [
        autoprefixer({
            browsers: [ "last 2 version" ]
        })
    ];

    return config;
}

module.exports = buildConfiguration();
