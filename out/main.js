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

        let config = vscode.workspace.getConfiguration('blizana'); 
               
        let arr = []; 
        let FolderImages = config.FolderImages;
        if (FolderImages === undefined) {
            vscode.window.showInformationMessage('Please add url of folder : "blizana.FolderImages": "C:/folders/packs/images_waifu/"!');
        }else{
            fs.readdirSync(FolderImages).forEach(file => {
                arr.push(config.FolderImages + file);
            });
    
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
        }
        

    }
    
    uninstall() {
        try {
            let content = this.getCssContent();
            // content = this.clearCssContent(content);
            this.saveCssContent(content);
            return true;
        }
        catch (ex) {
            console.log(ex);
            return false;
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