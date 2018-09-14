'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const main = require("./main");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let disposable = vscode.commands.registerCommand('extension.myWaifu', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // main.default.install();
        vscode.window.showInformationMessage('Init BLizanaExtensión');
    });
   
    context.subscriptions.push(main.default.backup());    
    context.subscriptions.push(main.default.install());
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map