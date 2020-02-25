"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const base = path.dirname(require.main.filename);
const cssPath = path.join(base, 'vs', 'workbench', 'workbench.desktop.main.css');
const jsPath = path.join(base, 'vs', 'workbench', 'workbench.desktop.main.js');
const cssPathBK = path.join(base, 'vs', 'workbench', 'workbench.desktop.main.css.backup');
const jsPathBK = path.join(base, 'vs', 'workbench', 'workbench.desktop.main.js.backup');
exports.default = {
    cssPath,
    jsPath,
    cssPathBK,
    jsPathBK,
};