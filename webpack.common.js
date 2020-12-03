let webpack = require('webpack')
let path = require('path')
let config = require('./package.json')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['./app/index.js'],
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, 'app')
      ],
      use: [{
        loader: 'eslint-loader',
        options: {
          quiet: true
        }
      },
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env']
        }
      }]
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
      ]
    }, {
      test: /\.less/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            modifyVars: {
              'brand-primary': '#4D7CFE'
            },
          }
        }
      ]
    }, {
      test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.(png|jpg|jpeg|svg|gif)/,
      use: ['url-loader', 'image-webpack-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: config.template,
      inject: true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}