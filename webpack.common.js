const path = require('path');

module.exports = {
  entry: {
    app: './src/assets/vendor/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './assets/vendor/js/[name].[contenthash].js',
  },
  module: {
    rules: [
      // Otimização de imagens
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: path.resolve(__dirname, 'custom-sharp-loader.js'), // Usa o loader personalizado
          options: {
            name: 'assets/images/[name].[hash].[ext]',
          },
        }, ],
      },
      // Transpilação de JS com Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // Carregamento de CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
