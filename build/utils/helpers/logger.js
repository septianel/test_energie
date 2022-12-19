"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = __importDefault(require("utils/constants/default"));
const lodash_1 = require("lodash");
const COLORS = {
    manager: '\x1b[1m\x1b[38;5;63m',
    record: '\x1b[1m\x1b[38;5;116m',
    repository: '\x1b[1m\x1b[38;5;186m',
    server: '\x1b[1m\x1b[38;5;155m',
    error: '\x1b[1m\x1b[38;5;173m',
    logger: '\x1b[1m\x1b[38;5;244m',
};
const VALID_TYPE = Object.keys(COLORS);
const NOOP = () => undefined;
let CHARACTER = ':';
let LEFT_PAD = 2;
let MAX_LENGTH = 13;
exports.default = {
    setType(type, color) {
        COLORS[type] = color;
        if (VALID_TYPE.indexOf(type) === -1) {
            VALID_TYPE.push(type);
        }
        return this;
    },
    removeType(type) {
        COLORS[type] = undefined;
        delete COLORS[type];
        if (VALID_TYPE.indexOf(type) > -1) {
            VALID_TYPE.splice(VALID_TYPE.indexOf(type), 1);
        }
        return this;
    },
    setCharacter(char) {
        CHARACTER = char;
        return this;
    },
    setLeftPad(number) {
        LEFT_PAD = number;
        return this;
    },
    setMaxLength(number) {
        MAX_LENGTH = number;
        return this;
    },
    getBase(stringBefore) {
        let _base = '';
        for (let i = 0; i < stringBefore; i++) {
            _base += CHARACTER;
        }
        return _base;
    },
    colonize(string) {
        if (typeof string !== 'string') {
            return 'Failed to colonize :' + string;
        }
        return (0, lodash_1.padEnd)(`${this.getBase(LEFT_PAD)}${string.substr(0, MAX_LENGTH - LEFT_PAD - 1)}`, MAX_LENGTH, CHARACTER);
    },
    log(...arg) {
        if (default_1.default.DEBUG) {
            const args = Array.from(arguments);
            const type = args.length > 1 && VALID_TYPE.indexOf(args[args.length - 1]) >= 0 && args.pop() || 'logger';
            switch (type) {
                case 'error':
                    console.warn(...args);
                    break;
                default:
                    const _type = VALID_TYPE.indexOf(type) > -1 ? type : 'logger';
                    console.log(COLORS[_type], this.colonize(_type), '\x1b[0m\x1b[22m', ...args);
                    break;
            }
        }
    },
    create(type, method = 'log', moduleName) {
        if (default_1.default.DEBUG) {
            const _type = VALID_TYPE.indexOf(type) > -1 ? type : 'logger';
            return console[method].bind(console, COLORS[_type], this.colonize(moduleName || _type), '\x1b[0m\x1b[22m');
        }
        else {
            return NOOP;
        }
    },
};
