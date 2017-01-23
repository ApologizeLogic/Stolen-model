var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {

  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/app.jsx')
  ],

  resolve: {
    extensions: ["", ".js", ".jsx", ".css", ".scss"]
  },

  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js'
  },
  plugins: [
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Moves files
    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname, "src")),

    new ExtractTextPlugin("styles.css")
  ],
  module: {

    preLoaders: [
      {
        //Eslint loader
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "src/app")],
        exclude: [nodeModulesPath]
      },
    ],
    loaders: [
      {
        //React-hot loader and
        test: /\.(js|jsx)$/,
        loaders: ['react-hot', 'babel'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath]
      },
      { 
        test: /\.scss$/, 
        loader: ExtractTextPlugin.extract("style", "css!sass") 
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        loader: 'file?name=./static/fonts/[name].[ext]'
      }
    ]
  },

  eslint: {
    configFile: '.eslintrc'
  },
};

module.exports = config;