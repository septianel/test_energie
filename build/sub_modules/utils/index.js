"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = exports.parseRequest = exports.parseQuerys = exports.replaceAll = exports.isNull = exports.isDate = exports.toBoolean = exports.isBoolean = exports.toString = exports.isString = exports.rangeNumber = exports.toNumber = exports.isNumberOrNull = exports.isNumber = exports.Try = exports.SQLClean = exports.SQLValue = exports.SQLObject = exports.SQLIn = exports.SQLSearch = exports.SQLString = void 0;
const object_1 = require("./helpers/object");
const time_1 = __importDefault(require("./helpers/time"));
function SQLString(text) {
    return `'` + text + `'`;
}
exports.SQLString = SQLString;
function SQLSearch(text) {
    return `'%` + text + `%'`;
}
exports.SQLSearch = SQLSearch;
function SQLIn(values) {
    return '(' + ((0, object_1.isArray)(values) ? values.map((i) => SQLValue(i)) : SQLValue(values)) + ')';
}
exports.SQLIn = SQLIn;
function SQLObject(text) {
    return '"' + text + '"';
}
exports.SQLObject = SQLObject;
function SQLValue(text) {
    return (text instanceof Date) ? SQLString(time_1.default.getCurrentYMD(text)) + '::TIMESTAMPTZ' : text === null ? 'NULL' : text === undefined ? 'NULL' : isNumber(text) ? text : isBoolean(text) ? text : SQLString(text);
}
exports.SQLValue = SQLValue;
function SQLClean(string) {
    return string.replace(/[\n|\r|\t]+/g, ' ').replace(/\s\s+/g, ' ').replace(/ ,/g, ',').replace(/, /g, ',').replace(/,  /g, ',').replace(/[;;]+/g, ';');
}
exports.SQLClean = SQLClean;
function Try(func, catch_value) {
    try {
        return func();
    }
    catch (_a) {
        return catch_value;
    }
}
exports.Try = Try;
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
exports.isNumber = isNumber;
function isNumberOrNull(value) {
    if (isNumber(value) || isNull(value)) {
        return true;
    }
    return false;
}
exports.isNumberOrNull = isNumberOrNull;
function toNumber(value) {
    return parseInt(value, 10);
}
exports.toNumber = toNumber;
function rangeNumber(value, start, end) {
    return value >= start && value <= end;
}
exports.rangeNumber = rangeNumber;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function toString(value) {
    return value + '';
}
exports.toString = toString;
function isBoolean(value) {
    return value === true || value === false ? true : false;
}
exports.isBoolean = isBoolean;
function toBoolean(value) {
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    if (value === 1)
        return true;
    if (value === 0)
        return false;
    throw new Error(`toBoolean(): cannot convert value to boolean`);
}
exports.toBoolean = toBoolean;
function isDate(value) {
    return value instanceof Date;
}
exports.isDate = isDate;
function isNull(value) {
    return value === null || value === undefined;
}
exports.isNull = isNull;
function replaceAll(string, old_value, new_value) {
    return string.replace(new RegExp(old_value, 'g'), new_value);
}
exports.replaceAll = replaceAll;
function _parseQuery(value, type) {
    switch (type) {
        case 'NUMBER': {
            return isNull(value) ? undefined : toNumber(value);
        }
        case 'STRING': {
            return isNull(value) ? undefined : value;
        }
        case 'BOOL': {
            return isNull(value) ? undefined : value === 'true' ? true : value === 'false' ? false : value;
        }
        case 'DATE': {
            return isNull(value) ? undefined : time_1.default.momentz(value).toDate();
        }
        case 'OBJECT': {
            return isNull(value) ? undefined : value;
        }
        case 'ARRAY': {
            return isNull(value) ? undefined : isString(value) ? value.split(',') : value;
        }
        case 'ENUM': {
            return isNull(value) ? undefined : value;
        }
        case 'ANY': {
            return isNull(value) ? undefined : value;
        }
        default: {
            throw new Error('Query type not valid!');
        }
    }
}
function parseQuerys(req, _object) {
    return (0, object_1.trimObject)(Object.keys(_object).reduce((init, key) => {
        return Object.assign(Object.assign({}, init), { [key]: _parseQuery(req.query[key], _object[key]) });
    }, {}));
}
exports.parseQuerys = parseQuerys;
function parseRequest(req, _object) {
    return (0, object_1.trimObject)(Object.keys(_object).reduce((init, key) => {
        return Object.assign(Object.assign({}, init), { [key]: _parseQuery(req[key], _object[key]) });
    }, {}));
}
exports.parseRequest = parseRequest;
function parseBody(req, _object) {
    return (0, object_1.trimObject)(Object.keys(_object).reduce((init, key) => {
        return Object.assign(Object.assign({}, init), { [key]: req.body[key] });
    }, {}));
}
exports.parseBody = parseBody;
