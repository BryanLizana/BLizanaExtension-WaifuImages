// buscadorRutaVscode.ts - Detección de rutas de instalación de VS Code

import * as path from 'path';
import * as vscode from 'vscode';
import { IBuscadorRutaVscode } from './tipos';

export class BuscadorRutaVscode implements IBuscadorRutaVscode {
  private rutaBase: string;
  private esEntornoEscritorio: boolean;

  constructor() {
    const archivoMainPrincipal = require.main?.filename;
    const rutaInstalacionVscode = vscode.env.appRoot;

    this.rutaBase = archivoMainPrincipal?.length
      ? path.dirname(archivoMainPrincipal)
      : path.join(rutaInstalacionVscode, 'out');

    this.esEntornoEscritorio = vscode.env.appHost === 'desktop';
  }

  obtenerRutaBase(): string {
    return this.rutaBase;
  }

  /**
   * Ruta al archivo workbench.desktop.main.js que será parcheado.
   *
   * Rutas típicas:
   * - Windows: {vscode}/resources/app/out/vs/workbench/workbench.desktop.main.js
   * - macOS: /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
   * - Linux: /usr/share/code/resources/app/out/vs/workbench/workbench.desktop.main.js
   */
  obtenerRutaArchivoJs(): string {
    if (this.esEntornoEscritorio) {
      return path.join(this.rutaBase, 'vs', 'workbench', 'workbench.desktop.main.js');
    }
    return path.join(this.rutaBase, 'vs', 'code', 'browser', 'workbench', 'workbench.js');
  }

  esEscritorio(): boolean {
    return this.esEntornoEscritorio;
  }
}
