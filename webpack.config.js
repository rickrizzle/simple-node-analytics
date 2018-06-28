const path = require('path');

module.exports = {
  entry: {
    main: path.resolve('./client/analytics.js')
  },

  output: {
    filename: 'client.bundle.js',
    path: path.resolve('./'),
    library: 'analytics'
  },

  devtool: '#cheap-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
