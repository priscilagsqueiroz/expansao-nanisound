const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

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

const pages = ['index', '404'];

const htmlPlugins = pages.map(page => new HtmlWebpackPlugin({
  title: 'Franquia de Estética Automotiva - Nani Sound',
  template: `./src/${page}.html`,
  filename: `${page}.html`,
  inject: 'body',
  scriptLoading: 'defer',
  favicon: 'favicon.ico',
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
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
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
              jpeg: { quality: 80 }, // Reduz qualidade para melhor compressão
              png: { quality: 80 }, 
              webp: { quality: 80 }, // Gera WebP com compressão
              avif: { quality: 80 }, // Gera Avif com compressão
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              adapter: require('responsive-loader/sharp'),
              sizes: [480, 768, 1080, 1920], // Tamanhos otimizados para diferentes dispositivos
              placeholder: true,
              quality: 80, // Reduz o peso mantendo boa qualidade
              format: 'webp', // Converte automaticamente para WebP
            },
          },
        ],
        type: 'asset',
      },      
    ],
  },
  plugins: [
    ...htmlPlugins,
    new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/img', to: 'assets/img' },
        { from: 'src/assets/video', to: 'assets/video' },
        { from: 'src/assets/css', to: 'assets/css' },
        { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'assets/css/bootstrap.min.css' },
        { from: 'node_modules/aos/dist/aos.css', to: 'assets/css/aos.css' },
        { from: 'src/assets/vendor/js', to: 'assets/vendor/js' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'icon.png', to: 'icon.png' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
    new GenerateRobotsTxtPlugin(), // Gera automaticamente o robots.txt
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: ['input', 'input[type="text"]', 'btn', 'alert'], // Protegendo classes comuns de remoção acidental
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
  ],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
});
