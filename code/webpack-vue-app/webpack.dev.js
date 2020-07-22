const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // contentBase: './dist', // 告诉服务器去哪里找文件，只有项目中依赖静态文件时才需要
    host: '0.0.0.0',
    port: 4500,
    progress: true,
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
})
