const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        popup: path.join(__dirname, '../src/popup.tsx'),
        options: path.join(__dirname, '../src/options.ts'),
        background: path.join(__dirname, '../src/background.ts'),
        content_script: path.join(__dirname, '../src/content_script.ts'),
        injected: path.join(__dirname, '../src/injected.ts'),
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js'
    },
    // optimization: {
    //     splitChunks: {
    //         name: 'vendor',
    //         chunks: "initial"
    //     }
    // },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                      }
                    }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1000000,
                        name: 'assets/[name].[hash:8].[ext]'
                    }
                }
            },
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};
