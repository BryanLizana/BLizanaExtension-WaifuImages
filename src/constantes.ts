// constantes.ts - Constantes de la extensión Waifu Tab Images

import * as path from 'path';

/** Versión de la extensión (leída desde package.json) */
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION: string = require('../package.json').version;

/** Nombre de la extensión para namespace de configuración */
export const NOMBRE_EXTENSION = 'waifuTabImages';

/** Codificación de archivos */
export const CODIFICACION: BufferEncoding = 'utf-8';

/** Marcadores para delimitar el código inyectado en workbench JS */
export const MARCADOR_INICIO = '// waifu-tab-images-start';
export const MARCADOR_FIN = '// waifu-tab-images-end';

/** Regex para encontrar y limpiar bloque de parche inyectado */
export const REGEX_PARCHE = /\n\/\/ waifu-tab-images-start[\s\S]*?\/\/ waifu-tab-images-end/g;

/** Directorio raíz de la extensión */
export const RAIZ_EXTENSION = path.join(__dirname, '..');

/** Directorio de imágenes por defecto */
export const RUTA_IMAGENES_DEFECTO = path.join(RAIZ_EXTENSION, 'default', 'images');

/** Extensiones de archivo de imagen soportadas */
export const EXTENSIONES_IMAGEN_SOPORTADAS = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp',
];

/** Traducciones de la advertencia de corrupción para ocultarla via CSS */
export const TRADUCCIONES_ADVERTENCIA_CORRUPCION = [
  'Your Code installation appears to be corrupt',
  'La instalación de Code parece estar dañada',
  'Ihre Code-Installation scheint beschädigt zu sein',
  'Votre installation de Code semble être corrompue',
  'VSCode安装似乎已损坏',
  'A instalação do Code parece estar corrompida',
  'VS Code のインストールが破損しているようです',
  'Code 설치가 손상된 것 같습니다',
];
