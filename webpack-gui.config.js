const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/double-gui/styles/main.scss',
    './src/double-gui/main.js'
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg|png|ico)(\?.+)?$/,
        loader: 'file-loader',
        query: {
          name: './static/[name].[ext]'
        }
      },
      { test: /\.json/, loader: 'json' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/double-gui/index.html',
      chunksSortMode: 'dependency'
    })
  ],
  devtool: 'source-map',
  output: {
    path: './dist/double-gui',
    filename: 'bundle.js',
    publicPath: './'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules'
    ]
  }
};
