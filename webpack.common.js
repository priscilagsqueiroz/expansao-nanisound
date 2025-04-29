const path = require('path');

module.exports = {
  entry: {
    app: './src/assets/vendor/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'assets/vendor/js/[name].[contenthash].js',
  },
  module: {
    rules: [
      // Otimização de imagens
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: path.resolve(__dirname, 'custom-sharp-loader.js'),
            options: {
              name: 'assets/images/[name].[hash].[ext]',
            },
          },
        ],
      },
      // Transpilação de JavaScript com Babel
      {
        test: /\.m?js$/, // aceitando .mjs também, que é comum em libs novas
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['defaults', 'safari >= 10'],
                  },
                  useBuiltIns: false,
                },
              ],
            ],            
          },
        },
      },
      // Carregamento de CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
