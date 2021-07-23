const nodeExternals = require('webpack-node-externals');

module.exports = {
  externals: [nodeExternals()],
};

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            compact: true,
            exclude: file =>
              /node_modules/.test(file) && !/\.vue\.js/.test(file),
          },
        },
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
