"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const _Records = __importStar(require("app/records"));
const function_1 = __importDefault(require("./function"));
const object_1 = require("../../sub_modules/utils/helpers/object");
const __Records = Object.values(_Records).map(record => {
    try {
        const instanceRecord = new record.default();
        const schema = record.default['table']['schema'];
        const table = record.default['table']['name'];
        return {
            schema,
            table,
            seeder: instanceRecord['seeder'](),
            depends_on: record.default['depends_on'] ? record.default['depends_on'] : undefined
        };
    }
    catch (e) {
        return null;
    }
});
const Records = __Records.reduce((init, i, n, arr) => {
    if (i) {
        if (i.depends_on) {
            if (!arr.some(_ => ((_ === null || _ === void 0 ? void 0 : _.schema) + '.' + (_ === null || _ === void 0 ? void 0 : _.table)) === i.depends_on)) {
                throw new Error(`depends_on '${i.depends_on}' not found!`);
            }
            const idx = init.findIndex(_ => (_.schema + '.' + _.table) === i.depends_on);
            const copy = init[idx];
            if (copy) {
                init.splice(idx, 1);
            }
            return copy ? [...init, i, copy] : [...init, i];
        }
        return [...init, Object.assign({}, i)];
    }
    return init;
}, []).reverse();
function toDateTimeString(date) {
    return (0, moment_1.default)(date).format('YYYY-MM-DD HH:mm:ss');
}
function SQLString(text) {
    return `'` + replaceAll(text + '', `'`, `''`) + `'`;
}
function SQLObject(text) {
    return '"' + text + '"';
}
function SQLValue(text) {
    return (text instanceof Date) ? SQLString(toDateTimeString(text)) : text === null ? 'null' : text === undefined ? 'null' : (0, object_1.isObject)(text) ? SQLString(JSON.stringify(text)) : SQLString(text);
}
function replaceAll(string, old_value, new_value) {
    return string.replace(new RegExp(old_value, 'g'), new_value);
}
function chunckArray(array, chunkSize) {
    const chunck_array = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunck_array.push(chunk);
    }
    return chunck_array;
}
exports.default = {
    _createSEEDER(schema, table, datas) {
        const values = [...datas.map((_data, i) => {
                const _inserts = Object.values(Object.keys(_data).reduce((init, _key) => {
                    return _key === '_key' ? Object.assign({}, init) : Object.assign(Object.assign({}, init), { [_key]: _data[_key] });
                }, {})).map(val => SQLValue(val));
                return (`(${_inserts})`);
            })].join(',');
        const data = Object.keys(datas[0]).reduce((init, _key) => {
            return _key === '_key' ? Object.assign({}, init) : Object.assign(Object.assign({}, init), { [_key]: datas[0][_key] });
        }, {});
        if (!data) {
            return '';
        }
        const _target = `"${schema}"."${table}"`;
        const _columns = Object.keys(data).map(col => SQLObject(col)).join(', ');
        const _updates = Object.keys(data).map(col => SQLObject(col) + ' = excluded.' + SQLObject(col));
        const Q = `INSERT INTO ${_target} (${_columns})
			VALUES ${values}
			ON CONFLICT (${datas[0]['_key'] ? datas[0]['_key'].map((i) => SQLObject(i)) : SQLObject('id')}) DO UPDATE
			SET ${_updates}
			;`;
        return function_1.default.formatSpace(Q);
    },
    createSEEDER() {
        return Object.values(Records).map(Record => {
            const schema = Record.schema;
            const table = Record.table;
            const datas = chunckArray(Record.seeder, 1000);
            return datas.map(data => this._createSEEDER(schema, table, data));
        });
    },
};
