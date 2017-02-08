module.exports = {
  entry: [
    './public/src/index.js'
  ],
  output: {
    path: './public/dist/',
    publicPath: './public/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    },
    {
      test: /\.json$/,
      loader: 'json'
    },
    {
      test: /\.js$/, loader: 'babel', query: {
        compact: false
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
