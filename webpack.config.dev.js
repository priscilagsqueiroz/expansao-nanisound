const path = require('path');
const fs = require("fs");
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
  title: 'Franquia de Estética Automotiva - Nani Sound', // Definição do título
  template: path.resolve(__dirname, `src/${page}.html`), // Caminho absoluto
  filename: `${page}.html`, // Nome do arquivo final
  inject: 'body', // Onde os scripts serão injetados
  scriptLoading: 'defer', // Carregamento assíncrono dos scripts
  favicon: 'favicon.ico', // Caminho para o favicon
  minify: false,
  meta: {
    'viewport': 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no', // Responsividade
    'author': 'Priscila Queiroz',
    'description': 'Torne-se um franqueado Nani Sound e invista em um negócio inovador no setor automotivo com suporte contínuo, alto retorno e uma marca consolidada.',
    'keywords': 'Nani Sound franquia, franquia automotiva, investimento em franquia, negócio lucrativo, empreendedorismo automotivo, abrir franquia, franquia rentável, suporte para franqueados, retorno sobre investimento, mercado automotivo, independência financeira, franquia de sucesso, inovação no setor automotivo, treinamento para franqueados, franquia de serviços automotivos',
    'robots': 'index, follow', // Diretiva de indexação para motores de busca
    'og:title': 'Torne-se um franqueado Nani Sound', // Open Graph title
    'og:description': 'Invista em um negócio inovador no setor automotivo com suporte contínuo, alto retorno e uma marca consolidada.', // Open Graph description
    'og:image': '/assets/img/metatag.png', // Open Graph image
    'og:url': 'https://www.melhorfranquiaautomotiva.com.br/', // Open Graph URL
    'og:type': 'website', // Tipo de conteúdo para Open Graph
    'twitter:card': 'summary_large_image', // Twitter card
    'twitter:title': 'Torne-se um franqueado Nani Sound', // Twitter title
    'twitter:description': 'Invista em um negócio inovador no setor automotivo com suporte contínuo, alto retorno e uma marca consolidada.', // Twitter description
    'twitter:image': '/assets/img/metatag.png', // Twitter image
  },
}));
module.exports = merge(common, {
  mode: 'development',
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
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000, // Porta alterada para 8080
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        return middlewares;
      }

      devServer.app.get("/robots.txt", (req, res) => {
        res.set("Content-Type", "text/plain");
        res.send("User-agent: *\nAllow: /");
      });

      return middlewares;
    },
  },
  plugins: [
    ...htmlPlugins,
    new GenerateRobotsTxtPlugin(),
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
  ],
});