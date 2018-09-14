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

        if (fs.existsSync(vscodePath_1.default.cssPath + ".backup") && fs.existsSync(vscodePath_1.default.jsPath + ".backup") ) {
            
            this.uninstall(); 

            let config = vscode.workspace.getConfiguration('blizana');                 
            let arr = []; 
            let FolderImages = config.FolderImages;
            if (FolderImages === undefined) {
                vscode.window.showInformationMessage('Please add url of folder : "blizana.FolderImages": "C:/folders/packs/images_waifu/"!');
            }else{
                fs.readdirSync(FolderImages).forEach(file => {
                    if ( file.indexOf(".jpg") > 0 || file.indexOf(".gif")  > 0 || file.indexOf(".png")  > 0) { //Only Images
                        arr.push(config.FolderImages + file);
                        console.log(file);
                    }
                });

                if (arr.length > 0) {
                    let codeJsToAdd = getJs.default(arr).replace(/\s*$/, '');         
                    let contentJS = this.getJsContent();
                    // contentJS = this.clearJsContent(contentJS);
                    codeJsToAdd += contentJS;
                    
                    let permitr = !~contentJS.indexOf(`/*background`);
                    if (permitr) {
                        fs.writeFileSync(vscodePath_1.default.jsPath, codeJsToAdd, 'utf-8');
                    }
            
                    let codeCssToAdd = getCss.default(arr).replace(/\s*$/, '');
                    let ContentCss = this.getCssContent();
                    ContentCss = this.clearCssContent(ContentCss);
            
                    permitr = !~ContentCss.indexOf(`/*background`);
                    if (permitr) {
                        ContentCss += codeCssToAdd;
                        fs.writeFileSync(vscodePath_1.default.cssPath, ContentCss, 'utf-8');
                    }        
                    vsHelp_1.default.showInfoRestart('Please restart!');
                }else{
                    vscode.window.showInformationMessage('The folder is empty. No Waifus¡¡ :(');
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

            contentJs = this.clearJsContent(contentJs);
            contentCss = this.clearCssContent(contentCss);

            fs.writeFileSync(vscodePath_1.default.jsPath, contentJs, 'utf-8');
            fs.writeFileSync(vscodePath_1.default.cssPath, contentCss, 'utf-8');

            return true;
        }
        catch (ex) {
            console.log(ex);
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
                console.log('Backup CSS Ok¡');
            });

            fs.appendFile(vscodePath_1.default.jsPath + ".backup", contentJS,'utf-8', function (err) {
                if (err) throw err;
                console.log('Backup JS Ok¡');
            });
        }
    }

    clearCssContent(content) {
        content = content.replace(/\/\*background-start\*\/[\s\S]*?\/\*background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }

    clearJsContent(content) {
        content = content.replace(/\/\*background-start\*\/[\s\S]*?\/\*background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }   
    
}
exports.default = new BLizanaExtension();
//# sourceMappingURL=background.js.map