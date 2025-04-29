const path = require('path');
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

const pages = [
  { name: 'index', filename: 'index.html', publicPath: '' },
  { name: '404', filename: '404.html', publicPath: '' },
  { name: 'final/index', filename: 'final/index.html', publicPath: '..' },
];

const htmlPlugins = pages.map(({ name, filename, publicPath }) => new HtmlWebpackPlugin({
  title: 'Franquia de Estética Automotiva - Nani Sound',
  template: path.resolve(__dirname, `src/${name}.html`),
  filename,
  inject: 'body',
  scriptLoading: 'defer',
  favicon: 'favicon.ico',
  publicPath: publicPath, 
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
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) return middlewares;

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
        { from: 'src/assets/video', to: 'assets/video' },
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
