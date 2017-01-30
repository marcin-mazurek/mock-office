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
      }
    ]
  },
  devtool: 'source-map',
  output: {
    path: './dist/renderer',
    filename: 'bundle.js'
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules'
    ]
  }
};
