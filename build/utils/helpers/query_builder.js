"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    select(record, fromAs, prefixFromAs = false, withDoubleQuote = false) {
        let prefix = record['table']['name'];
        if (prefixFromAs) {
            prefix = fromAs;
        }
        if (withDoubleQuote) {
            fromAs = '"' + fromAs + '"';
        }
        return record['columns'].map(column => {
            return `${fromAs}."${column}" "${prefix}_${column}"`;
        }).join(', ');
    },
};
