const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/renderer/styles/main.scss',
    './src/renderer/main.js'
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
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/renderer'),
    filename: 'bundle.js',
    publicPath: './dist/renderer/'
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'
    ]
  }
};
