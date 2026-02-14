// configuracion.ts - Wrapper para la configuración de VS Code

import * as vscode from 'vscode';
import { IConfiguracionWaifu } from './tipos';
import { NOMBRE_EXTENSION } from './constantes';

export class Configuracion {
  /** Lee la configuración actual desde los settings de VS Code */
  obtenerConfiguracion(): IConfiguracionWaifu {
    const config = vscode.workspace.getConfiguration(NOMBRE_EXTENSION);
    return {
      habilitado: config.get<boolean>('habilitado', true),
      opacidad: config.get<number>('opacidad', 0.4),
      tamano: config.get<number>('tamano', 300),
      rutaCarpetaImagenes: config.get<string>('rutaCarpetaImagenes', ''),
    };
  }

  /** Registra un listener para cambios de configuración. Retorna un Disposable. */
  alCambiarConfiguracion(
    callback: (configuracion: IConfiguracionWaifu) => void
  ): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((evento) => {
      if (evento.affectsConfiguration(NOMBRE_EXTENSION)) {
        callback(this.obtenerConfiguracion());
      }
    });
  }
}
