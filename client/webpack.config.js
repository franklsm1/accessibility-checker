const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        modules: [path.join(__dirname, 'src', 'js'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64]',
                            sourceMap: true,
                            minimize: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
    })],
};
