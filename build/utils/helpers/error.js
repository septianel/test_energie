"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ERROR {
    constructor() {
        this.error_list = [];
    }
    CODE(code) {
        if (this.error_list.some(i => i === code)) {
            throw new Error(`ERR.CODE (${code}) is duplicate!`);
        }
        this.error_list = [...this.error_list, code];
        return code;
    }
}
exports.default = ERROR;
