const webpack = require("webpack");
const path = require("path");

// Plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const extractCss = new ExtractTextPlugin("css/[name].css?[hash]");

const postCssLoader = {
    loader: "postcss",
    options: {
        plugins: function() {
            return [
                autoprefixer({
                    browsers: [ "last 2 version" ]
                })
            ];
        }
    }
};

const cssLoaders = [
    "to-string",
    {
        loader: "css",
        options: {
            sourceMap: true
        }
    },
    // postCssLoader,
    "resolve-url"
];

const scssLoaders = [
    "to-string",
    "css",
    // postCssLoader,
    "resolve-url",
    {
        loader: "sass",
        options: {
            sourceMap: true
        }
    }
];

function buildConfiguration() {
    const config = {};

    config.cache = true;
    config.devtool = "cheap-module-source-map";

    config.devServer = {
        contentBase: "./src/web",
        historyApiFallback: true,
        quiet: true,
        stats: "minimal"
    };

    config.entry = {
        "polyfills": "./src/polyfills.ts",
        "vendor": "./src/vendor.ts",
        "main": "./src/main.ts"
    };

    config.output = {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].bundle.js?[hash]",
        sourceMapFilename: "js/[name].map?[hash]",
        chunkFilename: "js/[id].chunk.js?[hash]"
    };

    config.resolve = {
        modules: [ "node_modules", path.join(__dirname, "src") ],
        extensions: [ ".ts", ".js", ".css", ".html" ],
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
            // App CSS
            {
                test: /\.css$/,
                loader: cssLoaders,
                include: path.resolve(__dirname, "src", "app")
            },
            // Other CSS
            {
                test: /\.css$/,
                loader: extractCss.extract({ loader: cssLoaders, publicPath: "../" }),
                exclude: path.resolve(__dirname, "src", "app")
            },

            // Fonts
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                loader: "file?context=src/public/&name=[path][name].[hash].[ext]",
                include: path.resolve(__dirname, "src", "web")
            },

            // HTML
            {
                test: /\.html$/,
                loader: "html",
                exclude: path.resolve(__dirname, "src", "web")
            },

            // Images
            {
                test: /\.(gif|ico|jpe?g|png|svg)$/,
                loader: "url?limit=8192&context=src/web/&name=[path][name].[hash].[ext]",
                include: path.resolve(__dirname, "src", "web")
            },

            // JSON
            {
                test: /\.json$/,
                loader: "json"
            },

            // SCSS
            // App SCSS
            {
                test: /\.scss$/,
                loader: scssLoaders,
                include: path.resolve(__dirname, "src", "app")
            },
            // Other SCSS
            {
                test: /\.scss$/,
                loader: extractCss.extract({
                    loader: scssLoaders,
                    publicPath: "../"
                }),
                exclude: path.resolve(__dirname, "src", "app")
            },
        ]
    };

    config.node = {
        crypto: "empty",
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    };

    config.plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.CommonsChunkPlugin({
            name: [ "main", "vendor", "polyfills" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/web/index.html",
            chunksSortMode: "dependency"
        }),
        extractCss
    ];

    return config;
}

module.exports = buildConfiguration();
