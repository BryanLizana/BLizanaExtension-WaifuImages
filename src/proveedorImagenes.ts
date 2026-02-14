// proveedorImagenes.ts - Escaneo de carpeta y conversión de imágenes a base64

import * as fs from 'fs';
import * as path from 'path';
import { IProveedorImagenes, IImagenBase64 } from './tipos';
import { RUTA_IMAGENES_DEFECTO, EXTENSIONES_IMAGEN_SOPORTADAS } from './constantes';

const MAPA_MIME: Record<string, string> = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'bmp': 'image/bmp',
};

export class ProveedorImagenes implements IProveedorImagenes {
  private imagenesCache: IImagenBase64[] = [];
  private rutaCarpeta: string;

  constructor(rutaCarpetaPersonalizada?: string) {
    this.rutaCarpeta =
      rutaCarpetaPersonalizada && rutaCarpetaPersonalizada.length > 0
        ? rutaCarpetaPersonalizada
        : RUTA_IMAGENES_DEFECTO;
  }

  /** Escanea la carpeta de imágenes y convierte cada una a data URI base64 */
  async escanearImagenes(): Promise<IImagenBase64[]> {
    this.imagenesCache = [];

    if (!fs.existsSync(this.rutaCarpeta)) {
      console.warn(`[waifu-tab-images] Carpeta no encontrada: ${this.rutaCarpeta}`);
      return this.imagenesCache;
    }

    const archivos = await fs.promises.readdir(this.rutaCarpeta);
    const archivosImagen = archivos.filter((archivo) => {
      const extension = path.extname(archivo).toLowerCase();
      return EXTENSIONES_IMAGEN_SOPORTADAS.includes(extension);
    });

    for (const archivo of archivosImagen) {
      try {
        const rutaCompleta = path.join(this.rutaCarpeta, archivo);
        const bufferArchivo = await fs.promises.readFile(rutaCompleta);
        const base64 = bufferArchivo.toString('base64');
        const extension = path.extname(archivo).toLowerCase().slice(1);
        const tipoMime = MAPA_MIME[extension] || 'image/png';

        this.imagenesCache.push({
          nombreArchivo: archivo,
          uriDatos: `data:${tipoMime};base64,${base64}`,
          tipoMime,
        });
      } catch (error) {
        console.error(`[waifu-tab-images] Error leyendo ${archivo}:`, error);
      }
    }

    return this.imagenesCache;
  }

  obtenerImagenPorNombre(nombre: string): IImagenBase64 | undefined {
    return this.imagenesCache.find((img) => img.nombreArchivo === nombre);
  }

  obtenerImagenAleatoria(): IImagenBase64 | undefined {
    if (this.imagenesCache.length === 0) { return undefined; }
    const indice = Math.floor(Math.random() * this.imagenesCache.length);
    return this.imagenesCache[indice];
  }

  obtenerTodasLasImagenes(): IImagenBase64[] {
    return [...this.imagenesCache];
  }
}
