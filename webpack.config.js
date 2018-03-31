var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');


module.exports = {
  entry: './src/drawfont.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: [/unused/, /node_modules/]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /unused/
      }
    ]
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: 'vendor'
    // }),
    new HtmlWebpackPlugin({
        filetype: 'pug',
        template: 'src/main.pug'
    }),
    new HtmlWebpackPugPlugin()
  ]
};