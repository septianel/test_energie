"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = __importDefault(require("./function"));
const queries = [];
exports.default = {
    createIndexing() {
        return queries.map(q => {
            if (q.columns.length > 0) {
                const drop = `DROP INDEX IF EXISTS "${q.schema}"."indexing_${q.type === 'UNIQUE' ? 'unique_' : ''}${q.schema}_${q.table}" CASCADE;`;
                const create = `CREATE ${q.type === 'UNIQUE' ? 'UNIQUE' : ''} INDEX indexing_${q.type === 'UNIQUE' ? 'unique_' : ''}${q.schema}_${q.table} ON "${q.schema}"."${q.table}" (${q.columns.map(col => {
                    var _a;
                    if (q.replace_null_on_columns) {
                        const replace_null = (_a = q.replace_null_on_columns.find(i => i[0] === col)) === null || _a === void 0 ? void 0 : _a[1];
                        return replace_null ? `COALESCE("${col}", ${replace_null})` : `"${col}"`;
                    }
                    return `"${col}"`;
                }).join(', ')});`;
                if (q.delete) {
                    return function_1.default.formatSpace(drop);
                }
                else {
                    return function_1.default.formatSpace(drop + create);
                }
            }
            return '';
        });
    },
};
