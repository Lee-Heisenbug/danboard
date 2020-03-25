const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
      rules: [
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
          { 
            test: /\.(png|svg|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
              }
            ]
          },
          { 
            test: /\.(glb|gltf)$/,
            use: [
              {
                loader: 'file-loader',
              }
            ]
          },
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
          },
          {
            test: /\.geojson$/,
            use: [ 'json-loader' ]
          }
      ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ]
};