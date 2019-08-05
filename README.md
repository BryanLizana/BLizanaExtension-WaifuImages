# BL-Extension README

Extensión personal para agregar varias imágenes de fondo a partir de una carpeta.

Esta extensión está inspirada (y copiada en gran parte xd, ok no. )  de : https://github.com/shalldie/vscode-background

## Requirements

* VSCode versión usuario.
* Hacer un Backup de Microsoft VS Code/resources/app/out/vs/workbench/workbench.main.js 
* Hacer un Backup de Microsoft VS Code/resources/app/out/vs/workbench/workbench.main.css

## Configuración
* Abrir VSCode en modo admin

* Agregar en tu configuración
```
 "MyWaifuList.packWaifu": "C:/folders/packs/waifu_images_full/",

 or

  "MyWaifuList.packWaifu": "default",
```
* Presionar F1 y buscar la opción
```
 I wish my waifu was real¡¡
```

* Reiniciar VSCode
 > Si hay problemas de permisos, iniciar VSCode como administrador
 
 > En caso falle la extensión...para eso te dije que hagas un backup, no? (Sorry si pasa eso :/ ) la extensión crea unos archivos de respaldo workbench/workbench.main.js.backup y workbench/workbench.main.css.backup, sólo hay que buscarlos y reemplazar a los files dañados (Y si falla el respaldo... * El sujeto huye.. *).

* Para desinstalar, presionar F1 y buscar
```
 Bye bye Waifu :c
```
> Hacer esto para desinstalar porque de la manera normal los cambios en el css no se borran, una ves se restablece el css se puede borrar la extensión

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Init
