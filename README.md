# BL-Extension README

Extensión personal para agregar varias imágenes de fondo a partir de una carpeta.

Esta extensión está inspirada (y copiada en gran parte xd, ok no. )  de : https://github.com/shalldie/vscode-background

## Requirements

* VSCode versión usuario.
* Hacer un Backup de Microsoft VS Code/resources/app/out/vs/workbench/workbench.main.js
* Hacer un Backup de Microsoft VS Code/resources/app/out/vs/workbench/workbench.main.css

## Configuración
*Abrir VSCode en modo admin

* Agregar en tu configuración
```
 "blizana.FolderImages": "C:/folders/packs/waifu_images_full/",

 or

  "blizana.FolderImages": "default",
```
* Presionar F1 y buscar la opción
```
 My Waifu is real¡¡
```

* Reiniciar VSCode
 > Si hay problemas de permisos, iniciar VSCode como administrador
 
 > En caso falle la extensión...para eso te dije que hagas un backup, no? (Sorry si pasa eso :/ ) la extensión crea unos archivos de respaldo workbench/workbench.main.js.backup y workbench/workbench.main.css.backup, sólo hay que buscarlos y reemplazar a los files dañados.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Init
