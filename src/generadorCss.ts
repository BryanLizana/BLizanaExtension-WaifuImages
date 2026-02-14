// generadorCss.ts - Genera el script JS/CSS que se inyecta en el workbench

import { IGeneradorCss, IImagenBase64, IConfiguracionWaifu } from './tipos';
import { VERSION, TRADUCCIONES_ADVERTENCIA_CORRUPCION } from './constantes';

export class GeneradorCss implements IGeneradorCss {
  /** Genera el CSS base para el overlay de la imagen */
  generarEstiloBase(configuracion: IConfiguracionWaifu): string {
    return `
      .waifu-tab-overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        width: ${configuracion.tamano}px;
        height: ${configuracion.tamano}px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: bottom right;
        opacity: ${configuracion.opacidad};
        pointer-events: none;
        z-index: 10;
        transition: opacity 0.3s ease-in-out;
      }
    `;
  }

  /**
   * Genera el script IIFE completo que se inyecta en workbench.desktop.main.js.
   *
   * El script inyectado:
   * 1. Inyecta <style> ocultando la notificación "[Unsupported]"
   * 2. Inyecta CSS para posicionar el overlay
   * 3. Usa MutationObserver para detectar nuevos editores
   * 4. Aplica overlays <div> con background-image aleatorio
   * 5. Mantiene un mapa interno editorId -> imageUri
   */
  generarScriptInyeccion(
    imagenes: IImagenBase64[],
    configuracion: IConfiguracionWaifu
  ): string {
    const listaUriDatos = JSON.stringify(imagenes.map((img) => img.uriDatos));
    const estiloBase = this.generarEstiloBase(configuracion);
    const cssOcultarAdvertencia = this.generarCssOcultarAdvertencia();

    return `;(function() {
  'use strict';

  var WAIFU_VERSION = '${VERSION}';
  var imagenesDisponibles = ${listaUriDatos};
  var mapeoEditorImagen = {};
  var contadorAsignacion = 0;

  function inyectarEstilos() {
    var estilo = document.createElement('style');
    estilo.id = 'waifu-tab-images-estilo';
    estilo.textContent = ${JSON.stringify(cssOcultarAdvertencia + '\n' + estiloBase)};
    document.head.appendChild(estilo);
  }

  function obtenerImagenParaEditor(idGrupo) {
    if (mapeoEditorImagen[idGrupo]) {
      return mapeoEditorImagen[idGrupo];
    }
    if (imagenesDisponibles.length === 0) { return null; }
    var indice = (contadorAsignacion + Math.floor(Math.random() * imagenesDisponibles.length)) % imagenesDisponibles.length;
    contadorAsignacion++;
    mapeoEditorImagen[idGrupo] = imagenesDisponibles[indice];
    return mapeoEditorImagen[idGrupo];
  }

  function aplicarOverlayAEditor(contenedorEditor) {
    if (!contenedorEditor || contenedorEditor.querySelector('.waifu-tab-overlay')) {
      return;
    }

    var idGrupo = contenedorEditor.getAttribute('data-waifu-id');
    if (!idGrupo) {
      idGrupo = 'waifu-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      contenedorEditor.setAttribute('data-waifu-id', idGrupo);
    }

    var uriImagen = obtenerImagenParaEditor(idGrupo);
    if (!uriImagen) { return; }

    var elementoOverlay = document.createElement('div');
    elementoOverlay.className = 'waifu-tab-overlay';
    elementoOverlay.style.backgroundImage = 'url(' + uriImagen + ')';

    var estiloComputado = window.getComputedStyle(contenedorEditor);
    if (estiloComputado.position === 'static') {
      contenedorEditor.style.position = 'relative';
    }

    contenedorEditor.appendChild(elementoOverlay);
  }

  function escanearYAplicar() {
    var contenedores = document.querySelectorAll('.editor-container .overflow-guard');
    contenedores.forEach(function(contenedor) {
      aplicarOverlayAEditor(contenedor);
    });
  }

  function iniciarObservador() {
    var temporizadorDebounce = null;
    var observador = new MutationObserver(function(mutaciones) {
      var necesitaEscaneo = false;
      for (var i = 0; i < mutaciones.length; i++) {
        if (mutaciones[i].addedNodes.length > 0) {
          necesitaEscaneo = true;
          break;
        }
      }
      if (necesitaEscaneo) {
        if (temporizadorDebounce) { clearTimeout(temporizadorDebounce); }
        temporizadorDebounce = setTimeout(escanearYAplicar, 150);
      }
    });

    var contenedorWorkbench = document.getElementById('workbench.parts.editor');
    if (contenedorWorkbench) {
      observador.observe(contenedorWorkbench, {
        childList: true,
        subtree: true
      });
    }
  }

  function inicializar() {
    if (imagenesDisponibles.length === 0) {
      console.warn('[waifu-tab-images] No hay imagenes disponibles');
      return;
    }
    inyectarEstilos();
    setTimeout(function() {
      escanearYAplicar();
      iniciarObservador();
    }, 2000);
  }

  if (document.readyState === 'complete') {
    setTimeout(inicializar, 1000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(inicializar, 1000);
    });
  }
})();`;
  }

  /** Genera CSS para ocultar la notificación de corrupción "[Unsupported]" */
  private generarCssOcultarAdvertencia(): string {
    const selectores = TRADUCCIONES_ADVERTENCIA_CORRUPCION.map(
      (traduccion) =>
        `.notification-toast-container:has([aria-label*="${traduccion}"]) { display: none !important; }`
    );

    const ocultarBadgeTitulo = `.window-title .badge { display: none !important; }`;

    return selectores.join('\n') + '\n' + ocultarBadgeTitulo;
  }
}
