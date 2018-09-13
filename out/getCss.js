"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

function default_1(arr) {
    let StringCss = " ";
    let vars = ["x","a","d","k","p","c","s","f","l","me","x1","x2","x3","x4","x5"];
    for (let index = 0; index < arr.length; index++) {
        let textImg = arr[index];
        let vardi =  vars[index];
        StringCss += ` .editor-${vardi}-Lizana:nth-child(2)::after{background-image: url('${textImg}');content:'';pointer-events:none;position:absolute;z-index:99999;width:100%;height:100%;background-position:100% 100%;background-repeat:no-repeat;opacity:1;;}`;
    }

    let content = `
    /*background-start*/
      ${StringCss} 
    /*background-end*/
    `;
    return content;
}
exports.default = default_1;