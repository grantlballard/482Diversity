const webpack = require("webpack");
var path = require("path");

const config = {
  entry: __dirname + "/js/index.jsx",
  output: {
    path: __dirname + "/js",
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  }
};
module.exports = config;
