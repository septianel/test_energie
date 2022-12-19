"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainRecordModel = void 0;
const _base_1 = __importDefault(require("./_base"));
class PlainRecordModel extends _base_1.default {
    get columns() {
        return this.constructor.columns;
    }
    update(object) {
        Object.keys(object).forEach(key => {
            if (object[key] !== undefined) {
                this[key] = object[key];
            }
        });
        return this;
    }
}
exports.PlainRecordModel = PlainRecordModel;
PlainRecordModel.columns = [];
exports.default = PlainRecordModel;
