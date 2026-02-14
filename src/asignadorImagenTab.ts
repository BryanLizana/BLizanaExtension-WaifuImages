// asignadorImagenTab.ts - Mapeo de tabs a imágenes aleatorias

import { IAsignadorImagenTab, IImagenBase64, IProveedorImagenes } from './tipos';

export class AsignadorImagenTab implements IAsignadorImagenTab {
  private mapeoTabImagen: Map<string, IImagenBase64> = new Map();
  private proveedorImagenes: IProveedorImagenes;

  constructor(proveedorImagenes: IProveedorImagenes) {
    this.proveedorImagenes = proveedorImagenes;
  }

  /**
   * Retorna la imagen asignada a un tab.
   * Si el tab no tiene asignación, selecciona una aleatoriamente y la persiste.
   */
  obtenerImagenParaTab(idTab: string): IImagenBase64 {
    const imagenExistente = this.mapeoTabImagen.get(idTab);
    if (imagenExistente) {
      return imagenExistente;
    }

    const imagenNueva = this.proveedorImagenes.obtenerImagenAleatoria();
    if (!imagenNueva) {
      throw new Error('[waifu-tab-images] No hay imágenes disponibles para asignar');
    }

    this.mapeoTabImagen.set(idTab, imagenNueva);
    return imagenNueva;
  }

  limpiarTab(idTab: string): void {
    this.mapeoTabImagen.delete(idTab);
  }

  limpiarTodo(): void {
    this.mapeoTabImagen.clear();
  }

  obtenerMapeoActual(): Map<string, IImagenBase64> {
    return new Map(this.mapeoTabImagen);
  }
}
