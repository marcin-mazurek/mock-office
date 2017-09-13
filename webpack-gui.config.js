const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/lib/gui/styles/main.scss',
    './src/lib/gui/main.js'
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg|png|ico)(\?.+)?$/,
        loader: 'file-loader',
        query: {
          name: './static/[name].[ext]'
        }
      },
      { test: /\.json/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/lib/gui/index.html',
      chunksSortMode: 'dependency'
    })
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/lib/gui'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'
    ]
  }
};
