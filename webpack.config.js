module.exports = {
  entry: './src/renderer/main.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
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
