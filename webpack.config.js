const path = require('path');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        bar: './src/bar/index.js',
        line: './src/line/line.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']

            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader:"file-loader",
                options:{
                  name:'[name].[ext]',
                  outputPath:'assets/images/'
                  //the images will be emited to dist/assets/images/ folder
                }
              }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/bar/index.html',
            chunks: ['bar'],
        }),
        new HtmlWebpackPlugin({
            filename: 'line.html',
            template: './src/line/line.html',
            chunks: ['line'],
        }),
        new WebpackManifestPlugin(),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })

    ]
}