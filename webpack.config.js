'use strict';

const path = require('path');
const webpack = require('webpack');
const extensionPackage = require('./package.json');

const config = {
  target: 'node',

  entry: './client/src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externalsPresets:{
    node: true
  },
  externals: [
    {
      vscode: 'commonjs vscode'
  },
    "@azure/functions-core" 
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.node$/,
        loader: 'node-loader'
      }
    ]
  }, 
  plugins: [new webpack.DefinePlugin({
    'process.env.PACKAGE_NAME': JSON.stringify(extensionPackage.name),
    'process.env.PACKAGE_VERSION': JSON.stringify(extensionPackage.version),
    'process.env.PACKAGE_AI_KEY': JSON.stringify(extensionPackage.aiKey)
  })]
};
module.exports = config;