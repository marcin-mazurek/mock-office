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
  devtool: 'source-map',
  output: {
    path: './dist/renderer',
    filename: 'bundle.js',
    publicPath: './dist/renderer/'
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules'
    ]
  }
};
