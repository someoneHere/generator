let path = require('path')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

let commonConfig = require('./webpack.common')
let _ = require('lodash')

let webpackConfig = _.assignIn({}, commonConfig, {
  output: {
    filename: '[id].js',
    chunkFilename: '[id].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/generate/'
  },
  devtool: 'eval-source-map',
  optimization: _.assignIn({}, commonConfig.optimization, {
    noEmitOnErrors: true
  })
})

webpackConfig.plugins = _.concat(webpackConfig.plugins, [
  new MiniCssExtractPlugin({
    filename: '[id].css',
    chunkFilename: '[id].css'
  }),
  new FilterWarningsPlugin({
    // suppress conflicting order warnings from mini-css-extract-plugin.
    // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
    exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
  })
])

module.exports = webpackConfig
