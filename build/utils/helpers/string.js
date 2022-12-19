"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluralize = exports.splitCamel = void 0;
function splitCamel(string) {
    return string && string.split(/(?<=[a-z])(?=[A-Z])/) || [];
}
exports.splitCamel = splitCamel;
function pluralize(num, word = 'ITEM', emptyString = '', plural = 'S') {
    return emptyString && !num ? emptyString : `${num} ${word}${num > 1 ? plural : ''}`;
}
exports.pluralize = pluralize;
exports.default = {
    splitCamel,
    pluralize,
};
