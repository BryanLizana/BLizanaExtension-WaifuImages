"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode = require("vscode");
const vscodePath_1 = require("./vscodePath");
const getCss = require("./getCss");
const getJs = require("./getJS");
const vsHelp_1 = require("./vsHelp");

class BLizanaExtension {
    constructor() {       
        
    }
    
    getCssContent() {
        return fs.readFileSync(vscodePath_1.default.cssPath, 'utf-8');
    }

    getJsContent() {
        return fs.readFileSync(vscodePath_1.default.jsPath, 'utf-8');
    }
       
    install() {

        // console.log(__dirname);        
        if ( fs.existsSync(vscodePath_1.default.cssPath + ".backup") && fs.existsSync(vscodePath_1.default.jsPath + ".backup") ) {            
            this.uninstall(); //clear
            let config = vscode.workspace.getConfiguration('blizana');                 
            let arr = []; 
            let FolderImages = config.FolderImages;

            if (FolderImages == "default") {

                // I not can replace "\" for "/" , why¡¡¡ :(
                // FolderImages = __dirname + '/images/';
                // // var path = require('path');
                // // FolderImages = path.normalize(FolderImages); 
                // FolderImages = FolderImages.replace(/\/|\\/,"/"); 
                // FolderImages = FolderImages.replace(/\/[*]|\\/,"/"); 
                
                // console.log(FolderImages);

                // Images free ;)
                arr.push("https://lh4.googleusercontent.com/lICLpoJrZdBjIV1PRF1eltJoWCNX8fMO3Vj1YaaU5FR0dKBmMkjcbpY8gvSFIucEoW3NFfDwWXzh5RUXEprP=w924-h627");
                arr.push("https://lh6.googleusercontent.com/84Qq3tWncE-bub-kvkIv8E5nMDNRjywcGED6hc3uBcWAAJrQOUOVrHyHucDugTWHfcI2rZ4H8oehWbM8QcSt=w924-h627");
                arr.push("https://lh4.googleusercontent.com/JiLZHlQZG2OGZvU7uLvqC35vPDRClPrKsRrlu3rMHSK5Ewr_ux1eu2bCffHwQ3DC_oM8hyuv2i_kOuWZGR2C=w924-h627");                
            }


            if (FolderImages === undefined) {
                vscode.window.showInformationMessage('Please add url of folder : "blizana.FolderImages": "C:/folders/packs/waifu_images_full/"!');
            }else{

                if (fs.existsSync(FolderImages)) {
                    fs.readdirSync(FolderImages).forEach(file => {
                        if ( file.indexOf(".jpg") > 0 || file.indexOf(".gif")  > 0 || file.indexOf(".png")  > 0) { //Only Images
                            arr.push(FolderImages + file);
                            // console.log(file);
                        }
                    });
                }
              
                if (arr.length > 0) {
                    let codeJsToAdd = getJs.default(arr).replace(/\s*$/, '');         
                    let contentJS = this.getJsContent();

                    codeJsToAdd += contentJS; 
                    /*document.createElement("div"),r._domNode.className="monaco-scrollable-element " + name_editor_one[Math.floor(Math.random()*name_editor_one.length)] +" " + r._options.className*/       
                    // FIXME: Remplazar el texto por otro
                    fs.writeFileSync(vscodePath_1.default.jsPath, codeJsToAdd, 'utf-8');

                    let codeCssToAdd = getCss.default(arr).replace(/\s*$/, '');
                    let ContentCss = this.getCssContent();
            
                    ContentCss += codeCssToAdd;
                    fs.writeFileSync(vscodePath_1.default.cssPath, ContentCss, 'utf-8');

                    vsHelp_1.default.showInfoRestart('Please restart!');
                }else{
                    vscode.window.showInformationMessage('The folder is empty o not found. No Waifus¡¡ :(');
                } 
            }
        }else{
            vscode.window.showInformationMessage('Not created files backup, try in admin mode, please');
        }
    }
    
    uninstall() {
        try {
            let contentJs = this.getJsContent();
            let contentCss = this.getCssContent();

            contentJs = this.clearContent(contentJs);
            contentCss = this.clearContent(contentCss);

            /*document.createElement("div"),r._domNode.className="monaco-scrollable-element " + name_editor_one[Math.floor(Math.random()*name_editor_one.length)] +" " + r._options.className*/       
            // FIXME: Restablecer al texto original
            fs.writeFileSync(vscodePath_1.default.jsPath, contentJs, 'utf-8');
            fs.writeFileSync(vscodePath_1.default.cssPath, contentCss, 'utf-8');

            return true;
        }
        catch (ex) {
            // console.log(ex);
            return false;
        }
    }  
    
    backup(){
        let contentJS = this.getJsContent();
        let contentCss = this.getCssContent();
        let permitr = !~contentJS.indexOf(`/*background`);

        if (permitr) {
            fs.appendFile(vscodePath_1.default.cssPath + ".backup", contentCss,'utf-8', function (err) {
                if (err) throw err;
                // console.log('Backup CSS Ok¡');
            });

            fs.appendFile(vscodePath_1.default.jsPath + ".backup", contentJS,'utf-8', function (err) {
                if (err) throw err;
                // console.log('Backup JS Ok¡');
            });
        }
    }

    clearContent(content) {
        content = content.replace(/\/\*background-start\*\/[\s\S]*?\/\*background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }
    
}
exports.default = new BLizanaExtension();