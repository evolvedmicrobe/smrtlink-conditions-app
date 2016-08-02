var webpack = require('webpack');
var path = require('path');

var node_dir = __dirname + '/node_modules';
var bower_dir = __dirname + '/bower_components';

var config = {

  addVendor: function (name, path) {
    this.resolve.alias[name] = path;
    this.module.noParse.push(new RegExp(path));
  },

  entry: "./src/jsx/ConditionJobApp.jsx",
  devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({$: 'jquery'}),
    new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}})
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

//config.addVendor('bootstrap', bower_dir + '/bootstrap/bootstrap.min.js');
//config.addVendor('bootstrap.css', bower_dir + '/bootstrap/bootstrap.min.css');

module.exports = config;