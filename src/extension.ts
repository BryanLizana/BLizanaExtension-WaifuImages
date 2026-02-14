// extension.ts - Punto de entrada y orquestación de la extensión

import * as vscode from 'vscode';
import { BuscadorRutaVscode } from './buscadorRutaVscode';
import { Configuracion } from './configuracion';
import { ProveedorImagenes } from './proveedorImagenes';
import { GeneradorCss } from './generadorCss';
import { InyectorEstilo } from './inyectorEstilo';
import { EEstadoParche } from './tipos';
import { VERSION } from './constantes';

export async function activate(contexto: vscode.ExtensionContext): Promise<void> {
  // Composición de dependencias (DI manual en el composition root)
  const configuracionServicio = new Configuracion();
  const configuracion = configuracionServicio.obtenerConfiguracion();
  const buscadorRuta = new BuscadorRutaVscode();
  const inyector = new InyectorEstilo(buscadorRuta);
  const generadorCss = new GeneradorCss();

  // --- Comando: Instalar ---
  const comandoInstalar = vscode.commands.registerCommand(
    'waifuTabImages.instalar',
    async () => {
      try {
        const configActual = configuracionServicio.obtenerConfiguracion();
        const proveedor = new ProveedorImagenes(configActual.rutaCarpetaImagenes);
        const imagenes = await proveedor.escanearImagenes();

        if (imagenes.length === 0) {
          vscode.window.showWarningMessage(
            'Waifu Tab Images: No se encontraron imagenes. Verifica la ruta de la carpeta.'
          );
          return;
        }

        const scriptInyeccion = generadorCss.generarScriptInyeccion(imagenes, configActual);
        await inyector.instalar(scriptInyeccion);

        const respuesta = await vscode.window.showInformationMessage(
          `Waifu Tab Images: Instalado con ${imagenes.length} imagen(es). Reinicia VS Code para activar.`,
          'Reiniciar Ahora'
        );

        if (respuesta === 'Reiniciar Ahora') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Waifu Tab Images: Error al instalar - ${error.message}`
        );
      }
    }
  );

  // --- Comando: Desinstalar ---
  const comandoDesinstalar = vscode.commands.registerCommand(
    'waifuTabImages.desinstalar',
    async () => {
      try {
        await inyector.desinstalar();

        const respuesta = await vscode.window.showInformationMessage(
          'Waifu Tab Images: Desinstalado. Reinicia VS Code para completar.',
          'Reiniciar Ahora'
        );

        if (respuesta === 'Reiniciar Ahora') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Waifu Tab Images: Error al desinstalar - ${error.message}`
        );
      }
    }
  );

  // --- Comando: Recargar Imágenes ---
  const comandoRecargar = vscode.commands.registerCommand(
    'waifuTabImages.recargar',
    async () => {
      try {
        const configActual = configuracionServicio.obtenerConfiguracion();
        const proveedor = new ProveedorImagenes(configActual.rutaCarpetaImagenes);
        const imagenes = await proveedor.escanearImagenes();

        if (imagenes.length === 0) {
          vscode.window.showWarningMessage(
            'Waifu Tab Images: No se encontraron imagenes.'
          );
          return;
        }

        const scriptInyeccion = generadorCss.generarScriptInyeccion(imagenes, configActual);
        await inyector.instalar(scriptInyeccion);

        const respuesta = await vscode.window.showInformationMessage(
          `Waifu Tab Images: ${imagenes.length} imagen(es) recargadas. Reinicia para aplicar.`,
          'Reiniciar Ahora'
        );

        if (respuesta === 'Reiniciar Ahora') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Waifu Tab Images: Error al recargar - ${error.message}`
        );
      }
    }
  );

  contexto.subscriptions.push(comandoInstalar, comandoDesinstalar, comandoRecargar);

  // --- Detección de estado al activar ---
  if (configuracion.habilitado) {
    const estadoParche = await inyector.obtenerEstadoParche();

    if (estadoParche === EEstadoParche.SinModificar) {
      const respuesta = await vscode.window.showInformationMessage(
        `Waifu Tab Images v${VERSION} listo. Instalar para activar las imagenes.`,
        'Instalar y Reiniciar',
        'Mas tarde'
      );

      if (respuesta === 'Instalar y Reiniciar') {
        vscode.commands.executeCommand('waifuTabImages.instalar');
      }
    } else if (estadoParche === EEstadoParche.VersionAnterior) {
      const respuesta = await vscode.window.showInformationMessage(
        'Waifu Tab Images: Nueva version detectada. Actualizar parche?',
        'Actualizar y Reiniciar',
        'Mas tarde'
      );

      if (respuesta === 'Actualizar y Reiniciar') {
        vscode.commands.executeCommand('waifuTabImages.instalar');
      }
    }
  }

  // --- Listener de cambios de configuración ---
  const suscripcionConfig = configuracionServicio.alCambiarConfiguracion(
    async (nuevaConfig) => {
      if (!nuevaConfig.habilitado) {
        const estaInstalado = await inyector.estaInstalado();
        if (estaInstalado) {
          const respuesta = await vscode.window.showInformationMessage(
            'Waifu Tab Images: Extension deshabilitada. Desinstalar parche?',
            'Desinstalar y Reiniciar'
          );
          if (respuesta) {
            vscode.commands.executeCommand('waifuTabImages.desinstalar');
          }
        }
      } else {
        const respuesta = await vscode.window.showInformationMessage(
          'Waifu Tab Images: Configuracion actualizada. Aplicar cambios?',
          'Aplicar y Reiniciar'
        );
        if (respuesta) {
          vscode.commands.executeCommand('waifuTabImages.instalar');
        }
      }
    }
  );

  contexto.subscriptions.push(suscripcionConfig);
}

export function deactivate(): void {
  // La limpieza se hace via el comando "desinstalar"
}
