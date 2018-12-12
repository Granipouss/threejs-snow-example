const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev')

const appHtmlTitle = 'Webpack Boilerplate'

/**
 * Webpack Configuration
 */
module.exports = {
  entry: {
    bundle: path.join(__dirname, 'src', 'index')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: IS_DEV
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.ejs'),
      title: appHtmlTitle
    })
  ],
  module: {
    rules: [{
      // BABEL
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      options: {
        compact: true
      }
    }, {
      // STYLES
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: IS_DEV }
        }
      ]
    }, {
      // IMAGES
      test: /\.(jpe?g|png|gif)$/,
      loader: 'file-loader',
      options: { name: '[path][name].[ext]' }
    }, {
      // SHADERS
      test: /\.(glsl|vs|fs)$/,
      use: 'raw-loader'
    }]
  }
}
