"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

function default_1(arr) {
    let StringCss = " ";
    let vars = ["x","a","d","k","p","c","s","f","l","me","x1","x2","x3","x4","x5"];
    for (let index = 0; index < arr.length; index++) {
        let vardi =  vars[index];
        StringCss +=` ' editor-${vardi}-Lizana', `;
    }

    let content = `
    /*background-start*/

    /*
    document.createElement("div"),r._domNode.className="monaco-scrollable-element " + name_editor_one[Math.floor(Math.random()*name_editor_one.length)] +" " + r._options.className
    */
    /* 

    var name_editor_one = Array( ${StringCss}  'Test-end' );

    */
    
    /*background-end*/

    `;
    return content;
}
exports.default = default_1;