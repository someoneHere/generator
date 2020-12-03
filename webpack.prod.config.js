let path = require('path')
let config = require('./package.json')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
let commonConfig = require('./webpack.common')
let _ = require('lodash')

let webpackConfig = _.assignIn({}, commonConfig, {
  output: {
    filename: '[id]_' + config.version + '_[hash].js',
    path: path.resolve(__dirname, 'generator'),
    publicPath: './'
  },
  optimization: _.assignIn({}, commonConfig.optimization, {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  })
})

webpackConfig.plugins = _.concat(webpackConfig.plugins, [
  new MiniCssExtractPlugin({
    filename: '[id]_' + config.version + '_[hash].css',
    chunkFilename: '[id]_' + config.version + '_[hash].css'
  })
])

module.exports = webpackConfig