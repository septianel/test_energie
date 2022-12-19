"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _DEBUG = false;
exports.default = {
    get DEBUG() {
        return _DEBUG;
    },
    setDebugLevel(level) {
        _DEBUG = level;
    },
};
