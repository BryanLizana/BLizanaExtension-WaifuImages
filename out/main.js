"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode = require("vscode");
const vscodePath_1 = require("./vscodePath");
const getCss = require("./getCss");
const getJs = require("./getJS");
const vsHelp_1 = require("./vsHelp");

class BLizanaExtension {

    backup(){
        let contentJS = this.getJsContent();
        let contentCss = this.getCssContent();
        let permitr = (!~contentJS.indexOf(`/*MyWaifuList`));

        if (permitr) {

            // Empty File, antes
            fs.writeFileSync(vscodePath_1.default.cssPath + ".backup", contentCss, 'utf-8');
            fs.writeFileSync(vscodePath_1.default.jsPath + ".backup", contentJS, 'utf-8');

            vscode.window.showInformationMessage('Backup Ok¡') 

        }
    }
    
    getCssContent() {
        return fs.readFileSync(vscodePath_1.default.cssPath, 'utf-8');
    }

    getJsContent() {
        return fs.readFileSync(vscodePath_1.default.jsPath, 'utf-8');
    }
       
    uninstall() {
        try {
             // MV file BK
            let contentJs = fs.readFileSync(vscodePath_1.default.jsPathBK, 'utf-8');
            let contentCss = fs.readFileSync(vscodePath_1.default.cssPathBK, 'utf-8');

            fs.writeFileSync(vscodePath_1.default.jsPath, contentJs, 'utf-8');
            fs.writeFileSync(vscodePath_1.default.cssPath, contentCss, 'utf-8');

             return true;
        }
        catch (ex) {
            // console.log(ex);
            return false;
        }
    }

    install() {

        if ( fs.existsSync(vscodePath_1.default.cssPath + ".backup") && fs.existsSync(vscodePath_1.default.jsPath + ".backup") ) {
            this.uninstall(); //clear
            let config = vscode.workspace.getConfiguration('MyWaifuList');                 
            let arr = []; 
            let FolderImages = config.packWaifu;

            if (FolderImages == "default" || FolderImages === undefined) {
                 // I not can replace "\" for "/" , why¡¡¡ :/
                FolderImages = __dirname + '/images/';

                FolderImages = escape(FolderImages)
                
                FolderImages = FolderImages.replace("%3A%5C",":/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                FolderImages = FolderImages.replace("%5C","/"); 
                // FolderImages = FolderImages.replace("\\","/"); 
                // C%3A%5CUsers%5CBLizana%5C.vscode%5Cextensions%5Cbl-extension%5Cout%5Cimages%5C
                console.log(FolderImages);                
            }

                if (fs.existsSync(FolderImages)) {
                    fs.readdirSync(FolderImages).forEach(file => {
                        if ( file.indexOf(".jpg") > 0 || file.indexOf(".gif")  > 0 || file.indexOf(".png")  > 0) { //Only Images
                            arr.push(FolderImages + file);
                            // console.log(file);
                        }
                    });
                }
              
                if (arr.length > 0) {

                    // vscode.window.showInformationMessage('Run¡');  
                    let codeJsToAdd = '';
                    try {
                        let contentJS = this.getJsContent();
                        if (contentJS.search('"monaco-scrollable-element "+') != -1) {
                            codeJsToAdd = getJs.default(arr).replace(/\s*$/, ''); //código que irá en la parte superior, las variables a usar          
                            contentJS = contentJS.replace('"monaco-scrollable-element "+','"monaco-scrollable-element " + name_editor_one[Math.floor(Math.random()*name_editor_one.length)] +" " +');
                            codeJsToAdd += contentJS; 
                            fs.writeFileSync(vscodePath_1.default.jsPath, codeJsToAdd, 'utf-8');
                            /*document.createElement("div"),r._domNode.className="monaco-scrollable-element " + name_editor_one[Math.floor(Math.random()*name_editor_one.length)] +" " + r._options.className*/                       
                        }else{
                            vscode.window.showInformationMessage(':( no se puede agregar a las waifus¡¡¡') 
                        }
    
                    } catch (error) {
                        vscode.window.showInformationMessage('Error to get text') 
                        console.log(error);
                    }
                  
                    try {
                        if(codeJsToAdd != ''){

                            let codeCssToAdd = getCss.default(arr).replace(/\s*$/, '');
                            let ContentCss = this.getCssContent();
                    
                            ContentCss += codeCssToAdd;
                            fs.writeFileSync(vscodePath_1.default.cssPath, ContentCss, 'utf-8');
                            vsHelp_1.default.showInfoRestart('Please restart!');
                        }
                        
                    } catch (error) {
                       vscode.window.showInformationMessage('No write, please try on mode admin'); 
                       console.log(error);                       
                    }
                      }else{
                    vscode.window.showInformationMessage('The folder is empty o not found. No Waifus¡¡ :(');
                } 

        // });  // end promise

        }else{
            vscode.window.showInformationMessage('Not created files backup, try in admin mode, please');
        }
    }
    

}
exports.default = new BLizanaExtension();