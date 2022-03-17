const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')

function resolve (url) {
    return path.resolve(__dirname, '..', url)
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: resolve('dist'),
        hot: true
    },
    output: {
        filename: '[name].js',
        // pathinfo: false,  // 打印路径信息，依赖模块过多的时候可以关闭以节约性能
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            } 
        ]
    },
    optimization: {
        runtimeChunk: true
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypyScript', excludeWarnings: false })
    ]
})
