const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const common = require('./webpack.common.js')

function resolve (url) {
    return path.resolve(__dirname, '..', url)
}

module.exports = merge(common, {
    mode: 'production',
    // devtool: 'source-map',
    // TODO: 需要了解如何用postinstall来清除缓存目录
    // 缓存可以使用postinstall来清除
    cache: {
        type: 'filesystem'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: resolve('dist'),
        assetModuleFilename: 'asset/[hash][ext][query]',
        clean: true
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
            typescript: {
                memoryLimit: 4096
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
        }),
        new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            } 
        ]
    },
    optimization: {
        moduleIds: 'deterministic',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: 'single',
        minimizer: [
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`）
            '...',
            new CssMinimizerPlugin()
        ]
    },
})
