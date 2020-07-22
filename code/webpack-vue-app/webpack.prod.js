const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: 'none',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        extractComments: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})
