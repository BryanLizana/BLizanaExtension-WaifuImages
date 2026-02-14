// tipos.ts - Interfaces y tipos para Waifu Tab Images

/** Representa una imagen convertida a base64 lista para inyección */
export interface IImagenBase64 {
  nombreArchivo: string;
  uriDatos: string;
  tipoMime: string;
}

/** SRP: Solo escanea y provee imágenes (DIP: abstracción) */
export interface IProveedorImagenes {
  escanearImagenes(): Promise<IImagenBase64[]>;
  obtenerImagenPorNombre(nombre: string): IImagenBase64 | undefined;
  obtenerImagenAleatoria(): IImagenBase64 | undefined;
  obtenerTodasLasImagenes(): IImagenBase64[];
}

/** SRP: Solo mapea tabs a imágenes */
export interface IAsignadorImagenTab {
  obtenerImagenParaTab(idTab: string): IImagenBase64;
  limpiarTab(idTab: string): void;
  limpiarTodo(): void;
  obtenerMapeoActual(): Map<string, IImagenBase64>;
}

/** SRP: Solo genera contenido CSS/JS para inyección */
export interface IGeneradorCss {
  generarScriptInyeccion(imagenes: IImagenBase64[], configuracion: IConfiguracionWaifu): string;
  generarEstiloBase(configuracion: IConfiguracionWaifu): string;
}

/** SRP: Solo opera sobre el archivo workbench (parchear/restaurar) */
export interface IInyectorEstilo {
  estaInstalado(): Promise<boolean>;
  instalar(contenidoScript: string): Promise<boolean>;
  desinstalar(): Promise<boolean>;
  obtenerRutaArchivoJs(): string;
}

/** SRP: Solo detecta rutas de la instalación de VS Code */
export interface IBuscadorRutaVscode {
  obtenerRutaBase(): string;
  obtenerRutaArchivoJs(): string;
  esEscritorio(): boolean;
}

/** Forma de los datos de configuración del usuario */
export interface IConfiguracionWaifu {
  habilitado: boolean;
  opacidad: number;
  tamano: number;
  rutaCarpetaImagenes: string;
}

/** Estado del parche en el archivo workbench JS */
export enum EEstadoParche {
  SinModificar = 'SinModificar',
  VersionAnterior = 'VersionAnterior',
  VersionActual = 'VersionActual',
}
