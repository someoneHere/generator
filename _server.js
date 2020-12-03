let webpack = require('webpack')
let webpackDevServer = require('webpack-dev-server')
let config = require('./webpack.config')

config.entry.unshift('webpack-dev-server/client?https://0.0.0.0:3100/')

let compiler = webpack(config)
let server = new webpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: {
    verbose: true,
    index: '/generate/'
  },
  https: true,
  disableHostCheck: true,
  host: '0.0.0.0',
  port: 3100,
  stats: 'errors-only'
})

server.listen(3100)
