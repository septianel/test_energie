"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/helpers/logger"));
class BaseModel {
    static get log() {
        if (!this.__log) {
            this.__log = logger_1.default.create(this.__type, 'log', this.__displayName || this.name);
        }
        return this.__log;
    }
    static get warn() {
        if (!this.__warn) {
            this.__warn = logger_1.default.create('error', 'warn', this.__displayName || this.name);
        }
        return this.__warn;
    }
    constructor(autobinds = []) {
        autobinds.forEach(m => {
            this[m] = this[m].bind(this);
        });
        return this;
    }
    get __displayName() {
        return this.constructor.__displayName || this.constructor.name;
    }
    get __type() {
        return this.constructor.__type;
    }
    get log() {
        return this.constructor.log;
    }
    get warn() {
        return this.constructor.warn;
    }
}
exports.default = BaseModel;
