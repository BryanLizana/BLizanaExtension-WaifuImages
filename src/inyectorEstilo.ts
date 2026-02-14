// inyectorEstilo.ts - Parchea y restaura workbench.desktop.main.js

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { IInyectorEstilo, IBuscadorRutaVscode, EEstadoParche } from './tipos';
import {
  CODIFICACION,
  MARCADOR_INICIO,
  REGEX_PARCHE,
  MARCADOR_FIN,
  VERSION,
} from './constantes';

export class InyectorEstilo implements IInyectorEstilo {
  private buscadorRuta: IBuscadorRutaVscode;
  private rutaArchivoJs: string;

  constructor(buscadorRuta: IBuscadorRutaVscode) {
    this.buscadorRuta = buscadorRuta;
    this.rutaArchivoJs = buscadorRuta.obtenerRutaArchivoJs();
  }

  obtenerRutaArchivoJs(): string {
    return this.rutaArchivoJs;
  }

  /** Verifica si el parche ya está instalado en el archivo workbench */
  async estaInstalado(): Promise<boolean> {
    try {
      const contenido = await fs.promises.readFile(this.rutaArchivoJs, CODIFICACION);
      return contenido.includes(MARCADOR_INICIO);
    } catch {
      return false;
    }
  }

  /** Detecta el estado actual del parche */
  async obtenerEstadoParche(): Promise<EEstadoParche> {
    try {
      const contenido = await fs.promises.readFile(this.rutaArchivoJs, CODIFICACION);

      if (!contenido.includes(MARCADOR_INICIO)) {
        return EEstadoParche.SinModificar;
      }

      if (contenido.includes(`WAIFU_VERSION = '${VERSION}'`)) {
        return EEstadoParche.VersionActual;
      }

      return EEstadoParche.VersionAnterior;
    } catch {
      return EEstadoParche.SinModificar;
    }
  }

  /**
   * Instala el parche: limpia parches anteriores y agrega el nuevo bloque.
   * Si falla por permisos, intenta con elevación.
   */
  async instalar(contenidoScript: string): Promise<boolean> {
    try {
      let contenido = await fs.promises.readFile(this.rutaArchivoJs, CODIFICACION);
      contenido = this.limpiarParches(contenido);

      const bloquePatch = `\n${MARCADOR_INICIO} ${VERSION}\n${contenidoScript}\n${MARCADOR_FIN}`;
      contenido += bloquePatch;

      await this.guardarContenido(contenido);
      return true;
    } catch (error) {
      console.error('[waifu-tab-images] Error instalando parche:', error);
      throw error;
    }
  }

  /** Elimina el parche y restaura el archivo original */
  async desinstalar(): Promise<boolean> {
    try {
      let contenido = await fs.promises.readFile(this.rutaArchivoJs, CODIFICACION);

      if (!contenido.includes(MARCADOR_INICIO)) {
        return true;
      }

      contenido = this.limpiarParches(contenido);
      await this.guardarContenido(contenido);
      return true;
    } catch (error) {
      console.error('[waifu-tab-images] Error desinstalando parche:', error);
      throw error;
    }
  }

  private limpiarParches(contenido: string): string {
    return contenido.replace(REGEX_PARCHE, '');
  }

  /** Intenta escribir directamente; si falla por permisos, escala con sudo */
  private async guardarContenido(contenido: string): Promise<void> {
    try {
      await fs.promises.writeFile(this.rutaArchivoJs, contenido, CODIFICACION);
    } catch (errorDirecto: any) {
      if (errorDirecto.code === 'EPERM' || errorDirecto.code === 'EACCES') {
        await this.guardarConElevacion(contenido);
      } else {
        throw errorDirecto;
      }
    }
  }

  /** Escribe a archivo temporal y lo mueve al destino con permisos elevados */
  private async guardarConElevacion(contenido: string): Promise<void> {
    const sudo = require('@vscode/sudo-prompt');
    const rutaTemporal = path.join(os.tmpdir(), `waifu-tab-patch-${Date.now()}.js`);

    try {
      await fs.promises.writeFile(rutaTemporal, contenido, CODIFICACION);

      const comando =
        process.platform === 'win32'
          ? `copy /Y "${rutaTemporal}" "${this.rutaArchivoJs}"`
          : `cp -f "${rutaTemporal}" "${this.rutaArchivoJs}"`;

      await new Promise<void>((resolver, rechazar) => {
        sudo.exec(comando, { name: 'Waifu Tab Images' }, (error?: Error) => {
          if (error) { rechazar(error); } else { resolver(); }
        });
      });
    } finally {
      try {
        if (fs.existsSync(rutaTemporal)) {
          await fs.promises.unlink(rutaTemporal);
        }
      } catch {
        // Ignorar errores de limpieza
      }
    }
  }
}
