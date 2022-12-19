"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    formatSpace(string) {
        return string.split('\n').join(' ').split('\r').join(' ').split('\t').join(' ').replace(/\s\s+/g, ' ').split(' ,').join(',').split(',  ').join(', ').split('),(').join('),\n(');
    },
};
