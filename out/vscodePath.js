"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const base = path.dirname(require.main.filename);
const cssPath = path.join(base, 'vs', 'workbench', 'workbench.main.css');
const jsPath = path.join(base, 'vs', 'workbench', 'workbench.main.js');
const cssPathBK = path.join(base, 'vs', 'workbench', 'workbench.main.css.backup');
const jsPathBK = path.join(base, 'vs', 'workbench', 'workbench.main.js.backup');
exports.default = {
    cssPath,
    jsPath,
    cssPathBK,
    jsPathBK,
};