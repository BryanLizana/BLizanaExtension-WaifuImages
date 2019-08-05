'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const main = require("./main");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    let command_init = 'MyWaifuList.init';
    let command_desactive = 'MyWaifuList.bye';

    let commandHandler = () => {
        main.default.backup();
        main.default.install();
    }

    let commandHandler_uninstall = () => {
        main.default.uninstall();
    }
    context.subscriptions.push(vscode.commands.registerCommand(command_init, commandHandler));
    context.subscriptions.push(vscode.commands.registerCommand(command_desactive, commandHandler_uninstall));

}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    // main.default.uninstall();  //esto se activa cada ves que se cierra vcode

}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map