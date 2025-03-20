const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = function(source) {
  const callback = this.async();
  const filePath = this.resourcePath;
  const ext = path.extname(filePath).toLowerCase();
  const outputDir = this._compiler.outputPath; // Isso garante que a saída respeitará o diretório de saída padrão do Webpack
  const optimizedFileName = path.basename(filePath, ext) + '.webp'; // Pode até alterar isso para algo mais único se necessário
  const optimizedFilePath = path.join(outputDir, 'assets/images', optimizedFileName);

  // Crie o diretório de saída se ainda não existir
  fs.mkdirSync(path.dirname(optimizedFilePath), { recursive: true });

  // Verifica se a imagem já foi otimizada
  if (fs.existsSync(optimizedFilePath)) {
    return callback(null, `module.exports = ${JSON.stringify('./assets/images/' + optimizedFileName)};`);
  }

  sharp(filePath)
    .resize(1200)
    .webp({ quality: 70 }) 
    .toFile(optimizedFilePath, (err, info) => {
      if (err) {
        callback(err);
      } else {
        this.emitFile(path.relative(outputDir, optimizedFilePath), fs.readFileSync(optimizedFilePath));
        callback(null, `module.exports = ${JSON.stringify('./assets/images/' + optimizedFileName)};`);
      }
    });
};