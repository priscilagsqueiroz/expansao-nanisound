const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

class GenerateRobotsTxtPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("GenerateRobotsTxtPlugin", (compilation, callback) => {
      const content = `User-agent: *\nAllow: /`;
      compilation.assets["robots.txt"] = {
        source: () => content,
        size: () => content.length,
      };
      callback();
    });
  }
}

const pages = [
  { name: 'index', filename: 'index.html', publicPath: '' },
  { name: '404', filename: '404.html', publicPath: '' },
  { name: 'final/index', filename: 'final/index.html', publicPath: '../' },
];

const htmlPlugins = pages.map(({ name, filename, publicPath }) => new HtmlWebpackPlugin({
  title: 'Franquia de Estética Automotiva - Nani Sound',
  template: path.resolve(__dirname, `src/${name}.html`),
  filename,
  inject: 'body',
  scriptLoading: 'defer',
  favicon: 'favicon.ico',
  publicPath: publicPath, 
  minify: {
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    removeComments: true,
    keepClosingSlash: true,
  },
  meta: {
    'viewport': 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    'author': 'Priscila Queiroz',
    'description': 'Torne-se um franqueado Nani Sound e invista em um negócio inovador no setor automotivo com suporte contínuo, alto retorno e uma marca consolidada.',
    'keywords': 'Nani Sound franquia, franquia automotiva, investimento em franquia, negócio lucrativo, empreendedorismo automotivo, abrir franquia, franquia rentável, suporte para franqueados, retorno sobre investimento, mercado automotivo, independência financeira, franquia de sucesso, inovação no setor automotivo, treinamento para franqueados, franquia de serviços automotivos',
    'robots': 'index, follow',
    'og:title': 'Torne-se um franqueado Nani Sound',
    'og:description': 'Invista em um negócio inovador no setor automotivo com suporte contínuo, alto retorno e uma marca consolidada.',
    'og:image': '/assets/img/metatag.png',
    'og:url': 'https://www.melhorfranquiaautomotiva.com.br/',
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Torne-se um franqueado Nani Sound',
    'twitter:description': 'Invista em um negócio inovador no setor automotivo com suporte contínuo, alto retorno e uma marca consolidada.',
    'twitter:image': '/assets/img/metatag.png',
  },
}));

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'assets/vendor/js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',  // Defina aqui o caminho base para os arquivos estáticos
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: { quality: 80 },
              png: { quality: 80 },
              webp: { quality: 80 },
              avif: { quality: 80 },
            },
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new GenerateRobotsTxtPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/img', to: 'assets/img' },
        { from: 'src/assets/video', to: 'assets/video' },
        { from: 'src/assets/css', to: 'assets/css' },
        { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'assets/css/bootstrap.min.css' },
        { from: 'node_modules/aos/dist/aos.css', to: 'assets/css/aos.css' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'icon.png', to: 'icon.png' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: ['input', 'btn', 'alert'],
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      },
    }),
    new BundleAnalyzerPlugin(),
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
});
