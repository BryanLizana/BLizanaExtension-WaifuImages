'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const main = require("./main");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.myWaifu', () => {
        vscode.window.showInformationMessage('Init BLizanaExtensión');
    });
   
    context.subscriptions.push(main.default.backup());    
    context.subscriptions.push(main.default.install());
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    // main.default.uninstall()
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map