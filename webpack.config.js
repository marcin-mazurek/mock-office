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
    path: './dist',
    filename: 'renderer.js'
  },
  target: 'electron-renderer'
};
