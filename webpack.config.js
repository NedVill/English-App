const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const filename = (ext) => (isDev ? `[hash].[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hrm: isDev,
        reloadAll: true,
        publicPath: ''
      },
    }, 'css-loader'
  ]

  if (isProd) {
    loaders.push(
      {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
            plugins: [
              autoprefixer({
                overrideBrowserslist:['ie >= 11', 'last 4 version'],
              }),
            ],
            sourceMap: isDev,
          }
        }
      }
    );
  }

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

babelOptions = () => {
  return {
    presets: [
        '@babel/preset-env'
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties'
    ]
  }
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions() 
  }]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'), // где лежать все файлы
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './js/index.js']
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  //devtool: isDev ? 'source-map' : 'hidden-source-map',
  plugins: [ // иницпализация плагинов
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin({
      cache: false,
    }),
    new CleanObsoleteChunks(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })
  ],
  resolve: { // работа с путями (импортами)
    extensions: ['.js', '.json', '.jpg', '.css'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@src': path.resolve(__dirname, 'src'),
      '@node': path.resolve(__dirname, 'node_modules'),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
  },
  module: { // запуск лоадеров в зависимости от типа файла
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.scss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|svg|jpg)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }
    ]
  }
}