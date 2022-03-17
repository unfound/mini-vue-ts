const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve (url) {
    return path.resolve(__dirname, '..', url)
}

module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: resolve('src/index.ts'),
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('index.html'),
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }, {
                test: /\.tsx?$/i,
                // 也可以试试awesome-typescript-loader，自称有更好的性能
                use: [
                    { loader: 'ts-loader', options: { transpileOnly: true } }
                ],
                exclude: /node_modules/
            }
        ]
    }
}